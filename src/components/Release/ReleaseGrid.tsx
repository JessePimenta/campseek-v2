import { ReleaseData } from '../../types/Release';
import { ReleaseCard } from './ReleaseCard';

interface ReleaseGridProps {
  releases: ReleaseData[];
  currentlyPlaying: string | null;
  onPlayToggle: (streamingUrl: string) => void;
}

export function ReleaseGrid({ releases, currentlyPlaying, onPlayToggle }: ReleaseGridProps) {
  if (releases.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Enter a Bandcamp URL and click "Start Crawl" to begin discovering music
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {releases.map((releaseData, index) => (
        <ReleaseCard
          key={`${releaseData.release.url}-${index}`}
          release={releaseData.release}
          collectedBy={releaseData.collected_by}
          isPlaying={currentlyPlaying === releaseData.release.streaming_url}
          onPlayToggle={() => onPlayToggle(releaseData.release.streaming_url)}
        />
      ))}
    </div>
  );
}