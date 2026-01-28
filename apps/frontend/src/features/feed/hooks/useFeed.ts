import { useState, useEffect, useCallback } from 'react';
import type { Post, FeedFilter, CreatePostData } from '../types/feed.types';
import { feedService } from '../services/feedService';

export const useFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FeedFilter>({ type: 'all', sort: 'recent' });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async (pageNum: number, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const { posts: newPosts, hasMore: more } = await feedService.getFeed(filter, pageNum);
      
      setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
      setHasMore(more);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load feed');
      console.error('Feed error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  const refreshFeed = useCallback(() => {
    loadFeed(1, false);
  }, [loadFeed]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadFeed(page + 1, true);
    }
  }, [isLoading, hasMore, page, loadFeed]);

  const createPost = useCallback(async (data: CreatePostData) => {
    try {
      const newPost = await feedService.createPost(data);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error('Create post error:', err);
      throw err;
    }
  }, []);

  const likePost = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
        : post
    ));

    try {
      await feedService.likePost(postId);
    } catch (err) {
      // Rollback on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? 1 : -1) }
          : post
      ));
      console.error('Like post error:', err);
    }
  }, []);

  const savePost = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));

    try {
      await feedService.savePost(postId);
    } catch (err) {
      // Rollback
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved }
          : post
      ));
      console.error('Save post error:', err);
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await feedService.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Delete post error:', err);
      throw err;
    }
  }, []);

  const sharePost = useCallback(async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));

    try {
      await feedService.sharePost(postId);
    } catch (err) {
      console.error('Share post error:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFeed(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]); // Reload when filter changes

  return {
    posts,
    isLoading,
    hasMore,
    error,
    filter,
    setFilter,
    refreshFeed,
    loadMore,
    createPost,
    likePost,
    savePost,
    deletePost,
    sharePost,
  };
};
