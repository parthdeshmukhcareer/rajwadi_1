import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function ShippingPolicy() {
  useDocumentTitle('Shipping Policy | Rajwadi');

  return (
    <section className="view-section active" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#3a1a20', marginBottom: '30px' }}>Shipping Policy</h1>
        
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.6', color: '#432227' }}>
          <p>Rajwadi is committed to delivering your ethnic wear safely and efficiently.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Shipping within India</h2>
          <p>We provide shipping services across India. Shipping fees, if applicable, are calculated at checkout.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Shipping Timelines</h2>
          <p>Shipping timelines depend on the product type/category:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li><strong>Unstitched Poshak:</strong> Shipping timeline is 10–15 days.</li>
            <li><strong>Stitched Poshak:</strong> Immediate delivery / ready for dispatch, subject to availability.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Delays and Tracking</h2>
          <p>Delivery delays may occur due to courier logistics, remote locations, or festival rush. We appreciate your patience during such times.</p>
          <p>Tracking details will be shared with you as soon as they are available after dispatch.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Customer Responsibility</h2>
          <p>Customers must provide the correct address and a valid phone number. Rajwadi is not responsible for any delay caused by the courier partner after the product has been dispatched.</p>
        </div>
      </div>
    </section>
  );
}

export default ShippingPolicy;
