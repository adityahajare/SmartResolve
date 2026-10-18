import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://smartresolve-backend-m88l.onrender.com';
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl === 'https://smartresolve-backend.onrender.com') {
    return 'https://smartresolve-backend-m88l.onrender.com';
  }
  return envUrl;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
