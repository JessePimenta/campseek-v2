import { Marker } from 'react-map-gl';
import type { ReleaseData } from '../../types/Release';

interface ArtworkMarkerProps {
  release: ReleaseData;
  isPlaying: boolean;
  onClick: () => void;
  coordinates: { lat: number; lng: number };
}

export function ArtworkMarker({ release, isPlaying, onClick, coordinates }: ArtworkMarkerProps) {
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
        {/* Pulsing ring for playing state */}
        {isPlaying && (
          <div className="absolute -inset-1 bg-purple-500/30 rounded-full animate-pulse" />
        )}
        
        {/* Artwork container */}
        <div className="relative w-4 h-4 overflow-hidden rounded-full shadow-lg">
          <img 
            src={release.release.image_url} 
            alt={release.release.title}
            className="w-full h-full object-cover"
          />
          {/* Border ring */}
          <div className={`
            absolute inset-0 rounded-full border-2
            ${isPlaying ? 'border-purple-500' : 'border-white'}
          `} />
        </div>
      </div>
    </Marker>
  );
}