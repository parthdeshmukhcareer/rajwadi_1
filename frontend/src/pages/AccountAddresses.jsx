import React from 'react';
import AddressManager from '../components/AddressManager';

function AccountAddresses() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '24px', margin: 0 }}>My Addresses</h2>
      </div>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Manage your shipping and billing addresses for a faster checkout experience.</p>
      
      <AddressManager />
    </div>
  );
}

export default AccountAddresses;
