import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await orderService.getOrders();
        // orderService.getOrders() already returns the data array, or an object containing it
        setOrders(Array.isArray(res) ? res : (res?.data || []));
      } catch (err) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT': return '#f39c12';
      case 'CONFIRMED': return '#3498db';
      case 'PROCESSING': return '#9b59b6';
      case 'SHIPPED': return '#2980b9';
      case 'DELIVERED': return '#27ae60';
      case 'CANCELLED': return '#e74c3c';
      default: return '#888';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#f39c12';
      case 'PAID': return '#27ae60';
      case 'FAILED': return '#e74c3c';
      case 'REFUNDED': return '#8e44ad';
      default: return '#888';
    }
  };

  return (
    <section className="view-section active" style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#fcf8f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '32px', margin: 0 }}>My Orders</h1>
          <Link to="/account" style={{ color: '#a48c5a', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>&larr; Back to Account</Link>
        </div>

        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
            <p>Loading your royal history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: '#e0d8c3', marginBottom: '20px' }}><i className="fa-solid fa-box-open"></i></div>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '24px', margin: '0 0 10px 0' }}>No Orders Found</h3>
            <p style={{ color: '#888', marginBottom: '25px' }}>Your royal wardrobe awaits its first masterpiece.</p>
            <Link to="/catalog" style={{ display: 'inline-block', backgroundColor: '#432227', color: '#fff', padding: '12px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop Collection</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric'
              });
              
              // Depending on backend, items count could be aggregated or from an items array length.
              // We'll fall back to calculating or displaying a placeholder if not provided directly.
              const itemsCount = order.items ? order.items.length : (order.totalItems || 1); 

              return (
                <div 
                  key={order.id} 
                  onClick={() => navigate(`/account/orders/${order.orderNumber}`)}
                  style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.3s', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#a48c5a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ flex: '1 1 200px' }}>
                    <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Order Number</span>
                    <strong style={{ fontSize: '18px', color: '#432227' }}>#{order.orderNumber}</strong>
                  </div>
                  
                  <div style={{ flex: '1 1 150px' }}>
                    <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Date</span>
                    <span style={{ fontSize: '15px', color: '#432227', fontWeight: '500' }}>{formattedDate}</span>
                  </div>

                  <div style={{ flex: '1 1 100px' }}>
                    <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Amount</span>
                    <span style={{ fontSize: '16px', color: '#432227', fontWeight: 'bold' }}>₹{Number(order.grandTotal).toFixed(2)}</span>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{itemsCount} Item{itemsCount !== 1 && 's'}</div>
                  </div>

                  <div style={{ flex: '1 1 150px' }}>
                    <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Status</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status), padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{order.status}</span>
                    </div>
                  </div>
                  
                  <div style={{ flex: '0 0 auto', color: '#a48c5a' }}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default Orders;
