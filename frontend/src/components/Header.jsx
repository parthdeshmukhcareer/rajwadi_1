import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ cartCount, wishlistCount, toggleCart, toggleWishlistSidebar }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="main-header" style={{ width: '100%', zIndex: 1000, position: 'relative', backgroundColor: '#1c120f' }}>
      <div className="header-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '50px', padding: '0 30px 0 10px', boxSizing: 'border-box' }}>
        
        {/* Left side: Mobile Menu Toggle & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
          <button className="action-icon-btn mobile-menu-btn" title="Menu" onClick={() => setIsMobileMenuOpen(true)} style={{ marginRight: '15px', color: 'var(--color-gold)', fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="fa-solid fa-bars"></i>
          </button>

          <Link to="/" className="logo-area" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg" alt="Rajwadi Logo Desktop" style={{ height: '35px', width: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: '0' }} className="logo-desktop" />
            <img src="https://www.rajwadi.com/static/version1780378735/frontend/Aureatelabs/rajwadi/en_US/images/logo.svg" alt="Rajwadi Logo Mobile" style={{ height: '35px', width: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: '0' }} className="logo-mobile" />
          </Link>
        </div>

        {/* Center side: Navigation Links */}
        <nav className={`nav-categories-header ${isMobileMenuOpen ? 'active' : ''}`} style={{ backgroundColor: '#17100e' }}>
          <div className="mobile-drawer-header" style={{ backgroundColor: '#17100e' }}>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, paddingRight: '40px'}}>
              <span style={{color: '#dfceab', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', letterSpacing: '0.05em'}}>Rajwadi</span>
            </div>
          </div>
          <ul className="nav-menu" style={{ display: 'flex', gap: '35px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li className="nav-item"><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>HOME</Link></li>
            <li className="nav-item"><Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>COLLECTION</Link></li>
            <li className="nav-item"><Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>ABOUT US</Link></li>
            <li className="nav-item"><Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>BLOG</Link></li>
            <li className="nav-item"><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>CONTACT US</Link></li>
          </ul>
        </nav>
        
        {/* Mobile Overlay */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

        {/* Right side: Actions */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '25px', flex: 1, justifyContent: 'flex-end' }}>
          <button className="action-icon-btn" onClick={toggleWishlistSidebar} title="Wishlist" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="fa-regular fa-heart" style={{ color: '#d4c098', fontSize: '20px' }}></i>
            <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#d4c098', color: '#2b161c', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{wishlistCount || 0}</span>
          </button>
          
          <div style={{ position: 'relative' }} className="user-dropdown-container">
            <style>{`
              .user-dropdown-container:hover .user-dropdown-menu { display: block; }
              .user-dropdown-menu { display: none; position: absolute; top: 100%; right: -20px; background: white; border: 1px solid #eaeaea; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 10px 0; min-width: 180px; z-index: 1001; }
              .user-dropdown-menu::before { content: ''; position: absolute; top: -6px; right: 26px; width: 10px; height: 10px; background: white; border-top: 1px solid #eaeaea; border-left: 1px solid #eaeaea; transform: rotate(45deg); }
              .user-dropdown-menu::after { content: ''; position: absolute; top: -20px; left: 0; right: 0; height: 20px; background: transparent; }
              .user-dropdown-item { display: block; padding: 10px 20px; color: #432227; text-decoration: none; font-size: 14px; font-weight: bold; transition: background 0.2s; cursor: pointer; }
              .user-dropdown-item:hover { background: #fcf8f0; color: #a48c5a; }
            `}</style>
            <Link to="/account" className="action-icon-btn account-btn" title="Account" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', padding: '10px 0' }}>
              {isAuthenticated && user ? (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#d4c098',
                  color: '#432227',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {(user.firstName && user.firstName[0]) || (user.email && user.email[0]) || 'U'}
                </div>
              ) : (
                <i className="fa-regular fa-user" style={{ color: '#d4c098', fontSize: '20px' }}></i>
              )}
            </Link>
            <div className="user-dropdown-menu">
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="user-dropdown-item">My Account</Link>
                  <Link to="/account/orders" className="user-dropdown-item">My Orders</Link>
                  <button onClick={() => { logout(); navigate('/account'); }} className="user-dropdown-item" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}>Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/account" className="user-dropdown-item">Sign In / Register</Link>
                </>
              )}
            </div>
          </div>

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
