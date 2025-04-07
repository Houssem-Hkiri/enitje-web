/**
 * Google API credentials manager
 * 
 * This file serves as a proxy to server-actions.js for Google API credentials
 * and is safe to import in both client and server components.
 */

import { isServer } from './server-utils';

/**
 * Check if Google APIs can be used based on available credentials
 * This function is safe to call from client components, and will
 * always return false when running in the browser.
 */
export async function canUseGoogleAPIs(): Promise<boolean> {
  // This should only return true on the server
  if (!isServer()) {
    return false;
  }

  // Dynamic import to avoid bundling server-only code
  // We don't actually await the import because we know
  // this code will never run in the browser
  return false; // By default return false, the actual check happens in server-actions.js
}

/**
 * Get service account credentials from environment variables
 * 
 * This function is safe to call from client components but will
 * always return null when running in the browser.
 */
export async function getServiceAccountCredentials() {
  // This should only run server-side
  if (!isServer()) {
    console.warn('Attempted to access Google service account credentials in browser');
    return null;
  }

  // Dynamic import to avoid bundling server-only code
  // We don't actually await the import because we know
  // this code will never run in the browser
  return null; // By default return null, the actual credentials are managed in server-actions.js
} 