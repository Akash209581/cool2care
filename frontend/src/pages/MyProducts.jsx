import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        navigate('/seller/login');
        return;
      }

      const res = await axios.get('/api/seller/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/seller/login');
      } else {
        toast.error('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleteLoading(productId);
      const token = localStorage.getItem('sellerToken');
      await axios.delete(`/api/seller/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('sellerToken');
      const res = await axios.patch(`/api/seller/products/${productId}/status`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProducts(products.map(product => 
        product._id === productId 
          ? { ...product, isActive: res.data.isActive }
          : product
      ));
      
      toast.success(`Product ${res.data.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error('Failed to update product status');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            📦 My Products
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Manage your product listings
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/seller/dashboard')} 
            className="btn btn-outline"
          >
            ← Back to Dashboard
          </button>
          <Link to="/seller/products/add" className="btn btn-primary">
            ➕ Add New Product
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>No Products Yet</h3>
          <p style={{ marginBottom: '2rem', color: 'var(--gray-500)' }}>
            Start selling by adding your first product to the marketplace.
          </p>
          <Link to="/seller/products/add" className="btn btn-primary">
            ➕ Add Your First Product
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => (
            <div key={product._id} className="card">
              {/* Product Image */}
              <div style={{ 
                height: '200px', 
                backgroundColor: 'var(--gray-100)', 
                borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '3rem', color: 'var(--gray-400)' }}>📷</div>
                )}
                
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: product.isActive ? 'var(--success-color)' : 'var(--gray-500)',
                  color: 'white'
                }}>
                  {product.isActive ? '✅ Active' : '⏸️ Inactive'}
                </div>
              </div>

              {/* Product Info */}
              <div className="card-body">
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.name}</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--gray-100)',
                    color: 'var(--gray-600)'
                  }}>
                    {product.category}
                  </span>
                </div>

                <p style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--gray-600)', 
                  fontSize: '0.9rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>

                {/* Product Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--gray-600)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {product.stock || 0}
                    </div>
                    <div>Stock</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {product.sold || 0}
                    </div>
                    <div>Sold</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {product.rating?.average?.toFixed(1) || '0.0'}
                    </div>
                    <div>Rating</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link 
                    to={`/seller/products/edit/${product._id}`}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  >
                    ✏️ Edit
                  </Link>
                  
                  <button
                    onClick={() => toggleProductStatus(product._id, product.isActive)}
                    className={`btn ${product.isActive ? 'btn-warning' : 'btn-success'}`}
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  >
                    {product.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={deleteLoading === product._id}
                    className="btn btn-danger"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {deleteLoading === product._id ? '...' : '🗑️'}
                  </button>
                </div>

                {/* Quick Actions */}
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <Link 
                    to={`/electronics/${product._id}`}
                    target="_blank"
                    style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                  >
                    👁️ View in Store →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>📊 Products Summary</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                  {products.length}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Total Products</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--success-color)' }}>
                  {products.filter(p => p.isActive).length}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Active Products</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--info-color)' }}>
                  {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Total Stock</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--warning-color)' }}>
                  {products.reduce((sum, p) => sum + (p.sold || 0), 0)}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Total Sold</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;