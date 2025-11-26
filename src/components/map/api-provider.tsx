import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  googleMapsLoader,
  type GoogleMapsAPI,
  type LoadOptions,
} from '../../lib/google-map-api-loader';
import type { APIProviderProps } from './api-provider.types';
import { GoogleMapsAPIProvider } from './use-google-maps-api';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Spinner } from '../ui/spinner';
import { AlertTriangleIcon } from 'lucide-react';

/**
 * APIProvider Component
 *
 * Loads the Google Maps JavaScript API and provides it to child components via context.
 * Handles loading states and errors with built-in UI.
 *
 * @example
 * ```tsx
 * <APIProvider apiKey="YOUR_API_KEY" libraries={['places', 'drawing']}>
 *   <Map />
 * </APIProvider>
 * ```
 */
export function APIProvider({
  apiKey,
  libraries,
  language,
  region,
  children,
}: APIProviderProps) {
  // Build load options
  const loadOptions: LoadOptions = useMemo(
    () => ({
      libraries,
      language,
      region,
    }),
    [libraries, language, region]
  );

  // Use React Query to load Google Maps API
  const {
    data: google,
    isLoading,
    error,
  } = useQuery<GoogleMapsAPI, Error>({
    queryKey: ['google-maps-api', apiKey, loadOptions],
    queryFn: () => googleMapsLoader.load(apiKey, loadOptions),
    staleTime: Infinity, // API is loaded once and never becomes stale
    gcTime: Infinity, // Keep in cache forever
    retry: 1, // Retry once on failure
  });

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] flex-col gap-3">
        <Spinner className="size-10" />
        <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-5">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangleIcon />
          <AlertTitle>Failed to Load Google Maps</AlertTitle>
          <AlertDescription>
            <p>{error.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Please check your API key and network connection.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render children with context when loaded
  return (
    <GoogleMapsAPIProvider
      google={google ?? null}
      isLoading={false}
      error={null}
    >
      {children}
    </GoogleMapsAPIProvider>
  );
}
