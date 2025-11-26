import createContext from '../../lib/create-context';
import type { GoogleMapsAPIContextValue } from './api-provider.types';

// Create the context using the createContext helper
const [GoogleMapsAPIProvider, useGoogleMapsAPIContext] = createContext<GoogleMapsAPIContextValue>(
  'GoogleMapsAPI',
  {
    google: null,
    isLoading: true,
    error: null,
  }
);

/**
 * Hook to access the Google Maps API context
 * 
 * Must be used within an APIProvider component.
 * 
 * @returns The Google Maps API context value
 * 
 * @example
 * ```tsx
 * function Map() {
 *   const { google, isLoading, error } = useGoogleMapsAPI();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   // Use google.maps to create map components
 *   return <div ref={mapRef} />;
 * }
 * ```
 */
export const useGoogleMapsAPI = useGoogleMapsAPIContext;

export { GoogleMapsAPIProvider };

