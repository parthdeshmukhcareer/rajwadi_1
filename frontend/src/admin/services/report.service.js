import { adminApiRequest } from './admin.client';

export const reportService = {
  getSalesReport: async (params = {}) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = queryParams ? `/admin/reports/sales?${queryParams}` : '/admin/reports/sales';
      
      const response = await adminApiRequest(endpoint, { method: 'GET' });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  }
};
