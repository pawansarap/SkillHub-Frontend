import axiosInstance from './axiosConfig';

export const achievementService = {
  getAllAchievements: async () => {
    const response = await axiosInstance.get('/achievements/');
    return response.data;
  },

  getUserAchievements: async () => {
    const response = await axiosInstance.get('/user-achievements/');
    return response.data;
  },

  getAchievementDetails: async (achievementId) => {
    const response = await axiosInstance.get(`/achievements/${achievementId}/`);
    return response.data;
  }
}; 