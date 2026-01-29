import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '../store';
import App from '../App';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, fetchCurrentUser, fetchPosts, fetchStories, connectWebSocket } = useSocialStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Load user if not already loaded
        if (!currentUser) {
          await fetchCurrentUser();
        }
        
        // Load posts and stories
        await Promise.all([
          fetchPosts(),
          fetchStories(),
        ]);
        
        // Connect WebSocket
        connectWebSocket();
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        localStorage.clear();
        navigate('/login');
      }
    };

    initializeApp();
  }, [currentUser, fetchCurrentUser, fetchPosts, fetchStories, connectWebSocket, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading SocialVibe...</p>
        </div>
      </div>
    );
  }

  return <App />;
};

export default Home;
