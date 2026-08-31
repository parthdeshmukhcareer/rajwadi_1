import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/settings.service';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    supportEmail: '',
    supportPhone: '',
    defaultShippingFee: '',
    freeShippingThreshold: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.success && res.data) {
          setSettings({
            storeName: res.data.storeName || '',
            supportEmail: res.data.supportEmail || '',
            supportPhone: res.data.supportPhone || '',
            // Convert from paise to rupees for frontend display
            defaultShippingFee: res.data.defaultShippingFee !== undefined ? String(res.data.defaultShippingFee / 100) : '',
            freeShippingThreshold: res.data.freeShippingThreshold !== undefined ? String(res.data.freeShippingThreshold / 100) : '',
          });
        }
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    
    try {
      // Prepare payload, converting rupees back to paise
      const payload = {
        storeName: settings.storeName,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        defaultShippingFee: Math.round(Number(settings.defaultShippingFee) * 100),
        freeShippingThreshold: Math.round(Number(settings.freeShippingThreshold) * 100),
      };
      
      const res = await settingsService.updateSettings(payload);
      if (res.success) {
        setMessage('Settings saved successfully!');
      } else {
        setError('Failed to save settings.');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading settings...</div>;

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Store Settings</h1>
      </div>
      
      {message && (
        <div style={{ padding: '12px', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '4px', marginBottom: '20px' }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="admin-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px', color: 'var(--admin-primary)' }}>Store Details</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="admin-label">Store Name</label>
              <input 
                type="text" 
                className="admin-input" 
                name="storeName" 
                value={settings.storeName} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label className="admin-label">Support Email</label>
              <input 
                type="email" 
                className="admin-input" 
                name="supportEmail" 
                value={settings.supportEmail} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label className="admin-label">Support Phone</label>
              <input 
                type="text" 
                className="admin-input" 
                name="supportPhone" 
                value={settings.supportPhone} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px', color: 'var(--admin-primary)' }}>Shipping & Orders</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="admin-label">Default Shipping Fee (₹)</label>
              <input 
                type="number" 
                className="admin-input" 
                name="defaultShippingFee" 
                value={settings.defaultShippingFee} 
                onChange={handleChange} 
                min="0"
                step="0.01"
                required 
              />
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px', display: 'block' }}>Fee applies if order is below threshold.</span>
            </div>
            
            <div>
              <label className="admin-label">Free Shipping Threshold (₹)</label>
              <input 
                type="number" 
                className="admin-input" 
                name="freeShippingThreshold" 
                value={settings.freeShippingThreshold} 
                onChange={handleChange} 
                min="0"
                step="0.01"
                required 
              />
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px', display: 'block' }}>Orders above this amount get free shipping.</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            disabled={isSaving}
            style={{ minWidth: '150px' }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
