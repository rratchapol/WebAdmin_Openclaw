import api from './api';
export const getUsers   = () => api('/users');
export const getUser    = (id) => api(`/users/${id}`);
export const createUser = (data) => api('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => api(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id) => api(`/users/${id}`, { method: 'DELETE' });
