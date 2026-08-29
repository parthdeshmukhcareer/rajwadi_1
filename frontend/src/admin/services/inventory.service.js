import { adminApiRequest } from './admin.client';

export const inventoryService = {
  getInventory: async () => {
    // Inventory relies on the products endpoint to get variants
    const response = await adminApiRequest('/admin/products', { method: 'GET' });
    return response.data || [];
  },

  updateStock: async (variantId, stockOnHand) => {
    const response = await adminApiRequest(`/admin/products/variants/${variantId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stockOnHand })
    });
    return response.data;
  }
};
