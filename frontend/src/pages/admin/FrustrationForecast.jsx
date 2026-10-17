import React from 'react';
import { TrendingUp, AlertTriangle, ShieldAlert, PhoneCall, Clock } from 'lucide-react';

export const FrustrationForecast = () => {
  const forecasts = [
    { ticketId: 'TKT-20261017-0042', customer: 'Amit Verma', category: 'Payment', frustrationProbability: 0.89, riskLevel: 'Critical Rage Risk', trigger: 'Failed UPI + Repeated Message', intervention: 'Direct Senior Callback within 30 min', timeWindow: '< 45 mins' },
    { ticketId: 'TKT-20261017-0038', customer: 'Deepak Sharma', category: 'Delivery', frustrationProbability: 0.74, riskLevel: 'High Frustration', trigger: 'Delayed transit hub 48h', intervention: 'Send live GPS tracking SMS', timeWindow: '< 2 hours' },
    { ticketId: 'TKT-20261017-0031', customer: 'Sneha Patel', category: 'Refund', frustrationProbability: 0.62, riskLevel: 'Moderate', trigger: 'Double debit inquiry', intervention: 'Share automated ledger proof', timeWindow: '< 4 hours' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-rose-500" /> Customer Frustration Forecast Engine (Feature 16)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Predicts customer rage probability in the next 4 hours to enable proactive manager outreach before they escalate.
        </p>
      </div>

      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ticket & Customer</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Rage Probability</th>
                <th className="py-3.5 px-4">Predicted Behavioral Trigger</th>
                <th className="py-3.5 px-4">Proactive Window</th>
                <th className="py-3.5 px-4">Recommended Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 text-slate-300">
              {forecasts.map((f, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{f.customer}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{f.ticketId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{f.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-950 text-rose-300 border border-rose-800/80">
                      {Math.round(f.frustrationProbability * 100)}% Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{f.trigger}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{f.timeWindow}</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-300">{f.intervention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
