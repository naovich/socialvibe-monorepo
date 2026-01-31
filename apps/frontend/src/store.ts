import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post, User, Story, Notification } from './types';
import { postsAPI, likesAPI, commentsAPI, usersAPI, storiesAPI } from './services/api';
import { socketService } from './services/socket';

// API response types (backend format)
interface APIPost {
  id: string;
  authorId: string;
  author: { id: string; name: string; username: string; avatar?: string };
  caption: string;
  image?: string;
  _count?: { likes: number; comments: number };
  comments?: unknown[];
  isLiked?: boolean;
  createdAt: string;
}

interface APIStoryGroup {
  userId: string;
  user: { id: string; name: string; username: string; avatar?: string };
  stories: Array<{
    id: string;
    media: string;
    type: string;
    createdAt: string;
    expiresAt: string;
    userId: string;
  }>;
}

interface SocialStore {
  currentUser: User | null;
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  theme: 'dark' | 'light';
  onlineUsers: string[];

  // Actions
  fetchCurrentUser: () => Promise<void>;
  setCurrentUser: (user: User) => void;
  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<Post[]>;
  fetchStories: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked' | 'createdAt'>) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  logout: () => void;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      posts: [],
      stories: [],
      notifications: [],
      isLoading: false,
      error: null,
      theme: 'dark',
      onlineUsers: [],

      fetchCurrentUser: async () => {
        try {
          const user = await usersAPI.getCurrent();
          set({ 
            currentUser: {
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
              coverImage: user.coverImage,
              bio: user.bio,
              friendsCount: user._count?.friends || 0,
              postsCount: user._count?.posts || 0,
            }
          });
        } catch (error) {
          console.error('Failed to fetch current user:', error);
        }
      },

      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },

      fetchUserPosts: async (userId: string) => {
        try {
          const posts = await postsAPI.getUserPosts(userId);
          const mappedPosts = posts.map((post: APIPost) => ({
            id: post.id,
            userId: post.authorId,
            user: {
              id: post.author.id,
              name: post.author.name,
              username: post.author.username,
              avatar: post.author.avatar,
            },
            caption: post.caption,
            image: post.image,
            likes: post._count?.likes || 0,
            comments: post.comments || [],
            isLiked: post.isLiked || false,
            createdAt: post.createdAt,
          }));
          return mappedPosts;
        } catch (error) {
          console.error('Failed to fetch user posts:', error);
          return [];
        }
      },

      fetchPosts: async () => {
        set({ isLoading: true });
        try {
          const posts = await postsAPI.getAll();
          // Map backend response to frontend types
          const mappedPosts = posts.map((post: APIPost) => ({
            id: post.id,
            userId: post.authorId,
            user: {
              id: post.author.id,
              name: post.author.name,
              username: post.author.username,
              avatar: post.author.avatar,
            },
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
          set({ error: message, isLoading: false });
        }
      },

      fetchStories: async () => {
        try {
          const data = await storiesAPI.getActive();
          // Map backend response to frontend Story type
          const mappedStories = data.flatMap((group: APIStoryGroup) => 
            group.stories.map((story: APIStoryGroup["stories"][0]) => ({
              id: story.id,
              user: {
                name: group.user.name,
                avatar: group.user.avatar,
              },
              image: story.media,
              viewed: false, // TODO: Track viewed stories
            }))
          );
          set({ stories: mappedStories });
        } catch (error) {
          console.error('Failed to fetch stories:', error);
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
          const mappedPost = {
            id: newPost.id,
            userId: newPost.authorId,
            user: {
              id: newPost.author.id,
              name: newPost.author.name,
              username: newPost.author.username,
              avatar: newPost.author.avatar,
            },
            caption: newPost.caption,
            image: newPost.image,
            likes: newPost._count?.likes || 0,
            comments: [],
            isLiked: false,
            createdAt: newPost.createdAt,
          };
          set((state) => ({
            posts: [mappedPost, ...state.posts],
          }));
        } catch (error) {
          console.error('Failed to create post:', error);
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
        socketService.on('post:new', (rawData: unknown) => {
          const post = rawData as Post;
          set((state) => ({
            posts: [post, ...state.posts],
          }));
        });

        // Listen for likes
        socketService.on('post:liked', (rawData: unknown) => {
          const data = rawData as { postId: string; user: { name: string; avatar?: string; username: string } };
          set((state) => ({
            notifications: [
              {
                id: Date.now().toString(),
                type: 'like' as const,
                user: {
                  name: data.user.name,
                  avatar: data.user.avatar || '',
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
        socketService.on('comment:new', (rawData: unknown) => {
          const data = rawData as { postId: string; user: { name: string; avatar?: string; username: string }; text: string };
          set((state) => ({
            notifications: [
              {
                id: Date.now().toString(),
                type: 'comment' as const,
                user: {
                  name: data.user.name,
                  avatar: data.user.avatar || '',
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
        socketService.on('users:online', (rawData: unknown) => {
          const users = rawData as string[];
          set({ onlineUsers: users });
        });

        socketService.on('user:online', (rawData: unknown) => {
          const data = rawData as { userId: string };
          set((state) => ({
            onlineUsers: [...new Set([...state.onlineUsers, data.userId])],
          }));
        });

        socketService.on('user:offline', (rawData: unknown) => {
          const data = rawData as { userId: string };
          set((state) => ({
            onlineUsers: state.onlineUsers.filter((id) => id !== data.userId),
          }));
        });
      },

      disconnectWebSocket: () => {
        socketService.disconnect();
        set({ onlineUsers: [] });
      },

      logout: () => {
        socketService.disconnect();
        localStorage.clear();
        set({
          currentUser: null,
          posts: [],
          stories: [],
          notifications: [],
          onlineUsers: [],
        });
      },
    }),
    {
      name: 'social-vibe-storage',
    }
  )
);
