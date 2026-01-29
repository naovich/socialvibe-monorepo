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

// Intercepteur pour gérer les erreurs d'authentification avec refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
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
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.clear();
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
  getAll: async (page = 1, limit = 20) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    // Backend returns { posts, pagination }
    return response.data.posts || response.data;
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

  getUserPosts: async (userId: string, page = 1, limit = 20) => {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data.posts || response.data;
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
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  getByPost: async (postId: string) => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
  },
};

// ========== UPLOAD ==========
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  },
};

export default api;
