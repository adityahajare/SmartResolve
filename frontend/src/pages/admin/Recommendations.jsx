import React from 'react';
import { HelpCircle, Check, ArrowRight } from 'lucide-react';

export const Recommendations = () => {
  const suggestions = [
    { title: 'Update UPI Gateway Timeout SLAs', rationale: 'Repeated transaction failures detected in last 24h around 8:00 PM.' },
    { title: 'Preemptively Alert Tier-2 Delivery Agents', rationale: 'High weather-induced delays in Northern transit hub causing sentiment drop.' },
    { title: 'Enable Auto-Reversal for Small Value Claims (< ₹500)', rationale: 'Would instantly resolve 28% of minor refund grievances without human triage.' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-teal-400" /> AI Policy & Process Recommendations
        </h1>
        <p className="text-xs text-slate-400 mt-1">System-wide optimizations derived from complaint sentiment patterns.</p>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, idx) => (
          <div key={idx} className="p-6 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl flex justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{s.rationale}</p>
            </div>
            <button className="px-3.5 py-2 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold hover:bg-teal-500/20 transition whitespace-nowrap">
              Review Policy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
