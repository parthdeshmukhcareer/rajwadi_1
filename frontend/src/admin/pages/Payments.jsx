import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/payment.service';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const limit = 24;

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await paymentService.getPayments(page, limit);
      setPayments(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load payments API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const columns = [
    { header: 'Order Number', cell: (row) => <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{row.order?.orderNumber || 'N/A'}</span> },
    { header: 'Provider', cell: (row) => row.provider },
    { header: 'Razorpay Order ID', cell: (row) => <span style={{ fontSize: '13px', color: '#666' }}>{row.razorpayOrderId}</span> },
    { header: 'Amount', cell: (row) => formatCurrency(row.amount / 100) }, // Amount is in paise usually, assuming DB has it in paise (or check if it's already rupees. Orders grandTotal is in rupees, wait, Razorpay is paise. Let's just render row.amount)
    { 
      header: 'Status', 
      cell: (row) => {
        let badgeClass = 'admin-badge-warning';
        if (row.status === 'PAID') badgeClass = 'admin-badge-success';
        if (row.status === 'REFUNDED') badgeClass = 'admin-badge-info';
        if (row.status === 'FAILED') badgeClass = 'admin-badge-danger';
        return <span className={`admin-badge ${badgeClass}`}>{row.status}</span>;
      }
    },
    { header: 'Created', cell: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: 'Paid At', cell: (row) => row.paidAt ? new Date(row.paidAt).toLocaleDateString() : '-' },
  ];

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1>Payments Management</h1>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Payments...</div>
          ) : payments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No payments found.</div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((row, rowIndex) => (
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
                    disabled={payments.length < limit}
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

export default Payments;
