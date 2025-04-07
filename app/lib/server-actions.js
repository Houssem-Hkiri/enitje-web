'use server';

/**
 * Server-only Google Analytics API functions
 * These functions will never be included in client bundles
 * thanks to the 'use server' directive
 */

// Import the server-only Google API packages here
// They will never be included in client bundles
let analyticsDataModule;
let googleapisModule;

/**
 * Dynamic import for Google Analytics API
 */
export async function importGoogleAPIs() {
  try {
    if (!analyticsDataModule) {
      analyticsDataModule = await import('@google-analytics/data');
    }
    if (!googleapisModule) {
      googleapisModule = await import('googleapis');
    }
    
    return {
      BetaAnalyticsDataClient: analyticsDataModule.BetaAnalyticsDataClient,
      google: googleapisModule.google
    };
  } catch (error) {
    console.error('Failed to import Google APIs:', error);
    throw error;
  }
}

/**
 * Get Google service account credentials from environment
 */
export async function getServiceAccountCredentials() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.warn('Google service account key not found in environment variables');
    return null;
  }

  try {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error('Error parsing Google service account key JSON:', error);
    return null;
  }
}

/**
 * Check if Google APIs can be used
 */
export async function canUseGoogleAPIs() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const hasCredentials = !!(await getServiceAccountCredentials());
  
  return !!gaId && hasCredentials;
}

/**
 * Fetch Google Analytics 4 data
 * This is a server action that runs only on the server
 */
export async function fetchGoogleAnalyticsData(period, startDate, endDate) {
  try {
    // Calculate date ranges for the request
    const dateRange = getDateRangeForPeriod(period, startDate, endDate);
    
    // Get Google Analytics property ID from env
    const propertyId = process.env.NEXT_PUBLIC_GA_ID;
    if (!propertyId) {
      throw new Error('Google Analytics property ID not found');
    }

    // Get credentials
    const credentials = await getServiceAccountCredentials();
    if (!credentials) {
      throw new Error('Google service account credentials not found');
    }

    // Import Google API libraries
    const { BetaAnalyticsDataClient, google } = await importGoogleAPIs();

    // Create analytics client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentials,
    });

    // Request for visitor metrics
    const [visitorResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });

    // Process visitor data
    const visitors = parseInt(visitorResponse.rows?.[0]?.metricValues?.[0]?.value || '0');
    const pageViews = parseInt(visitorResponse.rows?.[0]?.metricValues?.[1]?.value || '0');
    const bounceRate = parseFloat(visitorResponse.rows?.[0]?.metricValues?.[2]?.value || '0');
    const avgDurationSeconds = parseFloat(visitorResponse.rows?.[0]?.metricValues?.[3]?.value || '0');

    // Return the basic analytics data
    return {
      visitors,
      pageViews,
      bounceRate: `${Math.round(bounceRate * 100)}%`,
      avgDuration: formatDuration(avgDurationSeconds),
      // Other fields would be populated by the client
    };
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
    return null;
  }
}

/**
 * Calculate date ranges based on the selected period
 */
async function getDateRangeForPeriod(
  period,
  startDate,
  endDate
) {
  const now = new Date();
  // Format: YYYY-MM-DD
  const today = now.toISOString().split('T')[0];
  
  let start;
  
  if (period === 'custom' && startDate) {
    return { startDate, endDate: endDate || today };
  }
  
  switch (period) {
    case '24h':
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      start = yesterday.toISOString().split('T')[0];
      break;
    case '7d':
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      start = lastWeek.toISOString().split('T')[0];
      break;
    case '30d':
      const lastMonth = new Date(now);
      lastMonth.setDate(lastMonth.getDate() - 30);
      start = lastMonth.toISOString().split('T')[0];
      break;
    default:
      // Default to 7 days if invalid period
      const defaultDate = new Date(now);
      defaultDate.setDate(defaultDate.getDate() - 7);
      start = defaultDate.toISOString().split('T')[0];
      break;
  }
  
  return { startDate: start, endDate: today };
}

/**
 * Format seconds into minutes and seconds
 */
async function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
} 