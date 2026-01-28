import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Post } from '../types/feed.types';
import CommentsList from '../../comments/components/CommentsList';
import ShareModal from '../../share/components/ShareModal';
import { useBookmark } from '../../bookmark/hooks/useBookmark';
import ClickableText from '../../text-parser/components/ClickableText';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmark(post.id);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card border border-border-primary rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full border-2 border-primary"
          />
          <div>
            <h3 className="font-semibold text-text-primary">{post.author.name}</h3>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>{formatTime(post.createdAt)}</span>
              {post.location && (
                <>
                  <span>·</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
          <MoreHorizontal size={20} className="text-text-muted" />
        </button>
      </div>

      {/* Caption */}
      <div className="text-text-primary mb-4 whitespace-pre-wrap leading-relaxed">
        <ClickableText
          text={post.caption}
          onHashtagClick={(hashtag) => console.log('Hashtag clicked:', hashtag)}
          onMentionClick={(username) => console.log('Mention clicked:', username)}
        />
      </div>

      {/* Vibe Tag */}
      {post.vibeTag && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-primary-light rounded-full text-sm">
            {post.vibeTag}
          </span>
        </div>
      )}

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden">
          {post.images.length === 1 ? (
            <img
              src={post.images[0]}
              alt="Post"
              className="w-full h-auto max-h-[600px] object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Post ${idx + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  {idx === 3 && post.images!.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{post.images!.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Poll */}
      {post.poll && (
        <div className="mb-4 p-4 bg-bg-secondary rounded-xl">
          <h4 className="font-semibold text-text-primary mb-3">{post.poll.question}</h4>
          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const percentage = post.poll!.totalVotes > 0 
                ? Math.round((option.votes / post.poll!.totalVotes) * 100) 
                : 0;
              const isVoted = post.poll!.userVote === option.id;

              return (
                <button
                  key={option.id}
                  className={`w-full relative overflow-hidden rounded-lg p-3 text-left transition-all ${
                    isVoted ? 'bg-primary text-white' : 'bg-bg-tertiary hover:bg-bg-primary'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-full transition-all ${
                      isVoted ? 'bg-primary-dark' : 'bg-primary-light'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex justify-between items-center">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm">{percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-text-muted mt-2">
            {post.poll.totalVotes} votes
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border-primary">
        <div className="flex items-center gap-6">
          {/* Like */}
          <button
            onClick={onLike}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <Heart
              size={22}
              className={`transition-all ${
                post.isLiked
                  ? 'fill-primary text-primary'
                  : 'text-text-muted group-hover:text-primary'
              }`}
            />
            <span className={post.isLiked ? 'text-primary font-semibold' : 'text-text-muted'}>
              {post.likes}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <MessageCircle size={22} />
            <span>{post.comments.length}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <Share2 size={22} />
            <span>{post.shares}</span>
          </button>
        </div>

        {/* Save */}
        <button
          onClick={toggleBookmark}
          className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
        >
          <Bookmark
            size={22}
            className={`transition-all ${
              isBookmarked ? 'fill-primary text-primary' : 'text-text-muted'
            }`}
          />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border-primary">
          <CommentsList postId={post.id} />
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postUrl={`https://socialvibe.app/post/${post.id}`}
      />
    </motion.article>
  );
};

export default PostCard;
