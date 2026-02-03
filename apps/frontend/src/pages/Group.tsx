import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MoreHorizontal, UserPlus, Lock, Globe, LogOut } from 'lucide-react';
import { groupsAPI } from '../services/api';
import { useSocialStore } from '../store';
import PostCard from '../components/feed/PostCard';
import type { Post } from '../types';

interface GroupData {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  isPrivate: boolean;
  isMember: boolean;
  membersCount: number;
  postsCount: number;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

const Group: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useSocialStore();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const [groupData, postsData] = await Promise.all([
        groupsAPI.getById(groupId),
        groupsAPI.getPosts(groupId),
      ]);
      setGroup(groupData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!groupId || actionLoading) return;

    try {
      setActionLoading(true);
      await groupsAPI.join(groupId);
      await loadGroup(); // Reload group data
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!groupId || actionLoading) return;

    try {
      setActionLoading(true);
      await groupsAPI.leave(groupId);
      navigate('/groups');
    } catch (error) {
      console.error('Failed to leave group:', error);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted">Group not found</p>
          <button onClick={() => navigate('/groups')} className="mt-4 text-orange-500 hover:underline">
            Back to groups
          </button>
        </div>
      </div>
    );
  }

  const isCreator = group.creator.id === currentUser?.id;

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate('/groups')}
          className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-text-primary transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto px-4 pt-4">
        {/* Cover & Header */}
        <div className="relative bg-[#1a1a1a] rounded-b-3xl overflow-hidden shadow-2xl border-x border-b border-white/5">
          <div className="h-64 md:h-80 relative group">
            {group.coverImage ? (
              <img
                src={group.coverImage}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
                <Users className="w-24 h-24 text-text-primary/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 right-4">
              {group.isPrivate ? (
                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl flex items-center gap-2 text-sm">
                  <Lock size={18} />
                  <span>Private Group</span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl flex items-center gap-2 text-sm">
                  <Globe size={18} />
                  <span>Public Group</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pb-8 flex flex-col items-center md:items-start">
            <div className="relative -mt-24 md:-mt-32 mb-4">
              <div className="p-1.5 bg-[#1a1a1a] rounded-full">
                {group.avatar ? (
                  <img
                    src={group.avatar}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#1a1a1a] object-cover bg-[#050505]"
                    alt={group.name}
                  />
                ) : (
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#1a1a1a] bg-[#050505] flex items-center justify-center">
                    <Users className="w-20 h-20 text-text-primary/20" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">{group.name}</h1>
                {group.description && (
                  <p className="text-text-muted mt-2 max-w-2xl">{group.description}</p>
                )}
                <p className="text-text-muted font-medium mt-3">{group.membersCount} Members • {group.postsCount} Posts</p>
              </div>

              <div className="flex gap-2">
                {group.isMember ? (
                  <>
                    {!isCreator && (
                      <button
                        onClick={handleLeave}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-red-500/20 text-text-primary hover:text-red-500 rounded-xl font-bold transition-all"
                      >
                        <LogOut size={18} />
                        Leave Group
                      </button>
                    )}
                    {isCreator && (
                      <span className="px-6 py-2.5 bg-orange-500/20 text-orange-500 rounded-xl font-bold">
                        Creator
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading || group.isPrivate}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-text-primary rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20"
                  >
                    <UserPlus size={18} />
                    {group.isPrivate ? 'Private' : 'Join Group'}
                  </button>
                )}
                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-text-muted hover:text-text-primary transition-all border border-white/5">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-12 text-center">
              <p className="text-text-muted">No posts yet in this group</p>
              {group.isMember && (
                <p className="text-text-secondary text-sm mt-2">Be the first to share something!</p>
              )}
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;
