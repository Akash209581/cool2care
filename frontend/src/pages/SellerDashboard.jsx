import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  const fetchSellerProfile = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        navigate('/seller/login');
        return;
      }

      const res = await axios.get('/api/seller/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSeller(res.data);
    } catch (err) {
      toast.error('Failed to fetch seller profile');
      localStorage.removeItem('sellerToken');
      navigate('/seller/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    toast.success('Logged out successfully');
    navigate('/seller/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!seller) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            🏪 Seller Dashboard
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Welcome back, {seller.name}!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/seller/profile" className="btn btn-outline">
            👤 Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-outline">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Verification Status */}
      {!seller.isVerified && (
        <div className="notification warning" style={{ marginBottom: '2rem' }}>
          <strong>⚠️ Account Verification Pending</strong>
          <br />
          Your seller account is pending verification. Some features may be limited until verification is complete.
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
              {seller.totalProducts || 0}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)' }}>Total Products</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--success-color)' }}>
              {seller.stats?.totalOrders || 0}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)' }}>Total Orders</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--warning-color)' }}>
              ₹{(seller.stats?.totalRevenue || 0).toLocaleString()}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)' }}>Total Revenue</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--info-color)' }}>
              {seller.rating?.average?.toFixed(1) || '0.0'}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)' }}>Avg Rating ({seller.rating?.count || 0} reviews)</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 style={{ margin: 0 }}>🚀 Quick Actions</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link to="/seller/products/add" className="btn btn-primary" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</div>
              <div>Add New Product</div>
            </Link>
            
            <Link to="/seller/products" className="btn btn-outline" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
              <div>Manage Products</div>
            </Link>
            
            <Link to="/seller/orders" className="btn btn-outline" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <div>View Orders</div>
            </Link>
            
            <Link to="/seller/analytics" className="btn btn-outline" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div>Analytics</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0 }}>🏪 Business Information</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Business Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div><strong>Business Name:</strong> {seller.businessName}</div>
                <div><strong>Business Type:</strong> {seller.businessType}</div>
                <div><strong>Email:</strong> {seller.email}</div>
                <div><strong>Phone:</strong> {seller.phone}</div>
                <div>
                  <strong>Status:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.75rem',
                    backgroundColor: seller.isVerified ? 'var(--success-color)' : 'var(--warning-color)',
                    color: 'white'
                  }}>
                    {seller.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Business Address</h4>
              <div style={{ color: 'var(--gray-600)', lineHeight: '1.6' }}>
                {seller.businessAddress?.address}<br />
                {seller.businessAddress?.city}, {seller.businessAddress?.state}<br />
                {seller.businessAddress?.postalCode}<br />
                {seller.businessAddress?.country}
              </div>
            </div>
          </div>

          {seller.businessDescription && (
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Business Description</h4>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.6', margin: 0 }}>
                {seller.businessDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;