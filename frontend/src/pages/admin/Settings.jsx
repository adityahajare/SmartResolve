import React, { useState } from 'react';
import { Sliders, Save, Cpu, ShieldAlert, Zap, Clock } from 'lucide-react';

export const Settings = () => {
  const [agingInterval, setAgingInterval] = useState(15);
  const [agingBoost, setAgingBoost] = useState(5);
  const [criticalSLA, setCriticalSLA] = useState(2);
  const [preemptionThreshold, setPreemptionThreshold] = useState(85);

  const handleSave = (e) => {
    e.preventDefault();
    alert('OS Priority Scheduler Engine Parameters Updated!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <Sliders className="w-6 h-6 text-teal-400" /> OS Priority Scheduler & Engine Parameters
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tune the dynamic priority scheduler weights, shadow queue aging frequency, and preemption thresholds.
        </p>
      </div>

      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Aging Boost Frequency (Minutes)
              </label>
              <input
                type="number"
                value={agingInterval}
                onChange={(e) => setAgingInterval(Number(e.target.value))}
                className="w-full p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">How often the cron job sweeps the active queue to add shadow points.</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Shadow Score Step (+Points per interval)
              </label>
              <input
                type="number"
                value={agingBoost}
                onChange={(e) => setAgingBoost(Number(e.target.value))}
                className="w-full p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Anti-starvation points added each cycle (e.g. +5 pts / 15m).</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Level 1 Preemption Threshold (Score 0-100)
              </label>
              <input
                type="number"
                value={preemptionThreshold}
                onChange={(e) => setPreemptionThreshold(Number(e.target.value))}
                className="w-full p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Tickets with finalScore ≥ 85 preempt active agent queues immediately.</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Level 1 (Critical) SLA Deadline (Hours)
              </label>
              <input
                type="number"
                value={criticalSLA}
                onChange={(e) => setCriticalSLA(Number(e.target.value))}
                className="w-full p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-teal-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Standard SLA is 2 hours for fraud and outage claims.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Engine Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
