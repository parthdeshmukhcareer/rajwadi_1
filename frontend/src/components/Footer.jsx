import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
<footer className="main-footer" style={{backgroundColor: '#17100e', position: 'relative', overflow: 'hidden', padding: '0', color: '#e5d1b3'}}>


    {/*  Floral Backgrounds Removed  */}

    {/*  Main Footer Area  */}
    <div style={{maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 20px', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: '2', alignItems: 'stretch'}}>
       
       {/*  Column 1 (Brand)  */}
       <div style={{flex: '1.2', textAlign: 'center', paddingRight: '60px', transform: 'translateX(-15px)'}}>
          {/*  Logo  */}
          <div style={{width: '110px', height: '110px', borderRadius: '50%', backgroundColor: 'transparent', border: '2px solid #b59c68', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'}}>
             <span style={{color: '#b59c68', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '500'}}>Rajwadi</span>
             <span style={{position: 'absolute', bottom: '20px', fontSize: '0.45rem', color: '#b59c68', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Since 1967</span>
          </div>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: '#f4eee6', fontWeight: '400', marginBottom: '12px', letterSpacing: '0.02em'}}>Rajwadi Collections</h3>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', opacity: '0.7'}}>
             <div style={{width: '20px', height: '1px', backgroundColor: '#b59c68'}}></div>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68" style={{margin: '0 8px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
             <div style={{width: '20px', height: '1px', backgroundColor: '#b59c68'}}></div>
          </div>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#e5d1b3', lineHeight: '1.8', marginBottom: '20px', opacity: '0.85'}}>Bringing authentic Rajputi Poshakhs, exquisite jewellery, and premium accessories right to your doorstep.</p>
          
          {/*  Socials  */}
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px'}}>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '15px', transition: 'border-color 0.3s'}} onMouseOver={() => {this.style.borderColor='#b59c68'}} onMouseOut={() => {this.style.borderColor='rgba(181, 156, 104, 0.4)'}}><i className="fa-brands fa-facebook-f"></i></a>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '15px', transition: 'border-color 0.3s'}} onMouseOver={() => {this.style.borderColor='#b59c68'}} onMouseOut={() => {this.style.borderColor='rgba(181, 156, 104, 0.4)'}}><i className="fa-brands fa-instagram"></i></a>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '15px', transition: 'border-color 0.3s'}} onMouseOver={() => {this.style.borderColor='#b59c68'}} onMouseOut={() => {this.style.borderColor='rgba(181, 156, 104, 0.4)'}}><i className="fa-brands fa-pinterest-p"></i></a>
             <a href="#" style={{width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(181, 156, 104, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b59c68', textDecoration: 'none', fontSize: '15px', transition: 'border-color 0.3s'}} onMouseOver={() => {this.style.borderColor='#b59c68'}} onMouseOut={() => {this.style.borderColor='rgba(181, 156, 104, 0.4)'}}><i className="fa-brands fa-youtube"></i></a>
          </div>
       </div>

       {/*  Vertical Divider  */}
       <div style={{width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(181, 156, 104, 0.3) 20%, rgba(181, 156, 104, 0.3) 80%, transparent)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: '8px', height: '8px', border: '1px solid #b59c68', transform: 'rotate(45deg)', backgroundColor: '#17100e', marginTop: '-30px'}}><div style={{width: '2px', height: '2px', backgroundColor: '#b59c68', margin: '2px'}}></div></div>
       </div>

       {/*  Column 2 (Categories)  */}
       <div style={{flex: '1', textAlign: 'center', padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#b59c68', fontWeight: '400', marginBottom: '12px', letterSpacing: '0.02em'}}>Categories</h3>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', opacity: '0.7'}}>
             <div style={{width: '15px', height: '1px', backgroundColor: '#b59c68'}}></div>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="#b59c68" style={{margin: '0 6px'}}><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
             <div style={{width: '15px', height: '1px', backgroundColor: '#b59c68'}}></div>
          </div>
          <ul style={{listStyle: 'none', padding: '0', margin: '0', textAlign: 'left', display: 'inline-block'}}>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}} onClick={() => {filterByCategory('Rajputi Poshakh')}}>Rajputi Poshakh</a>
             </li>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}} onClick={() => {filterByCategory('Accessories')}}>Accessories</a>
             </li>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}} onClick={() => {filterByCategory('Jewellery')}}>Jewellery</a>
             </li>
             <li style={{display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}} onClick={() => {showView('catalog')}}>New Arrivals</a>
             </li>
          </ul>
       </div>

       {/*  Vertical Divider  */}
       <div style={{width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(181, 156, 104, 0.3) 20%, rgba(181, 156, 104, 0.3) 80%, transparent)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: '8px', height: '8px', border: '1px solid #b59c68', transform: 'rotate(45deg)', backgroundColor: '#17100e', marginTop: '-30px'}}><div style={{width: '2px', height: '2px', backgroundColor: '#b59c68', margin: '2px'}}></div></div>
       </div>

       {/*  Column 3 (Customer Care)  */}
       <div style={{flex: '1', textAlign: 'center', padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#b59c68', fontWeight: '400', marginBottom: '12px', letterSpacing: '0.02em'}}>Customer Care</h3>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', opacity: '0.7'}}>
             <div style={{width: '15px', height: '1px', backgroundColor: '#b59c68'}}></div>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="#b59c68" style={{margin: '0 6px'}}><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
             <div style={{width: '15px', height: '1px', backgroundColor: '#b59c68'}}></div>
          </div>
          <ul style={{listStyle: 'none', padding: '0', margin: '0', textAlign: 'left', display: 'inline-block'}}>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}}>Contact Us</a>
             </li>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}}>Shipping Policy</a>
             </li>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}}>Custom Stitching Guide</a>
             </li>
             <li style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}}>Return & Exchanges</a>
             </li>
             <li style={{display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#b59c68"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
                <a href="#" style={{color: '#e5d1b3', textDecoration: 'none'}}>FAQs</a>
             </li>
          </ul>
       </div>

       {/*  Vertical Divider  */}
       <div style={{width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(181, 156, 104, 0.3) 20%, rgba(181, 156, 104, 0.3) 80%, transparent)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: '8px', height: '8px', border: '1px solid #b59c68', transform: 'rotate(45deg)', backgroundColor: '#17100e', marginTop: '-30px'}}><div style={{width: '2px', height: '2px', backgroundColor: '#b59c68', margin: '2px'}}></div></div>
       </div>

       {/*  Column 4 (Newsletter)  */}
       <div style={{flex: '1', textAlign: 'left', paddingLeft: '40px', display: 'flex', flexDirection: 'column'}}>
          <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#b59c68', fontWeight: '400', marginBottom: '12px', letterSpacing: '0.02em'}}>Newsletter</h3>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '20px', opacity: '0.7'}}>
             <div style={{width: '15px', height: '1px', backgroundColor: '#b59c68'}}></div>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="#b59c68" style={{margin: '0 6px'}}><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>
             <div style={{width: '15px', height: '1px', backgroundColor: '#b59c68'}}></div>
          </div>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#e5d1b3', lineHeight: '1.7', marginBottom: '15px', opacity: '0.85'}}>Subscribe to get early notifications of seasonal collections and royal sales.</p>
          <form style={{display: 'flex', border: '1px solid rgba(181, 156, 104, 0.3)', padding: '0', marginBottom: '20px'}}>
             <input type="email" placeholder="Your Email" style={{flex: '1', background: 'transparent', border: 'none', padding: '12px 15px', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#e5d1b3', outline: 'none'}} />
             <button type="submit" style={{backgroundColor: '#b59c68', color: '#17100e', border: 'none', padding: '0 35px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer'}}>JOIN</button>
          </form>
       </div>

    </div>

    {/*  Bottom Ornament & Copyright  */}
    <div style={{backgroundColor: '#110a08', padding: '15px 0 10px', textAlign: 'center', position: 'relative'}}>
       

       <p style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'rgba(229, 209, 179, 0.6)', margin: '0', marginTop: '15px'}}>&copy; 2026 Rajwadi Royal. All Rights Reserved. Crafted with Premium Vanilla CSS & JS.</p>
    </div>
  </footer>
  );
}

export default Footer;
