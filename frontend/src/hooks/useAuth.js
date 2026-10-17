import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    logout,
    isCustomer: user?.role === 'customer',
    isAgent: user?.role === 'agent',
    isManager: user?.role === 'manager',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    role: user?.role || 'customer'
  };
};
