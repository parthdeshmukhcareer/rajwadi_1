import { adminApiRequest } from './admin.client';

export const productService = {
  getProducts: async () => {
    const response = await adminApiRequest('/admin/products', { method: 'GET' });
    return response.data || [];
  },

  getProduct: async (id) => {
    const response = await adminApiRequest(`/admin/products/${id}`, { method: 'GET' });
    return response.data;
  },

  createProduct: async (data) => {
    // We separate the base product data from variants
    const { variants, ...productData } = data;
    
    // 1. Create the base product
    const response = await adminApiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    
    const newProduct = response.data;
    
    // 2. Create variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await adminApiRequest(`/admin/products/${newProduct.id}/variants`, {
          method: 'POST',
          body: JSON.stringify(variant)
        });
      }
    }
    
    return newProduct;
  },

  updateProduct: async (id, data) => {
    const response = await adminApiRequest(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.data;
  },

  updateProductStatus: async (id, isActive) => {
    const response = await adminApiRequest(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await adminApiRequest(`/admin/products/${id}`, {
      method: 'DELETE'
    });
    return response.data;
  }
};
