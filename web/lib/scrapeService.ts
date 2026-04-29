import api from './api';

export const scrapeService = {
  startScrape: async (data: { keyword: string, city: string, source: string }) => {
    const response = await api.post('/scrape/start', data);
    return response.data;
  },
  getJobs: async () => {
    const response = await api.get('/scrape/jobs');
    return response.data;
  }
};

export const leadService = {
  getLeads: async (params?: any) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },
  updateLead: async (id: string, data: any) => {
    const response = await api.patch(`/leads/${id}`, data);
    return response.data;
  },
  deleteLead: async (id: string) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  }
};
