/**
 * Format number as Thai Baht currency
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);

/**
 * Format date to Thai locale
 */
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Truncate text
 */
export const truncate = (text, length = 50) =>
  text?.length > length ? text.substring(0, length) + '...' : text;

/**
 * Get token from localStorage
 */
export const getToken = () => localStorage.getItem('token');

/**
 * Set token in localStorage
 */
export const setToken = (token) => localStorage.setItem('token', token);

/**
 * Remove token from localStorage
 */
export const removeToken = () => localStorage.removeItem('token');
