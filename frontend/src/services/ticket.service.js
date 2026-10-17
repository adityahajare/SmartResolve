import API from './api';

export const ticketService = {
  createTicket: async (data) => {
    const res = await API.post('/api/tickets', data);
    return res.data;
  },
  getTickets: async (params = {}) => {
    const res = await API.get('/api/tickets', { params });
    return res.data;
  },
  getTicketById: async (id) => {
    const res = await API.get(`/api/tickets/${id}`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await API.patch(`/api/tickets/${id}/status`, { status });
    return res.data;
  },
  addMessage: async (id, messageData) => {
    const res = await API.post(`/api/tickets/${id}/messages`, messageData);
    return res.data;
  },
  escalate: async (id, data) => {
    const res = await API.post(`/api/tickets/${id}/escalate`, data);
    return res.data;
  },
  assign: async (id, data) => {
    const res = await API.post(`/api/tickets/${id}/assign`, data);
    return res.data;
  },
  getPriorityQueue: async () => {
    const res = await API.get('/api/tickets/queue');
    return res.data;
  },
  analyzeTicket: async (data) => {
    const res = await API.post('/api/tickets/analyze', data);
    return res.data;
  }
};
