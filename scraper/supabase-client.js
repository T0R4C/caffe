// ============================================================
// JakartaCaffe — Supabase Client (Service Role)
// ============================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('   Set them in .env or as environment variables.');
  process.exit(1);
}

/**
 * Supabase client initialized with service_role key.
 * This bypasses RLS for scraper operations.
 */
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Get an area record by its slug.
 * @param {string} slug - Area slug (e.g., 'jakarta-pusat')
 * @returns {Promise<object|null>} Area record or null
 */
export async function getAreaBySlug(slug) {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`❌ Error fetching area '${slug}':`, error.message);
    return null;
  }

  return data;
}

/**
 * Get all areas as a map of slug → area record.
 * @returns {Promise<Map<string, object>>} Map of slug → area
 */
export async function getAllAreas() {
  const { data, error } = await supabase
    .from('areas')
    .select('*');

  if (error) {
    console.error('❌ Error fetching areas:', error.message);
    return new Map();
  }

  const map = new Map();
  for (const area of data) {
    map.set(area.slug, area);
  }
  return map;
}

/**
 * Upsert an array of cafes into the database.
 * Deduplicates on the `place_id` column.
 * @param {object[]} cafes - Array of cafe objects
 * @returns {Promise<{inserted: number, updated: number}>} Counts
 */
export async function upsertCafes(cafes) {
  if (!cafes || cafes.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  // Fetch existing place_ids to differentiate inserts vs updates
  const placeIds = cafes.map((c) => c.place_id).filter(Boolean);
  const { data: existing } = await supabase
    .from('cafes')
    .select('place_id')
    .in('place_id', placeIds);

  const existingSet = new Set((existing || []).map((e) => e.place_id));

  // Upsert in batches of 50 to avoid payload limits
  const BATCH_SIZE = 50;
  let totalInserted = 0;
  let totalUpdated = 0;
  let allUpserted = [];

  for (let i = 0; i < cafes.length; i += BATCH_SIZE) {
    const batch = cafes.slice(i, i + BATCH_SIZE);

    const { data, error } = await supabase
      .from('cafes')
      .upsert(batch, {
        onConflict: 'place_id',
        ignoreDuplicates: false,
      })
      .select('id, place_id, name');

    if (error) {
      console.error(`  ❌ Upsert batch error (rows ${i}-${i + batch.length}):`, error.message);
      continue;
    }
    
    if (data) {
      allUpserted = allUpserted.concat(data);
    }

    // Count inserts vs updates
    for (const row of (data || [])) {
      if (existingSet.has(row.place_id)) {
        totalUpdated++;
      } else {
        totalInserted++;
      }
    }
  }

  return { inserted: totalInserted, updated: totalUpdated, records: allUpserted };
}

/**
 * Create a new scrape log entry marking the start of a scrape run.
 * @param {string} source - Data source (e.g., 'overpass', 'seed')
 * @param {string} [area] - Optional area being scraped
 * @returns {Promise<string|null>} Log entry ID or null on error
 */
export async function logScrapeStart(source, area = null) {
  const { data, error } = await supabase
    .from('scrape_logs')
    .insert({
      source,
      area,
      status: 'running',
    })
    .select('id')
    .single();

  if (error) {
    console.error('❌ Error creating scrape log:', error.message);
    return null;
  }

  return data.id;
}

/**
 * Update scrape log with successful completion stats.
 * @param {string} logId - Scrape log entry ID
 * @param {object} stats - { total_found, total_new, total_updated }
 */
export async function logScrapeComplete(logId, stats) {
  if (!logId) return;

  const { error } = await supabase
    .from('scrape_logs')
    .update({
      status: 'success',
      total_found: stats.total_found || 0,
      total_new: stats.total_new || 0,
      total_updated: stats.total_updated || 0,
      completed_at: new Date().toISOString(),
    })
    .eq('id', logId);

  if (error) {
    console.error('❌ Error updating scrape log:', error.message);
  }
}

/**
 * Update scrape log with error information.
 * @param {string} logId - Scrape log entry ID
 * @param {Error|string} error - Error object or message
 */
export async function logScrapeError(logId, error) {
  if (!logId) return;

  const message = error instanceof Error ? error.message : String(error);

  const { error: dbError } = await supabase
    .from('scrape_logs')
    .update({
      status: 'failed',
      error_message: message,
      completed_at: new Date().toISOString(),
    })
    .eq('id', logId);

  if (dbError) {
    console.error('❌ Error updating scrape log with error:', dbError.message);
  }
}

/**
 * Upsert reviews for a specific cafe.
 */
export async function upsertReviews(cafeId, reviews) {
  if (!reviews || reviews.length === 0) return;
  
  const formatted = reviews.map(r => ({
    cafe_id: cafeId,
    rating: r.rating,
    review_text: r.review_text,
    author_name: r.author_name,
    created_at: r.created_at || new Date().toISOString()
  }));

  const { error } = await supabase
    .from('user_reviews')
    .insert(formatted); // We use insert because we might not have unique identifiers for tips other than the combination of text and cafe, but simple insert is fine for scraping

  if (error) {
    console.error(`  ❌ Error inserting reviews:`, error.message);
  }
}

/**
 * Upsert menus for a specific cafe.
 */
export async function upsertMenus(cafeId, menus) {
  if (!menus || menus.length === 0) return;
  
  const formatted = menus.map(m => ({
    cafe_id: cafeId,
    item_name: m.name,
    description: m.desc,
    price: m.price,
    category: m.category
  }));

  const { error } = await supabase
    .from('cafe_menus')
    .insert(formatted);

  if (error) {
    console.error(`  ❌ Error inserting menus:`, error.message);
  }
}

export default supabase;
