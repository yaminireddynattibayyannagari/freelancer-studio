import React from 'react';
import { Badge } from '../common/Badge';
import { Mail, Phone, Globe, FolderKanban, Sparkles, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export const ClientCard = ({ client, onEdit, onDelete, onNewProject, onNewProposal }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 flex flex-col justify-between relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center font-bold text-white shadow-sm">
              {client.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h4 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">
                {client.name}
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                {client.company || 'Individual Client'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge status={client.status} />

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(client);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(client.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Links */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <a
              href={`mailto:${client.email}`}
              className="hover:text-brand-300 transition-colors truncate"
            >
              {client.email}
            </a>
          </div>

          {client.phone && (
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{client.phone}</span>
            </div>
          )}

          {client.website && (
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-300 transition-colors truncate"
              >
                {client.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Client Notes */}
        {client.notes && (
          <div className="mb-4 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 line-clamp-2">
            {client.notes}
          </div>
        )}
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="text-xs">
          <span className="text-slate-500">Total Spent: </span>
          <span className="font-semibold text-emerald-400 font-mono">
            ${(Number(client.total_spent) || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNewProject(client)}
            title="Create Project for Client"
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
          >
            <FolderKanban className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNewProposal(client)}
            title="Write AI Proposal for Client"
            className="p-1.5 rounded-lg text-brand-400 hover:bg-brand-500/10 border border-brand-500/20 hover:border-brand-500/40 transition-all flex items-center gap-1 text-xs px-2.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium hidden sm:inline">Proposal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
