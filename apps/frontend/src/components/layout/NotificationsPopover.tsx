import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageSquare, UserPlus, MoreHorizontal } from 'lucide-react';
import { useSocialStore } from '../../store';

const NotificationsPopover: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications } = useSocialStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={14} className="text-red-500 fill-red-500" />;
      case 'comment': return <MessageSquare size={14} className="text-blue-500 fill-blue-500" />;
      case 'friend_request': return <UserPlus size={14} className="text-green-500" />;
      default: return <Bell size={14} className="text-orange-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-12 right-0 w-80 md:w-96 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[500px]"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-xl font-bold text-text-primary">Notifications</h3>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <MoreHorizontal size={20} className="text-text-muted" />
              </button>
            </div>

            <div className="overflow-y-auto scrollbar-hide">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`flex gap-3 p-4 hover:bg-white/5 cursor-pointer transition-colors relative ${!notif.read ? 'bg-orange-500/5' : ''}`}
                  >
                    <div className="relative">
                      <img src={notif.user.avatar} alt={notif.user.name} className="w-12 h-12 rounded-full border border-white/10" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm text-gray-200">
                        <span className="font-bold text-text-primary">{notif.user.name}</span> {notif.content}
                      </p>
                      <span className="text-xs text-orange-500 font-medium mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Bell size={48} className="text-text-secondary mb-4" />
                  <p className="text-text-muted font-medium">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5 text-center">
              <button className="text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                See all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPopover;
