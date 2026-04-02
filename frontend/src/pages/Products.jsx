import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { getCategories } from '../services/categories';
import { getBrands } from '../services/brands';
import { formatCurrency } from '../utils/helpers';

const getStatusColor = (statusText) => {
  if (statusText === 'Active') return { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--success)' };
  if (statusText === 'Low Stock') return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)' };
  if (statusText === 'Out of Stock') return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger)' };
  return { bg: 'rgba(148, 163, 184, 0.1)', text: 'var(--text-secondary)' };
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', sku: '', category: '', brand: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // โหลดข้อมูลทั้ง 3 ส่วนมาพร้อมกัน
      const [prodRes, catRes, brandRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands()
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
      setBrands(brandRes.data.brands || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Cannot fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (product) => {
    if (!product.isActive) return 'Inactive';
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock < 20) return 'Low Stock';
    return 'Active';
  };

  // ─── CRUD Actions ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', stock: '', sku: '', category: '', brand: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      sku: product.sku || '',
      category: product.category?._id || product.category || '',
      brand: product.brand?._id || product.brand || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // กรองค่าว่างทิ้ง ถ้าไม่ได้เลือก ให้ลบ Key นั้นทิ้ง (Backend จะได้ไม่พัง)
    const payload = { ...formData };
    if (!payload.category) delete payload.category;
    if (!payload.brand) delete payload.brand;

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      closeModal();
      fetchData(); // Refresh list
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchData(); // Refresh list
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in relative">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Products</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your items, categories, and brands</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Tool Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline" onClick={fetchData}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Table */}
      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Icon</th>
              <th>Name & SKU</th>
              <th>Category/Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No products found. Start by adding one!</td></tr>
            ) : filteredProducts.map(product => {
              const status = getStatus(product);
              const statusStyle = getStatusColor(status);
              
              return (
                <tr key={product._id}>
                  <td>
                    <div style={{ 
                      width: '40px', height: '40px', backgroundColor: 'var(--bg-hover)', 
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      📦
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SKU: {product.sku || '-'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{product.category?.name || 'Uncategorized'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{product.brand?.name || 'No Brand'}</div>
                  </td>
                  <td style={{ fontWeight: '500' }}>{formatCurrency(product.price)}</td>
                  <td>
                    <span style={{ fontWeight: '600', color: product.stock === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600',
                      backgroundColor: statusStyle.bg, color: statusStyle.text
                    }}>
                      {status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => openEditModal(product)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.5rem' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Modal Form ──────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="e.g. Mechanical Keyboard"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">-- No Category --</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Brand</label>
                  <select 
                    className="form-input" 
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                  >
                    <option value="">-- No Brand --</option>
                    {brands.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (THB)</label>
                  <input 
                    type="number" className="form-input" required min="0" step="0.01"
                    placeholder="0.00"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Stock Qty</label>
                  <input 
                    type="number" className="form-input" required min="0"
                    placeholder="0"
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">SKU (Optional)</label>
                <input 
                  type="text" className="form-input"
                  placeholder="e.g. KB-001"
                  value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
