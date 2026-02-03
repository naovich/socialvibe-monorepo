import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import RightSidebar from './components/layout/RightSidebar';
import StoriesList from './features/stories/components/StoriesList';
import Profile from './components/profile/Profile';
import FeedContainer from './features/feed/components/FeedContainer';
import CreatePostModal from './features/feed/components/CreatePostModal';

const App: React.FC = () => {
  const [view, setView] = useState<'feed' | 'profile'>('feed');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Keyboard shortcut: Cmd/Ctrl + K to open create post
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCreatePostOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-primary/30">
      <Header onCreatePost={() => setIsCreatePostOpen(true)} />

      <div className="max-w-[1920px] mx-auto pt-24 px-4 md:px-8 flex justify-center gap-8">
        {/* Left Sidebar */}
        {view === 'feed' && (
          <Sidebar
            currentView="home"
            onNavigate={(newView) => {
              if (newView === 'profile') setView('profile');
            }}
          />
        )}

        {/* Main Content */}
        <main
          className={`w-full ${
            view === 'feed' ? 'max-w-[680px] lg:mx-auto' : 'max-w-[1200px]'
          }`}
        >
          {view === 'feed' ? (
            <>
              {/* Stories */}
              <StoriesList />

              {/* Feed Container with all posts */}
              <FeedContainer onCreatePost={() => setIsCreatePostOpen(true)} />
            </>
          ) : (
            <Profile />
          )}
        </main>

        {/* Right Sidebar */}
        {view === 'feed' && <RightSidebar />}
      </div>

      {/* Navigation for demo/prototype */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bg-card/80 backdrop-blur-xl border border-border-primary p-1.5 rounded-full flex gap-1 z-[2000] shadow-2xl">
        <button
          onClick={() => setView('feed')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            view === 'feed'
              ? 'bg-primary text-text-primary shadow-lg'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setView('profile')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            view === 'profile'
              ? 'bg-primary text-text-primary shadow-lg'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'
          }`}
        >
          Profile
        </button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </div>
  );
};

export default App;
