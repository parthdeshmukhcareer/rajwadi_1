/**
 * Admin API Client
 * 
 * Reuses the existing robust API client from the customer frontend.
 * This ensures we share the same fetch logic, error handling, 
 * base URL, and automatic HttpOnly refresh cookie handling 
 * without duplicating code.
 */
import { apiRequest, refreshSession, clearAccessToken, setAccessToken } from '../../api/client';

export {
  apiRequest as adminApiRequest,
  refreshSession as refreshAdminSession,
  clearAccessToken as clearAdminAccessToken,
  setAccessToken as setAdminAccessToken
};
