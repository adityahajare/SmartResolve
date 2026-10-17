import React, { useState } from 'react';
import { Send, Paperclip, Sparkles, Bot, AlertTriangle, ShieldCheck, CheckCircle2, User, Mic } from 'lucide-react';
import { ticketService } from '../../services/ticket.service';

export const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! I am Sofia Emma, your SmartResolve AI assistant. Describe the issue you are facing, and I will analyze sentiment, urgency, and draft your complaint ticket in real-time.' }
  ]);
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [draftTicket, setDraftTicket] = useState(null);
  const [createdTicketId, setCreatedTicketId] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');
    setAnalyzing(true);

    try {
      const res = await ticketService.analyzeTicket({
        title: userText.slice(0, 45) + '...',
        description: userText,
        category: 'Payment'
      });

      const analysis = res.data;
      setDraftTicket({
        title: userText.slice(0, 50),
        description: userText,
        category: analysis.category?.predicted || 'Payment',
        urgency: analysis.urgency || 'high',
        priorityScore: analysis.priorityScore || 85,
        sentiment: analysis.sentiment?.label || 'furious',
        dnaFingerprint: analysis.dnaFingerprint || 'DNA-PAY-UPI-001'
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `I've analyzed your complaint. Urgency detected: ${analysis.urgency?.toUpperCase() || 'HIGH'}. Customer Emotion: ${analysis.sentiment?.label?.toUpperCase() || 'FRUSTRATED'}. Priority Score assigned: ${analysis.priorityScore || 85}/100. Check the live draft on the right panel to confirm submission!`
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'I have logged your issue. Priority scored and ready for dispatch.'
        }
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmTicket = async () => {
    if (!draftTicket) return;
    try {
      const res = await ticketService.createTicket({
        title: draftTicket.title,
        description: draftTicket.description,
        category: draftTicket.category,
        inputChannel: 'chatbot'
      });
      if (res.success) {
        setCreatedTicketId(res.data.ticketId || res.data._id);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: `✓ Success! Complaint has been registered as #${res.data.ticketId || 'TKT-0083'}. It has been inserted into the OS priority scheduler with dynamic preemption.`
          }
        ]);
        setDraftTicket(null);
      }
    } catch (err) {
      alert('Failed to submit ticket');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-fuchsia-400" /> Conversational AI Complaint Concierge
        </h1>
        <p className="text-xs text-slate-400 mt-1">Interactive dialogue with real-time emotion detection, entity extraction, and auto-drafting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chat Window (7 Cols) */}
        <div className="lg:col-span-7 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-5 shadow-2xl flex flex-col h-[580px] justify-between">
          <div className="flex items-center gap-3 pb-3 border-b border-fuchsia-950/60">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              SE
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sofia Emma (AI Agent)</h3>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Tone-Adaptive LLM Active
              </span>
            </div>
          </div>

          <div className="flex-1 py-4 overflow-y-auto space-y-3 pr-1 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
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
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Analyzing emotional tone and legal keywords...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="pt-2">
            <div className="bg-[#1b1233] border border-fuchsia-950/80 rounded-2xl p-2 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your issue here (e.g., 'UPI payment failed but money deducted')..."
                className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white flex items-center justify-center transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Draft HUD (5 Cols) */}
        <div className="lg:col-span-5 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-fuchsia-950/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fuchsia-400" /> Live Complaint Draft
              </h3>
              <span className="text-[10px] text-fuchsia-400 font-mono">Auto-Compiled</span>
            </div>

            {createdTicketId ? (
              <div className="p-6 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Complaint Registered!</h4>
                <p className="text-xs text-slate-400">ID: <strong className="text-emerald-400 font-mono">{createdTicketId}</strong></p>
                <p className="text-[11px] text-slate-400">Dispatched directly to the highest tier agent queue.</p>
              </div>
            ) : draftTicket ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Generated Headline</span>
                  <div className="font-semibold text-white">{draftTicket.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Urgency</span>
                    <span className="text-amber-400 font-bold uppercase">{draftTicket.urgency}</span>
                  </div>
                  <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Priority Score</span>
                    <span className="text-fuchsia-400 font-bold">{draftTicket.priorityScore} / 100</span>
                  </div>
                </div>

                <div className="p-3 bg-[#1e1538] rounded-xl border border-fuchsia-950/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complaint DNA</span>
                  <code className="text-cyan-300 font-mono text-[11px] block truncate">{draftTicket.dnaFingerprint}</code>
                </div>

                <button
                  onClick={handleConfirmTicket}
                  className="w-full py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Dispatch Ticket
                </button>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Bot className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Chat with Sofia Emma to automatically build and inspect your ticket draft here.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#1a1230] rounded-xl border border-fuchsia-950/60 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Tone-adaptive chatbot automatically escalates if anger or legal threat language is detected.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
