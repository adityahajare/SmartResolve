import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { 
  Plus, 
  Send, 
  Paperclip, 
  Sparkles, 
  Search, 
  Bell, 
  Layers, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Bot,
  Zap,
  MoreVertical
} from 'lucide-react';

export const CustomerHome = () => {
  // Chat intake conversation state
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: 'Hi Sofia!' },
    { id: 2, sender: 'user', text: 'Kindly arrange a ticket regarding UPI transfer failure.' },
    { id: 3, sender: 'ai', text: 'Hi Rahul! On it! Creating your complaint ticket now.' },
    { id: 4, sender: 'ai', text: '✓ Your complaint #TKT-0083 is ready! Priority assigned: Level 1 (Critical).' }
  ]);
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    ticketService.getTickets()
      .then(res => {
        if (res.success && res.data.length > 0) {
          setRecentTickets(res.data.slice(0, 7));
        } else {
          setRecentTickets([
            { id: 'TKT-0083', title: 'Website Loading Issue', category: 'Technical', status: 'In Progress', dot: 'bg-rose-500' },
            { id: 'TKT-0082', title: 'Feature Request: Bulk Export', category: 'Feature', status: 'Pending', dot: 'bg-teal-400' },
            { id: 'TKT-0078', title: 'Account locked after OTP attempts', category: 'Account', status: 'Resolved', dot: 'bg-indigo-400' },
            { id: 'TKT-0075', title: 'Payment debited via UPI, order failed', category: 'Payment', status: 'Critical', dot: 'bg-amber-400' },
            { id: 'TKT-0071', title: 'Invoice GST breakdown error', category: 'Billing', status: 'Resolved', dot: 'bg-teal-400' },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInputText('');
    setAnalyzing(true);

    try {
      const res = await ticketService.analyzeTicket({
        title: userMsg.slice(0, 40),
        description: userMsg,
        category: 'Payment'
      });

      const analysis = res.data;
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Analyzed with AI. Emotion detected: ${analysis.sentiment.label.toUpperCase()}. Priority Score: ${analysis.priorityScore}/100. Dispatched to priority queue.`
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Grievance registered. Ticket created with automated SLA preemption.`
        }
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-slate-100">
      {/* Top Banner / Portal Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(192,38,211,0.4)]">
            S
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white">
              Request Portal
            </h1>
            <span className="text-[11px] text-fuchsia-400 font-semibold tracking-wider uppercase">
              Omnichannel AI Complaint Dropper
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search complaints..."
              className="bg-[#18112b] border border-fuchsia-950/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-600 transition"
            />
          </div>

          <Link
            to="/raise"
            className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(192,38,211,0.3)] transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Report
          </Link>
        </div>
      </div>

      {/* Main Container Layout: Left Chat Messenger (35%) + Center/Right Analytics & Activity (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT: Sofia Emma AI Conversational Grievance Chatbot (4 Cols) ─── */}
        <div className="lg:col-span-4 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-5 shadow-2xl flex flex-col h-[650px] justify-between">
          {/* Agent Header */}
          <div className="flex items-center justify-between pb-4 border-b border-fuchsia-950/60">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-fuchsia-500 to-indigo-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#18112b] flex items-center justify-center font-bold text-xs text-white">
                    SE
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#140e24]"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sofia Emma</h3>
                <p className="text-[10px] text-fuchsia-400 font-medium">AI Complaint Dropper Concierge</p>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 py-4 overflow-y-auto space-y-3 pr-1 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-[#1e1538] text-slate-200 border border-fuchsia-950/80 rounded-tl-sm'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            {analyzing && (
              <div className="flex items-center gap-2 text-[11px] text-fuchsia-400 italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Sofia is classifying urgency & priority score...
              </div>
            )}
          </div>

          {/* Chat Input Dock matching screenshot */}
          <form onSubmit={handleSendMessage} className="pt-2">
            <div className="bg-[#1b1233] border border-fuchsia-950/80 rounded-2xl p-2 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Do you need more assistance?"
                className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2"
              />
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-fuchsia-400 transition"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 text-white flex items-center justify-center transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* ─── RIGHT: Request Analytics & Recent Feed (8 Cols) ─── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Top 3 KPI Pill Cards matching screenshot (Active Requests, Resolved, Avg Response) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-4 shadow-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Active Requests</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-white">29</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  +12.5%
                </span>
              </div>
            </div>

            <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-4 shadow-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Resolved</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-white">17.5k</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  +98.2%
                </span>
              </div>
            </div>

            <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-4 shadow-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Avg. Response</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-white">2.4h</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/50">
                  -0.8 hrs
                </span>
              </div>
            </div>
          </div>

          {/* Middle Row: Request Types (Radial Rings) + Status Distribution (Semi-Gauge) + AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Circular Multi-Ring Gauge: Request Types (5 Cols) */}
            <div className="md:col-span-5 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                <span>Request Types</span>
                <span className="text-[10px] text-fuchsia-400 font-mono">By Channel</span>
              </div>

              {/* Concentric Neon Rings */}
              <div className="relative w-36 h-36 mx-auto my-3 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-fuchsia-950 border-t-fuchsia-500 border-r-indigo-500 rotate-45 shadow-[0_0_15px_rgba(217,70,239,0.3)]"></div>
                {/* Middle Ring */}
                <div className="absolute inset-3 rounded-full border-4 border-cyan-950 border-t-cyan-400 border-l-teal-400 -rotate-12 shadow-[0_0_10px_rgba(45,212,191,0.3)]"></div>
                {/* Inner Ring */}
                <div className="absolute inset-6 rounded-full border-4 border-purple-950 border-b-purple-400 rotate-90"></div>
                <div className="text-center">
                  <span className="text-xl font-black text-white block">65%</span>
                  <span className="text-[9px] text-slate-400">Resolved</span>
                </div>
              </div>

              {/* Ring Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 pt-2 border-t border-fuchsia-950/60">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> 54% Form / Chat</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> 28% Voice OCR</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 18% Payment</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span> 20% Logist.</span>
              </div>
            </div>

            {/* Semi-Circle Speedometer: Status Distribution (4 Cols) */}
            <div className="md:col-span-4 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                <span>Status Distribution</span>
                <span className="text-[10px] text-emerald-400 font-mono">SLA 98%</span>
              </div>

              {/* Half-Arc Gauge */}
              <div className="relative w-36 h-20 mx-auto mt-4 overflow-hidden flex items-end justify-center">
                <div className="w-36 h-36 rounded-full border-8 border-slate-800 border-t-emerald-400 border-r-teal-400 rotate-[45deg] shadow-[0_0_15px_rgba(52,211,153,0.4)]"></div>
                <div className="absolute bottom-0 text-center">
                  <span className="text-2xl font-black text-white">32%</span>
                  <span className="text-[9px] text-slate-400 block">Pending</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-fuchsia-950/60 mt-3">
                <span className="text-emerald-400">● 64% Resolved</span>
                <span className="text-amber-400">● 32% Active</span>
              </div>
            </div>

            {/* AI Insights & Alerts Widget (3 Cols) */}
            <div className="md:col-span-3 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> AI Insights
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-[#1b1233] rounded-xl border border-fuchsia-950/80">
                  <span className="font-bold text-fuchsia-300 block">Spike in UPI claims</span>
                  <span className="text-slate-400 text-[10px]">Gateway timeout observed at 8:00 PM</span>
                </div>
                <div className="p-2 bg-[#1b1233] rounded-xl border border-fuchsia-950/80">
                  <span className="font-bold text-emerald-300 block">Fastest Turnaround</span>
                  <span className="text-slate-400 text-[10px]">Refund claims resolved under 1.2 hrs</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Spline Request Wave Chart (7 Cols) + Recent Request Feed (5 Cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Continuous Wave / Area Chart: Request Trend (7 Cols) */}
            <div className="md:col-span-7 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h3 className="font-bold text-slate-200">Request Velocity Trend</h3>
                  <p className="text-[10px] text-slate-400">Real-time complaint ingestion velocity</p>
                </div>
                <span className="text-[10px] text-fuchsia-400 font-mono bg-fuchsia-950/50 px-2 py-0.5 rounded-lg border border-fuchsia-800/40">
                  7 Days View
                </span>
              </div>

              {/* Glowing SVG Spline Graph replicating screenshot */}
              <div className="h-32 w-full pt-2">
                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d946ef" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#6366f1" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#140e24" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  <path
                    d="M 0,80 Q 40,95 80,70 T 160,85 T 240,40 T 320,60 T 400,30 L 400,120 L 0,120 Z"
                    fill="url(#waveGradient)"
                  />
                  {/* Neon Spline Line */}
                  <path
                    d="M 0,80 Q 40,95 80,70 T 160,85 T 240,40 T 320,60 T 400,30"
                    fill="none"
                    stroke="#d946ef"
                    strokeWidth="2.5"
                    className="drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
                  />
                  {/* Highlight Pin matching screenshot (e.g. 42 requests at Tue) */}
                  <circle cx="240" cy="40" r="4.5" fill="#ffffff" stroke="#d946ef" strokeWidth="2.5" />
                  <line x1="240" y1="40" x2="240" y2="120" stroke="#d946ef" strokeDasharray="3,3" opacity="0.6" />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Recent Request Feed matching screenshot list (5 Cols) */}
            <div className="md:col-span-5 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs">
                <h3 className="font-bold text-slate-200">Recent Requests</h3>
                <Link to="/complaints" className="text-[10px] text-fuchsia-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-2 text-xs overflow-y-auto max-h-36 pr-1">
                {recentTickets.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[#1b1233]/70 hover:bg-[#20163c] rounded-xl border border-fuchsia-950/60 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot || 'bg-fuchsia-400'}`}></span>
                      <div className="truncate">
                        <span className="font-semibold text-slate-200 text-[11px] block truncate">{t.title}</span>
                        <span className="text-[9px] text-slate-400">{t.category}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-fuchsia-300 ml-2 whitespace-nowrap">
                      {t.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/raise"
                className="w-full py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold text-center block transition shadow-sm"
              >
                + Raise New Complaint
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
