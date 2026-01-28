import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Hash, User, Clock } from 'lucide-react';
import { searchService } from '../services/searchService';
import type { SearchResult } from '../types/search.types';

interface SearchBarProps {
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSelect, 
  placeholder = 'Search users, hashtags...' 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(searchService.getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const data = await searchService.search(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    searchService.addRecentSearch(query);
    setQuery('');
    setResults([]);
    setIsFocused(false);
    onSelect?.(result);
  };

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  const clearRecent = () => {
    searchService.clearRecentSearches();
    setRecentSearches([]);
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'user': return User;
      case 'hashtag': return Hash;
      default: return Search;
    }
  };

  const showDropdown = isFocused && (query.trim() || recentSearches.length > 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full bg-bg-secondary border border-border-primary rounded-full pl-12 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-primary rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {query.trim() ? (
            // Search Results
            isLoading ? (
              <div className="p-4 text-center text-text-muted text-sm">Searching...</div>
            ) : results.length > 0 ? (
              <div>
                {results.map((result) => {
                  const Icon = getIcon(result.type);
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-bg-secondary transition-colors"
                    >
                      {result.avatar ? (
                        <img
                          src={result.avatar}
                          alt={result.title}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-text-muted" />
                        </div>
                      )}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-text-primary truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-text-muted truncate">{result.subtitle}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-text-muted text-sm">No results found</div>
            )
          ) : (
            // Recent Searches
            <div>
              <div className="flex items-center justify-between p-3 border-b border-border-primary">
                <span className="text-xs font-semibold text-text-muted uppercase">Recent</span>
                <button
                  onClick={clearRecent}
                  className="text-xs text-primary hover:text-primary-hover font-medium"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((recentQuery, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentClick(recentQuery)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-bg-secondary transition-colors"
                >
                  <Clock size={18} className="text-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-primary truncate">{recentQuery}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
