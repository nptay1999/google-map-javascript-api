import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useGoogleMapsAPI } from './use-google-maps-api';
import { useMap } from './use-map';

/**
 * Props for the Marker component
 */
export interface MarkerProps {
  /** Position of the marker on the map */
  position: google.maps.LatLngLiteral;
  /** Optional map instance (uses context if not provided) */
  map?: google.maps.Map;
  /** Title text for the marker (shown on hover) */
  title?: string;
  /** Callback fired when the marker is clicked */
  onClick?: (event: google.maps.MapMouseEvent) => void;
}

/**
 * Marker Component
 *
 * Displays a standard Google Maps marker on the map.
 * Must be used within a Map component or provide a map prop.
 *
 * @example
 * ```tsx
 * <Map center={{ lat: 37.7749, lng: -122.4194 }} zoom={12}>
 *   <Marker
 *     position={{ lat: 37.7749, lng: -122.4194 }}
 *     title="San Francisco"
 *     onClick={(e) => console.log('Marker clicked:', e.latLng?.toJSON())}
 *   />
 * </Map>
 * ```
 */
export function Marker({
  position,
  map: mapProp,
  title,
  onClick,
}: MarkerProps) {
  const { google } = useGoogleMapsAPI();
  const { map: mapContext } = useMap();
  const markerRef = useRef<google.maps.Marker | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const map = mapProp ?? mapContext;

  // Initialize marker
  useEffect(() => {
    if (!google || !map) return;

    // Create marker instance
    markerRef.current = new google.maps.Marker({
      position,
      map,
      title,
    });

    // Cleanup on unmount
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [google, map]);

  // Update position
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setPosition(position);
  }, [position]);

  // Update title
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setTitle(title || '');
  }, [title]);

  // Handle click events
  useEffect(() => {
    if (!google || !markerRef.current) return;

    // Remove previous listener
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Add new listener if onClick is provided
    if (onClick) {
      clickListenerRef.current = google.maps.event.addListener(
        markerRef.current,
        'click',
        onClick
      );
    }

    // Cleanup
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [google, onClick]);

  return null;
}

/**
 * Props for the AdvancedMarker component
 */
export interface AdvancedMarkerProps {
  /** Position of the marker on the map */
  position: google.maps.LatLngLiteral;
  /** Optional map instance (uses context if not provided) */
  map?: google.maps.Map;
  /** React content to render inside the marker */
  content?: React.ReactNode;
  /** Callback fired when the marker is clicked */
  onClick?: (event: google.maps.MapMouseEvent) => void;
}

/**
 * AdvancedMarker Component
 *
 * Displays an AdvancedMarkerElement with custom HTML/React content.
 * Must be used within a Map component or provide a map prop.
 *
 * @example
 * ```tsx
 * <Map center={{ lat: 37.7749, lng: -122.4194 }} zoom={12}>
 *   <AdvancedMarker
 *     position={{ lat: 37.7749, lng: -122.4194 }}
 *     content={
 *       <div className="bg-blue-500 text-white px-3 py-2 rounded-lg">
 *         Custom Marker
 *       </div>
 *     }
 *     onClick={(e) => console.log('Advanced marker clicked')}
 *   />
 * </Map>
 * ```
 */
export function AdvancedMarker({
  position,
  map: mapProp,
  content,
  onClick,
}: AdvancedMarkerProps) {
  const { google } = useGoogleMapsAPI();
  const { map: mapContext } = useMap();
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const reactRootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const map = mapProp ?? mapContext;

  // Initialize marker
  useEffect(() => {
    if (!google || !map) return;

    const initMarker = async () => {
      // Import marker library
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      // Create content container for React content
      if (content) {
        contentContainerRef.current = document.createElement('div');
        reactRootRef.current = createRoot(contentContainerRef.current);
        reactRootRef.current.render(content);
      }

      // Create advanced marker
      markerRef.current = new AdvancedMarkerElement({
        position,
        map,
        content: contentContainerRef.current || undefined,
      });
    };

    initMarker();

    // Cleanup on unmount
    return () => {
      if (reactRootRef.current) {
        reactRootRef.current.unmount();
        reactRootRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      contentContainerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [google, map]);

  // Update position
  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.position = position;
  }, [position]);

  // Update content
  useEffect(() => {
    if (!reactRootRef.current || !contentContainerRef.current) return;
    reactRootRef.current.render(content);
  }, [content]);

  // Handle click events
  useEffect(() => {
    if (!google || !markerRef.current) return;

    // Remove previous listener
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Add new listener if onClick is provided
    if (onClick) {
      clickListenerRef.current = google.maps.event.addListener(
        markerRef.current,
        'click',
        onClick
      );
    }

    // Cleanup
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [google, onClick]);

  return null;
}
