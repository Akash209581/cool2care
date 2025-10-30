import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
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

    const result = await register({ name: name.trim(), email: email.trim(), password, phone: phone.trim() });
    
    if (result.success) {
      navigate('/');
    } else if (result.message) {
      setErrors({ general: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h2 className="auth-title">Join Cool2Care</h2>
          <p className="auth-subtitle">Create your account and start smart living</p>
        </div>

        {errors.general && (
          <div className="notification error" style={{ marginBottom: '1rem' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👤 Full Name
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.name && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📧 Email Address
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {errors.email && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📱 Phone Number <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>(Optional)</span>
              </span>
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={onChange}
              className={`form-control ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
            {errors.phone && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔒 Password
              </span>
            </label>
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
                autoComplete="new-password"
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
            {errors.password && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>{errors.password}</span>}
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
              Must be at least 6 characters long
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔒 Confirm Password
              </span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              minLength="6"
              required
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>{errors.confirmPassword}</span>}
          </div>

          <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500', fontSize: '0.9rem' }}>
              🎯 What you'll get:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              <li>Smart refrigerator management tools</li>
              <li>Access to electronics marketplace</li>
              <li>Secure buying and selling platform</li>
              <li>Real-time notifications and alerts</li>
            </ul>
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
                <span style={{ marginLeft: '0.5rem' }}>Creating account...</span>
              </>
            ) : (
              <>
                <span>🚀 Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-link">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-md)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: 0, textAlign: 'center' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy. 
            We'll keep your data secure and never spam you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
