import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Account() {
  const [accountTab, setAccountTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAccountTab('login');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <section id="account-view" className="view-section active">
      <div className="account-page-container" style={{ alignItems: 'flex-start', paddingTop: '120px', paddingBottom: '120px', minHeight: '100vh', position: 'relative' }}>
        
        {toastMessage && (
          <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-maroon-dark)', color: 'white', padding: '10px 20px', borderRadius: '4px', zIndex: 1100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            {toastMessage}
          </div>
        )}

        <div className="account-card-wrapper" style={{ marginTop: '0px' }}>
          
          {!isLoggedIn ? (
            <>
              <div className="account-modal-tabs">
                <button className={`account-tab ${accountTab === 'login' ? 'active' : ''}`} onClick={() => setAccountTab('login')}>Sign In</button>
                <button className={`account-tab ${accountTab === 'signup' ? 'active' : ''}`} onClick={() => setAccountTab('signup')}>Register</button>
              </div>

              {/* Login Form */}
              {accountTab === 'login' && (
                <div className="account-form-panel active">
                  <h3 className="account-panel-title">Welcome Back</h3>
                  <p className="account-panel-subtitle">Access your order history, wishlist, and custom measurements.</p>
                  <form onSubmit={handleLogin}>
                    <div className="form-group">
                      <label htmlFor="loginEmail">Email Address *</label>
                      <input type="email" id="loginEmail" required placeholder="name@example.com" className="account-input" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="loginPassword">Password *</label>
                      <input type="password" id="loginPassword" required placeholder="••••••••" className="account-input" />
                    </div>
                    <div className="form-options">
                      <label className="remember-me">
                        <input type="checkbox" style={{ accentColor: 'var(--color-gold-dark)' }} /> Remember Me
                      </label>
                      <a href="#" className="forgot-pass-link" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your email!'); }}>Forgot Password?</a>
                    </div>
                    <button type="submit" className="btn-account-submit">Sign In to Gallery</button>
                  </form>
                </div>
              )}

              {/* Signup Form */}
              {accountTab === 'signup' && (
                <div className="account-form-panel active">
                  <h3 className="account-panel-title">Create Royal Account</h3>
                  <p className="account-panel-subtitle">Join for exclusive previews, stitching charts, and express checkout.</p>
                  <form onSubmit={handleSignup}>
                    <div className="form-group">
                      <label htmlFor="signupName">Full Name *</label>
                      <input type="text" id="signupName" required placeholder="Your Name" className="account-input" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="signupEmail">Email Address *</label>
                      <input type="email" id="signupEmail" required placeholder="name@example.com" className="account-input" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="signupPassword">Password *</label>
                      <input type="password" id="signupPassword" required placeholder="Create Password" className="account-input" />
                    </div>
                    <label className="terms-label" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--color-gray-dark)', margin: '15px 0', cursor: 'pointer', alignItems: 'center' }}>
                      <input type="checkbox" required style={{ accentColor: 'var(--color-gold-dark)' }} /> I agree to the terms and privacy policies.
                    </label>
                    <button type="submit" className="btn-account-submit">Register Account</button>
                  </form>
                </div>
              )}
            </>
          ) : (
            /* Logged In Profile Dashboard */
            <div className="profile-container" style={{ display: 'block' }}>
              <div className="profile-header">
                <div className="profile-avatar"><i className="fa-solid fa-user-tie"></i></div>
                <h3 className="profile-title">Namaste, Guest!</h3>
                <p className="profile-subtitle">email@example.com</p>
              </div>

              <div className="profile-stats">
                <div className="stat-card">
                  <span className="stat-num">♦</span>
                  <span className="stat-label">Royal Member</span>
                </div>
                <Link to="/catalog" className="stat-card" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <span className="stat-num"><i className="fa-solid fa-bag-shopping"></i></span>
                  <span className="stat-label">Shop Now</span>
                </Link>
              </div>

              <div className="profile-orders-section">
                <h4 className="profile-section-title"><i className="fa-solid fa-clock-rotate-left"></i> Your Royal Order History</h4>
                <div className="profile-orders-list">
                  <p className="no-orders-message">No orders placed yet. Start exploring the collection!</p>
                </div>
              </div>

              <button onClick={handleSignOut} className="btn-signout-submit">
                <i className="fa-solid fa-right-from-bracket"></i> Sign Out from Gallery
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Account;
