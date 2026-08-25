import React from 'react';
import { useNavigate } from 'react-router-dom';

function WishlistSidebar({ isOpen, onClose, wishlist, products, toggleWishlist }) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay active" onClick={onClose}></div>
      <div className="cart-drawer active">
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Your Wishlist</h3>
          <button className="cart-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-drawer-body">
          {wishlist.length === 0 ? (
            <div className="cart-empty-message">
              <p>Your wishlist is empty.</p>
              <button 
                className="btn-gold" 
                style={{ marginTop: '20px' }} 
                onClick={() => { onClose(); navigate('/catalog'); }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlist.map(productId => {
              const product = products.find(p => p.id === productId);
              if (!product) return null;

              return (
                <div className="cart-item-row" key={productId}>
                  <div 
                    className="cart-item-img" 
                    onClick={() => { onClose(); navigate(`/product/${productId}`); }} 
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="cart-item-info">
                    <h4 
                      className="cart-item-title" 
                      onClick={() => { onClose(); navigate(`/product/${productId}`); }} 
                      style={{ cursor: 'pointer' }}
                    >
                      {product.name}
                    </h4>
                    <div className="cart-item-price-qty">
                      <span className="cart-item-price">₹{(product.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    className="cart-remove-btn" 
                    onClick={() => toggleWishlist(productId)} 
                    title="Remove"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default WishlistSidebar;
