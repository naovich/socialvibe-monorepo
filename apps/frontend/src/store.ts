import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post, User, Story, Notification } from './types';
import { postsAPI, likesAPI, commentsAPI } from './services/api';
import { mockUsers, mockPosts, mockStories, mockNotifications } from './mock';

interface SocialStore {
  currentUser: User;
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  theme: 'dark' | 'light';

  // Actions
  fetchPosts: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked' | 'createdAt'>) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      currentUser: mockUsers.me,
      posts: mockPosts.posts,
      stories: mockStories.stories,
      notifications: mockNotifications.notifications,
      isLoading: false,
      error: null,
      theme: 'dark',

      fetchPosts: async () => {
        set({ isLoading: true });
        try {
          const posts = await postsAPI.getAll().catch(() => {
            return mockPosts.posts;
          });
          set({ posts, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error occurred';
          set({ error: message, isLoading: false });
        }
      },

      toggleLike: async (postId) => {
        const previousPosts = get().posts;
        set({
          posts: previousPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
              : post
          ),
        });

        try {
          await likesAPI.toggle(postId);
        } catch {
          set({ posts: previousPosts });
        }
      },

      addComment: async (postId, text) => {
        try {
          const comment = await commentsAPI.create(postId, text);
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === postId
                ? { ...post, comments: [...post.comments, comment] }
                : post
            ),
          }));
        } catch (error) {
          console.error('Failed to add comment:', error);
        }
      },

      addPost: async (postData) => {
        try {
          const newPost = await postsAPI.create(postData);
          set((state) => ({
            posts: [newPost, ...state.posts],
          }));
        } catch {
          // Fallback for demo
          set((state) => ({
            posts: [
              {
                ...postData,
                id: Date.now().toString(),
                likes: 0,
                comments: [],
                isLiked: false,
                createdAt: new Date().toISOString(),
              },
              ...state.posts,
            ],
          }));
        }
      },

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'social-vibe-storage',
    }
  )
);
