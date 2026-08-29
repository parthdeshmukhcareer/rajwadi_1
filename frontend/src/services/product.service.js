import { apiRequest } from '../api/client';

export const productService = {
  getProducts: async (params = {}) => {
    // Construct query string
    const query = new URLSearchParams();
    
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.size) query.append('size', params.size);
    if (params.color) query.append('color', params.color);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.featured) query.append('featured', 'true');
    if (params.occasion) query.append('occasion', params.occasion);
    if (params.fabric) query.append('fabric', params.fabric);
    if (params.sort && params.sort !== 'default') query.append('sort', params.sort);

    const queryString = query.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint, { method: 'GET' });
    return response; // { data, pagination }
  },

  getProductBySlug: async (slug) => {
    const response = await apiRequest(`/products/${slug}`, { method: 'GET' });
    return response.data;
  },

  getCategories: async () => {
    const response = await apiRequest('/categories', { method: 'GET' });
    return response.data;
  }
};
