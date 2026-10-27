import { z } from 'zod';

export const generateProposalSchema = z.object({
  body: z.object({
    clientName: z.string().min(1, 'Client name is required'),
    clientCompany: z.string().optional().default(''),
    projectTitle: z.string().min(2, 'Project title is required'),
    projectDescription: z.string().min(10, 'Please provide more detail for the project description (minimum 10 chars)'),
    deliverables: z.union([z.string(), z.array(z.string())]).optional(),
    budget: z.union([z.number(), z.string()]).optional().default('Custom Quote'),
    timeline: z.string().optional().default('4-6 Weeks'),
    tone: z.enum(['Professional', 'Persuasive', 'Creative', 'Concise', 'Friendly', 'Formal']).default('Persuasive'),
    pricingModel: z.enum(['Fixed Price', 'Hourly Rate', 'Milestone-based', 'Value-based Retainer']).default('Milestone-based'),
    freelancerName: z.string().optional().default('Professional Freelancer'),
    freelancerTitle: z.string().optional().default('Senior Full-Stack Consultant'),
  }),
});

export const generateFollowUpSchema = z.object({
  body: z.object({
    clientName: z.string().min(1, 'Client name is required'),
    clientCompany: z.string().optional().default(''),
    projectTitle: z.string().min(2, 'Project title is required'),
    status: z.enum(['Proposal Sent', 'Contract Pending', 'Milestone Review', 'Payment Due', 'General Check-in']).default('Proposal Sent'),
    daysSinceLastContact: z.coerce.number().min(0).default(3),
    tone: z.enum(['Polite & Gentle', 'Confident & Direct', 'Value-Focused', 'Urgent / Deadline approaching']).default('Polite & Gentle'),
    specificNotes: z.string().optional().default(''),
    callToAction: z.string().optional().default('Quick 15-minute sync this week'),
  }),
});

export const generateMilestonesSchema = z.object({
  body: z.object({
    projectTitle: z.string().min(2, 'Project title is required'),
    description: z.string().min(10, 'Project description is required'),
    budget: z.coerce.number().optional().default(5000),
    timelineWeeks: z.coerce.number().optional().default(6),
    targetMilestonesCount: z.coerce.number().min(2).max(10).optional().default(4),
  }),
});
