import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Flame, ShieldAlert, RefreshCw, ArrowRight } from 'lucide-react';
import API from '../../services/api';

export const Incidents = () => {
  const [incidents, setIncidents] = useState([
    {
      _id: 'INC-901',
      title: 'Major UPI Bank Switch Gateway Timeout (HDFC & SBI)',
      description: 'Multiple users reporting debited balances without merchant confirmation. AI detected matching DNA pattern across 18 complaints.',
      affectedCategory: 'Payment',
      severity: 'critical',
      status: 'confirmed',
      affectedCount: 28,
      detectedBy: 'AI Cluster Matrix',
      estimatedResolution: 'Under 45 mins'
    },
    {
      _id: 'INC-889',
      title: 'North Zone Transit Delivery Delay (Dense Weather Delay)',
      description: 'Shipment tracking updates stalled at Delhi Central Sort Hub. DNA pattern correlated with 12 order tracking inquiries.',
      affectedCategory: 'Delivery',
      severity: 'high',
      status: 'fixing',
      affectedCount: 14,
      detectedBy: 'AI Cluster Matrix',
      estimatedResolution: '2-4 hours'
    }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" /> Live Outage Incidents & DNA Clusters
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            When multiple similar complaints share DNA fingerprints, SmartResolve clusters them into active incidents to prevent duplicate triage.
          </p>
        </div>

        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/60 text-rose-300">
          ● 2 Active Outages
        </span>
      </div>

      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc._id}
            className="p-6 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 hover:border-rose-900/60 rounded-3xl shadow-2xl space-y-4 transition"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-rose-950 text-rose-300 border border-rose-800/80">
                  {inc.severity} Outage
                </span>
                <span className="text-xs font-mono font-bold text-fuchsia-400">{inc._id}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Detected via: <strong className="text-slate-200">{inc.detectedBy}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{inc.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{inc.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-fuchsia-950/60 flex-wrap gap-3">
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>Correlated Victims: <strong className="text-white">{inc.affectedCount}</strong></span>
                <span>Category: <strong className="text-fuchsia-400">{inc.affectedCategory}</strong></span>
                <span>ETA: <strong className="text-teal-300">{inc.estimatedResolution}</strong></span>
              </div>

              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                Status: <strong className="uppercase">{inc.status}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
