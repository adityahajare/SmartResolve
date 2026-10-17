import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { notificationService } from '../../services/notification.service';
import { Bell, Check, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Notifications = () => {
  const { notifications, setNotifications, markAllRead } = useNotificationStore();

  const mockNotifs = [
    { _id: 'n1', title: 'Priority Shadow Boost Applied', message: 'Ticket #TKT-0083 aging exceeded 12 hours. +10 shadow boost points added to ensure zero queue starvation.', isRead: false, type: 'shadow_boost', time: '10m ago' },
    { _id: 'n2', title: 'Level 1 Preemption Triggered', message: 'Fraud risk detected on ticket #TKT-0075. Ticket moved to front of the agent dispatch queue.', isRead: false, type: 'preemption', time: '42m ago' },
    { _id: 'n3', title: 'Resolution Agent Assigned', message: 'Senior agent Vikram Malhotra assigned to investigate your UPI payment reversal claim.', isRead: true, type: 'assignment', time: '2h ago' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-fuchsia-400" /> Notifications & Scheduler Triggers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time alerts on ticket queue aging boosts, preemption updates, and incident links.</p>
        </div>
        <button
          onClick={() => alert('All marked as read')}
          className="text-xs text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 font-bold"
        >
          <Check className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {mockNotifs.map((n) => (
          <div
            key={n._id}
            className={`p-5 bg-[#140e24]/90 backdrop-blur-xl border ${
              n.isRead ? 'border-fuchsia-950/40 opacity-70' : 'border-fuchsia-950/90 shadow-xl'
            } rounded-3xl flex gap-4 items-start transition`}
          >
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-fuchsia-600/20 to-indigo-600/20 text-fuchsia-400 border border-fuchsia-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">{n.title}</h4>
                <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
