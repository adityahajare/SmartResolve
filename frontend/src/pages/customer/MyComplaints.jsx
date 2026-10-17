import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SentimentEmoji } from '../../components/ui/SentimentEmoji';
import { SLACountdown } from '../../components/ui/SLACountdown';
import { 
  Filter, 
  Search, 
  Plus, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const MyComplaints = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getTickets()
      .then(res => {
        if (res.success && res.data.length > 0) {
          setTickets(res.data);
        } else {
          setTickets([
            { _id: '1', ticketId: 'SR-0083', title: 'Cannot connect to payment gateway during UPI checkout', category: 'Payment', status: 'in_progress', priority: 'critical', finalScore: 92 },
            { _id: '2', ticketId: 'SR-0082', title: 'Application authentication error on OTP login', category: 'Technical', status: 'pending', priority: 'high', finalScore: 84 },
            { _id: '3', ticketId: 'SR-0078', title: 'UPI double debit refund turnaround SLA breached', category: 'Refund', status: 'resolved', priority: 'medium', finalScore: 78 },
            { _id: '4', ticketId: 'SR-0076', title: 'Delayed shipment tracking not updating', category: 'Delivery', status: 'in_progress', priority: 'medium', finalScore: 62 },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTickets = tickets.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['resolved', 'closed'].includes(t.status);
    if (filter === 'resolved') return ['resolved', 'closed'].includes(t.status);
    return t.status === filter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">My Request Feed</h1>
          <p className="text-xs text-slate-400 mt-1">Live tracking of your filed grievances with dynamic priority status & SLA countdowns.</p>
        </div>

        <Link
          to="/raise"
          className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> New Complaint
        </Link>
      </div>

      {/* Filter Tabs matching purple theme */}
      <div className="flex justify-between items-center bg-[#140e24]/90 border border-fuchsia-950/70 p-3 rounded-2xl shadow-xl text-xs">
        <div className="flex gap-2">
          {['all', 'active', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                filter === f
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1f1538]'
              }`}
            >
              {f} Requests
            </button>
          ))}
        </div>
        <span className="text-slate-500 font-mono text-[11px]">Total: {filteredTickets.length}</span>
      </div>

      {/* Ticket List Cards */}
      <div className="grid gap-3">
        {filteredTickets.map((t) => (
          <Link
            key={t._id}
            to={`/complaints/${t._id}`}
            className="p-5 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 hover:border-fuchsia-500/60 rounded-3xl shadow-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-fuchsia-400">
                  {t.ticketId || t._id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 capitalize">
                  {t.category}
                </span>
                <StatusBadge status={t.status} />
              </div>
              <h3 className="font-bold text-slate-100 text-sm group-hover:text-fuchsia-300 transition truncate">
                {t.title}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">Score:</span>
                <span className="font-mono font-bold text-fuchsia-400 text-xs">
                  {t.finalScore || 75}
                </span>
              </div>
              <SLACountdown deadline={t.slaDeadline} breached={t.slaBreached} />
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-fuchsia-400 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
