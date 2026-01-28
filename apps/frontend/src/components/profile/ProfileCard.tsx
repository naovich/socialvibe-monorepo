import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link2, Calendar, Award } from 'lucide-react';
import VibeScore from '../ui/VibeScore';
import Badge from '../ui/Badge';

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinedDate?: string;
    friendsCount: number;
    postsCount: number;
    vibeScore?: number;
    badges?: string[];
    isFollowing?: boolean;
  };
  onFollow?: () => void;
  isOwnProfile?: boolean;
}

const BADGE_CONFIG: Record<string, { icon: string; name: string; description: string; rarity: 'common' | 'rare' | 'epic' | 'legendary' }> = {
  'early-adopter': {
    icon: '🚀',
    name: 'Early Adopter',
    description: 'Joined during beta',
    rarity: 'legendary',
  },
  'content-creator': {
    icon: '✨',
    name: 'Content Creator',
    description: 'Posted 100+ times',
    rarity: 'epic',
  },
  traveler: {
    icon: '🌍',
    name: 'World Traveler',
    description: 'Posted from 10+ locations',
    rarity: 'rare',
  },
  'coffee-lover': {
    icon: '☕',
    name: 'Coffee Lover',
    description: 'Posted 50+ coffee photos',
    rarity: 'common',
  },
  developer: {
    icon: '💻',
    name: 'Developer',
    description: 'Tech enthusiast',
    rarity: 'rare',
  },
  designer: {
    icon: '🎨',
    name: 'Designer',
    description: 'Creative mind',
    rarity: 'rare',
  },
  founder: {
    icon: '👔',
    name: 'Founder',
    description: 'Entrepreneur',
    rarity: 'epic',
  },
  visionary: {
    icon: '🔮',
    name: 'Visionary',
    description: 'Future thinker',
    rarity: 'legendary',
  },
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onFollow, isOwnProfile = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card border border-border-primary rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Cover Image */}
      {user.coverImage && (
        <div className="h-48 bg-gradient-to-br from-orange-primary to-orange-dark relative overflow-hidden">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
      )}

      {/* Profile Content */}
      <div className="p-6">
        {/* Avatar & Stats */}
        <div className="flex items-start gap-4 -mt-20 mb-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-2xl border-4 border-bg-card shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2">
              {user.vibeScore && <VibeScore score={user.vibeScore} animate />}
            </div>
          </div>

          <div className="flex-1 mt-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{user.name}</h2>
                <p className="text-text-muted">@{user.username}</p>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={onFollow}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                    user.isFollowing
                      ? 'bg-white/5 hover:bg-white/10 text-text-primary'
                      : 'bg-orange-primary hover:bg-orange-hover text-white shadow-lg shadow-orange-primary/25'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div>
            <p className="text-2xl font-bold text-text-primary">{user.postsCount}</p>
            <p className="text-sm text-text-muted">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{user.friendsCount}</p>
            <p className="text-sm text-text-muted">Friends</p>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-text-primary mb-4 leading-relaxed">{user.bio}</p>
        )}

        {/* Meta Info */}
        <div className="space-y-2 mb-6">
          {user.location && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Link2 size={16} />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-primary hover:underline"
              >
                {user.website}
              </a>
            </div>
          )}
          {user.joinedDate && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Calendar size={16} />
              <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-orange-primary" />
              <h3 className="font-semibold text-text-primary">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {user.badges.map((badgeId) => {
                const config = BADGE_CONFIG[badgeId];
                if (!config) return null;
                return (
                  <Badge
                    key={badgeId}
                    icon={config.icon}
                    name={config.name}
                    description={config.description}
                    rarity={config.rarity}
                    unlocked
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;
