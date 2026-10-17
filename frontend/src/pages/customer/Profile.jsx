import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your account details and notification preferences.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name || 'Customer'}</h2>
            <p className="text-xs text-gray-500 capitalize">Role: {user?.role || 'Customer'}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{user?.email || 'user@smartresolve.local'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="w-4 h-4 text-gray-400" />
            <span>Account Type: <strong className="capitalize">{user?.accountType || 'Standard'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
