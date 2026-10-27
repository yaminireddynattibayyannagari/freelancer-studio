const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Helper to execute backend API calls with auth token
 */
async function apiRequest(endpoint, options = {}, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  checkHealth: () => apiRequest('/api/health'),

  generateProposal: (data, token) =>
    apiRequest(
      '/api/ai/proposal',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    ),

  generateFollowUp: (data, token) =>
    apiRequest(
      '/api/ai/follow-up',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    ),

  generateMilestones: (data, token) =>
    apiRequest(
      '/api/ai/milestones',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    ),
};
