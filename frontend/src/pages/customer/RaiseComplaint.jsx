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
  HelpCircle,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Camera,
  Send
} from 'lucide-react';

export const RaiseComplaint = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: searchParams.get('description') || '',
    category: searchParams.get('category') || 'Payment',
    subcategory: 'Transaction & Billing Issue',
    referenceId: '',
    inputChannel: searchParams.get('channel') || 'form',
    monetaryAmount: ''
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [fileName, setFileName] = useState('');

  const categories = [
    { id: 'Payment', name: 'Payments & UPI', icon: CreditCard, color: 'text-blue-400 bg-blue-950/40 border-blue-800/60', sub: ['UPI Transaction Timeout', 'Double Debit Reversal', 'Gateway Failure', 'Incorrect Surcharge'] },
    { id: 'Delivery', name: 'Orders & Shipping', icon: Truck, color: 'text-amber-400 bg-amber-950/40 border-amber-800/60', sub: ['Delayed Delivery Hub Scan', 'Missing Item from Box', 'Damaged Transit Parcel', 'Wrong Address Delivery'] },
    { id: 'Refund', name: 'Refunds & Returns', icon: RotateCcw, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60', sub: ['T+1 Settlement SLA Delay', 'Return Rejection Review', 'Partial Amount Credit'] },
    { id: 'Fraud', name: 'Fraud & Security', icon: ShieldAlert, color: 'text-rose-400 bg-rose-950/40 border-rose-800/60', sub: ['Unauthorized Card Charge', 'Account Takeover Attempt', 'Phishing Notification'] },
    { id: 'Technical', name: 'Technical & Bug', icon: Smartphone, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60', sub: ['OTP Not Delivered', 'Application Crash on Checkout', 'Account Access Locked'] },
    { id: 'Other', name: 'General Inquiries', icon: HelpCircle, color: 'text-purple-400 bg-purple-950/40 border-purple-800/60', sub: ['Customer Support Escalation', 'Billing Statement Dispute', 'General Inquiries'] }
  ];

  const currentCategoryObj = categories.find(c => c.id === formData.category) || categories[0];

  useEffect(() => {
    if (formData.description.trim().length < 10) {
      setAiPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setAnalyzing(true);
      try {
        const res = await ticketService.analyzeTicket({
          title: formData.title || `${formData.category} Issue`,
          description: formData.description,
          category: formData.category
        });
        if (res.success) {
          setAiPreview(res.data);
        }
      } catch (err) {
        console.error('Diagnostic engine failed', err);
      } finally {
        setAnalyzing(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.description, formData.title, formData.category]);

  const handleMockOCR = () => {
    setOcrScanning(true);
    setFileName('bank_transaction_receipt.png');
    setTimeout(() => {
      setOcrScanning(false);
      setFormData(prev => ({
        ...prev,
        referenceId: 'UPI-TXN-9029104',
        monetaryAmount: '4500',
        description: prev.description 
          ? prev.description + '\n[Receipt OCR Parsed]: Ref ID: UPI-TXN-9029104 | Amount: ₹4,500 | Bank: HDFC Bank | Status: FAILED'
          : 'My UPI transaction of ₹4,500 was deducted from HDFC Bank account but order timed out. Reference: UPI-TXN-9029104. Please resolve urgently.'
      }));
    }, 1000);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await ticketService.createTicket({
        ...formData,
        attachments: fileName ? [{ url: 'https://placeholder.file/evidence.png', name: fileName, type: 'image' }] : []
      });
      if (res.success) {
        navigate(`/complaints/${res.data.ticketId || res.data._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">Submit New Request</h1>
          <p className="text-xs text-slate-400 mt-1">Provide incident details and supporting proof for expedited resolution.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-[#140e24] px-4 py-2 rounded-2xl border border-fuchsia-950/80 text-xs font-bold">
          <span className={`px-2 py-0.5 rounded-lg ${step === 1 ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white' : 'text-slate-400'}`}>1. Category</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className={`px-2 py-0.5 rounded-lg ${step === 2 ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white' : 'text-slate-400'}`}>2. Evidence</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className={`px-2 py-0.5 rounded-lg ${step === 3 ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white' : 'text-slate-400'}`}>3. Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* STEP 1: Categories */}
          {step === 1 && (
            <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-6 shadow-2xl space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Select Department Category</h3>
                <p className="text-xs text-slate-400 mt-0.5">Choose the department best matched to resolve this request.</p>
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
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-28 ${
                        isSelected 
                          ? 'border-fuchsia-500 bg-[#21163d] ring-1 ring-fuchsia-500/50' 
                          : 'border-fuchsia-950/70 hover:border-fuchsia-800/60 bg-[#19112d]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl w-fit border ${c.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{c.sub.length} sub-types</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-300">Specific Sub-Issue</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full text-xs p-3 bg-[#19112d] border border-fuchsia-950/80 rounded-xl text-white focus:outline-none focus:border-fuchsia-500"
                >
                  {currentCategoryObj.sub.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
                >
                  Continue to Evidence <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Description & OCR Evidence */}
          {step === 2 && (
            <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-white">Request Description & Proof</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Detail what occurred and upload supporting documents or receipts.</p>
                </div>
                <span className="text-[11px] px-3 py-1 bg-fuchsia-950/60 border border-fuchsia-800/60 text-fuchsia-300 font-bold rounded-xl">
                  {formData.category}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject Headline</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ₹4,500 debited via UPI but merchant checkout timed out"
                  className="w-full text-xs px-3.5 py-2.5 bg-[#19112d] border border-fuchsia-950/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              {/* OCR Upload Card */}
              <div className="p-4 bg-[#19112d] rounded-2xl border border-fuchsia-950/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Camera className="w-4 h-4 text-fuchsia-400" />
                    <span>Attach Receipt or Screenshot</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMockOCR}
                    disabled={ocrScanning}
                    className="text-xs px-3 py-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {ocrScanning ? 'Scanning Receipt...' : 'Scan Receipt'}
                  </button>
                </div>
                {fileName && (
                  <div className="text-xs bg-[#20143a] px-3 py-2 rounded-xl border border-fuchsia-900/50 text-fuchsia-300 flex items-center justify-between">
                    <span>Uploaded: <strong>{fileName}</strong> (OCR Extracted)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Transaction / Order ID</label>
                  <input
                    type="text"
                    value={formData.referenceId}
                    onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                    placeholder="e.g. UPI-TXN-9029104"
                    className="w-full text-xs px-3 py-2.5 bg-[#19112d] border border-fuchsia-950/80 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Disputed Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.monetaryAmount}
                    onChange={(e) => setFormData({ ...formData, monetaryAmount: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full text-xs px-3 py-2.5 bg-[#19112d] border border-fuchsia-950/80 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Explanation</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail step-by-step what occurred, merchant names, order timestamps, and expected resolution..."
                  className="w-full text-xs p-3.5 bg-[#19112d] border border-fuchsia-950/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-fuchsia-950/80 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#19112d] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!formData.description.trim()}
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  Review Request <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Submission */}
          {step === 3 && (
            <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-6 shadow-2xl space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Confirm Request Dispatch</h3>
                <p className="text-xs text-slate-400 mt-0.5">Review your request parameters before submitting to our support specialists.</p>
              </div>

              <div className="p-4 bg-[#19112d] rounded-2xl border border-fuchsia-950/80 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-fuchsia-950/60">
                  <span className="text-slate-400">Department</span>
                  <span className="font-bold text-white">{formData.category} ({formData.subcategory})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-fuchsia-950/60">
                  <span className="text-slate-400">Headline</span>
                  <span className="font-bold text-white">{formData.title || 'Untitled'}</span>
                </div>
                {formData.referenceId && (
                  <div className="flex justify-between py-1 border-b border-fuchsia-950/60">
                    <span className="text-slate-400">Reference ID</span>
                    <span className="font-mono font-bold text-fuchsia-400">{formData.referenceId}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block mb-1">Description</span>
                  <p className="text-slate-200 bg-[#140e24] p-3 rounded-xl border border-fuchsia-950/60 whitespace-pre-line leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-fuchsia-950/80 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#19112d] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xl disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting to Queue...' : 'Confirm & Submit Ticket'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Diagnostic Sidebar (5 Cols) */}
        <div className="lg:col-span-5 bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-fuchsia-950/60 pb-3 mb-4">
              <span className="text-xs font-bold text-white tracking-wide">Real-Time Request Diagnostics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-fuchsia-950/60 text-fuchsia-400 border border-fuchsia-800/50">
                {analyzing ? 'Analyzing...' : 'Active'}
              </span>
            </div>

            {aiPreview ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Emotion Analysis</span>
                  <div className="flex items-center justify-between bg-[#19112d] p-3 rounded-xl border border-fuchsia-950/80">
                    <SentimentEmoji sentiment={aiPreview.sentiment?.label} />
                    <span className="font-mono text-fuchsia-300 text-[11px] font-bold">
                      {aiPreview.sentiment?.score !== undefined ? `${Math.round(aiPreview.sentiment.score * 100)}% Intensity` : 'Analyzed'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Priority Calculation</span>
                  <div className="flex items-center justify-between bg-[#19112d] p-3 rounded-xl border border-fuchsia-950/80">
                    <PriorityBadge priority={aiPreview.priorityLevel} score={aiPreview.priorityScore} />
                    <span className="text-amber-400 font-bold uppercase text-[11px]">
                      Urgency: {aiPreview.urgency || 'Normal'}
                    </span>
                  </div>
                </div>

                {aiPreview.dnaFingerprint && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Complaint DNA Signature</span>
                    <div className="bg-[#0f0a1c] p-2.5 rounded-xl font-mono text-[10px] text-cyan-300 truncate border border-fuchsia-950/80">
                      {aiPreview.dnaFingerprint}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Type your issue narrative to preview live priority scoring and sentiment extraction.</p>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-[#19112d] border border-fuchsia-950/80 rounded-2xl text-[11px] text-slate-400">
            Emergency financial deductions and critical errors are automatically flagged for expedited handling.
          </div>
        </div>
      </div>
    </div>
  );
};
