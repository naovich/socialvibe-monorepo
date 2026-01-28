import { apiClient } from './client';

export interface CreatePostData {
  caption: string;
  image?: string;
}

export interface UpdatePostData {
  caption?: string;
  image?: string;
}

export const postsApi = {
  async getAll(page: number = 1, limit: number = 20) {
    const response = await apiClient.get('/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  async getUserPosts(userId: string, page: number = 1, limit: number = 20) {
    const response = await apiClient.get(`/posts/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async create(data: CreatePostData) {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  async update(id: string, data: UpdatePostData) {
    const response = await apiClient.patch(`/posts/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  async toggleLike(id: string) {
    const response = await apiClient.post(`/posts/${id}/like`);
    return response.data;
  },
};
