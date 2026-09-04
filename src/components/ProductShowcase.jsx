import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWix } from '../context/WixContext';
import { deriveProductCategory } from '../services/wixClient';
import { Flame, Layers, Clock, Sliders, Star, ArrowLeft, ArrowRight, ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';

export default function ProductShowcase() {
  const { t, language } = useLanguage();
  const { products, loading, addToCart, formatWixImage } = useWix();
  const carouselRef = useRef(null);
  const [addingId, setAddingId] = useState(null);

  // Curate featured products from real Wix catalog
  const showcaseProducts = products.length > 0 ? products.slice(0, 8) : [];

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product._id);
    await addToCart(product, {}, 1);
    setAddingId(null);
  };

  return (
    <section className="showcase-section" id="showcase">
      <div className="blueprint-grid"></div>

      <div className="container">
        {/* Showcase Header */}
        <div className="section-header">
          <span className="tag-label">
            <Sliders className="pulse-glow" size={14} />
            {language === 'en' ? 'LIVE FABRICATION CATALOG' : 'CATÁLOGO DE FABRICACIÓN ACTIVO'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Featured Architectural Systems' : 'Sistemas Arquitectónicos Destacados'}
          </h2>
          <p>
            {language === 'en'
              ? 'Engineered stainless steel & matte black architectural handrails available directly from our Wix online store.'
              : 'Pasamanos arquitectónicos en acero inoxidable y negro mate disponibles directamente en nuestra tienda en línea Wix.'}
          </p>
        </div>

        {/* Simplified Factory KPI Metrics Dashboard */}
        <div className="factory-kpi-dashboard">
          <div className="kpi-panel glass-panel">
            <div className="kpi-title">
              <Flame size={12} className="kpi-icon orange" />
              <span>{t('showcase.activeQueue')}</span>
            </div>
            <div className="kpi-value orange">{t('showcase.queueLoad')}</div>
          </div>

          <div className="kpi-panel glass-panel">
            <div className="kpi-title">
              <Layers size={12} className="kpi-icon" />
              <span>{language === 'en' ? 'CATALOG MODELS' : 'MODELOS EN CATÁLOGO'}</span>
            </div>
            <div className="kpi-value">{products.length || 28} {language === 'en' ? 'PRODUCTS' : 'PRODUCTOS'}</div>
          </div>

          <div className="kpi-panel glass-panel">
            <div className="kpi-title">
              <Clock size={12} className="kpi-icon green" />
              <span>{t('showcase.avgTime')}</span>
            </div>
            <div className="kpi-value green">3-5 DAYS</div>
          </div>
        </div>

        {/* REAL PRODUCTS CAROUSEL */}
        <div className="carousel-control-wrapper">
          <button 
            className="carousel-arrow-btn prev" 
            onClick={() => scrollCarousel('left')}
            aria-label="Previous products"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="carousel-scroll-container" ref={carouselRef}>
            {loading && showcaseProducts.length === 0 ? (
              <div className="showcase-loading-box">
                <Loader2 size={32} className="spin-icon text-accent" />
                <span>{language === 'en' ? 'Connecting to Wix Stores...' : 'Conectando con Wix Stores...'}</span>
              </div>
            ) : (
              showcaseProducts.map((product) => {
                const imgUrl = formatWixImage(
                  product.media?.mainMedia?.image?.url || product.media?.items?.[0]?.image?.url
                );
                const category = deriveProductCategory(product);
                const price = product.priceData?.formatted?.price || `$${product.priceData?.price?.toFixed(2) || '0.00'}`;
                const optionsCount = product.productOptions?.[0]?.choices?.length || 0;
                const targetUrl = `#/product/${product.slug || product._id}`;

                return (
                  <div key={product._id} className="catalog-product-card glass-panel">
                    {/* Top Tag Row */}
                    <div className="catalog-card-header">
                      <span className="category-label-tag">{category.toUpperCase()}</span>
                      <span className="live-status-dot">
                        <span className="ping-dot"></span>
                        <span className="status-text">
                          {optionsCount > 0 
                            ? `${optionsCount} ${language === 'en' ? 'Sizes' : 'Medidas'}`
                            : (language === 'en' ? 'In Stock' : 'En Stock')}
                        </span>
                      </span>
                    </div>

                    {/* Real Wix High-Res Product Image */}
                    <a href={targetUrl} className="showcase-img-link">
                      <div className="catalog-card-graphics">
                        <img 
                          src={imgUrl} 
                          alt={product.name} 
                          className="showcase-wix-thumb"
                          loading="lazy" 
                        />
                      </div>
                    </a>

                    {/* Card Body */}
                    <div className="catalog-card-body">
                      <div className="title-price-row">
                        <a href={targetUrl} className="title-link">
                          <h3>{product.name}</h3>
                        </a>
                        <div className="price-tag-badge">
                          <span className="price-val">{price}</span>
                        </div>
                      </div>

                      {/* Single-line rating & review */}
                      <div className="product-rating-row">
                        <Star size={11} fill="#FF9F0A" stroke="none" />
                        <span className="rating-val">4.9</span>
                        <span className="rating-divider">•</span>
                        <span className="reviews-count">
                          {language === 'en' ? 'Factory Tested' : 'Prueba de Fábrica'}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="showcase-card-actions">
                        <a 
                          href={targetUrl}
                          className="btn btn-secondary showcase-btn-configure"
                        >
                          <ExternalLink size={12} />
                          <span>{language === 'en' ? 'Configure' : 'Configurar'}</span>
                        </a>

                        <button 
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={addingId === product._id}
                          className="btn btn-primary showcase-btn-add"
                        >
                          {addingId === product._id ? (
                            <Loader2 size={13} className="spin-icon" />
                          ) : (
                            <ShoppingBag size={13} />
                          )}
                          <span>{language === 'en' ? 'Buy' : 'Comprar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button 
            className="carousel-arrow-btn next" 
            onClick={() => scrollCarousel('right')}
            aria-label="Next products"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="showcase-footer-cta">
          <a href="#/shop" className="btn btn-primary showcase-browse-all-btn">
            <span>{language === 'en' ? 'Explore Full 28-Product Wix Catalog' : 'Ver el Catálogo Completo de 28 Productos'}</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <style>{`
        .showcase-section {
          background-color: var(--color-bg);
          position: relative;
          padding-top: 80px;
          padding-bottom: 90px;
          overflow: hidden;
        }

        /* KPI Dashboard */
        .factory-kpi-dashboard {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 30px;
          margin-bottom: 30px;
          max-width: 800px;
        }

        .kpi-panel {
          padding: 12px 16px;
          border-radius: 6px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .kpi-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .kpi-icon.orange { color: var(--color-accent); }
        .kpi-icon.green { color: #10B981; }

        .kpi-value {
          font-family: monospace;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-text-primary);
        }

        .kpi-value.orange { color: var(--color-accent); }
        .kpi-value.green { color: #10B981; }

        /* Carousel Navigation Wrapper */
        .carousel-control-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .carousel-scroll-container {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          width: 100%;
          padding: 12px 4px;
          scrollbar-width: none;
        }

        .carousel-scroll-container::-webkit-scrollbar {
          display: none;
        }

        /* Arrow Navigation Buttons */
        .carousel-arrow-btn {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.2s ease;
        }

        .carousel-arrow-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: scale(1.05);
        }

        .carousel-arrow-btn.prev {
          left: -20px;
        }

        .carousel-arrow-btn.next {
          right: -20px;
        }

        /* Product Card */
        .catalog-product-card {
          scroll-snap-align: start;
          flex-shrink: 0;
          width: 320px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          user-select: none;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }

        .catalog-product-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
        }

        .catalog-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-label-tag {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .live-status-dot {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: monospace;
          font-size: 0.65rem;
          color: #10B981;
        }

        .ping-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
        }

        .showcase-img-link {
          text-decoration: none;
          display: block;
        }

        .catalog-card-graphics {
          background: #F8FAFC;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 175px;
          border: 1px solid var(--color-border);
          overflow: hidden;
        }

        .showcase-wix-thumb {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .catalog-product-card:hover .showcase-wix-thumb {
          transform: scale(1.05);
        }

        .catalog-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .title-link {
          text-decoration: none;
          color: inherit;
        }

        .title-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .title-price-row h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
        }

        .title-price-row h3:hover {
          color: var(--color-accent);
        }

        .price-tag-badge {
          background: #F1F5F9;
          padding: 2px 8px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .price-val {
          font-family: monospace;
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--color-text-primary);
        }

        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: var(--color-text-secondary);
        }

        .rating-val {
          font-weight: bold;
          color: var(--color-text-primary);
        }

        .rating-divider {
          color: var(--color-text-muted);
          opacity: 0.5;
        }

        .reviews-count {
          color: var(--color-text-muted);
        }

        .showcase-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 6px;
        }

        .showcase-btn-configure {
          flex: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.78rem;
          padding: 8px 12px;
          border-radius: 6px;
          text-decoration: none;
        }

        .showcase-btn-add {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.78rem;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .showcase-loading-box {
          width: 100%;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--color-text-secondary);
          font-family: monospace;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        .showcase-footer-cta {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .showcase-browse-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
        }

        @media (max-width: 992px) {
          .carousel-arrow-btn {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .factory-kpi-dashboard {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
}
