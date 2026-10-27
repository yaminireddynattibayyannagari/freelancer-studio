import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { aiProposalFormSchema } from '../../schemas/formSchemas';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Copy,
  Check,
  Save,
  Loader2,
  FileText,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const AIProposalGenerator = ({ preselectedClient = null, preselectedProject = null, onSaved }) => {
  const { clients, projects, addProposal } = useData();
  const { user, session } = useAuth();

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientCompany: '',
    projectTitle: '',
    projectDescription: '',
    deliverables: '',
    budget: '$6,000 - $12,000',
    timeline: '4 - 6 Weeks',
    tone: 'Persuasive',
    pricingModel: 'Milestone-based',
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generationMeta, setGenerationMeta] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync preselected client or project
  useEffect(() => {
    if (preselectedClient) {
      setFormData((prev) => ({
        ...prev,
        clientId: preselectedClient.id,
        clientName: preselectedClient.name,
        clientCompany: preselectedClient.company || '',
      }));
    }
    if (preselectedProject) {
      setFormData((prev) => ({
        ...prev,
        projectTitle: preselectedProject.title,
        projectDescription: preselectedProject.description || '',
        budget: preselectedProject.budget ? `$${Number(preselectedProject.budget).toLocaleString()}` : prev.budget,
      }));
    }
  }, [preselectedClient, preselectedProject]);

  const handleClientSelect = (clientId) => {
    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        clientId: selected.id,
        clientName: selected.name,
        clientCompany: selected.company || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientCompany: '',
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaveSuccess(false);

    const validation = aiProposalFormSchema.safeParse({
      clientName: formData.clientName,
      clientCompany: formData.clientCompany,
      projectTitle: formData.projectTitle,
      projectDescription: formData.projectDescription,
      deliverables: formData.deliverables,
      budget: formData.budget,
      timeline: formData.timeline,
      tone: formData.tone,
      pricingModel: formData.pricingModel,
    });

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const response = await api.generateProposal(
        {
          ...validation.data,
          freelancerName: user?.user_metadata?.full_name || 'Senior Consultant',
          freelancerTitle: user?.user_metadata?.title || 'Principal Full-Stack Engineer',
        },
        session?.access_token
      );

      if (response?.data?.content) {
        setGeneratedContent(response.data.content);
        setGenerationMeta({
          model: response.data.modelUsed,
          source: response.data.source,
        });

        // Trigger celebratory confetti on generation
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setErrors({ form: err.message || 'AI proposal generation failed. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveProposal = async () => {
    if (!generatedContent) return;
    setIsSaving(true);
    try {
      const cleanBudget = Number(formData.budget.replace(/[^0-9.]/g, '')) || 0;
      await addProposal({
        client_id: formData.clientId || null,
        project_id: preselectedProject?.id || null,
        title: `Proposal: ${formData.projectTitle}`,
        content: generatedContent,
        status: 'Draft',
        tone: formData.tone,
        estimated_amount: cleanBudget,
        generated_by_ai: true,
      });
      setSaveSuccess(true);
      if (onSaved) onSaved();
    } catch (err) {
      alert('Could not save proposal: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Form */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Proposal Strategist
              </h3>
              <p className="text-xs text-slate-400">
                Powered by Google Gemini 2.5 Flash SDK
              </p>
            </div>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Client Picker */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Existing Client
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="input-field text-xs py-2"
              >
                <option value="">-- Choose Existing Client (or enter below) --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="e.g. Elena Rostova"
                  className={`input-field text-xs py-2 ${errors.clientName ? 'border-rose-500' : ''}`}
                />
                {errors.clientName && <p className="text-[10px] text-rose-400 mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleChange}
                  placeholder="e.g. Lumina Health AI"
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="e.g. Real-Time Telemetry Dashboard"
                className={`input-field text-xs py-2 ${errors.projectTitle ? 'border-rose-500' : ''}`}
              />
              {errors.projectTitle && <p className="text-[10px] text-rose-400 mt-1">{errors.projectTitle}</p>}
            </div>

            {/* Project Requirements & Context */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Scope & Client Problem *
              </label>
              <textarea
                name="projectDescription"
                rows={4}
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder="Describe what the client needs, the pain points they are experiencing, target outcomes, or notes from discovery calls..."
                className={`input-field text-xs py-2 resize-none ${errors.projectDescription ? 'border-rose-500' : ''}`}
              />
              {errors.projectDescription && (
                <p className="text-[10px] text-rose-400 mt-1">{errors.projectDescription}</p>
              )}
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Specific Deliverables (Optional)
              </label>
              <textarea
                name="deliverables"
                rows={2}
                value={formData.deliverables}
                onChange={handleChange}
                placeholder="e.g. Frontend React UI, REST API, Database Migration, Automated Tests"
                className="input-field text-xs py-2 resize-none"
              />
            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="$8,000"
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Timeline
                </label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="4-6 Weeks"
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            {/* Tone and Pricing Model */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Voice Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                >
                  <option value="Persuasive">Persuasive (High-Converting)</option>
                  <option value="Professional">Professional (Corporate)</option>
                  <option value="Creative">Creative & Bold</option>
                  <option value="Concise">Concise & Direct</option>
                  <option value="Friendly">Friendly & Partner-like</option>
                  <option value="Formal">Formal & Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pricing Model
                </label>
                <select
                  name="pricingModel"
                  value={formData.pricingModel}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                >
                  <option value="Milestone-based">Milestone-based</option>
                  <option value="Fixed Price">Fixed Price Contract</option>
                  <option value="Hourly Rate">Hourly Engagement</option>
                  <option value="Value-based Retainer">Value-based Retainer</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary py-2.5 mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Winning Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Proposal with Gemini</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Proposal Output & Actions */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Header with Actions */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">
                  Proposal Document Preview
                </h3>
                {generationMeta && (
                  <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-mono">
                    {generationMeta.model}
                  </span>
                )}
              </div>

              {generatedContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSaveProposal}
                    disabled={isSaving}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{saveSuccess ? 'Saved to DB!' : 'Save Proposal'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Document Content */}
            {isGenerating ? (
              <div className="py-24 text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 animate-pulse">
                  <Sparkles className="w-8 h-8 text-brand-400 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Synthesizing Proposal</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Gemini AI is structuring executive summary, technical architecture, milestone deliverables, and commercial terms...
                  </p>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono overflow-y-auto max-h-[550px] whitespace-pre-wrap leading-relaxed select-text">
                {generatedContent}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-slate-800 rounded-xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-white mb-1">
                  Ready to Generate Proposal
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Fill in the client and project parameters on the left and click "Generate Proposal with Gemini".
                </p>
              </div>
            )}
          </div>

          {generatedContent && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Ready to paste into Google Docs, Notion, or email.</span>
              {saveSuccess && (
                <span className="text-emerald-400 font-medium">
                  ✓ Recorded in Supabase Proposals table
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
