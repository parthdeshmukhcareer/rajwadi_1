import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ cartCount, wishlistCount, toggleCart, toggleWishlistSidebar }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCompact = location.pathname !== '/' || isScrolled;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <style>{`
        .main-header {
          background-color: ${isCompact ? '#17100e' : 'transparent'} !important;
          background: ${isCompact ? '#17100e' : 'transparent'} !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: background-color 0.3s ease, height 0.3s ease;
          width: 100%;
          z-index: 1000;
          position: fixed;
          top: 0;
          left: 0;
          border-bottom: none !important;
        }
        .header-container {
          height: ${isCompact ? '60px' : '100px'} !important;
        }
        .main-header .logo-desktop {
          height: ${isCompact ? '50px' : '90px'} !important;
        }
        .main-header .logo-mobile {
          height: ${isCompact ? '50px' : '80px'} !important;
        }
      `}</style>
      <header className="main-header">
        <div className="header-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', transition: 'height 0.3s ease', padding: '0 0 0 10px', boxSizing: 'border-box' }}>
        
        {/* Left side: Mobile Menu Toggle & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
          <button className="action-icon-btn mobile-menu-btn" title="Menu" onClick={() => setIsMobileMenuOpen(true)} style={{ marginRight: '15px', color: 'var(--color-gold)', fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="fa-solid fa-bars"></i>
          </button>

          <Link to="/" className="logo-area" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/assets/images/logo%20without%20bg.png" alt="Rajwadi Logo Desktop" style={{ height: isCompact ? '50px' : '90px', transition: 'height 0.3s ease', width: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: '0' }} className="logo-desktop" />
            <img src="/assets/images/logo%20without%20bg.png" alt="Rajwadi Logo Mobile" style={{ height: isCompact ? '50px' : '80px', transition: 'height 0.3s ease', width: 'auto', border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: '0' }} className="logo-mobile" />
          </Link>
        </div>

        {/* Center side: Navigation Links */}
        <style>{`
          .nav-categories-header,
          .nav-categories-header.active {
            background-color: transparent !important;
            background-image: none !important;
          }
          .mobile-drawer-header {
            background-color: #1c120f !important;
            background-image: none !important;
            border-bottom: none !important;
          }
          ul.nav-menu {
            background-color: transparent !important;
            background-image: none !important;
          }
        `}</style>
        <nav className={`nav-categories-header ${isMobileMenuOpen ? 'active' : ''}`} style={{ backgroundColor: 'transparent', backgroundImage: 'none', top: 0, margin: 0, paddingTop: 0 }}>
          <div className="mobile-drawer-header" style={{ backgroundColor: '#1c120f', backgroundImage: 'none', margin: 0, borderBottom: 'none' }}>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none' }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, paddingRight: '40px'}}>
              <span style={{color: '#dfceab', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '400', letterSpacing: '0.05em'}}>Rajwadi</span>
            </div>
          </div>
          <ul className="nav-menu" style={{ display: 'flex', gap: '40px', listStyle: 'none', margin: 0, padding: 0, marginRight: '30px', backgroundColor: 'transparent', backgroundImage: 'none' }}>
            <li className="nav-item"><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>HOME</Link></li>
            <li className="nav-item"><Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>COLLECTION</Link></li>
            <li className="nav-item"><Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>ABOUT US</Link></li>
            <li className="nav-item"><Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>BLOG</Link></li>
            <li className="nav-item"><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="nav-link" style={{ color: '#d4c098', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>CUSTOMER SUPPORT</Link></li>
          </ul>
        </nav>
        
        {/* Mobile Overlay */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

        {/* Right side: Actions */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end', marginRight: '15px' }}>
          
          <Link to="/account" className="action-icon-btn account-btn" title="Account" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '8px', cursor: 'pointer', background: 'none', border: 'none', padding: '10px 0', marginRight: '5px' }}>
            {isAuthenticated && user ? (
              <>
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
                <span style={{ color: '#d4c098', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', marginTop: '2px' }}>
                  {user.firstName || 'Account'}
                </span>
              </>
            ) : (
              <>
                <i className="fa-regular fa-user" style={{ color: '#d4c098', fontSize: '20px' }}></i>
                <span style={{ color: '#d4c098', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', textTransform: 'uppercase', marginTop: '3px' }}>Login</span>
              </>
            )}
          </Link>

          <button className="action-icon-btn" onClick={toggleWishlistSidebar} title="Wishlist" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="fa-regular fa-heart" style={{ color: '#d4c098', fontSize: '20px' }}></i>
            <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#d4c098', color: '#2b161c', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{wishlistCount || 0}</span>
          </button>
          
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
            placeholder="Search for Rajputi Poshak, Accessories, Jewellery..."
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
    </>
  );
}

export default Header;
