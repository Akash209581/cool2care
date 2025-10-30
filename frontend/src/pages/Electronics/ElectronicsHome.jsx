import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ElectronicsHome = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { addToCart } = useCart();
  
  // Search and filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });
  
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });

  const productCategories = [
    { value: 'smartphones', label: '📱 Smartphones', icon: '📱' },
    { value: 'laptops', label: '💻 Laptops', icon: '💻' },
    { value: 'tablets', label: '📟 Tablets', icon: '📟' },
    { value: 'gaming', label: '🎮 Gaming', icon: '🎮' },
    { value: 'audio', label: '🎧 Audio', icon: '🎧' },
    { value: 'cameras', label: '📷 Cameras', icon: '📷' },
    { value: 'home-appliances', label: '🏠 Home Appliances', icon: '🏠' },
    { value: 'smart-home', label: '🏡 Smart Home', icon: '🏡' },
    { value: 'accessories', label: '🔌 Accessories', icon: '🔌' },
  ];

  const conditionTypes = [
    { value: 'new', label: 'New', color: 'var(--success-color)' },
    { value: 'like-new', label: 'Like New', color: 'var(--info-color)' },
    { value: 'good', label: 'Good', color: 'var(--warning-color)' },
    { value: 'fair', label: 'Fair', color: 'var(--gray-500)' },
    { value: 'poor', label: 'Poor', color: 'var(--error-color)' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (pagination.currentPage > 1) params.set('page', pagination.currentPage);
    
    setSearchParams(params);
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const res = await axios.get(`/api/electronics?${params.toString()}`);
      setProducts(res.data.products);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalProducts: res.data.totalProducts,
        hasNext: res.data.hasNext,
        hasPrev: res.data.hasPrev,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/electronics/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const ProductCard = ({ product }) => {
    const condition = conditionTypes.find(c => c.value === product.condition);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    return (
      <div className="product-card">
        <Link to={`/electronics/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ position: 'relative' }}>
            {product.images?.length > 0 ? (
              <img 
                src={product.images[0].url} 
                alt={product.title}
                className="product-image"
                style={{ transition: 'transform var(--transition-normal)' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            ) : (
              <div className="product-image" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'var(--gray-100)',
                color: 'var(--gray-400)',
                fontSize: '3rem'
              }}>
                📱
              </div>
            )}
            
            {/* Condition Badge */}
            <span 
              className={`product-condition condition-${product.condition.replace('-', '')}`}
              style={{ 
                position: 'absolute', 
                top: '0.5rem', 
                right: '0.5rem',
                background: condition?.color || 'var(--gray-500)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}
            >
              {condition?.label || product.condition}
            </span>

            {/* Discount Badge */}
            {hasDiscount && (
              <span style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                background: 'var(--error-color)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
        </Link>

        <div className="product-info">
          <Link to={`/electronics/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h4 className="product-title" style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '0.5rem'
            }}>
              {product.title}
            </h4>
          </Link>

          <div style={{ marginBottom: '0.75rem' }}>
            <div className="product-price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Rating Stars */}
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={i < Math.floor(product.ratings?.average || 0) ? 'star' : 'star-empty'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                ({product.ratings?.count || 0})
              </span>
            </div>

            <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              {product.views || 0} views
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              <div>{product.brand} • {product.model}</div>
              <div>{product.location?.city || 'Location not specified'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => handleAddToCart(product)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              🛒 Add to Cart
            </button>
            <Link 
              to={`/electronics/${product._id}`}
              className="btn btn-outline btn-sm"
            >
              👁️ View
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          📱 Electronics Marketplace
        </h1>
        <p style={{ color: 'var(--gray-600)', margin: 0 }}>
          Buy and sell new & used electronics with confidence
        </p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search electronics by name, brand, model..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-control form-select"
            >
              <option value="">All Categories</option>
              {productCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Condition</label>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="form-control form-select"
            >
              <option value="">Any Condition</option>
              {conditionTypes.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Price Range</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="form-control"
                style={{ width: '50%' }}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="form-control"
                style={{ width: '50%' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="form-control form-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {Object.values(filters).some(value => value !== '' && value !== 'newest') && (
              <button onClick={clearFilters} className="btn btn-outline btn-sm">
                🗑️ Clear Filters
              </button>
            )}
          </div>
          
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            {pagination.totalProducts} product(s) found
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '1rem' }}>
          <div className="loading" style={{ width: '40px', height: '40px' }}></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📱</div>
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or check back later for new listings.</p>
          <button onClick={clearFilters} className="btn btn-primary">
            View All Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="btn btn-outline"
              >
                ← Previous
              </button>
              
              <span style={{ color: 'var(--gray-600)' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="btn btn-outline"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ElectronicsHome;
