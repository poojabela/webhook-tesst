'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-2">Webhook Tester</h1>
          <p className="text-base text-gray-400 mb-6">
            Test webhooks instantly without complicated setup
          </p>
          
          <Link 
            href="/webhook"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md text-base font-medium"
          >
            Start Testing
          </Link>
        </div>
        
        <div className="card p-4 backdrop-blur-sm bg-opacity-50 bg-[#111] border border-[#222] rounded-lg">
          <h2 className="text-sm font-medium mb-2">How It Works</h2>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-900 flex items-center justify-center text-xs flex-shrink-0">1</span>
              <p>Generate a unique webhook URL for testing</p>
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-900 flex items-center justify-center text-xs flex-shrink-0">2</span>
              <p>Use the URL in your application or service</p>
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-900 flex items-center justify-center text-xs flex-shrink-0">3</span>
              <p>Send simulated webhooks from popular services</p>
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-900 flex items-center justify-center text-xs flex-shrink-0">4</span>
              <p>View incoming webhook requests in real-time</p>
            </li>
          </ol>
          
          <div className="mt-4 pt-3 border-t border-[#222] text-xs text-gray-500">
            <p>URLs expire after 24 hours • No registration required</p>
          </div>
        </div>
      </div>
    </main>
  );
}
