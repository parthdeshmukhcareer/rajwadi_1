import { apiRequest } from './client.js';

export const usersApi = {
  updateProfile: async (data) => {
    const res = await apiRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res;
  },
};
