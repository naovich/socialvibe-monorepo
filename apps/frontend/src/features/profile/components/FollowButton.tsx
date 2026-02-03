import React, { useState } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  initialIsFollowing = false,
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newState = !isFollowing;
    setIsFollowing(newState);
    setIsLoading(false);
    onFollowChange?.(newState);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
        isFollowing
          ? 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-border-primary'
          : 'bg-primary hover:bg-primary-hover text-text-primary shadow-lg shadow-primary/25'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isFollowing ? (
        <>
          <UserCheck size={18} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={18} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default FollowButton;
