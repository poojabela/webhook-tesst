// We'll use a simple in-memory store for this demo instead of Socket.io
// This avoids the complexity of setting up Socket.io with Next.js App Router

/**
 * Simple in-memory message store for webhook events
 */
class WebhookEventStore {
  constructor() {
    this.listeners = new Map(); // webhookId -> array of callbacks
  }

  // Add a listener for a webhook ID
  addListener(webhookId, callback) {
    if (!this.listeners.has(webhookId)) {
      this.listeners.set(webhookId, []);
    }
    
    const callbacks = this.listeners.get(webhookId);
    callbacks.push(callback);
    
    // Return function to remove this listener
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Emit an event for a webhook ID
  emitEvent(webhookId, data) {
    const callbacks = this.listeners.get(webhookId) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in webhook event listener:', error);
      }
    });
  }
}

// Singleton instance
const webhookEventStore = new WebhookEventStore();

/**
 * SocketService for managing real-time webhook communication
 * Simplified to work with Next.js App Router
 */
export class SocketService {
  /**
   * Register a listener for webhook events
   * @param {string} webhookId - The webhook ID
   * @param {Function} callback - The callback function
   * @returns {Function} Function to remove the listener
   */
  static addListener(webhookId, callback) {
    return webhookEventStore.addListener(webhookId, callback);
  }
  
  /**
   * Emit a webhook event
   * @param {string} webhookId - The webhook ID
   * @param {object} data - The webhook request data
   */
  static emitWebhookEvent(webhookId, data) {
    console.log(`Emitting webhook event for ID: ${webhookId}`);
    webhookEventStore.emitEvent(webhookId, data);
  }
} 