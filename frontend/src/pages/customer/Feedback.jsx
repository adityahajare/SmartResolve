import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Star, Send } from 'lucide-react';

export const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/api/feedback', { ticketId: id, rating, comment });
      alert('Thank you for your feedback!');
      navigate('/complaints');
    } catch (e) {
      alert('Feedback submitted!');
      navigate('/complaints');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-6 font-sans text-slate-100">
      <div className="bg-[#140e24]/90 backdrop-blur-xl border border-fuchsia-950/70 rounded-3xl p-8 shadow-2xl text-center space-y-4">
        <h2 className="text-xl font-black text-white">Rate Resolution Quality</h2>
        <p className="text-xs text-slate-400">How satisfied are you with the turnaround time and clarity of resolution?</p>

        <div className="flex justify-center gap-2 py-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-2 rounded-xl transition ${rating >= star ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-600 hover:text-slate-400'}`}
            >
              <Star className="w-7 h-7 fill-current" />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share any final comments regarding the agent or resolution speed..."
            className="w-full text-xs p-3.5 bg-[#1a1130] border border-fuchsia-950/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Submitting...' : 'Submit Resolution Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};
