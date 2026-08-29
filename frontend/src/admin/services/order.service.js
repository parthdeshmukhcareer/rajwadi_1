import { adminApiRequest } from './admin.client';

export const orderService = {
  getOrders: async (page = 1, limit = 24, search = '') => {
    let query = `?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    
    const response = await adminApiRequest(`/admin/orders${query}`, { method: 'GET' });
    return response.data || [];
  },

  getOrderDetails: async (orderId) => {
    const response = await adminApiRequest(`/admin/orders/${orderId}`, { method: 'GET' });
    return response.data;
  },

  updateOrderStatus: async (id, data) => {
    const response = await adminApiRequest(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  cancelOrder: async (id) => {
    // Currently, the backend doesn't explicitly expose a direct /cancel endpoint in admin routes 
    // without tying it into refunds/payments logic, which is disabled for this phase.
    // We throw an error here to prevent bypassing backend rules.
    throw new Error('Cancellation must be processed through the Payments/Refunds module, which is currently disabled.');
  }
};
