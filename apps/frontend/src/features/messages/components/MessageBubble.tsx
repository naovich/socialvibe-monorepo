import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '../types/message.types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  senderAvatar?: string;
  senderName?: string;
  onReact?: (emoji: string) => void;
  onDelete?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
  senderAvatar,
  senderName,
  onReact,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const quickReactions = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      {showAvatar && !isOwn && senderAvatar && (
        <img
          src={senderAvatar}
          alt={senderName}
          className="w-8 h-8 rounded-full border-2 border-primary flex-shrink-0"
        />
      )}
      {showAvatar && isOwn && <div className="w-8" />}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name (if not own) */}
        {!isOwn && showAvatar && senderName && (
          <span className="text-xs text-text-muted mb-1 px-2">{senderName}</span>
        )}

        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-bg-secondary text-text-primary rounded-bl-md'
          }`}
        >
          {/* Image */}
          {message.image && (
            <img
              src={message.image}
              alt="Attached"
              className="rounded-lg max-w-xs mb-2"
            />
          )}

          {/* Text */}
          {message.text && (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 right-2 flex gap-1 bg-bg-card border border-border-primary rounded-full px-2 py-0.5 shadow-sm">
              {message.reactions.map((reaction, idx) => (
                <span key={idx} className="text-sm">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}

          {/* Quick Reactions (on hover) */}
          {onReact && (
            <div className={`absolute -top-8 ${isOwn ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity bg-bg-card border border-border-primary rounded-full px-2 py-1 shadow-lg flex gap-1`}>
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onReact(emoji)}
                  className="hover:scale-125 transition-transform text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time + Status */}
        <div className="flex items-center gap-1 mt-1 px-2">
          <span className="text-xs text-text-muted">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span className="text-text-muted">
              {message.status === 'read' && <CheckCheck size={14} className="text-primary" />}
              {message.status === 'delivered' && <CheckCheck size={14} />}
              {message.status === 'sent' && <Check size={14} />}
              {message.status === 'sending' && (
                <div className="w-3 h-3 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
