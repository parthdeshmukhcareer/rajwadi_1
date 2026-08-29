import { apiRequest } from '../api/client';

export const orderService = {
  getOrders: async () => {
    const response = await apiRequest('/orders', {
      method: 'GET'
    });
    return response.data; // Note: structure might be { data, pagination }
  },

  getOrderDetails: async (orderNumber) => {
    const response = await apiRequest(`/orders/${orderNumber}`, {
      method: 'GET'
    });
    return response.data;
  },

  cancelOrder: async (orderNumber) => {
    const response = await apiRequest(`/orders/${orderNumber}/cancel`, {
      method: 'POST'
    });
    return response.data;
  }
};
