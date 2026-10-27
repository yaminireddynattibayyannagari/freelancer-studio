import React from 'react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  DollarSign,
  FolderKanban,
  FileText,
  Users,
  Sparkles,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const DashboardOverview = ({ onNavigate, onQuickCreate }) => {
  const { metrics, projects, clients, proposals } = useData();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-medium border border-brand-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini AI & Supabase Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Freelance Studio Overview
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Track client deliverables, monitor active milestones, and write AI-powered proposals in one command center.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('proposals')}
              className="btn-primary text-xs py-2 px-4 shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Write AI Proposal</span>
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="btn-secondary text-xs py-2 px-4"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>View Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pipeline Revenue"
          value={`$${metrics.totalPipelineRevenue.toLocaleString()}`}
          subtitle={`$${metrics.completedRevenue.toLocaleString()} collected`}
          icon={DollarSign}
          trend="up"
          change="+18% this month"
        />
        <StatCard
          title="Active Projects"
          value={metrics.activeProjectsCount}
          subtitle={`${metrics.completedProjectsCount} completed`}
          icon={FolderKanban}
        />
        <StatCard
          title="Proposals in Flight"
          value={metrics.pendingProposalsCount}
          subtitle={`${proposals.length} total generated`}
          icon={FileText}
        />
        <StatCard
          title="Active Clients"
          value={metrics.totalClientsCount}
          subtitle="CRM Contacts"
          icon={Users}
        />
      </div>

      {/* Main Grid: Urgent Deadlines & Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Deadlines Widget */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Upcoming Deadlines
                </h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium"
              >
                View all →
              </button>
            </div>

            {metrics.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {metrics.upcomingDeadlines.map((p) => {
                  const client = clients.find((c) => c.id === p.client_id);
                  const diff = Math.ceil((new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  const isUrgent = diff <= 7;

                  return (
                    <div
                      key={p.id}
                      onClick={() => onNavigate('projects')}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {client ? client.name : 'Direct'} • {p.progress_percentage}% completed
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            isUrgent
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {diff < 0 ? `${Math.abs(diff)}d overdue` : `${diff} days left`}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">{p.deadline}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No upcoming deadlines pending!
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Milestones sync automatically</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Real-time tracking
            </span>
          </div>
        </div>

        {/* Pipeline & Revenue Breakdown */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Pipeline & Financial Health
                </h3>
              </div>
              <span className="text-xs text-slate-400">Total: ${metrics.totalPipelineRevenue.toLocaleString()}</span>
            </div>

            {/* Financial Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 mb-5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Revenue Realization Rate</span>
                <span className="text-emerald-400 font-mono">
                  {metrics.totalPipelineRevenue > 0
                    ? Math.round((metrics.completedRevenue / metrics.totalPipelineRevenue) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-brand-400"
                  style={{
                    width: `${
                      metrics.totalPipelineRevenue > 0
                        ? Math.round((metrics.completedRevenue / metrics.totalPipelineRevenue) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Completed: ${metrics.completedRevenue.toLocaleString()}</span>
                <span>Active Pipeline: ${(metrics.totalPipelineRevenue - metrics.completedRevenue).toLocaleString()}</span>
              </div>
            </div>

            {/* Recent Active Projects List */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                Active Projects Progress
              </div>
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onNavigate('projects')}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                      {proj.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      ${(Number(proj.budget) || 0).toLocaleString()} • {proj.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 hidden sm:block">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-400 rounded-full"
                          style={{ width: `${proj.progress_percentage || 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-400 w-10 text-right">
                      {proj.progress_percentage || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('clients')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Manage {clients.length} Clients</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('followups')}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Send AI Follow-up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
