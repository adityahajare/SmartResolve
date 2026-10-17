import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Flame } from 'lucide-react';

export const IncidentHeatmap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get('/api/incidents/heatmap')
      .then(res => {
        if (res.data?.success) setData(res.data.data);
      })
      .catch(() => {
        setData([
          { category: 'Payment', region: 'North India', clusterCount: 14, severity: 'Critical' },
          { category: 'Delivery', region: 'West Zone', clusterCount: 8, severity: 'High' },
          { category: 'Refund', region: 'South Zone', clusterCount: 5, severity: 'Medium' }
        ]);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <Flame className="w-6 h-6 text-rose-500" /> Incident DNA Cluster Heatmap
        </h1>
        <p className="text-xs text-slate-400 mt-1">Multi-tenant complaint density and cross-department anomaly detection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="p-6 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{item.region || 'Regional Cluster'}</span>
            <h3 className="text-base font-bold text-white">{item.category} Outage Pattern</h3>
            <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-800">
              <span className="text-slate-400 font-mono">{item.clusterCount} Correlated Complaints</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                item.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {item.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
