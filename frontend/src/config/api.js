/**
 * API Configuration
 * Handles different API base URLs for development and production
 */

// Determine on the server or localhost
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// API base URL configuration
export const API_BASE_URL = isProduction
  ? 'http://169.239.251.102:3410/~logan.anabi/ShopCompare/backend/api'
  : '/api'; // Uses Vite proxy in development

/**
 * Helper function to construct full API URL
 * @param {string} endpoint - The API endpoint path (e.g., '/products.php')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
}

/**
 * Helper function for fetch with credentials
 * @param {string} endpoint - The API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
export async function apiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  return fetch(url, { ...defaultOptions, ...options });
}
