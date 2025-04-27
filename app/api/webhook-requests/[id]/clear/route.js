import { NextResponse } from 'next/server';
import { WebhookStore } from '@/app/lib/webhookStore';

export async function POST(request, { params }) {
  const id = params.id;
  
  try {
    const webhookStore = WebhookStore.getInstance();
    webhookStore.clearRequests(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook requests cleared' 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Error clearing webhook requests:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear webhook requests' 
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 