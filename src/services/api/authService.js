import axiosInstance from './axiosConfig';

export const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/token/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/users/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/users/me/');
    return response.data;
  },

  updateProfile: async (userId, userData) => {
    const response = await axiosInstance.patch(`/users/${userId}/`, userData);
    return response.data;
  },
}; 