import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { getOrders, updateOrder, deleteOrder } from '../services/orders';
import { formatCurrency } from '../utils/helpers';

const getStatusColor = (status) => {
  const colors = {
    'pending': { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)' },
    'processing': { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-primary)' },
    'shipped': { bg: 'rgba(168, 85, 247, 0.1)', text: '#A855F7' },
    'delivered': { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--success)' },
    'cancelled': { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger)' },
  };
  return colors[status] || { bg: 'rgba(148, 163, 184, 0.1)', text: 'var(--text-secondary)' };
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ status: 'pending' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.orders || []);
      setError(null);
    } catch (err) {
      setError('Cannot fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (order) => {
    setEditingId(order._id);
    setFormData({ status: order.status });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateOrder(editingId, { status: formData.status });
      closeModal();
      fetchOrders();
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (err) {
      alert('Error deleting order: ' + err.message);
    }
  };

  const filtered = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in relative">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Orders</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View and update customer orders</p>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.5rem' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search by Order ID or Customer..." className="form-input" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className="btn btn-outline" onClick={fetchOrders}>{loading ? '...' : 'Refresh'}</button>
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td></tr>
            ) : filtered.map((o) => {
              const statusStyle = getStatusColor(o.status);
              return (
                <tr key={o._id}>
                  <td style={{ fontWeight: '600' }}>{o.orderNumber || o._id.substring(0,8)}</td>
                  <td>
                    <div>{o.user?.name || 'Guest User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{o.user?.email || 'N/A'}</div>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{formatCurrency(o.totalAmount)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600',
                      backgroundColor: statusStyle.bg, color: statusStyle.text, textTransform: 'uppercase'
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => openEditModal(o)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.5rem' }} title="Update Status"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(o._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }} title="Delete Order"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Update Order Status</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Order Status</label>
                <select className="form-input" value={formData.status} onChange={e => setFormData({ status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
