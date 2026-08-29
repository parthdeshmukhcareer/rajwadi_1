import React, { useState, useEffect } from 'react';
import { addressService } from '../services/address.service';
import AddressForm from './AddressForm';

function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await addressService.getAddresses();
      setAddresses(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await addressService.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleMakeDefault = async (id) => {
    try {
      await addressService.updateAddress(id, { isDefault: true });
      fetchAddresses();
    } catch (err) {
      alert(err.message || 'Failed to set default address');
    }
  };

  const handleSuccess = () => {
    setIsAdding(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  if (isLoading) return <div>Loading addresses...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '18px', color: '#432227', margin: 0 }}><i className="fa-solid fa-map-location-dot"></i> Saved Addresses</h4>
        {!(isAdding || editingAddress) && (
          <button onClick={() => setIsAdding(true)} style={{ backgroundColor: '#a48c5a', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Add New
          </button>
        )}
      </div>

      {(isAdding || editingAddress) ? (
        <div style={{ backgroundColor: '#fcfcfc', border: '1px solid #eaeaea', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <h5 style={{ marginTop: 0, color: '#432227' }}>{isAdding ? 'Add New Address' : 'Edit Address'}</h5>
          <AddressForm 
            initialData={editingAddress} 
            onSuccess={handleSuccess} 
            onCancel={() => { setIsAdding(false); setEditingAddress(null); }} 
          />
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div style={{ padding: '20px', backgroundColor: '#fcfcfc', border: '1px dashed #ddd', borderRadius: '4px', textAlign: 'center', color: '#888' }}>
              No addresses saved yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {addresses.map((address) => (
                <div key={address.id} style={{ border: address.isDefault ? '2px solid #a48c5a' : '1px solid #eaeaea', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', position: 'relative' }}>
                  {address.isDefault && (
                    <span style={{ position: 'absolute', top: '-10px', right: '15px', backgroundColor: '#a48c5a', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>DEFAULT</span>
                  )}
                  <div style={{ fontWeight: 'bold', color: '#432227', marginBottom: '5px' }}>{address.fullName}</div>
                  <div style={{ color: '#555', fontSize: '13px', lineHeight: '1.5' }}>
                    {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                  </div>
                  <div style={{ color: '#555', fontSize: '13px', marginTop: '5px' }}><i className="fa-solid fa-phone"></i> {address.phone}</div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eaeaea' }}>
                    <button onClick={() => setEditingAddress(address)} style={{ flex: 1, background: 'none', border: '1px solid #ddd', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#555' }}>Edit</button>
                    <button onClick={() => handleDelete(address.id)} style={{ flex: 1, background: 'none', border: '1px solid #f5c2c7', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#d9534f' }}>Delete</button>
                    {!address.isDefault && (
                      <button onClick={() => handleMakeDefault(address.id)} style={{ flex: 1, background: 'none', border: '1px solid #a48c5a', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: '#a48c5a' }}>Set Default</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AddressManager;
