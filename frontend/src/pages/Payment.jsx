import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/payment.service';

function Payment() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null); // Will store { razorpayOrderId, amount, currency }
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayNow = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Create Razorpay Order from backend
      const { razorpayOrderId, amount, currency } = await paymentService.createPaymentOrder(orderNumber);
      setPaymentDetails({ razorpayOrderId, amount, currency });

      // Step 2: Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Test Key from env
        amount: amount, 
        currency: currency,
        order_id: razorpayOrderId,
        name: "Rajwadi Collection",
        description: `Order ${orderNumber}`,
        image: "https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg",
        handler: async function (response) {
          // Step 6: Verify payment via backend
          try {
            setIsLoading(true);
            await paymentService.verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            
            // Payment verified successfully
            setPaymentSuccess(true);
            setTimeout(() => {
              navigate('/account'); // Navigate to account/orders later
            }, 3000);
          } catch (verificationError) {
            setError(verificationError.message || 'Payment verification failed. If money was deducted, it will be refunded.');
            setIsLoading(false);
          }
        },
        theme: {
          color: "#432227"
        }
      };

      // Step 3: Open Razorpay Popup
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response){
        setError(`Payment Failed: ${response.error.description}`);
        setIsLoading(false);
      });

      // Handle popup closed
      razorpay.on('payment.closed', function() {
        setIsLoading(false);
        // User closed the popup, error could just be a notice or ignored.
      });

      razorpay.open();

    } catch (err) {
      setError(err.message || 'Failed to initialize payment.');
      setIsLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <section className="view-section active" style={{ paddingTop: '150px', paddingBottom: '100px', backgroundColor: '#fcf8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#eaf5eb', color: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 25px auto' }}>
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '28px', marginBottom: '15px', marginTop: 0 }}>Payment Successful!</h1>
          <p style={{ color: '#555', fontSize: '15px', marginBottom: '10px' }}>Your order has been confirmed.</p>
          <p style={{ color: '#888', fontSize: '13px' }}>Redirecting to your orders...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="view-section active" style={{ paddingTop: '150px', paddingBottom: '100px', backgroundColor: '#fcf8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '28px', marginBottom: '15px', marginTop: 0 }}>Complete Your Payment</h1>
        
        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb', textAlign: 'left', fontSize: '14px' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        <div style={{ display: 'inline-block', backgroundColor: '#f9f9f9', padding: '15px 30px', borderRadius: '8px', border: '1px solid #eaeaea', margin: '10px 0 30px 0', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px dashed #ddd', paddingBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: '#888' }}>Order Number</span>
            <strong style={{ fontSize: '15px', color: '#432227' }}>{orderNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: '#888' }}>Status</span>
            <strong style={{ fontSize: '14px', color: '#f39c12' }}><i className="fa-regular fa-clock"></i> Pending Payment</strong>
          </div>
        </div>

        <button 
          onClick={handlePayNow}
          disabled={isLoading}
          style={{ width: '100%', padding: '16px', backgroundColor: isLoading ? '#ccc' : '#432227', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' }}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '15px' }}><i className="fa-solid fa-lock"></i> Secure Test Payment Gateway</p>
      </div>
    </section>
  );
}

export default Payment;
