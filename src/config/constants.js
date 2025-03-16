// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  EVALUATOR: 'evaluator',
};

// Assessment Types
export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  PRACTICAL: 'practical',
  PROJECT: 'project',
};

// Assessment Status
export const ASSESSMENT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  EVALUATED: 'evaluated',
}; 