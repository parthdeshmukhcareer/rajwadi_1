import { adminApiRequest } from './admin.client';

export const couponService = {
  getCoupons: async () => {
    const response = await adminApiRequest('/admin/coupons', { method: 'GET' });
    return response.data || [];
  },

  createCoupon: async (data) => {
    const response = await adminApiRequest('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  updateCoupon: async (id, data) => {
    const response = await adminApiRequest(`/admin/coupons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  toggleCouponStatus: async (id, status) => {
    const response = await adminApiRequest(`/admin/coupons/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: status })
    });
    return response.data;
  }
};
