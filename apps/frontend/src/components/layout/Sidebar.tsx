import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Group, Bookmark, Clock, ChevronDown, 
  ShoppingBag, Tv, Flag, Calendar
} from 'lucide-react';
import { useSocialStore } from '../../store';

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  to: string;
  color?: string;
}> = ({ icon, label, to, color }) => {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/10 group ${active ? 'bg-white/10' : ''}`}
    >
      <div className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-orange-500' : color || 'text-gray-400'}`}>
        {icon}
      </div>
      <span className={`font-medium text-sm ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { currentUser } = useSocialStore();

  return (
    <aside className="hidden lg:flex flex-col gap-1 w-72 fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto p-4 scrollbar-hide border-r border-white/5 bg-[#050505]">
      <Link to="/profile" className="flex items-center gap-3 p-3 mb-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all group">
        <div className="relative">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full border border-orange-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></div>
        </div>
        <span className="font-semibold text-white group-hover:text-orange-500 transition-colors">{currentUser.name}</span>
      </Link>

      <SidebarItem icon={<Home size={22} />} label="Home" to="/" />
      <SidebarItem icon={<Users size={22} />} label="Friends" to="/friends" color="text-blue-500" />
      <SidebarItem icon={<Group size={22} />} label="Groups" to="/groups" color="text-blue-400" />
      <SidebarItem icon={<ShoppingBag size={22} />} label="Marketplace" to="/marketplace" color="text-teal-400" />
      <SidebarItem icon={<Tv size={22} />} label="Watch" to="/watch" color="text-blue-500" />
      <SidebarItem icon={<Clock size={22} />} label="Memories" to="/memories" color="text-indigo-400" />
      <SidebarItem icon={<Bookmark size={22} />} label="Saved" to="/saved" color="text-purple-500" />
      <SidebarItem icon={<Flag size={22} />} label="Pages" to="/pages" color="text-orange-500" />
      <SidebarItem icon={<Calendar size={22} />} label="Events" to="/events" color="text-red-500" />

      <div className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-white/10 group transition-all">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-all group-hover:rotate-180">
          <ChevronDown size={18} />
        </div>
        <span className="font-medium text-sm text-gray-300 group-hover:text-white">See More</span>
      </div>

      <hr className="my-4 border-white/5 mx-3" />

      <div className="flex items-center justify-between px-3 mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Shortcuts</h3>
        <button className="text-[10px] font-bold text-orange-500 hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Edit</button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer group transition-all">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">D</div>
          <span className="font-medium text-sm text-gray-300 group-hover:text-white">Design System</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer group transition-all">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20">R</div>
          <span className="font-medium text-sm text-gray-300 group-hover:text-white">React Native</span>
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <p className="text-xs text-gray-400 leading-relaxed">
            Privacy  · Terms  · Advertising  · Ad Choices   · Cookies  ·  More · Meta © 2024
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
