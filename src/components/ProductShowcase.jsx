import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Flame, Layers, Clock, Sliders, Star, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProductShowcase() {
  const { t } = useLanguage();
  const carouselRef = useRef(null);

  const signatureModels = [
    {
      id: 'brooklyn',
      name: 'The Brooklyn Industrial',
      category: 'CABLE SYSTEM',
      price: 65,
      rating: 4.9,
      reviews: 84,
      status: 'In Production',
      statusColor: '#FF5A09',
      config: {
        material: 'steel',
        finish: 'matteBlack',
        mounting: 'cable',
        length: 12
      },
      draw: (color) => (
        <svg viewBox="0 0 160 120" className="showcase-svg">
          {/* Concrete Base */}
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          {/* 3D Posts */}
          <rect x="40" y="30" width="4" height="70" fill={color} stroke="#111" strokeWidth="0.5" />
          <rect x="110" y="30" width="4" height="70" fill={color} stroke="#111" strokeWidth="0.5" />
          {/* Handrail */}
          <line x1="20" y1="30" x2="140" y2="30" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="29.5" x2="140" y2="29.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
          {/* Cable wires */}
          <g stroke="#90A4AE" strokeWidth="0.6" opacity="0.7">
            <line x1="42" y1="42" x2="110" y2="42" />
            <line x1="42" y1="54" x2="110" y2="54" />
            <line x1="42" y1="66" x2="110" y2="66" />
            <line x1="42" y1="78" x2="110" y2="78" />
            <line x1="42" y1="90" x2="110" y2="90" />
          </g>
        </svg>
      )
    },
    {
      id: 'manhattan',
      name: 'The Manhattan Sleek',
      category: 'GLASS PANEL',
      price: 95,
      rating: 4.8,
      reviews: 42,
      status: 'QC Passing',
      statusColor: '#10B981',
      config: {
        material: 'stainless',
        finish: 'brushedSteel',
        mounting: 'floor',
        length: 10
      },
      draw: (color) => (
        <svg viewBox="0 0 160 120" className="showcase-svg">
          {/* Concrete Base */}
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          {/* Glass panel */}
          <polygon points="45,35 105,35 105,95 45,95" fill="rgba(174, 219, 240, 0.2)" stroke="#0284C7" strokeWidth="0.5" />
          <polygon points="50,40 100,40 70,90 50,90" fill="rgba(255,255,255,0.3)" stroke="none" />
          {/* Posts */}
          <rect x="40" y="30" width="4" height="70" fill="url(#steel-grad-show)" stroke="#263238" strokeWidth="0.5" />
          <rect x="110" y="30" width="4" height="70" fill="url(#steel-grad-show)" stroke="#263238" strokeWidth="0.5" />
          {/* Handrail */}
          <line x1="20" y1="30" x2="140" y2="30" stroke="url(#steel-grad-show)" strokeWidth="5" strokeLinecap="round" />
          <defs>
            <linearGradient id="steel-grad-show" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ECEFF1" />
              <stop offset="50%" stopColor="#B0BEC5" />
              <stop offset="100%" stopColor="#607D8B" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'chicago',
      name: 'The Chicago Classic',
      category: 'VERTICAL BALUSTER',
      price: 55,
      rating: 4.7,
      reviews: 31,
      status: 'In Coating',
      statusColor: '#D4AF37',
      config: {
        material: 'steel',
        finish: 'bronze',
        mounting: 'floor',
        length: 15
      },
      draw: (color) => (
        <svg viewBox="0 0 160 120" className="showcase-svg">
          {/* Concrete Base */}
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          {/* Vertical Balusters */}
          <g stroke="url(#bronze-grad-show)" strokeWidth="0.75" opacity="0.8">
            <line x1="50" y1="30" x2="50" y2="100" />
            <line x1="60" y1="30" x2="60" y2="100" />
            <line x1="70" y1="30" x2="70" y2="100" />
            <line x1="80" y1="30" x2="80" y2="100" />
            <line x1="90" y1="30" x2="90" y2="100" />
            <line x1="100" y1="30" x2="100" y2="100" />
          </g>
          {/* Main Posts */}
          <rect x="40" y="30" width="4" height="70" fill="url(#bronze-grad-show)" stroke="#3E2723" strokeWidth="0.5" />
          <rect x="110" y="30" width="4" height="70" fill="url(#bronze-grad-show)" stroke="#3E2723" strokeWidth="0.5" />
          {/* Handrail */}
          <line x1="20" y1="30" x2="140" y2="30" stroke="url(#bronze-grad-show)" strokeWidth="5" strokeLinecap="round" />
          <defs>
            <linearGradient id="bronze-grad-show" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8D6E63" />
              <stop offset="50%" stopColor="#5D4037" />
              <stop offset="100%" stopColor="#3E2723" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'aspen',
      name: 'The Aspen Modern',
      category: 'WALL HANDRAIL',
      price: 45,
      rating: 4.9,
      reviews: 53,
      status: 'Milling Timber',
      statusColor: '#8C6239',
      config: {
        material: 'steel',
        finish: 'matteBlack',
        mounting: 'wall',
        length: 8
      },
      draw: (color) => (
        <svg viewBox="0 0 160 120" className="showcase-svg">
          {/* Wall plate brackets */}
          <circle cx="50" cy="70" r="4" fill="#212121" stroke="#333" strokeWidth="0.5" />
          <path d="M 50,70 L 50,55 C 50,55 53,50 56,42" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
          
          <circle cx="110" cy="70" r="4" fill="#212121" stroke="#333" strokeWidth="0.5" />
          <path d="M 110,70 L 110,55 C 110,55 113,50 116,42" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" />

          {/* Wooden Round Handrail */}
          <line x1="20" y1="40" x2="140" y2="40" stroke="url(#walnut-grad-show)" strokeWidth="7" strokeLinecap="round" />
          <defs>
            <linearGradient id="walnut-grad-show" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A1887F" />
              <stop offset="40%" stopColor="#6D4C41" />
              <stop offset="100%" stopColor="#4E342E" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  const scrollCarousel = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLoadInConfigurator = (config) => {
    const event = new CustomEvent('load-configurator-preset', { detail: config });
    window.dispatchEvent(event);
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="showcase-section" id="showcase">
      <div className="blueprint-grid"></div>

      <div className="container">
        {/* Showcase Header */}
        <div className="section-header">
          <span className="tag-label">
            <Sliders className="pulse-glow" size={14} />
            {t('showcase.tag')}
          </span>
          <h2 className="text-gradient">{t('showcase.title')}</h2>
          <p>{t('showcase.desc')}</p>
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
              <span>{t('showcase.batchesCount')}</span>
            </div>
            <div className="kpi-value">14 BATCHES</div>
          </div>

          <div className="kpi-panel glass-panel">
            <div className="kpi-title">
              <Clock size={12} className="kpi-icon green" />
              <span>{t('showcase.avgTime')}</span>
            </div>
            <div className="kpi-value green">5.2 DAYS</div>
          </div>
        </div>

        {/* MINIMALIST E-COMMERCE SLIDER */}
        <div className="carousel-control-wrapper">
          <button className="carousel-arrow-btn prev" onClick={() => scrollCarousel('left')}>
            <ArrowLeft size={16} />
          </button>

          <div className="carousel-scroll-container" ref={carouselRef}>
            {signatureModels.map((product) => {
              return (
                <div key={product.id} className="catalog-product-card glass-panel">
                  {/* Clean Top Tag Row */}
                  <div className="catalog-card-header">
                    <span className="category-label-tag">{product.category}</span>
                    <span className="live-status-dot">
                      <span className="ping-dot" style={{ backgroundColor: product.statusColor }}></span>
                      <span className="status-text">{product.status}</span>
                    </span>
                  </div>

                  {/* High-Fi Schematic Graphic */}
                  <div className="catalog-card-graphics">
                    {product.draw('#1A1A1D')}
                  </div>

                  {/* Simplified Card Body */}
                  <div className="catalog-card-body">
                    <div className="title-price-row">
                      <h3>{product.name}</h3>
                      <div className="price-tag-badge">
                        <span className="price-val">${product.price}</span>
                        <span className="price-unit">/ft</span>
                      </div>
                    </div>

                    {/* Single-line rating & review */}
                    <div className="product-rating-row">
                      <Star size={11} fill="#FF9F0A" stroke="none" />
                      <span className="rating-val">{product.rating}</span>
                      <span className="rating-divider">•</span>
                      <span className="reviews-count">{product.reviews} reviews</span>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => handleLoadInConfigurator(product.config)}
                      className="btn btn-primary catalog-btn w-full"
                    >
                      <Sliders size={13} style={{ marginRight: '6px' }} />
                      {t('showcase.loadBtn')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-arrow-btn next" onClick={() => scrollCarousel('right')}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .showcase-section {
          background-color: var(--color-bg);
          position: relative;
          padding-top: 80px;
          padding-bottom: 100px;
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
          background: var(--color-surface-base);
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
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          width: 100%;
          padding: 10px 5px;
          scrollbar-width: none;
        }

        .carousel-scroll-container::-webkit-scrollbar {
          display: none;
        }

        /* Arrow Navigation Buttons */
        .carousel-arrow-btn {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: border-color 0.2s, background-color 0.2s, transform 0.1s;
        }

        .carousel-arrow-btn:hover {
          border-color: var(--color-accent);
          background-color: var(--color-surface-elevated);
        }

        .carousel-arrow-btn:active {
          transform: scale(0.94);
        }

        .carousel-arrow-btn.prev {
          left: -19px;
        }

        .carousel-arrow-btn.next {
          right: -19px;
        }

        /* Minimalist E-Commerce Card */
        .catalog-product-card {
          scroll-snap-align: start;
          flex-shrink: 0;
          width: 310px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          user-select: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .catalog-product-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(var(--color-accent-rgb), 0.05);
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
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .live-status-dot {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.6rem;
          color: var(--color-text-secondary);
        }

        .ping-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          display: inline-block;
        }

        .catalog-card-graphics {
          background: rgba(0,0,0,0.01);
          border-radius: 6px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 125px;
          border: 1px solid var(--color-border);
        }

        .showcase-svg {
          width: 100%;
          height: 100%;
        }

        /* Simplified Card Body */
        .catalog-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .title-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .title-price-row h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .price-tag-badge {
          display: flex;
          align-items: baseline;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--color-border);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .price-val {
          font-family: monospace;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-text-primary);
        }

        .price-unit {
          font-size: 0.6rem;
          color: var(--color-text-muted);
        }

        /* Ratings block */
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

        .catalog-btn {
          font-size: 0.78rem;
          padding: 8px 16px;
          border-radius: 4px;
          margin-top: 4px;
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
