import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Settings, 
  LogOut,
  Sliders,
  HelpCircle,
  Cpu,
  Brain
} from 'lucide-react';

export const AdminLayout = () => {
  useSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Priority Queue (OS)', path: '/admin/queue', icon: Layers },
    { label: 'Agent Performance', path: '/admin/performance', icon: Users },
    { label: 'Smart Improver', path: '/admin/improver', icon: Sparkles },
    { label: 'Recommendations', path: '/admin/recommendations', icon: HelpCircle },
    { label: 'Incident Heatmap', path: '/admin/heatmap', icon: Flame },
    { label: 'Frustration Forecast', path: '/admin/forecast', icon: TrendingUp },
    { label: 'System Analytics', path: '/admin/analytics', icon: Sliders },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#090d16] text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Sleek Dark Cybernetic Sidebar */}
      <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo with Glowing Neural Head / AI icon matching screenshot */}
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.5)]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent block">
                SMARTRESOLVE
              </span>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase block">
                AI Priority Engine
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/10 text-teal-300 border border-teal-500/30 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Switcher */}
        <div className="p-4 border-t border-slate-800/60 space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-teal-400 border border-slate-700/60 rounded-xl transition"
          >
            ← Switch to Customer Face
          </Link>

          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold truncate text-slate-200">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role || 'Admin Ops'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-400 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport with Deep Dark Midnight Background */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070b14]">
        {/* Top Header */}
        <header className="h-16 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-mono px-3 py-1 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Neural Scorer Online
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              Host: <strong className="text-slate-200 font-mono">cluster-asia-south1</strong>
            </span>
            <Link
              to="/"
              className="text-xs text-teal-400 hover:underline md:hidden"
            >
              Customer View
            </Link>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
