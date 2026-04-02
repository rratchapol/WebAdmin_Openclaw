import api from './api';
export const getOrders   = (params = '') => api(`/orders?${params}`);
export const getOrder    = (id) => api(`/orders/${id}`);
export const updateOrder = (id, data) => api(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteOrder = (id) => api(`/orders/${id}`, { method: 'DELETE' });
