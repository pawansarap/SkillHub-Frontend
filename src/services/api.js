import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
      console.log('Fetching assessment stats...');
      const response = await api.get('/assessments/stats');
      console.log('Assessment stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment stats:', error.response?.data || error);
      throw error;
    }
  },
  getRecent: async () => {
    try {
      console.log('Fetching recent assessments...');
      const response = await api.get('/assessments/recent');
      console.log('Recent assessments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent assessments:', error.response?.data || error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      console.log('Fetching all assessments...');
      const res = await api.get('/assessments/');
      console.log('All assessments response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching all assessments:', error.response?.data || error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      console.log(`Fetching assessment ${id}...`);
      const response = await api.get(`/assessments/${id}`);
      console.log('Assessment details response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assessment ${id}:`, error.response?.data || error);
      throw error;
    }
  },
  create: async (assessmentData) => {
    try {
      console.log('Creating assessment with data:', assessmentData);
      const response = await api.post('/assessments', assessmentData);
      console.log('Create assessment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error.response?.data || error);
      throw error.response?.data || error.message;
    }
  },
  update: async (id, assessmentData) => {
    try {
      console.log(`Updating assessment ${id} with data:`, assessmentData);
      const response = await api.put(`/assessments/${id}`, assessmentData);
      console.log('Update assessment response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating assessment ${id}:`, error.response?.data || error);
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      console.log(`Deleting assessment ${id}...`);
      const response = await api.delete(`/assessments/${id}`);
      console.log('Delete assessment response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting assessment ${id}:`, error.response?.data || error);
      throw error.response?.data || error.message;
    }
  },
  submit: async (id, answers) => {
    try {
      console.log(`Submitting answers for assessment ${id}:`, answers);
      const response = await api.post(`/assessments/${id}/submit`, answers);
      console.log('Submit assessment response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error submitting assessment ${id}:`, error.response?.data || error);
      throw error.response?.data || error.message;
    }
  },
  getResults: async (id) => {
    try {
      console.log(`Fetching results for assessment ${id}...`);
      const response = await api.get(`/assessments/${id}/results`);
      console.log('Assessment results response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assessment ${id} results:`, error.response?.data || error);
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

export const userAssessmentsAPI = {
  getAll: async () => {
    try {
      console.log('Fetching all user assessments...');
      const res = await api.get('/user-assessments/');
      console.log('User assessments response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching user assessments:', error.response?.data || error);
      throw error;
    }
  },
  start: async (data) => {
    try {
      console.log('Starting assessment with data:', data);
      const res = await api.post('/user-assessments/start/', data);
      console.log('Start assessment response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error starting assessment:', error.response?.data || error);
      throw error;
    }
  },
  getResult: async (assessmentId) => {
    try {
      console.log(`Fetching result for user assessment ${assessmentId}...`);
      const res = await api.get(`/user-assessments/by-assessment/${assessmentId}/`);
      console.log('User assessment result response:', res.data);
      return res.data;
    } catch (error) {
      console.error(`Error fetching user assessment ${assessmentId} result:`, error.response?.data || error);
      throw error;
    }
  },
  submit: async (userAssessmentId, answers) => {
    try {
      console.log(`Submitting answers for user assessment ${userAssessmentId}:`, answers);
      const res = await api.post(`/user-assessments/submit/`, { user_assessment_id: userAssessmentId, answers });
      console.log('Submit user assessment response:', res.data);
      return res.data;
    } catch (error) {
      console.error(`Error submitting user assessment ${userAssessmentId}:`, error.response?.data || error);
      throw error;
    }
  }
};

export const userAnswersAPI = {
  getAll: () => api.get('/user-answers/'),
  create: (data) => api.post('/user-answers/', data),
};

export default api; 