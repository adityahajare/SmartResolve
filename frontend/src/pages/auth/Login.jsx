import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        const token = res.data.token || res.data.accessToken;
        setAuth(res.data.user, token);
        if (['admin', 'super_admin', 'agent', 'manager'].includes(res.data.user.role)) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.error || 'Failed to login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@smartresolve.ai');
      setPassword('Admin@1234');
    } else {
      setEmail('customer@smartresolve.ai');
      setPassword('Customer@1234');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090514] p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 mx-auto flex items-center justify-center font-black text-white text-xl shadow-[0_0_25px_rgba(217,70,239,0.5)] mb-3">
            S
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">SmartResolve Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your Support Portal or Operations Console</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/60 text-rose-300 text-xs rounded-2xl border border-rose-800/80">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#1b1233] border border-fuchsia-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition"
                placeholder="user@smartresolve.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#1b1233] border border-fuchsia-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_20px_rgba(217,70,239,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Validating Credentials...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-fuchsia-950/70">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block text-center mb-2.5">
            Quick Test Accounts (MongoDB Atlas)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="py-1.5 px-2 bg-[#1c1236] hover:bg-[#231744] text-[10px] font-semibold text-fuchsia-300 rounded-lg border border-fuchsia-950/80 transition"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2 bg-[#1c1236] hover:bg-[#231744] text-[10px] font-semibold text-teal-300 rounded-lg border border-fuchsia-950/80 transition"
            >
              Demo Admin (Ops)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to SmartResolve?{' '}
          <Link to="/register" className="text-fuchsia-400 hover:underline font-bold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
