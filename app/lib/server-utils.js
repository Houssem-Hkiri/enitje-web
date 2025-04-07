/**
 * Server-side only utilities
 * 
 * This file contains functions that should only run on the server
 * and will be excluded from client bundles.
 */

/**
 * Check if code is running on the server
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * Safe dynamic import for server-only dependencies
 * This approach prevents module not found errors during build
 */
export async function dynamicImport(moduleName) {
  // Ensure this only runs on the server
  if (!isServer()) {
    throw new Error(`Cannot import ${moduleName} in browser environment`);
  }

  try {
    // Direct dynamic import - will be excluded from client bundles
    // due to the isServer check above
    return await import(moduleName);
  } catch (error) {
    console.error(`Failed to dynamically import ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Execute a function only if running on the server
 * @param {Function} fn The function to execute
 * @param {any} defaultValue Value to return if not on server
 */
export async function runOnServer(fn, defaultValue = null) {
  if (!isServer()) {
    return defaultValue;
  }
  
  try {
    return await fn();
  } catch (error) {
    console.error('Error running server-only function:', error);
    return defaultValue;
  }
} 