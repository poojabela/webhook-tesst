import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique webhook ID
 * @returns {string} A unique webhook ID
 */
export function generateWebhookId() {
  return uuidv4();
}

/**
 * Generate a full webhook URL
 * @param {string} id - The webhook ID
 * @param {string} [baseUrl] - The base URL (defaults to current host)
 * @returns {string} The full webhook URL
 */
export function generateWebhookUrl(id, baseUrl = null) {
  // Get the base URL from window if not provided and in browser environment
  if (!baseUrl && typeof window !== 'undefined') {
    baseUrl = `${window.location.protocol}//${window.location.host}`;
  }
  
  // Default to localhost if not in browser and no baseUrl provided
  if (!baseUrl) {
    baseUrl = 'http://localhost:3000';
  }
  
  return `${baseUrl}/api/webhook/${id}`;
}

/**
 * Format timestamp to more readable format
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted timestamp
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Pretty print JSON with indentation
 * @param {object} obj - The object to prettify
 * @returns {string} Prettified JSON string
 */
export function prettyPrintJson(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
} 