import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
<footer className="main-footer" style={{backgroundColor: '#17100e', position: 'relative', overflow: 'hidden', padding: '0', color: '#e5d1b3'}}>
    {/*  Main Footer Area  */}
    <div style={{maxWidth: '1400px', margin: '0 auto', padding: '60px 40px 40px', display: 'flex', flexWrap: 'wrap', gap: '50px', justifyContent: 'space-between', position: 'relative', zIndex: '2', alignItems: 'flex-start'}}>
       
       {/*  Column 1 (Brand)  */}
       <div style={{flex: '1.5 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          {/*  Logo  */}
          <div style={{width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'transparent', border: '2px solid #b59c68', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'}}>
             <span style={{color: '#b59c68', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: '500'}}>Rajwadi</span>
             <span style={{position: 'absolute', bottom: '15px', fontSize: '0.4rem', color: '#b59c68', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Since 1967</span>
          </div>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#f4eee6', fontWeight: '400', marginBottom: '15px', letterSpacing: '0.02em'}}>Rajwadi Collections</h3>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#e5d1b3', lineHeight: '1.6', marginBottom: '25px', opacity: '0.85', maxWidth: '350px'}}>Bringing authentic Rajputi Poshaks, exquisite jewellery, and premium accessories right to your doorstep.</p>
          
          {/*  Socials  */}
          <div style={{display: 'flex', gap: '12px'}}>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s'}} onMouseOver={(e) => {e.currentTarget.style.borderColor='#b59c68'; e.currentTarget.style.backgroundColor='rgba(181, 156, 104, 0.1)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor='rgba(181, 156, 104, 0.4)'; e.currentTarget.style.backgroundColor='transparent'}}><i className="fa-brands fa-facebook-f"></i></a>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s'}} onMouseOver={(e) => {e.currentTarget.style.borderColor='#b59c68'; e.currentTarget.style.backgroundColor='rgba(181, 156, 104, 0.1)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor='rgba(181, 156, 104, 0.4)'; e.currentTarget.style.backgroundColor='transparent'}}><i className="fa-brands fa-instagram"></i></a>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s'}} onMouseOver={(e) => {e.currentTarget.style.borderColor='#b59c68'; e.currentTarget.style.backgroundColor='rgba(181, 156, 104, 0.1)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor='rgba(181, 156, 104, 0.4)'; e.currentTarget.style.backgroundColor='transparent'}}><i className="fa-brands fa-pinterest-p"></i></a>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s'}} onMouseOver={(e) => {e.currentTarget.style.borderColor='#b59c68'; e.currentTarget.style.backgroundColor='rgba(181, 156, 104, 0.1)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor='rgba(181, 156, 104, 0.4)'; e.currentTarget.style.backgroundColor='transparent'}}><i className="fa-brands fa-youtube"></i></a>
          </div>
       </div>

       {/*  Column 2 (Quick Links & Categories)  */}
       <div style={{flex: '1 1 200px'}}>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#b59c68', fontWeight: '400', marginBottom: '25px', letterSpacing: '0.02em'}}>Categories</h3>
          <ul style={{listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '15px'}}>
             <li><Link to="/catalog?category=Rajputi Poshak" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Rajputi Poshak</Link></li>
             <li><Link to="/catalog?category=Accessories" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Accessories</Link></li>
             <li><Link to="/catalog?category=Jewellery" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Jewellery</Link></li>
             <li><Link to="/catalog" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>New Arrivals</Link></li>
             <li><Link to="/about" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>About Us</Link></li>
             <li><Link to="/blog" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Blog</Link></li>
          </ul>
       </div>

       {/*  Column 3 (Customer Care & Policies)  */}
       <div style={{flex: '1 1 200px'}}>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#b59c68', fontWeight: '400', marginBottom: '25px', letterSpacing: '0.02em'}}>Customer Care</h3>
          <ul style={{listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '15px'}}>
             <li><Link to="/customer-support" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Contact Us</Link></li>
             <li><Link to="/shipping-policy" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Shipping Policy</Link></li>
             <li><Link to="/terms-and-conditions" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Terms & Conditions</Link></li>
             <li><Link to="/no-refund-policy" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Refund Policy</Link></li>
             <li><Link to="#" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>Custom Stitching</Link></li>
             <li><Link to="#" style={{color: '#e5d1b3', textDecoration: 'none', fontSize: '0.9rem', opacity: '0.85', transition: 'opacity 0.2s'}} onMouseOver={(e) => e.target.style.opacity = '1'} onMouseOut={(e) => e.target.style.opacity = '0.85'}>FAQs</Link></li>
          </ul>
       </div>

       {/*  Column 4 (Newsletter)  */}
       <div style={{flex: '1.5 1 280px', display: 'flex', flexDirection: 'column'}}>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#b59c68', fontWeight: '400', marginBottom: '25px', letterSpacing: '0.02em'}}>Newsletter</h3>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#e5d1b3', lineHeight: '1.6', marginBottom: '20px', opacity: '0.85'}}>Subscribe to get early notifications of seasonal collections and royal sales.</p>
          <form style={{display: 'flex', border: '1px solid rgba(181, 156, 104, 0.4)', padding: '0', borderRadius: '4px', overflow: 'hidden'}}>
             <input type="email" placeholder="Your Email" style={{flex: '1', background: 'rgba(255,255,255,0.03)', border: 'none', padding: '14px 15px', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#e5d1b3', outline: 'none'}} />
             <button type="submit" style={{backgroundColor: '#b59c68', color: '#17100e', border: 'none', padding: '0 25px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.3s'}} onMouseOver={(e)=>e.currentTarget.style.backgroundColor='#d1b782'} onMouseOut={(e)=>e.currentTarget.style.backgroundColor='#b59c68'}>JOIN</button>
          </form>
       </div>

    </div>

    {/*  Bottom Copyright  */}
    <div style={{backgroundColor: '#110a08', padding: '18px 0', textAlign: 'center', borderTop: '1px solid rgba(181, 156, 104, 0.15)'}}>
       <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'rgba(229, 209, 179, 0.5)', margin: '0'}}>Developed and managed by Bizleap.in</p>
    </div>
  </footer>
  );
}

export default Footer;
