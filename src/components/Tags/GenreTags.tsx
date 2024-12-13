import { useState, useMemo } from 'react';
import type { ReleaseData } from '../../types/Release';
import { CITY_COORDINATES } from '../../utils/locationUtils';

interface GenreTagsProps {
  releases: ReleaseData[];
  onFilterChange: (selectedGenres: string[]) => void;
}

export function GenreTags({ releases, onFilterChange }: GenreTagsProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [visibleLocationCount, setVisibleLocationCount] = useState(16);
  const [visibleStyleCount, setVisibleStyleCount] = useState(16);

  const { locationCounts, styleCounts } = useMemo(() => {
    const locations = new Map<string, number>();
    const styles = new Map<string, number>();

    releases.forEach(release => {
      release.release.genres.forEach(genre => {
        if (Object.keys(CITY_COORDINATES).some(loc => genre.includes(loc.split(',')[0]))) {
          locations.set(genre, (locations.get(genre) || 0) + 1);
        } else {
          styles.set(genre, (styles.get(genre) || 0) + 1);
        }
      });
    });

    return {
      locationCounts: new Map([...locations.entries()].sort((a, b) => b[1] - a[1])),
      styleCounts: new Map([...styles.entries()].sort((a, b) => b[1] - a[1]))
    };
  }, [releases]);

  const handleTagClick = (genre: string) => {
    const newSelected = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newSelected);
    onFilterChange(newSelected);
  };

  const showMoreLocations = () => {
    setVisibleLocationCount(prev => Math.min(prev + 16, locationCounts.size));
  };

  const showLessLocations = () => {
    setVisibleLocationCount(16);
  };

  const showMoreStyles = () => {
    setVisibleStyleCount(prev => Math.min(prev + 16, styleCounts.size));
  };

  const showLessStyles = () => {
    setVisibleStyleCount(16);
  };

  const renderTag = ([genre, count]: [string, number], isSelected: boolean) => (
    <button
      key={genre}
      onClick={() => handleTagClick(genre)}
      className={`
        group flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap
        transition-all duration-200 ease-in-out
        border border-border
        ${isSelected 
          ? 'bg-white text-black hover:bg-white hover:opacity-80' 
          : 'bg-surface text-text hover:bg-surface-hover hover:text-background'
        }
      `}
    >
      <span>{genre}</span>
      <span className={`
        min-w-[20px] px-2 py-0.5 rounded-full text-[10px] text-center
        transition-colors duration-200
        ${isSelected
          ? 'bg-primary-hover text-text'
          : 'bg-primary-hover text-text'
        }
      `}>
        {count}
      </span>
    </button>
  );

  const visibleLocations = Array.from(locationCounts.entries()).slice(0, visibleLocationCount);
  const visibleStyles = Array.from(styleCounts.entries()).slice(0, visibleStyleCount);
  
  const remainingLocationsCount = locationCounts.size - visibleLocationCount;
  const remainingStylesCount = styleCounts.size - visibleStyleCount;

  return (
    <div className="space-y-4 pt-8 mb-6">
      {locationCounts.size > 0 && (
        <div className="space-y-2">
          <div className="text-[12px] text-text-secondary px-4">Locations</div>
          <div className="relative">
            <div className="md:flex md:flex-wrap md:gap-2 md:px-4 md:pb-0 md:h-auto
                          flex flex-col h-[76px] overflow-x-auto overflow-y-hidden pb-4 px-4 gap-2 scrollbar-hide">
              <div className="flex gap-2 md:hidden">
                {visibleLocations.map(entry => 
                  renderTag(entry, selectedGenres.includes(entry[0]))
                )}
                {remainingLocationsCount > 0 && (
                  <button
                    onClick={showMoreLocations}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out whitespace-nowrap"
                  >
                    View More ({remainingLocationsCount})
                  </button>
                )}
                {visibleLocationCount > 16 && (
                  <button
                    onClick={showLessLocations}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out whitespace-nowrap"
                  >
                    View Less
                  </button>
                )}
              </div>
              <div className="hidden md:flex md:flex-wrap md:gap-2">
                {visibleLocations.map(entry => 
                  renderTag(entry, selectedGenres.includes(entry[0]))
                )}
                {remainingLocationsCount > 0 && (
                  <button
                    onClick={showMoreLocations}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out"
                  >
                    View More ({remainingLocationsCount})
                  </button>
                )}
                {visibleLocationCount > 16 && (
                  <button
                    onClick={showLessLocations}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out"
                  >
                    View Less
                  </button>
                )}
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>
        </div>
      )}

      {styleCounts.size > 0 && (
        <div className="space-y-2">
          <div className="text-[12px] text-text-secondary px-4">Styles</div>
          <div className="relative">
            <div className="md:flex md:flex-wrap md:gap-2 md:px-4 md:pb-0 md:h-auto
                          flex flex-col h-[76px] overflow-x-auto overflow-y-hidden pb-4 px-4 gap-2 scrollbar-hide">
              <div className="flex gap-2 md:hidden">
                {visibleStyles.map(entry => 
                  renderTag(entry, selectedGenres.includes(entry[0]))
                )}
                {remainingStylesCount > 0 && (
                  <button
                    onClick={showMoreStyles}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out whitespace-nowrap"
                  >
                    View More ({remainingStylesCount})
                  </button>
                )}
                {visibleStyleCount > 16 && (
                  <button
                    onClick={showLessStyles}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out whitespace-nowrap"
                  >
                    View Less
                  </button>
                )}
              </div>
              <div className="hidden md:flex md:flex-wrap md:gap-2">
                {visibleStyles.map(entry => 
                  renderTag(entry, selectedGenres.includes(entry[0]))
                )}
                {remainingStylesCount > 0 && (
                  <button
                    onClick={showMoreStyles}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out"
                  >
                    View More ({remainingStylesCount})
                  </button>
                )}
                {visibleStyleCount > 16 && (
                  <button
                    onClick={showLessStyles}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-surface text-text 
                             border border-border hover:bg-surface-hover hover:text-background
                             transition-all duration-200 ease-in-out"
                  >
                    View Less
                  </button>
                )}
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>
        </div>
      )}
    </div>
  );
}