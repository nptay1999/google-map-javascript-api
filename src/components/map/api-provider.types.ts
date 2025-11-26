import type { GoogleMapsAPI } from '../../lib/google-map-api-loader';

/**
 * Context value for Google Maps API
 */
export interface GoogleMapsAPIContextValue {
  /** The loaded Google Maps API (null if loading or error) */
  google: GoogleMapsAPI | null;
  /** Whether the API is currently loading */
  isLoading: boolean;
  /** Error object if the API failed to load */
  error: Error | null;
}

/**
 * Props for the APIProvider component
 */
export interface APIProviderProps {
  /** Google Maps API key (required) */
  apiKey: string;
  /** Array of library names to load (e.g., ['places', 'drawing']) */
  libraries?: string[];
  /** Language code (e.g., 'en', 'es', 'ja') */
  language?: string;
  /** Region code (e.g., 'US', 'GB', 'JP') */
  region?: string;
  /** Child components that will consume the Google Maps API */
  children: React.ReactNode;
}

