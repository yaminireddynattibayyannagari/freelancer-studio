import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  DollarSign,
  Loader2,
} from 'lucide-react';

export const MilestoneTrackerModal = ({ isOpen, onClose, project }) => {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useData();
  const { session } = useAuth();
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  if (!project) return null;

  const projectMilestones = milestones.filter((m) => m.project_id === project.id);
  const completedCount = projectMilestones.filter((m) => m.status === 'Completed').length;
  const totalCount = projectMilestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleStatus = async (milestone) => {
    let nextStatus = 'Pending';
    if (milestone.status === 'Pending') nextStatus = 'In Progress';
    else if (milestone.status === 'In Progress') {
      nextStatus = 'Completed';
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore if canvas not supported
      }
    } else {
      nextStatus = 'Pending';
    }

    await updateMilestone(milestone.id, { status: nextStatus });
  };

  const handleAddCustom = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addMilestone({
      project_id: project.id,
      title: newTitle.trim(),
      description: newDescription.trim(),
      amount: Number(newAmount) || 0,
      due_date: newDueDate || null,
      status: 'Pending',
      order_index: projectMilestones.length,
    });

    setNewTitle('');
    setNewAmount('');
    setNewDueDate('');
    setNewDescription('');
    setIsAdding(false);
  };

  const handleGenerateAiMilestones = async () => {
    setAiGenerating(true);
    setAiSuggestions(null);
    try {
      const res = await api.generateMilestones(
        {
          projectTitle: project.title,
          description: project.description || 'Deliver complete freelance project',
          budget: Number(project.budget) || 5000,
          timelineWeeks: 6,
          targetMilestonesCount: 4,
        },
        session?.access_token
      );
      if (res.data?.milestones) {
        setAiSuggestions(res.data.milestones);
      }
    } catch (err) {
      alert('Could not generate AI milestones: ' + err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyAiSuggestions = async () => {
    if (!aiSuggestions || aiSuggestions.length === 0) return;

    for (let i = 0; i < aiSuggestions.length; i++) {
      const s = aiSuggestions[i];
      await addMilestone({
        project_id: project.id,
        title: s.title,
        description: s.description,
        amount: Number(s.amount) || 0,
        due_date: null,
        status: 'Pending',
        order_index: projectMilestones.length + i,
      });
    }
    setAiSuggestions(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Milestone Tracker: ${project.title}`}
      subtitle={`Budget: $${(Number(project.budget) || 0).toLocaleString()} • ${completedCount} of ${totalCount} Milestones Completed`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Progress Bar Header */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">Overall Milestone Progress</span>
            <span className="text-brand-400 font-mono text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-brand-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* AI Generator Action Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-brand-950/30 to-slate-900 border border-brand-500/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Breakdown Engine</span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-generate structured milestones and budget allocation based on project requirements.
            </p>
          </div>
          <button
            onClick={handleGenerateAiMilestones}
            disabled={aiGenerating}
            className="btn-secondary text-xs shrink-0 py-1.5 px-3 border-brand-500/30 text-brand-300 hover:bg-brand-500/10"
          >
            {aiGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Scope...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Suggest Milestones</span>
              </>
            )}
          </button>
        </div>

        {/* AI Suggestions Preview Modal */}
        {aiSuggestions && (
          <div className="p-4 rounded-xl bg-slate-950 border border-brand-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommended Milestones ({aiSuggestions.length})
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAiSuggestions(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleApplyAiSuggestions}
                  className="btn-primary text-xs py-1 px-3"
                >
                  Apply All to Project
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {aiSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{item.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400">
                      ${Number(item.amount).toLocaleString()}
                    </span>
                    <div className="text-[10px] text-slate-500">{item.days_duration} days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Milestones List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span>Project Milestones ({projectMilestones.length})</span>
            <span>Click status icon to toggle</span>
          </div>

          {projectMilestones.length > 0 ? (
            projectMilestones.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  m.status === 'Completed'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : m.status === 'In Progress'
                    ? 'bg-slate-900/80 border-brand-500/30'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleStatus(m)}
                    className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                    title={`Current: ${m.status}. Click to cycle.`}
                  >
                    {m.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : m.status === 'In Progress' ? (
                      <Clock className="w-5 h-5 text-brand-400 animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          m.status === 'Completed'
                            ? 'text-slate-400 line-through'
                            : 'text-white'
                        }`}
                      >
                        {m.title}
                      </span>
                      <Badge status={m.status} />
                    </div>

                    {m.description && (
                      <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      {m.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{m.due_date}</span>
                        </span>
                      )}
                      {m.amount > 0 && (
                        <span className="flex items-center gap-1 font-mono text-emerald-400">
                          <DollarSign className="w-3 h-3" />
                          <span>${Number(m.amount).toLocaleString()}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteMilestone(m.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No milestones added yet. Add one manually or use AI Breakdown above.
            </div>
          )}
        </div>

        {/* Add Custom Milestone Form */}
        {isAdding ? (
          <form onSubmit={handleAddCustom} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-white">Add New Milestone</h4>
            <div>
              <input
                type="text"
                required
                placeholder="Milestone title (e.g. Phase 1: Database Setup)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-field text-xs py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Amount ($ USD)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="input-field text-xs py-2"
              />
              <input
                type="date"
                placeholder="Due date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="input-field text-xs py-2"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Description & acceptance criteria (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="input-field text-xs py-2 resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-1.5 px-3">
                Save Milestone
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Milestone</span>
          </button>
        )}
      </div>
    </Modal>
  );
};
