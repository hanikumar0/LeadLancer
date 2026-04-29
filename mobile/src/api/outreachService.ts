import api from './api';

export const outreachService = {
  sendEmail: async (data: { leadId: string, subject: string, body: string }) => {
    const response = await api.post(`/outreach/send`, data);
    return response.data;
  },
  generateAiEmail: async (data: { leadId: string, tone?: string }) => {
    const response = await api.post(`/outreach/ai/generate`, data);
    return response.data;
  }
};
