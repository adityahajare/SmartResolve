import React from 'react';

export const SentimentEmoji = ({ sentiment, showScore = false, score }) => {
  const map = {
    furious: { emoji: '😡', label: 'Furious', color: 'text-red-600' },
    angry: { emoji: '😠', label: 'Angry', color: 'text-orange-600' },
    frustrated: { emoji: '😤', label: 'Frustrated', color: 'text-amber-600' },
    negative: { emoji: '🙁', label: 'Negative', color: 'text-yellow-600' },
    neutral: { emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    satisfied: { emoji: '🙂', label: 'Satisfied', color: 'text-emerald-500' },
    positive: { emoji: '😊', label: 'Positive', color: 'text-green-600' }
  };

  const key = (sentiment || 'neutral').toLowerCase();
  const info = map[key] || map.neutral;

  return (
    <div className="inline-flex items-center gap-1 text-sm font-medium" title={info.label}>
      <span className="text-base">{info.emoji}</span>
      <span className={info.color}>{info.label}</span>
      {showScore && score !== undefined && (
        <span className="text-xs text-gray-400">({score})</span>
      )}
    </div>
  );
};
