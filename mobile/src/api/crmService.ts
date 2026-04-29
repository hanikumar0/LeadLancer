import api from './api';

export const crmService = {
  getStats: async () => {
    const response = await api.get(`/crm/stats`);
    return response.data;
  },
  updateLeadStage: async (id: string, crmStage: string) => {
    const response = await api.patch(`/crm/leads/${id}/stage`, { crmStage });
    return response.data;
  }
};
