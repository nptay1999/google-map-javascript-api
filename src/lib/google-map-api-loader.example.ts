/**
 * Simple usage example for the Google Maps Loader
 */

import {
  googleMapsLoader,
  GoogleMapsLoaderImpl,
} from './google-map-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../configs/constants';

/**
 * Example 1: Basic usage - Load and initialize a map
 *
 * Note: For full type safety, install @types/google.maps:
 * npm install -D @types/google.maps
 */
export async function initializeBasicMap() {
  try {
    // Load Google Maps API
    const google = await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);

    // Create a map
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      throw new Error('Map element not found');
    }

    // Now with full type safety from @types/google.maps
    const map = new google.maps.Map(mapElement, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
    });

    console.log('Map initialized successfully!', map);
    return map;
  } catch (error) {
    console.error('Failed to initialize map:', error);
    throw error;
  }
}

/**
 * Example 2: Load with libraries (Places, Drawing, etc.)
 */
export async function initializeMapWithLibraries() {
  try {
    const google = await googleMapsLoader.load(GOOGLE_MAPS_API_KEY, {
      libraries: ['places', 'drawing', 'geometry'],
      language: 'en',
      region: 'US',
    });

    console.log('Google Maps loaded with libraries!', google);
    return google;
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
    throw error;
  }
}

/**
 * Example 3: Check if already loaded
 */
export function checkMapLoaded() {
  if (googleMapsLoader.isLoaded()) {
    console.log('Google Maps is already loaded!');
    return true;
  } else {
    console.log('Google Maps is not loaded yet');
    return false;
  }
}

/**
 * Example 4: Wait for an in-progress load
 */
export async function waitForMapLoad() {
  try {
    const google = await googleMapsLoader.wait();
    console.log('Google Maps load completed!', google);
    return google;
  } catch (error) {
    console.error('No load in progress:', error);
    throw error;
  }
}

/**
 * Example 5: Build custom URL
 */
export function buildCustomUrl() {
  const url = googleMapsLoader.buildUrl(GOOGLE_MAPS_API_KEY, {
    libraries: ['places', 'visualization'],
    language: 'ja',
    region: 'JP',
  });

  console.log('Custom Google Maps URL:', url);
  return url;
}

/**
 * Example 6: Modern approach with importLibrary (recommended)
 *
 * This is Google's newer way to load libraries on-demand.
 * Benefits: smaller initial bundle, better code splitting, type-safe
 */
export async function initializeMapWithImportLibrary() {
  try {
    // 1. Load the base Google Maps API (without pre-loading libraries)
    await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);

    // 2. Import only the libraries you need, when you need them
    const { Map } = (await googleMapsLoader.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;
    const { Marker } = (await googleMapsLoader.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    // 3. Create a map
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      throw new Error('Map element not found');
    }

    const map = new Map(mapElement, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
      mapId: 'DEMO_MAP_ID', // Required for advanced markers
    });

    // 4. Create an advanced marker
    const marker = new Marker({
      map,
      position: { lat: 37.7749, lng: -122.4194 },
      title: 'San Francisco',
    });

    console.log('Map and marker initialized with importLibrary!', {
      map,
      marker,
    });
    return { map, marker };
  } catch (error) {
    console.error('Failed to initialize map with importLibrary:', error);
    throw error;
  }
}

/**
 * Example 7: Import Places library on-demand
 */
export async function searchPlaces(query: string) {
  try {
    // Ensure Maps API is loaded
    if (!googleMapsLoader.isLoaded()) {
      await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);
    }

    // Import Places library only when needed
    const { PlacesService, PlacesServiceStatus } =
      (await googleMapsLoader.importLibrary(
        'places'
      )) as google.maps.PlacesLibrary;

    // Create a dummy map element for PlacesService
    const mapElement = document.createElement('div');
    const map = new google.maps.Map(mapElement, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
    });

    const service = new PlacesService(map);

    return new Promise((resolve, reject) => {
      service.textSearch({ query }, (results, status) => {
        if (status === PlacesServiceStatus.OK && results) {
          console.log('Places found:', results);
          resolve(results);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Failed to search places:', error);
    throw error;
  }
}

/**
 * Example 8: Import Drawing library on-demand
 */
export async function enableDrawingTools(map: google.maps.Map) {
  try {
    // Import Drawing library only when needed
    const { DrawingManager } = (await googleMapsLoader.importLibrary(
      'drawing'
    )) as google.maps.DrawingLibrary;

    const drawingManager = new DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
    });

    drawingManager.setMap(map);
    console.log('Drawing tools enabled!', drawingManager);
    return drawingManager;
  } catch (error) {
    console.error('Failed to enable drawing tools:', error);
    throw error;
  }
}

/**
 * Example 9: Clean up (useful for hot reload)
 */
export function cleanupGoogleMaps() {
  googleMapsLoader.dispose();
  console.log('Google Maps cleaned up');
}

/**
 * Example 10: Using the singleton pattern explicitly
 *
 * Demonstrates accessing the singleton via getInstance() method
 */
export async function usingSingletonPattern() {
  try {
    // Method 1: Use the pre-exported singleton (recommended)
    const google1 = await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);

    // Method 2: Get the singleton instance explicitly
    const loader = GoogleMapsLoaderImpl.getInstance();
    const google2 = await loader.load(GOOGLE_MAPS_API_KEY);

    // Both return the same instance
    console.log('Same instance?', google1 === google2); // true
    console.log('Both are loaded?', googleMapsLoader.isLoaded()); // true

    return google1;
  } catch (error) {
    console.error('Singleton pattern example failed:', error);
    throw error;
  }
}

/**
 * Example 11: Reset singleton (useful for testing)
 */
export function resetSingletonForTesting() {
  // This will dispose the current instance and allow a fresh start
  GoogleMapsLoaderImpl.resetInstance();
  console.log('Singleton has been reset');
  console.log('Is loaded?', googleMapsLoader.isLoaded()); // false (new instance)
}
