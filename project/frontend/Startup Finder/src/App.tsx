import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout } from './firebase';
import { User } from 'firebase/auth';
import { searchMentors, getAIResponse } from './services/api';
import { SearchBox } from './components/SearchBox';
import { ResultsList } from './components/ResultsList';
import './App.css';
import { sendEmail } from './Emailsender';

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

  const handleSendEmail = async () => {
    try {
      await sendEmail();
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Startup Finder</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
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
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">AI Response</h2>
            <p>{aiResponse}</p>
          </div>
        )}

        <button
          onClick={handleSendEmail}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Send Test Email
        </button>
      </div>
    </div>
  );
}

export default App;