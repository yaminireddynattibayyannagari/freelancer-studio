import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Check if previously logged in via local demo session
      const savedDemoUser = localStorage.getItem('freelance_tracker_demo_user');
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setUser(parsed);
          setSession({ access_token: 'demo-token', user: parsed });
        } catch {
          // ignore corrupted localstorage
        }
      }
      setLoading(false);
    }
  }, []);

  const loginWithPassword = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured in .env. Use "Explore with Demo Account" or configure your Supabase URL & Key.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const registerWithPassword = async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured in .env. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to register live users.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 'demo-user-123',
      email: 'alex.freelancer@example.com',
      user_metadata: {
        full_name: 'Alex Rivera',
        business_name: 'Rivera Systems & AI Studio',
        title: 'Principal Full-Stack Engineer',
      },
      role: 'authenticated',
      isDemo: true,
    };
    localStorage.setItem('freelance_tracker_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setSession({ access_token: 'demo-token', user: demoUser });
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('freelance_tracker_demo_user');
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    isSupabaseConfigured,
    loginWithPassword,
    registerWithPassword,
    loginAsDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
