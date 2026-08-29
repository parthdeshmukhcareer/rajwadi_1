import { adminApiRequest } from './admin.client';

export const dashboardService = {
  getRecentOrders: async () => {
    // Fetch recent 5 orders for the table
    const response = await adminApiRequest('/admin/orders?limit=5', { method: 'GET' });
    return response.data || [];
  },

  getDashboardOverview: async () => {
    try {
      // Fetch up to 100 orders and products to aggregate metrics
      // (Optimization: In the future, this should be a backend aggregation endpoint)
      const [ordersRes, productsRes] = await Promise.all([
        adminApiRequest('/admin/orders?limit=100', { method: 'GET' }),
        adminApiRequest('/admin/products?limit=100', { method: 'GET' })
      ]);

      const orders = ordersRes.data || [];
      // Handle pagination object if products returns { data: [], pagination: {} } 
      // or flat array
      const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || []);

      const totalOrders = orders.length;
      
      const totalProducts = products.filter(p => p.isActive !== false && p.status !== 'INACTIVE').length; // Assuming some active field exists, defaulting to counting all if undefined.

      const validRevenueStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
      let totalRevenue = 0;
      
      orders.forEach(order => {
        if (
          validRevenueStatuses.includes(order.orderStatus) || 
          order.status === 'CONFIRMED' || 
          order.status === 'PROCESSING' || 
          order.status === 'SHIPPED' || 
          order.status === 'DELIVERED' ||
          order.paymentStatus === 'PAID' || 
          order.paymentStatus === 'Paid'
        ) {
          totalRevenue += parseFloat(order.totalAmount || order.amount || 0);
        }
      });

      // Fetch first 5 orders from the already retrieved list for recent orders
      const recentOrders = orders.slice(0, 5);

      return {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers: 'N/A', // No admin users endpoint exists yet
        recentOrders
      };
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      throw error;
    }
  }
};
