import { apiClient } from './client';

export interface CreateCommentData {
  text: string;
  parentId?: string;
}

export const commentsApi = {
  async getAll(postId: string) {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async create(postId: string, data: CreateCommentData) {
    const response = await apiClient.post(`/posts/${postId}/comments`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  },
};
