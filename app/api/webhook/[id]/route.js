import { NextResponse } from 'next/server';
import { WebhookStore } from '@/app/lib/webhookStore';
import { SocketService } from '@/app/lib/socketService';

// Enable CORS for all webhook endpoints
export async function OPTIONS(request, context) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request, context) {
  try {
    // Ensure params are properly awaited
    const params = context.params;
    const id = params?.id;
    console.log(`Received GET webhook request for ID: ${id}`);
    
    // Log this request to our webhook store
    const webhookStore = WebhookStore.getInstance();
    const requestData = {
      method: 'GET',
      path: new URL(request.url).pathname,
      url: request.url,
      headers: Object.fromEntries(request.headers),
      query: Object.fromEntries(new URL(request.url).searchParams),
      timestamp: new Date().toISOString(),
    };
    
    webhookStore.addRequest(id, requestData);
    
    // Emit event for real-time updates
    SocketService.emitWebhookEvent(id, requestData);
    
    return NextResponse.json({ success: true, message: 'Webhook received' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error processing GET webhook request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook request' },
      { status: 500 }
    );
  }
}

export async function POST(request, context) {
  try {
    // Ensure params are properly awaited
    const params = context.params;
    const id = params?.id;
    console.log(`Received POST webhook request for ID: ${id}`);
    
    // Parse the body
    let body;
    try {
      body = await request.json();
      console.log('Request body (JSON):', body);
    } catch (e) {
      console.log('Failed to parse JSON, reading as text');
      body = await request.text();
      console.log('Request body (text):', body);
    }
    
    // Log this request to our webhook store
    const webhookStore = WebhookStore.getInstance();
    const requestData = {
      method: 'POST',
      path: new URL(request.url).pathname,
      url: request.url,
      headers: Object.fromEntries(request.headers),
      body,
      timestamp: new Date().toISOString(),
    };
    
    webhookStore.addRequest(id, requestData);
    
    // Emit event for real-time updates
    SocketService.emitWebhookEvent(id, requestData);
    
    return NextResponse.json({ success: true, message: 'Webhook received' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error processing POST webhook request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook request' },
      { status: 500 }
    );
  }
}

// Handle other methods similarly (PUT, DELETE, etc.)
export async function PUT(request, context) {
  try {
    // Ensure params are properly awaited
    const params = context.params;
    const id = params?.id;
    console.log(`Received PUT webhook request for ID: ${id}`);
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = await request.text();
    }
    
    const webhookStore = WebhookStore.getInstance();
    const requestData = {
      method: 'PUT',
      path: new URL(request.url).pathname,
      url: request.url,
      headers: Object.fromEntries(request.headers),
      body,
      timestamp: new Date().toISOString(),
    };
    
    webhookStore.addRequest(id, requestData);
    
    // Emit event for real-time updates
    SocketService.emitWebhookEvent(id, requestData);
    
    return NextResponse.json({ success: true, message: 'Webhook received' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error processing PUT webhook request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    // Ensure params are properly awaited
    const params = context.params;
    const id = params?.id;
    console.log(`Received DELETE webhook request for ID: ${id}`);
    
    const webhookStore = WebhookStore.getInstance();
    const requestData = {
      method: 'DELETE',
      path: new URL(request.url).pathname,
      url: request.url,
      headers: Object.fromEntries(request.headers),
      timestamp: new Date().toISOString(),
    };
    
    webhookStore.addRequest(id, requestData);
    
    // Emit event for real-time updates
    SocketService.emitWebhookEvent(id, requestData);
    
    return NextResponse.json({ success: true, message: 'Webhook received' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error processing DELETE webhook request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
  try {
    // Ensure params are properly awaited
    const params = context.params;
    const id = params?.id;
    console.log(`Received PATCH webhook request for ID: ${id}`);
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = await request.text();
    }
    
    const webhookStore = WebhookStore.getInstance();
    const requestData = {
      method: 'PATCH',
      path: new URL(request.url).pathname,
      url: request.url,
      headers: Object.fromEntries(request.headers),
      body,
      timestamp: new Date().toISOString(),
    };
    
    webhookStore.addRequest(id, requestData);
    
    // Emit event for real-time updates
    SocketService.emitWebhookEvent(id, requestData);
    
    return NextResponse.json({ success: true, message: 'Webhook received' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error processing PATCH webhook request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook request' },
      { status: 500 }
    );
  }
} 