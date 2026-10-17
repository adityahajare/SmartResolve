import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BarChart3, Clock, CheckCircle2, ThumbsUp, ShieldCheck, Zap } from 'lucide-react';

export const CustomerAnalytics = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-fuchsia-400" /> Resolution Transparency Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Transparency on your filed complaints, turnaround SLAs, and AI preemption velocity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl shadow-xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Filed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-white">6</span>
            <span className="text-[10px] text-fuchsia-400 font-mono">100% Tracked</span>
          </div>
        </div>

        <div className="p-6 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl shadow-xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Resolved On SLA</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-400">100%</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
              0 Breaches
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl shadow-xl">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Avg Resolution Speed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-white">2.4h</span>
            <span className="text-[10px] text-fuchsia-400">vs 24h industry avg</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Grievance Ingestion by Channel Breakdown</h3>
        <div className="space-y-3 text-xs">
          {[
            { ch: 'Interactive AI Chatbot', count: '3 Complaints (50%)', bar: 'w-1/2 bg-fuchsia-500' },
            { ch: 'Smart Multi-Step Form', count: '2 Complaints (33%)', bar: 'w-1/3 bg-indigo-500' },
            { ch: 'Voice Evidence (Whisper STT)', count: '1 Complaint (17%)', bar: 'w-1/6 bg-cyan-400' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="font-semibold">{item.ch}</span>
                <span className="text-slate-400 font-mono">{item.count}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1e1538] overflow-hidden">
                <div className={`h-full rounded-full ${item.bar}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
