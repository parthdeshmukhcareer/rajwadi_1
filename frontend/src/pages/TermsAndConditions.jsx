import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function TermsAndConditions() {
  useDocumentTitle('Terms & Conditions | Rajwadi');

  return (
    <section className="view-section active" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#3a1a20', marginBottom: '30px' }}>Terms & Conditions</h1>
        
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.6', color: '#432227' }}>
          <p>Welcome to Rajwadi. By using this website, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Use of Website</h2>
          <p>You must use this website for lawful purposes only and in a way that does not infringe the rights of others.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Product Information & Display</h2>
          <p>We strive to display our products as accurately as possible. However, product colors may slightly vary due to screen or device display settings.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Pricing & Orders</h2>
          <p>Prices are subject to change without notice. Order acceptance is subject to stock availability. We reserve the right to cancel any suspicious or fraudulent orders.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Payments</h2>
          <p>All payments must be completed successfully before an order is processed. In case of Cash on Delivery (COD), payment must be made in full at the time of delivery.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Cancellations</h2>
          <p>Orders can only be cancelled before they are processed. Once processed or shipped, cancellation is not possible.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>No Refund Policy</h2>
          <p>Rajwadi operates under a strict No Refund Policy. We do not offer refunds after successful payment. Please review our complete No Refund Policy for details.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Shipping Timelines</h2>
          <p>Shipping timelines vary by product category. Please refer to our Shipping Policy for estimated delivery times.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Customer Responsibility</h2>
          <p>You are responsible for providing correct shipping address and contact details. You must review product details carefully before purchase.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Account Responsibility</h2>
          <p>If you create an account, you are responsible for maintaining the confidentiality of your password and account details.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Limitation of Liability</h2>
          <p>Rajwadi shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of our website or products.</p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Customer Support</h2>
          <p>For any queries, please visit our Customer Support page.</p>
        </div>
      </div>
    </section>
  );
}

export default TermsAndConditions;
