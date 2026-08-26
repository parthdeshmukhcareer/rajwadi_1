import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogData } from '../data/blogData';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const handleFilterClick = (category) => {
    setActiveCategory(category);
  };

  const filteredBlogs = activeCategory === 'all' 
    ? blogData 
    : blogData.filter(post => post.category === activeCategory);

  return (
    <main id="blog-view" className="view-section active" style={{ backgroundColor: '#FDFBF7' }}>
      
      {/* 1. Featured Article (Hero) */}
      <article style={{ position: 'relative', width: '100%', height: '75vh', minHeight: '550px', display: 'flex', alignItems: 'flex-end', padding: '60px 4%', backgroundImage: "url('/assets/images/generated_4k_hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,16,14,0.9) 0%, rgba(23,16,14,0) 100%)', zIndex: 1 }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', paddingBottom: '20px' }}>
          <span aria-label="Category: Heritage" style={{ display: 'inline-block', padding: '6px 15px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px', backdropFilter: 'blur(5px)' }}>Heritage</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', lineHeight: 1.1, marginBottom: '15px', fontWeight: 300, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            The Timeless Art of Zardosi:<br/>A Journey Through Threads
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#e0e0e0', marginBottom: '25px', maxWidth: '600px', lineHeight: 1.6 }}>
            Centuries ago, Zardosi was the mark of gods and kings. Today, at Rajwadi, we preserve this meticulous technique, blending pure gold and silver threads into modern masterpieces.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* The legacy code linked this to blog-post (the first post basically) */}
            <Link to="/blog/1" aria-label="Read featured article" style={{ display: 'inline-block', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '5px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.3s ease' }} onMouseOver={(e) => e.target.style.borderBottomColor = '#fff'} onMouseOut={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.4)'}>
              Read the Story
            </Link>
          </div>
        </div>
      </article>

      {/* 2. Category Navigation */}
      <nav aria-label="Blog Categories" style={{ backgroundColor: '#fff', borderBottom: '1px solid rgba(164,140,90,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
        <ul id="blog-filters" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', gap: '40px', overflowX: 'auto', padding: '20px' }}>
          {[
            { id: 'all', label: 'All Stories' },
            { id: 'atelier', label: 'Atelier' },
            { id: 'bridal', label: 'Bridal Trousseau' },
            { id: 'style', label: 'Style Guide' }
          ].map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => handleFilterClick(cat.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: activeCategory === cat.id ? 'var(--color-maroon-dark)' : '#666',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: activeCategory === cat.id ? 600 : 400,
                  borderBottom: activeCategory === cat.id ? '2px solid var(--color-gold)' : 'none',
                  paddingBottom: '5px',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => { if(activeCategory !== cat.id) e.target.style.color = 'var(--color-maroon-dark)' }}
                onMouseOut={(e) => { if(activeCategory !== cat.id) e.target.style.color = '#666' }}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. Article Grid */}
      <section aria-label="Recent Articles" style={{ padding: '80px 4%', maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#3a1a20', fontWeight: 300 }}>Latest from the Archives</h2>
        </header>

        <div id="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
          
          {filteredBlogs.map(post => (
            <article key={post.id} data-category={post.category} className="blog-card" style={{ background: '#fff', border: '1px solid rgba(164,140,90,0.1)', display: 'flex', flexDirection: 'column', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ width: '100%', height: '260px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.id}`)}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-gold-dark)', marginBottom: '15px', textTransform: 'uppercase' }}>{post.categoryLabel}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#3a1a20', marginBottom: '15px', fontWeight: 400, lineHeight: 1.3, cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.id}`)}>{post.title}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', lineHeight: 1.7, color: '#666', marginBottom: '25px', flexGrow: 1 }}>
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} aria-label={`Read ${post.title}`} style={{ alignSelf: 'flex-start', color: '#3a1a20', borderBottom: '1px solid rgba(58,26,32,0.2)', paddingBottom: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.3s ease' }} onMouseOver={(e) => e.target.style.borderBottomColor = '#3a1a20'} onMouseOut={(e) => e.target.style.borderBottomColor = 'rgba(58,26,32,0.2)'}>Read Article</Link>
              </div>
            </article>
          ))}
          
        </div>
      </section>

    </main>
  );
}

export default Blog;
