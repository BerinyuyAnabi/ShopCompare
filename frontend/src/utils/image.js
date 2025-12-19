/**
 * Image URL Utilities
 * Handles image URL construction for different environments
 */

// Determine if we're in production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Base URL for the backend
const BACKEND_BASE = isProduction
  ? `${window.location.protocol}//${window.location.host}/~logan.anabi/ShopCompare`
  : '';

/**
 * Converts a relative or partial image URL to a full absolute URL
 * @param {string} imageUrl - The image URL from the database (e.g., "/backend/api/get-image.php?id=2")
 * @returns {string} Full absolute URL or null if no image
 */
export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  // If it's already a full URL (http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with /backend, prepend the base URL
  if (imageUrl.startsWith('/backend')) {
    return `${BACKEND_BASE}${imageUrl}`;
  }

  // If it's a relative path, prepend base URL + /backend
  if (!imageUrl.startsWith('/')) {
    return `${BACKEND_BASE}/backend/${imageUrl}`;
  }

  // Default: prepend base URL
  return `${BACKEND_BASE}${imageUrl}`;
}

/**
 * Gets placeholder image URL or component
 * @returns {string|null} Placeholder image URL
 */
export function getPlaceholderImage() {
  return null; // Return null to show "No Image Available" text
}
