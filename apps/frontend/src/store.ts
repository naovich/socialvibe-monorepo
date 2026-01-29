import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post, User, Story, Notification } from './types';
import { postsAPI, likesAPI, commentsAPI } from './services/api';
import { mockUsers, mockPosts, mockStories, mockNotifications } from './mock';
import { socketService } from './services/socket';

interface SocialStore {
  currentUser: User;
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  theme: 'dark' | 'light';
  onlineUsers: string[];

  // Actions
  fetchPosts: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked' | 'createdAt'>) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
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
      onlineUsers: [],

      fetchPosts: async () => {
        set({ isLoading: true });
        try {
          const posts = await postsAPI.getAll();
          // Map backend response to frontend types (ensure isLiked exists)
          const mappedPosts = posts.map((post: any) => ({
            id: post.id,
            author: post.author,
            caption: post.caption,
            image: post.image,
            likes: post._count?.likes || 0,
            comments: post.comments || [],
            isLiked: post.isLiked || false,
            createdAt: post.createdAt,
          }));
          set({ posts: mappedPosts, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An error occurred';
          set({ error: message, isLoading: false, posts: mockPosts.posts });
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

      connectWebSocket: () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        socketService.connect(token);

        // Listen for new posts
        socketService.on('post:new', (post: Post) => {
          set((state) => ({
            posts: [post, ...state.posts],
          }));
        });

        // Listen for likes
        socketService.on('post:liked', (data: { postId: string; user: any }) => {
          set((state) => ({
            notifications: [
              {
                id: Date.now().toString(),
                type: 'like' as const,
                user: {
                  name: data.user.name,
                  avatar: data.user.avatar,
                  username: data.user.username,
                },
                content: 'liked your post',
                createdAt: new Date().toISOString(),
                read: false,
                postId: data.postId,
              },
              ...state.notifications,
            ],
          }));
        });

        // Listen for comments
        socketService.on('comment:new', (data: any) => {
          set((state) => ({
            notifications: [
              {
                id: Date.now().toString(),
                type: 'comment' as const,
                user: {
                  name: data.user.name,
                  avatar: data.user.avatar,
                  username: data.user.username,
                },
                content: 'commented on your post',
                createdAt: new Date().toISOString(),
                read: false,
                postId: data.postId,
              },
              ...state.notifications,
            ],
          }));
        });

        // Listen for online users
        socketService.on('users:online', (users: string[]) => {
          set({ onlineUsers: users });
        });

        socketService.on('user:online', (data: { userId: string }) => {
          set((state) => ({
            onlineUsers: [...new Set([...state.onlineUsers, data.userId])],
          }));
        });

        socketService.on('user:offline', (data: { userId: string }) => {
          set((state) => ({
            onlineUsers: state.onlineUsers.filter((id) => id !== data.userId),
          }));
        });
      },

      disconnectWebSocket: () => {
        socketService.disconnect();
        set({ onlineUsers: [] });
      },
    }),
    {
      name: 'social-vibe-storage',
    }
  )
);
