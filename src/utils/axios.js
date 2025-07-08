import axios from 'axios';
import { STORAGE_KEYS } from '../config/constants';

const api = axios.create({
  // NOTE the trailing slash on baseURL
  baseURL: import.meta.env.VITE_API_URL?.endsWith('/') 
    ? import.meta.env.VITE_API_URL 
    : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api') + '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// inject token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// redirect on 401
api.interceptors.response.use(
  resp => resp,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
