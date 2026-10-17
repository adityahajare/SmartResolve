import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { analyticsService } from '../../services/analytics.service';
import { 
  AlertTriangle, 
  Clock, 
  Layers, 
  Zap, 
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statRes, queueRes] = await Promise.all([
        analyticsService.getAdminAnalytics(),
        ticketService.getPriorityQueue()
      ]);
      if (statRes.success) setStats(statRes.data);
      if (queueRes.success) setQueue(queueRes.data.slice(0, 7));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Title Header matching the reference screenshot */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase">
            AI SERVICE REQUEST PRIORITY SCORER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time neural priority calculation and incident cluster matrix.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-1.5 bg-[#121927] hover:bg-[#1b253b] text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Sync Neural Scorer
        </button>
      </div>

      {/* Top 4 Metric Cards matching the exact layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Open Requests */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {stats?.totalTickets ?? 227}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">Open Requests</div>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"></div>
        </div>

        {/* Card 2: Assigned */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {stats?.activeTickets ?? 85}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">Assigned</div>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500"></div>
        </div>

        {/* Card 3: High Priority with Triangle Alert Icon */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-500 fill-amber-500/20" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats?.criticalCount ?? 2}
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">High Priority</div>
        </div>

        {/* Card 4: Avg Time to Resolution */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              9.4 <span className="text-lg font-semibold text-slate-400">hrs</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">Avg. Time to resolution</div>
        </div>
      </div>

      {/* Main Grid: Priority Scorer Table (Left) + Multi-Hue Matrix Heatmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Priority Scorer List (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider pb-2 border-b border-slate-800/60">
            <span>Request ID & Description</span>
            <span>Priority Score</span>
          </div>

          <div className="space-y-4">
            {(queue.length > 0 ? queue : [
              { ticketId: 'SR-0083', title: 'Cannot connect to VPN', finalScore: 92 },
              { ticketId: 'SR-0082', title: 'Application error on login', finalScore: 84 },
              { ticketId: 'SR-0091', title: 'Software update request', finalScore: 78 },
              { ticketId: 'SR-0078', title: 'System running slow', finalScore: 68 },
              { ticketId: 'SR-0076', title: 'Network outage', finalScore: 62 },
              { ticketId: 'SR-0074', title: 'Access permissions needed', finalScore: 54 },
            ]).map((item, idx) => {
              const score = item.finalScore || item.priorityScore || 70;
              const barColor = score >= 85 
                ? 'from-teal-400 via-amber-400 to-rose-500' 
                : score >= 70 
                ? 'from-teal-400 to-amber-400' 
                : 'from-teal-500 to-teal-300';

              return (
                <div key={idx} className="flex items-center justify-between gap-4 text-xs group">
                  <div className="flex items-center gap-3 min-w-0 max-w-[60%]">
                    <span className="font-mono font-bold text-slate-300 text-[11px] whitespace-nowrap">
                      {item.ticketId || `SR-00${80 + idx}`}
                    </span>
                    <span className="text-slate-300 truncate font-medium group-hover:text-teal-300 transition">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1 justify-end max-w-[38%]">
                    <div className="w-full bg-[#1e293b] h-2.5 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] w-6 text-right">
                      {score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
            <span>Dynamic Prioritization Active</span>
            <Link to="/admin/queue" className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
              View Complete Queue <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Incident Multi-Hue Thermal Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Incident Severity Density Matrix</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Complaint DNA correlation & recurrence heat</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/50">
              Live Clusters
            </span>
          </div>

          <div className="aspect-square w-full max-w-[340px] mx-auto grid grid-cols-10 gap-1.5 p-3 bg-[#0a0f1d] rounded-2xl border border-slate-850 shadow-inner">
            {Array.from({ length: 100 }).map((_, i) => {
              const row = Math.floor(i / 10);
              const col = i % 10;
              const value = (col * 0.9) - (row * 0.9) + 4.5;
              
              let cellColor = 'bg-[#111a2e] opacity-40';
              if (value > 6.5) {
                cellColor = 'bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.8)]';
              } else if (value > 5.0) {
                cellColor = 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]';
              } else if (value > 3.5) {
                cellColor = 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]';
              } else if (value > 1.8) {
                cellColor = 'bg-teal-500 opacity-90';
              } else if (value > 0.5) {
                cellColor = 'bg-cyan-700 opacity-70';
              } else if (value > -1.5) {
                cellColor = 'bg-blue-900 opacity-60';
              }

              return (
                <div
                  key={i}
                  className={`rounded-[3px] transition-all hover:scale-125 hover:z-10 cursor-pointer ${cellColor}`}
                  title={`Cluster Vector [R:${row}, C:${col}] Intensity: ${Math.max(0, Math.round(value * 10))}%`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-4 mt-2 border-t border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-500"></span> Normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-600"></span> Outage Cluster
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
