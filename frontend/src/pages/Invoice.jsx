import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Invoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <section className="view-section active" style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>No Order Data Found</h2>
        <p>It seems you haven't placed an order yet or the session expired.</p>
        <button onClick={() => navigate('/catalog')} style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#432227', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Return to Shop</button>
      </section>
    );
  }

  const { paymentId, date, items, subtotal, shipping, total, customer } = orderData;

  return (
    <section className="view-section active" style={{ paddingTop: '120px', paddingBottom: '60px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        {/* Header - Success Banner */}
        <div style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '30px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '15px' }}>
            <i className="fa-solid fa-check" style={{ fontSize: '30px' }}></i>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', margin: '0 0 10px 0', fontSize: '28px' }}>Payment Successful!</h1>
          <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Thank you for your purchase.</p>
        </div>

        {/* Status Tracker */}
        <div style={{ padding: '30px', borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <i className="fa-solid fa-truck-fast" style={{ fontSize: '24px', color: '#432227' }}></i>
            <div>
              <h3 style={{ margin: 0, color: '#432227', fontSize: '18px' }}>Status: Out for Delivery</h3>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Your order is packed and has been dispatched. It will reach you soon!</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div style={{ padding: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <div>
              <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>Billed To:</h4>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#333' }}>{customer.fullName}</p>
              <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px', maxWidth: '200px' }}>{customer.address}</p>
              <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px' }}>{customer.city}, {customer.state} - {customer.pincode}</p>
              <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px' }}>Phone: {customer.phone}</p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>Order Details:</h4>
              <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px' }}><strong>Payment ID:</strong> {paymentId}</p>
              <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px' }}><strong>Date:</strong> {date}</p>
              <p style={{ margin: '0 0 5px 0', color: '#555', fontSize: '14px' }}><strong>Method:</strong> Razorpay Online</p>
            </div>
          </div>

          <h4 style={{ borderBottom: '2px solid #432227', paddingBottom: '10px', color: '#432227', marginBottom: '20px' }}>Order Items</h4>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#555', fontSize: '13px' }}>Item Description</th>
                <th style={{ padding: '12px', color: '#555', fontSize: '13px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '12px', color: '#555', fontSize: '13px', textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{item.name}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>{item.brand || 'RAJWADI'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 12px', textAlign: 'center', color: '#555' }}>1</td>
                  <td style={{ padding: '15px 12px', textAlign: 'right', fontWeight: 'bold', color: '#333' }}>₹{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ width: '100%', maxWidth: '300px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555', fontSize: '14px' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', color: '#432227' }}>
              <span>Total Paid</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <button onClick={() => navigate('/catalog')} style={{ padding: '12px 30px', backgroundColor: '#fff', color: '#432227', border: '1px solid #432227', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = '#432227'; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#432227'; }}>
              Continue Shopping
            </button>
            <p style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>A copy of this receipt will be sent to {customer.email}</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Invoice;
