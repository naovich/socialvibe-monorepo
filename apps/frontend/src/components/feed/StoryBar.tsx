import React from 'react';
import { Plus } from 'lucide-react';
import { useSocialStore } from '../../store';

const StoryBar: React.FC = () => {
  const { stories, currentUser } = useSocialStore();
  if (!currentUser) return null;

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide pb-2">
      {/* Create Story */}
      <div className="flex-shrink-0 w-32 h-52 relative rounded-2xl overflow-hidden cursor-pointer group border border-white/10">
        <img 
          src={currentUser.avatar} 
          className="w-full h-3/4 object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-[#1a1a1a] flex flex-col items-center justify-end pb-2">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-4 border-[#1a1a1a] shadow-lg">
            <Plus size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-white">Create Story</span>
        </div>
      </div>

      {/* Stories */}
      {stories.map((story) => (
        <div key={story.id} className="flex-shrink-0 w-32 h-52 relative rounded-2xl overflow-hidden cursor-pointer group border border-white/10">
          <img 
            src={story.image} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-orange-500 p-0.5 overflow-hidden bg-[#1a1a1a]">
            <img src={story.user.avatar} className="w-full h-full rounded-full object-cover" />
          </div>
          
          <span className="absolute bottom-3 left-3 text-xs font-bold text-white shadow-black drop-shadow-md">
            {story.user.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;
