import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/payment.service';

const Payments = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        await paymentService.getPayments();
      } catch (err) {
        setError(err.message || 'Failed to load payments API.');
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1>Payments Management</h1>
      </div>

      <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
        {error ? (
          <div>
            <div style={{ color: 'var(--admin-danger)', fontSize: '48px', marginBottom: '16px' }}>⚠</div>
            <h2 style={{ color: 'var(--admin-text)' }}>API Not Implemented</h2>
            <p style={{ color: 'var(--admin-text-muted)', marginTop: '8px' }}>{error}</p>
            <p style={{ color: 'var(--admin-text-muted)', marginTop: '4px' }}>Please contact backend developers to expose the `/api/v1/admin/payments` endpoint.</p>
          </div>
        ) : (
          <p>Loading Payments...</p>
        )}
      </div>
    </div>
  );
};

export default Payments;
