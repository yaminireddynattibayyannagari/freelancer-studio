import { geminiClient } from '../lib/gemini.js';
import { env } from '../config/env.js';

/**
 * Generate a comprehensive, high-converting freelance project proposal
 */
export async function generateProjectProposal(data) {
  const {
    clientName,
    clientCompany,
    projectTitle,
    projectDescription,
    deliverables,
    budget,
    timeline,
    tone,
    pricingModel,
    freelancerName,
    freelancerTitle,
  } = data;

  const deliverablesText = Array.isArray(deliverables)
    ? deliverables.join('\n- ')
    : (deliverables || 'Full end-to-end delivery as specified');

  const prompt = `
You are an elite, highly sought-after freelance consultant and proposal strategist.
Write a comprehensive, compelling, high-converting client proposal for the following project:

Client Details:
- Contact Name: ${clientName}
- Company: ${clientCompany || 'Confidential / Client Organization'}

Project Overview:
- Project Title: ${projectTitle}
- Client Problem & Requirements: ${projectDescription}
- Stated Deliverables: 
- ${deliverablesText}
- Estimated Budget/Investment: ${typeof budget === 'number' ? `$${budget.toLocaleString()}` : budget}
- Target Timeline: ${timeline}
- Pricing Structure: ${pricingModel}
- Voice Tone: ${tone}

Freelancer Profile:
- Name: ${freelancerName}
- Role / Title: ${freelancerTitle}

Structure the proposal cleanly in professional Markdown format with these exact sections:
# Project Proposal: ${projectTitle}
**Prepared For:** ${clientName} (${clientCompany || 'Client Partner'})
**Prepared By:** ${freelancerName} — ${freelancerTitle}
**Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

---

## 1. Executive Summary & Understanding of Goals
Provide a sharp, empathetic summary of what the client aims to achieve and why this project is critical to their business outcomes.

## 2. The Challenge & Current State
Analyze the key bottlenecks, risks of inaction, and specific problem statements addressed by this engagement.

## 3. Proposed Solution & Architecture
Detail the strategic approach, technical stack/methodologies, and how this solution solves their core issues effectively.

## 4. Scope of Work & Deliverables
Break down concrete phases/milestones (Phase 1: Discovery & Architecture, Phase 2: Core Development, Phase 3: QA & Integration, Phase 4: Launch & Handover) with clear bulleted deliverables for each phase.

## 5. Timeline & Milestones
Outline an estimated schedule based on ${timeline}.

## 6. Investment & Commercial Terms
Explain the pricing (${typeof budget === 'number' ? `$${budget.toLocaleString()}` : budget}) under the ${pricingModel} model, including billing milestones (e.g., 40% upfront deposit, 30% mid-project, 30% completion).

## 7. Why Work With Me
A brief, confident section highlighting specialized expertise, communication cadence (weekly updates, Slack/async syncs), and dedication to high code quality and business impact.

## 8. Next Steps & Approval
Clear instructions for accepting this proposal and scheduling the kickoff session.
`;

  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
      });

      if (response && response.text) {
        return {
          content: response.text,
          modelUsed: env.GEMINI_MODEL,
          source: 'gemini-api',
        };
      }
    } catch (err) {
      console.error('Gemini API call failed, falling back to smart generator:', err.message);
    }
  }

  // High quality offline fallback generator if GEMINI_API_KEY is not set or network fails
  const fallbackProposal = `# Project Proposal: ${projectTitle}

**Prepared For:** ${clientName}${clientCompany ? ` (${clientCompany})` : ''}  
**Prepared By:** ${freelancerName} — ${freelancerTitle}  
**Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  
**Tone:** ${tone} | **Model:** ${pricingModel}

---

## 1. Executive Summary & Strategic Vision
Thank you for the opportunity to present this proposal for **${projectTitle}**. We understand that in today's fast-moving market, delivering high-performance, resilient, and intuitive solutions is paramount to achieving measurable business growth.

Our objective is to partner with **${clientName}** to execute a frictionless, end-to-end delivery that solves your core challenges, delights end-users, and delivers immediate ROI.

---

## 2. Project Understanding & Problem Statement
Based on our preliminary discovery:
> *${projectDescription}*

### Key Challenges Identified:
- **Scalability & Architecture:** Need for modern, maintainable foundations that support rapid iteration.
- **Delivery Velocity:** Ensuring high engineering velocity without sacrificing code reliability or test coverage.
- **Client & User Experience:** Delivering a polished, friction-free interface that reinforces brand credibility.

---

## 3. Proposed Solution & Implementation Methodology
We recommend a phased, iterative approach leveraging industry best practices:
- **Modern Technical Stack:** Built with high performance, accessibility, and security by design.
- **Modular Architecture:** Clean separation of concerns with type safety and comprehensive error handling.
- **Real-Time Visibility:** Weekly sprint demonstrations, asynchronous Loom updates, and transparent milestone tracking.

---

## 4. Scope of Work & Deliverables
${Array.isArray(deliverables) && deliverables.length > 0 
  ? deliverables.map((d, i) => `### Milestone ${i + 1}: ${d}\n- Complete implementation, documentation, and verification.\n- Automated test coverage and integration check.`).join('\n\n')
  : `### Phase 1: Architecture & Foundations (Week 1-2)
- Technical specification & design tokens
- Core database schema and authentication flows
- Base application shell and responsive layouts

### Phase 2: Feature Development & Integrations (Week 3-4)
- Core workflow implementation
- Third-party API integrations and data validation
- Error boundaries, loading states, and state management

### Phase 3: Testing, Refinement & Launch (Week 5-6)
- Comprehensive end-to-end testing
- Production deployment checklist & performance optimizations
- User handover documentation and kickoff review`
}

---

## 5. Timeline & Milestones
- **Estimated Completion Window:** **${timeline}**
- **Sprint Length:** 1–2 Week focused iterations
- **Regular Check-ins:** Bi-weekly 20-minute video standups & private status dashboard

---

## 6. Investment & Commercial Terms
- **Structure:** **${pricingModel}**
- **Total Estimated Investment:** **${typeof budget === 'number' ? `$${budget.toLocaleString()}` : budget}**
- **Milestone Payment Schedule:**
  - 40% initial deposit upon contract execution (Secures sprint kickoff)
  - 30% upon completion and approval of Phase 2 deliverables
  - 30% upon final acceptance and production deployment

---

## 7. Why Partner With ${freelancerName}
- **Proven Track Record:** Over 5+ years building and deploying scalable web applications.
- **Direct Senior Attention:** You deal directly with the senior engineer building your product—no account managers or junior handoffs.
- **Clear & Transparent Communication:** Prompt async updates, documented codebases, and zero surprise invoices.

---

## 8. Next Steps to Begin
1. **Approval:** Reply to confirm agreement with the scope and terms outlined above.
2. **Kickoff Call:** We will schedule a 30-minute discovery & kickoff alignment.
3. **Sprint 1 Launch:** Work begins within 3 business days of the initial deposit.
`;

  return {
    content: fallbackProposal,
    modelUsed: 'gemini-smart-fallback',
    source: 'smart-template-engine',
  };
}

/**
 * Generate a high-converting follow-up email
 */
export async function generateFollowUpEmail(data) {
  const {
    clientName,
    clientCompany,
    projectTitle,
    status,
    daysSinceLastContact,
    tone,
    specificNotes,
    callToAction,
  } = data;

  const prompt = `
You are an expert sales communication and client relationship strategist for high-end freelancers.
Write a professional, non-pushy, high-converting follow-up email to a client with the following details:

- Client Name: ${clientName}
- Company: ${clientCompany || 'Client Company'}
- Project / Context: ${projectTitle}
- Current State: ${status}
- Days Since Last Interaction: ${daysSinceLastContact} days
- Tone: ${tone}
- Additional Context / Notes: ${specificNotes || 'None provided'}
- Desired Next Action: ${callToAction}

Generate:
1. Two compelling email subject line options (one direct, one value/curiosity-driven).
2. The full email body, formatted ready to send (clean, polite, respectful of their time, offering value).
3. A brief 1-sentence tip on best timing to send this.
`;

  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
      });

      if (response && response.text) {
        return {
          content: response.text,
          modelUsed: env.GEMINI_MODEL,
          source: 'gemini-api',
        };
      }
    } catch (err) {
      console.error('Gemini follow-up generation failed, falling back:', err.message);
    }
  }

  // Fallback follow-up email
  const fallbackEmail = `### Subject Line Options:
- **Option 1 (Direct):** Quick check-in on the ${projectTitle} proposal — ${clientName}
- **Option 2 (Value-focused):** Ideas for ${projectTitle} + quick timeline alignment

---

Hi ${clientName},

I hope your week is off to a great start!

I wanted to briefly touch base regarding the proposal for **${projectTitle}** that we discussed ${daysSinceLastContact > 1 ? `about ${daysSinceLastContact} days ago` : 'recently'}.

I've been thinking through your goals${clientCompany ? ` for ${clientCompany}` : ''}, and I'm very excited about how this initiative will streamline your operations and deliver tangible results.

${specificNotes ? `Specifically regarding your note: "${specificNotes}" — I have already mapped out an approach to handle this smoothly without impacting our target deadline.\n\n` : ''}Do you have 10-15 minutes this Thursday or Friday for a quick sync to review any open questions, or should we plan to start with our standard onboarding next week?

Looking forward to collaborating,

Best regards,

**Freelance Engineering & Consulting Studio**  
*Direct: (555) 019-2834 | Portfolio & Case Studies Available*

---
💡 **Tip:** Follow-ups sent mid-morning on Tuesdays and Thursdays typically receive the highest response rates.
`;

  return {
    content: fallbackEmail,
    modelUsed: 'gemini-smart-fallback',
    source: 'smart-template-engine',
  };
}

/**
 * Generate structured project milestones with AI
 */
export async function generateProjectMilestones(data) {
  const { projectTitle, description, budget, timelineWeeks, targetMilestonesCount } = data;

  const prompt = `
You are a senior technical project manager.
Break down the following freelance project into ${targetMilestonesCount} sequential milestones:
- Project: ${projectTitle}
- Description: ${description}
- Total Budget: $${budget}
- Total Duration: ${timelineWeeks} weeks

Return ONLY a valid JSON array of objects. Do not include markdown code block ticks, just pure valid JSON.
Each object must have the following fields:
[
  {
    "title": "Short descriptive title",
    "description": "Specific deliverables and acceptance criteria (1-2 sentences)",
    "days_duration": 7,
    "amount": 1250,
    "status": "Pending"
  }
]
The sum of all "amount" fields must equal ${budget}.
`;

  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: env.GEMINI_MODEL,
        contents: prompt,
      });

      if (response && response.text) {
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        const parsed = JSON.parse(cleanText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            milestones: parsed,
            source: 'gemini-api',
          };
        }
      }
    } catch (err) {
      console.error('Gemini milestones generation failed, using fallback:', err.message);
    }
  }

  // Fallback milestones
  const count = targetMilestonesCount || 4;
  const chunkAmount = Math.round(budget / count);
  const chunkDays = Math.max(5, Math.round((timelineWeeks * 7) / count));

  const sampleTitles = [
    { title: 'Discovery, Architecture & Wireframing', desc: 'Requirements finalization, database design, API contracts, and UX review.' },
    { title: 'Core Feature Engineering & Database Sync', desc: 'Primary CRUD workflows, authentication policies, and core UI implementation.' },
    { title: 'Integrations, Business Logic & Polish', desc: 'AI service connectors, notification hooks, responsive styling, and QA testing.' },
    { title: 'User Testing, Deployment & Handover', desc: 'Production environment rollout, documentation, and client handover sign-off.' },
  ];

  const milestones = Array.from({ length: count }, (_, i) => {
    const meta = sampleTitles[i] || {
      title: `Milestone Phase ${i + 1}`,
      desc: `Execution of sprint phase ${i + 1} deliverables and acceptance tests.`,
    };
    return {
      title: meta.title,
      description: meta.desc,
      days_duration: chunkDays,
      amount: i === count - 1 ? budget - (chunkAmount * (count - 1)) : chunkAmount,
      status: 'Pending',
    };
  });

  return {
    milestones,
    source: 'smart-template-engine',
  };
}
