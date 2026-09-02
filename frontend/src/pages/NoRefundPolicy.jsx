import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function NoRefundPolicy() {
  useDocumentTitle('No Refund Policy | Rajwadi');

  return (
    <section className="view-section active" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#3a1a20', marginBottom: '30px' }}>No Refund Policy</h1>
        
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.6', color: '#432227' }}>
          <p>Rajwadi follows a strict <strong>No Refund Policy</strong>.</p>
          <p>Once an order is placed and payment is completed, a refund will not be provided under any circumstances. Customers must carefully check all product details, size, stitched/unstitched option, delivery timeline, price, and address before placing an order.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>No Refunds for:</h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Wrong size selected by the customer.</li>
            <li>Wrong address entered during checkout.</li>
            <li>Change of mind after purchase.</li>
            <li>Color expectation difference due to screen/device display.</li>
            <li>Order cancellation after the order has been processed.</li>
            <li>Custom or stitching-related choices.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Damaged or Wrong Products</h2>
          <p>If a customer receives a damaged or incorrect product, they can contact Customer Support for a review. Please note that a support review does not guarantee a refund or exchange. Management's business decision will be final.</p>
        </div>
      </div>
    </section>
  );
}

export default NoRefundPolicy;
