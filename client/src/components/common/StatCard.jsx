import React from 'react';

export const StatCard = ({ title, value, change, icon: Icon, trend = 'up', subtitle }) => {
  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all duration-300" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-brand-400 group-hover:scale-110 group-hover:text-brand-300 transition-all">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-1">
        {value}
      </div>

      {(subtitle || change) && (
        <div className="flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-semibold ${
                trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
