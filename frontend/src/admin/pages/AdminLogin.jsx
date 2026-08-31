import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Failed to login. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-app" style={{ 
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#fcf8f0', // Premium warm fallback
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/images/6cb46412-3aba-426b-b370-0b00c61525fe.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="admin-card" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '50px 40px', 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 10px 40px rgba(67, 34, 39, 0.08)',
        border: '1px solid #eaeaea'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', letterSpacing: '4px', marginBottom: '8px', color: '#432227', fontFamily: 'var(--font-serif)' }}>RAJWADI</h1>
          <h2 style={{ fontSize: '13px', color: '#a48c5a', fontFamily: 'var(--admin-font-body)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin Portal</h2>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'var(--admin-danger)', 
            color: 'white', 
            padding: '12px', 
            borderRadius: 'var(--admin-radius-sm)',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label className="admin-label" style={{ color: '#432227', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              className="admin-input" 
              style={{ padding: '12px', border: '1px solid #d4c5b0', borderRadius: '4px', backgroundColor: '#fdfdfc' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="admin-label" style={{ color: '#432227', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              className="admin-input" 
              style={{ padding: '12px', border: '1px solid #d4c5b0', borderRadius: '4px', backgroundColor: '#fdfdfc' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '15px', backgroundColor: '#432227', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
            disabled={isSubmitting}
            onMouseOver={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#5a3036')}
            onMouseOut={e => !isSubmitting && (e.currentTarget.style.backgroundColor = '#432227')}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
