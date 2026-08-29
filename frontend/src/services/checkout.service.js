import { apiRequest } from '../api/client';

export const checkoutService = {
  previewCart: async (couponCode) => {
    const response = await apiRequest('/cart/preview', {
      method: 'POST',
      body: JSON.stringify({ couponCode: couponCode || undefined })
    });
    return response.data;
  },

  createOrder: async (payload) => {
    // payload should contain { addressId, couponCode }
    const response = await apiRequest('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return response.data;
  }
};
