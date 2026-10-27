import { supabase } from '../lib/supabase.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Allow test / demo mode if no token or mock token is provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      id: 'demo-user-123',
      email: 'alex.freelancer@example.com',
      role: 'authenticated',
      isDemo: true,
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  // If token is explicitly marked demo
  if (token === 'demo-token' || token === 'guest') {
    req.user = {
      id: 'demo-user-123',
      email: 'alex.freelancer@example.com',
      role: 'authenticated',
      isDemo: true,
    };
    return next();
  }

  // If Supabase client is initialized, verify with Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid or expired session token',
        });
      }
      req.user = data.user;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Authentication verification failed',
        message: err.message,
      });
    }
  }

  // Fallback for development when Supabase server key is omitted
  req.user = {
    id: 'user-verified-via-token',
    token,
    role: 'authenticated',
  };
  next();
};
