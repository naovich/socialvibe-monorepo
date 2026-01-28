export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  friendsCount: number;
  postsCount: number;
  isOnline?: boolean;
  isFollowing?: boolean;
  vibeScore?: number;
  badges?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: {
    id?: string;
    name: string;
    avatar: string;
    username: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  createdAt: string;
  location?: string;
  vibeTags?: string[];
}

export interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  image: string;
  viewed: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'friend_request' | 'follow' | 'mention' | 'badge';
  user: {
    name: string;
    avatar: string;
    username?: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
  postId?: string;
}
