import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import localProducts from './data/products'
import Header from './components/Header'
import Payment from './pages/Payment'
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
import CartSidebar from './components/CartSidebar'
import Checkout from './pages/Checkout'
import Invoice from './pages/Invoice'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import AdminApp from './admin/AdminApp'
import { useCart } from './context/CartContext'

function App() {
  const [products, setProducts] = useState(localProducts)
  const [wishlist, setWishlist] = useState([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const location = useLocation()
  
  const { cartItemCount, toggleCartSidebar, clearCart, addToCart } = useCart()
  
  const isAdminRoute = location.pathname.startsWith('/admin')

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  useEffect(() => {
    // Products are loaded statically from local data.
  }, [])

  if (isAdminRoute) {
    return <AdminApp />
  }

  return (
    <>
      <ScrollToTop />
      <Header 
        cartCount={cartItemCount} 
        wishlistCount={wishlist.length}
        toggleCart={toggleCartSidebar} 
        toggleWishlistSidebar={() => setIsWishlistOpen(true)} 
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/story" element={<Story />} />
          <Route path="/catalog" element={<Catalog products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout products={products} />} />
          <Route path="/payment/:orderNumber" element={<Payment />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/product/:slug" element={<ProductDetail products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
          <Route path="/account/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/account/orders/:orderNumber" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
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
      <CartSidebar />
    </>
  )
}

export default App
