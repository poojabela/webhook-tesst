'use client';

import { useState } from 'react';
import { ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { webhookTemplates } from '../lib/webhookTemplates';

export default function WebhookSimulator({ webhookId }) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [customPayload, setCustomPayload] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // Get available services from templates
  const services = webhookTemplates ? Object.keys(webhookTemplates) : [];
  
  // Get available events for selected service
  const events = selectedService && webhookTemplates && webhookTemplates[selectedService] 
    ? Object.keys(webhookTemplates[selectedService]) 
    : [];

  // Reset event when service changes
  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSelectedEvent('');
    setSendResult(null);
    
    if (service === 'custom') {
      setIsCustom(true);
      setCustomPayload(JSON.stringify({ data: "Your custom data here" }, null, 2));
    } else {
      setIsCustom(false);
    }
  };

  // Update selected event
  const handleEventChange = (event) => {
    setSelectedEvent(event);
    setSendResult(null);
  };

  // Send the webhook payload
  const handleSendWebhook = async () => {
    if (!webhookId) {
      setSendResult({
        success: false,
        message: 'Please generate a webhook URL first'
      });
      return;
    }

    if ((!selectedService || !selectedEvent) && !isCustom) {
      setSendResult({
        success: false,
        message: 'Please select both service and event'
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);
    
    try {
      let payload;
      
      if (isCustom) {
        try {
          payload = JSON.parse(customPayload);
        } catch (e) {
          setSendResult({
            success: false,
            message: 'Invalid JSON format'
          });
          setIsSending(false);
          return;
        }
      } else if (webhookTemplates && webhookTemplates[selectedService] && webhookTemplates[selectedService][selectedEvent]) {
        // Add safety checks when accessing templates
        payload = webhookTemplates[selectedService][selectedEvent];
      } else {
        setSendResult({
          success: false,
          message: 'Selected template not found'
        });
        setIsSending(false);
        return;
      }

      // Add timestamp if not present and payload is an object
      if (payload && typeof payload === 'object' && !Array.isArray(payload) && !payload.timestamp) {
        payload.timestamp = new Date().toISOString();
      }
      
      // Send to the webhook endpoint
      const response = await fetch(`/api/webhook/${webhookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Simulated-Webhook': 'true',
          'X-Webhook-Service': selectedService,
          'X-Webhook-Event': selectedEvent
        },
        body: JSON.stringify(payload)
      });
      
      setSendResult({
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Webhook sent successfully' : 'Failed to send webhook'
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
      setSendResult({
        success: false,
        message: 'Error sending webhook: ' + error.message
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle potential issues with webhookTemplates
  if (!webhookTemplates) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 p-4 mb-4">
        <h2 className="text-sm font-light text-white/80 mb-3">Webhook Simulator</h2>
        <div className="text-red-400 text-xs p-3 bg-red-400/10 rounded">
          Error: Webhook templates could not be loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 p-4 mb-4">
      <h2 className="text-sm font-light text-white/80 mb-3">Webhook Simulator</h2>
      
      <div className="space-y-3">
        {/* Service Selection */}
        <div>
          <label className="block text-xs text-white/60 mb-1">Service</label>
          <select 
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded text-xs text-white/80 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service} value={service}>
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </option>
            ))}
            <option value="custom">Custom Payload</option>
          </select>
        </div>
        
        {/* Event Selection - Show only if not custom */}
        {!isCustom && selectedService && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Event</label>
            <select 
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded text-xs text-white/80 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event} value={event}>
                  {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Custom JSON editor - Show only if custom */}
        {isCustom && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Custom Payload (JSON)</label>
            <textarea 
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full h-32 bg-black/60 border border-white/10 rounded text-xs text-white/80 p-2 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
            <p className="text-xs text-white/40 mt-1">
              Must be valid JSON. For non-object payloads, consider using an object wrapper like: {"{ \"data\": your_value }"}
            </p>
          </div>
        )}
        
        {/* Send Button */}
        <button
          onClick={handleSendWebhook}
          disabled={isSending || (!selectedEvent && !isCustom)}
          className={`w-full bg-indigo-600/80 hover:bg-indigo-600 text-white/90 hover:text-white text-xs px-4 py-2.5 rounded transition-colors flex items-center justify-center ${
            (!selectedEvent && !isCustom) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSending ? (
            <>
              <div className="w-3 h-3 rounded-full border border-white/80 border-t-transparent animate-spin mr-2"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-3.5 h-3.5 mr-2 opacity-80" />
              <span>Send Simulated Webhook</span>
            </>
          )}
        </button>
        
        {/* Result Message */}
        {sendResult && (
          <div className={`text-xs p-2 rounded ${
            sendResult.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {sendResult.message}
            {sendResult.status && ` (Status: ${sendResult.status})`}
          </div>
        )}
      </div>
    </div>
  );
} 