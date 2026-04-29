import api from './api';

export const automationService = {
  getDashboard: async () => {
    const response = await api.get(`/automations/dashboard`);
    return response.data;
  },
  dismissRecommendation: async (id: string) => {
    const response = await api.patch(`/automations/recommendations/${id}/dismiss`);
    return response.data;
  }
};
