import { adminApiRequest } from './admin.client';

export const customerService = {
  getCustomers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await adminApiRequest(`/admin/customers${query ? `?${query}` : ''}`, { method: 'GET' });
    return response.data || [];
  }
};
