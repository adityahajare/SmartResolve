import React from 'react';

export const StatusBadge = ({ status }) => {
  const map = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    assigned: 'bg-blue-100 text-blue-800 border-blue-300',
    in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    waiting_customer: 'bg-purple-100 text-purple-800 border-purple-300',
    waiting_internal: 'bg-amber-100 text-amber-800 border-amber-300',
    resolved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    closed: 'bg-slate-100 text-slate-700 border-slate-300',
    reopened: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const st = (status || 'pending').toLowerCase();
  const cls = map[st] || 'bg-gray-100 text-gray-700 border-gray-300';
  const label = st.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {label}
    </span>
  );
};
