import api from './api';

export const leadService = {
  getLeads: async (params?: any) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },
  updateLead: async (id: string, data: any) => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data;
  }
};
