import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const MyProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    totalViews: 0,
    totalSales: 0,
  });
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (!user?.isSeller) {
      toast.error('You need to be a seller to access this page');
      navigate('/become-seller');
      return;
    }
    
    fetchMyProducts();
    calculateStats();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('/api/electronics/seller/my-products');
      setProducts(res.data.products || []);
    } catch (error) {
      toast.error('Failed to fetch your products');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (products.length === 0) return;
    
    const stats = {
      totalProducts: products.length,
      activeListings: products.filter(p => p.isActive).length,
      totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
      totalSales: user?.sellerProfile?.totalSales || 0,
    };
    
    setStats(stats);
  };

  useEffect(() => {
    calculateStats();
  }, [products]);

  const handleDeleteProduct = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/api/electronics/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await axios.put(`/api/electronics/${productId}`, {
        isActive: !currentStatus
      });
      
      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: !currentStatus } : p
      ));
      
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = products;

    // Apply filters
    switch (filter) {
      case 'active':
        filtered = products.filter(p => p.isActive);
        break;
      case 'inactive':
        filtered = products.filter(p => !p.isActive);
        break;
      case 'out-of-stock':
        filtered = products.filter(p => p.quantity === 0);
        break;
      default:
        filtered = products;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const ProductCard = ({ product }) => {
    const isOutOfStock = product.quantity === 0;
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    return (
      <div className={`card ${!product.isActive ? 'opacity-60' : ''}`} style={{ position: 'relative' }}>
        {!product.isActive && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'var(--error-color)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.75rem',
            fontWeight: '600',
            zIndex: 1
          }}>
            INACTIVE
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {product.images?.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius-md) var(--border-radius-md) 0 0'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '200px',
              background: 'var(--gray-100)',
              borderRadius: 'var(--border-radius-md) var(--border-radius-md) 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: 'var(--gray-400)'
            }}>
              📱
            </div>
          )}

          {isOutOfStock && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              OUT OF STOCK
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ 
            marginBottom: '0.5rem', 
            fontSize: '1.125rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.title}
          </h4>

          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
            {product.brand} • {product.condition.replace('-', ' ')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
              ${product.price}
            </span>
            {hasDiscount && (
              <span style={{ 
                fontSize: '1rem', 
                color: 'var(--gray-500)', 
                textDecoration: 'line-through' 
              }}>
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              <div>📦 Qty: {product.quantity}</div>
              <div>👁️ Views: {product.views || 0}</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  style={{ 
                    color: i < Math.floor(product.ratings?.average || 0) ? 'var(--accent-color)' : 'var(--gray-300)',
                    fontSize: '0.875rem'
                  }}
                >
                  ★
                </span>
              ))}
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginLeft: '0.25rem' }}>
                ({product.ratings?.count || 0})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Link
              to={`/electronics/${product._id}`}
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
            >
              👁️ View
            </Link>
            
            <Link
              to={`/sell/edit/${product._id}`}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              ✏️ Edit
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleToggleActive(product._id, product.isActive)}
              className={`btn btn-sm ${product.isActive ? 'btn-outline' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              {product.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
            </button>
            
            <button
              onClick={() => handleDeleteProduct(product._id, product.title)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          📊 Seller Dashboard
        </h1>
        <p style={{ color: 'var(--gray-600)', margin: 0 }}>
          Manage your electronics listings and track performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              {stats.totalProducts}
            </div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Total Products</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success-color)', marginBottom: '0.5rem' }}>
              {stats.activeListings}
            </div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Active Listings</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--info-color)', marginBottom: '0.5rem' }}>
              {stats.totalViews}
            </div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Total Views</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
              ${stats.totalSales}
            </div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Total Sales</div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/sell" className="btn btn-primary">
          ➕ Add New Product
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-control form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="views">Most Viewed</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📦</div>
          <h3 style={{ marginBottom: '1rem' }}>
            {products.length === 0 ? 'No products yet' : 'No products match your filters'}
          </h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            {products.length === 0 
              ? 'Start selling by creating your first product listing'
              : 'Try adjusting your filters to see more products'
            }
          </p>
          {products.length === 0 ? (
            <Link to="/sell" className="btn btn-primary btn-lg">
              🚀 Create First Listing
            </Link>
          ) : (
            <button onClick={() => setFilter('all')} className="btn btn-outline">
              Show All Products
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
            Showing {filteredProducts.length} of {products.length} products
          </div>
          
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Seller Tips */}
      {products.length > 0 && (
        <div className="card" style={{ marginTop: '3rem' }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>💡 Seller Tips</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem' }}>📈 Improve Your Sales</h4>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                  <li>Add high-quality photos from multiple angles</li>
                  <li>Write detailed, honest descriptions</li>
                  <li>Price competitively by checking similar listings</li>
                  <li>Respond quickly to buyer inquiries</li>
                  <li>Keep your listings active and up-to-date</li>
                </ul>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem' }}>🎯 Best Practices</h4>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                  <li>Ship items quickly and provide tracking</li>
                  <li>Package items securely to prevent damage</li>
                  <li>Be transparent about item condition</li>
                  <li>Build trust with prompt communication</li>
                  <li>Encourage buyers to leave reviews</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
