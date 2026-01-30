import { apiClient } from './client';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    avatar: string | null;
    createdAt: string;
  };
  token: string;
}

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    // Save tokens and user to localStorage (backend returns access_token + refresh_token)
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    // Save tokens and user to localStorage (backend returns access_token + refresh_token)
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    localStorage.setItem('auth_user', JSON.stringify(response.data));
    return response.data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
