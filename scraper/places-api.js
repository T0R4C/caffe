import fetch from 'node-fetch';

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

/**
 * Wait for X milliseconds (rate limiting).
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search for a place using Foursquare Places API.
 * Uses place name and coordinates to find the best match.
 */
export async function searchFoursquarePlace(name, lat, lng) {
  if (!FOURSQUARE_API_KEY) return null;

  try {
    const query = new URLSearchParams({
      query: name,
      ll: `${lat},${lng}`,
      radius: 500, // Search within 500 meters
      categories: '13032', // Coffee Shop Category ID
      limit: 1,
    });

    const response = await fetch(`https://api.foursquare.com/v3/places/search?${query}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('  ⚠ Foursquare rate limit hit.');
        await sleep(2000);
      }
      return null;
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].fsq_id;
    }
    return null;
  } catch (error) {
    console.error('  ❌ Foursquare search error:', error.message);
    return null;
  }
}

/**
 * Get photos for a Foursquare place ID.
 */
export async function getFoursquarePhotos(fsq_id) {
  if (!FOURSQUARE_API_KEY || !fsq_id) return [];

  try {
    const response = await fetch(`https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=3`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.map(photo => `${photo.prefix}original${photo.suffix}`);
  } catch (error) {
    return [];
  }
}

/**
 * Get place details (rating, hours) for a Foursquare place ID.
 */
export async function getFoursquareDetails(fsq_id) {
  if (!FOURSQUARE_API_KEY || !fsq_id) return null;

  try {
    const response = await fetch(`https://api.foursquare.com/v3/places/${fsq_id}?fields=rating,stats,hours,price`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      rating: data.rating ? (data.rating / 2) : null, // Foursquare uses 1-10, scale to 1-5
      total_reviews: data.stats?.total_ratings || 0,
      price_level: data.price ? '$'.repeat(data.price) : null,
      opening_hours: data.hours?.display || null
    };
  } catch (error) {
    return null;
  }
}

/**
 * Enrich a cafe object with Foursquare data.
 * @param {object} cafe 
 */
export async function enrichCafeWithFoursquare(cafe) {
  if (!FOURSQUARE_API_KEY) return cafe;

  // Wait briefly to avoid aggressive rate limits
  await sleep(100);

  const fsq_id = await searchFoursquarePlace(cafe.name, cafe.latitude, cafe.longitude);
  if (!fsq_id) return cafe;

  const [photos, details] = await Promise.all([
    getFoursquarePhotos(fsq_id),
    getFoursquareDetails(fsq_id)
  ]);

  return {
    ...cafe,
    photos: photos.length > 0 ? photos : cafe.photos || [],
    thumbnail: photos.length > 0 ? photos[0] : cafe.thumbnail,
    rating: details?.rating || cafe.rating,
    total_reviews: details?.total_reviews || cafe.total_reviews,
    price_level: details?.price_level || cafe.price_level,
    opening_hours: details?.opening_hours || cafe.opening_hours,
    source: cafe.source + '+foursquare'
  };
}
