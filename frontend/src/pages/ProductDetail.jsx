import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail({ products, cart = [], toggleCart, addToCart, wishlist = [], toggleWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = (products || []).find(p => p.id === id);
  
  // State for interactive features
  const [activeTab, setActiveTab] = useState('unstitched');
  const [previewTint, setPreviewTint] = useState(0); // Hue-rotate in degrees
  const [selectedMainImage, setSelectedMainImage] = useState(product ? product.image : '');
  const [activeSize, setActiveSize] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

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
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: `hue-rotate(${previewTint}deg)`, transform: 'scale(1.5)', transformOrigin: 'center 75%' }} 
            />
          </div>
          
          {/* Thumbnails removed as per user request */}
        </div>

        {/* Purchase details & Custom Stitching */}
        <div className="p-detail-info">
          <span className="p-detail-cat">{product.category}</span>
          <h1 className="p-detail-title">{product.name}</h1>
          <div className="p-detail-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '15px' }}>
            {[...Array(fullStars)].map((_, i) => <i key={`f-${i}`} className="fa-solid fa-star" style={{ color: '#a48c5a', fontSize: '14px' }}></i>)}
            {hasHalfStar && <i className="fa-solid fa-star-half-stroke" style={{ color: '#a48c5a', fontSize: '14px' }}></i>}
          </div>

          <div className="p-detail-price-myntra" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#432227' }}>₹{(product.price || 0).toFixed(2)}</span>
              <span style={{ fontSize: '20px', color: '#888', textDecoration: 'line-through' }}>MRP ₹{(product.price * 1.5).toFixed(2)}</span>
              <span style={{ fontSize: '20px', color: '#a48c5a', fontWeight: 'bold' }}>(33% OFF)</span>
            </div>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>inclusive of all taxes</div>
          </div>
          
          <div className="size-selector-section" style={{ marginTop: '25px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#432227' }}>SELECT SIZE</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#a48c5a', cursor: 'pointer', letterSpacing: '0.05em' }} onClick={() => setIsSizeChartOpen(true)}>SIZE CHART &gt;</span>
            </div>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <div key={size} 
                     onClick={() => setActiveSize(size)}
                     style={{ width: '50px', height: '50px', borderRadius: '50%', border: activeSize === size ? '2px solid #a48c5a' : '1px solid #d4d5d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: activeSize === size ? '#a48c5a' : '#432227', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeSize === size ? 'rgba(164, 140, 90, 0.05)' : 'transparent' }} 
                     onMouseOver={(e) => { if(activeSize !== size) e.target.style.borderColor = '#a48c5a'; }} 
                     onMouseOut={(e) => { if(activeSize !== size) e.target.style.borderColor = '#d4d5d9'; }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          
          <p className="p-detail-desc">{product.description}</p>

          <div className="p-detail-specs">
            {specs.map((s, idx) => (
              <div className="spec-item" key={idx}><strong>{s.label}:</strong> {s.value}</div>
            ))}
          </div>

          {/* Stitching System */}
          <div className="stitching-section">
            <h3 className="stitch-title">Stitching & Customization</h3>
            <div className="stitch-tabs" style={{ display: 'flex', gap: '10px' }}>
              <button className={`stitch-tab ${activeTab === 'unstitched' ? 'active' : ''}`} onClick={() => setActiveTab('unstitched')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '12px 5px', textAlign: 'center', backgroundColor: activeTab === 'unstitched' ? '#1c120f' : '#fff', color: activeTab === 'unstitched' ? '#fff' : '#432227' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Unstitched Fabric</span>
                <span style={{ fontSize: '0.85em', opacity: 0.9 }}>(+₹0)</span>
              </button>
              <button className={`stitch-tab ${activeTab === 'standard' ? 'active' : ''}`} onClick={() => setActiveTab('standard')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '12px 5px', textAlign: 'center', backgroundColor: activeTab === 'standard' ? '#1c120f' : '#fff', color: activeTab === 'standard' ? '#fff' : '#432227' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Standard Size</span>
                <span style={{ fontSize: '0.85em', opacity: 0.9 }}>(+₹20)</span>
              </button>
              <button className={`stitch-tab ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '12px 5px', textAlign: 'center', backgroundColor: activeTab === 'custom' ? '#1c120f' : '#fff', color: activeTab === 'custom' ? '#fff' : '#432227' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Custom Tailoring</span>
                <span style={{ fontSize: '0.85em', opacity: 0.9 }}>(+₹50)</span>
              </button>
            </div>

            {/* Unstitched panel */}
            <div className={`stitch-content-panel ${activeTab === 'unstitched' ? 'active' : ''}`}>
              <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)' }}>The product will be shipped as unstitched fabric dress materials, sarees with unstitched blouse piece, or unhemmed garments.</p>
            </div>

            {/* Standard Size panel */}
            <div className={`stitch-content-panel ${activeTab === 'standard' ? 'active' : ''}`}>
              <p style={{ fontSize: '13px', color: 'var(--color-gray-dark)', marginBottom: '10px' }}>
                You have opted for standard stitching. Your outfit will be stitched according to the standard size selected.
              </p>
              <div style={{ padding: '10px 15px', backgroundColor: 'rgba(164, 140, 90, 0.05)', border: '1px solid rgba(164, 140, 90, 0.2)', borderRadius: '4px', display: 'inline-block', fontSize: '14px' }}>
                <strong>Selected Size:</strong> {activeSize ? <span style={{ color: '#432227', fontWeight: 'bold', marginLeft: '5px' }}>{activeSize}</span> : <span style={{ color: '#d9534f', marginLeft: '5px' }}>Please select a size from above</span>}
              </div>
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
            <button className="btn-buy-now" onClick={() => { if(!cart.includes(product.id)) addToCart(product.id); navigate('/checkout'); }} style={{ flex: 1, padding: '15px', background: '#1c120f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: 'opacity 0.2s' }}>Buy Now</button>
            <button className="btn-add-cart-icon" onClick={() => { !cart.includes(product.id) && addToCart(product.id); toggleCart(); }} style={{ width: '50px', padding: 0, background: 'white', border: '1px solid var(--color-gray-light)', borderRadius: '4px', color: cart.includes(product.id) ? 'var(--color-maroon)' : '#555', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title={cart.includes(product.id) ? "View Cart" : "Add to Cart"}>
              <i className={`fa-solid ${cart.includes(product.id) ? 'fa-cart-shopping' : 'fa-cart-plus'}`}></i>
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

      {isSizeChartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsSizeChartOpen(false)}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '500px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsSizeChartOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>Size Chart</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fcf8f0', color: '#432227' }}>
                  <th style={{ padding: '12px', border: '1px solid #eee' }}>Size</th>
                  <th style={{ padding: '12px', border: '1px solid #eee' }}>Chest (in)</th>
                  <th style={{ padding: '12px', border: '1px solid #eee' }}>Waist (in)</th>
                  <th style={{ padding: '12px', border: '1px solid #eee' }}>Hip (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '10px', border: '1px solid #eee', fontWeight: 'bold' }}>XS</td><td style={{ padding: '10px', border: '1px solid #eee' }}>34</td><td style={{ padding: '10px', border: '1px solid #eee' }}>26</td><td style={{ padding: '10px', border: '1px solid #eee' }}>36</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #eee', fontWeight: 'bold' }}>S</td><td style={{ padding: '10px', border: '1px solid #eee' }}>36</td><td style={{ padding: '10px', border: '1px solid #eee' }}>28</td><td style={{ padding: '10px', border: '1px solid #eee' }}>38</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #eee', fontWeight: 'bold' }}>M</td><td style={{ padding: '10px', border: '1px solid #eee' }}>38</td><td style={{ padding: '10px', border: '1px solid #eee' }}>30</td><td style={{ padding: '10px', border: '1px solid #eee' }}>40</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #eee', fontWeight: 'bold' }}>L</td><td style={{ padding: '10px', border: '1px solid #eee' }}>40</td><td style={{ padding: '10px', border: '1px solid #eee' }}>32</td><td style={{ padding: '10px', border: '1px solid #eee' }}>42</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #eee', fontWeight: 'bold' }}>XL</td><td style={{ padding: '10px', border: '1px solid #eee' }}>42</td><td style={{ padding: '10px', border: '1px solid #eee' }}>34</td><td style={{ padding: '10px', border: '1px solid #eee' }}>44</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
