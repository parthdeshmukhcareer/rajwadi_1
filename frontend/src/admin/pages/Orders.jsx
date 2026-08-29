import React, { useState, useEffect } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 24;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrders(page, limit, search);
      setOrders(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const columns = [
    { header: 'Order Number', cell: (row) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{row.orderNumber}</span> },
    { header: 'Customer', cell: (row) => row.shippingAddress?.fullName || 'Guest' },
    { header: 'Amount', cell: (row) => formatCurrency(row.grandTotal || row.totalAmount || row.amount || 0) },
    { 
      header: 'Payment Status', 
      cell: (row) => (
        <span className={`admin-badge ${(row.paymentStatus === 'PAID') ? 'admin-badge-success' : 'admin-badge-warning'}`}>
          {row.paymentStatus || 'PENDING'}
        </span>
      )
    },
    { 
      header: 'Order Status', 
      cell: (row) => {
        let badgeClass = 'admin-badge-info';
        if (row.status === 'DELIVERED') badgeClass = 'admin-badge-success';
        if (row.status === 'CANCELLED' || row.status === 'EXPIRED') badgeClass = 'admin-badge-danger';
        return <span className={`admin-badge ${badgeClass}`}>{row.status}</span>;
      }
    },
    { header: 'Date', cell: (row) => new Date(row.createdAt).toLocaleDateString() },
    { 
      header: 'Actions', 
      cell: (row) => (
        <button className="admin-icon-btn" title="View Details" onClick={() => navigate(`/admin/orders/${row.id}`)}>
          <Eye size={18} />
        </button>
      ) 
    },
  ];

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            className="admin-input" 
            placeholder="Search Order Number..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="admin-btn admin-btn-outline"><Search size={18} /></button>
        </form>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No orders found.</div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => <td key={colIndex}>{col.cell(row)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid var(--admin-border)' }}>
                <span style={{ fontSize: '14px', color: 'var(--admin-text-muted)' }}>Showing page {page}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="admin-btn admin-btn-outline" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button 
                    className="admin-btn admin-btn-outline" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={orders.length < limit}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
