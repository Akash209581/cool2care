import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const BecomeSeller = () => {
  const { user, becomeSeller } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: user?.name || '',
    businessType: 'individual',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect if already a seller
  React.useEffect(() => {
    if (user?.isSeller) {
      toast.info('You are already a seller!');
      navigate('/sell');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await becomeSeller(formData);
    
    if (result.success) {
      navigate('/sell');
    }
    setLoading(false);
  };

  const businessTypes = [
    { 
      value: 'individual', 
      label: '👤 Individual', 
      description: 'Selling personal items occasionally',
      features: ['Easy setup', 'No business verification required', 'Personal selling limits']
    },
    { 
      value: 'business', 
      label: '🏪 Small Business', 
      description: 'Regular selling as a small business',
      features: ['Higher selling limits', 'Business analytics', 'Priority support']
    },
    { 
      value: 'company', 
      label: '🏢 Company', 
      description: 'Large-scale commercial operations',
      features: ['Unlimited listings', 'Advanced analytics', 'API access', 'Dedicated support']
    },
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Earn Money',
      description: 'Turn your unused electronics into cash and reach thousands of buyers'
    },
    {
      icon: '🛡️',
      title: 'Secure Platform',
      description: 'Protected transactions with buyer and seller safeguards'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your sales performance, views, and customer insights'
    },
    {
      icon: '🚚',
      title: 'Shipping Support',
      description: 'Integrated shipping labels and tracking for easy fulfillment'
    },
    {
      icon: '⭐',
      title: 'Build Reputation',
      description: 'Earn reviews and build trust with our rating system'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Get help from our dedicated seller support team anytime'
    },
  ];

  const steps = [
    {
      id: 1,
      title: 'Business Information',
      description: 'Tell us about your selling intentions'
    },
    {
      id: 2,
      title: 'Agreement',
      description: 'Review and accept seller terms'
    },
  ];

  if (user?.isSeller) {
    return null; // Will redirect
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '4rem',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        color: 'white',
        borderRadius: 'var(--border-radius-xl)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          💼 Become a Seller
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Join thousands of sellers and start earning from your electronics today
        </p>
        <div style={{ fontSize: '1rem', opacity: 0.8 }}>
          ✅ Free to join • ✅ No monthly fees • ✅ Start selling immediately
        </div>
      </div>

      {/* Benefits Grid */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Sell on Cool2Care?</h2>
        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {benefits.map((benefit, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h4 style={{ marginBottom: '1rem' }}>{benefit.title}</h4>
                <p style={{ color: 'var(--gray-600)', margin: 0, lineHeight: '1.6' }}>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Form */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Steps */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: currentStep >= step.id ? 'var(--primary-color)' : 'var(--gray-300)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}>
                    {step.id}
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: '200px' }}>
                    <div style={{ 
                      fontWeight: '500', 
                      marginBottom: '0.25rem',
                      color: currentStep >= step.id ? 'var(--primary-color)' : 'var(--gray-600)'
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div style={{
                    width: '100px',
                    height: '3px',
                    background: currentStep > step.id ? 'var(--primary-color)' : 'var(--gray-300)',
                    margin: '0 2rem',
                    alignSelf: 'flex-start',
                    marginTop: '25px'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div>
                  <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    📋 Business Information
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Business/Store Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Enter your business or preferred seller name"
                      required
                    />
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                      This will be displayed to buyers on your listings
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Type *</label>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {businessTypes.map(type => (
                        <label
                          key={type.value}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            padding: '1.5rem',
                            border: formData.businessType === type.value ? '2px solid var(--primary-color)' : '1px solid var(--gray-200)',
                            borderRadius: 'var(--border-radius-lg)',
                            cursor: 'pointer',
                            background: formData.businessType === type.value ? 'rgba(37, 99, 235, 0.05)' : 'white',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <input
                            type="radio"
                            name="businessType"
                            value={type.value}
                            checked={formData.businessType === type.value}
                            onChange={onChange}
                            style={{ marginTop: '0.25rem' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '600', 
                              fontSize: '1.125rem', 
                              marginBottom: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              {type.label}
                            </div>
                            <div style={{ 
                              color: 'var(--gray-600)', 
                              marginBottom: '1rem',
                              lineHeight: '1.5'
                            }}>
                              {type.description}
                            </div>
                            <div style={{ display: 'grid', gap: '0.25rem' }}>
                              {type.features.map((feature, index) => (
                                <div key={index} style={{ 
                                  fontSize: '0.875rem',
                                  color: 'var(--gray-700)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <span style={{ color: 'var(--success-color)' }}>✓</span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={onChange}
                      className="form-control"
                      rows="4"
                      placeholder="Tell buyers about your business, what types of electronics you sell, your experience, etc. (Optional but recommended)"
                      maxLength={500}
                    />
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                      {formData.description.length}/500 characters
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Agreement */}
              {currentStep === 2 && (
                <div>
                  <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    📝 Seller Agreement
                  </h3>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>📋 Review Your Information</h4>
                    <div style={{ 
                      padding: '1.5rem', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: 'var(--border-radius-md)' 
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Business Name:</strong> {formData.businessName}
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Business Type:</strong> {businessTypes.find(t => t.value === formData.businessType)?.label}
                      </div>
                      <div>
                        <strong>Description:</strong> {formData.description || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>📜 Seller Terms & Conditions</h4>
                    <div style={{ 
                      maxHeight: '300px', 
                      overflow: 'auto', 
                      padding: '1.5rem',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'white'
                    }}>
                      <h5>1. Account Responsibilities</h5>
                      <p style={{ color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        As a seller on Cool2Care, you agree to provide accurate product descriptions, 
                        respond to buyer inquiries promptly, and ship items within the stated timeframe.
                      </p>

                      <h5>2. Product Listings</h5>
                      <p style={{ color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        All listings must be for legitimate electronics in working condition. 
                        Prohibited items include stolen goods, counterfeit products, and items that 
                        violate intellectual property rights.
                      </p>

                      <h5>3. Fees and Payments</h5>
                      <p style={{ color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Cool2Care charges a small transaction fee on successful sales to maintain 
                        the platform. Payments are processed securely and deposited to your account 
                        within 2-5 business days after delivery confirmation.
                      </p>

                      <h5>4. Customer Service</h5>
                      <p style={{ color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Maintain professional communication with buyers, resolve disputes fairly, 
                        and provide excellent customer service to build your reputation.
                      </p>

                      <h5>5. Account Termination</h5>
                      <p style={{ color: 'var(--gray-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Cool2Care reserves the right to suspend or terminate seller accounts 
                        that violate these terms or engage in fraudulent activities.
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'var(--success-color)', 
                    color: 'white',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: '2rem'
                  }}>
                    <h4 style={{ marginBottom: '1rem', color: 'white' }}>🎉 Ready to Start Selling?</h4>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      By submitting this form, you agree to our seller terms and conditions. 
                      You can start listing your electronics immediately after approval!
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '2rem',
                borderTop: '1px solid var(--gray-200)'
              }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="btn btn-outline"
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="btn btn-primary"
                    disabled={!formData.businessName || !formData.businessType}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading"></span>
                        <span style={{ marginLeft: '0.5rem' }}>Setting up your account...</span>
                      </>
                    ) : (
                      <>🚀 Become a Seller</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>❓ Frequently Asked Questions</h2>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {[
            {
              question: "How much does it cost to sell?",
              answer: "It's free to join and list your items. We only charge a small transaction fee when you make a sale."
            },
            {
              question: "How do I get paid?",
              answer: "Payments are processed automatically after the buyer confirms receipt. Funds are deposited to your account within 2-5 business days."
            },
            {
              question: "What can I sell?",
              answer: "You can sell new or used electronics including phones, laptops, gaming equipment, and more. Items must be in working condition."
            },
            {
              question: "How do I handle shipping?",
              answer: "You're responsible for packaging and shipping items to buyers. We provide shipping labels and tracking integration."
            },
            {
              question: "What if there's a problem with my order?",
              answer: "Our support team helps resolve any issues between buyers and sellers. We also offer buyer and seller protection."
            }
          ].map((faq, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                  {faq.question}
                </h4>
                <p style={{ margin: 0, color: 'var(--gray-700)', lineHeight: '1.6' }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
