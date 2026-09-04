import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWix } from '../context/WixContext';
import { Menu, X, Globe, Hammer, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ currentView }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount, openCart } = useWix();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: t('nav.shop'), href: '#/shop' },
    { 
      name: t('nav.services'), 
      href: '#/services',
      hasDropdown: true,
      dropdownItems: [
        { name: language === 'en' ? 'Staircase Systems' : 'Sistemas de Escaleras', href: '#/services/stairs' },
        { name: language === 'en' ? 'Railing Systems' : 'Sistemas de Barandales', href: '#/services/railings' },
        { name: language === 'en' ? 'ADA Handrails' : 'Pasamanos ADA', href: '#/services/handrails' },
        { name: language === 'en' ? 'Gates & Fences' : 'Portones y Cercas', href: '#/services/gates' },
        { name: language === 'en' ? 'Custom Fabrication' : 'Fabricación Especializada', href: '#/services/custom' }
      ]
    },
    { name: t('nav.about'), href: '#/about' },
    { name: t('nav.community'), href: '#/community' },
    { name: t('nav.contact'), href: '#/contact' },
  ];

  return (
    <>
      <motion.nav 
        className="glass-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="nav-container">
          <a href={currentView !== 'home' ? '/#' : '#'} className="nav-logo" aria-label="Station Metalworks">
            <img 
              src="/logo.png" 
              alt="Station Metalworks" 
              className="navbar-brand-logo" 
            />
          </a>

          {/* Desktop Nav Items */}
          <div className="nav-links">
            {menuItems.map((item, index) => {
              if (item.hasDropdown) {
                return (
                  <div key={index} className="nav-item-with-dropdown">
                    <a href={item.href} className="nav-link dropdown-trigger">
                      {item.name}
                      <span className="dropdown-arrow">▼</span>
                    </a>
                    <div className="nav-dropdown-menu glass-panel">
                      {item.dropdownItems.map((subItem, sIdx) => (
                        <a key={sIdx} href={subItem.href} className="dropdown-menu-item">
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <a key={index} href={item.href} className="nav-link">
                  {item.name}
                </a>
              );
            })}
          </div>

          <div className="nav-actions">
            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage} 
              className="lang-btn" 
              aria-label="Toggle language"
            >
              <Globe size={16} className="text-steel" />
              <span className="lang-label">{language.toUpperCase()}</span>
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={openCart} 
              className="cart-nav-btn" 
              aria-label="Shopping Cart"
              title={language === 'en' ? 'Shopping Cart' : 'Carrito de Compras'}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </button>

            {/* Quote CTA Button */}
            <a href={currentView !== 'home' ? '/#quote' : '#quote'} className="btn-primary quote-nav-btn">
              {t('nav.quoteBtn')}
            </a>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="mobile-trigger-btn"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="mobile-menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-header">
                <img 
                  src="/logo.png" 
                  alt="Station Metalworks" 
                  className="drawer-brand-logo" 
                />
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="drawer-close"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="drawer-links">
                {menuItems.map((item, index) => {
                  if (item.hasDropdown) {
                    return (
                      <div key={index} className="drawer-dropdown-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a 
                          href={item.href} 
                          className="drawer-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                        <div className="drawer-sublinks">
                          {item.dropdownItems.map((subItem, sIdx) => (
                            <a 
                              key={sIdx} 
                              href={subItem.href} 
                              className="drawer-sublink"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <a 
                      key={index} 
                      href={item.href} 
                      className="drawer-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>

              <div className="drawer-footer">
                <button 
                  onClick={() => { openCart(); setMobileMenuOpen(false); }} 
                  className="drawer-lang-btn"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={18} />
                    <span>{language === 'en' ? 'Cart' : 'Carrito'}</span>
                  </span>
                  {cartCount > 0 && <span className="drawer-cart-badge">{cartCount}</span>}
                </button>

                <button 
                  onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} 
                  className="drawer-lang-btn"
                >
                  <Globe size={18} />
                  <span>{language === 'en' ? 'Español' : 'English'}</span>
                </button>
                
                <a 
                  href={currentView !== 'home' ? '/#quote' : '#quote'} 
                  className="btn-primary drawer-quote-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.quoteBtn')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .glass-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
          z-index: 1000;
          display: flex;
          align-items: center;
        }

        .nav-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 100%;
        }

        .navbar-brand-logo {
          height: 48px;
          width: auto;
          max-width: 250px;
          object-fit: contain;
          transition: transform 0.2s ease;
          display: block;
        }

        .navbar-brand-logo:hover {
          transform: scale(1.03);
        }

        .drawer-brand-logo {
          height: 38px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
          position: relative;
          padding: 8px 0;
        }

        .nav-link:hover {
          color: var(--color-text-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .lang-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          border-color: var(--color-border-hover);
        }

        .lang-label {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--color-text-primary);
        }

        .cart-nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          color: var(--color-text-primary);
          transition: var(--transition-fast);
        }

        .cart-nav-btn:hover {
          background: rgba(224, 0, 39, 0.06);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .nav-cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--color-accent);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 800;
          font-family: monospace;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 5px rgba(224, 0, 39, 0.4);
        }

        .drawer-cart-badge {
          background: var(--color-accent);
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          font-family: monospace;
        }

        .quote-nav-btn {
          padding: 10px 20px;
        }

        .mobile-trigger-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
        }

        /* Mobile Drawer styles */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(8px);
          z-index: 2000;
        }

        .mobile-menu-drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 320px;
          background: var(--color-surface-base);
          border-left: 1px solid var(--color-border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }

        .drawer-close {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
        }

        .drawer-links {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .drawer-link {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .drawer-link:hover {
          color: var(--color-text-primary);
          padding-left: 4px;
        }

        .drawer-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .drawer-lang-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--color-border);
          padding: 12px;
          border-radius: 6px;
          color: var(--color-text-primary);
          cursor: pointer;
          font-family: var(--font-heading);
          font-weight: 600;
        }

        .drawer-quote-btn {
          display: flex;
          justify-content: center;
        }

        .nav-item-with-dropdown {
          position: relative;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dropdown-arrow {
          font-size: 0.55rem;
          color: var(--color-text-muted);
          transition: transform 0.2s ease;
        }

        .nav-item-with-dropdown:hover .dropdown-arrow {
          transform: rotate(180deg);
          color: var(--color-accent);
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          width: 220px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 1010;
        }

        .nav-item-with-dropdown:hover .nav-dropdown-menu {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-menu-item {
          padding: 8px 12px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          border-radius: 4px;
          transition: var(--transition-fast);
          white-space: nowrap;
          text-align: left;
        }

        .dropdown-menu-item:hover {
          background: rgba(255, 90, 9, 0.06);
          color: var(--color-text-primary);
        }

        /* Mobile drawer sublinks */
        .drawer-sublinks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-left: 16px;
          margin-top: 6px;
          margin-bottom: 12px;
          border-left: 1.5px solid var(--color-border);
        }

        .drawer-sublink {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
          text-align: left;
        }

        .drawer-sublink:hover {
          color: var(--color-accent);
        }

        @media (max-width: 768px) {
          .nav-links, .quote-nav-btn {
            display: none;
          }
          .mobile-trigger-btn {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
