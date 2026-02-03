import type { Comment, CreateCommentData } from '../types/comment.types';
import { mockComments } from '../mock/mockComments';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class CommentsService {
  private comments: Record<string, Comment[]> = { ...mockComments };

  async getComments(postId: string): Promise<Comment[]> {
    await delay(300);
    return this.comments[postId] || [];
  }

  async createComment(data: CreateCommentData): Promise<Comment> {
    await delay(500);

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: data.postId,
      userId: 'current-user',
      user: {
        id: 'current-user',
        name: 'You',
        username: 'you',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      },
      content: data.content,
      parentId: data.parentId || null,
      replies: [],
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.comments[data.postId]) {
      this.comments[data.postId] = [];
    }

    if (data.parentId) {
      // Add as reply to parent comment
      this.addReplyToComment(this.comments[data.postId], data.parentId, newComment);
    } else {
      // Add as top-level comment
      this.comments[data.postId].push(newComment);
    }

    return newComment;
  }

  private addReplyToComment(comments: Comment[], parentId: string, reply: Comment): boolean {
    for (const comment of comments) {
      if (comment.id === parentId) {
        comment.replies.push(reply);
        return true;
      }
      if (comment.replies.length > 0) {
        if (this.addReplyToComment(comment.replies, parentId, reply)) {
          return true;
        }
      }
    }
    return false;
  }

  async likeComment(commentId: string, postId: string): Promise<void> {
    await delay(200);
    this.toggleCommentLike(this.comments[postId], commentId);
  }

  private toggleCommentLike(comments: Comment[], commentId: string): boolean {
    for (const comment of comments) {
      if (comment.id === commentId) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
        return true;
      }
      if (comment.replies.length > 0) {
        if (this.toggleCommentLike(comment.replies, commentId)) {
          return true;
        }
      }
    }
    return false;
  }

  async deleteComment(commentId: string, postId: string): Promise<void> {
    await delay(300);
    this.removeComment(this.comments[postId], commentId);
  }

  private removeComment(comments: Comment[], commentId: string): boolean {
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      comments.splice(index, 1);
      return true;
    }

    for (const comment of comments) {
      if (comment.replies.length > 0) {
        if (this.removeComment(comment.replies, commentId)) {
          return true;
        }
      }
    }
    return false;
  }
}

export const commentsService = new CommentsService();
