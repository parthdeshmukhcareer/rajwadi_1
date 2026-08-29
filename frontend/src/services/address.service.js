import { apiRequest } from '../api/client';

export const addressService = {
  getAddresses: async () => {
    const response = await apiRequest('/addresses', { method: 'GET' });
    return response;
  },

  createAddress: async (data) => {
    const response = await apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  },

  updateAddress: async (id, data) => {
    const response = await apiRequest(`/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response;
  },

  deleteAddress: async (id) => {
    const response = await apiRequest(`/addresses/${id}`, { method: 'DELETE' });
    return response;
  }
};
