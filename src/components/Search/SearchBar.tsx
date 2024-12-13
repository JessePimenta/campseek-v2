import { Search } from 'lucide-react';

interface SearchBarProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export function SearchBar({ url, onUrlChange, onSearch, isLoading = false }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8 px-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Enter Bandcamp URL"
            className="text-sm w-full h-[40px] px-4 py-3 pl-12 rounded-[12px] bg-surface text-text border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
        </div>
        <button
          onClick={onSearch}
          className={`px-6 py-0 bg-surface text-text search-btn rounded-[12px] h-[40px] border border-border
            transition-all focus:outline-none hover:bg-[#1789a7] hover:text-[#fff]`}
        >
          search
        </button>
      </div>
    </div>
  );
}