import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Catalog({ products, wishlist = [], toggleWishlist }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    fabrics: [],
    priceRange: 'all'
  });
  const [sortBy, setSortBy] = useState('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const currentList = prev[type];
      if (currentList.includes(value)) {
        return { ...prev, [type]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
  };

  const filteredProducts = useMemo(() => {
    let result = [...(products || [])];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => (p.name && p.name.toLowerCase().includes(lowerQuery)) || (p.category && p.category.toLowerCase().includes(lowerQuery)));
    }

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    
    if (filters.colors.length > 0) {
      // Assuming product has a color array or string
      result = result.filter(p => {
         if (Array.isArray(p.color)) return p.color.some(c => filters.colors.includes(c));
         return filters.colors.includes(p.color);
      });
    }

    if (filters.fabrics.length > 0) {
      // Assuming product has fabric
      result = result.filter(p => filters.fabrics.includes(p.fabric));
    }

    if (filters.priceRange !== 'all') {
      result = result.filter(p => {
        if (filters.priceRange === 'under200') return p.price < 20000;
        if (filters.priceRange === '200-300') return p.price >= 20000 && p.price <= 300000;
        if (filters.priceRange === 'over300') return p.price > 300000;
        return true;
      });
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, filters, sortBy]);

  return (
    <section id="catalog-view" className="view-section active" style={{ paddingTop: '100px' }}>
      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${isMobileFilterOpen ? 'active' : ''}`}>
          <div className="filter-header-mobile">
            <h3 className="filter-title" style={{ marginBottom: 0 }}>Filters</h3>
            <button className="mobile-filter-close" onClick={() => setIsMobileFilterOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>


          {/* Color Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Color</h4>
            <div className="filter-options">
              {['Red', 'Cream', 'Green', 'Gold', 'Blue'].map(col => (
                <label className="filter-checkbox-label" key={col}>
                  <input 
                    type="checkbox" 
                    className="color-filter-check" 
                    value={col}
                    checked={filters.colors.includes(col)}
                    onChange={() => handleCheckboxChange('colors', col)}
                  /> {col}
                </label>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Fabric</h4>
            <div className="filter-options">
              {['Silk', 'Velvet', 'Georgette', 'Brocade'].map(fab => (
                <label className="filter-checkbox-label" key={fab}>
                  <input 
                    type="checkbox" 
                    className="fabric-filter-check" 
                    value={fab}
                    checked={filters.fabrics.includes(fab)}
                    onChange={() => handleCheckboxChange('fabrics', fab)}
                  /> {fab}
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Price Range</h4>
            <div className="filter-options">
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="all" 
                  checked={filters.priceRange === 'all'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: 'all' }))}
                /> All Prices
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="under200"
                  checked={filters.priceRange === 'under200'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: 'under200' }))}
                /> Under 20000
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="200-300"
                  checked={filters.priceRange === '200-300'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: '200-300' }))}
                /> 20000 - 300000
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="over300"
                  checked={filters.priceRange === 'over300'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: 'over300' }))}
                /> Over 300000
              </label>
            </div>
          </div>
        </aside>

        {/* Product List Panel */}
        <div className="catalog-content">
          <div className="catalog-content-header">
              <h2 className="catalog-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: 0, color: '#3a1a20' }}>
                {searchQuery ? `Search Results for "${searchQuery}"` : "Ethnic Wear Collections"}
              </h2>
            <div className="catalog-actions-row">
              <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
                <i className="fa-solid fa-sliders"></i> Filter
              </button>
              <div className="catalog-sorting">
                <span>Sort By:</span>
                <select id="sortSelect" className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Products */}
          <div className="catalog-grid-display" id="productGrid">
            {filteredProducts.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                <p>No products found matching your criteria.</p>
              </div>
            )}
            {filteredProducts.map(product => {
              const fullStars = Math.floor(product.rating || 5);
              const halfStar = (product.rating || 5) % 1 >= 0.5 ? 1 : 0;
              const emptyStars = 5 - (fullStars + halfStar);

              return (
                <div className="product-card" key={product.id}>
                  {product.tags && product.tags.length > 0 && product.id !== "prod-lehenga-01" && (
                    <span className="product-tag">{product.tags[0]}</span>
                  )}
                  <div className="product-img-wrapper" style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
                    <button 
                      title="Add to Wishlist" 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <i className={`${wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} style={{ color: wishlist.includes(product.id) ? 'var(--color-maroon)' : '#555', fontSize: '16px' }}></i>
                    </button>
                    <div onClick={() => navigate(`/product/${product.id}`)} style={{ width: '100%', height: '100%' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="product-details-summary">
                    <span className="product-cat">{product.id === "prod-lehenga-01" ? "" : product.category}</span>
                    <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
                    <div className="product-rating">
                      {[...Array(fullStars)].map((_, i) => <i key={`f-${i}`} className="fa-solid fa-star stars"></i>)}
                      {halfStar > 0 && <i className="fa-solid fa-star-half-stroke stars"></i>}
                      {[...Array(emptyStars)].map((_, i) => <i key={`e-${i}`} className="fa-regular fa-star stars"></i>)}
                      <span>({product.reviews || 0})</span>
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">₹{product.price.toFixed(2)}</span>
                      <button className="product-card-btn" onClick={() => navigate(`/product/${product.id}`)}>View Details</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Catalog;
