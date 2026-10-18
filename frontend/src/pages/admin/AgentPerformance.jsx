import React, { useEffect, useState } from 'react';
import { Award, Zap, CheckCircle2, TrendingUp, Clock, ShieldAlert, RefreshCw } from 'lucide-react';
import { analyticsService } from '../../services/analytics.service';

export const AgentPerformance = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = () => {
    setLoading(true);
    analyticsService.getAgentLeaderboard()
      .then(res => {
        if (res.success && res.data) {
          const formatted = res.data.map(item => ({
            name: item.agent?.name || 'Agent Specialist',
            department: item.agent?.agentProfile?.expertiseCategories?.join(', ') || 'Customer Support',
            speed: item.stats?.avgResolutionMins < 60 ? 'Fast Worker' : 'Standard Worker',
            activeQueue: item.stats?.totalAssigned || 0,
            resolvedMonth: item.stats?.resolved || 0,
            slaScore: `${item.stats?.slaCompliance || 100}%`,
            csat: `${(4.0 + (item.stats?.performanceScore || 50) / 100).toFixed(1)} / 5.0`,
            expertise: item.agent?.agentProfile?.expertiseCategories?.slice(0, 2).join(' & ') || 'General'
          }));
          setAgents(formatted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
            <Award className="w-6 h-6 text-teal-400" /> Resolution Specialist Performance & Skill Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Categorizes fast vs slow workers per complaint category to optimize intelligent ticket routing.
          </p>
        </div>

        <button
          onClick={fetchAgents}
          disabled={loading}
          className="px-3.5 py-1.5 bg-[#121927] hover:bg-[#1b253b] text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Agents
        </button>
      </div>

      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Specialized Department</th>
                <th className="py-3.5 px-4">Work Speed Profile</th>
                <th className="py-3.5 px-4">Active Queue</th>
                <th className="py-3.5 px-4">Resolved (30d)</th>
                <th className="py-3.5 px-4">SLA Compliance</th>
                <th className="py-3.5 px-4">CSAT Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    <Clock className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-400" />
                    Calculating agent skill matrix...
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No active agents registered in this tenant company yet.
                  </td>
                </tr>
              ) : (
                agents.map((ag, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{ag.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{ag.department}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ag.speed.includes('Fast') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {ag.speed}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{ag.activeQueue}</td>
                    <td className="py-3.5 px-4 font-mono">{ag.resolvedMonth}</td>
                    <td className="py-3.5 px-4 text-teal-400 font-bold font-mono">{ag.slaScore}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400 font-mono">{ag.csat}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
