import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { toast } from 'react-toastify';

const SellerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        navigate('/seller/login');
        return;
      }

      const res = await api.get(`/api/seller/analytics?days=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/seller/login');
      } else {
        toast.error('Failed to fetch analytics');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIndicator = (growth) => {
    if (!growth) return { icon: '➖', color: 'var(--gray-500)', text: 'No change' };
    if (growth > 0) return { icon: '📈', color: 'var(--success-color)', text: `+${growth.toFixed(1)}%` };
    return { icon: '📉', color: 'var(--danger-color)', text: `${growth.toFixed(1)}%` };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container py-4">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>📊 Analytics</h3>
          <p>Unable to load analytics data</p>
          <button onClick={() => navigate('/seller/dashboard')} className="btn btn-primary">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Track your business performance and insights
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button 
            onClick={() => navigate('/seller/dashboard')} 
            className="btn btn-outline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Revenue */}
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary-color)', fontSize: '1.75rem' }}>
              {formatCurrency(analytics.revenue?.total || 0)}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)', fontSize: '0.9rem' }}>Total Revenue</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span>{getGrowthIndicator(analytics.revenue?.growth).icon}</span>
              <span style={{ color: getGrowthIndicator(analytics.revenue?.growth).color }}>
                {getGrowthIndicator(analytics.revenue?.growth).text}
              </span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--success-color)', fontSize: '1.75rem' }}>
              {analytics.orders?.total || 0}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)', fontSize: '0.9rem' }}>Total Orders</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span>{getGrowthIndicator(analytics.orders?.growth).icon}</span>
              <span style={{ color: getGrowthIndicator(analytics.orders?.growth).color }}>
                {getGrowthIndicator(analytics.orders?.growth).text}
              </span>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--info-color)', fontSize: '1.75rem' }}>
              {formatCurrency(analytics.averageOrderValue || 0)}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)', fontSize: '0.9rem' }}>Avg Order Value</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span>{getGrowthIndicator(analytics.aovGrowth).icon}</span>
              <span style={{ color: getGrowthIndicator(analytics.aovGrowth).color }}>
                {getGrowthIndicator(analytics.aovGrowth).text}
              </span>
            </div>
          </div>
        </div>

        {/* Products Sold */}
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--warning-color)', fontSize: '1.75rem' }}>
              {analytics.productsSold?.total || 0}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)', fontSize: '0.9rem' }}>Products Sold</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
              <span>{getGrowthIndicator(analytics.productsSold?.growth).icon}</span>
              <span style={{ color: getGrowthIndicator(analytics.productsSold?.growth).color }}>
                {getGrowthIndicator(analytics.productsSold?.growth).text}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Sales Chart Placeholder */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>📈 Sales Trend</h3>
          </div>
          <div className="card-body">
            <div style={{ 
              height: '300px', 
              backgroundColor: 'var(--gray-50)', 
              borderRadius: 'var(--border-radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '3rem' }}>📊</div>
              <p style={{ color: 'var(--gray-600)', textAlign: 'center' }}>
                Sales chart visualization<br />
                <small>(Chart library integration pending)</small>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          {/* Top Categories */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header">
              <h4 style={{ margin: 0, fontSize: '1rem' }}>🏷️ Top Categories</h4>
            </div>
            <div className="card-body">
              {analytics.topCategories?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analytics.topCategories.map((category, index) => (
                    <div key={category._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          backgroundColor: ['var(--primary-color)', 'var(--success-color)', 'var(--warning-color)'][index] || 'var(--gray-400)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>
                          {category._id}
                        </span>
                      </div>
                      <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.9rem' }}>No data available</p>
              )}
            </div>
          </div>

          {/* Recent Performance */}
          <div className="card">
            <div className="card-header">
              <h4 style={{ margin: 0, fontSize: '1rem' }}>⚡ Recent Performance</h4>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Conversion Rate:</span>
                  <span style={{ fontWeight: '600' }}>
                    {analytics.conversionRate?.toFixed(1) || '0.0'}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Return Rate:</span>
                  <span style={{ fontWeight: '600', color: analytics.returnRate > 5 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                    {analytics.returnRate?.toFixed(1) || '0.0'}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Avg Rating:</span>
                  <span style={{ fontWeight: '600', color: 'var(--warning-color)' }}>
                    ⭐ {analytics.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Reviews:</span>
                  <span style={{ fontWeight: '600' }}>
                    {analytics.totalReviews || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0 }}>🏆 Top Performing Products</h3>
        </div>
        <div className="card-body">
          {analytics.topProducts?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {analytics.topProducts.map((product, index) => (
                <div 
                  key={product._id}
                  style={{ 
                    padding: '1rem',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--border-radius)',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    position: 'absolute',
                    top: '-8px',
                    left: '1rem',
                    backgroundColor: ['var(--warning-color)', 'var(--gray-400)', 'var(--orange)'][index] || 'var(--gray-300)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    #{index + 1}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover', 
                          borderRadius: 'var(--border-radius-sm)' 
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{product.name}</h5>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                        {product.category}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Sold: <strong>{product.sold || 0}</strong></span>
                        <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                          {formatCurrency(product.revenue || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p style={{ color: 'var(--gray-500)' }}>No product performance data available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
