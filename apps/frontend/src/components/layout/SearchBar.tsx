import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Hash, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'hashtag';
  data: {
    name?: string;
    username?: string;
    avatar?: string;
    followers?: number;
    tag?: string;
    posts?: number;
    caption?: string;
    image?: string;
    user?: {
      name: string;
      avatar: string;
    };
  };
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'hashtags'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'user',
        data: {
          name: 'Sarah Wilson',
          username: 'sarah_w',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          followers: 856,
        },
      },
      {
        id: '2',
        type: 'hashtag',
        data: {
          tag: 'coding',
          posts: 12500,
        },
      },
      {
        id: '3',
        type: 'post',
        data: {
          caption: 'Working on a new project! 💻✨ #coding #webdev',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200',
          user: {
            name: 'Alex Thompson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          },
        },
      },
    ];

    setResults(mockResults);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredResults = results.filter((result) => {
    if (activeTab === 'all') return true;
    return result.type === (activeTab === 'users' ? 'user' : activeTab === 'posts' ? 'post' : 'hashtag');
  });

  return (
    <>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            size={20}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search... (⌘K)"
            className="w-full bg-bg-secondary border border-border-primary rounded-full pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isOpen && (query || true) && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Results Panel */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full max-w-2xl bg-bg-card border border-border-primary rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Tabs */}
                {query && (
                  <div className="flex items-center gap-2 p-2 border-b border-border-primary">
                    {(['all', 'users', 'posts', 'hashtags'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === tab
                            ? 'bg-primary text-white'
                            : 'text-text-muted hover:bg-white/5'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Results */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  {!query ? (
                    // Recent Searches / Trending
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Trending
                      </h3>
                      <div className="space-y-2">
                        {['#coding', '#design', '#AI'].map((tag) => (
                          <button
                            key={tag}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <Hash size={16} className="text-primary" />
                            <span className="text-sm text-text-primary">{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="divide-y divide-border-secondary">
                      {filteredResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-3 hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          {result.type === 'user' && (
                            <div className="flex items-center gap-3">
                              <img
                                src={result.data.avatar}
                                alt={result.data.name}
                                className="w-10 h-10 rounded-full border border-border-primary"
                              />
                              <div>
                                <p className="font-semibold text-text-primary text-sm">
                                  {result.data.name}
                                </p>
                                <p className="text-xs text-text-muted">
                                  @{result.data.username} · {result.data.followers} followers
                                </p>
                              </div>
                            </div>
                          )}

                          {result.type === 'hashtag' && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Hash size={20} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-text-primary text-sm">
                                  #{result.data.tag}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {result.data.posts?.toLocaleString() ?? 0} posts
                                </p>
                              </div>
                            </div>
                          )}

                          {result.type === 'post' && (
                            <div className="flex gap-3">
                              {result.data.image && (
                                <img
                                  src={result.data.image}
                                  alt="Post"
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary line-clamp-2">
                                  {result.data.caption}
                                </p>
                                {result.data.user && (
                                  <p className="text-xs text-text-muted mt-1">
                                    by {result.data.user.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-text-muted">No results found for "{query}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SearchBar;
