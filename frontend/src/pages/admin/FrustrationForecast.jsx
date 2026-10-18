import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, ShieldAlert, PhoneCall, Clock, RefreshCw } from 'lucide-react';
import { ticketService } from '../../services/ticket.service';

export const FrustrationForecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecasts = () => {
    setLoading(true);
    ticketService.getFrustrationForecast()
      .then(res => {
        if (res.success && res.data) {
          setForecasts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-rose-500" /> Customer Frustration & Escalation Forecast Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Predicts customer rage probability in the next 4 hours to enable proactive manager outreach before they escalate.
          </p>
        </div>

        <button
          onClick={fetchForecasts}
          disabled={loading}
          className="px-3.5 py-1.5 bg-[#121927] hover:bg-[#1b253b] text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Run Neural Forecast
        </button>
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    <Clock className="w-5 h-5 animate-spin mx-auto mb-2 text-rose-500" />
                    Calculating rage probability vectors across active tickets...
                  </td>
                </tr>
              ) : forecasts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No high-frustration grievances predicted in queue. All active tickets are within healthy sentiment thresholds!
                  </td>
                </tr>
              ) : (
                forecasts.map((f, i) => {
                  const prob = f.frustrationProbability || 0;
                  const customerName = f.ticket?.customer?.name || 'Customer';
                  const tktId = f.ticket?.ticketId || 'Active';
                  return (
                    <tr key={i} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{customerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{tktId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{f.ticket?.category || 'Support'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${
                          prob >= 0.75 
                            ? 'bg-rose-950 text-rose-300 border-rose-800/80' 
                            : prob >= 0.5 
                            ? 'bg-amber-950 text-amber-300 border-amber-800/80' 
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                        }`}>
                          {Math.round(prob * 100)}% Risk
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{f.predictedAction || 'Repeated follow-ups'}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{f.timeWindow || '< 4 hours'}</td>
                      <td className="py-3.5 px-4 font-semibold text-teal-300">{f.recommendedAction || 'Proactive Callback'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
