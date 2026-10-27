import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, LogOut, User, Database, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onQuickCreate }) => {
  const { user, logout, isSupabaseConfigured } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            SoloPro <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-mono font-medium border border-brand-500/20">AI Freelance CRM</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Supabase status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
          {isSupabaseConfigured ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase RLS Active</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">Sandbox Demo Mode</span>
            </>
          )}
        </div>

        {/* User profile dropdown or trigger */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-200">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {user.user_metadata?.business_name || 'Independent Studio'}
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-sm">
              {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
