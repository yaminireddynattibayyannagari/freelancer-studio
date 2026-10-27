import React from 'react';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  DollarSign,
  CheckSquare,
  Sparkles,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const ProjectCard = ({ project, onEdit, onDelete, onOpenMilestones, onGenerateProposal }) => {
  const { clients, milestones } = useData();
  const client = clients.find((c) => c.id === project.client_id);
  const projectMilestones = milestones.filter((m) => m.project_id === project.id);
  const completedMilestones = projectMilestones.filter((m) => m.status === 'Completed').length;

  // Deadline calculation
  const getDeadlineMeta = () => {
    if (!project.deadline) return null;
    const diff = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, urgent: true };
    if (diff === 0) return { text: 'Due today', urgent: true };
    if (diff <= 7) return { text: `${diff}d remaining`, urgent: true };
    return { text: `${diff}d left`, urgent: false };
  };

  const deadlineMeta = getDeadlineMeta();

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">
              {client ? `${client.name}${client.company ? ` • ${client.company}` : ''}` : 'Direct Project'}
            </span>
            <h4 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors mt-0.5">
              {project.title}
            </h4>
          </div>
          <Badge status={project.status} />
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Progress Section */}
        <div className="mb-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Progress</span>
            <span className="text-brand-400 font-mono font-bold">
              {project.progress_percentage || 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-brand-400 rounded-full transition-all duration-300"
              style={{ width: `${project.progress_percentage || 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-brand-400" />
              <span>
                {completedMilestones} / {projectMilestones.length} Milestones
              </span>
            </span>
            <button
              onClick={() => onOpenMilestones(project)}
              className="text-brand-400 hover:text-brand-300 font-medium text-[11px]"
            >
              Manage Milestones →
            </button>
          </div>
        </div>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-medium">Budget</div>
              <div className="font-mono font-bold text-slate-200">
                ${(Number(project.budget) || 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Deadline</div>
              <div className="text-slate-200 truncate font-medium">
                {project.deadline || 'No deadline'}
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Alert if applicable */}
        {deadlineMeta && deadlineMeta.urgent && project.status !== 'Completed' && (
          <div className="mb-4 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Upcoming deadline: {deadlineMeta.text}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onGenerateProposal(project, client)}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-brand-500/10 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Proposal</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(project)}
            title="Edit Project"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            title="Delete Project"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
