import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <section id="about-view" className="view-section active">

      <div className="about-hero" style={{backgroundImage: 'url("assets/images/rajawddddddi.png")', backgroundSize: 'cover', backgroundPosition: 'center top 10%', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: '80px'}}>
        {/*  Left Content Box  */}
        <div className="about-hero-content" style={{maxWidth: '800px', padding: '40px 0', marginLeft: '8%'}}>
          
          <div className="about-kicker" style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.2em', color: '#432227', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '15px'}}>
            ABOUT US
            <span style={{display: 'flex', alignItems: 'center'}}>
              <span style={{display: 'inline-block', width: '40px', height: '1px', backgroundColor: '#a48c5a'}}></span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 4px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
            </span>
          </div>

          <h2 className="about-title" style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', color: '#3a1a20', lineHeight: '1.1', fontWeight: '400', marginBottom: '20px', letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>
            Timeless Heritage.<br />Thoughtfully Yours.
          </h2>

          <div className="about-ornament" style={{display: 'flex', alignItems: 'center', marginBottom: '30px', opacity: '0.8'}}>
             <div style={{width: '30px', height: '1px', backgroundColor: '#a48c5a'}}></div>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 8px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
             <div style={{width: '30px', height: '1px', backgroundColor: '#a48c5a'}}></div>
          </div>

          <p className="about-desc" style={{fontFamily: 'var(--font-sans)', color: '#432227', fontSize: '1rem', lineHeight: '1.6', marginBottom: '40px', maxWidth: '550px'}}>
            For over four decades, Rajwadi Collections has been preserving the essence of Rajasthani craftsmanship and redefining it for the modern world.<br /><br />
            Every creation is a tribute to our roots, crafted with love, passed on with pride.
          </p>

          <a href="#" className="about-explore-link" style={{fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#432227', textTransform: 'uppercase', fontWeight: '700', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', textDecoration: 'none'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
              KNOW MORE ABOUT US <i className="fa-solid fa-arrow-right-long"></i>
            </div>
            <div style={{display: 'flex', alignItems: 'center', width: '100%', opacity: '0.5'}}>
              <svg width="4" height="4" viewBox="0 0 24 24" fill="#432227"><circle cx="12" cy="12" r="12"/></svg>
              <div style={{flexGrow: '1', height: '1px', backgroundColor: '#432227', margin: '0 2px'}}></div>
              <svg width="4" height="4" viewBox="0 0 24 24" fill="#432227"><circle cx="12" cy="12" r="12"/></svg>
            </div>
          </a>

        </div>
      </div>

      {/*  Restored Original About Content (Enhanced Luxury)  */}
      <div className="about-container section-padding" style={{backgroundColor: '#FDFBF7', position: 'relative', overflow: 'hidden', padding: '60px 20px', borderTop: '1px solid rgba(164, 140, 90, 0.15)', borderBottom: '1px solid rgba(164, 140, 90, 0.15)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        
        <div style={{width: '100%', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', maxWidth: '1300px', margin: '0 auto', gap: '50px', position: 'relative', zIndex: '2'}}>
          
          {/*  Text Column (Moved to Left)  */}
          <div className="about-text-col" style={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 20px 20px 0'}}>
            
            <div className="elegant-kicker" style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.2em', color: '#a48c5a', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '15px'}}>
              ABOUT RAJWADI
              <span style={{display: 'inline-block', width: '50px', height: '1px', backgroundColor: '#a48c5a'}}></span>
            </div>

            <h2 style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', color: '#3a1a20', lineHeight: '1.15', fontWeight: '400', marginBottom: '30px', letterSpacing: '-0.01em'}}>
              Elegance Woven with Heritage
            </h2>

            <p style={{fontFamily: 'var(--font-sans)', fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '25px'}}>
              At Rajwadi, we believe that every thread tells a story. For over two decades, we have been curators of India's most exquisite ethnic wear, blending the richness of our royal heritage with contemporary aesthetics. Our collections are a tribute to the timeless beauty of traditional Indian craftsmanship.
            </p>
            <p style={{fontFamily: 'var(--font-sans)', fontSize: '1.05rem', lineHeight: '1.8', color: '#555', marginBottom: '45px'}}>
              Whether you are a bride seeking the perfect Rajputi Poshak, or a modern woman looking for stunning accessories and jewellery, our meticulously crafted ensembles are designed to make you feel nothing less than royalty. We source directly from master weavers across the subcontinent to bring you authenticity, unmatched quality, and luxury.
            </p>

            <a href="#" onClick={() => {showView('catalog'); return false;}} style={{alignSelf: 'flex-start', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#a48c5a', textTransform: 'uppercase', fontWeight: '600', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', textDecoration: 'none', paddingBottom: '6px', borderBottom: '1px solid rgba(164, 140, 90, 0.4)', transition: 'all 0.3s ease'}} onMouseOver={() => {this.style.gap='20px'; this.style.borderColor='#a48c5a'}} onMouseOut={() => {this.style.gap='12px'; this.style.borderColor='rgba(164, 140, 90, 0.4)'}}>
              EXPLORE THE COLLECTION <i className="fa-solid fa-arrow-right-long"></i>
            </a>
            
          </div>

          {/*  Vertical Divider  */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0'}}>
            <div style={{width: '1px', flexGrow: '1', background: 'linear-gradient(to bottom, rgba(164,140,90,0), rgba(164,140,90,0.3) 20%, rgba(164,140,90,0.3) 80%, rgba(164,140,90,0))'}}></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a48c5a" stroke-width="1.5" style={{margin: '20px 0'}}>
              <path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>
            </svg>
            <div style={{width: '1px', flexGrow: '1', background: 'linear-gradient(to bottom, rgba(164,140,90,0.3) 0%, rgba(164,140,90,0.3) 80%, rgba(164,140,90,0))'}}></div>
          </div>

          {/*  Image Column (Moved to Right)  */}
          <div className="about-image-col" style={{flex: '1', position: 'relative', padding: '15px'}}>
            {/*  Double luxury frame  */}
            <div style={{position: 'absolute', inset: '0', border: '1px solid #a48c5a', borderRadius: '4px'}}></div>
            <div style={{position: 'absolute', inset: '6px', border: '1px solid rgba(164, 140, 90, 0.3)', borderRadius: '2px'}}></div>
            <img src="assets/images/image.png" alt="Rajwadi Traditional Wear" className="about-hero-img" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative', zIndex: '1'}} />
          </div>
        </div>
      </div>



      {/*  Heritage Section  */}
      <div className="heritage-section" style={{backgroundImage: 'linear-gradient(to right, rgba(248, 244, 236, 0) 0%, rgba(248, 244, 236, 0) 30%, rgba(248, 244, 236, 0.85) 55%, rgba(248, 244, 236, 0.98) 75%, #f8f4ec 100%), url("assets/images/rj.png")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'relative'}}>
        <div className="heritage-content" style={{maxWidth: '750px', padding: '40px 60px 40px 40px', marginRight: '5%', textAlign: 'center'}}>
          
          <div className="heritage-kicker" style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.2em', color: '#a48c5a', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '700'}}>
             OUR HERITAGE
          </div>
          
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px', opacity: '0.8'}}>
             <div style={{width: '50px', height: '1px', backgroundColor: '#a48c5a'}}></div>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 8px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
             <div style={{width: '50px', height: '1px', backgroundColor: '#a48c5a'}}></div>
          </div>

          <h2 className="heritage-title" style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', color: '#3a1a20', lineHeight: '1.1', fontWeight: '400', marginBottom: '25px', letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>
            Crafted By Generations
          </h2>

          <div className="heritage-ornament" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px', opacity: '0.8'}}>
             <div style={{width: '30px', height: '1px', backgroundColor: '#a48c5a'}}></div>
             <svg width="10" height="10" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 8px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
             <div style={{width: '30px', height: '1px', backgroundColor: '#a48c5a'}}></div>
          </div>

          <p className="heritage-desc" style={{fontFamily: 'var(--font-sans)', color: '#555', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '60px', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto'}}>
            Rooted in the royal traditions of Rajasthan, Rajwadi Collections is a celebration of timeless craftsmanship. Every piece is a tribute to the skilled artisans who pass down their art with pride, from one generation to the next.
          </p>

          <div className="heritage-features" style={{display: 'flex', justifyContent: 'space-between', gap: '15px'}}>
             {/*  Feature 1  */}
             <div style={{flex: '1', borderRight: '1px solid rgba(164, 140, 90, 0.3)', paddingRight: '15px'}}>
                <div style={{height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '15px', color: '#a48c5a'}}>
                  {/*  Luxury Clover Motif  */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 10a4 4 0 1 0 0-8 4 4 0 1 0 0 8z"/>
                    <path d="M12 22a4 4 0 1 0 0-8 4 4 0 1 0 0 8z"/>
                    <path d="M10 12a4 4 0 1 0-8 0 4 4 0 1 0 8 0z"/>
                    <path d="M22 12a4 4 0 1 0-8 0 4 4 0 1 0 8 0z"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                  <h4 style={{fontFamily: 'var(--font-sans)', color: '#3a1a20', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap'}}>Hand Embroidery</h4>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', opacity: '0.7'}}>
                  <div style={{width: '25px', height: '1px', backgroundColor: '#a48c5a'}}></div>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 4px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
                  <div style={{width: '25px', height: '1px', backgroundColor: '#a48c5a'}}></div>
                </div>
                <p style={{fontFamily: 'var(--font-sans)', color: '#555', fontSize: '0.75rem', lineHeight: '1.6', padding: '0 5px'}}>Intricate hand embroidery done by skilled artisans with years of expertise.</p>
             </div>
             {/*  Feature 2  */}
             <div style={{flex: '1', borderRight: '1px solid rgba(164, 140, 90, 0.3)', padding: '0 15px'}}>
                <div style={{height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '15px', color: '#a48c5a'}}>
                  {/*  Professional Knot / Component  */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/>
                    <path d="M12 2l3.5 3.5L12 9 8.5 5.5 12 2Z"/>
                    <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/>
                    <path d="M12 15l3.5 3.5L12 22l-3.5-3.5L12 15Z"/>
                  </svg>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                  <h4 style={{fontFamily: 'var(--font-sans)', color: '#3a1a20', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap'}}>Traditional Craftsmanship</h4>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', opacity: '0.7'}}>
                  <div style={{width: '25px', height: '1px', backgroundColor: '#a48c5a'}}></div>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 4px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
                  <div style={{width: '25px', height: '1px', backgroundColor: '#a48c5a'}}></div>
                </div>
                <p style={{fontFamily: 'var(--font-sans)', color: '#555', fontSize: '0.75rem', lineHeight: '1.6', padding: '0 5px'}}>Preserving age-old techniques that reflect the rich cultural heritage of Rajasthan.</p>
             </div>
             {/*  Feature 3  */}
             <div style={{flex: '1', paddingLeft: '15px'}}>
                <div style={{height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '15px', color: '#a48c5a'}}>
                  {/*  Elegant Woman Figure / Fashion  */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="5" r="2.5"/>
                    <path d="M12 7.5v2"/>
                    <path d="M8 12c0-2 2-2.5 4-2.5s4 .5 4 2.5"/>
                    <path d="M8 12c1 5 1 6-2 10h12c-3-4-3-5-2-10"/>
                  </svg>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
                  <h4 style={{fontFamily: 'var(--font-sans)', color: '#3a1a20', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center', whiteSpace: 'nowrap'}}>Made For Modern Women</h4>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', opacity: '0.7'}}>
                  <div style={{width: '25px', height: '1px', backgroundColor: '#a48c5a'}}></div>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#a48c5a" style={{margin: '0 4px'}}><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>
                  <div style={{width: '25px', height: '1px', backgroundColor: '#a48c5a'}}></div>
                </div>
                <p style={{fontFamily: 'var(--font-sans)', color: '#555', fontSize: '0.75rem', lineHeight: '1.6', padding: '0 5px'}}>Thoughtfully designed silhouettes that blend tradition with contemporary elegance.</p>
             </div>
          </div>
        </div>
      </div>

      {/*  Transition / Quote Section (Warm Beige)  */}
      <div style={{backgroundColor: '#f5efe6', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(245,239,230,0.1))', padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid rgba(164, 140, 90, 0.1)', position: 'relative'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: '1'}}>
          <p style={{fontFamily: 'var(--font-serif), "Playfair Display", serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#513031', lineHeight: '1.7', fontStyle: 'italic', fontWeight: '400', letterSpacing: '0.02em'}}>
            "We do not just create garments; we weave legacies. Every thread holds a piece of our majestic history, lovingly crafted for the modern connoisseur."
          </p>
        </div>
      </div>


    
    </section>
  );
}

export default About;
