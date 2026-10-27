import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ClientList } from './components/clients/ClientList';
import { ProjectList } from './components/projects/ProjectList';
import { ProposalList } from './components/proposals/ProposalList';
import { AIProposalGenerator } from './components/proposals/AIProposalGenerator';
import { AIFollowUpGenerator } from './components/proposals/AIFollowUpGenerator';
import { SettingsPage } from './components/settings/SettingsPage';
import { Sparkles, ArrowLeft } from 'lucide-react';

function MainAppShell() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [proposalMode, setProposalMode] = useState('list'); // 'list' | 'generator'
  const [preselectedClient, setPreselectedClient] = useState(null);
  const [preselectedProject, setPreselectedProject] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Loading Freelance Studio...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSelectClientForProposal = (client) => {
    setPreselectedClient(client);
    setPreselectedProject(null);
    setActiveTab('proposals');
    setProposalMode('generator');
  };

  const handleSelectProjectForProposal = (project, client) => {
    setPreselectedProject(project);
    setPreselectedClient(client || null);
    setActiveTab('proposals');
    setProposalMode('generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14] text-slate-100">
      {/* Top Navigation */}
      <Navbar />

      {/* Body Layout: Sidebar + Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'proposals') setProposalMode('list');
          }}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onNavigate={(tab) => {
                setActiveTab(tab);
                if (tab === 'proposals') setProposalMode('generator');
              }}
            />
          )}

          {activeTab === 'clients' && (
            <ClientList
              onSelectClientForProposal={handleSelectClientForProposal}
              onSelectClientForProject={() => setActiveTab('projects')}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectList
              onSelectProjectForProposal={handleSelectProjectForProposal}
            />
          )}

          {activeTab === 'proposals' && (
            <div className="space-y-6">
              {proposalMode === 'generator' ? (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={() => setProposalMode('list')}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Proposals Repository</span>
                    </button>
                  </div>
                  <AIProposalGenerator
                    preselectedClient={preselectedClient}
                    preselectedProject={preselectedProject}
                    onSaved={() => setProposalMode('list')}
                  />
                </div>
              ) : (
                <ProposalList
                  onNewProposal={() => {
                    setPreselectedClient(null);
                    setPreselectedProject(null);
                    setProposalMode('generator');
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'followups' && <AIFollowUpGenerator />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppShell />
      </DataProvider>
    </AuthProvider>
  );
}
