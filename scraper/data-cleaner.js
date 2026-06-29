/**
 * Utility functions for cleaning and standardizing cafe data.
 */

/**
 * Clean and format cafe name to Title Case, removing redundant spaces.
 * @param {string} name
 * @returns {string|null}
 */
export function cleanCafeName(name) {
  if (!name) return null;
  return name
    .trim()
    .replace(/\s+/g, ' ') // Remove extra spaces
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Title Case
    .join(' ');
}

/**
 * Standardize address format (e.g. jln, jalan -> Jl.)
 * @param {string} address
 * @returns {string|null}
 */
export function cleanAddress(address) {
  if (!address) return null;
  
  let cleaned = address
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ',') // Remove duplicate commas
    .replace(/^,\s*|\s*,$/g, ''); // Remove leading/trailing commas

  // Replace common Indonesian street abbreviations
  cleaned = cleaned.replace(/\b(Jalan|Jln|Jln\.)\b/gi, 'Jl.');
  
  return cleaned;
}

/**
 * Clean and standardize phone number to start with +62 or 08.
 * @param {string} phone
 * @returns {string|null}
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return null;
  
  let cleaned = phone.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
  
  // If starts with 08, change to +628 for international standard if desired,
  // or keep it consistent. Let's make it start with +62
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.substring(1);
  } else if (cleaned.startsWith('62')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Normalize the entire cafe object.
 * @param {object} cafe
 * @returns {object}
 */
export function normalizeCafeData(cafe) {
  return {
    ...cafe,
    name: cleanCafeName(cafe.name) || cafe.name,
    address: cleanAddress(cafe.address) || cafe.address,
    phone: cleanPhoneNumber(cafe.phone) || cafe.phone
  };
}
