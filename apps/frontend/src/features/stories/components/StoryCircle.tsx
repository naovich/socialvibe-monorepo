import React from 'react';
import { Plus } from 'lucide-react';
import type { StoryGroup } from '../types/story.types';

interface StoryCircleProps {
  group?: StoryGroup;
  isMe?: boolean;
  onClick: () => void;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ group, isMe, onClick }) => {
  if (isMe && !group) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 flex-shrink-0 group focus:outline-none"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-primary flex items-center justify-center group-hover:border-primary transition-colors bg-bg-secondary">
            <Plus size={24} className="text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-bg-card flex items-center justify-center">
            <Plus size={12} className="text-text-primary" />
          </div>
        </div>
        <span className="text-xs font-medium text-text-primary">Add Story</span>
      </button>
    );
  }

  if (!group) return null;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 flex-shrink-0 group focus:outline-none"
    >
      <div
        className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 active:scale-95 ${
          group.hasUnviewed
            ? 'bg-gradient-to-tr from-primary to-primary-light'
            : 'border-2 border-border-primary'
        }`}
      >
        <img
          src={group.user.avatar}
          alt={group.user.name}
          className="w-full h-full rounded-full border-2 border-bg-card object-cover"
        />
      </div>
      <span className="text-xs font-medium text-text-primary truncate w-16 text-center">
        {isMe ? 'Your Story' : group.user.name}
      </span>
    </button>
  );
};

export default StoryCircle;
