import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, CreditCard, Package } from 'lucide-react';
import { orderService } from '../services/order.service';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Shipping form state for transition to SHIPPED
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrderDetails(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === 'SHIPPED') {
      if (!shippingCarrier || !trackingNumber) {
        alert('Shipping Carrier and Tracking Number are required to mark as Shipped.');
        return;
      }
    }
    
    try {
      const payload = { status: newStatus };
      if (newStatus === 'SHIPPED') {
        payload.shippingCarrier = shippingCarrier;
        payload.trackingNumber = trackingNumber;
        if (trackingUrl) payload.trackingUrl = trackingUrl;
      }
      
      await orderService.updateOrderStatus(id, payload);
      setSuccessMsg(`Order marked as ${newStatus}`);
      fetchOrderDetails();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(id);
      setSuccessMsg('Order cancelled');
      fetchOrderDetails();
    } catch (err) {
      alert(err.message || 'Cancellation failed');
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Order Details...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;
  if (!order) return <div style={{ padding: '40px' }}>Order not found</div>;

  const addr = order.shippingAddress || {};
  const user = order.user || {};
  const items = order.items || [];

  return (
    <div className="order-details-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="admin-icon-btn" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft size={24} />
          </button>
          <h1>Order {order.orderNumber}</h1>
          <span className="admin-badge admin-badge-info" style={{ marginLeft: '12px' }}>{order.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {order.status !== 'CANCELLED' && order.status !== 'EXPIRED' && order.status !== 'DELIVERED' && (
             <button className="admin-btn admin-btn-outline" style={{ color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }} onClick={handleCancelOrder}>
               Cancel Order
             </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '4px', marginBottom: '20px' }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} /> Products</h2>
            <div className="admin-table-container" style={{ marginTop: '16px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           {item.productImage ? (
                             <img src={item.productImage} alt={item.productName} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                           ) : (
                             <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--admin-border)', borderRadius: '4px' }} />
                           )}
                           <div className="font-medium">{item.productName}</div>
                        </div>
                      </td>
                      <td>{item.sku} {item.size && `| ${item.size}`} {item.color && `| ${item.color}`}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{item.quantity}</td>
                      <td className="font-medium">{formatCurrency(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Tax</span>
                  <span>{formatCurrency(order.taxTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Shipping</span>
                  <span>{formatCurrency(order.shippingTotal)}</span>
                </div>
                {order.discountTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--admin-text-muted)' }}>Discount</span>
                    <span style={{ color: 'var(--admin-success)' }}>-{formatCurrency(order.discountTotal)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border)', paddingTop: '12px', marginTop: '4px', fontWeight: 'bold', fontSize: '18px' }}>
                  <span>Grand Total</span>
                  <span>{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2>Order Status Workflow</h2>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--admin-text-muted)' }}>Current Status: <strong style={{ color: 'var(--admin-text)' }}>{order.status}</strong></p>
              
              {order.status === 'CONFIRMED' && (
                <button className="admin-btn admin-btn-primary" onClick={() => handleStatusUpdate('PROCESSING')}>
                  Mark as Processing
                </button>
              )}
              
              {order.status === 'PROCESSING' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '4px', border: '1px solid var(--admin-border)' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '14px' }}>Shipping Details Required</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    <input type="text" className="admin-input" placeholder="Shipping Carrier (e.g. BlueDart)" value={shippingCarrier} onChange={e => setShippingCarrier(e.target.value)} />
                    <input type="text" className="admin-input" placeholder="Tracking Number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
                    <input type="url" className="admin-input" placeholder="Tracking URL (Optional)" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} />
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={() => handleStatusUpdate('SHIPPED')}>
                    Mark as Shipped
                  </button>
                </div>
              )}
              
              {order.status === 'SHIPPED' && (
                <div>
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                    <p><strong>Carrier:</strong> {order.shippingCarrier}</p>
                    <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                  </div>
                  <button className="admin-btn admin-btn-success" onClick={() => handleStatusUpdate('DELIVERED')}>
                    Mark as Delivered
                  </button>
                </div>
              )}
              
              {order.status === 'DELIVERED' && (
                <div style={{ color: 'var(--admin-success)', fontWeight: 'bold' }}>This order has been delivered.</div>
              )}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="admin-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={20} /> Customer</h2>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p><strong>{user.firstName} {user.lastName}</strong></p>
              <p style={{ color: 'var(--admin-text-muted)' }}>{user.email}</p>
              <p style={{ color: 'var(--admin-text-muted)' }}>{user.phone || 'No phone provided'}</p>
            </div>
          </div>

          <div className="admin-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} /> Shipping</h2>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p><strong>{addr.fullName}</strong></p>
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
              <p>{addr.country}</p>
              <p style={{ marginTop: '8px', color: 'var(--admin-text-muted)' }}>Phone: {addr.phone}</p>
            </div>
          </div>

          <div className="admin-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={20} /> Payment</h2>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p>
                Status: <span className={`admin-badge ${order.paymentStatus === 'PAID' ? 'admin-badge-success' : 'admin-badge-warning'}`}>{order.paymentStatus}</span>
              </p>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Paid on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
