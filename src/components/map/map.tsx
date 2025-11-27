import { useEffect, useRef, useState } from 'react';
import { useGoogleMapsAPI } from './use-google-maps-api';
import { MapProvider } from './use-map';

/**
 * Props for the Map component
 */
export interface MapProps {
  /** Optional className for the wrapper div */
  className?: string;
  /** Center position of the map */
  center?: google.maps.LatLngLiteral;
  /** Zoom level of the map */
  zoom?: number;
  /** Map ID (required for Advanced Markers) */
  mapId?: string;
  /** Callback fired when the map is clicked */
  onClick?: (e: google.maps.MapMouseEvent) => void;
  /** Callback fired when the map becomes idle */
  onIdle?: (map: google.maps.Map) => void;
  /** Child components (markers, routes, etc.) */
  children?: React.ReactNode;
}

/**
 * Map Component
 *
 * Displays a Google Map using the Google Maps JavaScript API.
 * Must be used within an APIProvider component.
 *
 * @example
 * ```tsx
 * <APIProvider apiKey="YOUR_API_KEY">
 *   <Map
 *     center={{ lat: 37.7749, lng: -122.4194 }}
 *     zoom={12}
 *     onClick={(e) => console.log('Clicked at:', e.latLng?.toJSON())}
 *   />
 * </APIProvider>
 * ```
 */
export function Map({
  className,
  center = { lat: 0, lng: 0 },
  zoom = 10,
  mapId,
  onClick,
  onIdle,
  children,
}: MapProps) {
  const { google } = useGoogleMapsAPI();
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Initialize map once when google API and container are ready
  useEffect(() => {
    if (!google || !containerRef.current || map) return;

    const initMap = async () => {
      const { Map } = (await google.maps.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;

      const mapInstance = new Map(containerRef.current!, {
        center,
        zoom,
        mapId,
        disableDefaultUI: false,
      });

      setMap(mapInstance);
    };

    initMap();
  }, [google, map, center, zoom, mapId]);

  // Sync center and zoom props to map instance
  useEffect(() => {
    if (!map) return;

    map.setCenter(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  // Event listeners
  useEffect(() => {
    if (!map || !google) return;

    const listeners: google.maps.MapsEventListener[] = [];

    if (onClick) {
      listeners.push(google.maps.event.addListener(map, 'click', onClick));
    }

    if (onIdle) {
      listeners.push(
        google.maps.event.addListener(map, 'idle', () => onIdle(map))
      );
    }

    // Cleanup function
    return () => {
      listeners.forEach((listener) => {
        google.maps.event.removeListener(listener);
      });
    };
  }, [map, onClick, onIdle, google]);

  return (
    <MapProvider map={map}>
      <div className={className}>
        <div ref={containerRef} className="w-full h-full" />
        {children}
      </div>
    </MapProvider>
  );
}
