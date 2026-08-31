import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddressManager from '../components/AddressManager';
import { GoogleLogin } from '@react-oauth/google';

function Account() {
  const [accountTab, setAccountTab] = useState('login');
  const { user, isAuthenticated, login, loginWithGoogle, register, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      showToast('Logged in successfully with Google!');
      const from = location.state?.from?.pathname || '/account';
      if (from !== '/account') {
        navigate(from, { replace: true });
      }
    } catch (err) {
      showToast(err.message || 'Google Login failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
    try {
      await login(email, password);
      showToast('Logged in successfully!');
      const from = location.state?.from?.pathname || '/account';
      if (from !== '/account') {
        navigate(from, { replace: true });
      }
    } catch (err) {
      showToast(err.message || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const fullName = e.target.signupName.value.trim();
    const email = e.target.signupEmail.value;
    const password = e.target.signupPassword.value;

    const nameParts = fullName.split(' ').filter(p => p.length > 0);
    if (nameParts.length < 2) {
      showToast('Please enter your full name (first and last name).');
      return;
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    try {
      await register(firstName, lastName, email, password);
      showToast('Registered successfully!');
      const from = location.state?.from?.pathname || '/account';
      if (from !== '/account') {
        navigate(from, { replace: true });
      }
    } catch (err) {
      showToast(err.message || 'Registration failed');
    }
  };

  const handleSignOut = async () => {
    await logout();
    setAccountTab('login');
    showToast('Logged out successfully!');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (isLoading) {
    return <section className="view-section active"><div style={{ padding: '120px 20px', textAlign: 'center' }}>Loading session...</div></section>;
  }

  // GUEST VIEW (Login / Register)
  if (!isAuthenticated) {
    return (
      <section id="account-view" className="view-section active">
        <div className="account-page-container resp-padding" style={{ alignItems: 'flex-start', paddingTop: '120px', paddingBottom: '120px', minHeight: '100vh', position: 'relative' }}>
          
          {toastMessage && (
            <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-maroon-dark)', color: 'white', padding: '10px 20px', borderRadius: '4px', zIndex: 1100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              {toastMessage}
            </div>
          )}

          <div className="account-card-wrapper" style={{ marginTop: '0px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', overflow: 'hidden', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', borderBottom: '1px solid #eaeaea' }}>
              <button 
                onClick={() => setAccountTab('login')} 
                style={{ flex: 1, padding: '20px 0', background: 'none', border: 'none', borderBottom: accountTab === 'login' ? '3px solid #a48c5a' : '3px solid transparent', color: accountTab === 'login' ? '#432227' : '#888', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                Sign In
              </button>
              <button 
                onClick={() => setAccountTab('signup')} 
                style={{ flex: 1, padding: '20px 0', background: 'none', border: 'none', borderBottom: accountTab === 'signup' ? '3px solid #a48c5a' : '3px solid transparent', color: accountTab === 'signup' ? '#432227' : '#888', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {accountTab === 'login' && (
              <div style={{ padding: '40px 30px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#432227', textAlign: 'center', marginBottom: '10px' }}>Welcome Back</h3>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px' }}>Access your order history, wishlist, and custom measurements.</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => showToast('Google Login Failed')}
                    useOneTap
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                  <span style={{ padding: '0 10px' }}>or login with email</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label htmlFor="loginEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Email Address *</label>
                    <input type="email" id="loginEmail" required placeholder="name@example.com" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                  </div>
                  <div>
                    <label htmlFor="loginPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showLoginPassword ? "text" : "password"} id="loginPassword" required placeholder="••••••••" style={{ width: '100%', padding: '12px 40px 12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '5px' }}>
                        <i className={`fa-solid ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#555' }}>
                      <input type="checkbox" style={{ accentColor: '#a48c5a', width: '16px', height: '16px', cursor: 'pointer' }} /> Remember Me
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your email!'); }} style={{ color: '#a48c5a', textDecoration: 'none', fontWeight: 'bold' }}>Forgot Password?</a>
                  </div>
                  <button type="submit" style={{ marginTop: '10px', backgroundColor: '#432227', color: '#fff', border: 'none', padding: '15px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.3s' }} onMouseOver={e => e.target.style.backgroundColor = '#2a1518'} onMouseOut={e => e.target.style.backgroundColor = '#432227'}>
                    Sign In
                  </button>
                </form>
              </div>
            )}

            {/* Signup Form */}
            {accountTab === 'signup' && (
              <div style={{ padding: '40px 30px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#432227', textAlign: 'center', marginBottom: '10px' }}>Create Account</h3>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px' }}>Join for exclusive previews, stitching charts, and express checkout.</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => showToast('Google Signup Failed')}
                    text="signup_with"
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                  <span style={{ padding: '0 10px' }}>or register with email</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }}></div>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label htmlFor="signupName" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Full Name *</label>
                    <input type="text" id="signupName" required placeholder="Your Name" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                  </div>
                  <div>
                    <label htmlFor="signupEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Email Address *</label>
                    <input type="email" id="signupEmail" required placeholder="name@example.com" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                  </div>
                  <div>
                    <label htmlFor="signupPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showSignupPassword ? "text" : "password"} id="signupPassword" required placeholder="Create Password" style={{ width: '100%', padding: '12px 40px 12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                      <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '5px' }}>
                        <i className={`fa-solid ${showSignupPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  <label style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#555', cursor: 'pointer', alignItems: 'center' }}>
                    <input type="checkbox" required style={{ accentColor: '#a48c5a', width: '16px', height: '16px', cursor: 'pointer' }} /> I agree to the terms and privacy policies.
                  </label>
                  <button type="submit" style={{ marginTop: '10px', backgroundColor: '#432227', color: '#fff', border: 'none', padding: '15px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.3s' }} onMouseOver={e => e.target.style.backgroundColor = '#2a1518'} onMouseOut={e => e.target.style.backgroundColor = '#432227'}>
                    Register Account
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // DASHBOARD LAYOUT (Authenticated)
  return (
    <section id="account-dashboard-view" className="view-section active">
      <style>
        {`
          .dashboard-sidebar-inner {
            display: flex;
            flex-direction: column;
            background-color: transparent;
            padding: 0;
          }
          .dashboard-sidebar-link, .dashboard-sidebar-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            font-weight: bold;
            text-decoration: none;
            color: #555;
            border-radius: 8px;
            transition: all 0.2s ease;
            margin-bottom: 5px;
            font-size: 15px;
            background-color: transparent;
            border: none;
            cursor: pointer;
            width: 100%;
            text-align: left;
            font-family: inherit;
          }
          .dashboard-sidebar-link:hover, .dashboard-sidebar-btn:hover {
            background-color: #fff;
            color: #a48c5a;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          }
          .dashboard-sidebar-link.active {
            background-color: #fff;
            color: #a48c5a;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .dashboard-sidebar-btn {
            color: #e74c3c;
          }
          .dashboard-sidebar-btn:hover {
            color: #c0392b;
          }
          @media (max-width: 768px) {
            .dashboard-sidebar-inner {
              flex-direction: row;
              overflow-x: auto;
              white-space: nowrap;
              padding: 5px;
              gap: 10px;
              margin-bottom: 20px;
            }
            .dashboard-sidebar-link, .dashboard-sidebar-btn {
              margin-bottom: 0;
              padding: 12px 18px;
              width: auto;
              border-radius: 30px;
              background-color: #fff;
            }
          }
        `}
      </style>
      <div style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: '#fcf8f0', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {toastMessage && (
            <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-maroon-dark)', color: 'white', padding: '10px 20px', borderRadius: '4px', zIndex: 1100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              {toastMessage}
            </div>
          )}

          {/* Sidebar */}
          <div style={{ flex: '1 1 250px', maxWidth: '100%', position: 'sticky', top: '100px' }} className="dashboard-sidebar">
             <div className="dashboard-sidebar-inner">
                <Link to="/account" className={`dashboard-sidebar-link ${location.pathname === '/account' ? 'active' : ''}`}>
                  <i className="fa-regular fa-user" style={{ width: '20px', textAlign: 'center' }}></i> Overview
                </Link>
                <Link to="/account/orders" className={`dashboard-sidebar-link ${location.pathname.includes('/account/orders') ? 'active' : ''}`}>
                  <i className="fa-solid fa-box" style={{ width: '20px', textAlign: 'center' }}></i> My Orders
                </Link>
                <Link to="/account/addresses" className={`dashboard-sidebar-link ${location.pathname.includes('/account/addresses') ? 'active' : ''}`}>
                  <i className="fa-solid fa-location-dot" style={{ width: '20px', textAlign: 'center' }}></i> Addresses
                </Link>
                <button onClick={handleSignOut} className="dashboard-sidebar-btn">
                  <i className="fa-solid fa-right-from-bracket" style={{ width: '20px', textAlign: 'center' }}></i> Sign Out
                </button>
             </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: '3 1 600px', minWidth: 0 }}>
             <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
               <Outlet />
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default Account;
