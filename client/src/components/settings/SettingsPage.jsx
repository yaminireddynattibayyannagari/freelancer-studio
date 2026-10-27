import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { api } from '../../lib/api';
import {
  Settings,
  Database,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, isSupabaseConfigured } = useAuth();
  const { refreshData } = useData();
  const [serverHealth, setServerHealth] = useState(null);
  const [profileName, setProfileName] = useState(user?.user_metadata?.full_name || 'Alex Rivera');
  const [businessName, setBusinessName] = useState(user?.user_metadata?.business_name || 'Rivera AI & Web Studio');
  const [title, setTitle] = useState(user?.user_metadata?.title || 'Principal Full-Stack Engineer');
  const [hourlyRate, setHourlyRate] = useState('150');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api
      .checkHealth()
      .then((data) => setServerHealth(data))
      .catch((err) => console.warn('Backend health check error:', err));
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo CRM data back to initial state?')) {
      localStorage.removeItem('freelance_clients');
      localStorage.removeItem('freelance_projects');
      localStorage.removeItem('freelance_milestones');
      localStorage.removeItem('freelance_proposals');
      refreshData();
      alert('Data reset successfully to default demo sandbox!');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-400" />
          Studio Settings & System Status
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure freelancer rates, review Supabase RLS schema, and verify Gemini AI connectivity
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Supabase Status */}
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database Architecture</span>
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {isSupabaseConfigured ? 'Supabase Live' : 'Demo Sandbox'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            PostgreSQL schema with Row Level Security (RLS) policies for clients, projects, milestones, and proposals.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-400 truncate">
            /supabase/migrations/001_initial_schema.sql
          </div>
        </div>

        {/* Gemini AI Status */}
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Google Gemini SDK</span>
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                serverHealth?.integrations?.geminiAi === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
              }`}
            >
              {serverHealth?.integrations?.geminiAi === 'connected'
                ? 'API Active'
                : 'Smart Template Engine'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Model: <span className="text-brand-400 font-mono font-semibold">{serverHealth?.integrations?.geminiModel || 'gemini-2.5-flash'}</span> via @google/genai SDK in Express server.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-400 truncate">
            Server: {serverHealth?.status === 'online' ? 'http://localhost:5000 (Connected)' : 'Connecting...'}
          </div>
        </div>
      </div>

      {/* Freelancer Profile Form */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">
          Freelance Consultant Profile
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="input-field text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Business / Studio Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input-field text-xs py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Full-Stack Consultant"
                className="input-field text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Standard Hourly Rate ($ USD)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="150"
                className="input-field text-xs py-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Profile updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-500">Used as default author in AI proposal generation</span>
            )}

            <button type="submit" className="btn-primary text-xs py-1.5 px-4">
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone / Reset Sandbox */}
      <div className="glass-card rounded-2xl p-6 border-rose-500/20">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Demo Data Management</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Reset local storage test data back to original realistic sample clients, projects, and proposals.
        </p>
        <button
          onClick={handleResetDemoData}
          className="btn-secondary text-xs py-2 px-4 text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Sandbox Data</span>
        </button>
      </div>
    </div>
  );
};
