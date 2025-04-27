'use client';

const WEBHOOK_HISTORY_KEY = 'webhook_history';
const WEBHOOK_FAVORITES_KEY = 'webhook_favorites';
const APP_SETTINGS_KEY = 'webhook_app_settings';

/**
 * Storage utility for webhook app data
 */
export const storageUtils = {
  /**
   * Save webhook request history to local storage
   * @param {string} webhookId - The webhook ID
   * @param {array} requests - The webhook requests
   */
  saveHistory: (webhookId, requests) => {
    try {
      const history = storageUtils.getHistory();
      history[webhookId] = requests;
      localStorage.setItem(WEBHOOK_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving webhook history:', error);
    }
  },

  /**
   * Get webhook request history from local storage
   * @returns {object} - Object with webhookId keys and request arrays
   */
  getHistory: () => {
    try {
      const history = localStorage.getItem(WEBHOOK_HISTORY_KEY);
      return history ? JSON.parse(history) : {};
    } catch (error) {
      console.error('Error getting webhook history:', error);
      return {};
    }
  },

  /**
   * Get request history for a specific webhook ID
   * @param {string} webhookId - The webhook ID
   * @returns {array} - Array of webhook requests
   */
  getHistoryForWebhook: (webhookId) => {
    try {
      const history = storageUtils.getHistory();
      return history[webhookId] || [];
    } catch (error) {
      console.error('Error getting history for webhook:', error);
      return [];
    }
  },

  /**
   * Clear history for a specific webhook
   * @param {string} webhookId - The webhook ID to clear history for
   */
  clearHistory: (webhookId) => {
    try {
      const history = storageUtils.getHistory();
      if (webhookId) {
        delete history[webhookId];
      } else {
        Object.keys(history).forEach(key => delete history[key]);
      }
      localStorage.setItem(WEBHOOK_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error clearing webhook history:', error);
    }
  },

  /**
   * Export webhook history to JSON
   * @param {string} webhookId - Optional webhook ID to export only that history
   * @returns {string} - JSON string of history
   */
  exportHistory: (webhookId) => {
    try {
      const history = storageUtils.getHistory();
      const exportData = webhookId ? { [webhookId]: history[webhookId] } : history;
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting webhook history:', error);
      return '';
    }
  },

  /**
   * Import webhook history from JSON
   * @param {string} jsonData - JSON string to import
   * @returns {boolean} - Success status
   */
  importHistory: (jsonData) => {
    try {
      const importedData = JSON.parse(jsonData);
      const currentHistory = storageUtils.getHistory();
      
      // Merge imported data with current history
      const mergedHistory = { ...currentHistory, ...importedData };
      localStorage.setItem(WEBHOOK_HISTORY_KEY, JSON.stringify(mergedHistory));
      return true;
    } catch (error) {
      console.error('Error importing webhook history:', error);
      return false;
    }
  },

  /**
   * Save a webhook as favorite
   * @param {string} webhookId - The webhook ID to favorite
   * @param {string} name - Optional friendly name for the webhook
   */
  saveFavorite: (webhookId, name = '') => {
    try {
      const favorites = storageUtils.getFavorites();
      favorites[webhookId] = { 
        id: webhookId,
        name: name || `Webhook ${webhookId}`,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(WEBHOOK_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving webhook favorite:', error);
    }
  },

  /**
   * Get all favorite webhooks
   * @returns {object} - Object with webhookId keys and favorite data
   */
  getFavorites: () => {
    try {
      const favorites = localStorage.getItem(WEBHOOK_FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : {};
    } catch (error) {
      console.error('Error getting webhook favorites:', error);
      return {};
    }
  },

  /**
   * Remove a webhook from favorites
   * @param {string} webhookId - The webhook ID to remove from favorites
   */
  removeFavorite: (webhookId) => {
    try {
      const favorites = storageUtils.getFavorites();
      delete favorites[webhookId];
      localStorage.setItem(WEBHOOK_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error removing webhook favorite:', error);
    }
  },

  /**
   * Save application settings
   * @param {object} settings - The settings object to save
   */
  saveSettings: (settings) => {
    try {
      const currentSettings = storageUtils.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  },

  /**
   * Get application settings
   * @returns {object} - The application settings
   */
  getSettings: () => {
    try {
      const settings = localStorage.getItem(APP_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        theme: 'dark',
        autoRefresh: true,
        refreshInterval: 1000,
        expandedView: false
      };
    } catch (error) {
      console.error('Error getting app settings:', error);
      return {
        theme: 'dark',
        autoRefresh: true,
        refreshInterval: 1000,
        expandedView: false
      };
    }
  }
}; 