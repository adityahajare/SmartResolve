import API from './api';

export const authService = {
  login: async (credentials) => {
    const res = await API.post('/api/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await API.post('/api/auth/register', userData);
    return res.data;
  },
  logout: async () => {
    try {
      await API.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  getCurrentUser: async () => {
    const res = await API.get('/api/users/me');
    return res.data;
  }
};
