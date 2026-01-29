import React, { useState } from 'react';
import { Image, Video, Smile } from 'lucide-react';
import { useSocialStore } from '../../store';
import PostModal from './PostModal';

const CreatePost: React.FC = () => {
  const { currentUser } = useSocialStore();
  if (!currentUser) return null;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex gap-3 mb-4">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-orange-500/30" />
          <div 
            className="flex-1 bg-white/5 hover:bg-white/10 rounded-full px-4 flex items-center cursor-pointer transition-colors border border-white/5"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 text-sm">What's on your mind, {currentUser.name}?</span>
          </div>
        </div>
        
        <hr className="border-white/5 mb-3" />

        <div className="flex items-center justify-between">
          <div className="flex gap-1 md:gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors group"
            >
              <Video size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors hidden sm:block">Live Video</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors group"
            >
              <Image size={20} className="text-green-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors hidden sm:block">Photo/Video</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-colors group"
            >
              <Smile size={20} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors hidden sm:block">Feeling/Activity</span>
            </button>
          </div>
        </div>
      </div>

      <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CreatePost;
