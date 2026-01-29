import React, { useState, useEffect } from 'react';
import { Camera, Edit3, MoreHorizontal } from 'lucide-react';
import { useSocialStore } from '../../store';
import PostCard from '../feed/PostCard';
import PhotosGrid from '../../features/profile/components/PhotosGrid';
import PostModal from '../feed/PostModal';
import EditProfileModal from './EditProfileModal';
import type { Post } from '../../types';

const Profile: React.FC = () => {
  const { currentUser, fetchUserPosts } = useSocialStore();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      if (currentUser) {
        const posts = await fetchUserPosts(currentUser.id);
        setUserPosts(posts);
      }
    };
    loadPosts();
  }, [currentUser, fetchUserPosts]);

  if (!currentUser) {
    return <div className="text-center py-8 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cover & Profile Header */}
      <div className="relative bg-[#1a1a1a] rounded-b-3xl overflow-hidden shadow-2xl border-x border-b border-white/5">
        <div className="h-64 md:h-80 relative group">
          <img 
            src={currentUser.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-sm font-bold text-white transition-all border border-white/10 shadow-xl">
            <Camera size={18} />
            <span className="hidden md:inline">Edit Cover Photo</span>
          </button>
        </div>

        <div className="px-8 pb-8 flex flex-col items-center md:items-start">
          <div className="relative -mt-24 md:-mt-32 mb-4">
            <div className="p-1.5 bg-[#1a1a1a] rounded-full">
              <img 
                src={currentUser.avatar} 
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#1a1a1a] object-cover bg-[#050505]" 
              />
            </div>
            <button className="absolute bottom-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10">
              <Camera size={20} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{currentUser.name}</h1>
              <p className="text-gray-400 font-medium mt-1">{currentUser.friendsCount} Friends • {currentUser.postsCount} Posts</p>
              <div className="flex -space-x-2 mt-3 justify-center md:justify-start">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${i}`} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a]" />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
              <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <hr className="w-full border-white/5 my-6" />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 w-full overflow-x-auto scrollbar-hide">
            {['Posts', 'About', 'Friends', 'Photos', 'Videos', 'Check-ins'].map((tab, i) => (
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
            {currentUser.bio && (
              <p className="text-gray-300 text-sm leading-relaxed text-center mb-6 px-4 italic">
                "{currentUser.bio}"
              </p>
            )}
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-gray-300 transition-all mb-6">
              Edit Bio
            </button>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>Fullstack Developer at <span className="text-white font-bold">SocialVibe</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Lives in <span className="text-white font-bold">Casablanca, Morocco</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Joined <span className="text-white font-bold">May 2024</span></span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-white">Photos</h2>
              <button className="text-sm font-bold text-orange-500 hover:underline">See All</button>
            </div>
            <PhotosGrid 
              userId={currentUser.id} 
              limit={9} 
              onPhotoClick={(post) => setSelectedPost(post)}
            />
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="md:col-span-3">
          <div className="flex flex-col">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPost && (
        <PostModal 
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
