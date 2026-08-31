import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrencyForPdf = (amountInPaise) => {
  return `Rs. ${Number(amountInPaise || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const generateDashboardReportPdf = (reportData, options = {}) => {
  try {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const { 
      metrics = {}, 
      revenueByMonth = [], 
      ordersByStatus = [], 
      ordersByPaymentStatus = [],
      topSellingProducts = [],
      recentOrders = [],
      reportMeta = {}
    } = reportData;

    // Rajwadi Colors
    const primaryMaroon = [107, 28, 35]; // #6B1C23
    const secondaryGold = [212, 175, 55]; // #D4AF37

    // 1. HEADER
    doc.setFontSize(24);
    doc.setTextColor(...primaryMaroon);
    doc.text("Rajwadi", 40, 40);

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Detailed Sales Report", 40, 65);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    let rangeText = reportMeta.range || 'All Time';
    if (rangeText === 'last_30_days') rangeText = 'Last 30 Days (Rolling)';
    if (rangeText === 'last_month') rangeText = 'Previous Calendar Month';
    if (rangeText === 'last_6_months') rangeText = 'Last 6 Months';
    if (rangeText === 'ytd') rangeText = 'This Year (Year to Date)';

    doc.text(`Time Frame: ${rangeText}`, 40, 85);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 100);
    
    // Line separator
    doc.setDrawColor(...secondaryGold);
    doc.setLineWidth(1.5);
    doc.line(40, 110, 800, 110);

    // 2. BUSINESS INSIGHTS TABLE
    doc.setFontSize(14);
    doc.setTextColor(...primaryMaroon);
    doc.text("Executive Summary", 40, 140);

    autoTable(doc, {
      startY: 150,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', formatCurrencyForPdf(metrics.totalRevenue)],
        ['Average Order Value (AOV)', formatCurrencyForPdf(metrics.averageOrderValue)],
        ['Total Orders', metrics.totalOrders || 0],
        ['Paid Orders', metrics.paidOrders || 0],
        ['Pending Orders', metrics.pendingOrders || 0],
        ['Cancelled Orders', metrics.cancelledOrders || 0],
        ['New Customers', metrics.newCustomers || 0],
        ['Total Active Products', metrics.totalProducts || 0]
      ],
      headStyles: { fillColor: primaryMaroon, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      margin: { right: 420 } // Left half of landscape page
    });

    const finalYExecutive = doc.lastAutoTable.finalY;

    // 3. REVENUE BY MONTH
    doc.text("Revenue by Month", 440, 140);
    autoTable(doc, {
      startY: 150,
      head: [['Month', 'Revenue']],
      body: revenueByMonth.map(item => [item.fullMonth, formatCurrencyForPdf(item.revenue)]),
      headStyles: { fillColor: primaryMaroon, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      margin: { left: 440 }
    });
    
    const finalYRevenue = doc.lastAutoTable.finalY;

    let nextY = Math.max(finalYExecutive, finalYRevenue) + 30;

    // 4. ORDERS BY STATUS & PAYMENT STATUS
    doc.setFontSize(14);
    doc.setTextColor(...primaryMaroon);
    doc.text("Orders by Status", 40, nextY);

    autoTable(doc, {
      startY: nextY + 10,
      head: [['Status', 'Count']],
      body: ordersByStatus.map(item => [item.status, item.count]),
      headStyles: { fillColor: primaryMaroon, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      margin: { right: 420 }
    });

    const finalYStatus = doc.lastAutoTable.finalY;

    doc.text("Orders by Payment Status", 440, nextY);
    
    autoTable(doc, {
      startY: nextY + 10,
      head: [['Payment Status', 'Count']],
      body: ordersByPaymentStatus.map(item => [item.paymentStatus, item.count]),
      headStyles: { fillColor: primaryMaroon, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      margin: { left: 440 }
    });

    const finalYPayment = doc.lastAutoTable.finalY;

    nextY = Math.max(finalYStatus, finalYPayment) + 40;

    // 5. TOP SELLING PRODUCTS TABLE
    if (nextY > 450) {
      doc.addPage();
      nextY = 40;
    }

    doc.setFontSize(14);
    doc.setTextColor(...primaryMaroon);
    doc.text(`Top Selling Products (${topSellingProducts.length})`, 40, nextY);

    autoTable(doc, {
      startY: nextY + 10,
      head: [['Product', 'SKU', 'Qty Sold', 'Orders', 'Revenue']],
      body: topSellingProducts.map(p => [
        p.productName,
        p.sku,
        p.quantitySold,
        p.orderCount,
        formatCurrencyForPdf(p.revenue)
      ]),
      headStyles: { fillColor: primaryMaroon, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      columnStyles: { 0: { cellWidth: 300 } }
    });

    nextY = doc.lastAutoTable.finalY + 40;

    // 6. RECENT ORDERS TABLE
    if (nextY > 450) {
      doc.addPage();
      nextY = 40;
    }

    doc.setFontSize(14);
    doc.setTextColor(...primaryMaroon);
    doc.text(`Recent Orders (${recentOrders.length})`, 40, nextY);

    autoTable(doc, {
      startY: nextY + 10,
      head: [['Order No', 'Customer', 'Email', 'Date', 'Status', 'Payment', 'Total']],
      body: recentOrders.map(order => [
        order.orderNumber || order.id?.substring(0, 8),
        order.customerName || 'Guest',
        order.customerEmail || 'N/A',
        new Date(order.createdAt).toLocaleDateString(),
        order.status,
        order.paymentStatus,
        formatCurrencyForPdf(order.totalAmount || 0)
      ]),
      headStyles: { fillColor: primaryMaroon, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      styles: { overflow: 'linebreak', cellWidth: 'wrap', fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 120 },
        2: { cellWidth: 160 },
        3: { cellWidth: 70 },
        4: { cellWidth: 90 },
        5: { cellWidth: 70 },
        6: { cellWidth: 90 }
      }
    });

    // 7. FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Rajwadi E-Commerce Admin Report - Page ${i} of ${pageCount}`, 
        40, 
        doc.internal.pageSize.getHeight() - 20
      );
    }

    // DOWNLOAD
    doc.save(`Rajwadi_Report_${rangeText.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Generation failed", error);
    throw error;
  }
};
