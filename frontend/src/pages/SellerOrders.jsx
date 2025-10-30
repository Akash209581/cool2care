import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateLoading, setUpdateLoading] = useState(null);
  const navigate = useNavigate();

  const orderStatuses = [
    { value: 'all', label: 'All Orders', color: 'var(--gray-500)' },
    { value: 'pending', label: 'Pending', color: 'var(--warning-color)' },
    { value: 'confirmed', label: 'Confirmed', color: 'var(--info-color)' },
    { value: 'processing', label: 'Processing', color: 'var(--primary-color)' },
    { value: 'shipped', label: 'Shipped', color: 'var(--success-color)' },
    { value: 'delivered', label: 'Delivered', color: 'var(--success-color)' },
    { value: 'cancelled', label: 'Cancelled', color: 'var(--danger-color)' },
    { value: 'returned', label: 'Returned', color: 'var(--danger-color)' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        navigate('/seller/login');
        return;
      }

      const res = await axios.get('/api/seller/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/seller/login');
      } else {
        toast.error('Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdateLoading(orderId);
      const token = localStorage.getItem('sellerToken');
      
      const res = await axios.patch(`/api/seller/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: res.data.status, updatedAt: res.data.updatedAt }
          : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setUpdateLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = orderStatuses.find(s => s.value === status) || orderStatuses[0];
    return (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--border-radius-sm)',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: statusConfig.color,
        color: 'white'
      }}>
        {statusConfig.label}
      </span>
    );
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            📋 Order Management
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            Manage and track your customer orders
          </p>
        </div>
        <button 
          onClick={() => navigate('/seller/dashboard')} 
          className="btn btn-outline"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Filter by status:</span>
            {orderStatuses.map(status => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`btn ${statusFilter === status.value ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.85rem' }}
              >
                {status.label}
                {status.value !== 'all' && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    padding: '0.125rem 0.375rem',
                    borderRadius: '50%',
                    backgroundColor: statusFilter === status.value ? 'rgba(255,255,255,0.2)' : 'var(--gray-200)',
                    fontSize: '0.75rem'
                  }}>
                    {orders.filter(o => o.status === status.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
            {statusFilter === 'all' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
          </h3>
          <p style={{ color: 'var(--gray-500)' }}>
            {statusFilter === 'all' 
              ? 'Orders will appear here when customers purchase your products.'
              : `No orders with ${statusFilter} status found.`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.map((order) => (
            <div key={order._id} className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h4 style={{ margin: 0 }}>Order #{order._id.slice(-8)}</h4>
                  {getStatusBadge(order.status)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="card-body">
                {/* Customer Information */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-700)' }}>Customer Information</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div><strong>Name:</strong> {order.user?.name}</div>
                    <div><strong>Email:</strong> {order.user?.email}</div>
                    <div><strong>Phone:</strong> {order.shippingAddress?.phone}</div>
                  </div>
                  
                  {order.shippingAddress && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>Shipping Address:</strong>
                      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ margin: '0 0 1rem 0', color: 'var(--gray-700)' }}>Order Items</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {order.items?.map((item, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid var(--gray-200)',
                          borderRadius: 'var(--border-radius)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {item.product?.images?.[0] && (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              style={{ 
                                width: '50px', 
                                height: '50px', 
                                objectFit: 'cover', 
                                borderRadius: 'var(--border-radius-sm)' 
                              }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: '500' }}>{item.product?.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                              Quantity: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                            ₹{item.price} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                      Total: ₹{order.totalAmount?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                      Payment: {order.paymentMethod} • {order.paymentStatus}
                    </div>
                  </div>

                  {/* Status Update Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.status !== 'cancelled' && order.status !== 'returned' && order.status !== 'delivered' && (
                      <>
                        {getNextStatus(order.status) && (
                          <button
                            onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                            disabled={updateLoading === order._id}
                            className="btn btn-primary"
                            style={{ fontSize: '0.85rem' }}
                          >
                            {updateLoading === order._id ? 'Updating...' : `Mark as ${getNextStatus(order.status)}`}
                          </button>
                        )}
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                            disabled={updateLoading === order._id}
                            className="btn btn-danger"
                            style={{ fontSize: '0.85rem' }}
                          >
                            Cancel Order
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => window.open(`/order-invoice/${order._id}`, '_blank')}
                      className="btn btn-outline"
                      style={{ fontSize: '0.85rem' }}
                    >
                      📄 Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>📊 Orders Summary</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                  {orders.length}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Total Orders</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--warning-color)' }}>
                  {orders.filter(o => o.status === 'pending').length}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Pending</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--info-color)' }}>
                  {orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>In Progress</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--success-color)' }}>
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Delivered</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                  ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
                </div>
                <div style={{ color: 'var(--gray-600)' }}>Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;