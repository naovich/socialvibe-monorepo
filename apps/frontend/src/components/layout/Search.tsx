import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [history] = useState(['Design Patterns', 'React Native', 'Next.js 14']);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div 
        className={`flex items-center gap-3 px-4 h-10 rounded-full transition-all duration-300 ${
          isFocused ? 'bg-white/10 ring-2 ring-orange-500/50' : 'bg-white/5 hover:bg-white/10'
        }`}
      >
        <SearchIcon size={18} className={isFocused ? 'text-orange-500' : 'text-text-muted'} />
        <input
          type="text"
          placeholder="Search SocialVibe..."
          className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder:text-text-muted"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-primary">
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-12 left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent Searches</span>
              <button className="text-xs text-orange-500 hover:underline">Edit</button>
            </div>
            
            <div className="flex flex-col">
              {history.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer group"
                >
                  <Clock size={16} className="text-text-muted" />
                  <span className="text-sm text-text-disabled group-hover:text-text-primary flex-1">{item}</span>
                  <X size={14} className="text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            {query && (
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer text-orange-500">
                  <SearchIcon size={16} />
                  <span className="text-sm font-medium">Search for "{query}"</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
