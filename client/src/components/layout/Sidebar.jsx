import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  MailCheck,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { clients, projects, proposals } = useData();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'clients',
      label: 'Clients CRM',
      icon: Users,
      badge: clients.length,
    },
    {
      id: 'projects',
      label: 'Projects & Milestones',
      icon: FolderKanban,
      badge: projects.length,
    },
    {
      id: 'proposals',
      label: 'AI Proposal Writer',
      icon: FileText,
      badge: proposals.length,
      highlight: true,
    },
    {
      id: 'followups',
      label: 'AI Follow-up Studio',
      icon: MailCheck,
      highlight: true,
    },
    {
      id: 'settings',
      label: 'Settings & Supabase',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-800/80 bg-slate-950/50 p-4 flex flex-col justify-between shrink-0">
      <nav className="space-y-1.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
          Management & Studio
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-brand-400'
                      : item.highlight
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {typeof item.badge === 'number' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Assistant Banner */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-left relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Generate comprehensive client proposals, milestone plans, and follow-up emails in seconds.
        </p>
        <button
          onClick={() => onTabChange('proposals')}
          className="w-full text-xs py-1.5 px-3 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 font-medium border border-brand-500/30 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3 h-3" />
          <span>New AI Proposal</span>
        </button>
      </div>
    </aside>
  );
};
