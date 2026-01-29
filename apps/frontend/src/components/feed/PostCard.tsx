import React, { useState } from 'react';
import { MessageCircle, Send, MoreHorizontal, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '../../store';
import type { Post } from '../../types';
import ReactionPicker from '../ui/ReactionPicker';
import ImageCarousel from '../ui/ImageCarousel';
import VibeTag from '../ui/VibeTag';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  const { toggleLike, addComment } = useSocialStore();
  const [commentText, setCommentText] = useState('');
  const [currentReaction, setCurrentReaction] = useState<string | undefined>(
    post.isLiked ? '❤️' : undefined
  );
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleReact = (emoji: string) => {
    if (currentReaction === emoji) {
      // Remove reaction
      setCurrentReaction(undefined);
      setLikesCount((prev: number) => prev - 1);
    } else if (currentReaction) {
      // Change reaction (count stays same)
      setCurrentReaction(emoji);
    } else {
      // Add new reaction
      setCurrentReaction(emoji);
      setLikesCount((prev: number) => prev + 1);
    }
    toggleLike(post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  // Convert single image to array for carousel
  const images = post.image ? [post.image] : [];

  return (
    <motion.div
      className="bg-bg-card border border-border-primary rounded-2xl mb-6 overflow-hidden shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div 
          className="relative group cursor-pointer"
          onClick={() => navigate(`/user/${post.user.id || post.userId}`)}
        >
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full border border-primary/30 group-hover:border-primary transition-colors"
          />
          <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex flex-col">
          <span 
            onClick={() => navigate(`/user/${post.user.id || post.userId}`)}
            className="font-bold text-text-primary hover:underline cursor-pointer"
          >
            {post.user.name}
          </span>
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
            {new Date(post.createdAt).toLocaleDateString()} • {post.location || 'Global'}
          </span>
        </div>
        <button className="ml-auto p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-text-primary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-text-primary text-sm leading-relaxed">{post.caption}</p>

        {/* Vibe Tags */}
        {post.vibeTags && post.vibeTags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {post.vibeTags.map((vibe: string, index: number) => (
              <VibeTag key={index} emoji={vibe} size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* Image Carousel */}
      {images.length > 0 && <ImageCarousel images={images} aspectRatio="video" />}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-secondary">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center border border-bg-card z-10">
              <span className="text-xs">❤️</span>
            </div>
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border border-bg-card z-0">
              <span className="text-xs">👍</span>
            </div>
          </div>
          <span className="text-xs text-text-secondary font-medium ml-1">
            {likesCount} {likesCount === 1 ? 'reaction' : 'reactions'}
          </span>
        </div>
        <div className="flex gap-3">
          <span className="text-xs text-text-secondary font-medium">
            {post.comments.length} comments
          </span>
          <span className="text-xs text-text-secondary font-medium">12 shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-2 py-1">
        <ReactionPicker onReact={handleReact} currentReaction={currentReaction} />

        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-text-secondary hover:bg-white/5 transition-all">
          <MessageCircle size={20} />
          <span className="text-sm font-semibold">Comment</span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-text-secondary hover:bg-white/5 transition-all">
          <Share2 size={20} />
          <span className="text-sm font-semibold">Share</span>
        </button>

        <button className="p-2 rounded-xl text-text-secondary hover:bg-white/5 transition-all">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Comments Section */}
      <div className="px-4 pb-4">
        <div className="flex gap-3 items-center">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nadhoir"
            className="w-8 h-8 rounded-full border border-border-primary"
            alt="Your avatar"
          />
          <form className="flex-1 relative" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full bg-white/5 border border-border-primary rounded-full px-4 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-hover transition-colors"
              disabled={!commentText.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
