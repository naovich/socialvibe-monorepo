import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Search, MoreHorizontal, Gift } from 'lucide-react';
import { friendshipsAPI } from '../../services/api';
import { useSocialStore } from '../../store';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
}

interface ContactItemProps {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({ id, name, avatar, online = false }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/user/${id}`)}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
    >
      <div className="relative">
        <img src={avatar} alt={name} className="w-9 h-9 rounded-full border border-white/10" />
        {online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#050505] rounded-full"></div>}
      </div>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{name}</span>
    </div>
  );
};

const RightSidebar: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocialStore();

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await friendshipsAPI.getFriends();
        setFriends(data);
      } catch (error) {
        console.error('Failed to load friends:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  return (
    <aside className="hidden xl:flex flex-col gap-4 w-80 fixed right-0 top-16 h-[calc(100vh-64px)] p-4 overflow-y-auto scrollbar-hide bg-[#050505] border-l border-white/5">
      {/* Sponsored */}
      <div className="flex flex-col gap-3">
        <h3 className="text-gray-400 font-semibold text-sm px-2">Sponsored</h3>
        <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" className="w-24 h-24 rounded-xl object-cover" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">Premium Watches</span>
            <span className="text-xs text-gray-500 mt-1">luxury-watches.com</span>
          </div>
        </div>
      </div>

      <hr className="border-white/5 mx-2" />

      {/* Birthdays */}
      <div className="flex flex-col gap-3">
        <h3 className="text-gray-400 font-semibold text-sm px-2">Birthdays</h3>
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
          <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
            <Gift size={20} />
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="font-bold text-white">Alex Rivera</span> and <span className="font-bold text-white">2 others</span> have birthdays today.
          </p>
        </div>
      </div>

      <hr className="border-white/5 mx-2" />

      {/* Contacts */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-gray-400 font-semibold text-sm">Contacts</h3>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
              <Video size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
              <Search size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          {loading ? (
            <div className="text-center py-4 text-gray-500 text-sm">Loading friends...</div>
          ) : friends.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">No friends yet</div>
          ) : (
            friends.map((friend) => (
              <ContactItem 
                key={friend.id}
                id={friend.id}
                name={friend.name} 
                avatar={friend.avatar}
                online={onlineUsers.includes(friend.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Group Conversations */}
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-gray-400 font-semibold text-sm px-2 mb-2">Group Conversations</h3>
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs">DS</div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Design System</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-black text-xs">RN</div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">React Native</span>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
