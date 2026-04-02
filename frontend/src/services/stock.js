import api from './api';
export const getStocks   = () => api('/stocks');
export const adjustStock = (id, data) => api(`/stocks/${id}/adjust`, { method: 'PATCH', body: JSON.stringify(data) });
