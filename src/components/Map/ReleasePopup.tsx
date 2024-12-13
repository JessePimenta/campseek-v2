import { Play, Pause } from 'lucide-react';
import type { Release, CollectedBy } from '../../types/Release';

interface ReleasePopupProps {
  release: Release;
  collectedBy: CollectedBy;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function ReleasePopup({ release, collectedBy, isPlaying, onPlayToggle }: ReleasePopupProps) {
  return (
    <div className="p-2">
      <div className="flex center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={release.image_url}
            alt={release.title}
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={onPlayToggle}
            className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:bg-black/60"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">
            <a
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              {release.title}
            </a>
          </h3>
          <p className="text-sm text-gray-600 truncate">by {release.artist}</p>
          <p className="text-sm text-gray-500">{release.release_type}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {release.genres.slice(0, 2).map(genre => (
              <span
                key={genre}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}