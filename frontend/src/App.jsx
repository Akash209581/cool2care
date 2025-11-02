import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SellerProtectedRoute from './components/SellerProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Smart Fridge Pages
import FridgeDashboard from './pages/FridgeDashboard';

// Electronics Marketplace Pages
import ElectronicsHome from './pages/Electronics/ElectronicsHome';
import ProductDetails from './pages/Electronics/ProductDetails';
import Cart from './pages/Electronics/Cart';
import Orders from './pages/Electronics/Orders';

// Seller Pages
import SellerLogin from './pages/SellerLogin.jsx'
import SellerRegister from './pages/SellerRegister.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import SellerProfile from './pages/SellerProfile.jsx'
import MyProducts from './pages/MyProducts.jsx'
import SellProduct from './pages/SellProduct.jsx'
import SellerOrders from './pages/SellerOrders.jsx'
import SellerAnalytics from './pages/SellerAnalytics.jsx'

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
            />

            {/* Electronics Marketplace - Public */}
            <Route path="/electronics" element={<ElectronicsHome />} />
            <Route path="/electronics/:id" element={<ProductDetails />} />

            {/* Seller Routes - Public */}
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/register" element={<SellerRegister />} />

            {/* Seller Dashboard - Protected */}
            <Route path="/seller/dashboard" element={
              <SellerProtectedRoute>
                <SellerDashboard />
              </SellerProtectedRoute>
            } />
            <Route path="/seller/profile" element={
              <SellerProtectedRoute>
                <SellerProfile />
              </SellerProtectedRoute>
            } />
            <Route path="/seller/products" element={
              <SellerProtectedRoute>
                <MyProducts />
              </SellerProtectedRoute>
            } />
            <Route path="/seller/products/add" element={
              <SellerProtectedRoute>
                <SellProduct />
              </SellerProtectedRoute>
            } />
            <Route path="/seller/products/edit/:id" element={
              <SellerProtectedRoute>
                <SellProduct />
              </SellerProtectedRoute>
            } />
            <Route path="/seller/orders" element={
              <SellerProtectedRoute>
                <SellerOrders />
              </SellerProtectedRoute>
            } />
            <Route path="/seller/analytics" element={
              <SellerProtectedRoute>
                <SellerAnalytics />
              </SellerProtectedRoute>
            } />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Smart Fridge Routes */}
            <Route path="/fridge" element={
              <ProtectedRoute>
                <FridgeDashboard />
              </ProtectedRoute>
            } />

            {/* Electronics Marketplace - User Protected */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />

            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={
              <div className="container py-4 text-center">
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <div style={{ marginTop: '2rem' }}>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;