import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { SentimentEmoji } from '../../components/ui/SentimentEmoji';
import {
  CreditCard,
  Truck,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Receipt,
  HelpCircle,
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  Layers,
  Save,
  Send,
  Camera
} from 'lucide-react';

export const RaiseComplaint = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Multi-step state: 1: Category & Channel, 2: Complaint Details & Evidence, 3: AI Audit & Pre-Submit
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: searchParams.get('category') || 'Payment',
    subcategory: 'Payment failed / Deducted',
    referenceId: '',
    inputChannel: 'form',
    monetaryAmount: '',
    urgencyHint: 'medium'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [fileName, setFileName] = useState('');

  const categories = [
    { id: 'Payment', name: 'Payments & UPI', icon: CreditCard, color: 'text-blue-500 bg-blue-50 border-blue-200', sub: ['UPI Failed / Deducted', 'Double Debit', 'Incorrect Billing', 'Gateway Timeout'] },
    { id: 'Delivery', name: 'Orders & Logistics', icon: Truck, color: 'text-amber-500 bg-amber-50 border-amber-200', sub: ['Delayed Shipping', 'Missing Parcel', 'Damaged Item', 'Wrong Address Delivery'] },
    { id: 'Refund', name: 'Refunds & Returns', icon: RotateCcw, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', sub: ['Refund SLA Breached', 'Return Rejected', 'Partial Amount Refunded'] },
    { id: 'Fraud', name: 'Fraud & Security', icon: ShieldAlert, color: 'text-red-500 bg-red-50 border-red-200', sub: ['Unauthorized Transaction', 'Account Takeover', 'Phishing Alert'] },
    { id: 'Technical', name: 'Technical / App Bug', icon: Smartphone, color: 'text-indigo-500 bg-indigo-50 border-indigo-200', sub: ['App Crash', 'Login Blocked', 'OTP Not Received', 'Server Outage'] },
    { id: 'Other', name: 'General Grievance', icon: HelpCircle, color: 'text-purple-500 bg-purple-50 border-purple-200', sub: ['Customer Support Behavior', 'Policy Dispute', 'Other'] }
  ];

  const currentCategoryObj = categories.find(c => c.id === formData.category) || categories[0];

  // Auto-analyze preview
  useEffect(() => {
    if (formData.description.trim().length < 10) {
      setAiPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setAnalyzing(true);
      try {
        const res = await ticketService.analyzeTicket({
          title: formData.title || `${formData.category} issue`,
          description: formData.description,
          category: formData.category
        });
        if (res.success) {
          setAiPreview(res.data);
        }
      } catch (err) {
        console.error('AI preview failed', err);
      } finally {
        setAnalyzing(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.description, formData.title, formData.category]);

  const handleMockOCR = () => {
    setOcrScanning(true);
    setFileName('screenshot_payment_failure.png');
    setTimeout(() => {
      setOcrScanning(false);
      setFormData(prev => ({
        ...prev,
        referenceId: 'UPI-TXN-9029104',
        monetaryAmount: '4500',
        description: prev.description 
          ? prev.description + '\n[OCR Evidence Extracted]: TXN ID: UPI-TXN-9029104 | Amount: ₹4,500 | Bank: HDFC Bank | Status: FAILED'
          : 'My UPI transaction of ₹4,500 failed at checkout but amount was debited from HDFC account. Reference: UPI-TXN-9029104. Please resolve and refund urgently.'
      }));
    }, 1200);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await ticketService.createTicket({
        ...formData,
        attachments: fileName ? [{ url: 'https://placeholder.file/evidence.png', name: fileName, type: 'image' }] : []
      });
      if (res.success) {
        navigate(`/complaints/${res.data._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Face 1: Complaint Dropper
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Multi-Channel Complaint Ingestion</h1>
          <p className="text-xs text-gray-500">8-channel intelligent submission portal with live AI emotion tracking & instant preemption.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold">
          <span className={`px-2 py-0.5 rounded-md ${step === 1 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>1. Category</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
          <span className={`px-2 py-0.5 rounded-md ${step === 2 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>2. Evidence</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
          <span className={`px-2 py-0.5 rounded-md ${step === 3 ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>3. AI Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Steps */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: Categories & Input Channel */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Step 1: Choose Issue Category</h3>
                <p className="text-xs text-gray-500">Select the relevant department so our match engine routes this to the correct specialist.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = formData.category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: c.id, subcategory: c.sub[0] })}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-28 ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit ${c.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{c.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{c.sub.length} sub-issues</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Subcategory select */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-gray-700">Specific Sub-Issue</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {currentCategoryObj.sub.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Input Channel Badge Selection */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-gray-700 block">Submitting Through Channel</label>
                <div className="flex flex-wrap gap-2">
                  {['form', 'chatbot', 'voice', 'screenshot', 'email', 'whatsapp'].map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setFormData({ ...formData, inputChannel: ch })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                        formData.inputChannel === ch
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Continue to Evidence <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Description & Evidence Upload */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Step 2: Grievance Details & Evidence</h3>
                  <p className="text-xs text-gray-500">Provide description or drop receipt/screenshot for auto-OCR extraction.</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg">
                  {formData.category} → {formData.subcategory}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Complaint Headline</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ₹4,500 debited via UPI but merchant shows payment failed"
                  className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* One-Click Proof Submit (OCR Feature) */}
              <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-800">One-Click Proof Upload (AI OCR)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMockOCR}
                    disabled={ocrScanning}
                    className="text-xs px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {ocrScanning ? 'Scanning Receipt...' : 'Auto-Scan Receipt'}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Upload screenshot, bill or bank statement. Our OCR engine auto-detects Transaction ID, monetary amount, and dates.
                </p>
                {fileName && (
                  <div className="text-xs bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-blue-800 flex items-center justify-between">
                    <span>Attached: <strong>{fileName}</strong> (OCR parsed)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Transaction / Order Reference (Optional)</label>
                  <input
                    type="text"
                    value={formData.referenceId}
                    onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                    placeholder="e.g. TXN9810294 or ORDER-441"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Disputed Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.monetaryAmount}
                    onChange={(e) => setFormData({ ...formData, monetaryAmount: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Detailed Explanation</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail step-by-step what occurred, dates, merchant names, customer service calls made, and desired outcome..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!formData.description.trim()}
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  Review AI Diagnostics <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI Diagnostic & Final Submission */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Step 3: Verification & Queue Preemption Check</h3>
                <p className="text-xs text-gray-500">Review AI scoring and SLA allocations before final ticket dispatch.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-gray-500">Target Category</span>
                  <span className="font-semibold text-gray-900">{formData.category} ({formData.subcategory})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-gray-500">Headline</span>
                  <span className="font-semibold text-gray-900">{formData.title || 'Untitled Complaint'}</span>
                </div>
                {formData.referenceId && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-gray-500">Reference ID</span>
                    <span className="font-mono font-semibold text-indigo-600">{formData.referenceId}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block mb-1">Issue Narrative</span>
                  <p className="text-gray-800 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-line">
                    {formData.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Details
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Injecting into OS Priority Scheduler...' : 'Confirm & Dispatch Complaint'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Live AI Diagnostic Engine HUD */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold tracking-wide">Live AI Diagnostic HUD</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono">
                {analyzing ? 'Analyzing...' : 'Ready'}
              </span>
            </div>

            {aiPreview ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Emotion & Sentiment Detected</span>
                  <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <SentimentEmoji sentiment={aiPreview.sentiment?.label} />
                    <span className="font-mono text-slate-300 text-[11px]">
                      Boost: {aiPreview.sentiment?.label === 'furious' ? '+30' : aiPreview.sentiment?.label === 'angry' ? '+20' : '+10'} pts
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Calculated Priority & Preemption Score</span>
                  <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <PriorityBadge priority={aiPreview.priorityLevel} score={aiPreview.priorityScore} />
                    <span className="text-[11px] text-amber-400 font-semibold uppercase">
                      Urgency: {aiPreview.urgency || 'Normal'}
                    </span>
                  </div>
                </div>

                {aiPreview.dnaFingerprint && (
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Complaint DNA Fingerprint</span>
                    <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-indigo-300 truncate border border-slate-800">
                      {aiPreview.dnaFingerprint}
                    </div>
                  </div>
                )}

                {aiPreview.signals && (
                  <div className="p-2.5 bg-slate-800/50 rounded-xl space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Deadline Pressure:</span>
                      <strong className={aiPreview.signals.hasDeadlinePressure ? 'text-rose-400' : 'text-slate-400'}>
                        {aiPreview.signals.hasDeadlinePressure ? 'Detected (+15)' : 'None'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Threat Language:</span>
                      <strong className={aiPreview.signals.hasThreatLanguage ? 'text-red-400' : 'text-slate-400'}>
                        {aiPreview.signals.hasThreatLanguage ? 'Detected (+25)' : 'None'}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 space-y-2">
                <Clock className="w-6 h-6 mx-auto text-slate-600" />
                <p className="text-xs">Type your complaint narrative to trigger real-time AI scoring and sentiment extraction.</p>
              </div>
            )}
          </div>

          {/* OS Queue Info Banner */}
          <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-2xl text-blue-900 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Zap className="w-4 h-4 text-blue-600" />
              Dynamic Queue Scheduler Notice
            </div>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              SmartResolve does not process complaints strictly FIFO. If an urgent financial deduction or severe negative sentiment is identified, this ticket preempts standard queries automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
