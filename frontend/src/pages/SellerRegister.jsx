import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    businessType: 'individual',
    businessDescription: '',
    businessAddress: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    confirmPassword,
    phone,
    businessName,
    businessType,
    businessDescription,
    businessAddress,
  } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('businessAddress.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        businessAddress: {
          ...formData.businessAddress,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!businessAddress.address.trim()) newErrors['businessAddress.address'] = 'Business address is required';
    if (!businessAddress.city.trim()) newErrors['businessAddress.city'] = 'City is required';
    if (!businessAddress.state.trim()) newErrors['businessAddress.state'] = 'State is required';
    if (!businessAddress.postalCode.trim()) newErrors['businessAddress.postalCode'] = 'Postal code is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post('/api/seller/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        businessName: businessName.trim(),
        businessType,
        businessDescription: businessDescription.trim(),
        businessAddress,
      });

      // Store seller token
      localStorage.setItem('sellerToken', res.data.token);
      toast.success('Seller registration successful!');
      navigate('/seller/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setErrors({ general: message });
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
          <h2 className="auth-title">Join as a Seller</h2>
          <p className="auth-subtitle">Start selling electronics on Cool2Care marketplace</p>
        </div>

        {errors.general && (
          <div className="notification error" style={{ marginBottom: '1rem' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Personal Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--gray-700)', fontSize: '1.125rem' }}>
              👤 Personal Information
            </h3>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={onChange}
                required
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  minLength="6"
                  required
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  placeholder="Choose a strong password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                minLength="6"
                required
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Business Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--gray-700)', fontSize: '1.125rem' }}>
              🏪 Business Information
            </h3>
            
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={businessName}
                onChange={onChange}
                required
                className={`form-control ${errors.businessName ? 'error' : ''}`}
                placeholder="Enter your business name"
              />
              {errors.businessName && <span className="error-message">{errors.businessName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Business Type</label>
              <select
                name="businessType"
                value={businessType}
                onChange={onChange}
                className="form-control form-select"
              >
                <option value="individual">Individual Seller</option>
                <option value="business">Small Business</option>
                <option value="company">Company/Corporation</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Business Description (Optional)</label>
              <textarea
                name="businessDescription"
                value={businessDescription}
                onChange={onChange}
                className="form-control"
                placeholder="Describe your business and what you sell..."
                rows="3"
              />
            </div>
          </div>

          {/* Business Address */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--gray-700)', fontSize: '1.125rem' }}>
              📍 Business Address
            </h3>
            
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="businessAddress.address"
                value={businessAddress.address}
                onChange={onChange}
                required
                className={`form-control ${errors['businessAddress.address'] ? 'error' : ''}`}
                placeholder="Enter street address"
              />
              {errors['businessAddress.address'] && <span className="error-message">{errors['businessAddress.address']}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="businessAddress.city"
                  value={businessAddress.city}
                  onChange={onChange}
                  required
                  className={`form-control ${errors['businessAddress.city'] ? 'error' : ''}`}
                  placeholder="City"
                />
                {errors['businessAddress.city'] && <span className="error-message">{errors['businessAddress.city']}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="businessAddress.state"
                  value={businessAddress.state}
                  onChange={onChange}
                  required
                  className={`form-control ${errors['businessAddress.state'] ? 'error' : ''}`}
                  placeholder="State"
                />
                {errors['businessAddress.state'] && <span className="error-message">{errors['businessAddress.state']}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  name="businessAddress.postalCode"
                  value={businessAddress.postalCode}
                  onChange={onChange}
                  required
                  className={`form-control ${errors['businessAddress.postalCode'] ? 'error' : ''}`}
                  placeholder="Postal Code"
                />
                {errors['businessAddress.postalCode'] && <span className="error-message">{errors['businessAddress.postalCode']}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="businessAddress.country"
                  value={businessAddress.country}
                  onChange={onChange}
                  required
                  className="form-control"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                <span style={{ marginLeft: '0.5rem' }}>Creating seller account...</span>
              </>
            ) : (
              <>
                <span>🏪 Register as Seller</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-link">
          <p>
            Already have a seller account? <Link to="/seller/login">Sign in here</Link>
          </p>
          <p>
            Want to shop instead? <Link to="/login">Customer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;