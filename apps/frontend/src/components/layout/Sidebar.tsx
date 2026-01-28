import React from 'react';
import { Home, Users, Group, Bookmark, MessageCircle } from 'lucide-react';
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
      className={`w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:bg-bg-secondary group ${active ? 'bg-primary-light' : ''}`}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-primary' : color || 'text-text-muted'}`}>
        {icon}
      </div>
      <span className={`font-medium text-sm ${active ? 'text-primary font-semibold' : 'text-text-secondary group-hover:text-text-primary'}`}>
        {label}
      </span>
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
    <aside className="hidden lg:flex flex-col gap-1 w-72 fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto p-4 scrollbar-hide border-r border-border-primary bg-bg-primary">
      {/* Profile Button */}
      <button 
        onClick={() => handleNavigation('profile')}
        className="flex items-center gap-3 p-3 mb-2 rounded-xl hover:bg-bg-secondary cursor-pointer transition-all group"
      >
        <div className="relative">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-full border-2 border-primary" 
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-bg-primary"></div>
        </div>
        <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
          {currentUser.name}
        </span>
      </button>

      {/* Main Navigation */}
      <SidebarItem 
        icon={<Home size={22} />} 
        label="Home" 
        onClick={() => handleNavigation('home')}
        active={currentView === 'home'}
        color="text-primary"
      />
      
      <SidebarItem 
        icon={<MessageCircle size={22} />} 
        label="Messages" 
        onClick={() => handleNavigation('messages')}
        active={currentView === 'messages'}
        color="text-info"
      />
      
      <SidebarItem 
        icon={<Users size={22} />} 
        label="Friends" 
        onClick={() => handleNavigation('friends')}
        active={currentView === 'friends'}
        color="text-info" 
      />
      
      <SidebarItem 
        icon={<Group size={22} />} 
        label="Groups" 
        onClick={() => handleNavigation('groups')}
        active={currentView === 'groups'}
        color="text-warning" 
      />
      
      <SidebarItem 
        icon={<Bookmark size={22} />} 
        label="Saved" 
        onClick={() => handleNavigation('saved')}
        active={currentView === 'saved'}
        color="text-error" 
      />

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border-primary">
        <p className="text-xs text-text-muted px-3">Privacy · Terms · Advertising</p>
        <p className="text-xs text-text-disabled px-3 mt-2">SocialVibe © 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
