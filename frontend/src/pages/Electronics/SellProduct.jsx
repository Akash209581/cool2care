import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'smartphones',
    subcategory: '',
    brand: '',
    model: '',
    condition: 'good',
    quantity: 1,
    location: {
      city: '',
      state: '',
      country: 'United States',
      zipCode: '',
    },
    shipping: {
      freeShipping: false,
      shippingCost: 0,
      shippingTime: '3-5 days',
    },
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      display: '',
      battery: '',
      camera: '',
      connectivity: [],
      color: '',
      weight: '',
      dimensions: '',
      warranty: '',
    },
    accessories: [],
    tags: [],
    purchaseDate: '',
    reasonForSelling: '',
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    { 
      value: 'smartphones', 
      label: '📱 Smartphones',
      subcategories: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus', 'Other Android']
    },
    { 
      value: 'laptops', 
      label: '💻 Laptops',
      subcategories: ['MacBook', 'Windows Laptop', 'Gaming Laptop', 'Chromebook', 'Workstation']
    },
    { 
      value: 'tablets', 
      label: '📟 Tablets',
      subcategories: ['iPad', 'Android Tablet', 'Windows Tablet', 'E-Reader']
    },
    { 
      value: 'gaming', 
      label: '🎮 Gaming',
      subcategories: ['PlayStation', 'Xbox', 'Nintendo', 'Gaming PC', 'Gaming Accessories']
    },
    { 
      value: 'audio', 
      label: '🎧 Audio',
      subcategories: ['Headphones', 'Speakers', 'Earbuds', 'Sound Systems', 'Microphones']
    },
    { 
      value: 'cameras', 
      label: '📷 Cameras',
      subcategories: ['DSLR', 'Mirrorless', 'Action Camera', 'Instant Camera', 'Camera Accessories']
    },
    { 
      value: 'home-appliances', 
      label: '🏠 Home Appliances',
      subcategories: ['Kitchen', 'Cleaning', 'Air Care', 'Personal Care']
    },
    { 
      value: 'smart-home', 
      label: '🏡 Smart Home',
      subcategories: ['Smart Speakers', 'Security', 'Lighting', 'Thermostats', 'Smart Displays']
    },
    { 
      value: 'accessories', 
      label: '🔌 Accessories',
      subcategories: ['Phone Cases', 'Chargers', 'Cables', 'Screen Protectors', 'Mounts']
    },
  ];

  const conditionOptions = [
    { value: 'new', label: 'New', description: 'Brand new, unopened item' },
    { value: 'like-new', label: 'Like New', description: 'Used but in excellent condition' },
    { value: 'good', label: 'Good', description: 'Used with minor signs of wear' },
    { value: 'fair', label: 'Fair', description: 'Used with noticeable wear' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear, functional issues' },
  ];

  useEffect(() => {
    // Check if user is a seller
    if (!user?.isSeller) {
      toast.error('You need to become a seller first');
      navigate('/become-seller');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name === 'accessories' || name === 'tags') {
      // Handle arrays
      const items = value.split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prev => ({ ...prev, [name]: items }));
    } else if (name === 'connectivity') {
      // Handle connectivity array for specifications
      const items = value.split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          connectivity: items
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    // In a real app, you'd upload to a service like Cloudinary
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          url: event.target.result,
          alt: file.name,
          isPrimary: prev.length === 0 // First image is primary
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const productData = {
        ...formData,
        images: images.map(img => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary })),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        quantity: parseInt(formData.quantity),
        shipping: {
          ...formData.shipping,
          shippingCost: parseFloat(formData.shipping.shippingCost) || 0
        }
      };

      const res = await axios.post('/api/electronics', productData);
      toast.success('Product listed successfully!');
      navigate(`/electronics/${res.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const selectedCondition = conditionOptions.find(cond => cond.value === formData.condition);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Product title, category, and condition' },
    { id: 2, title: 'Details', description: 'Price, specifications, and description' },
    { id: 3, title: 'Images', description: 'Upload product photos' },
    { id: 4, title: 'Shipping', description: 'Location and shipping options' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          💼 Sell Your Electronics
        </h1>
        <p style={{ color: 'var(--gray-600)', margin: 0 }}>
          List your electronics and reach thousands of potential buyers
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: currentStep >= step.id ? 'var(--primary-color)' : 'var(--gray-300)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  {step.id}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontWeight: '500', 
                    fontSize: '0.875rem',
                    color: currentStep >= step.id ? 'var(--primary-color)' : 'var(--gray-600)'
                  }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: currentStep > step.id ? 'var(--primary-color)' : 'var(--gray-300)',
                  margin: '0 1rem',
                  alignSelf: 'flex-start',
                  marginTop: '20px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ marginBottom: '2rem' }}>📝 Basic Information</h3>
                
                <div className="form-group">
                  <label className="form-label">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    className="form-control"
                    placeholder="e.g., iPhone 14 Pro 256GB Space Black"
                    required
                    maxLength={100}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    {formData.title.length}/100 characters
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={onChange}
                      className="form-control form-select"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subcategory</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={onChange}
                      className="form-control form-select"
                    >
                      <option value="">Select subcategory</option>
                      {selectedCategory?.subcategories.map(sub => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={onChange}
                      className="form-control"
                      placeholder="e.g., Apple, Samsung, Google"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={onChange}
                      className="form-control"
                      placeholder="e.g., iPhone 14 Pro, Galaxy S23"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Condition *</label>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {conditionOptions.map(condition => (
                      <label
                        key={condition.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          border: formData.condition === condition.value ? '2px solid var(--primary-color)' : '1px solid var(--gray-200)',
                          borderRadius: 'var(--border-radius-md)',
                          cursor: 'pointer',
                          background: formData.condition === condition.value ? 'rgba(37, 99, 235, 0.05)' : 'white'
                        }}
                      >
                        <input
                          type="radio"
                          name="condition"
                          value={condition.value}
                          checked={formData.condition === condition.value}
                          onChange={onChange}
                        />
                        <div>
                          <div style={{ fontWeight: '500' }}>{condition.label}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            {condition.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ marginBottom: '2rem' }}>💰 Pricing & Details</h3>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Selling Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={onChange}
                      className="form-control"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Original Price ($)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={onChange}
                      className="form-control"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                      Optional: Shows discount percentage
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity Available *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onChange}
                    className="form-control"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    className="form-control"
                    rows="6"
                    placeholder="Describe your product's features, condition, and any important details..."
                    required
                    maxLength={1000}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    {formData.description.length}/1000 characters
                  </div>
                </div>

                {/* Specifications */}
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem' }}>⚙️ Technical Specifications</h4>
                  <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Processor</label>
                      <input
                        type="text"
                        name="specifications.processor"
                        value={formData.specifications.processor}
                        onChange={onChange}
                        className="form-control"
                        placeholder="e.g., A16 Bionic, Snapdragon 8 Gen 1"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">RAM</label>
                      <input
                        type="text"
                        name="specifications.ram"
                        value={formData.specifications.ram}
                        onChange={onChange}
                        className="form-control"
                        placeholder="e.g., 8GB, 16GB"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Storage</label>
                      <input
                        type="text"
                        name="specifications.storage"
                        value={formData.specifications.storage}
                        onChange={onChange}
                        className="form-control"
                        placeholder="e.g., 256GB, 1TB SSD"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Display</label>
                      <input
                        type="text"
                        name="specifications.display"
                        value={formData.specifications.display}
                        onChange={onChange}
                        className="form-control"
                        placeholder="e.g., 6.1 inch OLED, 13.3 inch Retina"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Color</label>
                      <input
                        type="text"
                        name="specifications.color"
                        value={formData.specifications.color}
                        onChange={onChange}
                        className="form-control"
                        placeholder="e.g., Space Black, Silver"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Warranty</label>
                      <input
                        type="text"
                        name="specifications.warranty"
                        value={formData.specifications.warranty}
                        onChange={onChange}
                        className="form-control"
                        placeholder="e.g., 1 year Apple warranty, No warranty"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">What's Included</label>
                    <input
                      type="text"
                      name="accessories"
                      value={formData.accessories.join(', ')}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Box, Charger, Cable, Manual (comma separated)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags.join(', ')}
                      onChange={onChange}
                      className="form-control"
                      placeholder="unlocked, fast charging, gaming (comma separated)"
                    />
                  </div>
                </div>

                {formData.condition !== 'new' && (
                  <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Purchase Date</label>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={onChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Reason for Selling</label>
                      <input
                        type="text"
                        name="reasonForSelling"
                        value={formData.reasonForSelling}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Upgrade, not using, need cash"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Images */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ marginBottom: '2rem' }}>📸 Product Photos</h3>

                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>💡 Photo Tips</h4>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                    <li>Use good lighting and take photos from multiple angles</li>
                    <li>Show any wear, scratches, or defects clearly</li>
                    <li>Include photos of accessories and packaging</li>
                    <li>First photo will be used as the main listing image</li>
                    <li>Maximum 10 photos allowed</li>
                  </ul>
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Photos *</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control"
                    style={{ marginBottom: '1rem' }}
                  />
                </div>

                {images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {images.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: 'var(--border-radius-md)',
                            border: image.isPrimary ? '3px solid var(--primary-color)' : '1px solid var(--gray-200)'
                          }}
                        />
                        
                        {image.isPrimary && (
                          <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            left: '0.5rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            Main Photo
                          </div>
                        )}

                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          display: 'flex',
                          gap: '0.25rem'
                        }}>
                          {!image.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              style={{
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                              title="Set as main photo"
                            >
                              ⭐
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div style={{
                    border: '2px dashed var(--gray-300)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--gray-600)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
                    <h4>No photos uploaded yet</h4>
                    <p>Add photos to make your listing more attractive to buyers</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Shipping */}
            {currentStep === 4 && (
              <div>
                <h3 style={{ marginBottom: '2rem' }}>🚚 Location & Shipping</h3>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem' }}>📍 Your Location</h4>
                  <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={onChange}
                        className="form-control"
                        placeholder="San Francisco"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={onChange}
                        className="form-control"
                        placeholder="California"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        name="location.zipCode"
                        value={formData.location.zipCode}
                        onChange={onChange}
                        className="form-control"
                        placeholder="94102"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={onChange}
                        className="form-control"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem' }}>📦 Shipping Options</h4>
                  
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="shipping.freeShipping"
                        checked={formData.shipping.freeShipping}
                        onChange={onChange}
                      />
                      <span style={{ fontWeight: '500' }}>Offer free shipping</span>
                    </label>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                      Include shipping cost in your price for better visibility
                    </div>
                  </div>

                  {!formData.shipping.freeShipping && (
                    <div className="form-group">
                      <label className="form-label">Shipping Cost ($)</label>
                      <input
                        type="number"
                        name="shipping.shippingCost"
                        value={formData.shipping.shippingCost}
                        onChange={onChange}
                        className="form-control"
                        placeholder="15.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Estimated Delivery Time</label>
                    <select
                      name="shipping.shippingTime"
                      value={formData.shipping.shippingTime}
                      onChange={onChange}
                      className="form-control form-select"
                    >
                      <option value="1-2 days">1-2 days</option>
                      <option value="3-5 days">3-5 days</option>
                      <option value="5-7 days">5-7 days</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2-3 weeks">2-3 weeks</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <h4 style={{ marginBottom: '1rem' }}>📋 Listing Summary</h4>
                  <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div><strong>Title:</strong> {formData.title || 'Not specified'}</div>
                    <div><strong>Category:</strong> {selectedCategory?.label}</div>
                    <div><strong>Brand & Model:</strong> {formData.brand} {formData.model}</div>
                    <div><strong>Condition:</strong> {selectedCondition?.label}</div>
                    <div><strong>Price:</strong> ${formData.price || '0.00'}</div>
                    <div><strong>Photos:</strong> {images.length} uploaded</div>
                    <div><strong>Shipping:</strong> {formData.shipping.freeShipping ? 'Free' : `$${formData.shipping.shippingCost || '0.00'}`}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-200)' }}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn btn-outline"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="btn btn-primary"
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.brand || !formData.model)) ||
                    (currentStep === 2 && (!formData.price || !formData.description)) ||
                    (currentStep === 3 && images.length === 0)
                  }
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading || !formData.location.city || !formData.location.state}
                >
                  {loading ? (
                    <>
                      <span className="loading"></span>
                      <span style={{ marginLeft: '0.5rem' }}>Publishing...</span>
                    </>
                  ) : (
                    <>🚀 Publish Listing</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellProduct;
