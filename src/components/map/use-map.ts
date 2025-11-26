import createContext from '../../lib/create-context';

/**
 * Context value for Map instance
 */
interface MapContextValue {
  /** The map instance (null if not yet initialized) */
  map: google.maps.Map | null;
}

/**
 * Context for providing map instance to child components
 */
const [MapProvider, useMapContext] = createContext<MapContextValue>(
  'Map',
  { map: null }
);

/**
 * Hook to access the map instance from child components
 * 
 * Must be used within a Map component.
 * 
 * @returns The map context value
 * 
 * @example
 * ```tsx
 * function Marker() {
 *   const { map } = useMap();
 *   
 *   useEffect(() => {
 *     if (!map) return;
 *     
 *     // Use map to add markers, routes, etc.
 *     const marker = new google.maps.Marker({
 *       position: { lat: 0, lng: 0 },
 *       map,
 *     });
 *     
 *     return () => marker.setMap(null);
 *   }, [map]);
 *   
 *   return null;
 * }
 * ```
 */
export const useMap = useMapContext;

export { MapProvider };

