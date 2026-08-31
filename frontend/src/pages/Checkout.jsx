import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { addressService } from '../services/address.service';
import { checkoutService } from '../services/checkout.service';
import AddressForm from '../components/AddressForm';

function Checkout() {
  const navigate = useNavigate();
  const { cartState, refreshCart, toggleCartSidebar } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  // Order Summary State
  const [couponInput, setCouponInput] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = cartState?.items || [];

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const res = await addressService.getAddresses();
      const fetchedAddresses = res.data || [];
      setAddresses(fetchedAddresses);
      if (fetchedAddresses.length > 0 && !selectedAddressId) {
        const defaultAddress = fetchedAddresses.find(a => a.isDefault);
        setSelectedAddressId(defaultAddress ? defaultAddress.id : fetchedAddresses[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Debounced Cart Preview
  useEffect(() => {
    if (cartItems.length === 0) return;

    const timer = setTimeout(async () => {
      try {
        setIsLoadingSummary(true);
        const res = await checkoutService.previewCart(couponInput);
        setOrderSummary(res);
      } catch (err) {
        console.error('Preview failed', err);
      } finally {
        setIsLoadingSummary(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [cartItems, couponInput]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty!");
      return;
    }

    if (!selectedAddressId) {
      setCheckoutError("Please select a shipping address.");
      return;
    }

    setIsProcessing(true);
    try {
      const order = await checkoutService.createOrder({
        addressId: selectedAddressId,
        couponCode: couponInput || undefined,
        paymentMethod: paymentMethod
      });
      
      // Refresh cart state to reflect it's empty now
      await refreshCart();
      
      if (paymentMethod === 'COD') {
        navigate(`/account/orders`);
      } else {
        navigate(`/payment/${order.orderNumber}`);
      }
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressAdded = (newAddress) => {
    setIsAddingAddress(false);
    fetchAddresses().then(() => {
      setSelectedAddressId(newAddress.id);
    });
  };

  return (
    <section className="view-section active" style={{ paddingTop: '120px', paddingBottom: '60px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '32px', marginBottom: '30px' }}>Checkout</h1>
        
        {checkoutError && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {checkoutError}
          </div>
        )}

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* Left Column (Address & Payment) */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Shipping Address Selection */}
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#432227', margin: 0 }}>Shipping Address</h2>
              {!isAddingAddress && addresses.length > 0 && (
                <button type="button" onClick={() => setIsAddingAddress(true)} style={{ background: 'none', border: '1px solid #a48c5a', color: '#a48c5a', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>+ Add New</button>
              )}
            </div>

            {isLoadingAddresses ? (
              <p>Loading addresses...</p>
            ) : isAddingAddress || addresses.length === 0 ? (
              <div>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '15px' }}>{addresses.length === 0 ? "You don't have any saved addresses. Please add one to continue." : "Add a new shipping address"}</p>
                <AddressForm 
                  onSuccess={handleAddressAdded} 
                  onCancel={addresses.length > 0 ? () => setIsAddingAddress(false) : undefined} 
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {addresses.map(address => (
                  <label key={address.id} style={{ display: 'flex', gap: '15px', padding: '15px', border: selectedAddressId === address.id ? '2px solid #a48c5a' : '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', alignItems: 'flex-start', backgroundColor: selectedAddressId === address.id ? '#fdfcf9' : '#fff' }}>
                    <input 
                      type="radio" 
                      name="selectedAddress" 
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      style={{ marginTop: '3px', accentColor: '#a48c5a' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#432227', marginBottom: '5px' }}>
                        {address.fullName} 
                        {address.addressType && <span style={{ marginLeft: '10px', fontSize: '10px', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', color: '#555' }}>{address.addressType}</span>}
                      </div>
                      <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                        {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                        {address.city}, {address.state} - {address.postalCode}
                      </div>
                      <div style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>Phone: {address.phone}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#432227', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Payment Method</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', gap: '15px', padding: '15px', border: paymentMethod === 'RAZORPAY' ? '2px solid #a48c5a' : '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', alignItems: 'center', backgroundColor: paymentMethod === 'RAZORPAY' ? '#fdfcf9' : '#fff' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  style={{ accentColor: '#a48c5a' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#432227' }}>Pay Online (Razorpay)</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>Credit/Debit Cards, UPI, NetBanking</div>
                </div>
              </label>

              <label style={{ display: 'flex', gap: '15px', padding: '15px', border: paymentMethod === 'COD' ? '2px solid #a48c5a' : '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', alignItems: 'center', backgroundColor: paymentMethod === 'COD' ? '#fdfcf9' : '#fff' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: '#a48c5a' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#432227' }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>Pay when your order arrives</div>
                </div>
              </label>
            </div>
          </div>
        </div>

          {/* Order Summary */}
          <div style={{ flex: '1 1 350px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#432227', margin: 0 }}>Order Summary</h2>
              <button type="button" onClick={toggleCartSidebar} style={{ background: 'none', border: '1px solid #a48c5a', color: '#a48c5a', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                <i className="fa-solid fa-pen-to-square"></i> Edit
              </button>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {cartItems.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>Your cart is empty.</p>
              ) : (
                cartItems.map((item, index) => {
                  const product = item.product || {};
                  const price = Number(item.variant?.price || item.priceAtAdd || item.price) || 0;
                  let image = '/assets/images/placeholder.png';
                  if (product.images && product.images.length > 0) {
                     image = product.images[0].url || product.images[0].imageUrl || image;
                  } else if (product.image) {
                     image = product.image;
                  }
                  return (
                  <div key={item.id || index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '60px', height: '80px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 75%' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#432227' }}>{product.name}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Qty: {item.quantity} {item.variant?.size ? ` | Size: ${item.variant.size}` : ''}</p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '14px', color: '#432227' }}>₹{price.toFixed(2)}</p>
                    </div>
                  </div>
                )})
              )}
            </div>

            {/* Coupon Code Section */}
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Enter Coupon Code (Optional)" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', textTransform: 'uppercase', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ opacity: isLoadingSummary ? 0.6 : 1, transition: 'opacity 0.2s', pointerEvents: isLoadingSummary ? 'none' : 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555', fontSize: '14px' }}>
                <span>Subtotal</span>
                <span>₹{orderSummary ? (orderSummary.subtotal || 0).toFixed(2) : cartItems.reduce((acc, item) => acc + ((Number(item.variant?.price) || Number(item.priceAtAdd) || Number(item.price) || 0) * item.quantity), 0).toFixed(2)}</span>
              </div>
              
              {orderSummary?.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#28a745', fontSize: '14px' }}>
                  <span>Discount {orderSummary.couponInfo?.code ? `(${orderSummary.couponInfo.code})` : ''}</span>
                  <span>- ₹{(orderSummary.discount || 0).toFixed(2)}</span>
                </div>
              )}
              
              {orderSummary?.tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555', fontSize: '14px' }}>
                  <span>GST (Included)</span>
                  <span>₹{(orderSummary.tax || 0).toFixed(2)}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '14px', borderBottom: '1px dashed #eaeaea', paddingBottom: '15px' }}>
                <span>Shipping</span>
                <span>{orderSummary ? (orderSummary.shipping > 0 ? `₹${(orderSummary.shipping || 0).toFixed(2)}` : 'FREE') : 'FREE'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontWeight: 'bold', fontSize: '18px', color: '#432227' }}>
                <span>Total</span>
                <span>₹{orderSummary ? (orderSummary.estimatedTotal || orderSummary.grandTotal || 0).toFixed(2) : cartItems.reduce((acc, item) => acc + ((Number(item.variant?.price) || Number(item.priceAtAdd) || Number(item.price) || 0) * item.quantity), 0).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || isProcessing || isLoadingSummary}
              style={{ width: '100%', padding: '16px', backgroundColor: cartItems.length === 0 || isProcessing ? '#ccc' : '#432227', opacity: isLoadingSummary ? 0.7 : 1, color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase', cursor: cartItems.length === 0 || isProcessing || isLoadingSummary ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}
            >
              {isProcessing ? 'Processing Order...' : 'Place Order'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '15px' }}><i className="fa-solid fa-lock"></i> Secure Checkout</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
