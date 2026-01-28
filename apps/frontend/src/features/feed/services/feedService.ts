import type { Post, CreatePostData, FeedFilter } from '../types/feed.types';
import { mockPosts, generateMorePosts } from '../mock/mockFeed';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class FeedService {
  private posts: Post[] = [...mockPosts];

  async getFeed(filter: FeedFilter, page: number = 1, limit: number = 10): Promise<{ posts: Post[]; hasMore: boolean }> {
    await delay(500); // Simulate network delay

    const startIndex = (page - 1) * limit;
    
    // Generate more posts if needed
    if (startIndex >= this.posts.length) {
      const newPosts = generateMorePosts(page, limit);
      this.posts.push(...newPosts);
    }

    let filteredPosts = [...this.posts];

    // Apply filter
    if (filter.type === 'friends') {
      // In real app, filter by friendship status
      filteredPosts = filteredPosts.filter(p => p.privacy !== 'private');
    }

    // Apply sort
    if (filter.sort === 'popular') {
      filteredPosts.sort((a, b) => b.likes - a.likes);
    } else {
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filteredPosts.length || page < 5; // Limit to 5 pages

    return { posts: paginatedPosts, hasMore };
  }

  async createPost(data: CreatePostData): Promise<Post> {
    await delay(800);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'You',
        username: 'you',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      },
      caption: data.caption,
      images: data.images?.map((_, i) => `https://images.unsplash.com/photo-${Date.now()}-${i}?w=800`) || [],
      vibeTag: data.vibeTag,
      location: data.location,
      privacy: data.privacy,
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  async likePost(postId: string): Promise<void> {
    await delay(200);

    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
    }
  }

  async savePost(postId: string): Promise<void> {
    await delay(200);

    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isSaved = !post.isSaved;
    }
  }

  async deletePost(postId: string): Promise<void> {
    await delay(500);

    const index = this.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      this.posts.splice(index, 1);
    }
  }

  async sharePost(postId: string): Promise<void> {
    await delay(300);

    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.shares += 1;
    }
  }
}

export const feedService = new FeedService();
