import React, { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticket.service';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SentimentEmoji } from '../../components/ui/SentimentEmoji';
import { SLACountdown } from '../../components/ui/SLACountdown';
import { 
  Zap, 
  RefreshCw, 
  Filter, 
  Cpu, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const TicketQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('all');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await ticketService.getPriorityQueue();
      if (res.success) {
        setQueue(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filteredQueue = queue.filter(t => {
    if (filterLevel === 'all') return true;
    return String(t.queueLevel || 3) === filterLevel;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase">
            ACTIVE PRIORITY DISPATCH QUEUE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Intelligent preemption pipeline • Anti-starvation aging boost • Real-time emotion triage
          </p>
        </div>

        <button
          onClick={fetchQueue}
          disabled={loading}
          className="px-3.5 py-1.5 bg-[#121927] hover:bg-[#1b253b] text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Re-evaluate Priorities
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center bg-[#0f172a]/90 border border-slate-800/80 p-3 rounded-2xl shadow-lg text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold uppercase text-[11px]">Level Filter:</span>
          {['all', '1', '2', '3', '4'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded-xl font-medium transition ${
                filterLevel === lvl 
                  ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {lvl === 'all' ? 'All Requests' : `Tier L${lvl}`}
            </button>
          ))}
        </div>
        <span className="text-slate-500 font-mono text-[11px]">Count: {filteredQueue.length}</span>
      </div>

      {/* Priority Table in Dark Tech Mode */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Request ID & Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Emotion</th>
                <th className="py-3.5 px-4">Base</th>
                <th className="py-3.5 px-4">Aging Shadow</th>
                <th className="py-3.5 px-4">Priority Meter</th>
                <th className="py-3.5 px-4">SLA Deadline</th>
                <th className="py-3.5 px-4 text-right">Preempt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 text-slate-300">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No tickets waiting in this queue level.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((t) => {
                  const score = t.finalScore || (t.priorityScore || 0) + (t.shadowScore || 0);
                  const barColor = score >= 85 
                    ? 'from-teal-400 via-amber-400 to-rose-500' 
                    : score >= 70 
                    ? 'from-teal-400 to-amber-400' 
                    : 'from-teal-500 to-teal-300';

                  return (
                    <tr key={t._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-[11px] ${
                          t.queueLevel === 1 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          t.queueLevel === 2 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          L{t.queueLevel || 3}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate">{t.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.ticketId || t._id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{t.category}</td>
                      <td className="py-3.5 px-4">
                        <SentimentEmoji sentiment={t.aiAnalysis?.sentiment?.label} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{t.priorityScore || 0}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-400">+{t.shadowScore || 0}</td>
                      
                      {/* Priority Score Meter Bar */}
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#1e293b] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                              style={{ width: `${Math.min(score, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-slate-200 text-[11px]">{score}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <SLACountdown deadline={t.slaDeadline} breached={t.slaBreached} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`Preempting ${t.ticketId || t._id} into priority lane`)}
                          className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <Zap className="w-3 h-3" /> Preempt
                        </button>
                      </td>
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
