import { NextResponse } from 'next/server';
import { WebhookStore } from '@/app/lib/webhookStore';

export async function POST(request, { params }) {
  const { id, index } = params;
  
  try {
    const webhookStore = WebhookStore.getInstance();
    webhookStore.deleteRequest(id, parseInt(index, 10));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook request deleted' 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Error deleting webhook request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete webhook request' 
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