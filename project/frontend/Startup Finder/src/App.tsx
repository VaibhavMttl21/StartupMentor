import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout } from './firebase';
import { User } from 'firebase/auth';
import { searchMentors } from './services/api';
import { SearchBox } from './components/SearchBox';
import { ResultsList } from './components/ResultsList';


interface Mentor {
  name: string;
  type: string;
  category: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<Mentor[]>([]);
  const [aiResponse, setAIResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError('');
    setNoResultsMessage('');
    try {
      const response = await searchMentors(query);
      setResults(response.matches);
      if (response.matches.length === 0) {
        setNoResultsMessage(response.message || 'No results found');
      } else {
        setAIResponse(response.response);
      }
    } catch (error) {
      setError((error as any).response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError('Failed to sign in');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setResults([]);
      setAIResponse('');
    } catch (error) {
      setError('Failed to sign out');
    }
  };



  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <button
          onClick={handleLogin}
          className="bg-white text-blue-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Out
          </button>
          <h1 className="text-3xl font-bold text-blue-500 mx-auto">Startup Mentor Finder</h1>
        </div>

        <SearchBox onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {noResultsMessage && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {noResultsMessage}
          </div>
        )}

        <ResultsList results={results} />

        {aiResponse && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">AI Response</h2>
            <p>{aiResponse}</p>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default App;