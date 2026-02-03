import React from 'react';

interface VibeTagProps {
  emoji: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isSelected?: boolean;
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const VibeTag: React.FC<VibeTagProps> = ({
  emoji,
  label,
  size = 'md',
  onClick,
  isSelected = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${
        sizeClasses[size]
      } flex items-center gap-1.5 rounded-full transition-all duration-200 ${
        isSelected
          ? 'bg-orange-500 text-text-primary shadow-lg shadow-orange-500/25 scale-105'
          : 'bg-white/5 text-text-primary/80 hover:bg-white/10 hover:scale-105'
      }`}
    >
      <span className="text-lg">{emoji}</span>
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
};

export { VibeTag };
export default VibeTag;
