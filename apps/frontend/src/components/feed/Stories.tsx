import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocialStore } from '../../store';

const Stories: React.FC = () => {
  const { stories, currentUser } = useSocialStore();
  if (!currentUser) return null;

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-6">
      {/* Create Story */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative min-w-[120px] h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer group"
      >
        <div className="h-[70%] overflow-hidden">
          <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-500 border-4 border-[#0d0d0d] flex items-center justify-center text-white z-10">
          <Plus size={20} strokeWidth={3} />
        </div>
        <div className="h-[30%] bg-[#1a1a1a] flex items-end justify-center pb-2">
          <span className="text-[11px] font-bold text-white">Create Story</span>
        </div>
      </motion.div>

      {/* Other Stories */}
      {stories.map((story) => (
        <motion.div 
          key={story.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative min-w-[120px] h-48 rounded-2xl overflow-hidden border border-white/10 cursor-pointer group"
        >
          <img src={story.image} alt="Story" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
          
          <div className={`absolute top-3 left-3 w-9 h-9 rounded-full border-2 ${story.viewed ? 'border-gray-500' : 'border-orange-500'} p-0.5`}>
            <img src={story.user.avatar} alt={story.user.name} className="w-full h-full rounded-full object-cover" />
          </div>
          
          <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white truncate right-3">
            {story.user.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default Stories;
