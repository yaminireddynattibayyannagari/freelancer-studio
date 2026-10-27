import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck, ArrowRight, Database, KeyRound } from 'lucide-react';

export const AuthPage = () => {
  const { loginWithPassword, registerWithPassword, loginAsDemo, isSupabaseConfigured } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await registerWithPassword(email, password, {
          full_name: fullName,
          business_name: businessName,
        });
      } else {
        await loginWithPassword(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 mb-4 shadow-glow">
            <Sparkles className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            SoloPro Studio
          </h1>
          <p className="text-sm text-slate-400">
            Freelance CRM, Project Tracker & Google Gemini AI Proposal Writer
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Quick Demo One-Click Access */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-brand-950/40 via-emerald-950/30 to-slate-900 border border-brand-500/30 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Instant Evaluation
              </span>
              <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-mono">
                No setup required
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Explore full CRM, Milestones tracking, and AI proposal generator with pre-loaded demo clients and projects.
            </p>
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full py-2.5 px-4 rounded-lg bg-brand-400 hover:bg-brand-300 text-slate-950 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-glow"
            >
              <span>Explore Demo Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative inline-block px-3 bg-slate-900 text-xs uppercase tracking-wider text-slate-500 font-medium">
              Or {isSupabaseConfigured ? 'Supabase Auth' : 'Connect Live Supabase'}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {isSupabaseConfigured ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Business or Studio Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Rivera AI & Web Studio"
                      className="input-field"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@studio.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 mt-2"
              >
                {loading
                  ? 'Processing...'
                  : isRegister
                  ? 'Create Supabase Account'
                  : 'Sign In with Supabase'}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  {isRegister
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Register"}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
                <KeyRound className="w-4 h-4 text-brand-400" />
                <span>Supabase PostgreSQL Integration</span>
              </div>
              <p className="mb-2">
                To connect your personal Supabase database with Row Level Security:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                <li>Execute migration: <span className="text-emerald-400">/supabase/migrations/001_initial_schema.sql</span></li>
                <li>Add credentials in <span className="text-emerald-400">/client/.env</span>:</li>
                <li className="pl-2 text-slate-300">VITE_SUPABASE_URL=https://xyz.supabase.co</li>
                <li className="pl-2 text-slate-300">VITE_SUPABASE_ANON_KEY=eyJ...</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
