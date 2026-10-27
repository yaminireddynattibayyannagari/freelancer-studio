import { Router } from 'express';
import { env } from '../config/env.js';
import { geminiClient } from '../lib/gemini.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Freelancer Tracker API',
    version: '1.0.0',
    integrations: {
      geminiAi: geminiClient ? 'connected' : 'fallback-mode',
      geminiModel: env.GEMINI_MODEL,
      supabase: supabase ? 'configured' : 'client-direct-mode',
    },
  });
});

export default router;
