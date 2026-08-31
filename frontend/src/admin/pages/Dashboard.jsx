import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IndianRupee, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { dashboardService } from '../services/dashboard.service';
import DashboardSkeleton from './DashboardSkeleton';
import ReportGeneratorModal from '../components/ReportGeneratorModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const isDocumentVisible = useRef(true);

  const fetchDashboardData = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const data = await dashboardService.getDashboardOverview();
      setOverview(data);
      setError(null);
    } catch (err) {
      if (!isBackground || !overview) {
        setError(err.message || 'Failed to load dashboard data');
      } else {
        console.error("Background refresh failed", err);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [overview]);

  useEffect(() => {
    fetchDashboardData(false);

    const handleVisibilityChange = () => {
      isDocumentVisible.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (isDocumentVisible.current) {
        fetchDashboardData(true);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDashboardData]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const orderColumns = [
    { header: 'Order ID', cell: (row) => <span className="font-medium" style={{ fontFamily: 'monospace' }}>{row.orderNumber || row.id?.substring(0, 8) || 'N/A'}</span> },
    { header: 'Customer', cell: (row) => row.customerName || row.customerEmail || 'Guest' },
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

  if (isLoading && !overview) {
    return <DashboardSkeleton />;
  }

  if (error && !overview) {
    return (
      <div className="dashboard-page">
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff5f5', border: '1px solid #feb2b2' }}>
          <AlertTriangle size={48} color="#e53e3e" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#c53030', marginBottom: '8px' }}>Failed to load Dashboard</h2>
          <p style={{ color: '#e53e3e' }}>{error}</p>
          <button 
            className="admin-btn admin-btn-outline" 
            style={{ marginTop: '24px' }}
            onClick={() => fetchDashboardData(false)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  const STATUS_COLORS = {
    'PENDING': '#E3C154',    // light gold
    'CONFIRMED': '#D4AF37',  // gold
    'PROCESSING': '#9E8030', // dark gold
    'SHIPPED': '#8A252E',    // lighter maroon
    'DELIVERED': '#6B1C23',  // deep maroon (primary)
    'CANCELLED': '#432227',  // very dark maroon
    'EXPIRED': '#222222',    // charcoal
    'REFUNDED': '#E5E0D8'    // beige border
  };
  
  const FALLBACK_COLORS = ['#6B1C23', '#D4AF37', '#8A252E', '#E3C154', '#432227', '#9E8030', '#222222'];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1>Dashboard Overview</h1>
          {isRefreshing && <RefreshCw size={20} className="spinner" style={{ color: '#888' }} />}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="admin-btn admin-btn-outline" 
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
          >
            Refresh
          </button>
          <button 
            className="admin-btn admin-btn-primary" 
            onClick={() => setIsReportModalOpen(true)}
          >
            Generate Report
          </button>
        </div>
      </div>
      
      <ReportGeneratorModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />

      <div className="stats-grid">
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(overview?.metrics?.totalRevenue || 0)} 
          icon={<IndianRupee size={24} />} 
          trend="Derived from paid orders" 
          isPositive={true} 
        />
        <StatsCard 
          title="Total Orders" 
          value={overview?.metrics?.totalOrders || 0} 
          icon={<ShoppingBag size={24} />} 
          trend="Total recorded orders" 
          isPositive={true} 
        />
        <StatsCard 
          title="Total Customers" 
          value={overview?.metrics?.totalCustomers || 0} 
          icon={<Users size={24} />} 
          trend="Registered customers" 
          isPositive={true} 
        />
        <StatsCard 
          title="Total Products" 
          value={overview?.metrics?.totalProducts || 0} 
          icon={<Package size={24} />} 
          trend="Total active products" 
          isPositive={true} 
        />
      </div>

      <div className="charts-grid">
        <div className="admin-card chart-card">
          <h3 className="chart-title">Revenue Overview (Last 6 Months)</h3>
          <div className="chart-area" style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  cursor={{ fill: 'rgba(107, 28, 35, 0.05)' }} // 6B1C23 with opacity
                />
                <Bar dataKey="revenue" fill="#6B1C23" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card chart-card">
          <h3 className="chart-title">Orders by Status</h3>
          <div className="chart-area" style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overview?.ordersByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(overview?.ordersByStatus || []).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.status] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-card recent-orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button className="admin-btn admin-btn-outline">View All</button>
        </div>
        <DataTable columns={orderColumns} data={overview?.recentOrders || []} />
      </div>
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
