import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cart.service';
import { useAuth } from './AuthContext';
import localProducts from '../data/products';
import { productService } from '../services/product.service';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartState, setCartState] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [cartToastMessage, setCartToastMessage] = useState('');

  const [localCartItems, setLocalCartItems] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartState(null);
      return;
    }
    try {
      setIsCartLoading(true);
      const data = await cartService.getCart();
      setCartState(data);
      setCartError(null);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setCartError(err.message);
    } finally {
      setIsCartLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const isMockProduct = (id) => typeof id === 'string' && id.startsWith('prod-');

  const findLocalProductByVariant = (vId) => {
    let pId = vId;
    let size = 'Standard';
    let productData = localProducts.find(p => p.id === pId);
    if (!productData) {
      for (const p of localProducts) {
        if (p.variants) {
          const v = p.variants.find(v => v.id === vId);
          if (v) {
            productData = p;
            size = v.size;
            break;
          }
        }
      }
    }
    if (!productData && typeof vId === 'string' && vId.includes('-')) {
       const parts = vId.split('-');
       if (parts[0] === 'prod') {
           size = parts.pop();
           pId = parts.join('-');
           productData = localProducts.find(p => p.id === pId);
       }
    }
    return { productData, size };
  };

  const addToCart = async (variantId, quantity = 1) => {
    try {
      setIsCartLoading(true);
      if (isAuthenticated && !isMockProduct(variantId)) {
        await cartService.addToCart(variantId, quantity);
        await fetchCart();
      } else {
        // Guest or mock product -> add to local state
        // Try to fetch live data FIRST before modifying state
        const { productData, size } = findLocalProductByVariant(variantId);
        let liveProductData = null;
        
        if (!isMockProduct(variantId)) {
          try {
            // It might be a slug or product ID
            liveProductData = await productService.getProductBySlug(variantId);
          } catch (err) {
            // If it's a variant ID, getProductBySlug fails. Let's try with the matched product ID.
            if (productData && productData.id) {
              try {
                liveProductData = await productService.getProductBySlug(productData.id);
              } catch (innerErr) {
                console.error("Failed to fetch live product data by mapped product ID", innerErr);
              }
            } else {
              console.error("Failed to fetch live product data for cart:", err);
            }
          }
        }

        setLocalCartItems(prev => {
          const existing = prev.find(item => item.product?.id === variantId || item.variantId === variantId);
          if (existing) {
            return prev.map(item => (item.product?.id === variantId || item.variantId === variantId) ? { ...item, quantity: item.quantity + quantity } : item);
          }

          let imageUrl = liveProductData?.image || productData?.image || '/assets/images/placeholder.png';
          if (liveProductData?.images && liveProductData.images.length > 0) {
            const img = liveProductData.images[0];
            imageUrl = img.imageUrl || img.url || (typeof img === 'string' ? img : imageUrl);
          }
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            imageUrl = '/' + imageUrl;
          }

          return [...prev, { 
             id: `local-${Date.now()}`, 
             variantId: variantId, 
             quantity: quantity, 
             price: liveProductData?.basePrice || liveProductData?.startingPrice || liveProductData?.price || productData?.price || 0,
             product: { 
                 id: liveProductData?.id || productData?.id || variantId,
                 name: liveProductData?.name || productData?.name || 'Mock Product',
                 image: imageUrl,
                 variants: liveProductData?.variants || productData?.variants || []
             },
             variant: {
                 id: variantId,
                 size: size || 'Size unavailable'
             },
             size: size
          }];
        });
      }
      setCartToastMessage('Item added to cart');
      setTimeout(() => setCartToastMessage(''), 3000);
    } catch (err) {
      console.error('Failed to add to cart', err);
      // Fallback to local if UUID error
      if (err.message && err.message.toLowerCase().includes('uuid')) {
         setLocalCartItems(prev => {
            const { productData, size } = findLocalProductByVariant(variantId);
            return [...prev, { 
               id: `local-${Date.now()}`, 
               variantId: variantId, 
               quantity: quantity, 
               price: productData?.price || 0,
               product: { 
                   id: productData?.id || variantId,
                   name: productData?.name || 'Mock Product',
                   price: productData?.price || 0,
                   images: productData?.images ? productData.images.map(url => ({ url })) : [{ url: productData?.image }],
                   variants: productData?.variants || []
               },
               variant: { id: variantId, size: size.toUpperCase() }
            }];
         });
         setCartToastMessage('Item added to cart');
         setTimeout(() => setCartToastMessage(''), 3000);
      } else {
         throw err;
      }
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setIsCartLoading(true);
      if (itemId.toString().startsWith('local-')) {
        setLocalCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
        return;
      }
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity', err);
      throw err;
    } finally {
      setIsCartLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setIsCartLoading(true);
      if (itemId.toString().startsWith('local-')) {
        setLocalCartItems(prev => prev.filter(item => item.id !== itemId));
        return;
      }
      await cartService.removeCartItem(itemId);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item', err);
      throw err;
    } finally {
      setIsCartLoading(false);
    }
  };

  const toggleCartSidebar = () => setIsCartSidebarOpen(!isCartSidebarOpen);

  const changeSize = async (oldItemId, newVariantId, quantity) => {
    try {
      setIsCartLoading(true);
      if (oldItemId.toString().startsWith('local-')) {
        setLocalCartItems(prev => prev.filter(item => item.id !== oldItemId));
        await addToCart(newVariantId, quantity);
        return;
      }
      await cartService.removeCartItem(oldItemId);
      await cartService.addToCart(newVariantId, quantity);
      await fetchCart();
      setCartToastMessage('Size updated');
      setTimeout(() => setCartToastMessage(''), 3000);
    } catch (err) {
      console.error('Failed to change size', err);
      throw err;
    } finally {
      setIsCartLoading(false);
    }
  };

  // Merge backend cart items with local items
  const backendItems = cartState?.items || [];
  const mergedItems = [...backendItems, ...localCartItems];
  
  const cartItemCount = mergedItems.reduce((total, item) => total + item.quantity, 0);

  // Create a synthetic cart state that merges backend data with local data
  const syntheticCartState = cartState ? { ...cartState, items: mergedItems } : { items: mergedItems, totalAmount: 0 };

  const value = {
    cartState: syntheticCartState,
    isCartLoading,
    cartError,
    cartItemCount,
    isCartSidebarOpen,
    cartToastMessage,
    toggleCartSidebar,
    addToCart,
    updateQuantity,
    changeSize,
    removeItem,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
