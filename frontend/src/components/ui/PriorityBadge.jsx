import React from 'react';

export const PriorityBadge = ({ priority, score }) => {
  const colorMap = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300',
  };

  const level = (priority || 'low').toLowerCase();
  const cls = colorMap[level] || colorMap.low;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span className="capitalize">{level}</span>
      {score !== undefined && (
        <span className="opacity-75 text-[10px]">({score})</span>
      )}
    </span>
  );
};
