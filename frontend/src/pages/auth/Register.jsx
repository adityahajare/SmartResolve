import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.register(formData);
      if (res.success) {
        setAuth(res.data.user, res.data.token);
        if (['admin', 'agent', 'manager'].includes(res.data.user.role)) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090514] p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 mx-auto flex items-center justify-center font-black text-white text-xl shadow-[0_0_25px_rgba(217,70,239,0.5)] mb-3">
            S
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create SmartResolve Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register user in MongoDB Atlas Cloud DB</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/60 text-rose-300 text-xs rounded-2xl border border-rose-800/80">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-[#1b1233] border border-fuchsia-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition"
                placeholder="Rahul Sharma"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-[#1b1233] border border-fuchsia-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition"
                placeholder="rahul@example.com"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-[#1b1233] border border-fuchsia-950/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Role Access
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2.5 bg-[#1b1233] border border-fuchsia-950/80 rounded-xl text-xs text-white focus:outline-none focus:border-fuchsia-500 transition"
            >
              <option value="customer">Customer (Complaint Dropper Access)</option>
              <option value="admin">Administrator (Intelligent Engine Access)</option>
              <option value="agent">Support Specialist (Priority Queue Agent)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_20px_rgba(217,70,239,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account in Atlas...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-fuchsia-400 hover:underline font-bold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
