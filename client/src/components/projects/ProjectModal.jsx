import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { projectFormSchema } from '../../schemas/formSchemas';
import { useData } from '../../context/DataContext';

export const ProjectModal = ({ isOpen, onClose, initialData = null, defaultClientId = null }) => {
  const { clients, addProject, updateProject } = useData();
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    budget: '',
    status: 'In Progress',
    start_date: '',
    deadline: '',
    progress_percentage: 0,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        client_id: initialData.client_id || '',
        title: initialData.title || '',
        description: initialData.description || '',
        budget: initialData.budget !== undefined ? initialData.budget : '',
        status: initialData.status || 'In Progress',
        start_date: initialData.start_date || '',
        deadline: initialData.deadline || '',
        progress_percentage: initialData.progress_percentage || 0,
      });
    } else {
      setFormData({
        client_id: defaultClientId || (clients[0]?.id || ''),
        title: '',
        description: '',
        budget: '',
        status: 'In Progress',
        start_date: new Date().toISOString().split('T')[0],
        deadline: '',
        progress_percentage: 0,
      });
    }
    setErrors({});
  }, [initialData, defaultClientId, isOpen, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = projectFormSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateProject(initialData.id, validation.data);
      } else {
        await addProject(validation.data);
      }
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save project' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Create New Project'}
      subtitle="Link deliverables and set milestones for client engagement"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {errors.form}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Select Client *
          </label>
          <select
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            className={`input-field ${errors.client_id ? 'border-rose-500' : ''}`}
          >
            <option value="">-- Choose Client --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </select>
          {errors.client_id && <p className="text-[11px] text-rose-400 mt-1">{errors.client_id}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Project Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. AI Analytics & Telemetry Dashboard"
            className={`input-field ${errors.title ? 'border-rose-500' : ''}`}
          />
          {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Project Scope & Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Overview of deliverables, technical stack, or client requirements..."
            className="input-field resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Budget ($ USD) *
            </label>
            <input
              type="number"
              name="budget"
              min="0"
              step="100"
              value={formData.budget}
              onChange={handleChange}
              placeholder="7500"
              className={`input-field ${errors.budget ? 'border-rose-500' : ''}`}
            />
            {errors.budget && <p className="text-[11px] text-rose-400 mt-1">{errors.budget}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
