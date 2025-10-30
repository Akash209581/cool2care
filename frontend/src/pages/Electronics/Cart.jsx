import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    if (window.confirm(`Remove ${productName} from cart?`)) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.phone) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: total
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🛒</div>
          <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Discover amazing electronics and add them to your cart
          </p>
          <Link to="/electronics" className="btn btn-primary btn-lg">
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          🛒 Shopping Cart ({getCartCount()} items)
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/electronics" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            ← Continue Shopping
          </Link>
          <button onClick={handleClearCart} className="btn btn-outline btn-sm">
            🗑️ Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        {/* Cart Items */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Cart Items</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {items.map((item, index) => (
                <div key={item.product._id}>
                  <div className="cart-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      {/* Product Image */}
                      <Link to={`/electronics/${item.product._id}`}>
                        {item.product.images?.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            className="cart-item-image"
                          />
                        ) : (
                          <div
                            className="cart-item-image"
                            style={{
                              background: 'var(--gray-100)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '2rem',
                              color: 'var(--gray-400)',
                            }}
                          >
                            📱
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="cart-item-info">
                        <Link 
                          to={`/electronics/${item.product._id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                            {item.product.title}
                          </h4>
                        </Link>
                        
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                          {item.product.brand} • {item.product.model}
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                          Condition: <span style={{ 
                            textTransform: 'capitalize',
                            color: 'var(--gray-800)',
                            fontWeight: '500'
                          }}>
                            {item.product.condition.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span style={{ 
                            padding: '0.5rem 1rem', 
                            border: '1px solid var(--gray-300)', 
                            borderRadius: 'var(--border-radius-sm)',
                            minWidth: '60px',
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product.quantity || 1)}
                          >
                            +
                          </button>
                          
                          <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            {item.product.quantity} available
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                        ${item.product.price} each
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.product._id, item.product.title)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                  
                  {index < items.length - 1 && (
                    <div style={{ height: '1px', background: 'var(--gray-200)', margin: '0 1rem' }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Order Summary</h3>
            </div>
            
            <div className="card-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal ({getCartCount()} items):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Shipping:</span>
                  <span style={{ color: shipping === 0 ? 'var(--success-color)' : 'inherit' }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                {shipping === 0 && subtotal < 100 && (
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--success-color)', 
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}>
                    🎉 You got free shipping!
                  </div>
                )}
                
                {shipping > 0 && (
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--warning-color)', 
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}>
                    💡 Spend ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}
                
                <div style={{ 
                  borderTop: '2px solid var(--gray-200)', 
                  paddingTop: '1rem', 
                  marginTop: '1rem',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                🔒 Proceed to Checkout
              </button>
              
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textAlign: 'center', marginBottom: '1rem' }}>
                🔒 Secure checkout with SSL encryption
              </div>

              {/* Trust Signals */}
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: 'var(--border-radius-md)',
                fontSize: '0.875rem'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>✅ Shop with confidence:</div>
                <ul style={{ paddingLeft: '1rem', margin: 0, color: 'var(--gray-600)' }}>
                  <li>🛡️ Buyer protection</li>
                  <li>🔄 Easy returns</li>
                  <li>📞 24/7 support</li>
                  <li>💳 Secure payments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recently Viewed or Recommended */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h4 style={{ margin: 0 }}>💡 You might also like</h4>
            </div>
            <div className="card-body">
              <div style={{ textAlign: 'center', color: 'var(--gray-600)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                  Product recommendations coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--border-radius-lg)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--gray-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0 }}>🛒 Checkout</h2>
              <button
                onClick={() => setShowCheckout(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Order Summary */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>📦 Order Summary</h3>
                <div style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem',
                  borderRadius: 'var(--border-radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Subtotal ({getCartCount()} items):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Tax (18% GST):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div style={{
                    borderTop: '1px solid var(--gray-300)',
                    paddingTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '700',
                    fontSize: '1.125rem'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>🏠 Shipping Address</h3>
                <form style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleAddressChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleAddressChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleAddressChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      className="form-input"
                      placeholder="House number and street name"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        ZIP *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>💳 Payment Method</h3>
                <div style={{
                  border: '1px solid var(--gray-300)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1rem'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span style={{ fontWeight: '500' }}>💵 Cash on Delivery (COD)</span>
                  </label>
                  <p style={{
                    margin: '0.5rem 0 0 1.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--gray-600)'
                  }}>
                    Pay when your order is delivered to your doorstep
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn btn-primary"
                  style={{ minWidth: '150px' }}
                >
                  {isCheckingOut ? (
                    <>
                      <span className="loading"></span>
                      <span style={{ marginLeft: '0.5rem' }}>Processing...</span>
                    </>
                  ) : (
                    <>🔒 Place Order</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
