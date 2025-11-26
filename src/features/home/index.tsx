import { useState } from 'react';
import { Map } from '@/components/map';

const Home = () => {
  const [clickedPosition, setClickedPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold mb-2">Google Maps Example</h1>
        <p className="text-gray-600">
          Click anywhere on the map to see coordinates. Map includes example
          markers.
        </p>
        {clickedPosition && (
          <div className="mt-2 text-sm">
            <strong>Clicked at:</strong> Lat: {clickedPosition.lat.toFixed(6)},
            Lng: {clickedPosition.lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 p-4">
        <Map
          className="w-full h-full rounded-lg shadow-lg overflow-hidden border"
          center={{ lat: 10.8003328, lng: 106.6864119 }} // Ho Chi Minh City
          zoom={15}
          onClick={(e) => {
            const latLng = e.latLng?.toJSON();
            if (latLng) {
              setClickedPosition(latLng);
              console.log('Map clicked at:', latLng);
            }
          }}
          onIdle={(map) => {
            console.log('Map is idle', map);
            console.log(
              'Map is idle. Current center:',
              map.getCenter()?.toJSON()
            );
          }}
        />
      </div>
    </div>
  );
};

export default Home;
