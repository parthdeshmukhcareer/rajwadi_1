import { adminApiRequest } from './admin.client';

export const dashboardService = {
  getRecentOrders: async () => {
    // Fetch recent 5 orders for the table
    const response = await adminApiRequest('/admin/orders?limit=5', { method: 'GET' });
    return response.data || [];
  },

  getDashboardOverview: async (options = {}) => {
    try {
      const { range, startDate, endDate } = options;
      const params = new URLSearchParams();
      
      if (range) params.append('range', range);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = `/admin/dashboard${queryString ? `?${queryString}` : ''}`;
      
      const response = await adminApiRequest(url, { method: 'GET' });
      return response.data || {};
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      throw error;
    }
  }
};
