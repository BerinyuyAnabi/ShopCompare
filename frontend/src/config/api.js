/**
 * API Configuration
 * Handles different API base URLs for development and production
 */

// Determine on the server or localhost
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// In derive the backend location from the location the frontend
// was served from. 
export const API_BASE_URL = isProduction
  ? `${window.location.protocol}//${window.location.host}/~logan.anabi/ShopCompare/backend/api`
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
 * Helper function for fetch with credentials and a default timeout.
 * Uses AbortController to fail fast if the backend is not reachable.
 * @param {string} endpoint - API endpoint path (e.g. '/products.php')
 * @param {object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds (default 10000)
 */
export async function apiFetch(endpoint, options = {}, timeoutMs = 10000) {
  const url = getApiUrl(endpoint);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    signal: controller.signal
  };

  try {
    const res = await fetch(url, { ...defaultOptions, ...options });
    // If unauthorized, clear client user state and redirect to login so server
    // session can be refreshed. Backend should return 401 when session expired.
    if (res.status === 401) {
      try {
        localStorage.removeItem('user');
      } catch (e) {}
      // redirect to login page
      window.location.replace('/login');
      throw new Error('Unauthorized');
    }

    return res;
  } catch (err) {
    // Normalize abort error so callers can show a friendly message
    if (err.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
