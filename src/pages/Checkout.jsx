import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, products, clearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const cartItems = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0), 0);
  const shippingFee = cartTotal > 0 ? 50 : 0;
  const grandTotal = cartTotal + shippingFee;

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Razorpay Integration
    const options = {
      key: "rzp_test_SzUU7Q3ojtl2Sx", // Test Key provided by user
      amount: grandTotal * 100, // Amount is in currency subunits (paise)
      currency: "INR",
      name: "Rajwadi Collection",
      description: "Guest Checkout Transaction",
      image: "https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg",
      handler: function (response) {
        // Payment successful
        console.log("Payment ID:", response.razorpay_payment_id);
        
        const orderDetails = {
          paymentId: response.razorpay_payment_id,
          date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          items: cartItems,
          subtotal: cartTotal,
          shipping: shippingFee,
          total: grandTotal,
          customer: formData
        };

        clearCart();
        navigate('/invoice', { state: { orderData: orderDetails } });
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: "#432227"
      }
    };

    const rzp1 = new window.Razorpay(options);
    
    rzp1.on('payment.failed', function (response){
      alert(`Payment Failed. Reason: ${response.error.description}`);
    });

    rzp1.open();
  };

  return (
    <section className="view-section active" style={{ paddingTop: '120px', paddingBottom: '60px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '32px', marginBottom: '30px' }}>Checkout</h1>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* Shipping Form */}
          <div style={{ flex: '1 1 600px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#432227', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Guest Information</h2>
            <form id="checkout-form" onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Phone Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="For order updates" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Delivery Address *</label>
                <textarea name="address" required value={formData.address} onChange={handleInputChange} placeholder="House No, Building, Street, Area" rows="3" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>State *</label>
                  <input type="text" name="state" required value={formData.state} onChange={handleInputChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Pincode *</label>
                  <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                </div>
              </div>

            </form>
          </div>

          {/* Order Summary */}
          <div style={{ flex: '1 1 350px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#432227', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Order Summary</h2>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {cartItems.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>Your cart is empty.</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '60px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 75%' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#432227' }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Qty: 1</p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '14px', color: '#432227' }}>₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555', fontSize: '14px' }}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '14px', borderBottom: '1px dashed #eaeaea', paddingBottom: '15px' }}>
              <span>Shipping</span>
              <span>{cartTotal > 0 ? `₹${shippingFee.toFixed(2)}` : '₹0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontWeight: 'bold', fontSize: '18px', color: '#432227' }}>
              <span>Total</span>
              <span>₹{cartTotal > 0 ? grandTotal.toFixed(2) : '0.00'}</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={cartItems.length === 0}
              style={{ width: '100%', padding: '16px', backgroundColor: cartItems.length === 0 ? '#ccc' : '#432227', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase', cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' }}
              onMouseOver={e => !cartItems.length === 0 && (e.target.style.backgroundColor = '#2a1518')}
              onMouseOut={e => !cartItems.length === 0 && (e.target.style.backgroundColor = '#432227')}
            >
              Pay with Razorpay
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '15px' }}><i className="fa-solid fa-lock"></i> Secure Payment Gateway</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
