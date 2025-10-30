import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    model: '',
    specifications: {
      display: '',
      processor: '',
      ram: '',
      storage: '',
      camera: '',
      battery: '',
      os: '',
      connectivity: '',
      dimensions: '',
      weight: '',
      warranty: '',
      color: ''
    },
    features: [],
    stock: '',
    images: [],
    tags: []
  });
  
  const [loading, setLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditing = Boolean(id);

  const categories = [
    'smartphones',
    'laptops',
    'tablets',
    'headphones',
    'speakers',
    'cameras',
    'gaming',
    'wearables',
    'accessories',
    'home-appliances'
  ];

  const subcategories = {
    smartphones: ['Android', 'iPhone', 'Feature Phones'],
    laptops: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'Chromebooks'],
    tablets: ['Android Tablets', 'iPads', '2-in-1 Tablets'],
    headphones: ['Wireless', 'Wired', 'Gaming Headsets', 'Earbuds'],
    speakers: ['Bluetooth Speakers', 'Smart Speakers', 'Soundbars'],
    cameras: ['DSLR', 'Mirrorless', 'Action Cameras', 'Security Cameras'],
    gaming: ['Consoles', 'Controllers', 'Gaming Accessories'],
    wearables: ['Smartwatches', 'Fitness Trackers', 'Smart Bands'],
    accessories: ['Chargers', 'Cases', 'Screen Protectors', 'Cables'],
    'home-appliances': ['Smart Home', 'Kitchen Appliances', 'Air Purifiers']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index, url) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
    
    // Update formData with valid URLs
    const validUrls = newUrls.filter(url => url.trim() !== '');
    setFormData(prev => ({
      ...prev,
      images: validUrls
    }));
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    
    const validUrls = newUrls.filter(url => url.trim() !== '');
    setFormData(prev => ({
      ...prev,
      images: validUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('sellerToken');
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      };

      let res;
      if (isEditing) {
        res = await axios.put(`/api/seller/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully');
      } else {
        res = await axios.post('/api/seller/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added successfully');
      }

      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0 }}>
            {isEditing ? 'Update your product information' : 'Add a new product to your store'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/seller/products')} 
          className="btn btn-outline"
        >
          ← Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Product Information */}
          <div>
            {/* Basic Information */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0 }}>📝 Basic Information</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="4"
                      placeholder="Describe your product in detail"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Subcategory
                      </label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={!formData.category}
                      >
                        <option value="">Select Subcategory</option>
                        {formData.category && subcategories[formData.category]?.map(subcat => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Product brand"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Model
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Product model"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0 }}>🔧 Specifications</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={`specifications.${key}`}
                        value={value}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0 }}>⭐ Features</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    className="form-input"
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button 
                    type="button" 
                    onClick={addFeature}
                    className="btn btn-outline"
                  >
                    Add
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.features.map((feature, index) => (
                    <span 
                      key={index}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ margin: 0 }}>🏷️ Tags</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="form-input"
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button 
                    type="button" 
                    onClick={addTag}
                    className="btn btn-outline"
                  >
                    Add
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'var(--gray-200)',
                        color: 'var(--gray-700)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--gray-700)', 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Pricing & Stock */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0 }}>💰 Pricing & Stock</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ margin: 0 }}>📷 Product Images</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {imageUrls.map((url, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="form-input"
                        placeholder="Enter image URL"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="btn btn-danger"
                          style={{ padding: '0.5rem' }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="btn btn-outline"
                  >
                    ➕ Add Another Image
                  </button>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <h5 style={{ marginBottom: '0.5rem' }}>Preview:</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                        {formData.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Product ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: 'var(--border-radius)',
                              border: '1px solid var(--gray-200)'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Saving...' : (isEditing ? '💾 Update Product' : '➕ Add Product')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellProduct;