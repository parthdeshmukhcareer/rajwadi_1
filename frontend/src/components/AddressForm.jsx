import React, { useState } from 'react';
import { addressService } from '../services/address.service';

function AddressForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      district: '',
      state: '',
      postalCode: '',
      country: 'India',
      addressType: 'HOME',
      isDefault: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      let savedAddress;
      if (initialData && initialData.id) {
        // We only send the fields that changed, or just send everything
        const res = await addressService.updateAddress(initialData.id, formData);
        savedAddress = res.data;
      } else {
        const res = await addressService.createAddress(formData);
        savedAddress = res.data;
      }
      if (onSuccess) {
        onSuccess(savedAddress);
      }
    } catch (err) {
      setError(err.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {error && <div style={{ color: 'red', fontSize: '13px' }}>{error}</div>}
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Full Name *</label>
          <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Phone Number *</label>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Address Line 1 *</label>
        <input type="text" name="addressLine1" required value={formData.addressLine1} onChange={handleInputChange} placeholder="Flat, House no., Building, Company, Apartment" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Address Line 2 (Optional)</label>
        <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Area, Street, Sector, Village" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
      </div>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Landmark (Optional)</label>
          <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>City *</label>
          <input type="text" name="city" required value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>State *</label>
          <input type="text" name="state" required value={formData.state} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Postal Code *</label>
          <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Country</label>
          <input type="text" name="country" value={formData.country} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }} readOnly />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Address Type</label>
          <select name="addressType" value={formData.addressType} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '5px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#555' }}>
          <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} style={{ accentColor: '#a48c5a' }} />
          Make this my default address
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button type="submit" disabled={isSubmitting} style={{ flex: 1, backgroundColor: '#432227', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting} style={{ flex: 1, backgroundColor: '#f0f0f0', color: '#555', border: '1px solid #ddd', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddressForm;
