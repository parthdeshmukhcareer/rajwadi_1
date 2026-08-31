/**
 * Admin API Client
 * 
 * Reuses the existing robust API client from the customer frontend.
 * This ensures we share the same fetch logic, error handling, 
 * base URL, and automatic HttpOnly refresh cookie handling 
 * without duplicating code.
 */
import { apiRequest, refreshSession, clearAccessToken, setAccessToken } from '../../api/client';

export const adminApiRequest = (endpoint, options = {}, customConfig = {}) => {
  return apiRequest(endpoint, options, { ...customConfig, sessionType: 'admin' });
};

export const refreshAdminSession = () => {
  return refreshSession('admin');
};

export {
  clearAccessToken as clearAdminAccessToken,
  setAccessToken as setAdminAccessToken
};
