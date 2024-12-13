import { Music } from 'lucide-react';

interface HeaderProps {
  isLoading?: boolean;
  isDone?: boolean;
  totalReleases?: number;
  releaseTitle?: string;
}

export function Header({ isLoading, isDone, totalReleases, releaseTitle }: HeaderProps) {
  const getStatusText = () => {
    if (isLoading && (!totalReleases || totalReleases === 0)) {
      return (
        <span className="text-secondary text-xs">
          digging for releases based on {releaseTitle}
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <br/>
          this can take a moment
        </span>
      );
    }
    if (totalReleases && totalReleases > 0) {
      if (isLoading) {
        return (
          <span className="color-text text-xs">
            digging for releases based on {releaseTitle}
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
            <br/>
            found {totalReleases} releases
          </span>
        );
      }
      if (isDone) {
        return (
          <span className="color-text text-xs">
            Done
            <br/>
            found {totalReleases} releases
          </span>
        );
      }
      return (
        <span className="color-text text-sm">
          found {totalReleases} releases
        </span>
      );
    }
    return "Enter a bandcamp URL to explore recent purchases by the fans of that release.";
  };

  return (
    <header className="bg-[#000] text-text pt-4 py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-lg logo font-bold tracking-tight">🔍 campseek</h1>
        </div>
        <p className="text-center text-xs text-text-secondary min-h-[40px] max-w-[380px]">
          {getStatusText()}
        </p>
      </div>
    </header>
  );
}