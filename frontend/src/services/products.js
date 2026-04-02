import api from './api';
export const getProducts  = (params = '') => api(`/products?${params}`);
export const getProduct   = (id) => api(`/products/${id}`);
export const createProduct = (data) => api('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id, data) => api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id) => api(`/products/${id}`, { method: 'DELETE' });
