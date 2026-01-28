import React, { useState } from 'react';
import { Heart, Reply, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

interface NestedCommentsProps {
  comments: Comment[];
  onReply: (commentId: string, text: string) => void;
  onLike: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  level?: number;
}

const NestedComments: React.FC<NestedCommentsProps> = ({
  comments,
  onReply,
  onLike,
  onDelete,
  level = 0,
}) => {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const toggleExpanded = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleReply = (commentId: string) => {
    if (replyText.trim()) {
      onReply(commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return commentDate.toLocaleDateString();
  };

  const maxLevel = 3; // Maximum nesting level

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-8 mt-3' : ''}`}>
      {comments.map((comment) => {
        const isExpanded = expandedComments.has(comment.id);
        const hasReplies = comment.replies && comment.replies.length > 0;

        return (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <div className="flex gap-3">
              {/* Avatar */}
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full border border-border-primary flex-shrink-0"
              />

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-bg-secondary rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary text-sm">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      @{comment.user.username}
                    </span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-text-primary text-sm leading-relaxed">
                    {comment.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-2 px-2">
                  <button
                    onClick={() => onLike(comment.id)}
                    className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                      comment.isLiked
                        ? 'text-red-500'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Heart
                      size={14}
                      fill={comment.isLiked ? 'currentColor' : 'none'}
                    />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>

                  {level < maxLevel && (
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Reply size={14} />
                      <span>Reply</span>
                    </button>
                  )}

                  {hasReplies && (
                    <button
                      onClick={() => toggleExpanded(comment.id)}
                      className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={14} />
                          <span>Hide replies</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          <span>
                            {comment.replies!.length}{' '}
                            {comment.replies!.length === 1 ? 'reply' : 'replies'}
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  <button className="ml-auto text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {replyingTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to @${comment.user.username}...`}
                          className="flex-1 bg-bg-tertiary border border-border-primary rounded-full px-4 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-orange-primary/50 transition-colors"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleReply(comment.id);
                            } else if (e.key === 'Escape') {
                              setReplyingTo(null);
                              setReplyText('');
                            }
                          }}
                        />
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="px-4 py-2 bg-orange-primary hover:bg-orange-hover disabled:bg-white/5 disabled:text-text-disabled rounded-full text-sm font-semibold text-white transition-colors"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 hover:bg-white/5 rounded-full text-sm font-semibold text-text-secondary transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Nested Replies */}
                <AnimatePresence>
                  {isExpanded && hasReplies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <NestedComments
                        comments={comment.replies!}
                        onReply={onReply}
                        onLike={onLike}
                        onDelete={onDelete}
                        level={level + 1}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default NestedComments;
