# Freelance Client & Project Tracker with AI Proposal Writer

A production-grade, full-stack application built for independent software engineers, consultants, and freelance studios. Manage client relationships, track projects and granular milestone deliverables, and generate high-converting proposals and follow-up emails using **Google Gemini 2.5 Flash** (`@google/genai` SDK) and **Supabase PostgreSQL & Auth** with Row Level Security (RLS).

---

## 🏗️ Architecture & Technology Stack

- **Frontend (`/client`):**
  - **Framework:** React 18 + Vite
  - **Styling:** Tailwind CSS + PostCSS + Autoprefixer
  - **Icons:** Lucide React
  - **Database & Auth Client:** `@supabase/supabase-js` (with automatic fallback to interactive sandbox mode when credentials are not yet entered)
  - **Form Validation:** Zod schemas
  - **Micro-interactions:** Canvas confetti, glassmorphism design tokens

- **Backend (`/server`):**
  - **Runtime & Framework:** Node.js + Express.js (ES Modules)
  - **AI SDK:** `@google/genai` (Official modern Google GenAI SDK)
  - **Validation:** Zod request body & query validator middleware
  - **Security:** Helmet, CORS, Supabase JWT verification middleware
  - **Model:** `gemini-2.5-flash`

- **Database (`/supabase`):**
  - **Engine:** Supabase PostgreSQL
  - **Migration File:** `/supabase/migrations/001_initial_schema.sql`
  - **Tables:** `profiles`, `clients`, `projects`, `milestones`, `proposals`
  - **Security:** Strict Row Level Security (RLS) policies guaranteeing tenant isolation
  - **Automated Triggers:**
    - Profile auto-provisioning upon user signup (`handle_new_user`)
    - Dynamic project progress recalculation upon milestone changes (`recalculate_project_progress`)
    - `updated_at` automated timestamp updater

---

## 🚀 Quick Start Guide

### 1. Start the Backend Express Server
```bash
cd server
npm install
npm run dev
```
The backend starts on `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`
- AI Proposal endpoint: `POST http://localhost:5000/api/ai/proposal`
- AI Follow-up endpoint: `POST http://localhost:5000/api/ai/follow-up`
- AI Milestones endpoint: `POST http://localhost:5000/api/ai/milestones`

### 2. Start the Frontend React App
```bash
cd client
npm install
npm run dev
```
The client starts on `http://localhost:5173`

---

## 🔐 Supabase Configuration & Database Migration

1. In your [Supabase Dashboard](https://supabase.com), open the **SQL Editor**.
2. Open and run the migration script:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy your project URL and `anon` key from **Project Settings -> API**.
4. Configure in `client/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:5000
   ```

*Note: The app is equipped with an **Interactive Sandbox Demo Mode**, so you can immediately explore and test all CRM, Project Milestone, and AI features before entering Supabase credentials!*

---

## 🤖 Google Gemini AI Configuration

1. Get a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
2. Add your key to `server/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. The server securely handles all AI requests without exposing your API key to the client browser.
