import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import '../styles/new_arrivals.css';

const NewArrivals = ({ wishlist = [], toggleWishlist = () => {}, addToCart = () => {} }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [dbProducts, setDbProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest('/products?limit=12');
        if (response?.data) {
          setDbProducts(response.data);
          
          // Extract unique categories from db products
          const extractedCats = response.data.map(p => p.category?.name || 'Poshak').filter(Boolean);
          const uniqueCats = ['All', ...new Set(extractedCats)].slice(0, 5);
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products based on active category
  const filteredProducts = dbProducts.filter(p => {
    if (activeCategory === 'All') return true;
    const catName = p.category?.name || 'Poshak';
    return catName === activeCategory;
  }).slice(0, 8);

  // Provide fallback image if missing
  const getProductImage = (p) => {
    let imageUrl = '/assets/images/placeholder.png';
    if (p.image) {
      imageUrl = p.image;
    } else if (p.images && p.images.length > 0 && p.images[0].imageUrl) {
      imageUrl = p.images[0].imageUrl;
    }
    
    // Ensure local paths start with a slash
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = '/' + imageUrl;
    }
    return imageUrl;
  };

  const displayProducts = filteredProducts.map(p => ({
    ...p,
    image: getProductImage(p),
    categoryName: p.category?.name || 'Poshak'
  }));

  const sliderProducts = displayProducts.slice(1);

  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Entrance Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Auto Slider Logic
  useEffect(() => {
    let interval;
    if (!isHovered && displayProducts.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
      }, 2500); // 2.5 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered, displayProducts.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayProducts.length - 1 : prev - 1));
  };

  // Touch handlers for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const formatPrice = (p) => {
    const price = p.basePrice || p.startingPrice || p.price || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  // The featured product is the active slide
  const featuredProduct = displayProducts[currentIndex] || null;

  // For the infinite track effect without missing items on the right, we duplicate the array.
  const trackProducts = [...displayProducts, ...displayProducts, ...displayProducts];

  return (
    <section 
      ref={sectionRef}
      className={`new-arrivals-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="na-inner-wrapper">
        
        {/* Header Section */}
        <div className="na-header reveal-on-scroll">
          <span className="na-eyebrow">Rajputi Poshak</span>
          <h2 className="na-title">New Arrivals</h2>
        </div>

        {/* Content Section (Grid) */}
        <div className="na-content-grid">
          
          {/* Featured Product (Left) */}
          {featuredProduct && (
            <div className="na-featured-col na-reveal-item" style={{ transitionDelay: '100ms' }}>
              <div className="na-featured-card" onClick={() => navigate(`/product/${featuredProduct.slug || featuredProduct.id}`)}>
                <div className="na-featured-image-wrapper">
                  <div className="na-featured-badge">NEW ARRIVAL</div>
                  <button className="na-featured-wishlist" onClick={(e) => { e.stopPropagation(); toggleWishlist(featuredProduct.id); }}>
                    <i className={`${wishlist.includes(featuredProduct.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} style={{ color: wishlist.includes(featuredProduct.id) ? '#ff3f6c' : '#a48c5a' }}></i>
                  </button>
                  {/* Using key to force re-render/animation of image when it changes */}
                  <img key={featuredProduct.id} src={featuredProduct.image} alt={featuredProduct.name} className="na-featured-image" loading="lazy" />
                </div>
                <div className="na-featured-info">
                  <div className="na-featured-label">{featuredProduct.categoryName}</div>
                  <h3 className="na-featured-name">{featuredProduct.name}</h3>
                  <div className="na-featured-action-row">
                    <span className="na-featured-price">{formatPrice(featuredProduct)}</span>
                    <button className="na-add-to-bag" onClick={(e) => { 
                      e.stopPropagation(); 
                      if (featuredProduct.defaultVariantId) {
                        addToCart(featuredProduct.defaultVariantId); 
                      } else {
                        alert("No variants available for this product.");
                      }
                    }}>
                      ADD TO BAG <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slider Products (Right) */}
          <div className="na-slider-col na-reveal-item" style={{ transitionDelay: '200ms' }}>
            <div 
              className="na-slider-viewport"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="na-slider-nav">
                <button onClick={handlePrev} className="na-nav-btn"><i className="fa-solid fa-chevron-left"></i></button>
                <button onClick={handleNext} className="na-nav-btn"><i className="fa-solid fa-chevron-right"></i></button>
              </div>
              
              <div 
                className="na-slider-track"
                style={{
                  transform: `translateX(calc(-${currentIndex + 1} * (clamp(260px, 31%, 330px) + 20px)))`,
                }}
              >
                {trackProducts.map((product, index) => {
                  return (
                    <div 
                      key={product.id + '-' + index}
                      className="na-product-card"
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                    >
                      <div className="na-card-image-wrapper">
                        <img src={product.image} alt={product.name} className="na-card-image" loading="lazy" />
                        <button className="na-card-wishlist" onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}>
                          <i className={`${wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} style={{ color: wishlist.includes(product.id) ? '#ff3f6c' : '#a48c5a' }}></i>
                        </button>
                      </div>
                      <div className="na-card-info">
                        <div className="na-card-label">{product.categoryName}</div>
                        <h4 className="na-card-name">{product.name}</h4>
                        <div className="na-card-bottom">
                          <span className="na-card-price">{formatPrice(product)}</span>
                          <button className="na-card-add-btn" onClick={(e) => { 
                            e.stopPropagation(); 
                            if (product.defaultVariantId) {
                              addToCart(product.defaultVariantId); 
                            } else {
                              alert("No variants available for this product.");
                            }
                          }}>
                            ADD TO BAG <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
