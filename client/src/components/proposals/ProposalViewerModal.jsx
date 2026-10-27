import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';
import { Copy, Check, Trash2, Printer, Save } from 'lucide-react';

export const ProposalViewerModal = ({ isOpen, onClose, proposal }) => {
  const { updateProposal, deleteProposal, clients } = useData();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [status, setStatus] = useState(proposal?.status || 'Draft');

  React.useEffect(() => {
    if (proposal) {
      setEditedContent(proposal.content || '');
      setStatus(proposal.status || 'Draft');
      setIsEditing(false);
    }
  }, [proposal]);

  if (!proposal) return null;

  const client = clients.find((c) => c.id === proposal.client_id);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent || proposal.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await updateProposal(proposal.id, { status: newStatus });
  };

  const handleSaveContent = async () => {
    await updateProposal(proposal.id, { content: editedContent, status });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this proposal?')) {
      await deleteProposal(proposal.id);
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proposal.title}
      subtitle={`Client: ${client ? client.name : 'Direct'} • Estimated: $${(Number(proposal.estimated_amount) || 0).toLocaleString()}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs py-1 px-2 text-slate-200"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
            <Badge status={status} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Text'}
            </button>

            {isEditing && (
              <button
                onClick={handleSaveContent}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Edits</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              title="Print / Save PDF"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              title="Delete Proposal"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isEditing ? (
          <textarea
            rows={18}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        ) : (
          <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto select-text">
            {proposal.content}
          </div>
        )}
      </div>
    </Modal>
  );
};
