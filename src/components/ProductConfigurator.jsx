import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, HelpCircle, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductConfigurator() {
  const { t } = useLanguage();

  // Configurator States
  const [material, setMaterial] = useState('steel');
  const [finish, setFinish] = useState('matteBlack');
  const [mounting, setMounting] = useState('floor');
  const [length, setLength] = useState(10); // in feet
  const [price, setPrice] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Price & Blueprint Draft Transition Logic
  useEffect(() => {
    let costPerFoot = 45; // Steel default
    if (material === 'aluminum') costPerFoot = 65;
    if (material === 'stainless') costPerFoot = 95;

    let finishCostPerFoot = 0;
    if (finish === 'brushedSteel') finishCostPerFoot = 15;
    if (finish === 'bronze') finishCostPerFoot = 25;

    let mountingBaseCost = 120; // Wall Mounted base
    if (mounting === 'floor') mountingBaseCost = 220; // Posts cost
    if (mounting === 'cable') mountingBaseCost = 350; // Cables and tensioners

    const totalCost = (costPerFoot + finishCostPerFoot) * length + mountingBaseCost;
    setPrice(Math.round(totalCost));

    // Trigger blueprint sketch drafting phase on any config option change
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [material, finish, mounting, length]);

  // Load preset from catalog event listener
  useEffect(() => {
    const handlePresetLoad = (e) => {
      const { material: mat, finish: fin, mounting: mount, length: len } = e.detail;
      if (mat) setMaterial(mat);
      if (fin) setFinish(fin);
      if (mount) setMounting(mount);
      if (len) setLength(len);
    };
    window.addEventListener('load-configurator-preset', handlePresetLoad);
    return () => window.removeEventListener('load-configurator-preset', handlePresetLoad);
  }, []);

  // Color Mapping for SVG Rendering
  const getRenderColor = () => {
    if (finish === 'matteBlack') return '#1A1A1A';
    if (finish === 'brushedSteel') return '#A1A8B3';
    if (finish === 'bronze') return '#8C6239';
    return '#1A1A1A';
  };

  // Helper to render dynamically generated SVG elements based on length and mount type
  const renderSVGConfig = () => {
    const color = getRenderColor();
    const width = 360;
    const height = 200;
    
    // Draw the main handrail bar
    const railY = mounting === 'wall' ? 95 : 80;
    const railXStart = 35;
    const railXEnd = 365;

    // Generate posts or brackets based on mounting type and length
    const supports = [];
    let numSupports = 2;
    if (length > 12) numSupports = 3;
    if (length > 22) numSupports = 4;

    const spacing = (railXEnd - railXStart) / (numSupports - 1);

    for (let i = 0; i < numSupports; i++) {
      const x = railXStart + i * spacing;
      supports.push(x);
    }

    // Dynamic gradient IDs for the metal finish
    const activeGradId = `metal-finish-${finish}`;

    return (
      <svg className="config-preview-svg" viewBox="0 0 400 240">
        <defs>
          {/* Dynamic Finish Gradients */}
          <linearGradient id="metal-finish-matteBlack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A2E" />
            <stop offset="50%" stopColor="#1A1A1C" />
            <stop offset="100%" stopColor="#0B0B0C" />
          </linearGradient>
          
          <linearGradient id="metal-finish-brushedSteel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECEFF1" />
            <stop offset="40%" stopColor="#B0BEC5" />
            <stop offset="100%" stopColor="#607D8B" />
          </linearGradient>

          <linearGradient id="metal-finish-bronze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="40%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>

          {/* Shading for post side faces (3D effect) */}
          <linearGradient id="post-side-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
          </linearGradient>
        </defs>

        {/* Dynamic laser scanning sweep line */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.line 
              key="laser-scanner"
              x1="0" y1="0" x2="0" y2="240"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              initial={{ x: 10 }}
              animate={{ x: 390 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ filter: 'drop-shadow(0 0 6px var(--color-accent))', zIndex: 10 }}
            />
          )}
        </AnimatePresence>

        <g className={isTransitioning ? "blueprint-draft-mode" : "high-fi-render-mode"}>
          {/* Dynamic floor/wall line with technical ticks */}
          {mounting === 'floor' || mounting === 'cable' ? (
            <g>
              {/* Concrete/floor base slab in perspective */}
              <polygon points="15,200 385,200 375,212 25,212" fill="rgba(0, 0, 0, 0.02)" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="1" />
              <line x1="15" y1="200" x2="385" y2="200" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1.5" />
            </g>
          ) : (
            // Draw wall layout guidelines
            <g opacity="0.12" stroke="currentColor" strokeWidth="0.5">
              <line x1="15" y1="95" x2="385" y2="95" strokeDasharray="3 3" />
              <line x1="15" y1="140" x2="385" y2="140" strokeDasharray="3 3" />
              <line x1="15" y1="185" x2="385" y2="185" strokeDasharray="3 3" />
            </g>
          )}

          {/* Cable wires if Cable Railing (Runs behind the posts but in front of wall) */}
          {mounting === 'cable' && (
            <g stroke="#90A4AE" strokeWidth="1.2">
              <line x1={railXStart} y1="105" x2={railXEnd} y2="105" />
              <line x1={railXStart} y1="120" x2={railXEnd} y2="120" />
              <line x1={railXStart} y1="135" x2={railXEnd} y2="135" />
              <line x1={railXStart} y1="150" x2={railXEnd} y2="150" />
              <line x1={railXStart} y1="165" x2={railXEnd} y2="165" />
              <line x1={railXStart} y1="180" x2={railXEnd} y2="180" />

              {/* Tensioner nuts on outer support boundaries */}
              <g fill="#CFD8DC" stroke="#37474F" strokeWidth="0.3">
                <rect x={railXStart - 5} y="103.5" width="5" height="3" />
                <rect x={railXStart - 5} y="118.5" width="5" height="3" />
                <rect x={railXStart - 5} y="133.5" width="5" height="3" />
                <rect x={railXStart - 5} y="148.5" width="5" height="3" />
                <rect x={railXStart - 5} y="163.5" width="5" height="3" />
                <rect x={railXStart - 5} y="178.5" width="5" height="3" />

                <rect x={railXEnd} y="103.5" width="5" height="3" />
                <rect x={railXEnd} y="118.5" width="5" height="3" />
                <rect x={railXEnd} y="133.5" width="5" height="3" />
                <rect x={railXEnd} y="148.5" width="5" height="3" />
                <rect x={railXEnd} y="163.5" width="5" height="3" />
                <rect x={railXEnd} y="178.5" width="5" height="3" />
              </g>
            </g>
          )}

          {/* Supports (Posts or Wall Brackets) */}
          {supports.map((x, index) => {
            if (mounting === 'wall') {
              return (
                <g key={index}>
                  {/* 3D Wall Backing Plate */}
                  <circle cx={x} cy="140" r="8" fill={`url(#${activeGradId})`} stroke="#37474F" strokeWidth="0.5" />
                  <circle cx={x} cy="140" r="5" fill="rgba(0,0,0,0.15)" />
                  <circle cx={x} cy="136" r="0.8" fill="#FFF" />
                  <circle cx={x - 3.5} cy="142" r="0.8" fill="#FFF" />
                  <circle cx={x + 3.5} cy="142" r="0.8" fill="#FFF" />
                  
                  {/* 3D Curved Bracket Arm */}
                  <path d={`M ${x},140 C ${x + 8},140 ${x + 12},125 ${x + 12},105`} fill="none" stroke={`url(#${activeGradId})`} strokeWidth="4.5" strokeLinecap="round" />
                  <path d={`M ${x},140 C ${x + 8},140 ${x + 12},125 ${x + 12},105`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
                  
                  {/* Collar bracket interface */}
                  <rect x={x + 8} y="103" width="8" height="2" fill="#212121" />
                </g>
              );
            } else {
              // Floor/cable Posts in 3D square columns
              return (
                <g key={index}>
                  {/* Post Base Flange with perspective bevel */}
                  <polygon points={`${x-12},195 ${x+12},195 ${x+17},189 ${x-7},189`} fill={`url(#${activeGradId})`} stroke="#37474F" strokeWidth="0.5" />
                  <polygon points={`${x-12},195 ${x+12},195 ${x+12},199 ${x-12},199`} fill="rgba(0,0,0,0.8)" stroke="#212121" strokeWidth="0.5" />
                  <polygon points={`${x+12},195 ${x+17},189 ${x+17},193 ${x+12},199`} fill="rgba(0,0,0,0.9)" />
                  {/* Anchor bolts */}
                  <circle cx={x-8} cy="197" r="1.0" fill="#FFF" opacity="0.9" />
                  <circle cx={x+8} cy="197" r="1.0" fill="#FFF" opacity="0.9" />

                  {/* 3D Square Post Column (Front and Side shading) */}
                  {/* Front Face */}
                  <rect x={x - 5} y={railY} width="7" height={195 - railY} fill={`url(#${activeGradId})`} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                  <rect x={x - 4} y={railY} width="1.5" height={195 - railY} fill="rgba(255,255,255,0.3)" />
                  {/* Side Face */}
                  <polygon points={`${x+2},${railY} ${x+5},${railY - 3} ${x+5},${192} ${x+2},${195}`} fill="url(#post-side-grad)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                  
                  {/* Post Cap */}
                  <rect x={x - 6} y={railY - 1} width="9" height="2" fill="#212121" />
                </g>
              );
            }
          })}

          {/* Main Rail (Tubular cylindrical 3D texture) */}
          <line x1={railXStart - 10} y1={railY} x2={railXEnd + 10} y2={railY} stroke="#1A1A1E" strokeWidth="12" strokeLinecap="round" />
          <line x1={railXStart - 10} y1={railY} x2={railXEnd + 10} y2={railY} stroke={`url(#${activeGradId})`} strokeWidth="4.5" strokeLinecap="round" />
          <line x1={railXStart - 10} y1={railY - 1} x2={railXEnd + 10} y2={railY - 1} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Shiny metal end cores */}
          <circle cx={railXStart - 10} cy={railY} r="4.5" fill="#212121" />
          <circle cx={railXEnd + 10} cy={railY} r="4.5" fill="#212121" />

          {/* Technical CAD dimensions guidelines */}
          <g stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.85">
            {/* Length horizontal indicator line */}
            <line x1={railXStart} y1={railY - 22} x2={railXEnd} y2={railY - 22} strokeDasharray="2 2" />
            <path d={`M ${railXStart + 5},${railY - 25} L ${railXStart},${railY - 22} L ${railXStart + 5},${railY - 19}`} fill="none" />
            <path d={`M ${railXEnd - 5},${railY - 25} L ${railXEnd},${railY - 22} L ${railXEnd - 5},${railY - 19}`} fill="none" />
            
            <text x="200" y={railY - 28} fill="var(--color-accent)" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              L: {length} FT ({Math.round(length * 0.3048 * 10) / 10}M)
            </text>

            {/* Height vertical indicator line */}
            <line x1="15" y1={railY} x2="15" y2="200" strokeDasharray="2 2" />
            <path d={`M 12,${railY + 4} L 15,${railY} L 18,${railY + 4}`} fill="none" />
            <path d="M 12,196 L 15,200 L 18,196" fill="none" />
            <text x="7" y={(200 + railY) / 2} fill="var(--color-accent)" fontSize="8" fontFamily="monospace" transform={`rotate(-90, 7, ${(200 + railY) / 2})`} textAnchor="middle">
              H: {mounting === 'wall' ? '36.0"' : '42.0"'}
            </text>
          </g>
        </g>
      </svg>
    );
  };

  return (
    <section className="configurator-section" id="configurator">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="tag-label">
            <FileSpreadsheet className="pulse-glow" size={14} />
            {t('configurator.tag')}
          </span>
          <h2 className="text-gradient">{t('configurator.title')}</h2>
          <p>{t('configurator.desc')}</p>
        </div>

        {/* Configurator Grid */}
        <div className="configurator-grid">
          {/* Controls Box */}
          <div className="config-controls glass-panel">
            {/* 1. Material Selector */}
            <div className="control-group">
              <label className="control-label">{t('configurator.material')}</label>
              <div className="control-options-grid">
                <button 
                  className={`option-btn ${material === 'steel' ? 'active' : ''}`}
                  onClick={() => setMaterial('steel')}
                >
                  {t('configurator.steel')}
                </button>
                <button 
                  className={`option-btn ${material === 'aluminum' ? 'active' : ''}`}
                  onClick={() => setMaterial('aluminum')}
                >
                  {t('configurator.aluminum')}
                </button>
                <button 
                  className={`option-btn ${material === 'stainless' ? 'active' : ''}`}
                  onClick={() => setMaterial('stainless')}
                >
                  {t('configurator.stainless')}
                </button>
              </div>
            </div>

            {/* 2. Finish Color Selector */}
            <div className="control-group">
              <label className="control-label">{t('configurator.finish')}</label>
              <div className="control-options-grid flex-row">
                <button 
                  className={`color-swatch-btn ${finish === 'matteBlack' ? 'active' : ''}`}
                  onClick={() => setFinish('matteBlack')}
                  title={t('configurator.matteBlack')}
                >
                  <span className="swatch-color" style={{ backgroundColor: '#1A1A1A' }}></span>
                  <span className="swatch-label">{t('configurator.matteBlack')}</span>
                </button>
                <button 
                  className={`color-swatch-btn ${finish === 'brushedSteel' ? 'active' : ''}`}
                  onClick={() => setFinish('brushedSteel')}
                  title={t('configurator.brushedSteel')}
                >
                  <span className="swatch-color" style={{ backgroundColor: '#A1A8B3' }}></span>
                  <span className="swatch-label">{t('configurator.brushedSteel')}</span>
                </button>
                <button 
                  className={`color-swatch-btn ${finish === 'bronze' ? 'active' : ''}`}
                  onClick={() => setFinish('bronze')}
                  title={t('configurator.bronze')}
                >
                  <span className="swatch-color" style={{ backgroundColor: '#8C6239' }}></span>
                  <span className="swatch-label">{t('configurator.bronze')}</span>
                </button>
              </div>
            </div>

            {/* 3. Mounting Selector */}
            <div className="control-group">
              <label className="control-label">{t('configurator.mounting')}</label>
              <div className="control-options-grid">
                <button 
                  className={`option-btn ${mounting === 'wall' ? 'active' : ''}`}
                  onClick={() => setMounting('wall')}
                >
                  {t('configurator.wall')}
                </button>
                <button 
                  className={`option-btn ${mounting === 'floor' ? 'active' : ''}`}
                  onClick={() => setMounting('floor')}
                >
                  {t('configurator.floor')}
                </button>
                <button 
                  className={`option-btn ${mounting === 'cable' ? 'active' : ''}`}
                  onClick={() => setMounting('cable')}
                >
                  {t('configurator.cable')}
                </button>
              </div>
            </div>

            {/* 4. Length Slider */}
            <div className="control-group">
              <div className="slider-label-row">
                <label className="control-label">{t('configurator.length')}</label>
                <span className="slider-value-badge">{length} {t('configurator.ft')}</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="30" 
                value={length} 
                onChange={(e) => setLength(parseInt(e.target.value))} 
                className="config-range-slider"
              />
              <div className="slider-limits">
                <span>3 ft</span>
                <span>30 ft</span>
              </div>
            </div>
          </div>

          {/* Real-time Technical Preview */}
          <div className="config-preview glass-panel">
            {/* Technical Border Guides */}
            <div className="schematic-corner tl"></div>
            <div className="schematic-corner tr"></div>
            <div className="schematic-corner bl"></div>
            <div className="schematic-corner br"></div>

            <div className="preview-top-bar">
              <span className="preview-label">LIVE SYSTEM PREVIEW</span>
              <span className="preview-spec">
                {material.toUpperCase()} / {mounting.toUpperCase()} / {length}FT
              </span>
            </div>

            <div className="preview-svg-container">
              {renderSVGConfig()}
            </div>

            <div className="preview-pricing-panel">
              <div className="price-label">
                <span>{t('configurator.priceEst')}</span>
                <h2>${price} <span className="currency-tag">USD</span></h2>
              </div>

              <div className="price-actions">
                <button className="btn-primary buy-btn">
                  <ShoppingCart size={16} />
                  {t('configurator.addToCart')}
                </button>
                <a href="#quote" className="btn-secondary custom-btn">
                  {t('configurator.customRequest')}
                </a>
              </div>
            </div>

            <div className="preview-footer-note">
              <ShieldAlert size={14} className="text-accent" />
              <span>Estimates subject to engineering blueprint verifications.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .configurator-section {
          background-color: var(--color-bg);
        }

        .configurator-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          align-items: stretch;
        }

        .config-controls {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .control-label {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .control-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 10px;
        }

        .control-options-grid.flex-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .option-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          transition: var(--transition-fast);
        }

        .option-btn:hover {
          border-color: var(--color-border-hover);
          color: var(--color-text-primary);
          background: rgba(255,255,255,0.03);
        }

        .option-btn.active {
          background: rgba(255, 90, 9, 0.08);
          border-color: var(--color-accent);
          color: #FFFFFF;
        }

        /* Color Swatches */
        .color-swatch-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.01);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: var(--transition-fast);
        }

        .color-swatch-btn:hover {
          border-color: var(--color-border-hover);
          color: var(--color-text-primary);
          background: rgba(0, 0, 0, 0.02);
        }

        .color-swatch-btn.active {
          border-color: var(--color-accent);
          background: rgba(255, 90, 9, 0.04);
          color: var(--color-text-primary);
        }

        .swatch-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        .swatch-label {
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Slider */
        .slider-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slider-value-badge {
          background: rgba(255, 90, 9, 0.1);
          color: var(--color-accent);
          font-family: monospace;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          border: 1px solid rgba(255, 90, 9, 0.2);
        }

        .config-range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--color-surface-elevated);
          outline: none;
        }

        .config-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: 2px solid #FFFFFF;
          transition: transform 0.1s ease;
        }

        .config-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: monospace;
        }

        /* Preview Panel */
        .config-preview {
          position: relative;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.015);
        }

        .preview-top-bar {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .preview-spec {
          color: var(--color-accent);
        }

        .preview-svg-container {
          background: rgba(0,0,0,0.03);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .config-preview-svg {
          width: 100%;
          max-width: 360px;
          height: auto;
        }

        /* Blueprint Sketch Draft Mode */
        .blueprint-draft-mode path,
        .blueprint-draft-mode rect,
        .blueprint-draft-mode polygon,
        .blueprint-draft-mode circle,
        .blueprint-draft-mode line {
          fill: none !important;
          stroke: #0284C7 !important; /* Blueprint technical blue */
          stroke-width: 1.2px !important;
          stroke-dasharray: 4 2 !important;
          opacity: 0.8 !important;
          transition: all 0.15s ease-out;
        }

        .preview-pricing-panel {
          border-top: 1px solid var(--color-border);
          padding-top: 24px;
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .price-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .price-label span {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .price-label h2 {
          font-size: 2.2rem;
          color: var(--color-text-primary);
        }

        .currency-tag {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .price-actions {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 12px;
        }

        .buy-btn, .custom-btn {
          justify-content: center;
          font-size: 0.8rem;
          padding: 14px 20px;
        }

        .preview-footer-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-top: 16px;
        }

        .schematic-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1.5px solid var(--color-border);
          pointer-events: none;
        }

        .schematic-corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
        .schematic-corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
        .schematic-corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
        .schematic-corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; }

        @media (max-width: 900px) {
          .configurator-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .price-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
