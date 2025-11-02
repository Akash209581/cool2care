import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { toast } from 'react-toastify';

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    businessDescription: '',
    businessAddress: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  });
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

      const res = await api.get('/api/seller/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSeller(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        businessName: res.data.businessName,
        businessType: res.data.businessType,
        businessDescription: res.data.businessDescription || '',
        businessAddress: res.data.businessAddress || {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India'
        }
      });
    } catch (err) {
      toast.error('Failed to fetch seller profile');
      navigate('/seller/login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        businessAddress: {
          ...prev.businessAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sellerToken');
      const res = await api.put('/api/seller/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSeller(res.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
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
            👤 Seller Profile
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Manage your seller account information
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/seller/dashboard')} 
            className="btn btn-outline"
          >
            ← Back to Dashboard
          </button>
          <button onClick={handleLogout} className="btn btn-outline">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Profile Information</h3>
          {!editing ? (
            <button 
              onClick={() => setEditing(true)} 
              className="btn btn-primary"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setEditing(false)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Personal Information */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Personal Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    ) : (
                      <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                        {seller.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Email
                    </label>
                    <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                      {seller.email} (Cannot be changed)
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    ) : (
                      <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                        {seller.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Business Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Business Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    ) : (
                      <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                        {seller.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Business Type
                    </label>
                    {editing ? (
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select Business Type</option>
                        <option value="electronics">Electronics</option>
                        <option value="retail">Retail</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="distributor">Distributor</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                        {seller.businessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Business Description
                    </label>
                    {editing ? (
                      <textarea
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        className="form-input"
                        rows="3"
                        placeholder="Describe your business..."
                      />
                    ) : (
                      <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)', minHeight: '80px' }}>
                        {seller.businessDescription || 'No description provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>Business Address</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Street Address
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address.address"
                      value={formData.businessAddress.address}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                      {seller.businessAddress?.address}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    City
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address.city"
                      value={formData.businessAddress.city}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                      {seller.businessAddress?.city}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    State
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address.state"
                      value={formData.businessAddress.state}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                      {seller.businessAddress?.state}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Postal Code
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.businessAddress.postalCode}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                      {seller.businessAddress?.postalCode}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Country
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address.country"
                      value={formData.businessAddress.country}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                      {seller.businessAddress?.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: seller.isVerified ? 'var(--success-bg)' : 'var(--warning-bg)', borderRadius: 'var(--border-radius)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: seller.isVerified ? 'var(--success-color)' : 'var(--warning-color)' }}>
                Account Status
              </h4>
              <p style={{ margin: 0, color: seller.isVerified ? 'var(--success-color)' : 'var(--warning-color)' }}>
                {seller.isVerified ? (
                  <>✅ Your seller account is verified and active</>
                ) : (
                  <>⏳ Your seller account is pending verification. Some features may be limited.</>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
