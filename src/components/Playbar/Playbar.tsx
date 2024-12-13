import { Play, Pause, Search, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DiceIcon } from '../Icons/DiceIcon';
import { NextIcon } from '../Icons/NextIcon';
import type { ReleaseData } from '../../types/Release';

interface PlaybarProps {
  currentRelease: ReleaseData | null;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNextTrack: () => void;
  onRandomTrack: () => void;
  onSearchFromRelease: () => void;
}

export function Playbar({ 
  currentRelease, 
  isPlaying, 
  onPlayToggle, 
  onNextTrack, 
  onRandomTrack,
  onSearchFromRelease
}: PlaybarProps) {
  const [isNextPressed, setIsNextPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIsNextPressed(true);
        onNextTrack();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIsNextPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNextTrack]);

  if (!currentRelease) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#2d2d2dbf] backdrop-blur-lg z-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-2 h-full  flex items-center gap-2">
        {/* Album Art and Info */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="relative md:w-[44px] md:h-[44px] w-[32px] h-[32px] flex-shrink-0 group cursor-pointer" onClick={onPlayToggle}>
            <img
              src={currentRelease.release.image_url}
              alt={currentRelease.release.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-[#fff] truncate md:text-sm">
              {currentRelease.release.title}
            </div>
            <div className="text-xs text-text-secondary truncate md:text-sm">
              by {currentRelease.release.artist}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile View */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onSearchFromRelease}
              className="h-[35px] w-[35px] flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface-hover transition-colors group"
              title="Add to search"
            >
              <Search className="w-3.5 h-3.5 text-white group-hover:text-black" />
            </button>

            <button
              onClick={onNextTrack}
              className={`h-[35px] w-[35px] flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface-hover transition-colors group ${
                isNextPressed ? 'bg-surface-hover' : ''
              }`}
              title="Play next closest track"
            >
              <NextIcon className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={onRandomTrack}
              className="h-[35px] w-[35px] flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface-hover transition-colors group"
              title="Play random track"
            >
              <DiceIcon className="w-3.5 h-3.5 text-white group-hover:text-black" />
            </button>

            <a
              href={currentRelease.release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="md:h-[35px] md:w-[35px] h-[32px] w-[32px] flex items-center justify-center rounded-lg bg-primary-hover text-background hover:bg-primary-hover transition-colors"
              title="Buy on Bandcamp"
            >
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </a>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onSearchFromRelease}
              className="h-[35px] px-4 flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface-hover transition-colors"
              title="Add to search"
            >
              <p>add to search</p>
            </button>

            <button
              onClick={onNextTrack}
              className={`h-[35px] px-4 flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface-hover transition-colors ${
                isNextPressed ? 'bg-surface-hover' : ''
              }`}
              title="Play next closest track"
            >
              <p>next</p>
            </button>
            
            <button
              onClick={onRandomTrack}
              className="h-[35px] px-4 flex items-center justify-center rounded-lg bg-surface border border-border hover:bg-surface-hover transition-colors"
              title="Play random track"
            >
              <p>random</p>
            </button>

            <a
              href={currentRelease.release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="playbar h-[33px] px-4 flex items-center justify-center gap-2 rounded-lg bg-primary-hover text-background hover:bg-primary-hover transition-colors"
              title="Buy on Bandcamp"
            >
              <span className="font-medium text-[#fff]">buy</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}