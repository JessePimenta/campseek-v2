import { Marker } from 'react-map-gl';
import type { ReleaseData } from '../../types/Release';

interface MapMarkerProps {
  release: ReleaseData;
  isPlaying: boolean;
  onClick: () => void;
  coordinates: { lat: number; lng: number };
}

export function MapMarker({ release, isPlaying, onClick, coordinates }: MapMarkerProps) {
  return (
    <Marker
      longitude={coordinates.lng}
      latitude={coordinates.lat}
      anchor="center"
      onClick={e => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div 
        className={`
          relative cursor-pointer transition-all duration-300
          ${isPlaying ? 'scale-125' : 'hover:scale-110'}
        `}
      >
        <div className="absolute -inset-2 bg-purple-500/30 rounded-full animate-pulse" />
        <div className="relative w-4 h-4 bg-purple-600 rounded-full shadow-lg border-2 border-white" />
      </div>
    </Marker>
  );
}