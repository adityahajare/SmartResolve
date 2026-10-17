import { create } from 'zustand';

let initialUser = null;
try {
  const item = localStorage.getItem('user');
  if (item && item !== 'undefined') initialUser = JSON.parse(item);
} catch (_) {
  localStorage.removeItem('user');
}

export const useAuthStore = create((set) => ({
  user: initialUser,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!(localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined'),
  
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedData) => {
    set((state) => {
      const newUser = { ...state.user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return { user: newUser };
    });
  }
}));
