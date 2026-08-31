import { apiRequest } from '../../api/client';

export const paymentService = {
  getPayments: async (page = 1, limit = 24) => {
    return apiRequest(`/admin/payments?page=${page}&limit=${limit}`, {
      method: 'GET'
    });
  },

  getPaymentDetails: async (id) => {
    // Backend API for payment details does not exist.
    throw new Error('Payment details API is not currently exposed by the backend.');
  }
};
