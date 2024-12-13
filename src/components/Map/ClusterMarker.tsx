import { Marker } from 'react-map-gl';

interface ClusterMarkerProps {
  longitude: number;
  latitude: number;
  pointCount: number;
}

export function ClusterMarker({ longitude, latitude, pointCount }: ClusterMarkerProps) {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor="center">
      <div className="relative">
        <div className="absolute -inset-1 bg-purple-500/30 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
          {pointCount}
        </div>
      </div>
    </Marker>
  );
}