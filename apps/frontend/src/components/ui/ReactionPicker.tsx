import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
  currentReaction?: string;
}

const REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '👍', label: 'Like' },
];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onReact, currentReaction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

  const handleReact = (emoji: string) => {
    onReact(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setTimeout(() => setIsOpen(false), 200)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
          currentReaction
            ? 'bg-orange-500/10 text-orange-500'
            : 'text-text-muted hover:bg-white/5'
        }`}
        onClick={() => !currentReaction && setIsOpen(!isOpen)}
      >
        {currentReaction ? (
          <span className="text-xl animate-bounce">{currentReaction}</span>
        ) : (
          <span className="text-xl">❤️</span>
        )}
        <span className="text-sm font-semibold">
          {currentReaction ? 'Reacted' : 'React'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute bottom-full mb-2 left-0 bg-bg-card border border-border-primary rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex gap-1 z-50"
          >
            {REACTIONS.map((reaction) => (
              <motion.button
                key={reaction.emoji}
                whileHover={{ scale: 1.3, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReact(reaction.emoji)}
                onMouseEnter={() => setHoveredReaction(reaction.label)}
                onMouseLeave={() => setHoveredReaction(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-2xl relative"
                title={reaction.label}
              >
                {reaction.emoji}
                {hoveredReaction === reaction.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 bg-bg-tertiary text-text-primary text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    {reaction.label}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionPicker;
