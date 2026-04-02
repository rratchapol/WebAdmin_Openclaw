const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Base fetch helper with auth header
 */
const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

export default api;
