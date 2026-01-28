import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import RightSidebar from './components/layout/RightSidebar';
import Stories from './components/feed/Stories';
import PostCard from './components/feed/PostCard';
import Profile from './components/profile/Profile';
import CreatePostModal from './components/feed/CreatePostModal';
import { useSocialStore } from './store';

const App: React.FC = () => {
  const { posts, fetchPosts } = useSocialStore();
  const [view, setView] = useState<'feed' | 'profile'>('feed');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-orange-primary/30">
      <Header onCreatePost={() => setIsCreatePostOpen(true)} />

      <div className="max-w-[1920px] mx-auto pt-24 px-4 md:px-8 flex justify-center gap-8">
        {/* Left Sidebar */}
        {view === 'feed' && <Sidebar currentView="home" onNavigate={(newView) => {
          if (newView === 'profile') setView('profile');
          // Handle other navigation when implemented
        }} />}

        {/* Main Content */}
        <main
          className={`w-full ${
            view === 'feed' ? 'max-w-[680px] lg:mx-auto' : 'max-w-[1200px]'
          }`}
        >
          {view === 'feed' ? (
            <>
              <Stories />

              {/* Quick Create Post Button */}
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="w-full bg-bg-card border border-border-primary rounded-2xl p-4 mb-6 flex items-center gap-3 hover:bg-white/5 transition-colors group"
              >
                <img
                  src={useSocialStore.getState().currentUser.avatar}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full border-2 border-border-primary"
                />
                <span className="text-text-muted group-hover:text-text-secondary transition-colors">
                  What's on your mind?
                </span>
              </button>

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-text-muted">No posts yet. Be the first to share!</p>
                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="mt-4 px-6 py-3 bg-orange-primary hover:bg-orange-hover rounded-xl text-white font-semibold transition-all shadow-lg shadow-orange-primary/25"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => <PostCard key={post.id} post={post} />)
                )}
              </div>

              {/* Loading More Indicator */}
              {posts.length > 0 && (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 border-4 border-orange-primary/20 border-t-orange-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-text-muted font-medium">Loading more vibes...</p>
                </div>
              )}
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
              ? 'bg-orange-primary text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setView('profile')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            view === 'profile'
              ? 'bg-orange-primary text-white'
              : 'text-text-muted hover:text-text-primary'
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
