import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Lock, ShieldCheck, RefreshCw } from 'lucide-react';
import { useWix } from '../context/WixContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer() {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    isCartOpen, 
    closeCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    checkout, 
    checkoutLoading,
    isCartLoading,
    formatWixImage 
  } = useWix();
  const { language } = useLanguage();

  const lineItems = cart?.lineItems || [];

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={closeCart}>
          <motion.div
            className="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <div className="cart-header-title">
                <ShoppingBag size={20} className="text-accent" />
                <h3>{language === 'en' ? 'Shopping Cart' : 'Carrito de Compras'}</h3>
                <span className="cart-badge-count">{cartCount}</span>
              </div>
              <button onClick={closeCart} className="cart-close-btn" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="cart-items-container">
              {lineItems.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="empty-icon-circle">
                    <ShoppingBag size={40} className="text-muted" />
                  </div>
                  <h4>{language === 'en' ? 'Your cart is empty' : 'Tu carrito está vacío'}</h4>
                  <p>
                    {language === 'en'
                      ? 'Explore our architectural handrails and fabrication accessories to get started.'
                      : 'Explora nuestros pasamanos arquitectónicos y herrajes para comenzar.'}
                  </p>
                  <a href="#/shop" onClick={closeCart} className="btn btn-primary" style={{ marginTop: '16px' }}>
                    {language === 'en' ? 'Browse Catalog' : 'Ver Catálogo'}
                  </a>
                </div>
              ) : (
                <div className="cart-items-list">
                  {lineItems.map((item) => {
                    const imgUrl = formatWixImage(item.image);
                    const title = item.productName?.translated || item.productName?.original || 'Item';
                    const price = item.price?.formattedAmount || item.price?.formattedConvertedAmount || `$${item.price?.amount || 0}`;

                    return (
                      <div key={item._id} className="cart-item-card">
                        <div className="cart-item-img-box">
                          <img src={imgUrl} alt={title} className="cart-item-img" />
                        </div>

                        <div className="cart-item-info">
                          <div className="cart-item-top">
                            <h4 className="cart-item-title">{title}</h4>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="cart-item-remove-btn"
                              title={language === 'en' ? 'Remove item' : 'Eliminar artículo'}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Options description lines (e.g. Handrail Length: 3 ft, Finish: Matte Black) */}
                          {item.descriptionLines && item.descriptionLines.length > 0 && (
                            <div className="cart-item-options">
                              {item.descriptionLines.map((line, idx) => {
                                const rawName = line.name?.translated || line.name?.original || '';
                                const cleanName = rawName.replace(/:+$/, '');
                                const cleanVal = line.plainText?.translated || line.plainText?.original || '';
                                return (
                                  <span key={idx} className="cart-opt-pill">
                                    <strong>{cleanName}:</strong> {cleanVal}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          <div className="cart-item-bottom">
                            <div className="quantity-controls">
                              <button
                                onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                                className="qty-btn"
                                disabled={isCartLoading}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="qty-val">{item.quantity}</span>
                              <button
                                onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                                className="qty-btn"
                                disabled={isCartLoading}
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="cart-item-price">
                              <span>{price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Subtotal & Checkout */}
            {lineItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-subtotal-row">
                  <span className="subtotal-label">{language === 'en' ? 'Subtotal' : 'Subtotal'}</span>
                  <span className="subtotal-val">{cartSubtotal}</span>
                </div>
                <p className="cart-tax-notice">
                  {language === 'en'
                    ? 'Taxes and shipping calculated at checkout'
                    : 'Impuestos y envío calculados al finalizar la compra'}
                </p>

                <button
                  onClick={checkout}
                  className="btn btn-primary checkout-btn"
                  disabled={checkoutLoading || isCartLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>{language === 'en' ? 'Preparing Wix Checkout...' : 'Preparando Pago Wix...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>{language === 'en' ? 'Proceed to Checkout' : 'Proceder al Pago Seguro'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="cart-security-badge">
                  <ShieldCheck size={14} className="text-accent" />
                  <span>
                    {language === 'en'
                      ? 'Official Wix Stores SSL 256-Bit Encrypted Checkout'
                      : 'Pago Seguro y Encriptado SSL Oficial de Wix Stores'}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <style>{`
        .cart-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.45);
          backdrop-filter: blur(6px);
          z-index: 3000;
          display: flex;
          justify-content: flex-end;
        }

        .cart-drawer-panel {
          width: 100%;
          max-width: 440px;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
          position: relative;
        }

        .cart-drawer-header {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          background: #FAFAFB;
        }

        .cart-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cart-header-title h3 {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .cart-badge-count {
          background: var(--color-accent);
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          font-family: monospace;
        }

        .cart-close-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-close-btn:hover {
          color: var(--color-text-primary);
          background: rgba(0, 0, 0, 0.05);
        }

        .cart-items-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
        }

        .cart-empty-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #F1F3F5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .cart-empty-state h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 8px;
        }

        .cart-empty-state p {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          max-width: 280px;
          line-height: 1.5;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item-card {
          display: flex;
          gap: 14px;
          padding: 14px;
          background: #FAFAFC;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          transition: border-color 0.2s;
        }

        .cart-item-card:hover {
          border-color: #CBD5E1;
        }

        .cart-item-img-box {
          width: 74px;
          height: 74px;
          border-radius: 6px;
          background: #FFF;
          border: 1px solid var(--color-border);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .cart-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .cart-item-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin: 0;
        }

        .cart-item-remove-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 2px;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .cart-item-remove-btn:hover {
          color: var(--color-accent);
        }

        .cart-item-options {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin: 6px 0;
        }

        .cart-opt-pill {
          font-family: monospace;
          font-size: 0.65rem;
          background: #EDF2F7;
          color: #4A5568;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .cart-item-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: #FFF;
          overflow: hidden;
        }

        .qty-btn {
          background: transparent;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .qty-btn:hover:not(:disabled) {
          background: #F1F5F9;
          color: var(--color-text-primary);
        }

        .qty-val {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0 6px;
          color: var(--color-text-primary);
        }

        .cart-item-price {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-text-primary);
        }

        .cart-drawer-footer {
          padding: 20px 24px;
          background: #FAFAFB;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cart-subtotal-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .subtotal-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .subtotal-val {
          font-family: monospace;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .cart-tax-notice {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        .checkout-btn {
          width: 100%;
          padding: 14px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cart-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          font-family: monospace;
          text-align: center;
        }
      `}</style>
    </AnimatePresence>
  );
}
