import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { BarChart3, PieChart, ShieldAlert } from 'lucide-react';

export const AdminAnalytics = () => {
  const [catData, setCatData] = useState([]);
  const [slaData, setSlaData] = useState(null);

  useEffect(() => {
    analyticsService.getCategoryAnalytics()
      .then(res => { if (res.success) setCatData(res.data); })
      .catch(console.error);

    analyticsService.getSLACompliance()
      .then(res => { if (res.success) setSlaData(res.data); })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" /> Platform Operations Analytics
        </h1>
        <p className="text-xs text-gray-500 mt-1">Cross-channel complaint velocity and SLA resolution dynamics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Complaint Distribution By Category</h3>
          <div className="space-y-3">
            {[
              { cat: 'Payment & UPI', pct: 42, color: 'bg-blue-600' },
              { cat: 'Delivery & Shipping', pct: 28, color: 'bg-amber-500' },
              { cat: 'Refunds & Returns', pct: 18, color: 'bg-emerald-500' },
              { cat: 'Fraud & Security', pct: 12, color: 'bg-red-500' }
            ].map((c, i) => (
              <div key={i} className="text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700">{c.cat}</span>
                  <span className="text-gray-500">{c.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">SLA Resolution Health</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-600">Within Critical SLA (&lt; 2h)</span>
              <span className="font-semibold text-emerald-600">92.4%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-600">High Priority SLA (&lt; 4h)</span>
              <span className="font-semibold text-emerald-600">96.1%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-600">Total Preemptions Triggered</span>
              <span className="font-semibold text-blue-600">38 this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
