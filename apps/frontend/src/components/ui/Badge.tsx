import React, { useState } from 'react';

interface BadgeProps {
  icon: string;
  name: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  icon,
  name,
  description,
  rarity = 'common',
  unlocked = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const rarityConfig = {
    common: {
      gradient: 'from-gray-400 to-gray-600',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
    },
    rare: {
      gradient: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    epic: {
      gradient: 'from-purple-400 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
    legendary: {
      gradient: 'from-orange-400 to-yellow-600',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
    },
  };

  const config = rarityConfig[rarity];

  return (
    <div
      className={`relative group ${
        unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={unlocked ? onClick : undefined}
    >
      <div
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
          unlocked
            ? `${config.bg} ${config.border} border-2 backdrop-blur-sm ${
                isHovered ? 'scale-110 shadow-lg' : 'scale-100'
              }`
            : 'bg-white/5 border border-white/10'
        }`}
      >
        <span
          className={`${
            unlocked
              ? `bg-clip-text text-transparent bg-gradient-to-br ${config.gradient}`
              : 'text-text-disabled'
          }`}
        >
          {icon}
        </span>
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
            <span className="text-white/60 text-2xl">?</span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-bg-tertiary border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <span>{icon}</span>
            <span className="font-semibold text-sm text-text-primary">{name}</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {description || 'No description'}
          </p>
          {!unlocked && (
            <p className="text-xs text-primary mt-2 font-semibold">
              Not yet unlocked
            </p>
          )}
        </div>
      </div>

      <p className="text-center text-xs font-medium mt-2 text-text-secondary">{name}</p>
    </div>
  );
};

export default Badge;
