import React from 'react';
import type { Conversation } from '../types/message.types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const participant = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-center gap-3 hover:bg-bg-secondary transition-colors ${
        isActive ? 'bg-primary-light' : ''
      }`}
    >
      {/* Avatar with online status */}
      <div className="relative flex-shrink-0">
        <img
          src={participant.avatar}
          alt={participant.name}
          className="w-14 h-14 rounded-full border-2 border-primary"
        />
        {participant.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-bg-card" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="font-semibold text-text-primary truncate">{participant.name}</h3>
          {lastMessage && (
            <span className="text-xs text-text-muted flex-shrink-0 ml-2">
              {formatTime(lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted truncate">
            {conversation.isTyping ? (
              <span className="text-primary italic">typing...</span>
            ) : lastMessage ? (
              lastMessage.text || '📷 Image'
            ) : (
              'Start a conversation'
            )}
          </p>
          
          {conversation.unreadCount > 0 && (
            <span className="ml-2 min-w-[20px] h-5 px-2 bg-primary text-text-primary text-xs font-bold rounded-full flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
