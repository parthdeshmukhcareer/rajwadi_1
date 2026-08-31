import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountOverview() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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

      <div style={{ backgroundColor: '#fcfcfc', border: '1px solid #eaeaea', borderRadius: '8px', padding: '25px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
          <h4 style={{ fontSize: '16px', color: '#432227', margin: 0 }}><i className="fa-solid fa-address-card" style={{ color: '#a48c5a', marginRight: '8px' }}></i> Profile Information</h4>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: '#a48c5a', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-solid fa-pen-to-square"></i> Edit
            </button>
          )}
        </div>

        {error && (
          <div style={{ padding: '10px 15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', border: '1px solid #f5c6cb' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ padding: '10px 15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', border: '1px solid #c3e6cb' }}>
            {success}
          </div>
        )}

        {!isEditing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>First Name</span>
              <strong style={{ fontSize: '14px', color: '#333' }}>{user?.firstName}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Last Name</span>
              <strong style={{ fontSize: '14px', color: '#333' }}>{user?.lastName}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Email</span>
              <strong style={{ fontSize: '14px', color: '#333' }}>{user?.email}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Phone</span>
              <strong style={{ fontSize: '14px', color: '#333' }}>{user?.phone || 'Not provided'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Gender</span>
              <strong style={{ fontSize: '14px', color: '#333' }}>{user?.gender || 'Not specified'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Date of Birth</span>
              <strong style={{ fontSize: '14px', color: '#333' }}>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Email (Read-only)</label>
              <input type="email" value={user?.email || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', color: '#888', boxSizing: 'border-box', cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} max={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="button" onClick={handleCancel} disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', color: '#555', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Cancel</button>
              <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#432227', color: '#fff', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}

export default AccountOverview;
