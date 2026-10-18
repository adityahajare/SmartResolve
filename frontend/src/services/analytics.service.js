import API from './api';

export const analyticsService = {
  getCustomerAnalytics: async (id) => {
    const res = await API.get(`/api/analytics/customer/${id}`);
    return res.data;
  },
  getAdminAnalytics: async () => {
    const res = await API.get('/api/analytics/admin');
    return res.data;
  },
  getAgentLeaderboard: async () => {
    const res = await API.get('/api/analytics/agents');
    return res.data;
  },
  getCategoryAnalytics: async () => {
    const res = await API.get('/api/analytics/categories');
    return res.data;
  },
  getSLACompliance: async () => {
    const res = await API.get('/api/analytics/sla');
    return res.data;
  },
  getMLDataset: async () => {
    const res = await API.get('/api/analytics/dataset');
    return res.data;
  }
};
