import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    atelier: 'Jaipur Flagship',
    date: '',
    requirements: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', atelier: 'Jaipur Flagship', date: '', requirements: '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('contact-', '')]: value }));
  };

  return (
    <section id="contact-view" className="view-section active" style={{ backgroundColor: '#FDFBF7' }}>
      
      {/* Cinematic Hero */}
      <header style={{ position: 'relative', width: '100%', height: '50vh', minHeight: '400px', backgroundImage: "url('/assets/images/contact_hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(23,16,14,0.8) 100%)' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: '15px', textTransform: 'uppercase' }}>Get in Touch</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', lineHeight: 1.1, marginBottom: 0, fontWeight: 300, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Bespoke Consultation
          </h1>
        </div>
      </header>

      {/* Luxury Form & Atelier Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 4%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
        
        {/* Form Side */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#3a1a20', marginBottom: '20px', fontWeight: 400, lineHeight: 1.2 }}>Request a Private Appointment</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: '#666', marginBottom: '40px' }}>
            Our master tailors and style consultants are available for private appointments at our flagships or your personal residence. Please provide your details, and our concierge will contact you within 24 hours to arrange your visit.
          </p>

          {submitted && (
            <div style={{ padding: '15px', backgroundColor: 'var(--color-gold-light)', color: '#3a1a20', marginBottom: '20px', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-gold)' }}>
              Thank you for your interest. Our concierge will contact you shortly to confirm your appointment.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ position: 'relative' }}>
              <input type="text" id="contact-name" value={formData.name} onChange={handleChange} placeholder="Your Excellency's Name *" required style={{ width: '100%', padding: '15px 0', border: 'none', borderBottom: '1px solid rgba(164,140,90,0.4)', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-sans)', background: 'transparent', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-maroon-dark)'} onBlur={(e) => e.target.style.borderBottomColor = 'rgba(164,140,90,0.4)'} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <input type="email" id="contact-email" value={formData.email} onChange={handleChange} placeholder="Email Address *" required style={{ width: '100%', padding: '15px 0', border: 'none', borderBottom: '1px solid rgba(164,140,90,0.4)', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-sans)', background: 'transparent', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-maroon-dark)'} onBlur={(e) => e.target.style.borderBottomColor = 'rgba(164,140,90,0.4)'} />
            </div>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-gold-dark)', marginBottom: '5px', textTransform: 'uppercase' }}>Preferred Atelier</label>
                <select id="contact-atelier" value={formData.atelier} onChange={handleChange} style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid rgba(164,140,90,0.4)', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-sans)', background: 'transparent', color: '#3a1a20', cursor: 'pointer' }}>
                  <option>Jaipur Flagship</option>
                  <option>London Atelier</option>
                  <option>New York Suite</option>
                  <option>Virtual Consultation</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-gold-dark)', marginBottom: '5px', textTransform: 'uppercase' }}>Preferred Date</label>
                <input type="date" id="contact-date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '1px solid rgba(164,140,90,0.4)', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-sans)', background: 'transparent', color: '#3a1a20' }} />
              </div>
            </div>

            <div style={{ position: 'relative', marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-gold-dark)', marginBottom: '10px', textTransform: 'uppercase' }}>Special Requirements</label>
              <textarea id="contact-requirements" value={formData.requirements} onChange={handleChange} placeholder="Tell us about the occasion (e.g., Wedding ensemble, heritage jewelry curation)..." rows="4" style={{ width: '100%', padding: '15px', border: '1px solid rgba(164,140,90,0.2)', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-sans)', background: '#fff', resize: 'vertical', color: '#3a1a20' }} onFocus={(e) => e.target.style.borderColor = 'var(--color-maroon-dark)'} onBlur={(e) => e.target.style.borderColor = 'rgba(164,140,90,0.2)'}></textarea>
            </div>
            
            <button type="submit" style={{ marginTop: '20px', width: '100%', background: 'var(--color-maroon-dark)', color: 'white', border: '1px solid var(--color-maroon-dark)', padding: '20px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.target.style.background = '#fff'; e.target.style.color = 'var(--color-maroon-dark)'; }} onMouseOut={(e) => { e.target.style.background = 'var(--color-maroon-dark)'; e.target.style.color = '#fff'; }}>Initiate Consultation</button>
          </form>
        </div>

        {/* Ateliers Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingLeft: '20px', borderLeft: '1px solid rgba(164,140,90,0.2)' }}>
          
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#3a1a20', marginBottom: '15px', fontWeight: 400 }}>Global Flagships</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: '#666', marginBottom: '30px' }}>
              Experience Rajwadi's unparalleled craftsmanship at our exclusive locations worldwide. Each atelier offers a uniquely curated selection of our finest heritage pieces.
            </p>
          </div>

          {/* Location 1 */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(164,140,90,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-gold-dark)', fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#3a1a20', marginBottom: '5px' }}>Jaipur, India</h4>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.6, color: '#666', marginBottom: '10px' }}>Rajwadi Palace, Narayan Singh Circle<br/>Jaipur, Rajasthan 302004</p>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--color-gold-dark)', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-gold-dark)', paddingBottom: '2px' }}>View on Map</a>
            </div>
          </div>

          {/* Location 2 */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(164,140,90,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-gold-dark)', fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#3a1a20', marginBottom: '5px' }}>London, UK</h4>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.6, color: '#666', marginBottom: '10px' }}>15-16 Brook Street, Mayfair<br/>London W1K 4DZ</p>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--color-gold-dark)', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-gold-dark)', paddingBottom: '2px' }}>View on Map</a>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', padding: '30px', background: '#fff', border: '1px solid rgba(164,140,90,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-gold-dark)', marginBottom: '10px', textTransform: 'uppercase' }}>Direct Inquiries</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#3a1a20' }}>
              <i className="fa-solid fa-phone" style={{ color: 'var(--color-gold-dark)' }}></i> +91 (141) 256-RAJWADI
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#3a1a20' }}>
              <i className="fa-regular fa-envelope" style={{ color: 'var(--color-gold-dark)' }}></i> concierge@rajwadi.com
            </div>
          </div>
          
        </div>
      </div>

    </section>
  );
}

export default Contact;
