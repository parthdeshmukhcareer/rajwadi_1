import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function Catalog({ products, wishlist = [], toggleWishlist, addToCart }) {
  useDocumentTitle('Shop Collection | Rajwadi');
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

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const currentList = prev[type];
      if (currentList.includes(value)) {
        return { ...prev, [type]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
    setPage(1); // Reset page on filter change
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = { page, limit: 12 };
        if (searchQuery) params.search = searchQuery;
        if (filters.categories.length > 0) params.category = filters.categories[0];
        if (filters.colors.length > 0) params.color = filters.colors[0];
        if (filters.fabrics.length > 0) params.fabric = filters.fabrics[0];
        if (filters.priceRange !== 'all') {
          if (filters.priceRange === 'under200') params.maxPrice = 20000;
          if (filters.priceRange === '200-300') { params.minPrice = 20000; params.maxPrice = 300000; }
          if (filters.priceRange === 'over300') params.minPrice = 300000;
        }
        if (sortBy && sortBy !== 'default') params.sort = sortBy;

        const { data, pagination } = await productService.getProducts(params);
        if (data && data.length > 0) {
          setFilteredProducts(data);
          setPagination(pagination);
        } else {
          throw new Error('No backend products');
        }
        setError(null);
      } catch (err) {
        // Fallback to local products filtering
        let local = [...(products || [])];
        if (searchQuery) {
          local = local.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (filters.categories.length > 0) {
          local = local.filter(p => filters.categories.includes(p.category));
        }
        if (filters.colors.length > 0) {
          local = local.filter(p => filters.colors.includes(p.color));
        }
        if (filters.fabrics.length > 0) {
          local = local.filter(p => filters.fabrics.includes(p.fabric));
        }
        if (filters.priceRange !== 'all') {
          local = local.filter(p => {
            const pr = Number(p.price || p.basePrice || 0);
            if (filters.priceRange === 'under200') return pr < 20000;
            if (filters.priceRange === '200-300') return pr >= 20000 && pr <= 300000;
            if (filters.priceRange === 'over300') return pr > 300000;
            return true;
          });
        }
        setFilteredProducts(local);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, filters, sortBy, page, products]);

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


          {/* Category Filter */}
          <div className="filter-group" style={{ marginBottom: '20px' }}>
            <h4 className="filter-group-title" style={{ marginBottom: '10px', fontSize: '15px' }}>Category</h4>
            <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {['Lehenga', 'Saree', 'Sherwani', 'Salwar Kameez'].map(cat => (
                <label className="filter-checkbox-label" key={cat} style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    className="category-filter-check" 
                    value={cat}
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleCheckboxChange('categories', cat)}
                  /> {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="filter-group" style={{ marginBottom: '20px' }}>
            <h4 className="filter-group-title" style={{ marginBottom: '10px', fontSize: '15px' }}>Color</h4>
            <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {['Red', 'Cream', 'Green', 'Gold', 'Blue'].map(col => (
                <label className="filter-checkbox-label" key={col} style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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



          {/* Price Filter */}
          <div className="filter-group" style={{ marginBottom: '10px' }}>
            <h4 className="filter-group-title" style={{ marginBottom: '10px', fontSize: '15px' }}>Price Range</h4>
            <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="filter-checkbox-label" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="all" 
                  checked={filters.priceRange === 'all'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: 'all' }))}
                /> All Prices
              </label>
              <label className="filter-checkbox-label" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="under200"
                  checked={filters.priceRange === 'under200'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: 'under200' }))}
                /> Under 20000
              </label>
              <label className="filter-checkbox-label" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="radio" 
                  name="price-filter" 
                  value="200-300"
                  checked={filters.priceRange === '200-300'}
                  onChange={() => setFilters(p => ({ ...p, priceRange: '200-300' }))}
                /> 20000 - 300000
              </label>
              <label className="filter-checkbox-label" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                {searchQuery ? `Search Results for "${searchQuery}"` : "Rajputi Poshakh Collections"}
              </h2>
            <div className="catalog-actions-row">
              <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
                <i className="fa-solid fa-sliders"></i> Filter
              </button>
              <div className="catalog-sorting">
                <span>Sort By:</span>
                <div className="custom-sort-dropdown" style={{ position: 'relative' }}>
                  <button 
                    onClick={() => { /* Toggle state */ document.getElementById('sortOptionsList').classList.toggle('show'); }} 
                    onBlur={() => { setTimeout(() => document.getElementById('sortOptionsList').classList.remove('show'), 200); }}
                    style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #d4d5d9', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#432227', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px', justifyContent: 'space-between' }}
                  >
                    <span>{
                      sortBy === 'default' ? 'Featured' : 
                      sortBy === 'price-low' ? 'Price: Low to High' : 
                      sortBy === 'price-high' ? 'Price: High to Low' : 
                      'Top Rated'
                    }</span>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', color: '#a48c5a' }}></i>
                  </button>
                  <ul id="sortOptionsList" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', listStyle: 'none', padding: '5px 0', margin: 0, width: '100%', minWidth: '180px', zIndex: 50, display: 'none', flexDirection: 'column' }}>
                    <style>{`
                      #sortOptionsList.show { display: flex !important; }
                      .sort-opt { padding: 10px 16px; cursor: pointer; font-family: var(--font-sans); font-size: 14px; color: #555; transition: all 0.2s; }
                      .sort-opt:hover { background-color: rgba(164, 140, 90, 0.1); color: #432227; }
                      .sort-opt.active { background-color: #fcf8f0; color: #432227; font-weight: bold; border-left: 3px solid #a48c5a; padding-left: 13px; }
                    `}</style>
                    <li className={`sort-opt ${sortBy === 'default' ? 'active' : ''}`} onClick={() => { setSortBy('default'); document.getElementById('sortOptionsList').classList.remove('show'); }}>Featured</li>
                    <li className={`sort-opt ${sortBy === 'price-low' ? 'active' : ''}`} onClick={() => { setSortBy('price-low'); document.getElementById('sortOptionsList').classList.remove('show'); }}>Price: Low to High</li>
                    <li className={`sort-opt ${sortBy === 'price-high' ? 'active' : ''}`} onClick={() => { setSortBy('price-high'); document.getElementById('sortOptionsList').classList.remove('show'); }}>Price: High to Low</li>
                    <li className={`sort-opt ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => { setSortBy('rating'); document.getElementById('sortOptionsList').classList.remove('show'); }}>Top Rated</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Products */}
          <div className="catalog-grid-display" id="productGrid">
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div style={{ padding: '40px', textAlign: 'center', width: '100%', gridColumn: '1 / -1', color: 'red' }}>
                <p>{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                <p>No products found matching your criteria.</p>
              </div>
            ) : (
              filteredProducts.map(product => {
                const fullStars = 5; // Default for now
                let imageUrl = '/assets/images/placeholder.png';
                if (product.image) {
                  imageUrl = product.image;
                } else if (product.images && product.images.length > 0) {
                  imageUrl = product.images[0].url || product.images[0] || imageUrl;
                }

                return (
                  <div className="product-card myntra-style-card" key={product.id}>
                    <div className="product-img-wrapper" style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }} onClick={() => navigate(`/product/${product.slug || product.id}`)}>
                      <button 
                        className="wishlist-btn-myntra"
                        title="Wishlist" 
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                      >
                        <i className={`${wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart`} style={{ color: wishlist.includes(product.id) ? '#ff3f6c' : '#535766', fontSize: '18px' }}></i>
                      </button>
                      <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} loading="lazy" />
                    </div>
                    <div className="product-details-summary" onClick={() => navigate(`/product/${product.slug || product.id}`)}>
                      <h3 className="product-brand">{product.brand || 'RAJWADI'}</h3>
                      <p className="product-title-myntra" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                      <div className="product-price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span className="product-price" style={{ fontSize: '16px', fontWeight: 'bold', color: '#3a1a20' }}>Rs. {product.startingPrice || product.basePrice || product.price}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#fff', color: '#432227', border: '1px solid #432227', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            title="Add to Cart"
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#432227'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#432227'; }}
                            onClick={(e) => { e.stopPropagation(); addToCart(product.defaultVariantId || product.id); }}
                          >
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                          <button 
                            style={{ padding: '0 12px', height: '32px', borderRadius: '4px', backgroundColor: '#432227', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#2a1518'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#432227'}
                            onClick={(e) => { e.stopPropagation(); addToCart(product.defaultVariantId || product.id); navigate('/checkout'); }}
                          >
                            BUY NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Catalog;
