import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api.js';
import { setAccessToken, setAuthFailureCallback, clearAccessToken } from '../api/client.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthFailure = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    clearAccessToken();
  }, []);

  useEffect(() => {
    setAuthFailureCallback(handleAuthFailure);
  }, [handleAuthFailure]);

  const bootstrapAuth = async () => {
    try {
      // 1. Attempt refresh using HttpOnly refresh cookie
      const token = await authApi.refreshAccessToken();
      
      if (token) {
        // 2. Call current-user endpoint
        const userRes = await authApi.getCurrentUser();
        if (userRes.success) {
          setUser(userRes.data);
          setIsAuthenticated(true);
        } else {
          handleAuthFailure();
        }
      }
    } catch (error) {
      // Refresh failed because user is not logged in or cookie expired
      // Treat as guest normally
      handleAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await authApi.register(firstName, lastName, email, password);
    if (res.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Backend logout failed', error);
    } finally {
      // Clear local state even if backend logout fails
      handleAuthFailure();
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshSession: bootstrapAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
