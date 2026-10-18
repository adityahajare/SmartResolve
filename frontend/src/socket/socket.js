import { io } from 'socket.io-client';

let socket;

const getSocketURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://smartresolve-backend-m88l.onrender.com';
  }
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (!envUrl || envUrl === 'https://smartresolve-backend.onrender.com') {
    return 'https://smartresolve-backend-m88l.onrender.com';
  }
  return envUrl;
};

export const initSocket = (token) => {
  if (!socket) {
    socket = io(getSocketURL(), {
      auth: { token },
      autoConnect: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
