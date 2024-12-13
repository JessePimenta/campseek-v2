import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { SearchBar } from './components/Search/SearchBar';
import { MapView } from './components/Map/MapView';
import { Playbar } from './components/Playbar/Playbar';
import { GenreTags } from './components/Tags/GenreTags';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { streamBandcampData } from './services/bandcampService';
import type { ReleaseData } from './types/Release';

function App() {
  const [url, setUrl] = useState('https://verraco.bandcamp.com/album/breathe-godspeed');
  const [releases, setReleases] = useState<ReleaseData[]>([]);
  const [filteredReleases, setFilteredReleases] = useState<ReleaseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [releaseTitle, setReleaseTitle] = useState<string>('');
  const noNewReleasesTimer = useRef<NodeJS.Timeout | null>(null);
  const lastReleaseTimestamp = useRef<number>(0);
  const mapRef = useRef<{ centerOnRelease: (release: ReleaseData) => void }>(null);
  
  const { 
    currentlyPlaying, 
    currentRelease,
    playHistory,
    handlePlayToggle, 
    playNextClosest,
    playRandom,
    stopPlayback,
    isPlaying 
  } = useAudioPlayer(filteredReleases, (release) => {
    if (mapRef.current) {
      mapRef.current.centerOnRelease(release);
    }
  });

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const resetSearchState = () => {
    setReleases([]);
    setFilteredReleases([]);
    setIsLoading(true);
    setIsDone(false);
    setReleaseTitle('');
    lastReleaseTimestamp.current = Date.now();
    if (noNewReleasesTimer.current) {
      clearTimeout(noNewReleasesTimer.current);
      noNewReleasesTimer.current = null;
    }
  };

  const startCrawl = async () => {
    resetSearchState();

    try {
      await streamBandcampData(
        url, 
        (releaseData) => {
          setReleases(prev => {
            const newReleases = [...prev, releaseData];
            setFilteredReleases(newReleases);
            return newReleases;
          });

          // Update last release timestamp and reset timer
          lastReleaseTimestamp.current = Date.now();
          if (noNewReleasesTimer.current) {
            clearTimeout(noNewReleasesTimer.current);
          }

          // Start new timer
          noNewReleasesTimer.current = setTimeout(() => {
            const timeSinceLastRelease = Date.now() - lastReleaseTimestamp.current;
            if (timeSinceLastRelease >= 30000) {
              setIsDone(true);
              setIsLoading(false);
            }
          }, 30000);
        },
        (sourceRelease) => {
          // Set the release title from the source release
          setReleaseTitle(sourceRelease.release.title);
        }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      setIsDone(true);
    }
  };

  const handleFilterChange = (selectedGenres: string[]) => {
    if (selectedGenres.length === 0) {
      setFilteredReleases(releases);
    } else {
      setFilteredReleases(
        releases.filter(release =>
          selectedGenres.some(genre =>
            release.release.genres.includes(genre)
          )
        )
      );
    }
  };

  const handleSearchFromRelease = () => {
    if (currentRelease) {
      setUrl(currentRelease.release.url);
      startCrawl();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (noNewReleasesTimer.current) {
        clearTimeout(noNewReleasesTimer.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen gradient-bg bg-background pb-[20px]">
      <Header 
        isLoading={isLoading} 
        isDone={isDone} 
        totalReleases={releases.length}
        releaseTitle={releaseTitle}
      />
      
      <main className="max-w-6xl mx-auto py-4 px-6">
        <SearchBar 
          url={url}
          onUrlChange={handleUrlChange}
          onSearch={startCrawl}
          isLoading={isLoading}
        />

        <MapView
          ref={mapRef}
          releases={filteredReleases}
          currentlyPlaying={currentlyPlaying}
          playHistory={playHistory}
          onPlayToggle={handlePlayToggle}
        />

        {releases.length > 0 && (
          <GenreTags 
            releases={releases}
            onFilterChange={handleFilterChange}
          />
        )}
      </main>

      <Playbar
        currentRelease={currentRelease}
        isPlaying={isPlaying}
        onPlayToggle={() => currentRelease && handlePlayToggle(currentRelease.release.streaming_url)}
        onNextTrack={playNextClosest}
        onRandomTrack={playRandom}
        onSearchFromRelease={handleSearchFromRelease}
      />
    </div>
  );
}

export default App;