import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { BarChart3, PieChart, ShieldAlert } from 'lucide-react';

export const AdminAnalytics = () => {
  const [catData, setCatData] = useState([]);
  const [slaData, setSlaData] = useState(null);

  useEffect(() => {
    analyticsService.getCategoryAnalytics()
      .then(res => { if (res.success) setCatData(res.data); })
      .catch(console.error);

    analyticsService.getSLACompliance()
      .then(res => { if (res.success) setSlaData(res.data); })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-teal-400" /> Platform Operations Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Cross-channel complaint velocity and SLA resolution dynamics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Complaint Distribution By Category</h3>
          <div className="space-y-3">
            {[
              { cat: 'Payment & UPI', pct: 42, color: 'bg-teal-400' },
              { cat: 'Delivery & Shipping', pct: 28, color: 'bg-amber-400' },
              { cat: 'Refunds & Returns', pct: 18, color: 'bg-indigo-400' },
              { cat: 'Fraud & Security', pct: 12, color: 'bg-rose-500' }
            ].map((c, i) => (
              <div key={i} className="text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">{c.cat}</span>
                  <span className="text-slate-400 font-mono">{c.pct}%</span>
                </div>
                <div className="w-full bg-[#1e293b] rounded-full h-2 overflow-hidden">
                  <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">SLA Resolution Health</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800">
              <span className="text-slate-400">Within Critical SLA (&lt; 2h)</span>
              <span className="font-semibold text-teal-400 font-mono">92.4%</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800">
              <span className="text-slate-400">High Priority SLA (&lt; 4h)</span>
              <span className="font-semibold text-teal-400 font-mono">96.1%</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800">
              <span className="text-slate-400">Total Preemptions Triggered</span>
              <span className="font-semibold text-indigo-400 font-mono">38 this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
