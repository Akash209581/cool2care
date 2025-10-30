import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, becomeSeller } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [sellerData, setSellerData] = useState({
    businessName: user?.sellerProfile?.businessName || '',
    businessType: user?.sellerProfile?.businessType || 'individual',
    description: user?.sellerProfile?.description || '',
  });
  const [loading, setLoading] = useState({
    profile: false,
    seller: false,
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSellerChange = (e) => {
    setSellerData({ ...sellerData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    
    await updateProfile(formData);
    setLoading({ ...loading, profile: false });
  };

  const onSellerSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, seller: true });
    
    await becomeSeller(sellerData);
    setLoading({ ...loading, seller: false });
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'seller', label: '💼 Seller', icon: '💼' },
    { id: 'preferences', label: '⚙️ Preferences', icon: '⚙️' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>👤</span>
            Profile Settings
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
          {/* Tabs Navigation */}
          <div className="card">
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid var(--gray-200)',
              overflowX: 'auto'
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    border: 'none',
                    background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--gray-600)',
                    cursor: 'pointer',
                    borderRadius: activeTab === tab.id ? 'var(--border-radius-md) var(--border-radius-md) 0 0' : '0',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="card-body">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
                  
                  <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={onChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={onChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading.profile}
                    >
                      {loading.profile ? <span className="loading"></span> : '💾 Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Security Settings</h3>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Account Status</h4>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                        <p><strong>Email Verification:</strong></p>
                        <span style={{ 
                          color: user?.emailVerified ? 'var(--success-color)' : 'var(--warning-color)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {user?.emailVerified ? '✅ Verified' : '⚠️ Not Verified'}
                        </span>
                      </div>
                      
                      <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                        <p><strong>Phone Verification:</strong></p>
                        <span style={{ 
                          color: user?.phoneVerified ? 'var(--success-color)' : 'var(--warning-color)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {user?.phoneVerified ? '✅ Verified' : '⚠️ Not Verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Change Password</h4>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                      To change your password, we'll send you a secure link via email.
                    </p>
                    <button className="btn btn-outline">
                      🔄 Request Password Reset
                    </button>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: '1rem' }}>Two-Factor Authentication</h4>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                      Add an extra layer of security to your account.
                    </p>
                    <button className="btn btn-outline">
                      {user?.twoFactorEnabled ? '🔓 Disable 2FA' : '🔒 Enable 2FA'}
                    </button>
                  </div>
                </div>
              )}

              {/* Seller Tab */}
              {activeTab === 'seller' && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Seller Information</h3>
                  
                  {user?.isSeller ? (
                    <div>
                      <div className="notification success" style={{ marginBottom: '2rem' }}>
                        🎉 You are a verified seller! You can start listing your electronics for sale.
                      </div>
                      
                      <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Seller Stats</h4>
                        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                              {user?.sellerProfile?.totalSales || 0}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-600)' }}>Total Sales</p>
                          </div>
                          
                          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                              {user?.sellerProfile?.rating?.average?.toFixed(1) || 'N/A'}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-600)' }}>Rating</p>
                          </div>
                          
                          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                              {user?.sellerProfile?.isVerified ? '✅' : '⏳'}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                              {user?.sellerProfile?.isVerified ? 'Verified' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ marginBottom: '1rem' }}>Business Information</h4>
                        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                          <div>
                            <p><strong>Business Name:</strong> {user?.sellerProfile?.businessName}</p>
                            <p><strong>Business Type:</strong> {user?.sellerProfile?.businessType}</p>
                          </div>
                          <div>
                            <p><strong>Member Since:</strong> {new Date(user?.sellerProfile?.joinedAsSellerAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {user?.sellerProfile?.isVerified ? 'Verified Seller' : 'Pending Verification'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💼</div>
                        <h4 style={{ marginBottom: '1rem' }}>Become a Seller</h4>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                          Start selling your electronics on Cool2Care marketplace and reach thousands of potential buyers.
                        </p>
                      </div>

                      <form onSubmit={onSellerSubmit}>
                        <div className="form-group">
                          <label className="form-label">Business Name</label>
                          <input
                            type="text"
                            name="businessName"
                            value={sellerData.businessName}
                            onChange={onSellerChange}
                            className="form-control"
                            placeholder="Enter your business name"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Business Type</label>
                          <select
                            name="businessType"
                            value={sellerData.businessType}
                            onChange={onSellerChange}
                            className="form-control form-select"
                          >
                            <option value="individual">Individual</option>
                            <option value="business">Business</option>
                            <option value="company">Company</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <textarea
                            name="description"
                            value={sellerData.description}
                            onChange={onSellerChange}
                            className="form-control"
                            rows="4"
                            placeholder="Tell buyers about your business and what you sell"
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="btn btn-secondary"
                          disabled={loading.seller}
                        >
                          {loading.seller ? <span className="loading"></span> : '🚀 Become a Seller'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>App Preferences</h3>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Notifications</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { id: 'email', label: 'Email Notifications', desc: 'Receive order updates and important alerts via email' },
                        { id: 'sms', label: 'SMS Notifications', desc: 'Get urgent notifications via text message' },
                        { id: 'push', label: 'Push Notifications', desc: 'Receive browser notifications for real-time updates' },
                      ].map(option => (
                        <label key={option.id} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '0.75rem',
                          padding: '1rem',
                          border: '1px solid var(--gray-200)',
                          borderRadius: 'var(--border-radius-md)',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            defaultChecked={user?.preferences?.notifications?.[option.id]}
                            style={{ marginTop: '0.25rem' }}
                          />
                          <div>
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{option.label}</div>
                            <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Regional Settings</h4>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Currency</label>
                        <select className="form-control form-select" defaultValue={user?.preferences?.currency || 'USD'}>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Language</label>
                        <select className="form-control form-select" defaultValue={user?.preferences?.language || 'en'}>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary">
                    💾 Save Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
