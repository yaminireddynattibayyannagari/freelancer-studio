import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ClientCard } from './ClientCard';
import { ClientModal } from './ClientModal';
import { Plus, Search, Users, UserPlus } from 'lucide-react';

export const ClientList = ({ onSelectClientForProposal, onSelectClientForProject }) => {
  const { clients, deleteClient } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const statuses = ['ALL', 'Active', 'Lead', 'Past', 'Archived'];

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(search.toLowerCase())) ||
        client.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client? All linked projects will also be removed.')) {
      await deleteClient(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            Client Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your client relationships, contract histories, and notes
          </p>
        </div>

        <button onClick={handleNew} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name, company, or email..."
            className="input-field pl-10"
          />
        </div>

        {/* Status Filter Buttons */}
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

      {/* Client Cards Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNewProject={(c) => onSelectClientForProject && onSelectClientForProject(c)}
              onNewProposal={(c) => onSelectClientForProposal && onSelectClientForProposal(c)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No clients found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {search || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter tags.'
              : 'Add your first client to start organizing projects and generating proposals.'}
          </p>
          <button onClick={handleNew} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Create Client</span>
          </button>
        </div>
      )}

      {/* Client Modal */}
      <ClientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingClient}
      />
    </div>
  );
};
