import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSidebar() {
  const navigate = useNavigate();
  const { isCartSidebarOpen, toggleCartSidebar, cartState, removeItem, updateQuantity, changeSize } = useCart();
  
  if (!isCartSidebarOpen) return null;

  const cartItems = cartState?.items || [];
  // Use cartState.subtotal from backend, or fallback to recalculating it if it's local state
  const cartTotal = Number(cartState?.subtotal) || cartItems.reduce((acc, item) => acc + ((Number(item.variant?.price) || Number(item.priceAtAdd) || Number(item.price) || 0) * item.quantity), 0);

  return (
    <>
      <div className="cart-drawer-overlay active" onClick={toggleCartSidebar} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, transition: 'opacity 0.3s' }}></div>
      <div className="cart-drawer active" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100vw', backgroundColor: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)', transform: 'translateX(0)', transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
        <div className="cart-drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', borderBottom: '1px solid #eaeaea', backgroundColor: '#fcf8f0' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#432227', margin: 0, fontWeight: '400' }}>Shopping Bag</h3>
          <button onClick={toggleCartSidebar} style={{ background: 'none', border: 'none', fontSize: '22px', color: '#432227', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-drawer-body" style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#777' }}>
              <i className="fa-solid fa-bag-shopping" style={{ fontSize: '3rem', color: '#e0d6c8', marginBottom: '20px' }}></i>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', marginBottom: '25px' }}>Your shopping bag is empty.</p>
              <button 
                onClick={() => { toggleCartSidebar(); navigate('/catalog'); }}
                style={{ backgroundColor: '#432227', color: '#fff', border: 'none', padding: '12px 30px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                onMouseOver={(e) => e.target.style.backgroundColor='#2a1518'} 
                onMouseOut={(e) => e.target.style.backgroundColor='#432227'}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {};
              const variant = item.variant || {};
              const price = Number(item.variant?.price || item.priceAtAdd || item.price) || 0;
              let image = '/assets/images/placeholder.png';
              if (product.images && product.images.length > 0) {
                 image = product.images[0].url || product.images[0].imageUrl || image;
              } else if (product.image) {
                 image = product.image;
              }
              
              if (image && !image.startsWith('http') && !image.startsWith('/')) {
                image = '/' + image;
              }

              return (
              <div key={item.id} style={{ display: 'flex', gap: '15px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', position: 'relative' }}>
                <div 
                  onClick={() => { toggleCartSidebar(); navigate(`/product/${product.slug || product.id}`); }} 
                  style={{ width: '90px', height: '120px', flexShrink: 0, cursor: 'pointer', borderRadius: '4px', overflow: 'hidden', border: '1px solid #f0f0f0' }}
                >
                  <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 75%', transition: 'transform 0.5s ease' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 
                      onClick={() => { toggleCartSidebar(); navigate(`/product/${product.slug || product.id}`); }} 
                      style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: '600', color: '#432227', cursor: 'pointer', paddingRight: '25px', lineHeight: '1.4' }}
                    >
                      {product.name}
                    </h4>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      title="Remove"
                      style={{ position: 'absolute', top: '5px', right: 0, background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer', fontSize: '16px', transition: 'color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.color = '#d9534f'}
                      onMouseOut={e => e.currentTarget.style.color = '#a0a0a0'}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', fontFamily: 'var(--font-sans)', marginRight: '8px' }}>Size:</span>
                    {product.variants && product.variants.length > 0 ? (
                      <select 
                        value={variant.id || ''}
                        onChange={(e) => changeSize(item.id, e.target.value, item.quantity)}
                        style={{ fontSize: '12px', padding: '2px 5px', borderRadius: '4px', border: '1px solid #ddd', color: '#432227', outline: 'none', cursor: 'pointer' }}
                      >
                        {product.variants.map(v => (
                          <option key={v.id} value={v.id}>{v.size}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#432227', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>{variant.size || variant.sku || 'Size unavailable'}</span>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#432227' }}>₹{price.toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '2px', padding: '2px' }}>
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px' }}>-</button>
                      <span style={{ fontSize: '12px', color: '#666', padding: '0 5px' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px' }}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div style={{ padding: '25px', borderTop: '1px solid #eaeaea', backgroundColor: '#fff', boxShadow: '0 -4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'var(--font-sans)' }}>
              <span style={{ fontWeight: '600', fontSize: '15px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtotal</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#432227' }}>₹{cartTotal.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginBottom: '15px', marginTop: '-5px' }}>Taxes and shipping calculated at checkout</p>
            <button 
              style={{ width: '100%', padding: '16px', backgroundColor: '#432227', color: '#fff', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
              onClick={() => {
                navigate('/checkout');
                toggleCartSidebar();
              }}
              onMouseOver={(e) => {e.target.style.backgroundColor='#2a1518'; e.target.style.boxShadow='0 4px 12px rgba(67, 34, 39, 0.2)'}} 
              onMouseOut={(e) => {e.target.style.backgroundColor='#432227'; e.target.style.boxShadow='none'}}
            >
              PROCEED TO CHECKOUT <i className="fa-solid fa-arrow-right-long"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartSidebar;
