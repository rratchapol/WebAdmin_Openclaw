import { useState, useEffect } from 'react';
import { Search, Plus, Minus, AlertCircle, X, ClipboardList } from 'lucide-react';
import { getStocks, adjustStock } from '../services/stock';
import { getProducts } from '../services/products';

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [formData, setFormData] = useState({ quantity: 1, type: 'in', note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getStocks();
      setStocks(res.data.stocks || []);
      setError(null);
    } catch (err) {
      setError('Cannot fetch stock data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdjustModal = (productId = '') => {
    setSelectedProductId(productId);
    setFormData({ quantity: 1, type: 'in', note: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return alert('Please select a product');
    
    setIsSubmitting(true);
    try {
      await adjustStock(selectedProductId, formData);
      closeModal();
      fetchData(); // Refresh product stock level
    } catch (err) {
      alert('Error adjusting stock: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = stocks.filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in relative">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Stock Inventory</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and adjust current product stock</p>
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
          <input type="text" placeholder="Search by product name or SKU..." className="form-input" style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className="btn btn-outline" onClick={fetchData}>{loading ? '...' : 'Refresh'}</button>
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading stock inventory...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found.</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: '600' }}>{p.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{p.sku || '-'}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{p.category?.name || '-'}</td>
                <td style={{ fontWeight: 'bold', fontSize: '1.1rem', color: p.stock <= 10 ? 'var(--danger)' : 'var(--success)' }}>
                  {p.stock}
                </td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600',
                    backgroundColor: p.stock <= 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: p.stock <= 10 ? 'var(--danger)' : 'var(--success)'
                  }}>
                    {p.stock <= 10 ? 'LOW STOCK' : 'IN STOCK'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openAdjustModal(p._id)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                    <ClipboardList size={14} style={{ marginRight: '0.25rem' }} /> Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Adjust Stock</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Product</label>
                <input type="text" className="form-input" disabled value={stocks.find(s => s._id === selectedProductId)?.name || ''} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Adjustment Type</label>
                  <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="in">Add (+)</option>
                    <option value="out">Remove (-)</option>
                    <option value="adjust">Set Exact Amount (=)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-input" required min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Reason / Notes</label>
                <input type="text" className="form-input" placeholder="e.g. Restock from supplier, Damaged item" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
