import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = getCartCount();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🧊 Cool2Care
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>

          {isAuthenticated && (
            <li>
              <Link 
                to="/fridge" 
                className={`nav-link ${isActive('/fridge') ? 'active' : ''}`}
              >
                Smart Fridge
              </Link>
            </li>
          )}

          <li>
            <Link 
              to="/electronics" 
              className={`nav-link ${location.pathname.startsWith('/electronics') ? 'active' : ''}`}
            >
              Electronics
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  to="/cart" 
                  className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
                  style={{ position: 'relative' }}
                >
                  Cart
                  {cartCount > 0 && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--error-color)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <Link 
                  to="/orders" 
                  className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                >
                  Orders
                </Link>
              </li>

              <li>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  {user?.name}
                </Link>
              </li>

              <li>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-outline btn-sm">
                  👤 User Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-outline btn-sm">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/seller/login" className="btn btn-primary btn-sm">
                  🏪 Seller Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
