import { useState, useCallback } from 'react';
import { bookmarkService } from '../services/bookmarkService';

export const useBookmark = (postId: string) => {
  const [isBookmarked, setIsBookmarked] = useState(() => bookmarkService.isBookmarked(postId));

  const toggleBookmark = useCallback(() => {
    const newState = bookmarkService.toggleBookmark(postId);
    setIsBookmarked(newState);
  }, [postId]);

  return {
    isBookmarked,
    toggleBookmark,
  };
};

export const useBookmarkedPosts = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => 
    bookmarkService.getBookmarkedPosts()
  );

  const refreshBookmarks = useCallback(() => {
    setBookmarkedIds(bookmarkService.getBookmarkedPosts());
  }, []);

  const clearAll = useCallback(() => {
    bookmarkService.clearAll();
    refreshBookmarks();
  }, [refreshBookmarks]);

  return {
    bookmarkedIds,
    refreshBookmarks,
    clearAll,
  };
};
