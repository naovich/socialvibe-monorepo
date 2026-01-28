import React, { useEffect, useRef, useCallback } from 'react';
import { useFeed } from '../hooks/useFeed';
import PostCard from './PostCard';
import FeedSkeleton from './FeedSkeleton';
import CreatePostButton from './CreatePostButton';

interface FeedContainerProps {
  onCreatePost?: () => void;
}

const FeedContainer: React.FC<FeedContainerProps> = ({ onCreatePost }) => {
  const { 
    posts, 
    isLoading, 
    hasMore, 
    error, 
    loadMore,
    likePost,
    savePost,
    sharePost,
  } = useFeed();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, posts.length]);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-error text-lg font-semibold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Quick Button */}
      <CreatePostButton onClick={onCreatePost} />

      {/* Posts */}
      {posts.length === 0 && !isLoading ? (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">No posts yet. Be the first to share!</p>
          {onCreatePost && (
            <button
              onClick={onCreatePost}
              className="mt-6 px-8 py-4 bg-primary hover:bg-primary-hover rounded-xl text-white font-semibold transition-all shadow-lg shadow-primary/25"
            >
              Create Your First Post
            </button>
          )}
        </div>
      ) : (
        <>
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <PostCard 
                post={post}
                onLike={() => likePost(post.id)}
                onSave={() => savePost(post.id)}
                onShare={() => sharePost(post.id)}
              />
            </div>
          ))}

          {/* Loading More Indicator */}
          {isLoading && <FeedSkeleton count={2} />}

          {/* End of Feed */}
          {!hasMore && posts.length > 0 && (
            <div className="py-12 text-center">
              <div className="inline-block px-6 py-3 bg-bg-secondary rounded-full">
                <p className="text-text-muted font-medium">You're all caught up! 🎉</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedContainer;
