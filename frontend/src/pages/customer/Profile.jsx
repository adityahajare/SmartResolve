import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Shield } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl font-black tracking-wide text-white">User Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your account details and notification preferences.</p>
      </div>

      <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(217,70,239,0.4)]">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || 'Customer'}</h2>
            <p className="text-xs text-fuchsia-400 font-semibold uppercase tracking-wider">Role: {user?.role || 'Customer'}</p>
          </div>
        </div>

        <div className="border-t border-fuchsia-950/70 pt-5 space-y-3 text-xs">
          <div className="flex items-center gap-3 p-3 bg-[#19112e] rounded-xl border border-fuchsia-950/80">
            <Mail className="w-4 h-4 text-fuchsia-400" />
            <span className="text-slate-300">{user?.email || 'user@smartresolve.ai'}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#19112e] rounded-xl border border-fuchsia-950/80">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Account Tier: <strong className="capitalize text-emerald-400">{user?.accountType || 'Standard'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
