'use client';

// Constants
const STORAGE_KEY = 'webhook_requests';
const MAX_STORED_REQUESTS = 100;

/**
 * Save webhook requests to localStorage
 * @param {Array} requests - Array of webhook request objects
 */
export const saveRequests = (requests) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Limit the number of requests to prevent localStorage from getting too large
    const limitedRequests = requests.slice(0, MAX_STORED_REQUESTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedRequests));
  } catch (error) {
    console.error('Error saving requests to localStorage:', error);
  }
};

/**
 * Get webhook requests from localStorage
 * @returns {Array} Array of webhook request objects or empty array if none found
 */
export const getRequests = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedRequests = localStorage.getItem(STORAGE_KEY);
    return storedRequests ? JSON.parse(storedRequests) : [];
  } catch (error) {
    console.error('Error retrieving requests from localStorage:', error);
    return [];
  }
};

/**
 * Add a new webhook request to the stored list
 * @param {Object} request - Webhook request object to add
 * @returns {Array} Updated array of webhook requests
 */
export const addRequest = (request) => {
  const currentRequests = getRequests();
  const updatedRequests = [request, ...currentRequests].slice(0, MAX_STORED_REQUESTS);
  saveRequests(updatedRequests);
  return updatedRequests;
};

/**
 * Clear all stored webhook requests
 */
export const clearRequests = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing requests from localStorage:', error);
  }
};

/**
 * Export requests as JSON
 * @returns {string} JSON string of all requests
 */
export const exportRequests = () => {
  const requests = getRequests();
  return JSON.stringify(requests, null, 2);
};

/**
 * Import requests from JSON
 * @param {string} jsonData - JSON string of requests to import
 * @returns {boolean} Success status
 */
export const importRequests = (jsonData) => {
  try {
    const parsedData = JSON.parse(jsonData);
    if (Array.isArray(parsedData)) {
      saveRequests(parsedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing requests:', error);
    return false;
  }
}; 