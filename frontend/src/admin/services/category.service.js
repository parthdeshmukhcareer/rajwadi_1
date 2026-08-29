import { adminApiRequest } from './admin.client';

export const categoryService = {
  getCategories: async () => {
    const response = await adminApiRequest('/admin/categories', { method: 'GET' });
    // The backend might return { success: true, data: [...] }
    return response.data || [];
  },

  createCategory: async (data) => {
    const response = await adminApiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await adminApiRequest(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  updateCategoryStatus: async (id, isActive) => {
    const response = await adminApiRequest(`/admin/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
    return response.data;
  }
};
