import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { emojis, emojiCategories } from '../data/emojis';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
  recentEmojis?: string[];
}

const RECENT_EMOJIS_KEY = 'socialvibe_recent_emojis';
const MAX_RECENT = 24;

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose, recentEmojis: propRecentEmojis }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent emojis from localStorage
    try {
      const stored = localStorage.getItem(RECENT_EMOJIS_KEY);
      if (stored) {
        setRecentEmojis(JSON.parse(stored));
      } else if (propRecentEmojis) {
        setRecentEmojis(propRecentEmojis);
      }
    } catch (err) {
      console.error('Failed to load recent emojis:', err);
    }
  }, [propRecentEmojis]);

  useEffect(() => {
    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const saveRecentEmoji = (emoji: string) => {
    try {
      let recent = [...recentEmojis];
      recent = [emoji, ...recent.filter(e => e !== emoji)].slice(0, MAX_RECENT);
      setRecentEmojis(recent);
      localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(recent));
    } catch (err) {
      console.error('Failed to save recent emoji:', err);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    saveRecentEmoji(emoji);
    onSelect(emoji);
  };

  const filteredEmojis = searchQuery.trim()
    ? emojis.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emojis.filter(e => e.category === activeCategory);

  return (
    <div
      ref={pickerRef}
      className="w-80 bg-bg-card border border-border-primary rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emojis..."
              className="w-full bg-bg-secondary border border-border-primary rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {recentEmojis.length > 0 && (
              <button
                onClick={() => setActiveCategory('recent')}
                className={`px-3 py-1.5 rounded-lg text-lg transition-colors flex-shrink-0 ${
                  activeCategory === 'recent'
                    ? 'bg-primary text-white'
                    : 'hover:bg-bg-secondary'
                }`}
              >
                🕒
              </button>
            )}
            {emojiCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-lg transition-colors flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-bg-secondary'
                }`}
                title={cat.name}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 h-64 overflow-y-auto scrollbar-thin">
        {activeCategory === 'recent' && !searchQuery ? (
          <div className="grid grid-cols-8 gap-1">
            {recentEmojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-bg-secondary rounded-lg p-2 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.length > 0 ? (
              filteredEmojis.map((emojiData) => (
                <button
                  key={`${emojiData.category}-${emojiData.emoji}`}
                  onClick={() => handleEmojiClick(emojiData.emoji)}
                  className="text-2xl hover:bg-bg-secondary rounded-lg p-2 transition-colors"
                  title={emojiData.name}
                >
                  {emojiData.emoji}
                </button>
              ))
            ) : (
              <div className="col-span-8 text-center py-8 text-text-muted text-sm">
                No emojis found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;
