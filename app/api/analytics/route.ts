import { NextResponse } from 'next/server';
import { fetchGoogleAnalyticsData } from '@/app/lib/analytics';

/**
 * GET handler for analytics API - this is a simple pass-through now,
 * since we're using static data instead of actual GA integration.
 */
export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '7d';
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';
    
    // Get the mocked analytics data
    const data = await fetchGoogleAnalyticsData(
      period as any,
      startDate || undefined,
      endDate || undefined
    );
    
    // Return the data with no-cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 