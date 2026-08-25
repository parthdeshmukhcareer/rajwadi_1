import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import About from './pages/About'
import Story from './pages/Story'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Account from './pages/Account'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/Footer'
import WishlistSidebar from './components/WishlistSidebar'

function App() {
  const [products, setProducts] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  useEffect(() => {
    // Fetch products from our backend API
    axios.get("http://localhost:3000/api/products")
      .then(res => {
        setProducts(res.data)
      })
      .catch(err => {
        console.error("Failed to fetch products:", err)
      })
  }, [])

  const toggleCart = () => {
    console.log("Toggle cart drawer")
  }

  return (
    <>
      <Header 
        cartCount={cartCount} 
        toggleCart={toggleCart} 
        toggleWishlistSidebar={() => setIsWishlistOpen(true)} 
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/story" element={<Story />} />
          <Route path="/catalog" element={<Catalog products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product/:id" element={<ProductDetail products={products} toggleCart={toggleCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
        </Routes>
      </main>
      <Footer />
      <WishlistSidebar 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
        wishlist={wishlist} 
        products={products} 
        toggleWishlist={toggleWishlist} 
      />
    </>
  )
}

export default App
