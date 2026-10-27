import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { ProposalViewerModal } from './ProposalViewerModal';
import { FileText, Plus, Search, Eye, Sparkles, DollarSign, Calendar } from 'lucide-react';

export const ProposalList = ({ onNewProposal }) => {
  const { proposals, clients } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProposal, setSelectedProposal] = useState(null);

  const statuses = ['ALL', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const client = clients.find((c) => c.id === p.client_id);
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (client && client.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proposals, clients, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            AI Proposal Repository
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Proposals generated with Gemini AI and recorded in your Supabase database
          </p>
        </div>

        <button onClick={onNewProposal} className="btn-primary">
          <Sparkles className="w-4 h-4" />
          <span>New AI Proposal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals by title or client name..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProposals.map((proposal) => {
            const client = clients.find((c) => c.id === proposal.client_id);

            return (
              <div
                key={proposal.id}
                className="glass-card glass-card-hover rounded-xl p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider truncate">
                      {client ? client.name : 'Direct Engagement'}
                    </span>
                    <Badge status={proposal.status} />
                  </div>

                  <h4 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 mb-3">
                    {proposal.title}
                  </h4>

                  <div className="space-y-2 mb-4 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Estimated Value:</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        ${(Number(proposal.estimated_amount) || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Created:</span>
                      </span>
                      <span>
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {proposal.generated_by_ai && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-brand-400 font-mono">
                      <Sparkles className="w-3 h-3" />
                      <span>Gemini Generated</span>
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedProposal(proposal)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 ml-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No proposals found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {search || statusFilter !== 'ALL'
              ? 'Try adjusting your filters.'
              : 'Write your first AI proposal with Google Gemini to win new client deals.'}
          </p>
          <button onClick={onNewProposal} className="btn-primary">
            <Sparkles className="w-4 h-4" />
            <span>Generate First Proposal</span>
          </button>
        </div>
      )}

      {/* Viewer Modal */}
      <ProposalViewerModal
        isOpen={Boolean(selectedProposal)}
        onClose={() => setSelectedProposal(null)}
        proposal={selectedProposal}
      />
    </div>
  );
};
