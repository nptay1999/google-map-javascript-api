/**
 * Google Maps Loader Service
 *
 * A lightweight, framework-agnostic loader for the Google Maps JavaScript API.
 * Handles script loading, caching, cleanup, and URL building.
 *
 * @note This service is browser-only and will not work in Node.js/SSR environments.
 */

/// <reference types="@types/google.maps" />

// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google?: typeof google | undefined;
    __googleMapsCallback__?: () => void;
  }
}

// Type for the google object with full type safety
export interface GoogleMaps {
  maps: typeof google.maps;
}

// Type alias for convenience - now with full type safety
export type GoogleMapsAPI = typeof google;

// Library names for importLibrary
export type GoogleMapsLibrary =
  | 'core'
  | 'maps'
  | 'places'
  | 'geocoding'
  | 'routes'
  | 'marker'
  | 'geometry'
  | 'elevation'
  | 'streetView'
  | 'journeySharing'
  | 'drawing'
  | 'visualization';

export type LoadOptions = {
  libraries?: string[];
  language?: string;
  region?: string;
};

export interface GoogleMapsLoader {
  load(apiKey: string, options?: LoadOptions): Promise<GoogleMapsAPI>;
  isLoaded(): boolean;
  wait(): Promise<GoogleMapsAPI>;
  importLibrary(libraryName: GoogleMapsLibrary): Promise<unknown>;
  getScript(): HTMLScriptElement | null;
  addScript(url: string): HTMLScriptElement;
  dispose(): void;
  buildUrl(apiKey: string, options?: LoadOptions): string;
}

/**
 * Google Maps Loader Singleton
 *
 * Implements the singleton pattern to ensure only one instance exists.
 * This prevents multiple script loads and manages global state properly.
 */
class GoogleMapsLoaderImpl implements GoogleMapsLoader {
  private static instance: GoogleMapsLoaderImpl | null = null;
  private loadingPromise: Promise<GoogleMapsAPI> | null = null;
  private scriptElement: HTMLScriptElement | null = null;

  /**
   * Private constructor to prevent direct instantiation
   * Use GoogleMapsLoaderImpl.getInstance() or the exported googleMapsLoader instead
   */
  private constructor() {
    // Private constructor ensures singleton pattern
  }

  /**
   * Get the singleton instance of GoogleMapsLoader
   *
   * @returns The singleton instance
   *
   * @example
   * ```ts
   * const loader = GoogleMapsLoaderImpl.getInstance();
   * const google = await loader.load('YOUR_API_KEY');
   * ```
   */
  static getInstance(): GoogleMapsLoaderImpl {
    if (!GoogleMapsLoaderImpl.instance) {
      GoogleMapsLoaderImpl.instance = new GoogleMapsLoaderImpl();
    }
    return GoogleMapsLoaderImpl.instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   * This will dispose the current instance and clear the singleton
   *
   * @example
   * ```ts
   * GoogleMapsLoaderImpl.resetInstance();
   * // Next call to getInstance() will create a new instance
   * ```
   */
  static resetInstance(): void {
    if (GoogleMapsLoaderImpl.instance) {
      GoogleMapsLoaderImpl.instance.dispose();
      GoogleMapsLoaderImpl.instance = null;
    }
  }

  /**
   * Load the Google Maps JavaScript API
   *
   * @param apiKey - Your Google Maps API key
   * @param options - Optional configuration (libraries, language, region)
   * @returns Promise that resolves to the google object
   *
   * @example
   * ```ts
   * const google = await loader.load('YOUR_API_KEY', {
   *   libraries: ['places', 'drawing'],
   *   language: 'en',
   *   region: 'US'
   * });
   * ```
   */
  load(apiKey: string, options?: LoadOptions): Promise<GoogleMapsAPI> {
    // If already loaded, return immediately
    if (this.isLoaded()) {
      return Promise.resolve(window.google as GoogleMapsAPI);
    }

    // If loading is in progress, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Start loading
    const url = this.buildUrl(apiKey, options);
    this.loadingPromise = new Promise((resolve, reject) => {
      // Set up the callback that Google Maps will call
      const callbackName = '__googleMapsCallback__';
      window[callbackName] = () => {
        delete window[callbackName];
        resolve(window.google as GoogleMapsAPI);
      };

      // Create and append the script
      const scriptUrl = `${url}&callback=${callbackName}`;
      try {
        this.scriptElement = this.addScript(scriptUrl);

        // Handle script load errors
        this.scriptElement.onerror = () => {
          delete window[callbackName];
          this.loadingPromise = null;
          reject(new Error('Failed to load Google Maps script'));
        };
      } catch (error) {
        delete window[callbackName];
        this.loadingPromise = null;
        reject(error);
      }
    });

    return this.loadingPromise;
  }

  /**
   * Check if Google Maps is already loaded
   *
   * @returns true if google.maps exists
   */
  isLoaded(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.google !== 'undefined' &&
      typeof window.google.maps !== 'undefined'
    );
  }

  /**
   * Wait for an in-progress load to complete
   *
   * @returns Promise that resolves when loading completes, or rejects if not loading
   *
   * @example
   * ```ts
   * if (loader.isLoaded()) {
   *   // Already loaded
   * } else {
   *   const google = await loader.wait();
   * }
   * ```
   */
  wait(): Promise<GoogleMapsAPI> {
    if (this.isLoaded()) {
      return Promise.resolve(window.google as GoogleMapsAPI);
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    return Promise.reject(
      new Error(
        'Google Maps is not loaded and no load is in progress. Call load() first.'
      )
    );
  }

  /**
   * Dynamically import a specific Google Maps library
   *
   * This uses the modern importLibrary API for on-demand library loading.
   * The API must be loaded first via load() or wait().
   *
   * @param libraryName - The name of the library to import (e.g., 'places', 'drawing', 'marker')
   * @returns Promise that resolves to the imported library
   *
   * @example
   * ```ts
   * // Load the base API first
   * await googleMapsLoader.load(apiKey);
   *
   * // Then import libraries as needed
   * const { Map } = await googleMapsLoader.importLibrary('maps') as google.maps.MapsLibrary;
   * const { PlacesService } = await googleMapsLoader.importLibrary('places') as google.maps.PlacesLibrary;
   * const { DrawingManager } = await googleMapsLoader.importLibrary('drawing') as google.maps.DrawingLibrary;
   * ```
   */
  async importLibrary(libraryName: GoogleMapsLibrary): Promise<unknown> {
    // Ensure Google Maps is loaded first
    if (!this.isLoaded()) {
      throw new Error(
        'Google Maps API must be loaded before importing libraries. Call load() first.'
      );
    }

    // Use the native importLibrary function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (google.maps as any).importLibrary(libraryName);
  }

  /**
   * Get the existing script element if it exists
   *
   * @returns The script element or null
   */
  getScript(): HTMLScriptElement | null {
    if (this.scriptElement && document.contains(this.scriptElement)) {
      return this.scriptElement;
    }

    // Try to find an existing Google Maps script in the document
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      this.scriptElement = existingScript;
      return existingScript;
    }

    return null;
  }

  /**
   * Create and add a script tag to the document
   *
   * @param url - The script URL to load
   * @returns The created script element
   */
  addScript(url: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;

    // Append to document head
    document.head.appendChild(script);

    return script;
  }

  /**
   * Clean up all resources (useful for hot reload and testing)
   *
   * Removes the script tag, resets internal state, and clears the global google object.
   *
   * @example
   * ```ts
   * // Clean up before reloading
   * loader.dispose();
   * const google = await loader.load(apiKey, options);
   * ```
   */
  dispose(): void {
    // Remove the script element
    if (this.scriptElement && document.contains(this.scriptElement)) {
      this.scriptElement.remove();
    }

    // Reset internal state
    this.scriptElement = null;
    this.loadingPromise = null;

    // Clear the global google object (optional, but helps with clean reloads)
    if (typeof window !== 'undefined' && window.google) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).google;
    }

    // Clean up any lingering callbacks
    if (typeof window !== 'undefined' && window.__googleMapsCallback__) {
      delete window.__googleMapsCallback__;
    }
  }

  /**
   * Build a properly formatted Google Maps script URL
   *
   * @param apiKey - Your Google Maps API key
   * @param options - Optional configuration (libraries, language, region)
   * @returns Formatted URL string
   *
   * @example
   * ```ts
   * const url = loader.buildUrl('YOUR_API_KEY', {
   *   libraries: ['places', 'drawing'],
   *   language: 'en',
   *   region: 'US'
   * });
   * // Returns: https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,drawing&language=en&region=US
   * ```
   */
  buildUrl(apiKey: string, options?: LoadOptions): string {
    const params = new URLSearchParams();

    // Add API key (required)
    params.append('key', apiKey);

    // Add libraries if specified
    if (options?.libraries && options.libraries.length > 0) {
      params.append('libraries', options.libraries.join(','));
    }

    // Add language if specified
    if (options?.language) {
      params.append('language', options.language);
    }

    // Add region if specified
    if (options?.region) {
      params.append('region', options.region);
    }

    return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
  }
}

/**
 * Singleton instance - recommended way to use the loader
 *
 * This is a pre-instantiated singleton that you can import and use directly.
 *
 * @example
 * ```ts
 * import { googleMapsLoader } from './google-map-api-loader';
 *
 * const google = await googleMapsLoader.load('YOUR_API_KEY', {
 *   libraries: ['places']
 * });
 * ```
 */
export const googleMapsLoader = GoogleMapsLoaderImpl.getInstance();

/**
 * Export the class for advanced use cases
 *
 * Note: The constructor is private. Use GoogleMapsLoaderImpl.getInstance()
 * or the exported `googleMapsLoader` singleton.
 *
 * @example
 * ```ts
 * // Get the singleton instance
 * const loader = GoogleMapsLoaderImpl.getInstance();
 *
 * // Reset singleton (useful for testing)
 * GoogleMapsLoaderImpl.resetInstance();
 * ```
 */
export { GoogleMapsLoaderImpl };
