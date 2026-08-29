import { adminApiRequest } from './admin.client';

export const refundService = {
  getRefunds: async (page = 1, limit = 24) => {
    const response = await adminApiRequest(`/admin/refunds?page=${page}&limit=${limit}`, { method: 'GET' });
    return response.data || [];
  },

  getRefundDetails: async (id) => {
    const response = await adminApiRequest(`/admin/refunds/${id}`, { method: 'GET' });
    return response.data;
  },

  createRefund: async (orderId) => {
    // Initiates cancellation and refund processing via Razorpay
    const response = await adminApiRequest(`/admin/refunds/orders/${orderId}/cancel-refund`, {
      method: 'POST'
    });
    return response; // Contains .message and .data.refund
  }
};
