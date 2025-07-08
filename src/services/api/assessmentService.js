import axiosInstance from './axiosConfig';

export const assessmentService = {
  // Topic related operations
  getAllTopics: async () => {
    const response = await axiosInstance.get('/topics/');
    return response.data;
  },

  getTopicDetails: async (topicId) => {
    const response = await axiosInstance.get(`/topics/${topicId}/details/`);
    return response.data;
  },

  // Micro-credential related operations
  getMicroCredentials: async (topicId) => {
    const response = await axiosInstance.get('/micro-credentials/', {
      params: { topic: topicId }
    });
    return response.data;
  },

  // Assessment related operations
  getAssessments: async (microCredentialId) => {
    const response = await axiosInstance.get('/assessments/', {
      params: { micro_credential: microCredentialId }
    });
    return response.data;
  },

  startAssessment: async (assessmentId) => {
    const response = await axiosInstance.post(`/assessments/${assessmentId}/start/`);
    return response.data;
  },

  submitAssessment: async (userAssessmentId, answers) => {
    const response = await axiosInstance.post(`/user-assessments/${userAssessmentId}/submit/`, {
      answers
    });
    return response.data;
  },

  // User assessment history
  getUserAssessments: async () => {
    const response = await axiosInstance.get('/user-assessments/');
    return response.data;
  },

  getUserAssessmentDetails: async (userAssessmentId) => {
    const response = await axiosInstance.get(`/user-assessments/${userAssessmentId}/`);
    return response.data;
  },

  // Submit individual answers
  submitAnswer: async (userAssessmentId, questionId, choiceId) => {
    const response = await axiosInstance.post('/user-answers/', {
      user_assessment: userAssessmentId,
      question: questionId,
      selected_choice: choiceId
    });
    return response.data;
  }
}; 