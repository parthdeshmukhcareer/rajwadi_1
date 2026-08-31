import { db } from '../../db/index.js';
import { users, orders, products } from '../../db/schema/index.js';
import { eq, sql, sum, count, desc, inArray, gte, lte, and, ne } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';

export class AdminDashboardService {
  
  async getOverview() {
    // 1. Total Customers
    const [customersResult] = await db.select({ total: count() })
      .from(users)
      .where(eq(users.role, 'CUSTOMER'));
    const totalCustomers = customersResult.total;

    // 2. Total Orders
    const [ordersResult] = await db.select({ total: count() }).from(orders);
    const totalOrders = ordersResult.total;

    // 3. Total Products (active)
    const [productsResult] = await db.select({ total: count() })
      .from(products)
      .where(eq(products.isActive, true));
    const totalProducts = productsResult.total;

    // 4. Total Revenue
    const revenueConditions = [
      ne(orders.status, 'PENDING_PAYMENT'),
      ne(orders.status, 'CANCELLED'),
      sql`${orders.paymentStatus} = 'PAID' OR ${orders.paymentStatus} = 'Paid' OR ${orders.status} IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED')`
    ];
    
    const [revenueResult] = await db.select({ total: sum(orders.grandTotal) })
      .from(orders)
      .where(and(...revenueConditions));
    const totalRevenue = Math.round(Number(revenueResult.total || 0));

    // 5. revenueByMonth
    let monthlyOrdersQuery = db.select({
      createdAt: orders.createdAt,
      grandTotal: orders.grandTotal,
    })
    .from(orders)
    .where(and(...revenueConditions));

    const monthlyOrders = await monthlyOrdersQuery;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueMap = {};
    
    // For default dashboard, ensure last 6 months are present
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      revenueMap[key] = 0;
    }

    monthlyOrders.forEach(order => {
      const d = new Date(order.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (revenueMap[key] !== undefined) {
        revenueMap[key] += Number(order.grandTotal || 0);
      }
    });

    const revenueByMonth = Object.keys(revenueMap).map(month => ({
      month: month.split(' ')[0],
      fullMonth: month,
      revenue: Math.round(revenueMap[month])
    }));

    // Sort revenueByMonth chronologically
    revenueByMonth.sort((a, b) => {
      const dateA = new Date(a.fullMonth);
      const dateB = new Date(b.fullMonth);
      return dateA - dateB;
    });

    // 6. ordersByStatus
    const statusCounts = await db.select({
      status: orders.status,
      count: count()
    })
    .from(orders)
    .groupBy(orders.status);

    const ordersByStatus = statusCounts.map(item => ({
      status: item.status,
      count: item.count
    }));

    // 7. recentOrders
    const recentOrders = await db.select({
      orderNumber: orders.orderNumber,
      id: orders.id,
      customerEmail: users.email,
      customerName: sql`concat(${users.firstName}, ' ', ${users.lastName})`,
      totalAmount: orders.grandTotal,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

    return {
      metrics: {
        totalCustomers,
        totalOrders,
        totalProducts,
        totalRevenue
      },
      revenueByMonth,
      ordersByStatus,
      recentOrders
    };
  }
}
