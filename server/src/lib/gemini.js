import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

let geminiClient = null;

if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '' && env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    console.log(`🤖 Google Gemini SDK initialized with model: ${env.GEMINI_MODEL}`);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Google GenAI SDK:', err.message);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY not configured or using placeholder. Running with AI Smart-Generation fallback mode.');
}

export { geminiClient };
