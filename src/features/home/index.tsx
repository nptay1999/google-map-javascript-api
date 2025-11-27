import { useState } from 'react';
import { Map, Marker, AdvancedMarker } from '@/components/map';

const Home = () => {
  const [clickedPosition, setClickedPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Example locations in Ho Chi Minh City
  const locations = [
    {
      id: 'landmark-81',
      name: 'Landmark 81',
      position: { lat: 10.7944, lng: 106.7217 },
    },
    {
      id: 'ben-thanh',
      name: 'Ben Thanh Market',
      position: { lat: 10.7726, lng: 106.698 },
    },
    {
      id: 'notre-dame',
      name: 'Notre-Dame Cathedral',
      position: { lat: 10.7798, lng: 106.699 },
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold mb-2">Google Maps Marker Demo</h1>
        <p className="text-gray-600">
          Demonstrates standard markers and advanced markers with custom React
          content.
        </p>
        {clickedPosition && (
          <div className="mt-2 text-sm">
            <strong>Clicked at:</strong> Lat: {clickedPosition.lat.toFixed(6)},
            Lng: {clickedPosition.lng.toFixed(6)}
          </div>
        )}
        {selectedMarker && (
          <div className="mt-2 text-sm">
            <strong>Selected marker:</strong> {selectedMarker}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 p-4">
        <Map
          className="w-full h-full rounded-lg shadow-lg overflow-hidden border"
          center={{ lat: 10.78, lng: 106.7 }} // Ho Chi Minh City
          zoom={13}
          mapId="DEMO_MAP_ID"
          onClick={(e) => {
            const latLng = e.latLng?.toJSON();
            console.log('Clicked at:', e);
            if (latLng) {
              setClickedPosition(latLng);
              setSelectedMarker(null);
            }
          }}
        >
          {/* Standard Markers */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              title={location.name}
              onClick={() => {
                setSelectedMarker(location.name);
                console.log('Standard marker clicked:', location.name);
              }}
            />
          ))}

          {/* Advanced Markers with custom React content */}
          <AdvancedMarker
            position={{ lat: 10.763, lng: 106.682 }}
            onClick={() => {
              setSelectedMarker('Custom Styled Marker');
              console.log('Advanced marker clicked');
            }}
            content={
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
                📍 Custom Marker
              </div>
            }
          />

          <AdvancedMarker
            position={{ lat: 10.785, lng: 106.71 }}
            onClick={() => {
              setSelectedMarker('Info Card Marker');
            }}
            content={
              <div className="bg-white border-2 border-red-500 rounded-lg shadow-xl p-3 min-w-[150px]">
                <div className="font-bold text-red-600 mb-1">🏢 Important</div>
                <div className="text-xs text-gray-600">Click for details</div>
              </div>
            }
          />

          <AdvancedMarker
            position={{ lat: 10.77, lng: 106.715 }}
            onClick={() => {
              setSelectedMarker('Badge Marker');
            }}
            content={
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg shadow-lg">
                  <div className="text-xs font-semibold">NEW</div>
                  <div className="text-sm">Location</div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-pink-500"></div>
              </div>
            }
          />

          {/* Clicked position marker */}
          {clickedPosition && (
            <AdvancedMarker
              key={JSON.stringify(clickedPosition)}
              position={clickedPosition}
              content={
                <div className="bg-green-500 text-white px-3 py-1 rounded shadow-md text-xs font-semibold">
                  ✓ Clicked
                </div>
              }
            />
          )}
        </Map>
      </div>
    </div>
  );
};

export default Home;
