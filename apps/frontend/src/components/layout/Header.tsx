import React, { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, Users, Menu, LayoutGrid, Plus, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '../../store';
import SearchBar from '../../features/search/components/SearchBar';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  onCreatePost?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const { currentUser, notifications, logout } = useSocialStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-border-primary z-[100] px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4 group shrink-0 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <span className="text-2xl font-black text-text-primary italic">S</span>
            </div>
            <span className="hidden md:block text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary tracking-tighter">
              SOCIALVIBE
            </span>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar onSelect={(result) => console.log('Selected:', result)} />
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
                  data-testid="create-post"
                  onClick={onCreatePost}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-xl text-text-primary font-semibold transition-all shadow-lg shadow-primary/25"
                >
                  <Plus size={20} />
                  <span>Create</span>
                </button>
              )}

              <HeaderAction icon={<LayoutGrid size={22} />} label="Menu" />
              <HeaderAction icon={<MessageSquare size={22} />} label="Messages" />

              {/* Notifications */}
              {/* Groups */}
              <div className="relative">
                <HeaderAction
                  icon={<Users size={22} />}
                  onClick={() => navigate('/groups')}
                  label="Groups"
                />
              </div>

              {/* Messages */}
              <div className="relative">
                <HeaderAction
                  icon={<MessageSquare size={22} />}
                  onClick={() => navigate('/messages')}
                  label="Messages"
                />
              </div>

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
            <div className="relative" ref={userMenuRef}>
              <div
                data-testid="user-menu"
                aria-label="User menu"
                className="flex items-center gap-3 pl-1 md:pl-2 p-1 rounded-full hover:bg-white/5 cursor-pointer transition-all group"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-primary transition-all"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-bg-primary rounded-full"></div>
                </div>
                <span className="hidden lg:block font-semibold text-sm text-text-secondary group-hover:text-text-primary transition-colors mr-2">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-bg-secondary border border-border-primary rounded-2xl shadow-2xl overflow-hidden z-[200]">
                  <div className="p-4 border-b border-border-primary">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-primary truncate">{currentUser.name}</p>
                        <p className="text-sm text-text-secondary truncate">@{currentUser.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-all text-left">
                      <User size={18} className="text-text-secondary" />
                      <span className="text-sm font-medium text-text-primary">View Profile</span>
                    </button>
                    <button 
                      onClick={() => navigate('/settings')}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-all text-left"
                    >
                      <Settings size={18} className="text-text-secondary" />
                      <span className="text-sm font-medium text-text-primary">Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-border-primary py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-all text-left group"
                    >
                      <LogOut size={18} className="text-text-secondary group-hover:text-red-500" />
                      <span className="text-sm font-medium text-text-primary group-hover:text-red-500">Logout</span>
                    </button>
                  </div>
                </div>
              )}
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
        ? 'bg-white/10 text-primary'
        : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'
    }`}
  >
    {icon}
    {badge !== undefined && (
      <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-text-primary text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-bg-primary">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-tertiary border border-border-primary text-text-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[200] shadow-lg">
      {label}
    </div>
  </button>
);

export default Header;
