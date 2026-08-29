import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Account() {
  const [accountTab, setAccountTab] = useState('login');
  const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <section id="account-view" className="view-section active">
      <div className="account-page-container resp-padding" style={{ alignItems: 'flex-start', paddingTop: '120px', paddingBottom: '120px', minHeight: '100vh', position: 'relative' }}>
        
        {toastMessage && (
          <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-maroon-dark)', color: 'white', padding: '10px 20px', borderRadius: '4px', zIndex: 1100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            {toastMessage}
          </div>
        )}

        <div className="account-card-wrapper" style={{ marginTop: '0px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', overflow: 'hidden', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
          
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading session...</div>
          ) : !isAuthenticated ? (
            <>
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
                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label htmlFor="loginEmail" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Email Address *</label>
                      <input type="email" id="loginEmail" required placeholder="name@example.com" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
                    </div>
                    <div>
                      <label htmlFor="loginPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#432227', marginBottom: '8px' }}>Password *</label>
                      <input type="password" id="loginPassword" required placeholder="••••••••" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
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
                      <input type="password" id="signupPassword" required placeholder="Create Password" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#a48c5a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
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
            </>
          ) : (
            /* Logged In Profile Dashboard */
            <div style={{ padding: '40px 30px' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fcf8f0', color: '#a48c5a', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', border: '1px solid #eaeaea' }}>
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#432227', margin: '0 0 5px 0' }}>Namaste, {user?.firstName}!</h3>
                <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>{user?.email}</p>
              </div>

              <div className="resp-flex-col" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #eaeaea' }}>
                  <span style={{ display: 'block', fontSize: '24px', color: '#a48c5a', marginBottom: '5px' }}>♦</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Royal Member</span>
                </div>
                <Link to="/catalog" style={{ flex: 1, backgroundColor: '#fcf8f0', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #eaeaea', textDecoration: 'none', transition: 'transform 0.2s', display: 'block' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <span style={{ display: 'block', fontSize: '24px', color: '#a48c5a', marginBottom: '5px' }}><i className="fa-solid fa-bag-shopping"></i></span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#432227', textTransform: 'uppercase' }}>Shop Now</span>
                </Link>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '15px', color: '#432227', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-clock-rotate-left"></i> Your Royal Order History</h4>
                <div style={{ padding: '20px', backgroundColor: '#fcfcfc', border: '1px dashed #ddd', borderRadius: '4px', textAlign: 'center' }}>
                  <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>No orders placed yet. Start exploring the collection!</p>
                </div>
              </div>

              <button onClick={handleSignOut} style={{ width: '100%', background: 'none', border: '1px solid #ddd', color: '#555', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} onMouseOver={e => {e.currentTarget.style.borderColor = '#432227'; e.currentTarget.style.color = '#432227'}} onMouseOut={e => {e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#555'}}>
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
