import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { aiFollowUpFormSchema } from '../../schemas/formSchemas';
import {
  MailCheck,
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export const AIFollowUpGenerator = () => {
  const { clients, projects } = useData();
  const { session } = useAuth();

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: clients[0]?.name || '',
    clientCompany: clients[0]?.company || '',
    projectTitle: projects[0]?.title || 'Web & AI Platform Engineering',
    status: 'Proposal Sent',
    daysSinceLastContact: 3,
    tone: 'Polite & Gentle',
    specificNotes: '',
    callToAction: 'Quick 15-minute sync this week to answer questions',
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleClientSelect = (clientId) => {
    const c = clients.find((client) => client.id === clientId);
    if (c) {
      const clientProject = projects.find((p) => p.client_id === c.id);
      setFormData((prev) => ({
        ...prev,
        clientId: c.id,
        clientName: c.name,
        clientCompany: c.company || '',
        projectTitle: clientProject ? clientProject.title : prev.projectTitle,
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

    const validation = aiFollowUpFormSchema.safeParse({
      clientName: formData.clientName,
      clientCompany: formData.clientCompany,
      projectTitle: formData.projectTitle,
      status: formData.status,
      daysSinceLastContact: Number(formData.daysSinceLastContact),
      tone: formData.tone,
      specificNotes: formData.specificNotes,
      callToAction: formData.callToAction,
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
    setGeneratedEmail('');

    try {
      const response = await api.generateFollowUp(validation.data, session?.access_token);
      if (response?.data?.content) {
        setGeneratedEmail(response.data.content);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Follow-up generation failed.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Form */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MailCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Follow-up Studio
              </h3>
              <p className="text-xs text-slate-400">
                Craft respectful, high-converting follow-up emails
              </p>
            </div>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Client
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="input-field text-xs py-2"
              >
                <option value="">-- Choose Client --</option>
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
                  placeholder="Sarah Jenkins"
                  className={`input-field text-xs py-2 ${errors.clientName ? 'border-rose-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleChange}
                  placeholder="Apex SaaS Labs"
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Subject *
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="AI Analytics Dashboard"
                className={`input-field text-xs py-2 ${errors.projectTitle ? 'border-rose-500' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Pipeline Stage
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                >
                  <option value="Proposal Sent">Proposal Sent (Awaiting feedback)</option>
                  <option value="Contract Pending">Contract / SOW Pending Signature</option>
                  <option value="Milestone Review">Milestone Review & Approval</option>
                  <option value="Payment Due">Invoice / Payment Due</option>
                  <option value="General Check-in">General Check-in / Reconnect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Days Since Contact
                </label>
                <input
                  type="number"
                  name="daysSinceLastContact"
                  min="0"
                  value={formData.daysSinceLastContact}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tone of Voice
              </label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="input-field text-xs py-2"
              >
                <option value="Polite & Gentle">Polite & Gentle (Low pressure)</option>
                <option value="Confident & Direct">Confident & Direct</option>
                <option value="Value-Focused">Value-Focused (Share quick idea/insight)</option>
                <option value="Urgent / Deadline approaching">Urgent / Target sprint date</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Specific Context Notes (Optional)
              </label>
              <textarea
                name="specificNotes"
                rows={2}
                value={formData.specificNotes}
                onChange={handleChange}
                placeholder="e.g. They mentioned waiting on their CTO review last Monday"
                className="input-field text-xs py-2 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Desired Call to Action
              </label>
              <input
                type="text"
                name="callToAction"
                value={formData.callToAction}
                onChange={handleChange}
                placeholder="Quick 15-minute sync this week"
                className="input-field text-xs py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary py-2.5 mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Follow-up Email...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Follow-up with Gemini</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Output Preview */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MailCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  Email Copy & Subject Line Options
                </h3>
              </div>

              {generatedEmail && (
                <button
                  onClick={handleCopy}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {isGenerating ? (
              <div className="py-24 text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                  <MailCheck className="w-8 h-8 text-emerald-400 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Drafting Communication</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Calibrating tone, response incentive, and concise subject options...
                  </p>
                </div>
              </div>
            ) : generatedEmail ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono overflow-y-auto max-h-[550px] whitespace-pre-wrap leading-relaxed select-text">
                {generatedEmail}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-slate-800 rounded-xl">
                <MailCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-white mb-1">
                  Ready to Draft Follow-up
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a client and pipeline stage on the left, then click "Generate Follow-up with Gemini".
                </p>
              </div>
            )}
          </div>

          {generatedEmail && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Includes subject line variations and etiquette timing tip.</span>
              <span className="text-slate-400">Powered by Gemini 2.5 Flash</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
