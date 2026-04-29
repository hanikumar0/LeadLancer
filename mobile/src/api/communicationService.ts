import api from './api';

export const communicationService = {
  getWhatsAppLink: async (data: { leadId: string, messageTemplate?: string }) => {
    const response = await api.post(`/communications/whatsapp/link`, data);
    return response.data;
  },
  logCommunication: async (data: { leadId: string, channel: string, direction: string, message: string }) => {
    const response = await api.post(`/communications`, data);
    return response.data;
  },
  getLeadCommunications: async (leadId: string) => {
    const response = await api.get(`/communications/${leadId}`);
    return response.data;
  }
};
