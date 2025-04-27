import { NextResponse } from 'next/server';
import { WebhookStore } from '@/app/lib/webhookStore';

export async function GET(request, context) {
  try {
    // Ensure params are properly awaited
    const params = context.params;
    const id = params?.id;
    console.log(`Fetching webhook requests for ID: ${id}`);
    
    const webhookStore = WebhookStore.getInstance();
    const requests = webhookStore.getRequests(id);
    
    return NextResponse.json({ 
      success: true, 
      webhookId: id,
      requests 
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching webhook requests:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch webhook requests' 
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 