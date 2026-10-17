import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { 
  Home, 
  PlusCircle, 
  ListFilter, 
  Bell, 
  BarChart2, 
  User, 
  LogOut, 
  AlertTriangle,
  MessageSquare,
  Mic,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';

export const CustomerLayout = () => {
  useSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Portal', path: '/', icon: Home },
    { label: 'Raise Complaint', path: '/raise', icon: PlusCircle },
    { label: 'Interactive AI Chat', path: '/chat', icon: MessageSquare },
    { label: 'Voice Evidence', path: '/voice', icon: Mic },
    { label: 'My Requests', path: '/complaints', icon: ListFilter },
    { label: 'Outages & Incidents', path: '/incidents', icon: AlertTriangle },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen flex bg-[#0c0817] text-slate-100 font-sans selection:bg-fuchsia-600 selection:text-white">
      {/* Sleek Dark Purple Floating Sidebar */}
      <aside className="w-64 bg-[#100a1f] border-r border-fuchsia-950/60 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo with Purple Glow Badge */}
          <div className="p-5 border-b border-fuchsia-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                B
              </div>
              <div>
                <span className="text-sm font-black tracking-wide text-white block">
                  Request Portal
                </span>
                <span className="text-[10px] text-fuchsia-400 font-semibold tracking-wider uppercase block">
                  Support Client
                </span>
              </div>
            </div>
          </div>

          {/* Switch to Operations Console Pill */}
          <div className="p-3 mx-3 mt-3 bg-gradient-to-r from-[#170e2c] to-[#20143d] border border-fuchsia-950/80 rounded-2xl flex items-center justify-between text-xs shadow-md">
            <div>
              <div className="font-bold text-[11px] text-fuchsia-300">Operations Console</div>
              <div className="text-[10px] text-slate-400">AI Priority Scorer</div>
            </div>
            <Link
              to="/admin"
              className="px-2.5 py-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 rounded-lg text-[10px] font-bold text-white transition shadow-sm"
            >
              Switch →
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-600/30 to-purple-600/10 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.2)]'
                      : 'text-slate-400 hover:bg-[#18102e] hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-fuchsia-400' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-fuchsia-950/60">
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Customer'}</p>
              <p className="text-[10px] text-fuchsia-400 capitalize">{user?.role || 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0817]">
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
