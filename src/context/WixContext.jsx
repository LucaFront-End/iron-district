import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wixClient, WIX_STORES_APP_ID, formatWixImage } from '../services/wixClient';
import { currentCart } from '@wix/ecom';

const WixContext = createContext(null);

export function WixProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch initial catalog of products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await wixClient.products.queryProducts().limit(100).find();
      setProducts(res.items || []);
    } catch (err) {
      console.error('Error fetching Wix products:', err);
      setError(err.message || 'Failed to load products from Wix');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current visitor cart
  const fetchCart = useCallback(async () => {
    try {
      const current = await wixClient.currentCart.getCurrentCart();
      setCart(current);
    } catch (err) {
      // If cart doesn't exist yet for visitor, that is standard Wix behavior until first item is added
      if (!err?.message?.includes('OWNED_CART_NOT_FOUND') && !err?.details?.applicationError?.code?.includes('OWNED_CART_NOT_FOUND')) {
        console.warn('Cart initialization notice:', err.message);
      }
      setCart(null);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  // Compute total cart item quantity
  const cartCount = (cart?.lineItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Formatted subtotal
  const cartSubtotal = cart?.subtotal?.formattedAmount || cart?.subtotal?.formattedConvertedAmount || '$0.00';

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Add a product with selected options to the cart
  const addToCart = async (product, selectedOptions = {}, quantity = 1) => {
    if (!product?._id) return { success: false, error: 'Invalid product' };

    try {
      setIsCartLoading(true);

      // Match chosen options to variant ID if product has variants
      let variantId = undefined;
      if (product.variants && product.variants.length > 0) {
        if (Object.keys(selectedOptions).length > 0) {
          const matchedVariant = product.variants.find((v) => {
            return Object.entries(selectedOptions).every(([optName, optVal]) => {
              return v.choices?.[optName] === optVal;
            });
          });
          variantId = matchedVariant?._id || product.variants[0]._id;
        } else {
          variantId = product.variants[0]._id;
        }
      }

      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: WIX_STORES_APP_ID,
              catalogItemId: product._id,
              options: variantId ? { variantId } : undefined,
            },
            quantity: Math.max(1, quantity),
          },
        ],
      });

      if (response?.cart) {
        setCart(response.cart);
      } else {
        await fetchCart();
      }

      setIsCartOpen(true);
      return { success: true };
    } catch (err) {
      console.error('Error adding item to Wix cart:', err);
      alert(`Could not add item to cart: ${err.message || 'Unknown error'}`);
      return { success: false, error: err.message };
    } finally {
      setIsCartLoading(false);
    }
  };

  // Update quantity of an item
  const updateCartItemQuantity = async (lineItemId, newQuantity) => {
    if (!lineItemId) return;
    if (newQuantity <= 0) {
      return removeFromCart(lineItemId);
    }

    try {
      setIsCartLoading(true);
      const res = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
        {
          _id: lineItemId,
          quantity: newQuantity,
        },
      ]);
      if (res?.cart) {
        setCart(res.cart);
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.error('Error updating line item quantity:', err);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (lineItemId) => {
    if (!lineItemId) return;

    try {
      setIsCartLoading(true);
      const res = await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
      if (res?.cart) {
        setCart(res.cart);
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.error('Error removing line item from cart:', err);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Initiate official Wix Checkout session and redirect
  const checkout = async () => {
    if (!cart?.lineItems || cart.lineItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      setCheckoutLoading(true);
      const checkoutRes = await wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      });

      if (!checkoutRes?.checkoutId) {
        throw new Error('Failed to create checkout session');
      }

      const redirectRes = await wixClient.redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkoutRes.checkoutId },
        callbacks: {
          postFlowUrl: window.location.origin + '/#/shop',
          thankYouPageUrl: window.location.origin + '/#/shop',
        },
      });

      const targetUrl = redirectRes?.redirectSession?.fullUrl;
      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        throw new Error('Could not obtain checkout redirection URL');
      }
    } catch (err) {
      console.error('Error creating Wix checkout session:', err);
      alert(`Checkout error: ${err.message || 'Please try again later'}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Helper to find a product by slug or ID
  const getProduct = (slugOrId) => {
    if (!slugOrId || !products.length) return null;
    const clean = decodeURIComponent(slugOrId).toLowerCase().trim();
    return products.find(
      (p) => (p.slug && p.slug.toLowerCase() === clean) || (p._id && p._id.toLowerCase() === clean)
    );
  };

  return (
    <WixContext.Provider
      value={{
        products,
        loading,
        error,
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        isCartLoading,
        checkoutLoading,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        checkout,
        getProduct,
        fetchProducts,
        formatWixImage,
      }}
    >
      {children}
    </WixContext.Provider>
  );
}

export function useWix() {
  const context = useContext(WixContext);
  if (!context) {
    throw new Error('useWix must be used within a WixProvider');
  }
  return context;
}
