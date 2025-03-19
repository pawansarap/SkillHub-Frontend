import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyResetToken: (token) => api.get(`/auth/reset-password/verify?token=${token}`),
};

// Assessments API
export const assessmentsAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/assessments/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getRecent: async () => {
    try {
      const response = await api.get('/assessments/recent');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/assessments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (assessmentData) => {
    try {
      const response = await api.post('/assessments', assessmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  update: async (id, assessmentData) => {
    try {
      const response = await api.put(`/assessments/${id}`, assessmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  submit: async (id, answers) => {
    try {
      const response = await api.post(`/assessments/${id}/submit`, answers);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getResults: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}/results`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Micro-credentials API
export const credentialsAPI = {
  getRecent: async () => {
    try {
      const response = await api.get('/credentials/recent');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/credentials');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Forums API
export const forumsAPI = {
  getTopics: () => api.get('/forums'),
  getTopic: (id) => api.get(`/forums/${id}`),
  createTopic: (data) => api.post('/forums', data),
  createReply: (topicId, data) => api.post(`/forums/${topicId}/replies`, data),
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAssessmentHistory: async () => {
    try {
      const response = await api.get('/users/assessment-history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAssessmentStats: async () => {
    try {
      const response = await api.get('/admin/assessments/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api; 