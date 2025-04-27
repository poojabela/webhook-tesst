import { EventEmitter } from 'events';

// Keep a global reference to the store to persist data between module reloads
let storeInstance = null;

/**
 * WebhookStore class for storing and managing webhook requests
 * Uses singleton pattern to ensure one instance across the app
 */
export class WebhookStore {
  constructor() {
    // Map of webhook ID -> array of requests
    this.webhooks = new Map();
    this.eventEmitter = new EventEmitter();
    // Increase max listeners to avoid warnings
    this.eventEmitter.setMaxListeners(50);
    console.log('WebhookStore initialized');
  }
  
  /**
   * Get the singleton instance of WebhookStore
   */
  static getInstance() {
    if (!storeInstance) {
      storeInstance = new WebhookStore();
    }
    return storeInstance;
  }
  
  /**
   * Add a new webhook request to the store
   * @param {string} id - The webhook ID
   * @param {object} requestData - The request data to store
   */
  addRequest(id, requestData) {
    if (!id) {
      console.error('Cannot add request: No webhook ID provided');
      return;
    }
    
    console.log(`Adding webhook request for ID ${id}:`, requestData);
    
    if (!this.webhooks.has(id)) {
      this.webhooks.set(id, []);
    }
    
    const requests = this.webhooks.get(id);
    requests.push(requestData);
    
    // Keep only the last 100 requests for each webhook to avoid memory issues
    if (requests.length > 100) {
      requests.shift(); // Remove oldest request
    }
    
    // Emit event for real-time updates
    console.log(`Emitting new-request event for ID ${id}`);
    this.eventEmitter.emit('new-request', { id, requestData });
    
    return requestData;
  }
  
  /**
   * Get all requests for a webhook ID
   * @param {string} id - The webhook ID
   * @returns {array} Array of request data
   */
  getRequests(id) {
    if (!id) {
      console.error('Cannot get requests: No webhook ID provided');
      return [];
    }
    
    const requests = this.webhooks.get(id) || [];
    console.log(`Getting ${requests.length} requests for ID ${id}`);
    return requests;
  }
  
  /**
   * Get all webhook IDs
   * @returns {array} Array of webhook IDs
   */
  getWebhookIds() {
    const ids = Array.from(this.webhooks.keys());
    console.log(`Getting all webhook IDs: ${ids.join(', ') || 'none'}`);
    return ids;
  }
  
  /**
   * Clear all requests for a webhook ID
   * @param {string} id - The webhook ID
   */
  clearRequests(id) {
    if (!id) {
      console.error('Cannot clear requests: No webhook ID provided');
      return;
    }
    
    console.log(`Clearing requests for ID ${id}`);
    if (this.webhooks.has(id)) {
      this.webhooks.set(id, []);
      this.eventEmitter.emit('clear-requests', { id });
    }
  }
  
  /**
   * Delete a specific request from a webhook ID
   * @param {string} id - The webhook ID
   * @param {number} index - The index of the request to delete
   */
  deleteRequest(id, index) {
    if (!id) {
      console.error('Cannot delete request: No webhook ID provided');
      return;
    }
    
    console.log(`Deleting request at index ${index} for ID ${id}`);
    if (this.webhooks.has(id)) {
      const requests = this.webhooks.get(id);
      if (index >= 0 && index < requests.length) {
        requests.splice(index, 1);
        this.eventEmitter.emit('delete-request', { id, index });
      }
    }
  }
  
  /**
   * Subscribe to webhook events
   * @param {string} eventName - The event name to subscribe to
   * @param {function} callback - The callback function
   */
  subscribe(eventName, callback) {
    console.log(`Subscribing to event: ${eventName}`);
    this.eventEmitter.on(eventName, callback);
    
    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from event: ${eventName}`);
      this.eventEmitter.off(eventName, callback);
    };
  }
} 