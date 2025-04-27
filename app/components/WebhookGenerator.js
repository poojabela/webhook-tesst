'use client';

import { useState } from 'react';
import { ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function WebhookGenerator({ onWebhookGenerated }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWebhookUrl = async () => {
    setIsGenerating(true);
    try {
      // In a real app, we would call an API to generate a unique URL
      // For now, we'll simulate with a random ID
      const id = Math.random().toString(36).substring(2, 10);
      const url = `${window.location.origin}/api/webhook/${id}`;
      
      // Wait a moment to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setWebhookUrl(url);
      if (onWebhookGenerated) {
        onWebhookGenerated(id);
      }
    } catch (error) {
      console.error('Error generating webhook URL:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (webhookUrl) {
      try {
        await navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Could not copy text:', error);
      }
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 p-4">
      <h2 className="text-sm font-light text-white/80 mb-3">Webhook URL</h2>
      
      {webhookUrl ? (
        <div className="space-y-3">
          <div className="flex">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="bg-black/60 border-0 border-l border-white/5 text-xs outline-none text-white/70 font-mono px-3 py-2 flex-1 rounded-l"
            />
            <button
              onClick={copyToClipboard}
              className="bg-black/60 text-xs text-white/70 hover:text-white hover:bg-black/80 px-3 py-2 transition-colors border-0 border-r border-white/5 rounded-r flex items-center"
            >
              <ClipboardIcon className="w-3.5 h-3.5" />
              <span className={`ml-1.5 transition-opacity ${copied ? 'opacity-100' : 'opacity-70'}`}>
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">24h expiry</span>
            <button
              onClick={generateWebhookUrl}
              disabled={isGenerating}
              className="text-xs text-indigo-300/70 hover:text-indigo-300 transition-colors flex items-center"
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate new'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={generateWebhookUrl}
          disabled={isGenerating}
          className="w-full bg-indigo-600/80 hover:bg-indigo-600 text-white/90 hover:text-white text-xs px-4 py-2.5 rounded transition-colors flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <div className="w-3 h-3 rounded-full border border-white/80 border-t-transparent animate-spin mr-2"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <ArrowPathIcon className="w-3.5 h-3.5 mr-2 opacity-80" />
              <span>Generate webhook URL</span>
            </>
          )}
        </button>
      )}
    </div>
  );
} 