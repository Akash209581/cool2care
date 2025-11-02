import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      <p style={{ color: 'var(--gray-600)' }}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
