import { db } from '../../db/index.js';
import { users, orders, products, orderItems, productVariants } from '../../db/schema/index.js';
import { eq, sql, sum, count, desc, gte, lte, and } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';

export class AdminReportsService {
  
  async getSalesReport({ range, startDate, endDate } = {}) {
    let dateFilter = undefined;
    let startD = null;
    let endD = new Date();

    if (range) {
      if (range === 'last_30_days') {
        startD = new Date();
        startD.setDate(startD.getDate() - 30);
      } else if (range === 'last_month') {
        startD = new Date();
        startD.setMonth(startD.getMonth() - 1);
        startD.setDate(1);
        startD.setHours(0, 0, 0, 0);
        endD = new Date(startD);
        endD.setMonth(endD.getMonth() + 1);
        endD.setDate(0);
        endD.setHours(23, 59, 59, 999);
      } else if (range === 'last_6_months') {
        startD = new Date();
        startD.setMonth(startD.getMonth() - 6);
      } else if (range === 'ytd') {
        startD = new Date(new Date().getFullYear(), 0, 1);
      } else if (range === 'custom' && startDate && endDate) {
        startD = new Date(startDate);
        endD = new Date(endDate);
        endD.setHours(23, 59, 59, 999);
      }
      
      if (startD && range !== 'all_time') {
        dateFilter = and(
          gte(orders.createdAt, startD),
          lte(orders.createdAt, endD)
        );
      }
    }

    const isPaidCondition = sql`${orders.paymentStatus} = 'PAID' OR ${orders.paymentStatus} = 'Paid' OR ${orders.status} IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED')`;
    const isPendingCondition = sql`${orders.paymentStatus} = 'PENDING' OR ${orders.paymentStatus} = 'Pending' OR ${orders.status} = 'PENDING_PAYMENT'`;

    // Total Orders (in range)
    let totalOrdersQuery = db.select({ count: count() }).from(orders);
    if (dateFilter) totalOrdersQuery = totalOrdersQuery.where(dateFilter);
    const [{ count: totalOrders }] = await totalOrdersQuery;

    // Paid Orders (in range)
    let paidOrdersQuery = db.select({ count: count() }).from(orders).where(isPaidCondition);
    if (dateFilter) paidOrdersQuery = db.select({ count: count() }).from(orders).where(and(isPaidCondition, dateFilter));
    const [{ count: paidOrders }] = await paidOrdersQuery;

    // Pending Orders (in range)
    let pendingOrdersQuery = db.select({ count: count() }).from(orders).where(isPendingCondition);
    if (dateFilter) pendingOrdersQuery = db.select({ count: count() }).from(orders).where(and(isPendingCondition, dateFilter));
    const [{ count: pendingOrders }] = await pendingOrdersQuery;

    // Cancelled Orders (in range)
    let cancelledOrdersQuery = db.select({ count: count() }).from(orders).where(eq(orders.status, 'CANCELLED'));
    if (dateFilter) cancelledOrdersQuery = db.select({ count: count() }).from(orders).where(and(eq(orders.status, 'CANCELLED'), dateFilter));
    const [{ count: cancelledOrders }] = await cancelledOrdersQuery;

    // Total Revenue (Paid orders in range)
    let revenueQuery = db.select({ total: sum(orders.grandTotal) }).from(orders).where(isPaidCondition);
    if (dateFilter) revenueQuery = db.select({ total: sum(orders.grandTotal) }).from(orders).where(and(isPaidCondition, dateFilter));
    const [{ total: rawTotalRevenue }] = await revenueQuery;
    const totalRevenue = Math.round(Number(rawTotalRevenue || 0));

    // AOV
    const averageOrderValue = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

    // Customers
    const [{ count: totalCustomers }] = await db.select({ count: count() }).from(users).where(eq(users.role, 'CUSTOMER'));
    
    let newCustomersQuery = db.select({ count: count() }).from(users).where(eq(users.role, 'CUSTOMER'));
    if (startD && range !== 'all_time') {
      newCustomersQuery = newCustomersQuery.where(and(eq(users.role, 'CUSTOMER'), gte(users.createdAt, startD), lte(users.createdAt, endD)));
    }
    const [{ count: newCustomers }] = await newCustomersQuery;

    // Products
    const [{ count: totalProducts }] = await db.select({ count: count() }).from(products).where(eq(products.isActive, true));

    // Revenue by Month
    let monthlyOrdersQuery = db.select({
      createdAt: orders.createdAt,
      grandTotal: orders.grandTotal,
    })
    .from(orders)
    .where(isPaidCondition);
    
    if (dateFilter) {
      monthlyOrdersQuery = db.select({
        createdAt: orders.createdAt,
        grandTotal: orders.grandTotal,
      })
      .from(orders)
      .where(and(isPaidCondition, dateFilter));
    }
    const monthlyOrdersResult = await monthlyOrdersQuery;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueMap = {};

    monthlyOrdersResult.forEach(order => {
      const d = new Date(order.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (revenueMap[key] === undefined) revenueMap[key] = 0;
      revenueMap[key] += Number(order.grandTotal || 0);
    });

    const revenueByMonth = Object.keys(revenueMap).map(month => ({
      month: month.split(' ')[0],
      fullMonth: month,
      revenue: Math.round(revenueMap[month])
    })).sort((a, b) => new Date(a.fullMonth) - new Date(b.fullMonth));

    // Orders By Status
    let statusQuery = db.select({ status: orders.status, count: count() }).from(orders);
    if (dateFilter) statusQuery = statusQuery.where(dateFilter);
    const statusCounts = await statusQuery.groupBy(orders.status);
    const ordersByStatus = statusCounts.map(item => ({ status: item.status, count: item.count }));

    // Orders By Payment Status
    let paymentStatusQuery = db.select({ paymentStatus: orders.paymentStatus, count: count() }).from(orders);
    if (dateFilter) paymentStatusQuery = paymentStatusQuery.where(dateFilter);
    const paymentStatusCounts = await paymentStatusQuery.groupBy(orders.paymentStatus);
    const ordersByPaymentStatus = paymentStatusCounts.map(item => ({ paymentStatus: item.paymentStatus, count: item.count }));

    // Top Selling Products (paid orders only in range)
    let topProductsQuery = db.select({
      productName: orderItems.productName,
      sku: productVariants.sku,
      quantitySold: sum(orderItems.quantity),
      revenue: sum(orderItems.lineTotal),
      orderCount: count(orders.id)
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .where(isPaidCondition);
    
    if (dateFilter) {
      topProductsQuery = db.select({
        productName: orderItems.productName,
        sku: productVariants.sku,
        quantitySold: sum(orderItems.quantity),
        revenue: sum(orderItems.lineTotal),
        orderCount: count(orders.id)
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(and(isPaidCondition, dateFilter));
    }

    const topSellingProductsRaw = await topProductsQuery
      .groupBy(orderItems.productName, productVariants.sku)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(10);
      
    const topSellingProducts = topSellingProductsRaw.map(p => ({
      productName: p.productName,
      sku: p.sku || 'N/A',
      quantitySold: Number(p.quantitySold || 0),
      revenue: Number(p.revenue || 0),
      orderCount: Number(p.orderCount || 0)
    }));

    // Recent Orders (max 50)
    let recentQuery = db.select({
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
    .leftJoin(users, eq(orders.userId, users.id));

    if (dateFilter) recentQuery = recentQuery.where(dateFilter);
    const recentOrders = await recentQuery.orderBy(desc(orders.createdAt)).limit(50);

    return {
      reportMeta: {
        range: range || 'default',
        startDate: startD?.toISOString() || null,
        endDate: endD?.toISOString() || null,
        generatedAt: new Date().toISOString()
      },
      metrics: {
        totalRevenue,
        totalOrders,
        paidOrders,
        pendingOrders,
        cancelledOrders,
        totalCustomers,
        newCustomers,
        totalProducts,
        averageOrderValue
      },
      revenueByMonth,
      ordersByStatus,
      ordersByPaymentStatus,
      topSellingProducts,
      recentOrders
    };
  }
}
