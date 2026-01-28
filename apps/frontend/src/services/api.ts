import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const authAPI = {
  register: async (data: { email: string; password: string; name: string; username: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

// ========== USERS ==========
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getCurrent: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// ========== POSTS ==========
export const postsAPI = {
  getAll: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data: { caption: string; image?: string }) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  update: async (id: string, data: { caption?: string; image?: string }) => {
    const response = await api.patch(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/posts/${id}`);
  },
};

// ========== COMMENTS ==========
export const commentsAPI = {
  getByPost: async (postId: string) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  create: async (postId: string, text: string) => {
    const response = await api.post(`/comments/${postId}`, { text });
    return response.data;
  },

  delete: async (commentId: string) => {
    await api.delete(`/comments/${commentId}`);
  },
};

// ========== LIKES ==========
export const likesAPI = {
  toggle: async (postId: string) => {
    const response = await api.post(`/likes/${postId}`);
    return response.data;
  },

  getByPost: async (postId: string) => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
  },
};

export default api;
