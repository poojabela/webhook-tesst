import { NextResponse } from 'next/server';
import { WebhookStore } from '@/app/lib/webhookStore';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate sample webhook requests for testing
function generateSampleRequests(webhookId) {
  if (!webhookId) return [];
  
  const webhookStore = WebhookStore.getInstance();
  
  // Sample GET request
  webhookStore.addRequest(webhookId, {
    method: 'GET',
    path: `/api/webhook/${webhookId}`,
    url: `http://localhost:3000/api/webhook/${webhookId}`,
    headers: {
      'user-agent': 'Mozilla/5.0',
      'accept': 'application/json',
      'host': 'localhost:3000'
    },
    query: { test: 'parameter' },
    timestamp: new Date().toISOString()
  });
  
  // Sample POST request with JSON body
  webhookStore.addRequest(webhookId, {
    method: 'POST',
    path: `/api/webhook/${webhookId}`,
    url: `http://localhost:3000/api/webhook/${webhookId}`,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'PostmanRuntime/7.32.3',
      'accept': '*/*',
      'host': 'localhost:3000'
    },
    body: {
      event: 'user.created',
      data: {
        id: 'usr_123456',
        name: 'John Doe',
        email: 'john@example.com',
        created_at: new Date().toISOString()
      }
    },
    timestamp: new Date().toISOString()
  });
  
  // Sample PUT request
  webhookStore.addRequest(webhookId, {
    method: 'PUT',
    path: `/api/webhook/${webhookId}`,
    url: `http://localhost:3000/api/webhook/${webhookId}`,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'curl/7.88.1',
      'accept': '*/*',
      'host': 'localhost:3000'
    },
    body: {
      event: 'user.updated',
      data: {
        id: 'usr_123456',
        name: 'John Smith',
        email: 'john@example.com',
        updated_at: new Date().toISOString()
      }
    },
    timestamp: new Date().toISOString()
  });
  
  return webhookStore.getRequests(webhookId);
}

export async function POST(request) {
  try {
    // Parse request body with error handling
    let webhookId;
    try {
      const body = await request.json();
      webhookId = body?.webhookId || "aaevn4qk";
    } catch (err) {
      console.error('Error parsing request body:', err);
      webhookId = "aaevn4qk"; // Fallback to default
    }
    
    if (!webhookId) {
      return NextResponse.json(
        { success: false, error: 'Webhook ID is required' },
        { status: 400 }
      );
    }
    
    // Get webhook requests from our store
    const webhookStore = WebhookStore.getInstance();
    let requests = webhookStore.getRequests(webhookId);
    
    // If no requests exist, generate sample requests for demonstration
    if (!requests || requests.length === 0) {
      console.log('No requests found, generating sample requests for webhook:', webhookId);
      requests = generateSampleRequests(webhookId);
      
      if (requests.length > 0) {
        console.log(`Generated ${requests.length} sample requests`);
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Could not generate sample requests. Please send some requests to the webhook URL first before generating documentation.' 
          },
          { status: 404 }
        );
      }
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key is not configured. Please add your API key to the .env file.' 
        },
        { status: 500 }
      );
    }
    
    // Prepare data for OpenAI analysis
    const requestsData = requests.map(req => ({
      method: req.method,
      path: req.path,
      headers: req.headers,
      query: req.query,
      body: req.body,
      timestamp: req.timestamp
    }));
    
    try {
      // Request to OpenAI for documentation generation
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an API documentation expert. Analyze the following webhook requests and generate comprehensive API documentation. Include endpoint details, request/response formats, headers, and example usage. Format the documentation in markdown.`
          },
          {
            role: "user",
            content: `Based on these webhook requests, generate API documentation:\n${JSON.stringify(requestsData, null, 2)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      });
      
      // Extract the generated documentation
      const documentation = response.choices[0].message.content;
      
      return NextResponse.json({
        success: true,
        documentation,
        requestCount: requests.length,
        sampleData: requests.length !== requestsData.length
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Check for common OpenAI API errors
      if (openaiError.code === 'invalid_api_key' || openaiError.message?.includes('api key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Your OpenAI API key appears to be invalid or has expired. Please update your API key.' 
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: `OpenAI API error: ${openaiError.message || 'Unknown error'}` 
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error generating documentation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate documentation'
      },
      { status: 500 }
    );
  }
} 