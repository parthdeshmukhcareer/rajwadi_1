import { apiRequest } from '../api/client';

export const cartService = {
  getCart: async () => {
    const response = await apiRequest('/cart', { method: 'GET' });
    return response.data;
  },

  addToCart: async (variantId, quantity = 1) => {
    const response = await apiRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ variantId, quantity })
    });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await apiRequest(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await apiRequest(`/cart/items/${itemId}`, { method: 'DELETE' });
    return response.data;
  },

  clearCart: async () => {
    const response = await apiRequest('/cart', { method: 'DELETE' });
    return response.data;
  },

  previewCart: async (couponCode) => {
    const body = couponCode ? { couponCode } : {};
    const response = await apiRequest('/cart/preview', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return response.data;
  }
};
