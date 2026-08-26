import { apiRequest, refreshSession } from './client.js';

export const authApi = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, { skipAuthRefresh: true });
  },

  register: async (firstName, lastName, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password })
    }, { skipAuthRefresh: true });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    }, { skipAuthRefresh: true });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  refreshAccessToken: async () => {
    return refreshSession();
  }
};
