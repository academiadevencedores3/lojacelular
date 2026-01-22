import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import SellerPOS from './pages/SellerPOS';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="success" element={<Success />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/seller-pos" element={<SellerPOS />} />
            </Routes>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;