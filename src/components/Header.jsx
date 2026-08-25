import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ cartCount, toggleCart, toggleWishlistSidebar }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="main-header" style={{ width: '100%', zIndex: 1000, position: 'relative', backgroundColor: '#1c120f' }}>
      <div className="header-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '80px', padding: '0 4%', boxSizing: 'border-box' }}>
        
        {/* Left side: Mobile Menu Toggle & Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="action-icon-btn mobile-menu-btn" title="Menu" style={{ marginRight: '15px', color: 'var(--color-gold)', fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="fa-solid fa-bars"></i>
          </button>

          <Link to="/" className="logo-area" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg" alt="Rajwadi Logo Desktop" style={{ height: '45px', width: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: '0' }} className="logo-desktop" />
            <img src="https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg" alt="Rajwadi Logo Mobile" style={{ height: '35px', width: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: '0' }} className="logo-mobile" />
          </Link>
        </div>

        {/* Center side: Navigation Links */}
        <nav className="nav-categories-header" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <ul className="nav-menu" style={{ display: 'flex', gap: '35px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li className="nav-item"><Link to="/" className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>HOME</Link></li>
            <li className="nav-item"><Link to="/about" className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>ABOUT US</Link></li>
            <li className="nav-item"><Link to="/story" className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>OUR STORY</Link></li>
            <li className="nav-item"><Link to="/catalog" className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>COLLECTIONS</Link></li>
            <li className="nav-item"><Link to="/blog" className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>BLOG</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>CONTACT US</Link></li>
          </ul>
        </nav>

        {/* Right side: Actions */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <button className="action-icon-btn" onClick={() => setIsSearchOpen(true)} title="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#d4c098', fontSize: '20px' }}></i>
          </button>
          <button className="action-icon-btn" onClick={toggleWishlistSidebar} title="Wishlist" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="fa-regular fa-heart" style={{ color: '#d4c098', fontSize: '20px' }}></i>
          </button>
          <Link to="/account" className="action-icon-btn account-btn" title="Account" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <i className="fa-regular fa-user" style={{ color: '#d4c098', fontSize: '20px' }}></i>
          </Link>
          <button className="action-icon-btn" onClick={toggleCart} title="Shopping Cart" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-bag-shopping" style={{ color: '#d4c098', fontSize: '20px' }}></i>
            <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#d4c098', color: '#2b161c', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{cartCount || 0}</span>
          </button>
        </div>
      </div>

      <div className={`search-overlay-bar ${isSearchOpen ? 'active' : ''}`} id="searchOverlayBar">
        <div className="search-overlay-container">
          <input 
            type="text" 
            id="searchInput" 
            className="search-overlay-input"
            placeholder="Search for Rajputi Poshakh, Accessories, Jewellery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button className="search-overlay-btn" id="searchBtn" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button className="search-overlay-close-btn" onClick={() => setIsSearchOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
