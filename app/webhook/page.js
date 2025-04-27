'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import WebhookGenerator from '../components/WebhookGenerator';
import WebhookRequestList from '../components/WebhookRequestList';
import WebhookSimulator from '../components/WebhookSimulator';
import SmartDocumentation from '../components/SmartDocumentation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function WebhookPage() {
  const [webhookId, setWebhookId] = useState(null);
  const webhookGeneratorRef = useRef(null);
  
  // On component mount, generate a new webhook
  useEffect(() => {
    // Auto-generate new webhook ID after a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      if (webhookGeneratorRef.current && webhookGeneratorRef.current.generateWebhook) {
        webhookGeneratorRef.current.generateWebhook();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handler for when a new webhook is generated
  const handleWebhookGenerated = (id) => {
    setWebhookId(id);
  };
  
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto pt-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-light">Webhook Tester</h1>
          <Link href="/" className="text-xs text-indigo-300/70 hover:text-indigo-300 transition-colors flex items-center">
            <ArrowLeftIcon className="w-3 h-3 mr-1" />
            Home
          </Link>
        </div>
        
        <div className="space-y-4">
          <WebhookGenerator 
            ref={webhookGeneratorRef}
            onWebhookGenerated={handleWebhookGenerated} 
          />
          {webhookId && <WebhookSimulator webhookId={webhookId} />}
          {/* {webhookId && <SmartDocumentation webhookId={webhookId} />} */}
          {webhookId && <WebhookRequestList webhookId={webhookId} />}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-white/30">Built with Next.js</p>
        </div>
      </div>
    </main>
  );
}

// Import statement is dynamically added during client-side hydration
export const dynamic = 'force-dynamic'; 