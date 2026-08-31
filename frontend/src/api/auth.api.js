import { apiRequest, refreshSession } from './client.js';

export const authApi = {
  googleLogin: async (credential) => {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential, sessionType: 'customer' })
    }, { skipAuthRefresh: true });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, sessionType: 'customer' })
    }, { skipAuthRefresh: true });
  },

  register: async (firstName, lastName, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password, sessionType: 'customer' })
    }, { skipAuthRefresh: true });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ sessionType: 'customer' })
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
