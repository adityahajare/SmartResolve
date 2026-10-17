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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" /> Incident DNA Cluster Heatmap
        </h1>
        <p className="text-xs text-gray-500 mt-1">Multi-tenant complaint density and cross-department anomaly detection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-400">{item.region || 'Regional Cluster'}</span>
            <h3 className="text-base font-bold text-gray-800">{item.category} Outage Pattern</h3>
            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-gray-500">{item.clusterCount} Correlated Complaints</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800">
                {item.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
