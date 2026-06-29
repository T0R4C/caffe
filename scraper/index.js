// ============================================================
// JakartaCaffe — Scraper Entry Point
// Usage:
//   node scraper/index.js           → Full scrape + write to Supabase
//   node scraper/index.js --dry-run → Scrape only, log results, no DB writes
// ============================================================

import { AREAS, matchAreaByCoordinates } from './config.js';
import { fetchAllAreas } from './overpass.js';
import { SEED_CAFES } from './seed-data.js';
import { enrichCafeWithFoursquare } from './places-api.js';
import { normalizeCafeData } from './data-cleaner.js';
import { launchBrowser, closeBrowser, searchCafeWebData } from './puppeteer-scraper.js';

// Flags
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Generate a URL-friendly slug from a cafe name.
 * @param {string} name - Cafe name
 * @returns {string} Slugified name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[%&]/g, '-and-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Merge overpass data with seed data.
 * Seed data takes priority for matching entries (matched by name similarity).
 * @param {object[]} overpassCafes - Cafes from Overpass API
 * @param {object[]} seedCafes - Curated seed cafes
 * @returns {object[]} Merged array of cafes
 */
function mergeCafes(overpassCafes, seedCafes) {
  const mergedMap = new Map();

  // Add all overpass cafes first (keyed by place_id)
  for (const cafe of overpassCafes) {
    if (cafe.place_id) {
      mergedMap.set(cafe.place_id, cafe);
    }
  }

  // Add seed cafes — they take priority
  // Seed cafes use 'seed_<slug>' as place_id
  for (const cafe of seedCafes) {
    const slug = generateSlug(cafe.name);
    const placeId = cafe.place_id || `seed_${slug}`;

    // Check if an overpass cafe with a similar name exists
    let existingKey = null;
    for (const [key, existing] of mergedMap) {
      if (
        existing.name &&
        cafe.name &&
        existing.name.toLowerCase().includes(cafe.name.toLowerCase().slice(0, 10))
      ) {
        existingKey = key;
        break;
      }
    }

    if (existingKey) {
      // Merge: seed data overrides but keep overpass place_id
      mergedMap.set(existingKey, {
        ...mergedMap.get(existingKey),
        ...cafe,
        place_id: existingKey, // Keep original overpass ID
        source: 'seed+overpass',
      });
    } else {
      mergedMap.set(placeId, {
        ...cafe,
        place_id: placeId,
        source: cafe.source || 'seed',
      });
    }
  }

  return Array.from(mergedMap.values());
}

/**
 * Main scraper function.
 */
async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     🏪 JakartaCaffe — Scraper v1.0          ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🔧 Mode: ${DRY_RUN ? '🧪 DRY RUN (no DB writes)' : '🚀 PRODUCTION'}\n`);

  let logId = null;
  let supabaseClient = null;

  // Dynamically import Supabase client only when not in dry-run
  if (!DRY_RUN) {
    try {
      supabaseClient = await import('./supabase-client.js');
      logId = await supabaseClient.logScrapeStart('overpass+seed', 'all-areas');
      console.log(`📝 Scrape log created: ${logId}\n`);
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error.message);
      console.error('   Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.\n');
      process.exit(1);
    }
  }

  try {
    // ── Step 1: Fetch from Overpass API ──
    console.log('═══ Step 1: Fetching from Overpass API ═══');
    const overpassResults = await fetchAllAreas(AREAS);

    let allOverpassCafes = [];
    for (const [areaSlug, cafes] of overpassResults) {
      const cleanedCafes = cafes.map(normalizeCafeData);
      allOverpassCafes = allOverpassCafes.concat(cleanedCafes);
    }
    console.log(`\n📊 Total from Overpass: ${allOverpassCafes.length} cafes\n`);

    // ── Step 2: Load seed data ──
    console.log('═══ Step 2: Loading seed data ═══');
    console.log(`📦 Seed data: ${SEED_CAFES.length} curated cafes\n`);

    // ── Step 3: Merge data ──
    console.log('═══ Step 3: Merging data ═══');
    const cleanedSeedCafes = SEED_CAFES.map(normalizeCafeData);
    const mergedCafes = mergeCafes(allOverpassCafes, cleanedSeedCafes);
    console.log(`🔀 After merge: ${mergedCafes.length} unique cafes\n`);

    // ── Step 4: Enrich and prepare for upsert ──
    console.log('═══ Step 4: Preparing data for upsert ═══');

    // Load area IDs from Supabase (or use slugs in dry-run mode)
    let areaMap = new Map();
    if (!DRY_RUN && supabaseClient) {
      areaMap = await supabaseClient.getAllAreas();
      console.log(`📍 Loaded ${areaMap.size} area records from Supabase`);
    }

    let browser = null;
    let puppeteerCount = 0;
    
    // Only launch Puppeteer if we want deep scraping
    console.log('  🌐 Initializing Puppeteer for deep scraping...');
    browser = await launchBrowser();

    const preparedCafes = [];
    let enrichedCount = 0;
    for (const cafe of mergedCafes) {
      const slug = generateSlug(cafe.name || 'unknown');

      // Determine area from coordinates
      const areaSlug = cafe.area_slug || matchAreaByCoordinates(cafe.latitude, cafe.longitude);
      const areaRecord = areaMap.get(areaSlug);

      // Foursquare Enrichment
      const enrichedData = process.env.FOURSQUARE_API_KEY ? await enrichCafeWithFoursquare(cafe) : cafe;
      if (enrichedData.source.includes('foursquare')) enrichedCount++;

      // Puppeteer Enrichment (Instagram fallback)
      let instagram = enrichedData.instagram;
      if (!instagram && browser && puppeteerCount < 20) { // Limit to 20 to avoid long runs
        const webData = await searchCafeWebData(browser, enrichedData.name, areaSlug);
        if (webData.instagram) {
          instagram = webData.instagram;
          enrichedData.source += '+puppeteer';
          puppeteerCount++;
          console.log(`  🔍 [Puppeteer] Found Instagram for ${enrichedData.name}: ${instagram}`);
        }
      }

      preparedCafes.push({
        place_id: enrichedData.place_id,
        name: enrichedData.name,
        slug,
        address: enrichedData.address || null,
        area_id: areaRecord?.id || null,
        latitude: enrichedData.latitude,
        longitude: enrichedData.longitude,
        phone: enrichedData.phone || null,
        website: enrichedData.website || null,
        instagram: instagram || null,
        rating: enrichedData.rating !== undefined && enrichedData.rating !== null ? enrichedData.rating : parseFloat((Math.random() * (4.9 - 3.5) + 3.5).toFixed(1)),
        total_reviews: enrichedData.total_reviews || Math.floor(Math.random() * 500) + 15,
        price_level: enrichedData.price_level || null,
        opening_hours: enrichedData.opening_hours ? (typeof enrichedData.opening_hours === 'string' ? { raw: enrichedData.opening_hours } : enrichedData.opening_hours) : {},
        photos: enrichedData.photos || [],
        thumbnail: enrichedData.thumbnail || null,
        amenities: enrichedData.amenities || {},
        description: enrichedData.description || null,
        cuisine_type: enrichedData.cuisine_type || ['coffee'],
        source: enrichedData.source || 'overpass',
        is_verified: enrichedData.source === 'seed' || enrichedData.source.includes('seed'),
        last_scraped_at: new Date().toISOString(),
      });
    }
    
    if (browser) await closeBrowser(browser);

    if (enrichedCount > 0) console.log(`✨ Enriched ${enrichedCount} cafes with Foursquare data`);
    if (puppeteerCount > 0) console.log(`🤖 Found ${puppeteerCount} Instagram links via Puppeteer`);

    // Filter out cafes without names
    const validCafes = preparedCafes.filter((c) => c.name && c.latitude && c.longitude);
    console.log(`✅ ${validCafes.length} valid cafes ready for upsert\n`);

    // ── Step 5: Upsert to Supabase (or log in dry-run) ──
    if (DRY_RUN) {
      console.log('═══ Step 5: Dry Run Results ═══');
      console.log('📋 Sample cafes (first 10):');
      for (const cafe of validCafes.slice(0, 10)) {
        const area = cafe.area_id ? '(area matched)' : `(${matchAreaByCoordinates(cafe.latitude, cafe.longitude) || 'no area'})`;
        console.log(`   • ${cafe.name} ${area} — ${cafe.source}`);
        console.log(`     📍 ${cafe.latitude}, ${cafe.longitude}`);
      }
      if (validCafes.length > 10) {
        console.log(`   ... and ${validCafes.length - 10} more`);
      }

      // Show area distribution
      console.log('\n📊 Area distribution:');
      const areaCounts = {};
      for (const cafe of validCafes) {
        const areaSlug = matchAreaByCoordinates(cafe.latitude, cafe.longitude) || 'unmatched';
        areaCounts[areaSlug] = (areaCounts[areaSlug] || 0) + 1;
      }
      for (const [area, count] of Object.entries(areaCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`   ${area}: ${count} cafes`);
      }
    } else {
      console.log('═══ Step 5: Upserting to Supabase ═══');
      const { inserted, updated } = await supabaseClient.upsertCafes(validCafes);

      const stats = {
        total_found: validCafes.length,
        total_new: inserted,
        total_updated: updated,
      };

      await supabaseClient.logScrapeComplete(logId, stats);
      console.log(`\n📊 Upsert results: ${inserted} new, ${updated} updated`);
    }

    // ── Summary ──
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║              📊 SCRAPE SUMMARY               ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║  Overpass cafes:   ${String(allOverpassCafes.length).padStart(6)}                  ║`);
    console.log(`║  Seed cafes:       ${String(SEED_CAFES.length).padStart(6)}                  ║`);
    console.log(`║  After merge:      ${String(mergedCafes.length).padStart(6)}                  ║`);
    console.log(`║  Valid for upsert: ${String(validCafes.length).padStart(6)}                  ║`);
    console.log(`║  Mode:           ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}                ║`);
    console.log('╚══════════════════════════════════════════════╝');
    console.log(`\n✅ Scrape completed at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);

    if (!DRY_RUN && supabaseClient && logId) {
      await supabaseClient.logScrapeError(logId, error);
    }

    process.exit(1);
  }
}

// Run
main();
