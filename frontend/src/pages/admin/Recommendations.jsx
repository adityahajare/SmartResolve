import React, { useEffect, useState } from 'react';
import { HelpCircle, Database, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import { analyticsService } from '../../services/analytics.service';

export const Recommendations = () => {
  const [activeTab, setActiveTab] = useState('dataset');
  const [dataset, setDataset] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getMLDataset()
      .then(res => {
        if (res.success && res.data?.dataset) {
          setDataset(res.data.dataset);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...new Set(dataset.map(d => d.category))];

  const filteredDataset = selectedCategory === 'ALL'
    ? dataset
    : dataset.filter(d => d.category === selectedCategory);

  const policyRecommendations = [
    {
      title: 'Automate Double-Debit Auto-Reversal (< ₹1,500)',
      rationale: 'ML Dataset analysis shows 40% of UPI failures resolve via automated gateway settlement without manual agent intervention.',
      impact: 'Reduces payment queue backlog by 28%'
    },
    {
      title: 'Pre-Escalate Delivery Tickets When Transit Delay > 36 Hours',
      rationale: 'Sentiment scores drop to -0.90 (Rage) once courier is untracked for more than 48 hours.',
      impact: 'Prevents consumer forum escalations'
    },
    {
      title: 'Instant OTP Resend Mechanism on Authentication Latency',
      rationale: 'Cluster analysis links OTP timeouts to network throttling during peak evening hours.',
      impact: 'Reduces repeat technical tickets by 35%'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-400" /> AI Knowledge & ML Complaint Corpus Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore the production ML training dataset powering SmartResolve's neural categorization, emotion scoring, and triage policies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dataset')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'dataset'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" /> ML Training Dataset ({dataset.length} Curated Cases)
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'policies'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> System Policy Recommendations
        </button>
      </div>

      {activeTab === 'dataset' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> Filter by Domain:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-teal-400/20 text-teal-300 border border-teal-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dataset Cards */}
          <div className="grid gap-3">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading ML training corpus...</div>
            ) : (
              filteredDataset.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-lg space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-teal-400">{item.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {item.category} • {item.subcategory}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.urgency === 'immediate' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        item.urgency === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        Urgency: {item.urgency}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">Sentiment: <span className="text-amber-400 font-bold">{item.sentiment_score}</span></span>
                      <span className="text-slate-400">Base Priority: <span className="text-teal-300 font-bold">{item.suggested_priority}/100</span></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 italic bg-[#0a0f1d] p-3 rounded-xl border border-slate-850">
                    "{item.text}"
                  </p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px]">
                    <div className="text-slate-400">
                      <span className="text-teal-400 font-semibold">Trained Resolution:</span> {item.suggested_resolution}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                      SLA Standard: {item.sla_target_hours}h
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="space-y-4">
          {policyRecommendations.map((s, idx) => (
            <div key={idx} className="p-6 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-400">{s.rationale}</p>
                <div className="text-[11px] text-teal-300 font-medium">Impact: {s.impact}</div>
              </div>
              <button className="px-3.5 py-2 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold hover:bg-teal-500/20 transition whitespace-nowrap">
                Review Policy Rule
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
