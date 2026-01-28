export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  caption: string;
  images?: string[];
  video?: string;
  poll?: {
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
    totalVotes: number;
    userVote?: string;
    expiresAt?: string;
  };
  vibeTag?: string;
  location?: string;
  privacy: 'public' | 'friends' | 'private';
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  createdAt: string;
}

export interface CreatePostData {
  caption: string;
  images?: File[];
  video?: File;
  poll?: {
    question: string;
    options: string[];
    expiresAt?: string;
  };
  vibeTag?: string;
  location?: string;
  privacy: 'public' | 'friends' | 'private';
  taggedFriends?: string[];
}

export interface FeedFilter {
  type: 'all' | 'friends' | 'following';
  sort: 'recent' | 'popular';
}

export interface FeedState {
  posts: Post[];
  filter: FeedFilter;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
}
