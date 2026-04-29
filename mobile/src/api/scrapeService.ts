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
