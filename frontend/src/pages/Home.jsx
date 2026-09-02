import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function Home() {
  useDocumentTitle('Rajwadi | Premium Ethnic Fashion');
  const navigate = useNavigate();
  return (
    <section id="home-view" className="view-section active">

      {/*  Hero Carousel  */}
      {/*  Hero Section (Static Image)  */}
      <div className="static-hero-image" style={{width: '100%', position: 'relative', height: '100vh', overflow: 'hidden', background: '#000'}}>
        {/* Seamless reflection trick to fill the top gap perfectly without blur or black lines */}
        <div style={{position: 'absolute', top: 0, left: '-2%', width: '104%', height: '90px', overflow: 'hidden', zIndex: 0}}>
           <img src="assets/images/eec54ddf-9a5f-4e61-ae42-8ab880568471.png" alt="Reflection" style={{width: '100%', height: '100vh', objectFit: 'cover', objectPosition: '100% 0%', position: 'absolute', top: '90px', left: 0, transform: 'rotateX(180deg)', transformOrigin: 'top center'}} />
        </div>
        
        {/* Main image shifted down and left, with no weird zooming */}
        <img src="assets/images/eec54ddf-9a5f-4e61-ae42-8ab880568471.png" alt="Rajwadi Hero" className="hero-bg-img" style={{width: '104%', height: '100vh', objectFit: 'cover', objectPosition: '100% 0%', display: 'block', position: 'absolute', top: '90px', left: '-2%', zIndex: '1'}} />
        
        {/*  Dark gradient overlay for text readability - REMOVED per user request  */}
        {/* <div className="custom-hero-overlay" style={{background: 'linear-gradient(to right, rgba(15,10,10,0.9) 0%, rgba(15,10,10,0.4) 50%, rgba(15,10,10,0) 100%)', position: 'absolute', inset: '0', zIndex: '1'}}></div> */}
        
        <div className="custom-hero-content-wrapper">
          <div className="custom-hero-content">
            <p className="custom-hero-kicker" style={{color: '#dfceab', fontWeight: '500', marginBottom: '25px', display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
              THE RAJWADI LEGACY
            </p>
            <h2 className="custom-hero-title" style={{lineHeight: '1.2', marginBottom: '25px', color: '#efe5d5'}}>
              ROYALTY WOVEN<br />IN TRADITION.
            </h2>
            <p className="custom-hero-subtitle" style={{lineHeight: '1.7', maxWidth: '500px', color: '#efe5d5', opacity: '0.9', marginBottom: '65px'}}>
              Experience the majestic allure of Rajasthani heritage. Handcrafted couture that transforms every moment into a regal symphony.
            </p>
            <div className="custom-hero-actions">
              <button className="custom-hero-btn-outline" onClick={() => {navigate('/catalog')}} style={{padding: '16px 50px', borderColor: 'rgba(223, 206, 171, 0.8)', color: '#dfceab', fontSize: '0.9rem', letterSpacing: '0.2em'}}>DISCOVER COLLECTION</button>
            </div>
          </div>
        </div>
      </div>


      {/*  Categories Block (Revamped)  */}
      <div className="section-padding premium-categories-section" style={{backgroundColor: '#fcf8f0', padding: '65px 4% 40px 4%', position: 'relative'}}>
        {/*  Header  */}
        <div className="premium-stores-header" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', padding: '0 20px'}}>
          <div className="store-kicker" style={{fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.25em', color: '#a48c5a', marginBottom: '15px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600'}}>
            <span style={{display: 'inline-block', width: '40px', height: '1px', backgroundColor: '#a48c5a', marginRight: '15px'}}></span>
            OUR STORES
            <span style={{display: 'inline-block', width: '40px', height: '1px', backgroundColor: '#a48c5a', marginLeft: '15px'}}></span>
          </div>
          <h2 style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', color: '#432227', lineHeight: '1.15', fontWeight: '300', marginBottom: '20px'}}>
            Shop By Category
          </h2>
          {/*  Decorative Line under Heading  */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '5px', marginBottom: '20px'}}>
            <div style={{height: '1px', width: '80px', backgroundColor: 'rgba(164, 140, 90, 0.5)'}}></div>
            <i className="fa-solid fa-crown" style={{color: '#a48c5a', fontSize: '0.9rem'}}></i>
            <div style={{height: '1px', width: '80px', backgroundColor: 'rgba(164, 140, 90, 0.5)'}}></div>
          </div>

        </div>

        {/*  Carousel  */}
        <div className="premium-stores-carousel-container" style={{position: 'relative', maxWidth: '1400px', margin: '0 auto', padding: '0 60px', marginBottom: '40px'}}>

          
          <div className="premium-stores-carousel" id="premiumCategoriesScroll" style={{display: 'flex', justifyContent: 'center', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '15px 5px', scrollBehavior: 'smooth'}}>
            
            {/*  Card 1: Rajputi Poshak  */}
            <div className="premium-store-card" style={{flex: '0 0 calc(33.333% - 15px)', minWidth: '280px', height: '380px', borderRadius: '8px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', cursor: 'pointer'}} onClick={() => {navigate('/catalog?category=Rajputi Poshak')}}>
              <img src="assets/images/c448f31266ab16343b17a56cca813e6e.jpg" style={{ objectPosition: 'top center' }} />
              <div className="store-card-overlay" style={{position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(15,5,5,0.95) 0%, rgba(15,5,5,0.4) 45%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: '30px 15px'}}>
                <i className="fa-solid fa-crown" style={{color: '#dfceab', fontSize: '1.6rem', marginBottom: '12px'}}></i>
                <h3 style={{fontFamily: 'var(--font-serif)', color: '#fcfbf9', fontSize: '1.3rem', letterSpacing: '0.15em', marginBottom: '12px', fontWeight: '300'}}>RAJPUTI POSHAK</h3>
                <span className="explore-text" style={{fontFamily: 'var(--font-sans)', color: '#a48c5a', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px'}}>Explore Collection <i className="fa-solid fa-arrow-right" style={{fontSize: '9px'}}></i></span>
              </div>
            </div>
            
            {/*  Card 2: Accessories  */}
            <div className="premium-store-card" style={{flex: '0 0 calc(33.333% - 15px)', minWidth: '280px', height: '380px', borderRadius: '8px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', cursor: 'pointer'}} onClick={() => {navigate('/catalog?category=Accessories')}}>
              <img src="assets/images/7d08712106caadebf74d60911d9d2474.jpg" style={{ objectPosition: 'center 75%' }} />
              <div className="store-card-overlay" style={{position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(15,5,5,0.95) 0%, rgba(15,5,5,0.4) 45%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: '30px 15px'}}>
                <i className="fa-solid fa-gem" style={{color: '#dfceab', fontSize: '1.6rem', marginBottom: '12px'}}></i>
                <h3 style={{fontFamily: 'var(--font-serif)', color: '#fcfbf9', fontSize: '1.3rem', letterSpacing: '0.15em', marginBottom: '12px', fontWeight: '300'}}>ACCESSORIES</h3>
                <span className="explore-text" style={{fontFamily: 'var(--font-sans)', color: '#a48c5a', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px'}}>Explore Collection <i className="fa-solid fa-arrow-right" style={{fontSize: '9px'}}></i></span>
              </div>
            </div>
            
            {/*  Card 4: Jewellery  */}
            <div className="premium-store-card" style={{flex: '0 0 calc(33.333% - 15px)', minWidth: '280px', height: '380px', borderRadius: '8px', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', cursor: 'pointer'}} onClick={() => {navigate('/catalog?category=Jewellery')}}>
              <img src="assets/images/jewellery_royal.png" />
              <div className="store-card-overlay" style={{position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(15,5,5,0.95) 0%, rgba(15,5,5,0.4) 45%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: '30px 15px'}}>
                <i className="fa-solid fa-ring" style={{color: '#dfceab', fontSize: '1.6rem', marginBottom: '12px'}}></i>
                <h3 style={{fontFamily: 'var(--font-serif)', color: '#fcfbf9', fontSize: '1.3rem', letterSpacing: '0.15em', marginBottom: '12px', fontWeight: '300'}}>JEWELLERY</h3>
                <span className="explore-text" style={{fontFamily: 'var(--font-sans)', color: '#a48c5a', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px'}}>Explore Collection <i className="fa-solid fa-arrow-right" style={{fontSize: '9px'}}></i></span>
              </div>
            </div>
            
          </div>
          

        </div>
        
        {/*  View All Button Moved to Bottom  */}
        <div style={{textAlign: 'center', marginBottom: '50px'}}>
          <button className="custom-hero-btn-outline" onClick={() => {navigate('/catalog')}} style={{padding: '16px 40px', border: '1px solid rgba(164, 140, 90, 0.4)', color: '#432227', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.3s ease'}}>
            VIEW ALL COLLECTIONS <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
        
        {/* Elegant Moments - High End Feature */}
      <div className="elegant-moments-section resp-flex-col resp-padding" style={{display: 'flex', gap: '0', maxWidth: '1400px', margin: '0 auto', backgroundColor: 'transparent', paddingTop: '80px', paddingBottom: '60px'}}>
          
          {/*  Left Side  */}
          <div className="elegant-left" style={{flex: '1', display: 'flex', flexDirection: 'column', padding: '40px 60px 0 0'}}>
            <div className="elegant-kicker" style={{fontFamily: 'var(--font-sans)', fontSize: '0.95rem', letterSpacing: '0.2em', color: '#a48c5a', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px'}}>
              OCCASIONS
              <span style={{display: 'inline-block', width: '45px', height: '1px', backgroundColor: '#a48c5a'}}></span>
            </div>
            <h2 className="elegant-title" style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 4.5vw, 4.2rem)', color: '#3a1a20', lineHeight: '1.05', fontWeight: '400', marginBottom: '25px', letterSpacing: '-0.02em'}}>
              Elegant Moments
            </h2>
            <p className="elegant-desc" style={{fontFamily: 'var(--font-sans)', color: '#555', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '600px', marginBottom: '40px', transform: 'translateY(-8px)'}}>
              Handpicked Rajasthani styles for weddings, parties, festivals, and more – perfect for every special moment.
            </p>
            <a href="#" className="elegant-explore-link" onClick={() => {navigate('/catalog'); return false;}} style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.15em', color: '#a48c5a', textTransform: 'uppercase', fontWeight: '600', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', marginBottom: '40px', textDecoration: 'none'}}>
              EXPLORE ALL OCCASIONS <i className="fa-solid fa-arrow-right-long"></i>
            </a>
            
            <div className="elegant-main-img-wrapper" style={{flexGrow: '1', position: 'relative', marginRight: '40px', minHeight: '400px'}}>
              <img src="assets/images/elegant_moments_rajputi.jpg" alt="Elegant Moments Main" style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', position: 'absolute', inset: '0'}} />
            </div>
          </div>

          {/*  Right Side  */}
          <div className="elegant-right" style={{flex: '1', display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(164, 140, 90, 0.2)', borderLeft: '1px solid rgba(164, 140, 90, 0.2)'}}>
            
            {/*  Item 1  */}
            <div className="elegant-list-item" style={{display: 'flex', flex: '1', minHeight: '440px', borderBottom: '1px solid rgba(164, 140, 90, 0.2)', position: 'relative', overflow: 'hidden', cursor: 'pointer'}} onClick={() => {navigate('/catalog')}}>
               <div className="elegant-item-content" style={{flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: '2'}}>
                  <span className="elegant-item-num" style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#a48c5a', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px'}}>01 <span style={{display: 'inline-block', width: '20px', height: '1px', backgroundColor: '#a48c5a'}}></span></span>
                  <h3 className="elegant-item-title" style={{fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '1.8rem', fontWeight: '400', marginBottom: '20px'}}>Stitched Poshak</h3>
                  <span className="elegant-item-link" style={{fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#a48c5a', textTransform: 'uppercase', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px'}}>EXPLORE <i className="fa-solid fa-arrow-right-long"></i></span>
               </div>
               <div className="elegant-item-img-container" style={{width: '60%', position: 'absolute', right: '0', top: '0', bottom: '0', zIndex: '1', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)', overflow: 'hidden'}}>
                  <img src="assets/images/stitched_poshak.jpg" alt="Bridal Edit" style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transition: 'transform 0.6s ease'}} className="elegant-item-img" />
               </div>
            </div>

            {/*  Item 2  */}
            <div className="elegant-list-item" style={{display: 'flex', flex: '1', minHeight: '440px', position: 'relative', overflow: 'hidden', cursor: 'pointer'}} onClick={() => {navigate('/catalog')}}>
               <div className="elegant-item-content" style={{flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: '2'}}>
                  <span className="elegant-item-num" style={{fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#a48c5a', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px'}}>02 <span style={{display: 'inline-block', width: '20px', height: '1px', backgroundColor: '#a48c5a'}}></span></span>
                  <h3 className="elegant-item-title" style={{fontFamily: 'var(--font-serif)', color: '#432227', fontSize: '1.8rem', fontWeight: '400', marginBottom: '20px'}}>Unstitched Poshak</h3>
                  <span className="elegant-item-link" style={{fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#a48c5a', textTransform: 'uppercase', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px'}}>EXPLORE <i className="fa-solid fa-arrow-right-long"></i></span>
               </div>
               <div className="elegant-item-img-container" style={{width: '60%', position: 'absolute', right: '0', top: '0', bottom: '0', zIndex: '1', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)', overflow: 'hidden'}}>
                  <img src="assets/images/unstitched_poshak.jpg" alt="Unstitched Poshak" style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transition: 'transform 0.6s ease'}} className="elegant-item-img" />
               </div>
            </div>

          </div>
        </div>
      </div>



      {/*  Dream Outfit Banner (Replaces Parallax Section)  */}
      <div className="dream-outfit-banner" style={{position: 'relative', width: '100%', marginTop: '0', marginBottom: '0', minHeight: '550px', overflow: 'hidden', display: 'flex', alignItems: 'center', backgroundColor: '#fcf8f0', backgroundImage: 'linear-gradient(to right, #fcf8f0 30%, rgba(252, 248, 240, 0.85) 45%, transparent 55%), url("assets/images/fe4dee22-0969-43ab-8a9f-ecb2dc745a48.png")', backgroundSize: '90%', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat'}}>
        
        <div className="dream-outfit-content" style={{flex: '0 0 55%', padding: '60px 80px 60px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left'}}>  
          
          <h2 style={{fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#432227', lineHeight: '1.1', fontWeight: '400', marginBottom: '30px'}}>
            Design Your<br />Dream Outfit
          </h2>


          <p style={{fontFamily: 'var(--font-sans)', color: '#333', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '450px'}}>
            A fully custom made outfit crafted specially for you! Come and explore the exotic ethnic collection with Rajwadi.
          </p>
          
          <button style={{backgroundColor: '#432227', color: '#fff', border: '1px solid #432227', padding: '15px 40px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease', boxShadow: '0 0 0 4px rgba(67, 34, 39, 0.1)'}} onClick={() => {navigate('/catalog?category=Rajputi Poshak')}} onMouseOver={(e) => {e.currentTarget.style.backgroundColor='#2a1518'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='#432227'}}>
            SHOP NOW <i className="fa-solid fa-arrow-right-long"></i>
          </button>
          
        </div>
      </div>

      {/*  Feature Banner Info  */}
      {/*  Trust Features Section (Image Match)  */}
      <div className="trust-features-section" style={{width: '100%', backgroundColor: '#fcf8f0'}}>
        <img src="assets/images/c8e81c59-aa21-4894-b186-684eeb8b8747.png" alt="Features" style={{width: '100%', height: 'auto', display: 'block'}} />
      </div>
    
    </section>
  );
}

export default Home;
