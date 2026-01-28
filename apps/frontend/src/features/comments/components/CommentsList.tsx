import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import CommentItem from './CommentItem';

interface CommentsListProps {
  postId: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
  const { comments, isLoading, addComment, likeComment, deleteComment } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment({
        postId,
        content: newComment.trim(),
        parentId: replyToId || undefined,
      });
      setNewComment('');
      setReplyToId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyToId(commentId);
    document.getElementById('comment-input')?.focus();
  };

  const cancelReply = () => {
    setReplyToId(null);
  };

  return (
    <div className="mt-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        {replyToId && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-text-muted">Replying to comment</span>
            <button
              type="button"
              onClick={cancelReply}
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
            alt="You"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              id="comment-input"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyToId ? 'Write a reply...' : 'Write a comment...'}
              className="w-full bg-bg-secondary border border-border-primary rounded-xl px-4 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-hover disabled:text-text-muted disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-1">
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={likeComment}
              onDelete={deleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsList;
