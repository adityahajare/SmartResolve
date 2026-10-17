import API from './api';

export const notificationService = {
  getNotifications: async () => {
    const res = await API.get('/api/notifications');
    return res.data;
  },
  markRead: async (id) => {
    const res = await API.patch(`/api/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await API.patch('/api/notifications/read-all');
    return res.data;
  },
  deleteNotification: async (id) => {
    const res = await API.delete(`/api/notifications/${id}`);
    return res.data;
  }
};
