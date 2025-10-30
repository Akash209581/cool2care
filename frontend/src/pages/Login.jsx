import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login({ email, password });
    
    if (result.success) {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧊</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your Cool2Care account</p>
        </div>

        <form onSubmit={onSubmit}>
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
              className="form-control"
              placeholder="Enter your email address"
              autoComplete="email"
            />
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
                className="form-control"
                placeholder="Enter your password"
                autoComplete="current-password"
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
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem', position: 'relative' }}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                <span style={{ marginLeft: '0.5rem' }}>Signing in...</span>
              </>
            ) : (
              <>
                <span>🚀 Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <span style={{ color: 'var(--gray-400)', padding: '0 1rem', background: 'white' }}>or</span>
          <div style={{ position: 'relative', marginTop: '-0.75rem', height: '1px', background: 'var(--gray-200)' }}></div>
        </div>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => {
              // Demo login functionality
              setFormData({ email: 'demo@cool2care.com', password: 'demo123' });
            }}
          >
            🎯 Try Demo Account
          </button>
        </div>

        <div className="auth-link">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
          <p>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
              Forgot your password?
            </Link>
          </p>
        </div>

        {/* Features reminder */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: 0, textAlign: 'center' }}>
            🧊 Smart Fridge Management + 📱 Electronics Marketplace
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
