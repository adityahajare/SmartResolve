import React from 'react';
import { Award, Zap, CheckCircle2, TrendingUp, Clock, ShieldAlert } from 'lucide-react';

export const AgentPerformance = () => {
  const agents = [
    { name: 'Vikram Malhotra', department: 'Finance / UPI Team', speed: 'Fast Worker', activeQueue: 2, resolvedMonth: 44, slaScore: '98.5%', csat: '4.9 / 5.0', expertise: 'Payment & Fraud' },
    { name: 'Priya Iyer', department: 'Logistics Team', speed: 'Fast Worker', activeQueue: 3, resolvedMonth: 38, slaScore: '96.2%', csat: '4.8 / 5.0', expertise: 'Delivery' },
    { name: 'Rohan Deshmukh', department: 'Technical Support', speed: 'Standard', activeQueue: 4, resolvedMonth: 29, slaScore: '91.0%', csat: '4.4 / 5.0', expertise: 'App Bugs' },
    { name: 'Ananya Sen', department: 'Compliance / Legal', speed: 'Thorough / Slow', activeQueue: 2, resolvedMonth: 18, slaScore: '95.0%', csat: '4.7 / 5.0', expertise: 'Disputes' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <Award className="w-6 h-6 text-teal-400" /> Resolution Specialist Performance & Skill Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Categorizes fast vs slow workers per complaint category to optimize intelligent ticket routing.
        </p>
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
              {agents.map((ag, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
