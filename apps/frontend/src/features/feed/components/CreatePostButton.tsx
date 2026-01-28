import React from 'react';
import { useSocialStore } from '../../../store';

interface CreatePostButtonProps {
  onClick?: () => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onClick }) => {
  const { currentUser } = useSocialStore();

  return (
    <button
      onClick={onClick}
      className="w-full bg-bg-card border border-border-primary rounded-2xl p-4 flex items-center gap-3 hover:bg-bg-secondary transition-colors group shadow-sm"
    >
      <img
        src={currentUser.avatar}
        alt="Your avatar"
        className="w-12 h-12 rounded-full border-2 border-primary"
      />
      <span className="text-text-muted group-hover:text-text-secondary transition-colors text-lg">
        What's on your mind, {currentUser.name.split(' ')[0]}?
      </span>
    </button>
  );
};

export default CreatePostButton;
