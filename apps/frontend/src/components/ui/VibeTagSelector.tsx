import React from 'react';

const PREDEFINED_VIBES = [
  { emoji: '🔥', label: 'Hype' },
  { emoji: '😎', label: 'Chill' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '💪', label: 'Fitness' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🍕', label: 'Food' },
  { emoji: '✨', label: 'Magic' },
  { emoji: '🚀', label: 'Innovation' },
  { emoji: '💼', label: 'Business' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '📸', label: 'Photography' },
  { emoji: '🌍', label: 'Travel' },
];

interface VibeTagSelectorProps {
  selectedVibes: string[];
  onVibeToggle: (vibe: string) => void;
  maxVibes?: number;
}

const VibeTagSelector: React.FC<VibeTagSelectorProps> = ({
  selectedVibes,
  onVibeToggle,
  maxVibes = 3,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Select Vibe Tags</span>
        <span className="text-xs">
          {selectedVibes.length}/{maxVibes}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_VIBES.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe.emoji);
          const isDisabled =
            !isSelected && selectedVibes.length >= maxVibes;
          return (
            <button
              key={vibe.emoji}
              onClick={() => !isDisabled && onVibeToggle(vibe.emoji)}
              disabled={isDisabled}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                  : isDisabled
                  ? 'bg-white/5 text-text-disabled cursor-not-allowed'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:scale-105'
              }`}
            >
              <span>{vibe.emoji}</span>
              <span className="hidden sm:inline">{vibe.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { VibeTagSelector };
export default VibeTagSelector;
