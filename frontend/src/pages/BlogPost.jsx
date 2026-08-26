import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogData } from '../data/blogData';

function BlogPost() {
  const { id } = useParams();
  
  // Find the post by ID. If not found, use a fallback or redirect (for now, fallback to post 1 if invalid)
  const post = blogData.find(p => p.id === parseInt(id)) || blogData[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <main id={`blog-post-${post.id}-view`} className="view-section active" style={{ backgroundColor: '#FDFBF7' }}>
      <header style={{ position: 'relative', width: '100%', height: '65vh', minHeight: '450px', backgroundImage: `url(${post.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
          <Link to="/blog" style={{ color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 20px', transition: 'background 0.3s ease' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>&larr; Back to Editorial</Link>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-gold)', marginBottom: '15px', textTransform: 'uppercase' }}>{post.categoryLabel}</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: 1.2, marginBottom: '20px', fontWeight: 300, maxWidth: '800px', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            {post.title}
          </h1>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>{post.date} &middot; By {post.author}</div>
        </div>
      </header>
      <article style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 20px' }}>
        
        {/* Render the HTML content dangerously since it's hardcoded and trusted */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        <div style={{ borderTop: '1px solid rgba(164,140,90,0.2)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '60px' }}>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-maroon-dark)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Back to Top &uarr;</button>
        </div>
      </article>
    </main>
  );
}

export default BlogPost;
