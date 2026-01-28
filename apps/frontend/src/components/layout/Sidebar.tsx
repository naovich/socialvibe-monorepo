import React from 'react';
import { 
  Home, Users, Group, Bookmark, Clock, ChevronDown, 
  ShoppingBag, Tv, Flag, Calendar
} from 'lucide-react';
import { useSocialStore } from '../../store';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  color?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick, active = false, color }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/10 group ${active ? 'bg-white/10' : ''}`}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-orange-500' : color || 'text-gray-400'}`}>
        {icon}
      </div>
      <span className={`font-medium text-sm ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
    </button>
  );
};

interface SidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView = 'home', onNavigate }) => {
  const { currentUser } = useSocialStore();

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col gap-1 w-72 fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto p-4 scrollbar-hide border-r border-white/5 bg-[#050505]">
      <button 
        onClick={() => handleNavigation('profile')}
        className="flex items-center gap-3 p-3 mb-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
      >
        <div className="relative">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full border border-orange-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></div>
        </div>
        <span className="font-semibold text-white group-hover:text-orange-500 transition-colors">{currentUser.name}</span>
      </button>

      <SidebarItem 
        icon={<Home size={22} />} 
        label="Home" 
        onClick={() => handleNavigation('home')}
        active={currentView === 'home'}
      />
      <SidebarItem 
        icon={<Users size={22} />} 
        label="Friends" 
        onClick={() => handleNavigation('friends')}
        active={currentView === 'friends'}
        color="text-blue-500" 
      />
      <SidebarItem 
        icon={<Group size={22} />} 
        label="Groups" 
        onClick={() => handleNavigation('groups')}
        active={currentView === 'groups'}
        color="text-blue-400" 
      />
      <SidebarItem 
        icon={<ShoppingBag size={22} />} 
        label="Marketplace" 
        onClick={() => handleNavigation('marketplace')}
        active={currentView === 'marketplace'}
        color="text-teal-400" 
      />
      <SidebarItem 
        icon={<Tv size={22} />} 
        label="Watch" 
        onClick={() => handleNavigation('watch')}
        active={currentView === 'watch'}
        color="text-blue-500" 
      />
      <SidebarItem 
        icon={<Clock size={22} />} 
        label="Memories" 
        onClick={() => handleNavigation('memories')}
        active={currentView === 'memories'}
        color="text-indigo-400" 
      />
      <SidebarItem 
        icon={<Bookmark size={22} />} 
        label="Saved" 
        onClick={() => handleNavigation('saved')}
        active={currentView === 'saved'}
        color="text-purple-500" 
      />

      <div className="my-3 border-t border-white/10"></div>

      <div className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-all">
        <span className="font-semibold text-sm text-gray-300 group-hover:text-white transition-colors">Your Shortcuts</span>
        <ChevronDown size={16} className="text-gray-400 group-hover:text-white transition-all group-hover:rotate-180 duration-300" />
      </div>

      <SidebarItem 
        icon={<Flag size={20} />} 
        label="Pages" 
        onClick={() => handleNavigation('pages')}
        active={currentView === 'pages'}
        color="text-orange-500" 
      />
      <SidebarItem 
        icon={<Calendar size={20} />} 
        label="Events" 
        onClick={() => handleNavigation('events')}
        active={currentView === 'events'}
        color="text-red-400" 
      />

      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500 px-3">Privacy · Terms · Advertising · More</p>
        <p className="text-xs text-gray-600 px-3 mt-2">SocialVibe © 2024</p>
      </div>
    </aside>
  );
};

export default Sidebar;
