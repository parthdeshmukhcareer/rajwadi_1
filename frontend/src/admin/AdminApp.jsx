import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLogin from './pages/AdminLogin';
import './admin.css';
import './components/components.css';
import './pages/pages.css';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductCreate from './pages/ProductCreate';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Payments from './pages/Payments';
import Refunds from './pages/Refunds';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';

// Placeholders for other pages
const Customers = () => <div className="page-header"><h1>Customers</h1></div>;
const Settings = () => <div className="page-header"><h1>Settings</h1></div>;

const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <div className="admin-app">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="categories" element={<Categories />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="payments" element={<Payments />} />
              <Route path="refunds" element={<Refunds />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="customers" element={<Customers />} />
              <Route path="refunds" element={<Refunds />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          
          {/* Catch all for admin */}
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </AdminAuthProvider>
  );
};

export default AdminApp;
