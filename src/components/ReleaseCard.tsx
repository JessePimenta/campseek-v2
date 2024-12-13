import { Play, Pause } from 'lucide-react';
import { Release, CollectedBy } from '../types/Release';

interface ReleaseCardProps {
  release: Release;
  collectedBy: CollectedBy;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function ReleaseCard({ release, collectedBy, isPlaying, onPlayToggle }: ReleaseCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
      <div 
        className="relative cursor-pointer group"
        onClick={onPlayToggle}
      >
        <img 
          src={release.image_url} 
          alt={release.title}
          className="w-full h-[300px] object-cover"
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity
          ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          <a 
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            {release.title}
          </a>
        </h3>
        <p className="text-gray-700 mb-3">by {release.artist}</p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p>📍 {release.location}</p>
          <p>🎵 {release.release_type}</p>
          <p>📅 {new Date(release.release_date).toLocaleDateString()}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {release.genres.map((genre) => (
            <span 
              key={genre}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Found via:{' '}
            <a
              href={collectedBy.bandcamp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {collectedBy.name}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}