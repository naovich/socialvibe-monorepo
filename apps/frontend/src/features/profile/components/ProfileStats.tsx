import React from 'react';
import VibeScore from '../../../components/ui/VibeScore';
import Badge from '../../../components/ui/Badge';

interface ProfileStatsProps {
  vibeScore: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ vibeScore, badges }) => {
  return (
    <div className="space-y-6">
      {/* Vibe Score */}
      <div className="bg-bg-card border border-border-primary rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Vibe Score</h3>
        <VibeScore score={vibeScore} animate />
      </div>

      {/* Badges */}
      <div className="bg-bg-card border border-border-primary rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary">Badges</h3>
          <span className="text-sm text-text-muted">{badges.length} earned</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.slice(0, 6).map((badge) => (
            <Badge key={badge.id} {...badge} />
          ))}
        </div>
        {badges.length > 6 && (
          <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors">
            View All Badges ({badges.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;
