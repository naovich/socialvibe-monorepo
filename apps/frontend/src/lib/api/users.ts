import { apiClient } from './client';

export interface UpdateUserData {
  name?: string;
  username?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
}

export const usersApi = {
  async search(query: string, limit: number = 20) {
    const response = await apiClient.get('/users/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async getByUsername(username: string) {
    const response = await apiClient.get(`/users/username/${username}`);
    return response.data;
  },

  async update(id: string, data: UpdateUserData) {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  async toggleFollow(id: string) {
    const response = await apiClient.post(`/users/${id}/follow`);
    return response.data;
  },

  async getFollowers(id: string) {
    const response = await apiClient.get(`/users/${id}/followers`);
    return response.data;
  },

  async getFollowing(id: string) {
    const response = await apiClient.get(`/users/${id}/following`);
    return response.data;
  },
};
