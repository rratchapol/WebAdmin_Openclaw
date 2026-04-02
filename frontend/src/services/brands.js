import api from './api';
export const getBrands   = () => api('/brands');
export const createBrand = (data) => api('/brands', { method: 'POST', body: JSON.stringify(data) });
export const updateBrand = (id, data) => api(`/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBrand = (id) => api(`/brands/${id}`, { method: 'DELETE' });
