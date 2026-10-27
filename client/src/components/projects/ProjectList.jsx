import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { MilestoneTrackerModal } from './MilestoneTrackerModal';
import { Plus, Search, FolderKanban, Filter } from 'lucide-react';

export const ProjectList = ({ onSelectProjectForProposal }) => {
  const { projects, clients, deleteProject } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedMilestoneProject, setSelectedMilestoneProject] = useState(null);

  const statuses = ['ALL', 'Planning', 'In Progress', 'Review', 'Completed', 'On Hold'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const client = clients.find((c) => c.id === project.client_id);
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(search.toLowerCase())) ||
        (client && client.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesClient = clientFilter === 'ALL' || project.client_id === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [projects, clients, search, statusFilter, clientFilter]);

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project and all associated milestones?')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-400" />
            Projects & Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track deliverables, budgets, client timelines, and completion metrics
          </p>
        </div>

        <button onClick={handleNew} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
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
            placeholder="Search projects or clients..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Client Filter Dropdown */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-field text-xs py-2 w-auto"
          >
            <option value="ALL">All Clients ({clients.length})</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
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
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenMilestones={(p) => setSelectedMilestoneProject(p)}
              onGenerateProposal={(p, c) =>
                onSelectProjectForProposal && onSelectProjectForProposal(p, c)
              }
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {search || statusFilter !== 'ALL' || clientFilter !== 'ALL'
              ? 'Try clearing your search or active filters.'
              : 'Launch your first project to organize milestones and track revenue.'}
          </p>
          <button onClick={handleNew} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingProject}
      />

      {/* Milestone Tracker Modal */}
      <MilestoneTrackerModal
        isOpen={Boolean(selectedMilestoneProject)}
        onClose={() => setSelectedMilestoneProject(null)}
        project={selectedMilestoneProject}
      />
    </div>
  );
};
