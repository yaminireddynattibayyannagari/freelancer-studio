import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import {
  initialDemoClients,
  initialDemoProjects,
  initialDemoMilestones,
  initialDemoProposals,
} from '../lib/demoData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data based on Auth & Supabase configuration
  const fetchData = async () => {
    if (!user) {
      setClients([]);
      setProjects([]);
      setMilestones([]);
      setProposals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase && !user.isDemo) {
      try {
        const [cRes, pRes, mRes, prRes] = await Promise.all([
          supabase.from('clients').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('milestones').select('*').order('order_index', { ascending: true }),
          supabase.from('proposals').select('*').order('created_at', { ascending: false }),
        ]);

        if (cRes.error) throw cRes.error;
        if (pRes.error) throw pRes.error;
        if (mRes.error) throw mRes.error;
        if (prRes.error) throw prRes.error;

        setClients(cRes.data || []);
        setProjects(pRes.data || []);
        setMilestones(mRes.data || []);
        setProposals(prRes.data || []);
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Demo / Local storage mode
      try {
        const storedClients = localStorage.getItem('freelance_clients');
        const storedProjects = localStorage.getItem('freelance_projects');
        const storedMilestones = localStorage.getItem('freelance_milestones');
        const storedProposals = localStorage.getItem('freelance_proposals');

        setClients(storedClients ? JSON.parse(storedClients) : initialDemoClients);
        setProjects(storedProjects ? JSON.parse(storedProjects) : initialDemoProjects);
        setMilestones(storedMilestones ? JSON.parse(storedMilestones) : initialDemoMilestones);
        setProposals(storedProposals ? JSON.parse(storedProposals) : initialDemoProposals);
      } catch (e) {
        console.warn('Could not read demo storage, resetting to defaults:', e);
        setClients(initialDemoClients);
        setProjects(initialDemoProjects);
        setMilestones(initialDemoMilestones);
        setProposals(initialDemoProposals);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Sync to localStorage in demo mode
  useEffect(() => {
    if (!isSupabaseConfigured || user?.isDemo) {
      if (clients.length > 0) localStorage.setItem('freelance_clients', JSON.stringify(clients));
      if (projects.length > 0) localStorage.setItem('freelance_projects', JSON.stringify(projects));
      if (milestones.length > 0) localStorage.setItem('freelance_milestones', JSON.stringify(milestones));
      if (proposals.length > 0) localStorage.setItem('freelance_proposals', JSON.stringify(proposals));
    }
  }, [clients, projects, milestones, proposals, user]);

  // --------------------------------------------------------------------------
  // CLIENTS CRUD
  // --------------------------------------------------------------------------
  const addClient = async (clientData) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setClients((prev) => [data, ...prev]);
      return data;
    } else {
      const newClient = {
        ...clientData,
        id: `client_${Date.now()}`,
        user_id: user?.id || 'demo-user-123',
        total_spent: 0,
        created_at: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    }
  };

  const updateClient = async (id, updates) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setClients((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } else {
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
      );
    }
  };

  const deleteClient = async (id) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
    setProjects((prev) => prev.filter((p) => p.client_id !== id));
  };

  // --------------------------------------------------------------------------
  // PROJECTS CRUD
  // --------------------------------------------------------------------------
  const addProject = async (projectData) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setProjects((prev) => [data, ...prev]);
      return data;
    } else {
      const newProject = {
        ...projectData,
        id: `proj_${Date.now()}`,
        user_id: user?.id || 'demo-user-123',
        progress_percentage: projectData.progress_percentage || 0,
        created_at: new Date().toISOString(),
      };
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    }
  };

  const updateProject = async (id, updates) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
      return data;
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
      );
    }
  };

  const deleteProject = async (id) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setMilestones((prev) => prev.filter((m) => m.project_id !== id));
  };

  // --------------------------------------------------------------------------
  // MILESTONES CRUD & PROGRESS SYNC
  // --------------------------------------------------------------------------
  const recalculateProgressForProject = (projectId, updatedMilestones) => {
    const projMilestones = updatedMilestones.filter((m) => m.project_id === projectId);
    if (projMilestones.length === 0) return 0;
    const completed = projMilestones.filter((m) => m.status === 'Completed').length;
    return Math.round((completed / projMilestones.length) * 100);
  };

  const addMilestone = async (milestoneData) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('milestones')
        .insert([{ ...milestoneData, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setMilestones((prev) => [...prev, data]);
      // Supabase trigger automatically recalculates project progress!
      fetchData();
      return data;
    } else {
      const newMilestone = {
        ...milestoneData,
        id: `milestone_${Date.now()}`,
        user_id: user?.id || 'demo-user-123',
        status: milestoneData.status || 'Pending',
        created_at: new Date().toISOString(),
      };
      setMilestones((prev) => {
        const nextList = [...prev, newMilestone];
        const newProgress = recalculateProgressForProject(milestoneData.project_id, nextList);
        setProjects((pList) =>
          pList.map((p) => (p.id === milestoneData.project_id ? { ...p, progress_percentage: newProgress } : p))
        );
        return nextList;
      });
      return newMilestone;
    }
  };

  const updateMilestone = async (id, updates) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setMilestones((prev) => prev.map((m) => (m.id === id ? data : m)));
      fetchData();
      return data;
    } else {
      setMilestones((prev) => {
        const nextList = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
        const target = nextList.find((m) => m.id === id);
        if (target) {
          const newProgress = recalculateProgressForProject(target.project_id, nextList);
          setProjects((pList) =>
            pList.map((p) => (p.id === target.project_id ? { ...p, progress_percentage: newProgress } : p))
          );
        }
        return nextList;
      });
    }
  };

  const deleteMilestone = async (id) => {
    const target = milestones.find((m) => m.id === id);
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { error } = await supabase.from('milestones').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } else {
      setMilestones((prev) => {
        const nextList = prev.filter((m) => m.id !== id);
        if (target) {
          const newProgress = recalculateProgressForProject(target.project_id, nextList);
          setProjects((pList) =>
            pList.map((p) => (p.id === target.project_id ? { ...p, progress_percentage: newProgress } : p))
          );
        }
        return nextList;
      });
    }
  };

  // --------------------------------------------------------------------------
  // PROPOSALS CRUD
  // --------------------------------------------------------------------------
  const addProposal = async (proposalData) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('proposals')
        .insert([{ ...proposalData, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      setProposals((prev) => [data, ...prev]);
      return data;
    } else {
      const newProposal = {
        ...proposalData,
        id: `prop_${Date.now()}`,
        user_id: user?.id || 'demo-user-123',
        status: proposalData.status || 'Draft',
        created_at: new Date().toISOString(),
      };
      setProposals((prev) => [newProposal, ...prev]);
      return newProposal;
    }
  };

  const updateProposal = async (id, updates) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { data, error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setProposals((prev) => prev.map((pr) => (pr.id === id ? data : pr)));
      return data;
    } else {
      setProposals((prev) =>
        prev.map((pr) => (pr.id === id ? { ...pr, ...updates, updated_at: new Date().toISOString() } : pr))
      );
    }
  };

  const deleteProposal = async (id) => {
    if (isSupabaseConfigured && supabase && !user?.isDemo) {
      const { error } = await supabase.from('proposals').delete().eq('id', id);
      if (error) throw error;
    }
    setProposals((prev) => prev.filter((pr) => pr.id !== id));
  };

  // --------------------------------------------------------------------------
  // METRICS & COMPUTED ANALYTICS
  // --------------------------------------------------------------------------
  const metrics = useMemo(() => {
    const totalPipelineRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning');
    const completedProjects = projects.filter((p) => p.status === 'Completed');
    const completedRevenue = completedProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const pendingProposals = proposals.filter((pr) => pr.status === 'Draft' || pr.status === 'Sent');

    const upcomingDeadlines = projects
      .filter((p) => p.deadline && p.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);

    return {
      totalPipelineRevenue,
      completedRevenue,
      activeProjectsCount: activeProjects.length,
      completedProjectsCount: completedProjects.length,
      pendingProposalsCount: pendingProposals.length,
      totalClientsCount: clients.length,
      upcomingDeadlines,
    };
  }, [projects, proposals, clients]);

  const value = {
    clients,
    projects,
    milestones,
    proposals,
    metrics,
    loading,
    error,
    refreshData: fetchData,
    addClient,
    updateClient,
    deleteClient,
    addProject,
    updateProject,
    deleteProject,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addProposal,
    updateProposal,
    deleteProposal,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
