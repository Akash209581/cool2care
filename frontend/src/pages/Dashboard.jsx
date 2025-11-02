import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [fridgeStatus, setFridgeStatus] = useState({});
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'fruit',
    quantity: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    fetchFridgeStatus();

    // Refresh fridge status every 30 seconds
    const interval = setInterval(fetchFridgeStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/items');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch items');
      setLoading(false);
    }
  };

  const fetchFridgeStatus = async () => {
    try {
      const res = await api.get('/api/fridge/status');
      setFridgeStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch fridge status');
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/items', newItem);
      setItems([res.data, ...items]);
      setNewItem({ name: '', category: 'fruit', quantity: 1, notes: '' });
      setError('');
    } catch (err) {
      setError(err.response.data.message || 'Failed to add item');
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const getItemStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 2) return 'expiring';
    return 'fresh';
  };

  const getExpiringItems = () => {
    return items.filter(item => {
      const status = getItemStatus(item.expiryDate);
      return status === 'expiring' || status === 'expired';
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  const expiringItems = getExpiringItems();

  return (
    <div>
      <header className="header">
        <div className="nav">
          <h1>🧊 Cool2Care</h1>
          <div>
            <span style={{ marginRight: '20px' }}>
              Welcome, {user?.name}!
            </span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="container dashboard">
        {error && (
          <div style={{ 
            color: '#dc3545', 
            background: '#f8d7da', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {expiringItems.length > 0 && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            padding: '15px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ color: '#856404' }}>⚠️ Items Expiring Soon!</h3>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              {expiringItems.map(item => (
                <li key={item._id} style={{ color: '#856404' }}>
                  {item.name} - Expires: {new Date(item.expiryDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid">
          {/* Fridge Status */}
          <div className="card">
            <h3>🌡️ Fridge Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                  {fridgeStatus.temperature}°C
                </div>
                <div>Temperature</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                  {fridgeStatus.humidity}%
                </div>
                <div>Humidity</div>
              </div>
            </div>
            <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
              Status: {fridgeStatus.powerStatus} | Door: {fridgeStatus.doorStatus}
            </div>
          </div>

          {/* Add New Item */}
          <div className="card">
            <h3>➕ Add New Item</h3>
            <form onSubmit={addItem}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Item name (e.g., banana, apple, tomato)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="form-control"
                >
                  <option value="fruit">Fruit</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-success">
                Add Item
              </button>
            </form>
          </div>
        </div>

        {/* Items List */}
        <div className="card">
          <h3>📦 Items in Fridge ({items.length})</h3>
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
              No items in your fridge yet. Add some items above!
            </p>
          ) : (
            <ul className="item-list">
              {items.map((item) => {
                const status = getItemStatus(item.expiryDate);
                const className = status === 'expired' ? 'item-expired' : 
                                status === 'expiring' ? 'item-expiring' : '';

                return (
                  <li key={item._id} className={className}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <div>
                        <strong>{item.name}</strong> ({item.category})
                        <br />
                        <small>
                          Added: {new Date(item.addedDate).toLocaleDateString()} | 
                          Expires: {new Date(item.expiryDate).toLocaleDateString()} |
                          Qty: {item.quantity}
                          {status === 'expired' && ' | ⚠️ EXPIRED'}
                          {status === 'expiring' && ' | ⏰ Expiring Soon'}
                        </small>
                      </div>
                      <button 
                        onClick={() => deleteItem(item._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
