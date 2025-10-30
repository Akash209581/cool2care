import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get('/api/electronics/featured');
      setFeaturedProducts(res.data.slice(0, 4)); // Show only 4 products
    } catch (error) {
      console.error('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '700' }}>
            Cool2Care Enhanced
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.9 }}>
            Smart Refrigerator Management + Electronics Marketplace
          </p>
          <p style={{ fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', opacity: 0.8 }}>
            Track your food inventory intelligently while buying and selling electronics in our secure marketplace
          </p>
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started Free
              </Link>
              <Link to="/electronics" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                Browse Electronics
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Features Section */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
            Two Powerful Platforms in One
          </h2>
          
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧊</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Smart Refrigerator</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', lineHeight: '1.6' }}>
                • Automatic expiry date tracking for 12+ food types<br/>
                • Real-time temperature and humidity monitoring<br/>
                • Smart notifications for expiring items<br/>
                • Food waste reduction analytics
              </p>
              {isAuthenticated ? (
                <Link to="/fridge" className="btn btn-primary">
                  Open Fridge Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-outline">
                  Start Managing Food
                </Link>
              )}
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Electronics Marketplace</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', lineHeight: '1.6' }}>
                • Buy and sell new & used electronics<br/>
                • Advanced search and filtering<br/>
                • Secure payment processing<br/>
                • User reviews and seller ratings
              </p>
              <Link to="/electronics" className="btn btn-secondary">
                Browse Electronics
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {!loading && featuredProducts.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Featured Electronics</h2>
              <Link to="/electronics" className="btn btn-outline">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
              {featuredProducts.map(product => (
                <div key={product._id} className="product-card">
                  <div style={{ height: '200px', background: 'var(--gray-100)', borderRadius: 'var(--border-radius-md) var(--border-radius-md) 0 0' }}>
                    {product.images?.length > 0 ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.title}
                        className="product-image"
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-500)' }}>
                        📱 No Image
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4 className="product-title">{product.title}</h4>
                    <p className="product-price">${product.price}</p>
                    <span className={`product-condition condition-${product.condition.replace('-', '')}`}>
                      {product.condition.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section style={{ 
          background: 'var(--bg-tertiary)', 
          padding: '3rem', 
          borderRadius: 'var(--border-radius-xl)', 
          textAlign: 'center',
          marginBottom: '4rem' 
        }}>
          <h2 style={{ marginBottom: '3rem' }}>Trusted by Thousands</h2>
          <div className="grid grid-cols-4">
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                2,500+
              </div>
              <p style={{ color: 'var(--gray-600)' }}>Active Users</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>
                15,000+
              </div>
              <p style={{ color: 'var(--gray-600)' }}>Products Listed</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                98%
              </div>
              <p style={{ color: 'var(--gray-600)' }}>Satisfaction Rate</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--info-color)', marginBottom: '0.5rem' }}>
                50+
              </div>
              <p style={{ color: 'var(--gray-600)' }}>Cities Served</p>
            </div>
          </div>
        </section>

        {/* User Dashboard Preview */}
        {isAuthenticated && (
          <section className="card">
            <div className="card-header">
              <h3>Welcome back, {user?.name}! 👋</h3>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                {user?.isSeller ? 'Seller Account' : 'Regular Account'} • Last login: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-3">
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Smart Fridge</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link to="/fridge" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                        🧊 Check fridge status
                      </Link>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link to="/fridge" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                        📦 Add food items
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Electronics</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link to="/electronics" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
                        📱 Browse marketplace
                      </Link>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link to="/orders" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>
                        📋 View your orders
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Account</h4>
                  {user?.isSeller ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <Link to="/sell" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                          💼 Sell products
                        </Link>
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        <Link to="/my-products" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                          📊 Manage inventory
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <div>
                      <p style={{ color: 'var(--gray-600)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Start selling your electronics today
                      </p>
                      <Link to="/become-seller" className="btn btn-secondary btn-sm">
                        Become a Seller
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section for non-authenticated users */}
        {!isAuthenticated && (
          <section style={{ 
            background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
            color: 'white',
            padding: '3rem',
            borderRadius: 'var(--border-radius-xl)',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to Get Started?</h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Join thousands of users managing their smart homes and trading electronics safely
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Create Free Account
              </Link>
              <Link to="/login" className="btn" style={{ background: 'white', color: 'var(--primary-color)' }}>
                Sign In
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
