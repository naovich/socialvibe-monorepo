import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkStore {
  savedPosts: Set<string>;
  toggleBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;
  getSavedPosts: () => string[];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      savedPosts: new Set<string>(),

      toggleBookmark: (postId: string) => {
        set((state) => {
          const newSavedPosts = new Set(state.savedPosts);
          if (newSavedPosts.has(postId)) {
            newSavedPosts.delete(postId);
          } else {
            newSavedPosts.add(postId);
          }
          return { savedPosts: newSavedPosts };
        });
      },

      isBookmarked: (postId: string) => {
        return get().savedPosts.has(postId);
      },

      getSavedPosts: () => {
        return Array.from(get().savedPosts);
      },
    }),
    {
      name: 'bookmark-storage',
      // Convert Set to Array for storage
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              savedPosts: new Set(state.savedPosts),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              savedPosts: Array.from(value.state.savedPosts),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
