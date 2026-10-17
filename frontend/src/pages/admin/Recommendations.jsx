import React from 'react';
import { HelpCircle, Check, ArrowRight } from 'lucide-react';

export const Recommendations = () => {
  const suggestions = [
    { title: 'Update UPI Gateway Timeout SLAs', rationale: 'Repeated transaction failures detected in last 24h around 8:00 PM.' },
    { title: 'Preemptively Alert Tier-2 Delivery Agents', rationale: 'High weather-induced delays in Northern transit hub causing sentiment drop.' },
    { title: 'Enable Auto-Reversal for Small Value Claims (< ₹500)', rationale: 'Would instantly resolve 28% of minor refund grievances without human triage.' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" /> AI Policy & Process Recommendations
        </h1>
        <p className="text-xs text-gray-500 mt-1">System-wide optimizations derived from complaint sentiment patterns.</p>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, idx) => (
          <div key={idx} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.rationale}</p>
            </div>
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition whitespace-nowrap">
              Review Policy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
