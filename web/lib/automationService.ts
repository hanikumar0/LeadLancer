import api from './api';

export const automationService = {
  getDashboard: async () => {
    const response = await api.get(`/automations/dashboard`);
    return response.data;
  },
  addRule: async (data: any) => {
    const response = await api.post(`/automations/rules`, data);
    return response.data;
  },
  addTask: async (data: any) => {
    const response = await api.post(`/automations/tasks`, data);
    return response.data;
  },
  dismissRecommendation: async (id: string) => {
    const response = await api.patch(`/automations/recommendations/${id}/dismiss`);
    return response.data;
  }
};
