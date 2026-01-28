import React, { useState } from 'react';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import type { Comment } from '../types/comment.types';

interface CommentItemProps {
  comment: Comment;
  level?: number;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  level = 0,
  onReply,
  onLike,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const maxLevel = 3;
  const isMaxLevel = level >= maxLevel;

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <div className={`${level > 0 ? 'ml-12 mt-3' : 'mt-4'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-text-primary text-sm">{comment.user.name}</span>
            <span className="text-text-muted text-xs">@{comment.user.username}</span>
            <span className="text-text-muted text-xs">·</span>
            <span className="text-text-muted text-xs">{formatTimeAgo(comment.createdAt)}</span>
          </div>

          {/* Comment text */}
          <p className="text-text-primary text-sm mb-2">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 transition-colors ${
                comment.isLiked
                  ? 'text-error'
                  : 'text-text-muted hover:text-error'
              }`}
            >
              <Heart
                size={14}
                className={comment.isLiked ? 'fill-current' : ''}
              />
              {comment.likes > 0 && (
                <span className="text-xs">{comment.likes}</span>
              )}
            </button>

            {!isMaxLevel && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
              >
                <MessageCircle size={14} />
                <span className="text-xs font-medium">Reply</span>
              </button>
            )}

            {comment.userId === 'current-user' && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-text-muted hover:text-error transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.length > 1 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-text-muted hover:text-text-primary text-xs font-medium mb-2 transition-colors"
                >
                  {isExpanded ? '—' : '+'} {comment.replies.length} replies
                </button>
              )}

              {isExpanded && (
                <div>
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      level={level + 1}
                      onReply={onReply}
                      onLike={onLike}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
