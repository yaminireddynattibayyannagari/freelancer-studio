import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let supabase = null;

if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('⚡ Supabase Admin Client initialized');
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase Admin Client:', err.message);
  }
}

export { supabase };
