interface Mentor {
  name: string;
  type: string;
  category: string;
}

interface ResultsListProps {
  results: Mentor[];
}

export function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recommended Matches</h2>
      <div className="space-y-4">
        {results.map((match, index) => (
          <div
            key={index}
            className="border-b pb-4 last:border-b-0 last:pb-0"
          >
            <h3 className="font-semibold">{match.name}</h3>
            <p className="text-gray-600">
              {match.type} • {match.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}