import { useState, useEffect, useCallback } from 'react';
import type { Comment, CreateCommentData } from '../types/comment.types';
import { commentsService } from '../services/commentsService';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentsService.getComments(postId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (data: CreateCommentData) => {
    try {
      const newComment = await commentsService.createComment(data);
      await loadComments();
      return newComment;
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  }, [loadComments]);

  const likeComment = useCallback(async (commentId: string) => {
    try {
      await commentsService.likeComment(commentId, postId);
      await loadComments();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  }, [postId, loadComments]);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await commentsService.deleteComment(commentId, postId);
      await loadComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  }, [postId, loadComments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    likeComment,
    deleteComment,
    refreshComments: loadComments,
  };
};
