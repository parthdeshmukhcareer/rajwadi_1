import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { refundService } from '../services/refund.service';
import { orderService } from '../services/order.service';

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 24;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiateOrderId, setInitiateOrderId] = useState('');
  const [initiateError, setInitiateError] = useState(null);
  const [initiateSuccess, setInitiateSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRefunds = async () => {
    try {
      setIsLoading(true);
      const data = await refundService.getRefunds(page, limit);
      setRefunds(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load refunds');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [page]);

  const handleInitiateRefund = async (e) => {
    e.preventDefault();
    setInitiateError(null);
    setInitiateSuccess(null);
    
    if (!initiateOrderId) {
      setInitiateError('Please enter an Order ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await refundService.createRefund(initiateOrderId);
      setInitiateSuccess(res.message || 'Refund initiated successfully.');
      fetchRefunds();
      setTimeout(() => {
        setIsModalOpen(false);
        setInitiateOrderId('');
        setInitiateSuccess(null);
      }, 3000);
    } catch (err) {
      setInitiateError(err.message || 'Failed to initiate refund. Ensure the order exists and is eligible (e.g. PAID and not already cancelled).');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const handleDeleteRefund = async (id) => {
    if (!window.confirm('Are you sure you want to delete this refund record?')) return;
    try {
      await refundService.deleteRefund(id);
      fetchRefunds();
    } catch (err) {
      alert(err.message || 'Failed to delete refund.');
    }
  };

  const columns = [
    { header: 'Refund ID', cell: (row) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{row.id}</span> },
    { header: 'Order ID', cell: (row) => <span style={{ fontFamily: 'monospace' }}>{row.orderId}</span> },
    { header: 'Refund Amount', cell: (row) => formatCurrency(row.amount || 0) },
    { header: 'Currency', cell: (row) => row.currency },
    { 
      header: 'Refund Status', 
      cell: (row) => {
        let badgeClass = 'admin-badge-warning';
        if (row.status === 'REFUNDED') badgeClass = 'admin-badge-success';
        if (row.status === 'REVIEW_REQUIRED' || row.status === 'FAILED') badgeClass = 'admin-badge-danger';
        return <span className={`admin-badge ${badgeClass}`}>{row.status}</span>;
      }
    },
    { header: 'Created Date', cell: (row) => new Date(row.createdAt).toLocaleDateString() },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="admin-icon-btn" title="View Details" onClick={() => alert(`Details for Refund: ${row.id}\nProvider ID: ${row.razorpayRefundId || 'N/A'}\nReason: ${row.failureReason || 'None'}`)}>
            <Eye size={18} />
          </button>
          <button className="admin-icon-btn" title="Delete Refund" onClick={() => handleDeleteRefund(row.id)} style={{ color: '#e74c3c' }}>
            <i className="fa-solid fa-trash" style={{ fontSize: '16px' }}></i>
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="refunds-page">
      <div className="page-header">
        <h1>Refunds Management</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsModalOpen(true)}>
          Initiate Cancellation & Refund
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading Refunds...</div>
          ) : refunds.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No refunds found.</div>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col, index) => <th key={index}>{col.header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((row, rowIndex) => (
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
                    disabled={refunds.length < limit}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="admin-card" style={{ width: '450px', padding: '24px' }}>
            <h2 style={{ marginBottom: '8px' }}>Initiate Refund & Cancellation</h2>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '20px', fontSize: '14px' }}>
              This will cancel the order, restore inventory, and initiate a refund. Refunds should be done using Razorpay only and online mode only.
            </p>
            
            {initiateError && (
              <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', display: 'flex', gap: '8px' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{initiateError}</span>
              </div>
            )}

            {initiateSuccess && (
              <div style={{ padding: '12px', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
                {initiateSuccess}
              </div>
            )}
            
            <form onSubmit={handleInitiateRefund} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Order Number</label>
                <input 
                  type="text"
                  className="admin-input" 
                  value={initiateOrderId} 
                  onChange={e => setInitiateOrderId(e.target.value)} 
                  placeholder="e.g. RJD-2026-000075"
                  required 
                  disabled={isSubmitting || initiateSuccess}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }} disabled={isSubmitting}>Close</button>
                <button type="submit" className="admin-btn admin-btn-danger" style={{ flex: 1, border: '2px solid #a83232' }} disabled={isSubmitting || initiateSuccess}>
                  {isSubmitting ? 'Processing...' : 'Refund Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Refunds;
