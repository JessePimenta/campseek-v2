import { useRef, useState, useCallback } from 'react';
import type { ReleaseData } from '../types/Release';
import { parseLocation } from '../utils/locationUtils';

export function useAudioPlayer(releases: ReleaseData[], onReleaseChange?: (release: ReleaseData) => void) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentRelease, setCurrentRelease] = useState<ReleaseData | null>(null);
  const [playHistory, setPlayHistory] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayToggle = useCallback((streamingUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (currentlyPlaying === streamingUrl) {
      setCurrentlyPlaying(null);
      setCurrentRelease(null);
    } else {
      // Add current track to history before changing
      if (currentlyPlaying) {
        setPlayHistory(prev => new Set([...prev, currentlyPlaying]));
      }
      
      const release = releases.find(r => r.release.streaming_url === streamingUrl);
      if (release) {
        setCurrentlyPlaying(streamingUrl);
        setCurrentRelease(release);
        
        if (onReleaseChange) {
          onReleaseChange(release);
        }
        
        audioRef.current = new Audio(streamingUrl);
        audioRef.current.play();
        audioRef.current.onended = () => {
          playNextClosest();
        };
      }
    }
  }, [currentlyPlaying, releases, onReleaseChange]);

  const playNextClosest = useCallback(() => {
    if (!currentRelease) return;

    const currentCoords = parseLocation(currentRelease.release.location);
    if (!currentCoords) return;

    // Filter out current track and tracks in play history
    const availableReleases = releases.filter(r => 
      r.release.streaming_url !== currentlyPlaying && 
      !playHistory.has(r.release.streaming_url)
    );

    // If no unplayed tracks available, reset history and use all tracks except current
    const candidateReleases = availableReleases.length > 0 
      ? availableReleases 
      : releases.filter(r => r.release.streaming_url !== currentlyPlaying);

    // Find closest unplayed release
    let closestRelease: ReleaseData | null = null;
    let minDistance = Infinity;

    candidateReleases.forEach(release => {
      const coords = parseLocation(release.release.location);
      if (!coords) return;

      const distance = Math.sqrt(
        Math.pow(coords.lat - currentCoords.lat, 2) + 
        Math.pow(coords.lng - currentCoords.lng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestRelease = release;
      }
    });

    if (closestRelease) {
      handlePlayToggle(closestRelease.release.streaming_url);
    }
  }, [currentRelease, releases, currentlyPlaying, playHistory, handlePlayToggle]);

  const playRandom = useCallback(() => {
    // Filter out current track and tracks in play history
    const availableReleases = releases.filter(r => 
      r.release.streaming_url !== currentlyPlaying &&
      !playHistory.has(r.release.streaming_url)
    );

    // If no unplayed tracks available, reset history and use all tracks except current
    const candidateReleases = availableReleases.length > 0 
      ? availableReleases 
      : releases.filter(r => r.release.streaming_url !== currentlyPlaying);

    if (candidateReleases.length === 0) return;

    const randomRelease = candidateReleases[Math.floor(Math.random() * candidateReleases.length)];
    handlePlayToggle(randomRelease.release.streaming_url);
  }, [releases, currentlyPlaying, playHistory, handlePlayToggle]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
      setCurrentRelease(null);
    }
  }, []);

  return {
    currentlyPlaying,
    currentRelease,
    playHistory,
    handlePlayToggle,
    playNextClosest,
    playRandom,
    stopPlayback,
    isPlaying: !!currentlyPlaying
  };
}