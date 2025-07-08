// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Assessment Types
export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  PRACTICAL: 'practical',
  PROJECT: 'project'
};

// Assessment Status
export const ASSESSMENT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  EVALUATED: 'evaluated'
};

// Skill Types
export const SKILL_TYPES = {
  SOFT: 'soft',
  HARD: 'hard',
};

// Programming Languages
export const PROGRAMMING_LANGUAGES = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  JAVA: 'java',
  CPP: 'cpp',
};

// API Endpoints
export const API_ENDPOINTS = {
  ASSESSMENTS: '/assessments',
  USERS: '/users',
  ADMIN: '/admin',
  AUTH: '/auth',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ASSESSMENT_CREATED: 'Assessment created successfully.',
  ASSESSMENT_UPDATED: 'Assessment updated successfully.',
  ASSESSMENT_DELETED: 'Assessment deleted successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
};

// API Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ASSESSMENTS: '/assessments',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
}; 