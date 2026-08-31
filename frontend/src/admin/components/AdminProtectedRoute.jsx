import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = () => {
  const { isAdminAuthenticated, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div className="admin-app" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '18px', color: 'var(--admin-primary)' }}>Loading Admin Session...</div>
      </div>
    );
  }

  // Redirect to normal account page if not admin to prevent access to admin login page
  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/account" replace />;
};

export default AdminProtectedRoute;
