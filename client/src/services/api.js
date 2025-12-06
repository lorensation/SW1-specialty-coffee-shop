/**
 * Base API Service
 * Centralized configuration for API calls
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * Make an API request with error handling
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint) => apiRequest(endpoint, { method: 'GET' });

/**
 * POST request
 */
export const post = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * PUT request
 */
export const put = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

/**
 * DELETE request
 */
export const del = (endpoint) =>
  apiRequest(endpoint, { method: 'DELETE' });

export default {
  get,
  post,
  put,
  del,
};
