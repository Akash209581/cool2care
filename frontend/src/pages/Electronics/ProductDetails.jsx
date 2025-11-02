import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: '',
    cons: '',
  });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/electronics/${id}`);
      setProduct(res.data);
      setIsFavorited(res.data.favorites?.includes(user?._id));
    } catch (error) {
      toast.error('Product not found');
      navigate('/electronics');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/product/${id}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to favorites');
      return;
    }

    try {
      const res = await api.put(`/api/electronics/${id}/favorite`);
      setIsFavorited(!isFavorited);
      toast.success(res.data.message);
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      const reviewData = {
        productId: id,
        ...reviewForm,
        pros: reviewForm.pros.split(',').map(item => item.trim()).filter(Boolean),
        cons: reviewForm.cons.split(',').map(item => item.trim()).filter(Boolean),
      };

      await api.post('/api/reviews', reviewData);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '', pros: '', cons: '' });
      fetchReviews();
      fetchProduct(); // Refresh to update ratings
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card">
          <div className="card-body text-center">
            <h3>Product not found</h3>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/electronics" className="btn btn-primary">
              Browse Electronics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const conditionColors = {
    'new': 'var(--success-color)',
    'like-new': 'var(--info-color)',
    'good': 'var(--warning-color)',
    'fair': 'var(--gray-500)',
    'poor': 'var(--error-color)',
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
        <Link to="/electronics" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
          Electronics
        </Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span>{product.title}</span>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '3rem', marginBottom: '3rem' }}>
        {/* Product Images */}
        <div>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {product.images?.length > 0 ? (
              <img
                src={product.images[activeImageIndex]?.url}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '1px solid var(--gray-200)',
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                background: 'var(--gray-100)',
                borderRadius: 'var(--border-radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                color: 'var(--gray-400)',
              }}>
                📱
              </div>
            )}

            {hasDiscount && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'var(--error-color)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--border-radius-md)',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${product.title} ${index + 1}`}
                  onClick={() => setActiveImageIndex(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    border: index === activeImageIndex ? '2px solid var(--primary-color)' : '1px solid var(--gray-200)',
                    transition: 'all var(--transition-fast)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{product.title}</h1>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
              {product.brand} • {product.model}
            </p>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < Math.floor(product.ratings?.average || 0) ? 'var(--accent-color)' : 'var(--gray-300)',
                    fontSize: '1.25rem',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ color: 'var(--gray-600)' }}>
              {product.ratings?.average?.toFixed(1) || 'No rating'} ({product.ratings?.count || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                ${product.price}
              </span>
              {hasDiscount && (
                <span style={{
                  fontSize: '1.5rem',
                  color: 'var(--gray-500)',
                  textDecoration: 'line-through',
                }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p style={{ color: 'var(--success-color)', fontWeight: '500', margin: 0 }}>
                You save ${(product.originalPrice - product.price).toFixed(2)}!
              </p>
            )}
          </div>

          {/* Condition */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              background: conditionColors[product.condition] || 'var(--gray-500)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius-md)',
              fontWeight: '500',
              textTransform: 'capitalize',
            }}>
              {product.condition.replace('-', ' ')} Condition
            </span>
          </div>

          {/* Location & Shipping */}
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>📍 Location:</span>
              <span>{product.location?.city || 'Not specified'}, {product.location?.state || ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>🚚 Shipping:</span>
              <span style={{ color: product.shipping?.freeShipping ? 'var(--success-color)' : 'inherit' }}>
                {product.shipping?.freeShipping ? 'Free Shipping' : `$${product.shipping?.shippingCost || 0}`}
              </span>
            </div>
            {product.shipping?.shippingTime && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>⏱️ Delivery:</span>
                <span>{product.shipping.shippingTime}</span>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--border-radius-sm)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity || 1, quantity + 1))}
                  className="quantity-btn"
                >
                  +
                </button>
                <span style={{ marginLeft: '1rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  ({product.quantity || 0} available)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!product.quantity || product.quantity === 0}
              >
                🛒 Add to Cart
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline'}`}
                style={{ minWidth: 'auto', padding: '0.75rem 1rem' }}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* Seller Info */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-body">
              <h4 style={{ marginBottom: '1rem' }}>Seller Information</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {product.seller?.sellerProfile?.businessName || product.seller?.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Rating: {product.seller?.sellerProfile?.rating?.average?.toFixed(1) || 'New seller'}
                    ({product.seller?.sellerProfile?.rating?.count || 0} reviews)
                  </div>
                </div>
                <div>
                  {product.seller?.sellerProfile?.isVerified && (
                    <span style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>
                      ✅ Verified Seller
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description and Specs */}
      <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>📝 Description</h3>
          </div>
          <div className="card-body">
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {product.description || 'No description available.'}
            </p>
            
            {product.accessories && product.accessories.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>📦 What's Included:</h4>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  {product.accessories.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.reasonForSelling && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>💭 Reason for Selling:</h4>
                <p style={{ margin: 0 }}>{product.reasonForSelling}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>⚙️ Specifications</h3>
          </div>
          <div className="card-body">
            {product.specifications ? (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {Object.entries(product.specifications).map(([key, value]) => {
                  if (!value || key === 'other') return null;
                  return (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                      <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--gray-600)' }}>No specifications available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>⭐ Reviews ({reviews.length})</h3>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn btn-primary btn-sm"
              >
                ✍️ Write Review
              </button>
            )}
          </div>
        </div>
        
        <div className="card-body">
          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
              <h4 style={{ marginBottom: '1rem' }}>Write a Review</h4>
              
              <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    className="form-control form-select"
                    required
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>
                        {num} Star{num !== 1 ? 's' : ''} - {num === 5 ? 'Excellent' : num === 4 ? 'Good' : num === 3 ? 'Average' : num === 2 ? 'Poor' : 'Terrible'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="form-control"
                    placeholder="Summarize your review"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="form-control"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pros (comma separated)</label>
                  <input
                    type="text"
                    value={reviewForm.pros}
                    onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                    className="form-control"
                    placeholder="Great battery, fast shipping..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cons (comma separated)</label>
                  <input
                    type="text"
                    value={reviewForm.cons}
                    onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                    className="form-control"
                    placeholder="Scratches on screen, slow delivery..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  📝 Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h4>No reviews yet</h4>
              <p>Be the first to review this product!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {reviews.map(review => (
                <div key={review._id} style={{ padding: '1.5rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--border-radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500' }}>{review.user?.name}</span>
                        {review.isVerifiedPurchase && (
                          <span style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>
                            ✅ Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < review.rating ? 'var(--accent-color)' : 'var(--gray-300)',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 style={{ marginBottom: '0.5rem' }}>{review.title}</h4>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{review.comment}</p>

                  {(review.pros?.length > 0 || review.cons?.length > 0) && (
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                      {review.pros?.length > 0 && (
                        <div>
                          <h5 style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }}>👍 Pros:</h5>
                          <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                            {review.pros.map((pro, index) => (
                              <li key={index}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {review.cons?.length > 0 && (
                        <div>
                          <h5 style={{ color: 'var(--error-color)', marginBottom: '0.5rem' }}>👎 Cons:</h5>
                          <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                            {review.cons.map((con, index) => (
                              <li key={index}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
