import { adminApiRequest } from './admin.client';

export const reviewService = {
  getReviews: async (page = 1, limit = 24, status = '') => {
    let query = `?page=${page}&limit=${limit}`;
    if (status) query += `&status=${status}`;
    const response = await adminApiRequest(`/admin/reviews${query}`, { method: 'GET' });
    return response.data || [];
  },

  updateReviewStatus: async (id, status) => {
    const response = await adminApiRequest(`/admin/reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }) // PUBLISHED or HIDDEN
    });
    return response.data;
  }
};
