export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  parentId: string | null;
  replies: Comment[];
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}

export interface CommentsState {
  comments: Record<string, Comment[]>;
  isLoading: boolean;
  error: string | null;
}
