import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FridgeDashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [fridgeStatus, setFridgeStatus] = useState({});
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'fruit',
    quantity: 1,
    notes: '',
    customExpiryDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Food categories with expiry information
  const categories = [
    { 
      value: 'fruit', 
      label: '🍎 Fruits', 
      color: 'var(--success-color)',
      description: 'Auto-expires in ~7 days (varies by fruit)'
    },
    { 
      value: 'vegetable', 
      label: '🥕 Vegetables', 
      color: 'var(--secondary-color)',
      description: 'Auto-expires in ~10 days (varies by vegetable)'
    },
    { 
      value: 'dairy', 
      label: '🥛 Dairy', 
      color: 'var(--info-color)',
      description: 'Auto-expires in ~5 days (varies by product)'
    },
    { 
      value: 'meat', 
      label: '🥩 Meat', 
      color: 'var(--error-color)',
      description: 'Auto-expires in ~3 days (refrigerated)'
    },
    { 
      value: 'other', 
      label: '📦 Other Items', 
      color: 'var(--gray-500)',
      description: 'Manual expiry date required'
    }
  ];

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
    } catch (err) {
      toast.error('Failed to fetch items');
    } finally {
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
    if (!newItem.name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    // Validate expiry date for "other" category
    if (newItem.category === 'other' && !newItem.customExpiryDate) {
      toast.error('Please provide an expiry date for other items');
      return;
    }

    // Validate that custom expiry date is in the future
    if (newItem.customExpiryDate) {
      const expiryDate = new Date(newItem.customExpiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      if (expiryDate <= today) {
        toast.error('Expiry date must be in the future');
        return;
      }
    }

    try {
      const res = await api.post('/api/items', newItem);
      setItems([res.data, ...items]);
      setNewItem({ name: '', category: 'fruit', quantity: 1, notes: '', customExpiryDate: '' });
      toast.success(`${res.data.name} added to fridge!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };

  const deleteItem = async (id, itemName) => {
    if (!window.confirm(`Remove ${itemName} from fridge?`)) return;

    try {
      await api.delete(`/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      toast.success('Item removed from fridge');
    } catch (err) {
      toast.error('Failed to delete item');
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

  const getFilteredAndSortedItems = () => {
    let filtered = items;

    // Apply filters
    if (filter === 'expiring') {
      filtered = items.filter(item => {
        const status = getItemStatus(item.expiryDate);
        return status === 'expiring' || status === 'expired';
      });
    } else if (filter !== 'all') {
      filtered = items.filter(item => item.category === filter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'expiry':
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const getExpiringItems = () => {
    return items.filter(item => {
      const status = getItemStatus(item.expiryDate);
      return status === 'expiring' || status === 'expired';
    });
  };

  const getCategoryStats = () => {
    return categories.map(category => ({
      ...category,
      count: items.filter(item => item.category === category.value).length
    }));
  };

  // Get estimated expiry info for the current category and item
  const getEstimatedExpiryInfo = (itemName, category) => {
    if (category === 'other') {
      return 'Please set a custom expiry date';
    }

    // Common item-specific information
    const itemSpecificInfo = {
      // Fruits
      banana: '4 days', apple: '2 weeks', orange: '10 days', mango: '5 days',
      grapes: '1 week', strawberry: '3 days', berries: '3 days',
      
      // Vegetables  
      tomato: '1 week', carrot: '1 month', potato: '6 weeks', onion: '1 month',
      lettuce: '5 days', broccoli: '1 week', spinach: '5 days',
      
      // Dairy
      milk: '5 days', yogurt: '1 week', cheese: '2 weeks', butter: '3 weeks',
      
      // Meat
      chicken: '2 days', beef: '3 days', pork: '3 days', fish: '1 day'
    };

    const specificInfo = itemSpecificInfo[itemName?.toLowerCase()];
    if (specificInfo) {
      return `~${specificInfo} (estimated for ${itemName})`;
    }

    // Category defaults
    const categoryDefaults = {
      fruit: '~7 days (varies by fruit type)',
      vegetable: '~10 days (varies by vegetable type)', 
      dairy: '~5 days (check product label)',
      meat: '~3 days (keep refrigerated)'
    };

    return categoryDefaults[category] || '~1 week';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
        <p>Loading your fridge data...</p>
      </div>
    );
  }

  const expiringItems = getExpiringItems();
  const filteredItems = getFilteredAndSortedItems();
  const categoryStats = getCategoryStats();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          🧊 Smart Fridge Dashboard
        </h1>
        <p style={{ color: 'var(--gray-600)', margin: 0 }}>
          Manage your food inventory and track expiry dates intelligently
        </p>
      </div>

      {/* Urgent Alerts */}
      {expiringItems.length > 0 && (
        <div className="notification warning" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ {expiringItems.length} Item(s) Need Attention
            </h3>
            <button 
              className="btn btn-sm"
              onClick={() => setFilter('expiring')}
              style={{ background: 'var(--warning-color)', color: 'white' }}
            >
              View All
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {expiringItems.slice(0, 4).map(item => (
              <div key={item._id} style={{ 
                padding: '0.75rem', 
                background: 'rgba(255,255,255,0.8)', 
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{item.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  {getItemStatus(item.expiryDate) === 'expired' && ' (EXPIRED)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3" style={{ gap: '2rem', marginBottom: '2rem' }}>
        {/* Fridge Status Card */}
        <div className="fridge-status" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>🌡️ Live Fridge Status</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.9rem' }}>
                Last updated: {fridgeStatus.lastUpdated ? new Date(fridgeStatus.lastUpdated).toLocaleTimeString() : 'Now'}
              </p>
            </div>
            <button 
              onClick={fetchFridgeStatus}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div className="temperature-display">
            {fridgeStatus.temperature || '--'}°C
          </div>
          
          <div className="fridge-stats">
            <div className="stat-item">
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                {fridgeStatus.humidity || '--'}%
              </div>
              <div>Humidity</div>
            </div>
            <div className="stat-item">
              <div style={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                {fridgeStatus.powerStatus === 'on' ? '🟢 ON' : '🔴 OFF'}
              </div>
              <div>Power Status</div>
            </div>
            <div className="stat-item">
              <div style={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                {fridgeStatus.doorStatus === 'closed' ? '🚪 Closed' : '🚪 Open'}
              </div>
              <div>Door Status</div>
            </div>
          </div>
        </div>

        {/* Add Item Card */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ➕ Add New Item
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={addItem}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="form-control"
                  placeholder="e.g., Banana, Apple, Milk"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="form-control form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="form-control"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Custom Expiry Date for "Other" category */}
              {newItem.category === 'other' && (
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--error-color)' }}>
                    ⚠️ Expiry Date (Required for Other Items)
                  </label>
                  <input
                    type="date"
                    value={newItem.customExpiryDate}
                    onChange={(e) => setNewItem({ ...newItem, customExpiryDate: e.target.value })}
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]} // Minimum date is today
                    required
                    style={{ borderColor: 'var(--warning-color)' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                    💡 For fruits, vegetables, dairy, and meat, expiry dates are calculated automatically
                  </div>
                </div>
              )}

              {/* Auto-calculated expiry info for other categories */}
              {newItem.category !== 'other' && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--border-radius-md)',
                  marginBottom: '1rem',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--success-color)' }}>✅</span>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                      Auto-calculated Expiry Date
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                    Estimated shelf life: <strong>{getEstimatedExpiryInfo(newItem.name, newItem.category)}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    💡 Expiry dates are calculated automatically based on food science data. 
                    Store properly for best results.
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                📦 Add to Fridge
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Inventory Overview Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 style={{ margin: 0 }}>📊 Inventory Overview</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Items</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map(category => {
                  const totalItems = items.length;
                  const percentage = totalItems > 0 ? ((category.count / totalItems) * 100).toFixed(1) : 0;
                  const isSelected = filter === category.value;
                  
                  return (
                    <tr key={category.value} style={{ 
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                    }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span 
                            className="category-badge"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.label}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '600',
                          color: category.count > 0 ? 'var(--gray-900)' : 'var(--gray-400)'
                        }}>
                          {category.count}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '60px',
                            height: '8px',
                            backgroundColor: 'var(--gray-200)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: category.color,
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--border-radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: category.count > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: category.count > 0 ? 'var(--success-color)' : 'var(--error-color)'
                        }}>
                          {category.count > 0 ? '✅ In Stock' : '❌ Empty'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setFilter(category.value)}
                          className="btn btn-outline btn-sm"
                          style={{
                            backgroundColor: isSelected ? category.color : 'transparent',
                            color: isSelected ? 'white' : category.color,
                            borderColor: category.color,
                            fontSize: '0.75rem'
                          }}
                        >
                          {isSelected ? '✓ Viewing' : '👁️ View'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Summary Row */}
          <div style={{ 
            padding: '1rem 1.25rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderTop: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--gray-900)' }}>Total Items:</strong>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                {items.length}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setFilter('all')}
                className="btn btn-outline btn-sm"
                style={{ 
                  backgroundColor: filter === 'all' ? 'var(--primary-color)' : 'transparent',
                  color: filter === 'all' ? 'white' : 'var(--primary-color)',
                  borderColor: 'var(--primary-color)'
                }}
              >
                📦 View All
              </button>
              <button
                onClick={() => setFilter('expiring')}
                className="btn btn-outline btn-sm"
                style={{ 
                  backgroundColor: filter === 'expiring' ? 'var(--warning-color)' : 'transparent',
                  color: filter === 'expiring' ? 'white' : 'var(--warning-color)',
                  borderColor: 'var(--warning-color)'
                }}
              >
                ⚠️ Expiring Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>
              📦 Food Items ({filteredItems.length})
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Filter Dropdown */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control form-select"
                style={{ width: 'auto', minWidth: '150px' }}
              >
                <option value="all">All Items</option>
                <option value="expiring">🚨 Expiring Soon</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control form-select"
                style={{ width: 'auto', minWidth: '130px' }}
              >
                <option value="newest">Newest First</option>
                <option value="name">A-Z</option>
                <option value="expiry">By Expiry Date</option>
                <option value="category">By Category</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤷</div>
              <h4>No items found</h4>
              <p>
                {filter === 'all' 
                  ? "Your fridge is empty. Add some items above!"
                  : `No items in the ${filter} category.`
                }
              </p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="btn btn-outline"
                >
                  View All Items
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {filteredItems.map((item) => {
                const status = getItemStatus(item.expiryDate);
                const category = categories.find(cat => cat.value === item.category);
                
                return (
                  <div key={item._id} className={`food-item ${status}`} style={{
                    borderLeftColor: category?.color || 'var(--gray-400)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        background: category?.color || 'var(--gray-400)' 
                      }}></div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <strong style={{ 
                            textTransform: 'capitalize', 
                            fontSize: '1.1rem',
                            color: status === 'expired' ? 'var(--error-color)' : 'var(--gray-900)'
                          }}>
                            {item.name}
                          </strong>
                          
                          {status === 'expired' && <span style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>⚠️ EXPIRED</span>}
                          {status === 'expiring' && <span style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>⏰ EXPIRING</span>}
                          
                          <span style={{ 
                            background: category?.color || 'var(--gray-400)', 
                            color: 'white', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: 'var(--border-radius-sm)', 
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {category?.label.split(' ')[1] || item.category}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          <span>Added: {new Date(item.addedDate).toLocaleDateString()}</span>
                          <span style={{ margin: '0 0.75rem', color: 'var(--gray-400)' }}>•</span>
                          <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                          <span style={{ margin: '0 0.75rem', color: 'var(--gray-400)' }}>•</span>
                          <span>Qty: {item.quantity}</span>
                          {item.notes && (
                            <>
                              <span style={{ margin: '0 0.75rem', color: 'var(--gray-400)' }}>•</span>
                              <span style={{ fontStyle: 'italic' }}>{item.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteItem(item._id, item.name)}
                      className="btn btn-danger btn-sm"
                      style={{ minWidth: 'auto', padding: '0.5rem 0.75rem' }}
                      title={`Remove ${item.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Footer */}
      {items.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          background: 'var(--bg-tertiary)', 
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center'
        }}>
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {items.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Total Items</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                {items.filter(item => getItemStatus(item.expiryDate) === 'fresh').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Fresh Items</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                {items.filter(item => getItemStatus(item.expiryDate) === 'expiring').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Expiring Soon</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--error-color)' }}>
                {items.filter(item => getItemStatus(item.expiryDate) === 'expired').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Expired</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FridgeDashboard;
