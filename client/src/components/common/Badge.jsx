import React from 'react';

const statusColors = {
  // Client statuses
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Lead: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Past: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  Archived: 'bg-rose-500/10 text-rose-400 border-rose-500/20',

  // Project statuses
  Planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'In Progress': 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  Review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'On Hold': 'bg-amber-500/10 text-amber-400 border-amber-500/20',

  // Milestone statuses
  Pending: 'bg-slate-500/10 text-slate-400 border-slate-500/20',

  // Proposal statuses
  Draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  Sent: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Expired: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export const Badge = ({ status, className = '' }) => {
  const colorClass = statusColors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
};
