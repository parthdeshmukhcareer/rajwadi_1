import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import axios from 'axios';

function CustomerSupport() {
  useDocumentTitle('Customer Support | Rajwadi');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    queryType: 'Order Query',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/support/queries', formData);
      if (response.data.success) {
        setSuccessMsg('Your query has been submitted successfully. We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          orderNumber: '',
          queryType: 'Order Query',
          message: ''
        });
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.error?.message || 'Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="view-section active" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#3a1a20', marginBottom: '10px', textAlign: 'center' }}>Customer Support</h1>
        <p style={{ textAlign: 'center', color: '#432227', marginBottom: '40px' }}>We are here to help you. Reach out to us via email, phone, or fill out the form below.</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
          <div style={{ flex: '1 1 300px', backgroundColor: '#fcf8f0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <i className="fa-solid fa-envelope" style={{ fontSize: '24px', color: '#a48c5a', marginBottom: '15px' }}></i>
            <h3 style={{ fontSize: '18px', color: '#3a1a20', marginBottom: '10px' }}>Email Support</h3>
            <p style={{ color: '#432227' }}>support@rajwadi.com</p>
          </div>
          <div style={{ flex: '1 1 300px', backgroundColor: '#fcf8f0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <i className="fa-solid fa-phone" style={{ fontSize: '24px', color: '#a48c5a', marginBottom: '15px' }}></i>
            <h3 style={{ fontSize: '18px', color: '#3a1a20', marginBottom: '10px' }}>Call Us</h3>
            <p style={{ color: '#432227' }}>+91 9766631092</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#3a1a20', marginBottom: '20px' }}>Send us a Message</h2>
          
          {successMsg && (
            <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#432227', fontSize: '14px' }}>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#432227', fontSize: '14px' }}>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px' }} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#432227', fontSize: '14px' }}>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#432227', fontSize: '14px' }}>Order Number (Optional)</label>
                <input type="text" name="orderNumber" value={formData.orderNumber} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#432227', fontSize: '14px' }}>Query Type *</label>
              <select name="queryType" value={formData.queryType} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px', backgroundColor: '#fff' }}>
                <option value="Order Query">Order Query</option>
                <option value="Shipping Query">Shipping Query</option>
                <option value="Product Query">Product Query</option>
                <option value="Cancellation Query">Cancellation Query</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#432227', fontSize: '14px' }}>Message *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px', resize: 'vertical' }}></textarea>
            </div>

            <button type="submit" disabled={loading} style={{ backgroundColor: '#432227', color: '#fff', padding: '14px 20px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Submitting...' : 'Submit Query'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CustomerSupport;
