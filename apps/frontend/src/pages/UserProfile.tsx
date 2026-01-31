import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, UserPlus, UserCheck } from 'lucide-react';
import { useSocialStore } from '../store';
import { usersAPI, friendshipsAPI } from '../services/api';
import PostCard from '../components/feed/PostCard';
import PhotosGrid from '../features/profile/components/PhotosGrid';
import PostModal from '../components/feed/PostModal';
import ImageViewer from '../components/ui/ImageViewer';
import SafeHTML from '../components/SafeHTML';
import type { Post } from '../types';

interface UserData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  friendsCount?: number;
  postsCount?: number;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, fetchUserPosts } = useSocialStore();
  const [user, setUser] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;

      // If viewing own profile, redirect to /
      if (userId === currentUser?.id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const userData = await usersAPI.getById(userId);
        setUser({
          id: userData.id,
          name: userData.name,
          username: userData.username,
          avatar: userData.avatar,
          coverImage: userData.coverImage,
          bio: userData.bio,
          friendsCount: userData._count?.friends || 0,
          postsCount: userData._count?.posts || 0,
        });

        // Load user posts
        const posts = await fetchUserPosts(userId);
        setUserPosts(posts);

        // Check friendship status
        const friends = await friendshipsAPI.getFriends();
        setIsFriend(friends.some((f: { id: string }) => f.id === userId));
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, currentUser, fetchUserPosts, navigate]);

  const handleAddFriend = async () => {
    if (!user) return;

    try {
      await friendshipsAPI.sendRequest(user.id);
      setRequestSent(true);
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">User not found</p>
          <button onClick={() => navigate('/')} className="mt-4 text-orange-500 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto px-4 pt-4">
        {/* Cover & Profile Header */}
        <div className="relative bg-[#1a1a1a] rounded-b-3xl overflow-hidden shadow-2xl border-x border-b border-white/5">
          <div className="h-64 md:h-80 relative group">
            <img
              src={user.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'}
              onClick={() => setViewingImage(user.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200')}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              alt="Cover"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
          </div>

          <div className="px-8 pb-8 flex flex-col items-center md:items-start">
            <div className="relative -mt-24 md:-mt-32 mb-4">
              <div className="p-1.5 bg-[#1a1a1a] rounded-full">
                <img
                  src={user.avatar}
                  onClick={() => setViewingImage(user.avatar)}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#1a1a1a] object-cover bg-[#050505] cursor-pointer hover:opacity-90 transition-opacity"
                  alt={user.name}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{user.name}</h1>
                <p className="text-gray-400 font-medium mt-1">@{user.username}</p>
                <p className="text-gray-400 font-medium mt-1">{user.friendsCount} Friends • {user.postsCount} Posts</p>
              </div>

              <div className="flex gap-2">
                {isFriend ? (
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-white/10 text-white rounded-xl font-bold transition-all">
                    <UserCheck size={18} />
                    Friends
                  </button>
                ) : requestSent ? (
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-white/10 text-gray-400 rounded-xl font-bold cursor-not-allowed">
                    Request Sent
                  </button>
                ) : (
                  <button
                    onClick={handleAddFriend}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20"
                  >
                    <UserPlus size={18} />
                    Add Friend
                  </button>
                )}
                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <hr className="w-full border-white/5 my-6" />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 w-full overflow-x-auto scrollbar-hide">
              {['Posts', 'About', 'Friends', 'Photos'].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${i === 0 ? 'bg-white/10 text-orange-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column: Intro */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-black text-white mb-4">Intro</h2>
              {user.bio && (
                <div className="text-center mb-6 px-4 italic">
                  "<SafeHTML content={user.bio} className="text-gray-300 text-sm leading-relaxed inline" as="span" />"
                </div>
              )}
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-white">Photos</h2>
              </div>
              <PhotosGrid userId={user.id} limit={9} onPhotoClick={(post) => setSelectedPost(post)} />
            </div>
          </div>

          {/* Right Column: Feed */}
          <div className="md:col-span-3">
            <div className="flex flex-col">
              {userPosts.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-12 text-center">
                  <p className="text-gray-400">No posts yet</p>
                </div>
              ) : (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        </div>

        {/* Photo Modal */}
        {selectedPost && (
          <PostModal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
        )}

        {/* Image Viewer (Cover/Avatar) */}
        <ImageViewer
          isOpen={!!viewingImage}
          imageUrl={viewingImage || ''}
          onClose={() => setViewingImage(null)}
        />
      </div>
    </div>
  );
};

export default UserProfile;
