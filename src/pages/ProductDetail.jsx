import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail({ products, toggleCart, wishlist = [], toggleWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = (products || []).find(p => p.id === id);
  
  // State for interactive features
  const [activeTab, setActiveTab] = useState('unstitched');
  const [previewTint, setPreviewTint] = useState(0); // Hue-rotate in degrees
  const [selectedMainImage, setSelectedMainImage] = useState(product ? product.image : '');

  // Fallback if product not found
  if (!product) {
    return (
      <section className="view-section active" style={{ paddingTop: '100px', padding: '100px 4%', minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/catalog')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Return to Catalog</button>
      </section>
    );
  }

  // Ensure selected main image matches product on first load if we navigated
  if (selectedMainImage === '' || (product.images && !product.images.includes(selectedMainImage) && selectedMainImage !== product.image)) {
      if (selectedMainImage !== product.image) {
          setSelectedMainImage(product.image);
          setPreviewTint(0);
      }
  }

  // Generate specs markup based on logic in old site
  const specs = [
    { label: "Fabric", value: product.fabric || 'Unknown' },
    { label: "Color", value: product.color || 'Unknown' },
    { label: "Work", value: (product.description || '').includes("embroidery") ? "Intricate Embroidery" : "Zari Work" },
    { label: "Availability", value: product.inStock !== false ? "In Stock" : "Out of Stock" }
  ];

  // Generate rating stars
  const fullStars = Math.floor(product.rating || 5);
  const hasHalfStar = (product.rating || 5) % 1 >= 0.5;

  return (
    <section id="product-detail-view" className="view-section active" style={{ paddingTop: '100px', padding: '100px 4%', paddingBottom: '60px' }}>
      <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px', color: '#3a1a20' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Catalog
      </button>

      <div className="product-detail-layout" id="productDetailContainer">
        
        {/* Gallery */}
        <div className="p-detail-images">
          <div className="p-detail-main-img" style={{ position: 'relative' }}>
            <button 
              title="Wishlist" 
              onClick={() => toggleWishlist(product.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <i className={`${wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} style={{ color: wishlist.includes(product.id) ? 'var(--color-maroon)' : '#555', fontSize: '20px' }}></i>
            </button>
            <img 
              src={selectedMainImage} 
              alt={product.name} 
              id="mainProductImage" 
              style={{ objectPosition: 'top center', filter: `hue-rotate(${previewTint}deg)` }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {(product.images && product.images.length >= 3) ? (
              product.images.slice(0, 3).map((imgUrl, idx) => (
                <img 
                  key={idx}
                  src={imgUrl} 
                  alt={`thumb-${idx}`}
                  onClick={() => { setSelectedMainImage(imgUrl); setPreviewTint(0); }}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', objectPosition: 'top center', border: selectedMainImage === imgUrl ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-light)', borderRadius: '4px', cursor: 'pointer' }}
                />
              ))
            ) : (
              <>
                <img 
                  src={product.image} 
                  alt="thumb-0" 
                  onClick={() => { setSelectedMainImage(product.image); setPreviewTint(0); }}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', border: previewTint === 0 ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-light)', borderRadius: '4px', cursor: 'pointer' }}
                />
                <img 
                  src={product.image} 
                  alt="thumb-1" 
                  onClick={() => { setSelectedMainImage(product.image); setPreviewTint(90); }}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', border: previewTint === 90 ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-light)', borderRadius: '4px', cursor: 'pointer', filter: 'hue-rotate(90deg)' }}
                />
                <img 
                  src={product.image} 
                  alt="thumb-2" 
                  onClick={() => { setSelectedMainImage(product.image); setPreviewTint(180); }}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', border: previewTint === 180 ? '2px solid var(--color-gold)' : '1px solid var(--color-gray-light)', borderRadius: '4px', cursor: 'pointer', filter: 'hue-rotate(180deg)' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Purchase details & Custom Stitching */}
        <div className="p-detail-info">
          <span className="p-detail-cat">{product.category}</span>
          <h1 className="p-detail-title">{product.name}</h1>
          <div className="p-detail-rating">
            <div className="stars">
              {[...Array(fullStars)].map((_, i) => <i key={`f-${i}`} className="fa-solid fa-star" style={{ color: '#f1c40f' }}></i>)}
              {hasHalfStar && <i className="fa-solid fa-star-half-stroke" style={{ color: '#f1c40f' }}></i>}
            </div>
            <span style={{ color: 'var(--color-gray-dark)', fontSize: '13px' }}>({product.reviews || 0} customer reviews)</span>
          </div>
          <div className="p-detail-price">₹{(product.price || 0).toFixed(2)}</div>
          <p className="p-detail-desc">{product.description}</p>

          <div className="p-detail-specs">
            {specs.map((s, idx) => (
              <div className="spec-item" key={idx}><strong>{s.label}:</strong> {s.value}</div>
            ))}
          </div>

          {/* Stitching System */}
          <div className="stitching-section">
            <h3 className="stitch-title">Stitching & Customization</h3>
            <div className="stitch-tabs">
              <button className={`stitch-tab ${activeTab === 'unstitched' ? 'active' : ''}`} onClick={() => setActiveTab('unstitched')}>Unstitched Fabric (+₹0)</button>
              <button className={`stitch-tab ${activeTab === 'standard' ? 'active' : ''}`} onClick={() => setActiveTab('standard')}>Standard Size (+₹20)</button>
              <button className={`stitch-tab ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Custom Tailoring (+₹50)</button>
            </div>

            {/* Unstitched panel */}
            <div className={`stitch-content-panel ${activeTab === 'unstitched' ? 'active' : ''}`}>
              <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)' }}>The product will be shipped as unstitched fabric dress materials, sarees with unstitched blouse piece, or unhemmed garments.</p>
            </div>

            {/* Standard Size panel */}
            <div className={`stitch-content-panel ${activeTab === 'standard' ? 'active' : ''}`}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Select Standard Size</label>
              <select className="standard-size-select">
                <option value="XS (Chest: 34 inch)">XS (Chest: 34 inch)</option>
                <option value="S (Chest: 36 inch)">S (Chest: 36 inch)</option>
                <option value="M (Chest: 38 inch)">M (Chest: 38 inch)</option>
                <option value="L (Chest: 40 inch)">L (Chest: 40 inch)</option>
                <option value="XL (Chest: 42 inch)">XL (Chest: 42 inch)</option>
                <option value="XXL (Chest: 44 inch)">XXL (Chest: 44 inch)</option>
              </select>
            </div>

            {/* Custom Tailoring panel */}
            <div className={`stitch-content-panel ${activeTab === 'custom' ? 'active' : ''}`}>
              <div className="custom-stitch-grid">
                <div className="measure-input-group">
                  <label>Bust / Chest (inches)</label>
                  <input type="number" min="30" max="60" placeholder="e.g. 36" />
                </div>
                <div className="measure-input-group">
                  <label>Waist (inches)</label>
                  <input type="number" min="24" max="55" placeholder="e.g. 30" />
                </div>
                <div className="measure-input-group">
                  <label>Height (ft/inches)</label>
                  <input type="text" placeholder="e.g. 5ft 4in" />
                </div>
                <div className="measure-input-group">
                  <label>Shoulder Width (inches)</label>
                  <input type="number" min="10" max="25" placeholder="e.g. 15" />
                </div>
                <div className="measure-input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Special Tailoring Instructions</label>
                  <input type="text" placeholder="e.g. Make sleeves full length, high neck collar." />
                </div>
                <span className="measure-note">Our imperial tailoring team will design this item specifically to your dimensions. Note: Custom orders add 5-7 days to shipping times.</span>
              </div>
            </div>
          </div>

          <div className="action-row" style={{ display: 'flex', gap: '10px', alignItems: 'stretch', marginTop: '20px' }}>
            <button className="btn-buy-now" onClick={() => toggleCart(true)} style={{ flex: 1, padding: '15px', background: 'var(--color-maroon)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: 'opacity 0.2s' }}>Buy Now</button>
            <button className="btn-add-cart-icon" onClick={() => toggleCart(true)} style={{ width: '50px', padding: 0, background: 'white', border: '1px solid var(--color-gray-light)', borderRadius: '4px', color: 'var(--color-maroon)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Add to Cart">
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
            <button 
              className="btn-wishlist-icon" 
              onClick={() => toggleWishlist(product.id)}
              style={{ width: '50px', padding: 0, background: 'white', border: '1px solid var(--color-gray-light)', borderRadius: '4px', color: wishlist.includes(product.id) ? 'var(--color-maroon)' : '#555', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} 
              title="Wishlist"
            >
              <i className={`${wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProductDetail;
