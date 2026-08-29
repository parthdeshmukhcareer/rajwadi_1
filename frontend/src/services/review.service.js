import { apiRequest } from '../api/client';

export const reviewService = {
  createReview: async (productId, reviewData) => {
    const response = await apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    return response.data;
  }
};
