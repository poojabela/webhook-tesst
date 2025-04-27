import { NextResponse } from 'next/server';

// This route is kept for compatibility but no longer needed
export async function GET() {
  return new NextResponse('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 