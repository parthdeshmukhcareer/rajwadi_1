import React, { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import DashboardSkeleton from './DashboardSkeleton';

// Reusable Components
const StatsCard = ({ title, value, icon, trend, isPositive }) => (
  <div className="admin-card stats-card">
    <div className="stats-header">
      <h3 className="stats-title">{title}</h3>
      <div className="stats-icon">{icon}</div>
    </div>
    <div className="stats-value">{value}</div>
    {trend && (
      <div className={`stats-trend ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trend}</span>
      </div>
    )}
  </div>
);

const ChartPlaceholder = ({ title, height }) => (
  <div className="admin-card chart-card">
    <h3 className="chart-title">{title}</h3>
    <div className="chart-area" style={{ height }}>
      {/* Chart library will go here */}
      <div className="chart-placeholder-text">Chart visualization for {title}</div>
    </div>
  </div>
);

const DataTable = ({ columns, data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
        No recent orders found.
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{col.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardOverview();
        setOverview(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const orderColumns = [
    { header: 'Order ID', cell: (row) => <span className="font-medium" style={{ fontFamily: 'monospace' }}>{row.orderNumber || row.id.substring(0, 8)}</span> },
    { header: 'Customer', cell: (row) => row.shippingAddress?.fullName || 'Guest' },
    { header: 'Amount', cell: (row) => formatCurrency(row.totalAmount || row.amount || 0) },
    { header: 'Payment', cell: (row) => (
      <span className={`admin-badge ${(row.paymentStatus === 'PAID' || row.paymentStatus === 'Paid') ? 'admin-badge-success' : 'admin-badge-warning'}`}>
        {row.paymentStatus || 'PENDING'}
      </span>
    )},
    { header: 'Status', cell: (row) => (
      <span className={`admin-badge admin-badge-info`}>{row.status || row.orderStatus}</span>
    )},
    { header: 'Date', cell: (row) => new Date(row.createdAt || row.date).toLocaleDateString() },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff5f5', border: '1px solid #feb2b2' }}>
          <AlertTriangle size={48} color="#e53e3e" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#c53030', marginBottom: '8px' }}>Failed to load Dashboard</h2>
          <p style={{ color: '#e53e3e' }}>{error}</p>
          <button 
            className="admin-btn admin-btn-outline" 
            style={{ marginTop: '24px' }}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <button className="admin-btn admin-btn-primary">Generate Report</button>
      </div>

      <div className="stats-grid">
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(overview.totalRevenue)} 
          icon={<IndianRupee size={24} />} 
          trend="Derived from paid orders" 
          isPositive={true} 
        />
        <StatsCard 
          title="Total Orders" 
          value={overview.totalOrders} 
          icon={<ShoppingBag size={24} />} 
          trend="Total recorded orders" 
          isPositive={true} 
        />
        <StatsCard 
          title="Total Customers" 
          value={overview.totalCustomers} 
          icon={<Users size={24} />} 
          trend="API Endpoint Unavailable" 
          isPositive={false} 
        />
        <StatsCard 
          title="Total Products" 
          value={overview.totalProducts} 
          icon={<Package size={24} />} 
          trend="Total active products" 
          isPositive={true} 
        />
      </div>

      <div className="charts-grid">
        <ChartPlaceholder title="Revenue Overview" height="300px" />
        <ChartPlaceholder title="Orders Status" height="300px" />
      </div>

      <div className="admin-card recent-orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="admin-btn admin-btn-outline">View All</button>
        </div>
        <DataTable columns={orderColumns} data={overview.recentOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
