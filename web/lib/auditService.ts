import api from './api';

export const auditService = {
  startAudit: async (leadId: string) => {
    const response = await api.post(`/audit/run/${leadId}`);
    return response.data;
  },
  startBulkAudit: async () => {
    const response = await api.post(`/audit/run-bulk`);
    return response.data;
  },
  getTopLeads: async (params?: any) => {
    const response = await api.get(`/audit/top`, { params });
    return response.data;
  },
  getLeadReport: async (leadId: string) => {
    const response = await api.get(`/audit/${leadId}/report`);
    return response.data;
  }
};
