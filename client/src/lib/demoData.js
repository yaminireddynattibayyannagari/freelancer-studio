export const initialDemoClients = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    company: 'Apex SaaS Labs',
    email: 'sarah@apexlabs.io',
    phone: '+1 (415) 890-2341',
    website: 'https://apexlabs.io',
    status: 'Active',
    notes: 'Key decision maker for engineering tools. Prefers bi-weekly video sprint syncs.',
    total_spent: 18500,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'c2',
    name: 'Marcus Vance',
    company: 'Veloce Logistics',
    email: 'm.vance@velocelogistics.com',
    phone: '+1 (312) 441-9082',
    website: 'https://velocelogistics.com',
    status: 'Active',
    notes: 'Fast-growing fleet tech platform. Expanding their customer tracking portal.',
    total_spent: 24000,
    created_at: '2026-02-01T14:30:00Z',
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    company: 'Lumina Health AI',
    email: 'elena@luminahealth.ai',
    phone: '+44 20 7946 0912',
    website: 'https://luminahealth.ai',
    status: 'Lead',
    notes: 'Requested AI diagnostic report interface proposal. Budget approved for Q2.',
    total_spent: 0,
    created_at: '2026-03-10T09:15:00Z',
  },
  {
    id: 'c4',
    name: 'David Chen',
    company: 'Kuro Studio',
    email: 'david@kuro.design',
    phone: '+1 (206) 555-0188',
    website: 'https://kuro.design',
    status: 'Past',
    notes: 'Completed headless Shopify store redesign. May contract for maintenance in fall.',
    total_spent: 12500,
    created_at: '2025-11-20T11:00:00Z',
  },
];

export const initialDemoProjects = [
  {
    id: 'p1',
    client_id: 'c1',
    title: 'AI Analytics & Telemetry Dashboard',
    description: 'Real-time telemetry monitoring dashboard with Google Gemini insights and high-throughput charts.',
    budget: 9500,
    status: 'In Progress',
    start_date: '2026-03-01',
    deadline: '2026-04-15',
    progress_percentage: 65,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'p2',
    client_id: 'c2',
    title: 'Dispatch & Fleet Route Optimizer',
    description: 'Driver portal rewrite with offline map caching, automated dispatch triggers, and push notifications.',
    budget: 14000,
    status: 'In Progress',
    start_date: '2026-02-15',
    deadline: '2026-04-30',
    progress_percentage: 40,
    created_at: '2026-02-15T09:30:00Z',
  },
  {
    id: 'p3',
    client_id: 'c1',
    title: 'Enterprise Single Sign-On (SAML/Okta)',
    description: 'Implement enterprise SSO authentication flow with audit logs and tenant RBAC policies.',
    budget: 6000,
    status: 'Completed',
    start_date: '2026-01-20',
    deadline: '2026-02-28',
    progress_percentage: 100,
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'p4',
    client_id: 'c3',
    title: 'Patient Intake Portal & AI Triage Form',
    description: 'HIPAA-compliant dynamic medical intake questionnaire with Gemini natural language symptom summary.',
    budget: 16500,
    status: 'Planning',
    start_date: '2026-04-01',
    deadline: '2026-05-30',
    progress_percentage: 10,
    created_at: '2026-03-12T11:20:00Z',
  },
];

export const initialDemoMilestones = [
  {
    id: 'm1',
    project_id: 'p1',
    title: 'Architecture & Gemini API Integration Spike',
    description: 'Finalize schema, stream pipelines, and setup Gemini model prompt contracts.',
    due_date: '2026-03-10',
    amount: 3000,
    status: 'Completed',
  },
  {
    id: 'm2',
    project_id: 'p1',
    title: 'Real-time Charting & Webhook Listeners',
    description: 'Build interactive metrics charts, filter bars, and event bus handlers.',
    due_date: '2026-03-28',
    amount: 3500,
    status: 'Completed',
  },
  {
    id: 'm3',
    project_id: 'p1',
    title: 'Client Review, Staging Deploy & Load Testing',
    description: 'Execute QA test suite, staging deployment, and conduct client walk-through.',
    due_date: '2026-04-15',
    amount: 3000,
    status: 'In Progress',
  },
  {
    id: 'm4',
    project_id: 'p2',
    title: 'GPS Tracking Protocol & Socket Bridge',
    description: 'High-efficiency binary protocol parser for driver vehicle telemetry.',
    due_date: '2026-03-15',
    amount: 5000,
    status: 'Completed',
  },
  {
    id: 'm5',
    project_id: 'p2',
    title: 'Route Optimizer UI & Turn-by-Turn Map',
    description: 'Mapbox visual layer with multi-stop waypoint reordering algorithm.',
    due_date: '2026-04-05',
    amount: 5000,
    status: 'In Progress',
  },
  {
    id: 'm6',
    project_id: 'p2',
    title: 'Production Readiness & Fleet Driver QA',
    description: 'End-to-end beta deployment across 50 active courier vans.',
    due_date: '2026-04-30',
    amount: 4000,
    status: 'Pending',
  },
];

export const initialDemoProposals = [
  {
    id: 'pr1',
    client_id: 'c3',
    project_id: 'p4',
    title: 'Proposal: AI-Powered Patient Intake & Smart Triage Portal',
    status: 'Sent',
    estimated_amount: 16500,
    tone: 'Persuasive',
    generated_by_ai: true,
    sent_at: '2026-03-14T10:00:00Z',
    content: `# Project Proposal: AI-Powered Patient Intake & Smart Triage Portal

**Prepared For:** Elena Rostova (Lumina Health AI)  
**Prepared By:** Alex Rivera — Principal Full-Stack & AI Architect  
**Date:** March 14, 2026  
**Status:** Under Client Review  

---

## 1. Executive Summary
Lumina Health AI is pioneering intelligent patient experiences. This project provides an ultra-responsive, privacy-first intake portal combining intuitive multi-step dynamic forms with Google Gemini clinical summarization to reduce doctor intake documentation by up to 45%.

## 2. Architecture & Technical Strategy
- **Frontend:** React 19 + Tailwind CSS + accessible form validation schemas (Zod).
- **Backend:** Node.js Express microservice orchestrating Gemini 2.5 Flash token streaming.
- **Security:** End-to-end field-level encryption and strict PostgreSQL Row Level Security (RLS).

## 3. Phased Deliverables
- **Phase 1: Compliance & Architecture Spike:** HIPAA-compatible schema & session token security.
- **Phase 2: Intelligent Form Builder:** Dynamic condition branching & offline form persistence.
- **Phase 3: AI Clinical Summarizer:** Automated Gemini extraction into structured medical notes.
- **Phase 4: EHR Webhook Sync & Staging Review:** Integration tests and provider dashboard.

## 4. Investment Schedule
- Total Fixed Investment: **$16,500 USD**
- 40% Kickoff Deposit | 30% Milestone 2 Approval | 30% Final Production Sign-off.
`,
  },
];
