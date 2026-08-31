import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/order.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function OrderDetails() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await orderService.getOrderDetails(orderNumber);
        // Flatten the backend response { order, items } into a single object
        setOrder({ ...res.order, items: res.items });
      } catch (err) {
        setError(err.message || 'Failed to load order details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    setCancelError(null);
    setCancelLoading(true);
    try {
      const res = await orderService.cancelOrder(orderNumber);
      // Backend might return updated order or just a success message.
      // Easiest is to reload the order details.
      const updatedOrderRes = await orderService.getOrderDetails(orderNumber);
      setOrder({ ...updatedOrderRes.order, items: updatedOrderRes.items });
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel the order.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    try {
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.width; // typically 210 for A4
      
      // --- HEADER ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(67, 34, 39); // #432227
      doc.text('RAJWADI', 14, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text('INVOICE', pageWidth - 14, 25, { align: 'right' });
      
      // Horizontal line
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(14, 35, pageWidth - 14, 35);
      
      // --- ORDER & BILLING INFO ---
      // Left side: Order Info
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(67, 34, 39);
      doc.text('ORDER DETAILS', 14, 45);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(`Order Number: ${order.orderNumber}`, 14, 52);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 58);
      doc.text(`Payment Status: ${order.paymentStatus}`, 14, 64);
      doc.text(`Order Status: ${order.status}`, 14, 70);

      // Right side: Bill To
      doc.setFont("helvetica", "bold");
      doc.setTextColor(67, 34, 39);
      doc.text('BILL TO', pageWidth - 14, 45, { align: 'right' });
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const name = order.shippingAddress?.fullName || (order.user ? order.user.firstName + ' ' + order.user.lastName : 'Customer');
      doc.text(name, pageWidth - 14, 52, { align: 'right' });
      
      if (order.shippingAddress?.addressLine1) {
        doc.text(order.shippingAddress.addressLine1, pageWidth - 14, 58, { align: 'right' });
      }
      if (order.shippingAddress?.addressLine2) {
        doc.text(order.shippingAddress.addressLine2, pageWidth - 14, 64, { align: 'right' });
      }
      const cityState = `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}`;
      doc.text(cityState, pageWidth - 14, order.shippingAddress?.addressLine2 ? 70 : 64, { align: 'right' });
      
      // --- TABLE ---
      const tableColumn = ["Item", "Variant", "Qty", "Price", "Total"];
      const tableRows = [];
      
      order.items.forEach(item => {
        const variantDesc = [item.color, item.size].filter(Boolean).join(' / ') || '-';
        const rowData = [
          item.productName || 'Product',
          variantDesc,
          item.quantity || 1,
          `Rs. ${Number(item.unitPrice || 0).toFixed(2)}`,
          `Rs. ${(Number(item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}`
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        headStyles: { 
          fillColor: [67, 34, 39], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 70 },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        alternateRowStyles: { fillColor: [252, 250, 246] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      const finalY = doc.lastAutoTable.finalY || 85;
      
      // --- TOTALS SECTION ---
      let currentY = finalY + 15;
      const rightMargin = pageWidth - 14;
      const labelX = rightMargin - 40; // X position for the labels (Subtotal, Tax, etc)
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      
      doc.text(`Subtotal:`, labelX, currentY);
      doc.text(`Rs. ${Number(order.subtotal).toFixed(2)}`, rightMargin, currentY, { align: 'right' });
      
      currentY += 8;
      if (Number(order.discountTotal) > 0) {
        doc.text(`Discount:`, labelX, currentY);
        doc.setTextColor(39, 174, 96); // Green for discount
        doc.text(`-Rs. ${Number(order.discountTotal).toFixed(2)}`, rightMargin, currentY, { align: 'right' });
        doc.setTextColor(80, 80, 80); // Reset color
        currentY += 8;
      }
      
      doc.text(`Tax (GST):`, labelX, currentY);
      doc.text(`Rs. ${Number(order.taxTotal).toFixed(2)}`, rightMargin, currentY, { align: 'right' });
      currentY += 8;
      
      doc.text(`Shipping:`, labelX, currentY);
      doc.text(Number(order.shippingTotal) === 0 ? 'FREE' : `Rs. ${Number(order.shippingTotal).toFixed(2)}`, rightMargin, currentY, { align: 'right' });
      
      // Grand Total Box
      currentY += 8;
      doc.setDrawColor(230, 230, 230);
      doc.line(labelX, currentY, rightMargin, currentY); // Line above grand total
      
      currentY += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(67, 34, 39);
      doc.text(`Grand Total:`, labelX, currentY);
      doc.text(`Rs. ${Number(order.grandTotal).toFixed(2)}`, rightMargin, currentY, { align: 'right' });
      
      // --- FOOTER ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text('Thank you for shopping with Rajwadi!', pageWidth / 2, 280, { align: 'center' });
      doc.text('www.rajwadi.com', pageWidth / 2, 286, { align: 'center' });
      
      doc.save(`Invoice_${order.orderNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 0' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '32px', marginBottom: '15px' }}></i>
          <p>Retrieving Order Details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '12px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '28px', marginBottom: '15px' }}>Oops!</h1>
            <p style={{ color: '#e74c3c', marginBottom: '20px' }}>{error || 'Order not found.'}</p>
            <Link to="/account/orders" style={{ display: 'inline-block', backgroundColor: '#432227', color: '#fff', padding: '12px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Back to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

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

  const shippingFlow = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  let currentFlowIndex = shippingFlow.indexOf(order.status);
  if (currentFlowIndex === -1 && order.status !== 'CANCELLED' && order.status !== 'PENDING_PAYMENT') {
    currentFlowIndex = 0;
  }

  // Determine if cancellation is allowed (fallback logic visually, actual logic is in backend)
  const canCancel = ['PENDING_PAYMENT', 'CONFIRMED'].includes(order.status);

  return (
    <div>
      <div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/account/orders" style={{ color: '#a48c5a', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>&larr; Back to All Orders</Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '32px', margin: '0 0 5px 0' }}>Order Details</h1>
            <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Placed on {formattedDate}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
              <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Payment</span>
              <span style={{ color: getPaymentStatusColor(order.paymentStatus), fontWeight: 'bold', fontSize: '13px' }}>{order.paymentStatus}</span>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
              <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Order Status</span>
              <span style={{ color: getStatusColor(order.status), fontWeight: 'bold', fontSize: '13px' }}>{order.status}</span>
            </div>
          </div>
        </div>

        {cancelError && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {cancelError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          
          {/* Customer & Shipping Info */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '20px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Shipping Details</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ display: 'block', color: '#333', fontSize: '15px', marginBottom: '5px' }}>{order.shippingAddress?.fullName || order.user?.firstName + ' ' + order.user?.lastName}</strong>
              <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0', lineHeight: '1.5' }}>
                {order.shippingAddress?.addressLine1}<br />
                {order.shippingAddress?.addressLine2 && <>{order.shippingAddress?.addressLine2}<br /></>}
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                {order.shippingAddress?.country || 'India'}
              </p>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                <i className="fa-solid fa-phone" style={{ fontSize: '12px', color: '#a48c5a', marginRight: '5px' }}></i> {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Tracking Flow */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '20px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Tracking Status</h3>
            
            {order.status === 'CANCELLED' ? (
              <div style={{ padding: '20px', backgroundColor: '#fef1f0', color: '#e74c3c', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                This order has been cancelled.
              </div>
            ) : order.status === 'PENDING_PAYMENT' ? (
               <div style={{ padding: '20px', backgroundColor: '#fff8e5', color: '#f39c12', borderRadius: '8px', textAlign: 'center' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Awaiting Payment Completion.</strong>
                <Link to={`/payment/${order.orderNumber}`} style={{ display: 'inline-block', backgroundColor: '#432227', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
                  Pay Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '30px 0 20px 0' }}>
                {/* Progress Line */}
                <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', backgroundColor: '#eaeaea', zIndex: 1 }}></div>
                <div style={{ position: 'absolute', top: '15px', left: '10%', width: currentFlowIndex >= 0 ? `${(currentFlowIndex / (shippingFlow.length - 1)) * 80}%` : '0%', height: '3px', backgroundColor: '#a48c5a', zIndex: 2, transition: 'width 0.5s ease' }}></div>

                {shippingFlow.map((step, index) => {
                  const isCompleted = index <= currentFlowIndex;
                  return (
                    <div key={step} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: isCompleted ? '#a48c5a' : '#fff', border: `3px solid ${isCompleted ? '#a48c5a' : '#eaeaea'}`, color: isCompleted ? '#fff' : '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', fontSize: '12px' }}>
                        <i className={`fa-solid ${index === 0 ? 'fa-check' : index === 1 ? 'fa-box' : index === 2 ? 'fa-truck-fast' : 'fa-house'}`}></i>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: isCompleted ? '#432227' : '#aaa', textTransform: 'uppercase' }}>{step}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tracking Info if available */}
            {order.trackingNumber && (
              <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Carrier</span>
                  <strong style={{ fontSize: '13px', color: '#432227' }}>{order.shippingCarrier || 'Standard Delivery'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Tracking No.</span>
                  <strong style={{ fontSize: '13px', color: '#432227' }}>{order.trackingNumber}</strong>
                </div>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '10px', textAlign: 'center', color: '#a48c5a', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>Track Package <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '10px' }}></i></a>
                )}
              </div>
            )}

            {/* Cancellation Button */}
            {canCancel && order.status !== 'CANCELLED' && (
               <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                    style={{ background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: cancelLoading ? 'not-allowed' : 'pointer', textTransform: 'uppercase' }}
                  >
                    {cancelLoading ? 'Processing...' : 'Cancel Order'}
                  </button>
               </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '20px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Items Ordered</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', alignItems: 'start' }}>
            {/* Items Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ width: '80px', height: '100px', backgroundColor: '#fcfcfc', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img 
                      src={item.productImage || '/assets/images/placeholder.png'} 
                      alt={item.productName || 'Product'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/placeholder.png'; }}
                    />
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#432227' }}>{item.productName || 'Unknown Product'}</h4>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', display: 'flex', gap: '15px' }}>
                      {item.color && <span>Color: <strong>{item.color}</strong></span>}
                      {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    </div>
                    <div style={{ fontSize: '13px', color: '#555' }}>
                      Qty: <strong>{item.quantity}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#432227' }}>₹{Number(item.unitPrice).toFixed(2)}</span>
                    {item.quantity > 1 && (
                      <span style={{ fontSize: '11px', color: '#888' }}>₹{(Number(item.unitPrice) * item.quantity).toFixed(2)} total</span>
                    )}
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={handleDownloadInvoice}
                  style={{ backgroundColor: '#fff', border: '1px solid #432227', color: '#432227', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fa-solid fa-file-pdf"></i> Download Invoice
                </button>
              </div>
            </div>

            {/* Summary Box Column */}
            <div style={{ backgroundColor: '#fcf8f0', padding: '25px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#432227' }}>Order Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#555' }}>
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              
              {Number(order.discountTotal) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#27ae60' }}>
                  <span>Discount</span>
                  <span>-₹{Number(order.discountTotal).toFixed(2)}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#555' }}>
                <span>Tax (GST)</span>
                <span>₹{Number(order.taxTotal).toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#555' }}>
                <span>Shipping</span>
                <span>{Number(order.shippingTotal) === 0 ? 'FREE' : `₹${Number(order.shippingTotal).toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid #ddd', fontSize: '18px', color: '#432227', fontWeight: 'bold' }}>
                <span>Grand Total</span>
                <span>₹{Number(order.grandTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetails;
