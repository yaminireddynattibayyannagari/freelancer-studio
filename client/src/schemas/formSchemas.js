import { z } from 'zod';

export const clientFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional().default(''),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().default(''),
  website: z.string().url('Must be a valid URL (include https://)').optional().or(z.literal('')),
  status: z.enum(['Lead', 'Active', 'Past', 'Archived']),
  notes: z.string().optional().default(''),
});

export const projectFormSchema = z.object({
  client_id: z.string().min(1, 'Please select a client'),
  title: z.string().min(3, 'Project title must be at least 3 characters'),
  description: z.string().optional().default(''),
  budget: z.coerce.number().min(0, 'Budget must be zero or a positive amount'),
  status: z.enum(['Planning', 'In Progress', 'Review', 'Completed', 'On Hold']),
  start_date: z.string().optional().default(''),
  deadline: z.string().optional().default(''),
  progress_percentage: z.coerce.number().min(0).max(100).default(0),
});

export const milestoneFormSchema = z.object({
  title: z.string().min(2, 'Milestone title is required'),
  description: z.string().optional().default(''),
  due_date: z.string().optional().default(''),
  amount: z.coerce.number().min(0, 'Amount must be a positive number').default(0),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
});

export const aiProposalFormSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientCompany: z.string().optional().default(''),
  projectTitle: z.string().min(3, 'Project title is required'),
  projectDescription: z.string().min(15, 'Please provide at least 15 characters of project description or requirements'),
  deliverables: z.string().optional().default(''),
  budget: z.string().optional().default('$5,000 - $10,000'),
  timeline: z.string().optional().default('4 - 6 Weeks'),
  tone: z.enum(['Professional', 'Persuasive', 'Creative', 'Concise', 'Friendly', 'Formal']),
  pricingModel: z.enum(['Fixed Price', 'Hourly Rate', 'Milestone-based', 'Value-based Retainer']),
});

export const aiFollowUpFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientCompany: z.string().optional().default(''),
  projectTitle: z.string().min(2, 'Project title is required'),
  status: z.enum(['Proposal Sent', 'Contract Pending', 'Milestone Review', 'Payment Due', 'General Check-in']),
  daysSinceLastContact: z.coerce.number().min(0, 'Days cannot be negative'),
  tone: z.enum(['Polite & Gentle', 'Confident & Direct', 'Value-Focused', 'Urgent / Deadline approaching']),
  specificNotes: z.string().optional().default(''),
  callToAction: z.string().optional().default('Quick 15-minute sync this week'),
});
