import React from 'react';
import { Link } from 'react-router-dom';

function Story() {
  return (
    <section id="story-view" className="view-section active">

      
      {/*  1. Cinematic Full-Width Hero Section  */}
      <div className="story-hero-section" style={{position: 'relative', width: '100%', height: '90vh', minHeight: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '0', zIndex: '1'}}>
        
        {/*  Background Image  */}
        <div style={{position: 'absolute', inset: '0', backgroundImage: 'url("assets/images/royal_story_hero.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', filter: 'brightness(0.9) contrast(1.1)'}}></div>
        
        {/*  Elegant Gradient Overlays  */}
        <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(to bottom, rgba(15,10,10,0.7) 0%, rgba(15,10,10,0.3) 40%, rgba(15,10,10,0.8) 100%)'}}></div>
        <div style={{position: 'absolute', inset: '0', background: 'radial-gradient(circle at center, transparent 30%, rgba(15,10,10,0.6) 100%)'}}></div>
        {/*  Soft Black Overlay for better text readability  */}
        <div style={{position: 'absolute', inset: '0', backgroundColor: 'rgba(0,0,0,0.35)'}}></div>
        
        {/*  Content  */}
        <div style={{position: 'relative', zIndex: '2', textAlign: 'center', color: '#fff', padding: '0 20px', maxWidth: '700px', marginTop: '170px'}}>
          
          <div style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.4em', color: '#dfceab', marginBottom: '20px', textTransform: 'uppercase', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '15px'}}>
            <span style={{display: 'inline-block', width: '40px', height: '1px', backgroundColor: '#dfceab'}}></span>
            The Origins
            <span style={{display: 'inline-block', width: '40px', height: '1px', backgroundColor: '#dfceab'}}></span>
          </div>
          
          <h2 className="resp-hero-text" style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 5.5vw, 5rem)', color: '#fdfbf7', lineHeight: '1.1', fontWeight: '300', marginBottom: '25px', letterSpacing: '0.03em', textShadow: '0 5px 15px rgba(0,0,0,0.3)'}}>
            Where Tradition <br/> Meets Elegance
          </h2>
          
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '1.15rem', lineHeight: '1.8', color: 'rgba(253, 251, 247, 0.9)', fontWeight: '300', maxWidth: '500px', margin: '0 auto', marginBottom: '40px'}}>
            Step into the corridors of history. Discover how a small dream in the heart of Gujarat blossomed into a global emblem of Indian sartorial elegance.
          </p>
          
          {/*  Decorative Scroll Indicator  */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: '0.8', animation: 'pulse 2s infinite'}}>
            <div style={{fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#dfceab', marginBottom: '10px', textTransform: 'uppercase'}}>Discover</div>
            <div style={{width: '1px', height: '60px', background: 'linear-gradient(to bottom, #dfceab, transparent)'}}></div>
          </div>

        </div>
      </div>

      {/*  2. Minimalist Story Sections  */}
      <div className="resp-padding" style={{backgroundColor: '#FDFBF7', padding: '40px 20px 100px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px'}}>
          
          {/*  Block 1  */}
          <div className="resp-flex-col resp-padding" style={{position: 'relative', padding: '60px 0', backgroundColor: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '80px', overflow: 'hidden', marginBottom: '0'}}>
            
            {/* Watermark text */}
            <div className="resp-hero-bg-text resp-hidden" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--font-serif)', fontSize: 'clamp(15rem, 30vw, 35rem)', color: '#a48c5a', opacity: '0.04', fontWeight: '700', pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none'}}>
              1979
            </div>

            {/*  Left: Vintage Photo in Gold Frame  */}
            <div style={{flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: '2'}}>
              <div style={{padding: '20px', border: '2px solid #a48c5a', backgroundColor: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative', maxWidth: '90%'}}>
                {/*  Vintage inner border  */}
                <div style={{border: '1px solid rgba(164, 140, 90, 0.4)', padding: '4px'}}>
                  <img src="assets/images/about_us_female.png" alt="Early Boutique" style={{width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', filter: 'sepia(0.3) contrast(1.1)'}} />
                </div>
              </div>
            </div>

            {/*  Right: Text Content  */}
            <div style={{flex: '1', position: 'relative', zIndex: '2', paddingRight: '40px'}}>
              
              {/*  1979 with lines  */}
              <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px'}}>
                <span style={{display: 'inline-block', width: '60px', height: '1px', backgroundColor: '#a48c5a'}}></span>
                <span style={{fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#a48c5a', letterSpacing: '0.2em'}}>1979</span>
                <span style={{display: 'inline-block', width: '60px', height: '1px', backgroundColor: '#a48c5a'}}></span>
              </div>

              {/*  Title  */}
              <h3 style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: '#3a1a20', marginBottom: '30px', fontWeight: '400', lineHeight: '1.1'}}>Our Beginning</h3>
              
              {/*  Text  */}
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', lineHeight: '1.85', color: '#555', fontWeight: '300', marginBottom: '25px', maxWidth: '500px'}}>
                Rajwadi's journey began with a simple dream: to share the unparalleled beauty of Indian ethnic wear with the world. What started as a small, intimate family-run boutique in the cultural heart of Gujarat has slowly blossomed into a destination for sartorial elegance.
              </p>
              
              <p style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', lineHeight: '1.85', color: '#555', fontWeight: '300', marginBottom: '40px', maxWidth: '500px'}}>
                Driven by passion and an unwavering commitment to quality, every piece curated in our early days carried the hallmark of royal craftsmanship.
              </p>

              {/*  Founder Signature  */}
              <div style={{marginTop: '30px'}}>
                <div style={{fontFamily: '"Brush Script MT", "Great Vibes", cursive', fontSize: '2.5rem', color: '#3a1a20', transform: 'rotate(-5deg)', display: 'inline-block', opacity: '0.9'}}>
                  R. Patel
                </div>
                <div style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#a48c5a', marginTop: '10px'}}>
                  Founder, Rajwadi
                </div>
              </div>
              
            </div>
          </div>

          {/*  Block 2: Timeline  */}
          <div className="resp-flex-col resp-padding" style={{display: 'flex', alignItems: 'stretch', gap: '60px', backgroundColor: '#ffffff', padding: '60px', borderRadius: '8px', boxShadow: '0 15px 40px rgba(0,0,0,0.04)', marginTop: '0'}}>
            
            {/*  Left: Timeline  */}
            <div style={{flex: '1', padding: '20px 40px 20px 20px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              
              <div style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.25em', color: '#a48c5a', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '600'}}>
                 The Legacy
              </div>
              <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '3.2rem', color: '#3a1a20', marginBottom: '50px', fontWeight: '300', lineHeight: '1.1'}}>Our Journey</h3>
              
              <div style={{position: 'relative', paddingLeft: '10px'}}>
                {/*  Vertical Line  */}
                <div style={{position: 'absolute', left: '27px', top: '13px', bottom: '65px', width: '2px', background: 'linear-gradient(to bottom, rgba(164,140,90,0.8) 0%, rgba(164,140,90,0.2) 100%)'}}></div>
                
                {/*  Items  */}
                {/*  1979  */}
                <div style={{position: 'relative', paddingLeft: '50px', marginBottom: '45px'}}>
                  <div style={{position: 'absolute', left: '10px', top: '5px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#a48c5a', border: '3px solid #fff', boxShadow: '0 0 0 1px #a48c5a', boxSizing: 'border-box', zIndex: '2'}}></div>
                  <div style={{fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#3a1a20', fontWeight: '400', marginBottom: '8px'}}>1979</div>
                  <div style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#666', fontWeight: '300'}}>Founded in Gujarat</div>
                </div>

                {/*  1988  */}
                <div style={{position: 'relative', paddingLeft: '50px', marginBottom: '45px'}}>
                  <div style={{position: 'absolute', left: '13px', top: '8px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a48c5a', boxSizing: 'border-box', zIndex: '2'}}></div>
                  <div style={{fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#3a1a20', fontWeight: '400', marginBottom: '8px'}}>1988</div>
                  <div style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#666', fontWeight: '300'}}>Expanded Handloom Collection</div>
                </div>

                {/*  2002  */}
                <div style={{position: 'relative', paddingLeft: '50px', marginBottom: '45px'}}>
                  <div style={{position: 'absolute', left: '13px', top: '8px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a48c5a', boxSizing: 'border-box', zIndex: '2'}}></div>
                  <div style={{fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#3a1a20', fontWeight: '400', marginBottom: '8px'}}>2002</div>
                  <div style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#666', fontWeight: '300'}}>Royal Bridal Collection</div>
                </div>

                {/*  2015  */}
                <div style={{position: 'relative', paddingLeft: '50px', marginBottom: '45px'}}>
                  <div style={{position: 'absolute', left: '13px', top: '8px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a48c5a', boxSizing: 'border-box', zIndex: '2'}}></div>
                  <div style={{fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#3a1a20', fontWeight: '400', marginBottom: '8px'}}>2015</div>
                  <div style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#666', fontWeight: '300'}}>International Shipping</div>
                </div>

                {/*  Today  */}
                <div style={{position: 'relative', paddingLeft: '50px'}}>
                  <div style={{position: 'absolute', left: '10px', top: '5px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', border: '3px solid #a48c5a', boxSizing: 'border-box', zIndex: '2'}}></div>
                  <div style={{fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#3a1a20', fontWeight: '400', marginBottom: '8px'}}>Today</div>
                  <div style={{fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#666', fontWeight: '300'}}>Serving Customers Worldwide</div>
                </div>
                
              </div>
            </div>

            {/*  Right: Royal Image  */}
            <div style={{flex: '1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
               {/*  Elegant Frame for the image  */}
               <div style={{position: 'absolute', inset: '0', border: '1px solid rgba(164,140,90,0.2)', zIndex: '0', pointerEvents: 'none'}}></div>
               <div style={{position: 'absolute', inset: '10px', border: '1px solid rgba(164,140,90,0.5)', zIndex: '2', pointerEvents: 'none'}}></div>
               <img src="assets/images/parallax_saree.png" alt="Royal Heritage" style={{width: '100%', height: '100%', minHeight: '550px', objectFit: 'cover', position: 'relative', zIndex: '1', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}} />
            </div>
          </div>

        </div>
      </div>

      {/*  3. Artisan Tribute Section (Cinematic Parallax)  */}
      <div style={{position: 'relative', width: '100%', height: '85vh', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url("assets/images/lehenga.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundColor: '#17100e'}}>
        
        {/*  Subtle soft black overlay  */}
        <div style={{position: 'absolute', inset: '0', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: '1'}}></div>
        
        <div style={{position: 'relative', zIndex: '2', textAlign: 'center', maxWidth: '800px', padding: '40px 20px'}}>
          <h2 style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#fff', lineHeight: '1.2', marginBottom: '20px', fontWeight: '300', textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
            Honoring the Hands<br />That Weave Magic
          </h2>
          <p style={{fontFamily: 'var(--font-sans)', fontSize: '1.05rem', lineHeight: '1.8', color: '#fdfbf7', marginBottom: '40px', fontWeight: '300', textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
            Our weavers are the true custodians of our culture. We are immensely proud to support over 500 artisan families across India, ensuring their ancient crafts continue to thrive in the modern world.
          </p>
          <a href="#" onClick={() => {showView('catalog'); return false;}} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600', padding: '14px 40px', textDecoration: 'none', transition: 'all 0.4s ease'}} onMouseOver={() => {this.style.backgroundColor='#fff'; this.style.color='#17100e'}} onMouseOut={() => {this.style.backgroundColor='transparent'; this.style.color='#fff'}}>
            Explore Our Heritage
          </a>
        </div>
      </div>
    
    </section>
  );
}

export default Story;
