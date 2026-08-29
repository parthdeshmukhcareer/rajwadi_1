import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApiRequest, refreshAdminSession, clearAdminAccessToken, setAdminAccessToken } from '../services/admin.client';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAdminAuthFailure = useCallback(() => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    clearAdminAccessToken();
  }, []);

  const bootstrapAdminAuth = async () => {
    try {
      // 1. Attempt refresh using HttpOnly refresh cookie
      const token = await refreshAdminSession();
      
      if (token) {
        // 2. Call current-user endpoint to verify role
        const userRes = await adminApiRequest('/auth/me', { method: 'GET' });
        
        if (userRes.success && userRes.data.role === 'ADMIN') {
          setAdminUser(userRes.data);
          setIsAdminAuthenticated(true);
        } else {
          // Reject if not ADMIN (even if a customer is logged in)
          handleAdminAuthFailure();
        }
      } else {
        handleAdminAuthFailure();
      }
    } catch (error) {
      handleAdminAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAdminAuth();
  }, []);

  const adminLogin = async (email, password) => {
    const res = await adminApiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, { skipAuthRefresh: true });

    if (res.success) {
      if (res.data.user.role === 'ADMIN') {
        setAdminAccessToken(res.data.accessToken);
        setAdminUser(res.data.user);
        setIsAdminAuthenticated(true);
        return { success: true };
      } else {
        // Valid credentials but not an admin
        clearAdminAccessToken();
        return { success: false, error: 'Unauthorized: Admin access required.' };
      }
    }
    return res;
  };

  const adminLogout = async () => {
    try {
      await adminApiRequest('/auth/logout', { method: 'POST' }, { skipAuthRefresh: true });
    } catch (error) {
      console.error('Admin backend logout failed', error);
    } finally {
      handleAdminAuthFailure();
    }
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    isLoading,
    adminLogin,
    adminLogout,
    refreshAdminSession: bootstrapAdminAuth
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
