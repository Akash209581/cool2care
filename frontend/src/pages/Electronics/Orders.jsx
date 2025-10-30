import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useAuth();
  const { id: orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderStatuses = {
    pending: { label: 'Pending', color: 'var(--warning-color)', icon: '⏳' },
    processing: { label: 'Processing', color: 'var(--info-color)', icon: '⚙️' },
    shipped: { label: 'Shipped', color: 'var(--primary-color)', icon: '🚚' },
    delivered: { label: 'Delivered', color: 'var(--success-color)', icon: '✅' },
    cancelled: { label: 'Cancelled', color: 'var(--error-color)', icon: '❌' },
    refunded: { label: 'Refunded', color: 'var(--gray-500)', icon: '💰' },
  };

  useEffect(() => {
    if (orderId) {
      fetchSingleOrder();
    } else {
      fetchOrders();
    }
  }, [orderId]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/myorders');
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${orderId}`);
      setOrders([res.data.order]);
      setSelectedOrder(res.data.order);
      setShowOrderDetails(true);
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await axios.put(`/api/orders/${orderId}/cancel`, {
        reason: 'Cancelled by customer'
      });
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  const OrderCard = ({ order }) => {
    const status = orderStatuses[order.status] || orderStatuses.pending;
    const orderDate = new Date(order.createdAt);
    const canCancel = ['pending', 'processing'].includes(order.status);

    return (
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📋 Order #{order._id?.slice(-8).toUpperCase()}
              </h4>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                Placed on {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
              </p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  background: status.color,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {status.icon} {status.label}
              </span>
            </div>
          </div>

          {/* Order Items Preview */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {order.orderItems?.slice(0, 3).map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  minWidth: '280px',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-md)'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📱
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                      Qty: {item.quantity} × ${item.price}
                    </div>
                  </div>
                </div>
              ))}
              
              {order.orderItems?.length > 3 && (
                <div style={{
                  minWidth: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-600)',
                  fontSize: '0.875rem'
                }}>
                  +{order.orderItems.length - 3} more
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                {order.orderItems?.length} item(s) • Payment: {order.paymentMethod}
              </div>
              {order.trackingNumber && (
                <div style={{ fontSize: '0.875rem', color: 'var(--info-color)' }}>
                  🚚 Tracking: {order.trackingNumber}
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                ${order.totalPrice?.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                Total Amount
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowOrderDetails(true);
              }}
              className="btn btn-outline btn-sm"
            >
              👁️ View Details
            </button>
            
            {order.status === 'delivered' && (
              <button className="btn btn-outline btn-sm">
                ⭐ Write Review
              </button>
            )}
            
            {canCancel && (
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
              >
                ❌ Cancel Order
              </button>
            )}
            
            <button className="btn btn-outline btn-sm">
              📞 Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--border-radius-lg)',
          maxWidth: '800px',
          width: '100%',
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
            <h3 style={{ margin: 0 }}>
              📋 Order Details #{selectedOrder._id?.slice(-8).toUpperCase()}
            </h3>
            <button
              onClick={() => setShowOrderDetails(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--gray-600)'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            {/* Order Status Timeline */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>📊 Order Timeline</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto' }}>
                {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                  const isActive = Object.keys(orderStatuses).indexOf(selectedOrder.status) >= index;
                  const statusInfo = orderStatuses[status];
                  
                  return (
                    <React.Fragment key={status}>
                      <div style={{ textAlign: 'center', minWidth: '100px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isActive ? statusInfo.color : 'var(--gray-300)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.5rem auto'
                        }}>
                          {statusInfo.icon}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: isActive ? statusInfo.color : 'var(--gray-500)' }}>
                          {statusInfo.label}
                        </div>
                      </div>
                      
                      {index < 3 && (
                        <div style={{
                          flex: 1,
                          height: '2px',
                          background: Object.keys(orderStatuses).indexOf(selectedOrder.status) > index ? statusInfo.color : 'var(--gray-300)',
                          marginTop: '-20px'
                        }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>📍 Shipping Address</h4>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                <div>{selectedOrder.shippingAddress?.fullName}</div>
                <div>{selectedOrder.shippingAddress?.address}</div>
                <div>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </div>
                <div>{selectedOrder.shippingAddress?.country}</div>
                {selectedOrder.shippingAddress?.phone && (
                  <div>📞 {selectedOrder.shippingAddress.phone}</div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>📦 Items Ordered</h4>
              {selectedOrder.orderItems?.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--border-radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--border-radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    📱
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h5 style={{ marginBottom: '0.5rem' }}>{item.title}</h5>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                      Quantity: {item.quantity}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                      ${item.price} each
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>💳 Payment Summary</h4>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>${(selectedOrder.totalPrice - selectedOrder.shippingPrice - selectedOrder.taxPrice).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Shipping:</span>
                  <span>${selectedOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Tax:</span>
                  <span>${selectedOrder.taxPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '2px solid var(--gray-300)',
                  paddingTop: '0.5rem',
                  marginTop: '0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--primary-color)' }}>${selectedOrder.totalPrice?.toFixed(2)}</span>
                </div>
                
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Payment Method: <strong>{selectedOrder.paymentMethod}</strong>
                  {selectedOrder.isPaid ? (
                    <span style={{ color: 'var(--success-color)', marginLeft: '1rem' }}>✅ Paid</span>
                  ) : (
                    <span style={{ color: 'var(--error-color)', marginLeft: '1rem' }}>❌ Unpaid</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  // If viewing a specific order, show order details directly
  if (orderId && selectedOrder) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/orders" style={{ color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
            ← Back to All Orders
          </Link>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            📋 Order Details
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Order #{selectedOrder._id?.slice(-8).toUpperCase()}
          </p>
        </div>
        
        <div style={{ background: 'white', borderRadius: 'var(--border-radius-lg)', padding: '2rem' }}>
          <OrderDetailsModal />
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          📋 My Orders
        </h1>
        <p style={{ color: 'var(--gray-600)', margin: 0 }}>
          Track and manage your electronics orders
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {[
            { key: 'all', label: 'All Orders', count: orders.length },
            { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
            { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
            { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
            { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
            { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid',
                borderColor: activeTab === tab.key ? 'var(--primary-color)' : 'var(--gray-200)',
                background: activeTab === tab.key ? 'var(--primary-color)' : 'white',
                color: activeTab === tab.key ? 'white' : 'var(--gray-700)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '1rem' }}>No orders found</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
            {activeTab === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${activeTab} orders found.`
            }
          </p>
          <Link to="/electronics" className="btn btn-primary">
            🛍️ Start Shopping
          </Link>
        </div>
      ) : (
        <div>
          {filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && <OrderDetailsModal />}
    </div>
  );
};

export default Orders;
