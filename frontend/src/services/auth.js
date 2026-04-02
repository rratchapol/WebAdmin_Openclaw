import api from './api';

export const login = (credentials) => api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const register = (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
