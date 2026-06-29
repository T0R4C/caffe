// ============================================================
// JakartaCaffe — Scraper Configuration
// ============================================================

/**
 * DKI Jakarta area definitions with bounding boxes.
 * Bbox format: [south, west, north, east] (lat/lng)
 */
export const AREAS = [
  {
    name: 'Jakarta Pusat',
    slug: 'jakarta-pusat',
    bbox: [-6.21, 106.81, -6.15, 106.87],
  },
  {
    name: 'Jakarta Selatan',
    slug: 'jakarta-selatan',
    bbox: [-6.34, 106.77, -6.22, 106.87],
  },
  {
    name: 'Jakarta Barat',
    slug: 'jakarta-barat',
    bbox: [-6.22, 106.69, -6.12, 106.80],
  },
  {
    name: 'Jakarta Timur',
    slug: 'jakarta-timur',
    bbox: [-6.30, 106.83, -6.16, 106.95],
  },
  {
    name: 'Jakarta Utara',
    slug: 'jakarta-utara',
    bbox: [-6.15, 106.80, -6.08, 106.95],
  },
];

/**
 * Overpass API configuration
 */
export const OVERPASS_API = {
  endpoint: 'https://overpass-api.de/api/interpreter',
  timeout: 60,       // Query timeout in seconds
  maxRetries: 3,     // Max retry attempts per request
  retryDelay: 5000,  // Base delay between retries in ms (exponential backoff applied)
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT = {
  delayBetweenRequests: 3000, // Delay between area queries in ms
  delayBetweenRetries: 5000,  // Base delay between retries in ms
};

/**
 * Determine which area a coordinate falls into based on bounding boxes.
 * Returns the area slug or null if no match found.
 */
export function matchAreaByCoordinates(lat, lng) {
  for (const area of AREAS) {
    const [south, west, north, east] = area.bbox;
    if (lat >= south && lat <= north && lng >= west && lng <= east) {
      return area.slug;
    }
  }
  return null;
}
