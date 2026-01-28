import React, { useState } from 'react';
import { Bell, MessageSquare, Menu, LayoutGrid, Plus } from 'lucide-react';
import { useSocialStore } from '../../store';
import Search from './Search';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  onCreatePost?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreatePost }) => {
  const { currentUser, notifications } = useSocialStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg-primary/80 backdrop-blur-md border-b border-border-primary z-[100] px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4 group shrink-0 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-primary to-orange-dark rounded-xl flex items-center justify-center shadow-lg shadow-orange-primary/20 group-hover:rotate-6 transition-transform">
              <span className="text-2xl font-black text-white italic">S</span>
            </div>
            <span className="hidden md:block text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary tracking-tighter">
              SOCIALVIBE
            </span>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <Search />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu */}
            <button className="lg:hidden p-2 hover:bg-white/5 rounded-full text-text-secondary">
              <Menu size={24} />
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Create Post Button */}
              {onCreatePost && (
                <button
                  onClick={onCreatePost}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-primary hover:bg-orange-hover rounded-xl text-white font-semibold transition-all shadow-lg shadow-orange-primary/25"
                >
                  <Plus size={20} />
                  <span>Create</span>
                </button>
              )}

              <HeaderAction icon={<LayoutGrid size={22} />} label="Menu" />
              <HeaderAction icon={<MessageSquare size={22} />} label="Messages" />

              {/* Notifications */}
              <div className="relative">
                <HeaderAction
                  icon={<Bell size={22} />}
                  badge={unreadCount > 0 ? unreadCount : undefined}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  active={isNotificationsOpen}
                  label="Notifications"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            <div className="h-8 w-[1px] bg-border-primary mx-1 md:mx-2 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-1 md:pl-2 p-1 rounded-full hover:bg-white/5 cursor-pointer transition-all group">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-orange-primary transition-all"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-bg-primary rounded-full"></div>
              </div>
              <span className="hidden lg:block font-semibold text-sm text-text-secondary group-hover:text-text-primary transition-colors mr-2">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center Panel */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};

const HeaderAction: React.FC<{
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  active?: boolean;
  label: string;
}> = ({ icon, badge, onClick, active, label }) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-full transition-all relative group ${
      active
        ? 'bg-white/10 text-orange-primary'
        : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'
    }`}
  >
    {icon}
    {badge !== undefined && (
      <span className="absolute top-1 right-1 w-5 h-5 bg-orange-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-bg-primary">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-tertiary border border-border-primary text-text-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[200] shadow-lg">
      {label}
    </div>
  </button>
);

export default Header;
