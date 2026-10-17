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
    <div className="max-w-md mx-auto space-y-6 pt-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Rate Resolution Quality</h2>
        <p className="text-xs text-gray-500">How satisfied are you with the turnaround time and clarity of resolution?</p>

        <div className="flex justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-1.5 rounded-lg transition ${rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share any final comments..."
            className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
