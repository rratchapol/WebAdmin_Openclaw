import api from './api';
export const getCategories   = () => api('/categories');
export const createCategory  = (data) => api('/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory  = (id, data) => api(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory  = (id) => api(`/categories/${id}`, { method: 'DELETE' });
