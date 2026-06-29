// ============================================================
// JakartaCaffe — Overpass API Client
// ============================================================

import { OVERPASS_API, RATE_LIMIT } from './config.js';

/**
 * Build an Overpass QL query for cafes/coffee shops within a bounding box.
 * @param {number[]} bbox - [south, west, north, east]
 * @returns {string} Overpass QL query string
 */
function buildQuery(bbox) {
  const [south, west, north, east] = bbox;
  const bboxStr = `${south},${west},${north},${east}`;

  return `
[out:json][timeout:${OVERPASS_API.timeout}];
(
  node["amenity"="cafe"](${bboxStr});
  way["amenity"="cafe"](${bboxStr});
  node["cuisine"~"coffee"](${bboxStr});
  way["cuisine"~"coffee"](${bboxStr});
  node["shop"="coffee"](${bboxStr});
  way["shop"="coffee"](${bboxStr});
);
out center body;
`.trim();
}

/**
 * Normalize a raw Overpass element into a clean cafe object.
 * @param {object} element - Raw element from Overpass API response
 * @returns {object} Normalized cafe data
 */
function normalizeElement(element) {
  const tags = element.tags || {};

  // For ways, coordinates come from the center property
  const lat = element.lat ?? element.center?.lat ?? null;
  const lon = element.lon ?? element.center?.lon ?? null;

  if (!lat || !lon) return null;

  // Build address from available tags
  const addressParts = [
    tags['addr:street'],
    tags['addr:housenumber'],
    tags['addr:suburb'],
    tags['addr:city'],
    tags['addr:postcode'],
  ].filter(Boolean);

  return {
    place_id: `osm_${element.type}_${element.id}`,
    name: tags.name || tags['name:en'] || tags['name:id'] || null,
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    address: addressParts.length > 0 ? addressParts.join(', ') : (tags['addr:full'] || null),
    phone: tags.phone || tags['contact:phone'] || null,
    website: tags.website || tags['contact:website'] || null,
    opening_hours: tags.opening_hours || null,
    instagram: tags['contact:instagram'] || null,
    source: 'overpass',
  };
}

/**
 * Sleep for specified milliseconds.
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch cafe data from Overpass API for a single area.
 * Includes retry logic with exponential backoff.
 * @param {object} area - Area config with name, slug, and bbox
 * @returns {Promise<object[]>} Array of normalized cafe objects
 */
export async function fetchCafesForArea(area) {
  const query = buildQuery(area.bbox);
  let lastError = null;

  for (let attempt = 1; attempt <= OVERPASS_API.maxRetries; attempt++) {
    try {
      console.log(`  ↳ [${area.name}] Attempt ${attempt}/${OVERPASS_API.maxRetries}...`);

      const response = await fetch(OVERPASS_API.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(OVERPASS_API.timeout * 1000 + 10000), // query timeout + 10s buffer
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '30', 10);
        console.warn(`  ⚠ [${area.name}] Rate limited. Waiting ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.elements || !Array.isArray(data.elements)) {
        throw new Error('Invalid response: missing elements array');
      }

      // Normalize and filter out entries without names or coordinates
      const cafes = data.elements
        .map(normalizeElement)
        .filter((cafe) => cafe !== null && cafe.name !== null);

      console.log(`  ✓ [${area.name}] Found ${cafes.length} cafes (from ${data.elements.length} raw elements)`);

      return cafes;
    } catch (error) {
      lastError = error;
      console.error(`  ✗ [${area.name}] Attempt ${attempt} failed: ${error.message}`);

      if (attempt < OVERPASS_API.maxRetries) {
        const backoff = RATE_LIMIT.delayBetweenRetries * Math.pow(2, attempt - 1);
        console.log(`  ↻ [${area.name}] Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
      }
    }
  }

  console.error(`  ✗ [${area.name}] All ${OVERPASS_API.maxRetries} attempts failed.`);
  throw lastError;
}

/**
 * Fetch cafe data from all areas with rate limiting between requests.
 * @param {object[]} areas - Array of area configs
 * @returns {Promise<Map<string, object[]>>} Map of area slug → cafes array
 */
export async function fetchAllAreas(areas) {
  const results = new Map();

  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];
    console.log(`\n📍 Fetching area ${i + 1}/${areas.length}: ${area.name}`);

    try {
      const cafes = await fetchCafesForArea(area);
      results.set(area.slug, cafes);
    } catch (error) {
      console.error(`❌ Skipping ${area.name} due to error: ${error.message}`);
      results.set(area.slug, []);
    }

    // Rate limit between area requests (skip delay after last area)
    if (i < areas.length - 1) {
      console.log(`  ⏳ Waiting ${RATE_LIMIT.delayBetweenRequests / 1000}s before next area...`);
      await sleep(RATE_LIMIT.delayBetweenRequests);
    }
  }

  return results;
}
