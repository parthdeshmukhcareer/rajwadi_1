import { apiRequest } from '../api/client';

export const paymentService = {
  createPaymentOrder: async (orderNumber) => {
    const response = await apiRequest(`/orders/${orderNumber}/payment`, {
      method: 'POST'
    });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await apiRequest(`/payments/verify`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    return response;
  }
};
