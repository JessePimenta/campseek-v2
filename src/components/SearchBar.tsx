interface SearchBarProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSearch: () => void;
}

export function SearchBar({ url, onUrlChange, onSearch }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter a Bandcamp release URL"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none"
        >
          Search
        </button>
      </div>
    </div>
  );
}