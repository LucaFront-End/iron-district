import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Star, ShieldCheck, Sliders, CheckCircle2 } from 'lucide-react';
import installImage from '../assets/railing_install.png';

export default function BeforeAfterSlider() {
  const { t, language } = useLanguage();

  // E-commerce states
  const [selectedStyle, setSelectedStyle] = useState('brooklyn');
  const [selectedLength, setSelectedLength] = useState('15');

  // Interactive Pricing Logic
  const getPrice = () => {
    if (selectedStyle === 'brooklyn') {
      if (selectedLength === '10') return { price: 895, compare: 1150 };
      if (selectedLength === '15') return { price: 1195, compare: 1500 };
      return { price: 1895, compare: 2400 }; // 25ft
    } else { // manhattan
      if (selectedLength === '10') return { price: 1295, compare: 1650 };
      if (selectedLength === '15') return { price: 1795, compare: 2200 };
      return { price: 2895, compare: 3600 }; // 25ft
    }
  };

  const { price, compare } = getPrice();

  const handleCustomizeClick = () => {
    // Fire event to auto-populate the configurator
    const preset = {
      material: selectedStyle === 'brooklyn' ? 'steel' : 'stainless',
      finish: selectedStyle === 'brooklyn' ? 'matteBlack' : 'brushedSteel',
      mounting: selectedStyle === 'brooklyn' ? 'cable' : 'floor',
      length: parseInt(selectedLength)
    };
    const event = new CustomEvent('load-configurator-preset', { detail: preset });
    window.dispatchEvent(event);
    
    // Scroll up to configurator
    document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyClick = () => {
    // Load config and scroll to quote builder/checkout form
    handleCustomizeClick();
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  const text = {
    en: {
      tag: 'PRE-ENGINEERED KIT',
      title: 'Upgrade Your Guardrail Space',
      desc: 'Order a complete ready-to-assemble premium railing system. Engineered in Los Angeles, shipped nationwide.',
      reviews: '124 verified reviews',
      styleLbl: '1. Select Railing Style',
      lenLbl: '2. Select System Length',
      shipping: 'Free Shipping in continental USA',
      warranty: 'Lifetime structural & rust warranty',
      buyBtn: 'Instant Quote / Order Kit',
      customBtn: 'Customize Specs',
      inclusionsTitle: 'What\'s included in your kit:',
      inc1: 'Precision pre-drilled support posts',
      inc2: 'Heavy-duty top rail mounting flange',
      inc3: 'Marine-grade AISI 316 hardware runs',
      inc4: 'Free alignment drill template & bits'
    },
    es: {
      tag: 'KIT PRE-DISEÑADO',
      title: 'Renueva tu Espacio de Barandal',
      desc: 'Ordena un sistema de barandal completo listo para ensamblar. Diseñado en Los Ángeles, enviado a todo el país.',
      reviews: '124 opiniones verificadas',
      styleLbl: '1. Selecciona el Estilo',
      lenLbl: '2. Selecciona la Longitud',
      shipping: 'Envío gratis en todo el país',
      warranty: 'Garantía estructural y anticorrosiva de por vida',
      buyBtn: 'Cotizar al Instante / Ordenar Kit',
      customBtn: 'Personalizar Medidas',
      inclusionsTitle: 'Qué incluye tu kit de montaje:',
      inc1: 'Postes de soporte pre-perforados de precisión',
      inc2: 'Brida de montaje de pasamanos de alta resistencia',
      inc3: 'Líneas de cables de acero grado marino AISI 316',
      inc4: 'Plantilla de perforación y brocas de cortesía'
    }
  };

  const activeText = text[language] || text['en'];

  return (
    <section className="before-after-section spotlight-section" id="projects">
      <div className="blueprint-grid"></div>

      <div className="container">
        <div className="spotlight-card">
          
          {/* Left Column: Generative Showcase Image */}
          <div className="spotlight-image-wrapper">
            <img 
              src={installImage} 
              alt="Station Metalworks Modern Railing Installation" 
              className="spotlight-main-img" 
            />
            <div className="spotlight-badge">
              <ShieldCheck size={14} style={{ marginRight: '6px' }} />
              <span>{activeText.warranty}</span>
            </div>
            {/* Visual overlay grid corners */}
            <div className="cad-corner tl"></div>
            <div className="cad-corner tr"></div>
            <div className="cad-corner bl"></div>
            <div className="cad-corner br"></div>
          </div>

          {/* Right Column: E-commerce Checkout and details */}
          <div className="spotlight-details-panel">
            <span className="spotlight-tag">{activeText.tag}</span>
            <h2 className="text-gradient">{activeText.title}</h2>
            
            {/* Rating */}
            <div className="spotlight-rating-row">
              <div className="stars-box">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#FF9F0A" stroke="none" />
                ))}
              </div>
              <span className="rating-num">4.9</span>
              <span className="rating-count">({activeText.reviews})</span>
            </div>

            <p className="spotlight-desc">{activeText.desc}</p>

            {/* Selector Options */}
            <div className="spotlight-selectors">
              
              {/* Style selector */}
              <div className="selector-group">
                <label className="selector-label">{activeText.styleLbl}</label>
                <div className="tabs-row">
                  <button 
                    className={`tab-pill ${selectedStyle === 'brooklyn' ? 'active' : ''}`}
                    onClick={() => setSelectedStyle('brooklyn')}
                  >
                    The Brooklyn (Cable)
                  </button>
                  <button 
                    className={`tab-pill ${selectedStyle === 'manhattan' ? 'active' : ''}`}
                    onClick={() => setSelectedStyle('manhattan')}
                  >
                    The Manhattan (Glass)
                  </button>
                </div>
              </div>

              {/* Length selector */}
              <div className="selector-group">
                <label className="selector-label">{activeText.lenLbl}</label>
                <div className="tabs-row">
                  <button 
                    className={`tab-pill ${selectedLength === '10' ? 'active' : ''}`}
                    onClick={() => setSelectedLength('10')}
                  >
                    10 FT
                  </button>
                  <button 
                    className={`tab-pill ${selectedLength === '15' ? 'active' : ''}`}
                    onClick={() => setSelectedLength('15')}
                  >
                    15 FT
                  </button>
                  <button 
                    className={`tab-pill ${selectedLength === '25' ? 'active' : ''}`}
                    onClick={() => setSelectedLength('25')}
                  >
                    25 FT
                  </button>
                </div>
              </div>

            </div>

            {/* Inclusions checklist */}
            <div className="inclusions-checklist-box">
              <h5>{activeText.inclusionsTitle}</h5>
              <div className="inclusions-grid">
                <div className="inclusion-item">
                  <CheckCircle2 size={13} className="text-green" />
                  <span>{activeText.inc1}</span>
                </div>
                <div className="inclusion-item">
                  <CheckCircle2 size={13} className="text-green" />
                  <span>{activeText.inc2}</span>
                </div>
                <div className="inclusion-item">
                  <CheckCircle2 size={13} className="text-green" />
                  <span>{activeText.inc3}</span>
                </div>
                <div className="inclusion-item">
                  <CheckCircle2 size={13} className="text-green" />
                  <span>{activeText.inc4}</span>
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="spotlight-price-area">
              <div className="price-tag-large">
                <span className="price-number">${price}.00</span>
                <span className="price-tag-sub">USD</span>
              </div>
              <div className="price-compare-area">
                <span className="compare-number">${compare}.00</span>
                <span className="savings-badge">Save ${compare - price}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="spotlight-action-row">
              <button 
                onClick={handleBuyClick}
                className="btn btn-primary spotlight-btn purchase"
              >
                <ShoppingCart size={15} style={{ marginRight: '8px' }} />
                {activeText.buyBtn}
              </button>
              <button 
                onClick={handleCustomizeClick}
                className="btn btn-secondary spotlight-btn"
              >
                <Sliders size={15} style={{ marginRight: '8px' }} />
                {activeText.customBtn}
              </button>
            </div>
            
            <div className="spotlight-footer-meta">
              <span>🚀 {activeText.shipping}</span>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        .spotlight-section {
          background-color: var(--color-bg);
          padding-top: 90px;
          padding-bottom: 90px;
          position: relative;
          overflow: hidden;
        }

        .spotlight-card {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          border-radius: 16px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.05);
          max-width: 1100px;
          margin: 0 auto;
          align-items: stretch;
        }

        /* Image Column */
        .spotlight-image-wrapper {
          position: relative;
          background: #0B0E14;
          overflow: hidden;
          min-height: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spotlight-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0.95;
        }

        .spotlight-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(2, 0, 50, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          color: #FFF;
          padding: 7px 14px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          z-index: 10;
        }

        /* Technical Corners Overlay */
        .cad-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 1.5px solid var(--color-accent);
          pointer-events: none;
          z-index: 5;
        }

        .cad-corner.tl { top: 14px; left: 14px; border-right: none; border-bottom: none; }
        .cad-corner.tr { top: 14px; right: 14px; border-left: none; border-bottom: none; }
        .cad-corner.bl { bottom: 14px; left: 14px; border-right: none; border-top: none; }
        .cad-corner.br { bottom: 14px; right: 14px; border-left: none; border-top: none; }

        /* Details Column */
        .spotlight-details-panel {
          background: #FFFFFF;
          padding: 34px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
          border-left: 1px solid var(--color-border);
        }

        .spotlight-tag {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-accent);
          background: rgba(255, 90, 9, 0.08);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
          align-self: flex-start;
        }

        .spotlight-details-panel h2 {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .spotlight-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
        }

        .stars-box {
          display: flex;
          gap: 2px;
        }

        .rating-num {
          font-weight: bold;
          color: var(--color-text-primary);
        }

        .rating-count {
          color: var(--color-text-muted);
        }

        .spotlight-desc {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* Selectors Box */
        .spotlight-selectors {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 10px 0;
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }

        .selector-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .selector-label {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .tabs-row {
          display: flex;
          gap: 10px;
        }

        .tab-pill {
          font-family: monospace;
          font-size: 0.72rem;
          padding: 6px 12px;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .tab-pill.active {
          background-color: var(--color-text-primary);
          color: var(--color-bg);
          border-color: var(--color-text-primary);
        }

        /* Checklist Inclusions */
        .inclusions-checklist-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .inclusions-checklist-box h5 {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--color-text-primary);
          text-transform: uppercase;
        }

        .inclusions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .inclusion-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 0.68rem;
          color: var(--color-text-secondary);
          line-height: 1.3;
        }

        .text-green {
          color: #10B981;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Price Area */
        .spotlight-price-area {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 4px;
        }

        .price-tag-large {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .price-number {
          font-family: monospace;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .price-tag-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .price-compare-area {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .compare-number {
          font-family: monospace;
          font-size: 1rem;
          text-decoration: line-through;
          color: var(--color-text-muted);
        }

        .savings-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
        }

        /* Action buttons row */
        .spotlight-action-row {
          display: flex;
          gap: 12px;
        }

        .spotlight-btn {
          font-size: 0.8rem;
          padding: 12px 18px;
        }

        .spotlight-btn.purchase {
          flex: 1.3;
          background-color: var(--color-accent);
          color: #FFF;
          border: 1px solid var(--color-accent);
        }

        .spotlight-btn.purchase:hover {
          background-color: var(--color-accent-hover);
          box-shadow: 0 0 20px rgba(var(--color-accent-rgb), 0.35);
        }

        .spotlight-btn.flex-1 {
          flex: 1;
        }

        .spotlight-footer-meta {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          text-align: center;
        }

        @media (max-width: 960px) {
          .spotlight-card {
            grid-template-columns: 1fr;
          }
          .spotlight-image-wrapper {
            min-height: 320px;
            aspect-ratio: 16 / 9;
          }
          .spotlight-details-panel {
            padding: 24px;
            border-left: none;
            border-top: 1px solid var(--color-border);
          }
        }
      `}</style>
    </section>
  );
}
