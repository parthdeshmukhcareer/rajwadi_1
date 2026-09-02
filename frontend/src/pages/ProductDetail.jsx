import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/review.service';

function ProductDetail({ products, toggleCart, wishlist = [], toggleWishlist }) { // Kept wishlist for now
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isCartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [crossSellProducts, setCrossSellProducts] = useState([]);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // State for interactive features
  const [activeTab, setActiveTab] = useState('unstitched');
  const [previewTint, setPreviewTint] = useState(0); // Hue-rotate in degrees
  const [selectedMainImage, setSelectedMainImage] = useState('');
  const [activeSize, setActiveSize] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductBySlug(slug);
        if (!data) throw new Error("Not found in backend");
        
        setProduct(data);
        if (data.name) {
          document.title = `${data.name} | Rajwadi`;
        }
        
        let mainImg = '/assets/images/placeholder.png';
        if (data.image) mainImg = data.image;
        else if (data.images && data.images.length > 0) mainImg = data.images[0].imageUrl || data.images[0].url || mainImg;
        if (mainImg && !mainImg.startsWith('http') && !mainImg.startsWith('/')) {
            mainImg = '/' + mainImg;
        }
        
        setSelectedMainImage(mainImg);
        setError(null);
      } catch (err) {
        // Fallback to mock data
        const localProd = products?.find(p => p.slug === slug || p.id === slug);
        if (localProd) {
          setProduct(localProd);
          if (localProd.name) {
            document.title = `${localProd.name} | Rajwadi`;
          }
          
          let mainImg = '/assets/images/placeholder.png';
          if (localProd.image) mainImg = localProd.image;
          else if (localProd.images && localProd.images.length > 0) mainImg = localProd.images[0].url || localProd.images[0] || mainImg;
          if (mainImg && !mainImg.startsWith('http') && !mainImg.startsWith('/')) {
              mainImg = '/' + mainImg;
          }
          
          setSelectedMainImage(mainImg);
          setError(null);
        } else {
          setError(err.message || 'Product not found');
        }
      } finally {
        setIsLoading(false);
      }
      
      // Fetch Cross Sell Products
      try {
        const crossSellRes = await productService.getProducts({ limit: 4 });
        if (crossSellRes && crossSellRes.data) {
          // Filter out current product
          const filtered = crossSellRes.data.filter(p => p.slug !== slug && p.id !== slug).slice(0, 4);
          setCrossSellProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch cross sell products", err);
      }
    };
    if (slug) fetchProduct();
  }, [slug, products]);

  if (isLoading) {
    return (
      <section className="view-section active" style={{ paddingTop: '100px', padding: '100px 4%', minHeight: '60vh' }}>
        <h2>Loading product...</h2>
      </section>
    );
  }

  // Fallback if product not found
  if (error || !product) {
    return (
      <section className="view-section active" style={{ paddingTop: '100px', padding: '100px 4%', minHeight: '60vh' }}>
        <h2>{error || 'Product not found'}</h2>
        <button onClick={() => navigate('/catalog')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Return to Catalog</button>
      </section>
    );
  }

  // Generate specs markup based on logic in old site
  const specs = [
    { label: "Category", value: product.category?.name || 'Unknown' },
    { label: "Fabric", value: 'N/A' }, // Update if backend adds fabric
    { label: "Color", value: 'N/A' }, // Update if backend adds color
    { label: "Availability", value: product.isActive ? "In Stock" : "Out of Stock" }
  ];

  // Generate rating stars
  const fullStars = Math.floor(product.rating || 5);
  const hasHalfStar = (product.rating || 5) % 1 >= 0.5;

  const handleAddToCart = async (redirect = false) => {
    if (redirect && !isAuthenticated) {
      alert("Please login to proceed with Buy Now.");
      navigate('/account');
      return;
    }
    if (!activeSize) {
      alert("Please select a size first.");
      return;
    }
    try {
      await addToCart(activeSize, quantity);
      if (redirect) {
        navigate('/checkout');
      }
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    }
  };

  const currentVariantUrl = typeof window !== 'undefined' ? window.location.href : '';
  const selectedVariantData = product.variants?.find(v => v.id === activeSize) || {};
  const currentSku = selectedVariantData.sku || product.sku || 'N/A';
  
  const handleWhatsAppEnquiry = () => {
    const text = `Hello Rajwadi, I want to enquire about this product:\nProduct: ${product.name}\nSKU: ${currentSku}\nURL: ${currentVariantUrl}`;
    window.open(`https://wa.me/919766631092?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailEnquiry = () => {
    const subject = `Enquiry: ${product.name}`;
    const body = `Hello Rajwadi,\n\nI want to enquire about this product:\nProduct: ${product.name}\nSKU: ${currentSku}\nURL: ${currentVariantUrl}\n\nPlease provide more details.`;
    window.location.href = `mailto:support@rajwadi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/account');
      return;
    }
    setReviewError(null);
    setReviewSuccess(null);
    setIsSubmittingReview(true);
    try {
      await reviewService.createReview(product.id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });
      setReviewSuccess('Thank you! Your review has been submitted.');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      
      // Refresh product data
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

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

          {/* Complete The Look Section */}
          {crossSellProducts.length > 0 && (
            <div style={{ marginTop: '50px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#432227', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Complete The Look</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                {crossSellProducts.map((item) => (
                  <Link to={`/product/${item.slug || item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      {(() => {
                        let crossImg = item.image || (item.images && (item.images[0]?.imageUrl || item.images[0]?.url)) || '/assets/images/placeholder.png';
                        if (crossImg && !crossImg.startsWith('http') && !crossImg.startsWith('/')) crossImg = '/' + crossImg;
                        return <img src={crossImg} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
                      })()}
                    </div>
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                      <div style={{ fontWeight: 'bold', color: '#d32f2f', fontSize: '14px' }}>Rs. {(Number(item.startingPrice || item.basePrice || item.price) || 0).toFixed(2)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Purchase details & Custom Stitching */}
        <div className="p-detail-info">
          <h1 className="p-detail-title" style={{ fontSize: '28px', color: '#111', marginBottom: '10px', lineHeight: '1.2' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            <span>SKU:{currentSku}</span>
            <span style={{ color: '#ccc' }}>|</span>
            <span>{product.stitchedType === 'STITCHED' ? 'Ready for immediate delivery' : 'Ships in 10–15 days'}</span>
          </div>
          <div className="p-detail-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '15px' }}>
            {[...Array(fullStars)].map((_, i) => <i key={`f-${i}`} className="fa-solid fa-star" style={{ color: '#a48c5a', fontSize: '14px' }}></i>)}
            {hasHalfStar && <i className="fa-solid fa-star-half-stroke" style={{ color: '#a48c5a', fontSize: '14px' }}></i>}
          </div>

          <div className="p-detail-price-myntra" style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
              {(product.compareAtPrice && product.compareAtPrice > (product.startingPrice || product.basePrice || product.price)) ? (
                 <span style={{ fontSize: '18px', color: '#888', textDecoration: 'line-through' }}>Rs. {(Number(product.compareAtPrice)).toFixed(2)}</span>
              ) : null}
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#d32f2f' }}>Rs. {(Number(product.startingPrice || product.basePrice || product.price) || 0).toFixed(2)}</span>
              <span style={{ backgroundColor: '#212121', color: '#fff', fontSize: '12px', padding: '4px 10px', borderRadius: '15px', fontWeight: 'bold' }}>Sold out</span>
            </div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '8px' }}>(Inclusive of all taxes)</div>
          </div>

          <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee', paddingTop: '10px' }}>
             <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px', fontWeight: 'bold' }}>Product Details:</h3>
             <div style={{ fontSize: '15px', color: '#555', lineHeight: '1.8' }}>
                <p>{product.description}</p>
                <div className="p-detail-specs" style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#fafafa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                  {specs.map((s, idx) => (
                    <div className="spec-item" key={idx} style={{ fontSize: '14px' }}><strong>{s.label}:</strong> {s.value}</div>
                  ))}
                </div>
             </div>
          </div>
          
          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
             <a href="#" style={{ color: '#0000FF', textDecoration: 'underline', fontWeight: 'bold', fontSize: '15px' }}>Stitching Service Available</a>
             <span style={{ color: '#666', fontSize: '15px' }}>(Optional)</span>
          </div>

          <div style={{ marginBottom: '25px', fontSize: '15px', color: '#333' }}>
             Shipping: <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>FREE (in India)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#333' }}>
                <i className="fa-regular fa-star" style={{ fontSize: '20px' }}></i>
                <span>Authentic & Quality Assured</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#333' }}>
                <i className="fa-solid fa-tags" style={{ fontSize: '20px' }}></i>
                <span>No Refund Policy Applies * <Link to="/no-refund-policy" style={{ color: '#333', textDecoration: 'underline' }}>Learn More</Link></span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#333' }}>
                <i className="fa-solid fa-arrow-rotate-left" style={{ fontSize: '20px' }}></i>
                <span>Shipping Policy Available * <Link to="/shipping-policy" style={{ color: '#333', textDecoration: 'underline' }}>Learn More</Link></span>
             </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
             <button onClick={handleWhatsAppEnquiry} style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: 1 }}>Enquiry on WhatsApp</button>
             <button onClick={handleEmailEnquiry} style={{ backgroundColor: '#F44336', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', flex: 1 }}>Enquiry on Email</button>
          </div>


          
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '25px', marginBottom: '25px' }}>
            <div className="size-selector-section" style={{ flex: '1 1 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#432227' }}>SELECT SIZE</span>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  style={{ background: 'rgba(164, 140, 90, 0.1)', color: '#a48c5a', border: '1px solid #a48c5a', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.05em' }}
                >
                  SIZE CHART &gt;
                </button>
              </div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {(() => {
                  const allowedSizes = ['S', 'M', 'L', 'XL'];
                  let displaySizes = [];
                  
                  if (product.variants && product.variants.length > 0) {
                     displaySizes = product.variants.filter(v => allowedSizes.includes(v.size?.toUpperCase() || v.sku?.split('-').pop()?.toUpperCase() || ''));
                  }
                  
                  // Removed fake sizes fallback
                  
                  if (displaySizes.length > 0) {
                    return displaySizes.map((variant) => {
                      const stock = variant.availableStock ?? variant.stockOnHand ?? 0;
                      return (
                      <div key={variant.id} 
                           onClick={() => stock > 0 && setActiveSize(variant.id)}
                           style={{ 
                             width: 'auto', minWidth: '50px', padding: '0 10px', height: '50px', borderRadius: '8px', 
                             border: activeSize === variant.id ? '2px solid #a48c5a' : '1px solid #d4d5d9', 
                             display: 'flex', alignItems: 'center', justifyContent: 'center', 
                             fontSize: '14px', fontWeight: 'bold', 
                             color: stock > 0 ? (activeSize === variant.id ? '#a48c5a' : '#432227') : '#ccc', 
                             cursor: stock > 0 ? 'pointer' : 'not-allowed', 
                             transition: 'all 0.2s', 
                             backgroundColor: activeSize === variant.id ? 'rgba(164, 140, 90, 0.05)' : 'transparent',
                             textDecoration: stock <= 0 ? 'line-through' : 'none',
                             textTransform: 'capitalize'
                           }} 
                      >
                        {variant.size || variant.sku}
                      </div>
                    )});
                  } else {
                    return <div style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>Size unavailable</div>;
                  }
                })()}
              </div>
              {(!product.variants || product.variants.length === 0) && (
                <div style={{ marginTop: '10px', color: '#d9534f', fontSize: '14px', fontWeight: '500' }}>
                  This product is currently unavailable. Please contact support.
                </div>
              )}
            </div>
            
            <div style={{ width: '130px' }}>
              <label style={{ display: 'block', marginBottom: '15px', color: '#432227', fontSize: '16px', fontWeight: 'bold' }}>Quantity</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', height: '50px', width: '100%' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ flex: 1, background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#666', height: '100%' }}>-</button>
                <input type="text" value={quantity} readOnly style={{ width: '40px', textAlign: 'center', border: 'none', outline: 'none', fontSize: '16px', fontWeight: 'bold', color: '#432227', background: 'transparent' }} />
                <button onClick={() => setQuantity(quantity + 1)} style={{ flex: 1, background: '#f9f9f9', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#666', height: '100%' }}>+</button>
              </div>
            </div>
          </div>

          <div className="action-row" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {(!product.variants || product.variants.length === 0 || (activeSize && product.variants.find(v => v.id === activeSize)?.availableStock <= 0)) ? (
               <>
                 <button disabled style={{ width: '100%', padding: '15px', background: '#fff', color: '#999', border: '1px solid #ccc', borderRadius: '4px', fontWeight: '600', cursor: 'not-allowed', fontSize: '16px' }}>Sold out</button>
                 <button disabled style={{ width: '100%', padding: '15px', background: '#e0e0e0', color: '#999', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'not-allowed', fontSize: '16px' }}>Buy it now</button>
               </>
            ) : (
               <>
                 <button className="btn-buy-now" onClick={() => handleAddToCart(false)} disabled={isCartLoading || !activeSize} style={{ width: '100%', padding: '15px', background: '#fff', color: '#111', border: '1px solid #111', borderRadius: '4px', fontWeight: '600', cursor: isCartLoading || !activeSize ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: isCartLoading || !activeSize ? 0.7 : 1, transition: 'all 0.2s' }}>
                   {isCartLoading ? 'Adding...' : 'Add to cart'}
                 </button>
                 <button className="btn-buy-now" onClick={() => handleAddToCart(true)} disabled={isCartLoading || !activeSize} style={{ width: '100%', padding: '15px', background: '#111', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: isCartLoading || !activeSize ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: isCartLoading || !activeSize ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                   Buy it now
                 </button>
               </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '24px' }} />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" style={{ height: '24px' }} />
          </div>


        </div>

      </div>

      {/* REVIEWS SECTION */}
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eaeaea' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>Customer Reviews</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          {/* Reviews List */}
          <div style={{ flex: '1 1 600px' }}>
            {product.reviews && product.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {product.reviews.map(review => (
                  <div key={review.id} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '2px', color: '#a48c5a', fontSize: '13px', marginBottom: '5px' }}>
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={i < review.rating ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                          ))}
                        </div>
                        <h4 style={{ margin: 0, color: '#432227', fontSize: '16px' }}>{review.title}</h4>
                      </div>
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '10px 0 15px 0' }}>{review.comment}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
                      <i className="fa-solid fa-circle-check" style={{ color: '#27ae60' }}></i>
                      <span><strong>{review.user?.firstName || 'Verified Customer'}</strong> - Verified Purchase</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fcfcfc', border: '1px dashed #ddd', borderRadius: '12px' }}>
                <p style={{ color: '#888', margin: 0 }}>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '20px', marginTop: 0, marginBottom: '20px' }}>Write a Review</h3>
            
            {!isAuthenticated ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>Please login to write a review for this product.</p>
                <button onClick={() => navigate('/account')} style={{ padding: '10px 20px', backgroundColor: '#432227', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Login to Review</button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                {reviewError && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '15px' }}>{reviewError}</div>}
                {reviewSuccess && <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', fontSize: '13px', marginBottom: '15px' }}>{reviewSuccess}</div>}
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Rating *</label>
                  <div style={{ display: 'flex', gap: '5px', color: '#a48c5a', fontSize: '20px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <i 
                        key={star} 
                        className={star <= reviewRating ? "fa-solid fa-star" : "fa-regular fa-star"} 
                        onClick={() => setReviewRating(star)}
                      ></i>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="reviewTitle" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Title *</label>
                  <input 
                    type="text" 
                    id="reviewTitle" 
                    required 
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summary of your experience" 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="reviewComment" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Review *</label>
                  <textarea 
                    id="reviewComment" 
                    required 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share details about fabric, fit, and overall quality..." 
                    rows="4" 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box' }} 
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#432227', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isSubmittingReview ? 'not-allowed' : 'pointer', opacity: isSubmittingReview ? 0.7 : 1 }}
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
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
