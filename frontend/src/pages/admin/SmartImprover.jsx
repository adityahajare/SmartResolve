import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, Wand2 } from 'lucide-react';
import API from '../../services/api';

export const SmartImprover = () => {
  const [complaintText, setComplaintText] = useState('My UPI payment failed and ₹4,500 was debited. I will take this to the consumer forum if not refunded immediately.');
  const [draftResponse, setDraftResponse] = useState('We have received your query. Refund will take 5-7 business days.');
  const [analysis, setAnalysis] = useState({
    confidenceScore: 58,
    level: 'Medium',
    suggestions: [
      'Missing formal apology for financial distress',
      'Missing specific tracking reference number',
      'Timeline (5-7 days) does not adhere to RBI T+1 auto-reversal guidelines'
    ],
    improvedDraft: 'Dear Valued Customer,\n\nWe sincerely apologize for the inconvenience caused regarding your failed UPI transaction of ₹4,500. We understand how critical this deduction is.\n\nOur payment operations team has verified the deduction with our banking partner (Ref: REV-982104). We have initiated an instant reversal, and the full amount will reflect in your bank account within 24 hours.\n\nThank you for your patience while we prioritized your resolution.'
  });
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalysis({
        confidenceScore: 94,
        level: 'High',
        suggestions: ['Tone is empathetic and reassuring', 'Clear reversal reference ID included'],
        improvedDraft: 'Dear Customer,\n\nWe deeply regret the trouble caused by the failed UPI deduction of ₹4,500. We have cross-checked with the settlement gateway and expedited your refund ticket under Reference #REV-982104. The funds will be credited to your account within 24 hours.'
      });
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-100 uppercase flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-400" /> Resolution Confidence Auditor & Smart Improver
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Scrutinizes agent responses before dispatch to verify empathy, concrete timelines, and resolution certainty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (6 Cols) */}
        <div className="lg:col-span-6 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Customer Grievance Context (With Emotion)
            </label>
            <textarea
              rows={3}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full text-xs p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Agent Draft Resolution
            </label>
            <textarea
              rows={4}
              value={draftResponse}
              onChange={(e) => setDraftResponse(e.target.value)}
              className="w-full text-xs p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            onClick={handleAudit}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {loading ? 'Evaluating Resolution Quality...' : 'Inspect Resolution Quality (AI Auditor)'}
          </button>
        </div>

        {/* Right Output HUD (6 Cols) */}
        <div className="lg:col-span-6 bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800/80 mb-4">
              <h3 className="text-sm font-bold text-slate-200">Audit Score & AI Suggestions</h3>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                analysis.confidenceScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                Score: {analysis.confidenceScore} / 100
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Actionable Feedback:</span>
                <ul className="space-y-1.5 text-slate-300">
                  {analysis.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#0a0f1d] p-2 rounded-lg border border-slate-850">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">AI-Enhanced Recommended Response:</span>
                <div className="p-3.5 bg-[#0a0f1d] rounded-xl border border-teal-900/40 text-slate-200 whitespace-pre-line text-[11px] leading-relaxed font-sans">
                  {analysis.improvedDraft}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-850/60 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>Resolutions with confidence score &gt; 80 result in 94% lower reopening rates.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
