import { useState } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export function SearchBox({ onSearch, loading }: SearchBoxProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your startup and what kind of help you're looking for..."
          className="w-full p-3 border rounded-lg mb-4 h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}