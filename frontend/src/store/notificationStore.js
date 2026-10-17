import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length
  }),

  markRead: (id) => set((state) => {
    const updated = state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n);
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.isRead).length
    };
  }),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  }))
}));
