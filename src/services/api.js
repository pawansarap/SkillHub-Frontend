import axios from 'axios';
import { API_URL } from '../config/constants';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
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
};

// Assessments API
export const assessmentsAPI = {
  getAll: () => api.get('/assessments'),
  getById: (id) => api.get(`/assessments/${id}`),
  start: (id) => api.post(`/assessments/${id}/start`),
  submit: (id, answers) => api.post(`/assessments/${id}/submit`, { answers }),
};

// Micro-credentials API
export const credentialsAPI = {
  getAll: () => api.get('/credentials'),
  getById: (id) => api.get(`/credentials/${id}`),
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
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
};

export default api; 