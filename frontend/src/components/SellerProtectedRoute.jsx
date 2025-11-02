import React from 'react';
import { Navigate } from 'react-router-dom';

const SellerProtectedRoute = ({ children }) => {
  const sellerToken = localStorage.getItem('sellerToken');
  
  if (!sellerToken) {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
};

export default SellerProtectedRoute;
