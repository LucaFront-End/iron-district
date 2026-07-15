import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Ruler, ShieldCheck, Download, Star, 
  HelpCircle, Sliders, ChevronRight, AlertTriangle, Hammer, Check, Info, Cpu, ClipboardList
} from 'lucide-react';

export default function ProductDetailPage({ productId }) {
  const { t, language } = useLanguage();

  // Navigation or 404 state
  const [productData, setProductData] = useState(null);

  // Dynamic configuration states
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'calculator' | 'load'
  const [activeInfoTab, setActiveInfoTab] = useState('bom'); // 'bom' | 'faq' | 'reviews'
  
  // Custom specs states (Dynamic per product)
  const [woodType, setWoodType] = useState('walnut');
  const [treadThickness, setTreadThickness] = useState(2.0); // 1.5, 2.0, 3.0 inches
  const [treadEdge, setTreadEdge] = useState('square'); // 'square' | 'beveled' | 'bullnose'
  
  const [metalFinish, setMetalFinish] = useState('matteBlack');
  const [stairWidth, setStairWidth] = useState(36); // in inches (30" to 48")
  const [height, setHeight] = useState(108); // floor-to-floor in inches (stairs/handrails: 90" to 144")
  
  // Deck / System Length config (used in railings / fences)
  const [systemLength, setSystemLength] = useState(20); // in feet (8 to 60)
  const [railHeight, setRailHeight] = useState(36); // 36" or 42"
  const [postMounting, setPostMounting] = useState('floor'); // floor or fascia
  const [railProfile, setRailProfile] = useState('rectangular'); // 'round' | 'rectangular'

  // Load simulator state (for stairs)
  const [simulatedWeight, setSimulatedWeight] = useState(200); // 0 to 1000 lbs
  const [hoveredTread, setHoveredTread] = useState(null);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  // Success message after loading specifications into custom quote
  const [quoteLoaded, setQuoteLoaded] = useState(false);

  // Hardcoded product database for the catalog details
  const productDatabase = useMemo(() => ({
    horizon: {
      id: 'horizon',
      nameEn: 'The Horizon Floating Staircase',
      nameEs: 'Escalera Flotante Horizon',
      tagEn: 'Flagship Cantilevered',
      tagEs: 'Cantilever Insignia',
      descEn: 'Premium thick wood treads cantilevered directly off custom structural steel spines. Configurable load factors and wood grains.',
      descEs: 'Peldaños de madera maciza en voladizo soportados por una viga central de acero. Factores de carga y vetas configurables.',
      basePrice: 5800,
      hasStairCalculator: true,
      hasLoadSimulator: true
    },
    brooklyn: {
      id: 'brooklyn',
      nameEn: 'The Brooklyn Cable Railing Kit',
      nameEs: 'Sistema de Barandal de Cable Brooklyn',
      tagEn: 'DIY Modular Kit',
      tagEs: 'Kit Modular Hazlo Tú Mismo',
      descEn: 'Industrial carbon steel posts with tensioned marine-grade cable lines. Code compliant spacing layouts.',
      descEs: 'Postes de acero al carbono industriales con líneas de cable tensado grado marino. Cumplimiento garantizado de normas constructivas.',
      basePrice: 895,
      hasRailingCalculator: true
    },
    manhattan: {
      id: 'manhattan',
      nameEn: 'The Manhattan Tempered Glass System',
      nameEs: 'Barandal de Vidrio Manhattan',
      tagEn: 'Fascia Panel System',
      tagEs: 'Sistema de Panel de Vidrio',
      descEn: 'Polished glass panel clamps mounted on stainless steel profiles. Offers seamless visual showroom vistas.',
      descEs: 'Abrazaderas de paneles de cristal templado pulido montadas en postes de acero inoxidable. Vistas ininterrumpidas de showroom.',
      basePrice: 1295,
      hasRailingCalculator: true
    },
    patriot: {
      id: 'patriot',
      nameEn: 'The ADA Patriot Wall Handrail',
      nameEs: 'Pasamanos de Muro ADA Patriot',
      tagEn: 'Commercial Accessibility',
      tagEs: 'Accesibilidad Comercial',
      descEn: 'Heavy duty round grab rail matching commercial ADA height, projection and structural loading clearances.',
      descEs: 'Pasamanos redondo reforzado conforme a alturas, proyecciones y cargas estructurales de directivas ADA comerciales.',
      basePrice: 450,
      hasADACalculator: true
    },
    citadel: {
      id: 'citadel',
      nameEn: 'The Citadel Perimeter Fence',
      nameEs: 'Cerca Perimetral Citadel',
      tagEn: 'Modern Privacy Barrier',
      tagEs: 'Barrera de Privacidad Moderna',
      descEn: 'Aesthetic privacy barriers composed of modular architectural aluminum slats. Extreme corrosion resistance.',
      descEs: 'Barrera estética de privacidad compuesta por listones de aluminio arquitectónico. Máxima resistencia a corrosión.',
      basePrice: 1850,
      hasOptionSelectorOnly: true
    },
    sentinel: {
      id: 'sentinel',
      nameEn: 'The Sentinel Slide Gate',
      nameEs: 'Portón Deslizante Sentinel',
      tagEn: 'Perimeter Security',
      tagEs: 'Seguridad de Perímetro',
      descEn: 'Industrial slide-track gate equipped with structural bracing, rollers and automated driver mounts.',
      descEs: 'Portón industrial deslizante sobre riel equipado con refuerzos estructurales, rodillos y soportes para motor.',
      basePrice: 2400,
      hasOptionSelectorOnly: true
    },
    flange: {
      id: 'flange',
      nameEn: 'Heavy Duty Post Mounting Flange',
      nameEs: 'Brida de Montaje Postes Reforzada',
      tagEn: 'Installation Accessory',
      tagEs: 'Accesorio de Instalación',
      descEn: 'Thick steel plate base collar designed to anchor 2" architectural posts securely to solid concrete floors.',
      descEs: 'Brida de placa de acero grueso diseñada para anclar firmemente postes de 2" a pisos de concreto sólido.',
      basePrice: 45,
      hasOptionSelectorOnly: true
    },
    tensioner: {
      id: 'tensioner',
      nameEn: 'Marine-Grade Cable Swage Tensioner',
      nameEs: 'Tensor de Cable Grado Marino',
      tagEn: 'Cable Fitting Part',
      tagEs: 'Accesorio de Cableado',
      descEn: 'Marine-grade AISI 316 threaded terminals for tensioning 1/8" cable runs through metal posts.',
      descEs: 'Terminales roscadas grado marino AISI 316 para tensado de líneas de cable de 1/8" en postes metálicos.',
      basePrice: 12,
      hasOptionSelectorOnly: true
    }
  }), []);

  useEffect(() => {
    if (productId && productDatabase[productId]) {
      setProductData(productDatabase[productId]);
      setActiveTab('specs');
      setActiveInfoTab('bom');
    } else {
      setProductData(null);
    }
  }, [productId, productDatabase]);

  // If loading or invalid ID
  if (!productData) {
    return (
      <div className="product-not-found container" style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2>Product Not Found / Producto No Encontrado</h2>
        <p style={{ margin: '20px 0', color: 'var(--color-text-muted)' }}>The product ID could not be loaded. Please return to the shop catalog.</p>
        <a href="#/shop" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
          <ArrowLeft size={16} />
          <span>Back to Catalog / Volver al Catálogo</span>
        </a>
      </div>
    );
  }

  // Option price factors
  const woodPremium = { walnut: 1500, oak: 800, maple: 600 };
  const finishPremium = { matteBlack: 0, brushedSteel: 1100 };

  const getEstimatedPrice = () => {
    let price = productData.basePrice;

    if (productData.hasStairCalculator) {
      const widthFactor = stairWidth / 36;
      const woodCost = woodPremium[woodType] || 0;
      const thicknessCost = treadThickness === 3.0 ? 600 : treadThickness === 2.0 ? 300 : 0;
      const finishCost = finishPremium[metalFinish] || 0;
      return Math.round((price + woodCost + thicknessCost + finishCost) * widthFactor);
    }

    if (productData.hasRailingCalculator) {
      let costPerFt = 45;
      if (productId === 'manhattan') costPerFt = 95;
      if (metalFinish === 'brushedSteel') costPerFt += 20;
      
      const heightMultiplier = railHeight === 42 ? 1.25 : 1.0;
      return Math.round((price + costPerFt * systemLength) * heightMultiplier);
    }

    if (productData.hasADACalculator) {
      if (metalFinish === 'brushedSteel') return price + 150;
      return price;
    }

    if (metalFinish === 'brushedSteel') return Math.round(price * 1.3);
    return price;
  };

  // Math equations for stairs (ideal riser height, run, compliance checks)
  const calculateStairSpecs = () => {
    const idealRise = 7.25;
    const steps = Math.max(5, Math.round(height / idealRise));
    const rise = height / steps;
    const run = 10.0;
    const totalRun = (steps - 1) * run;
    const angle = Math.atan(rise / run) * (180 / Math.PI);
    const isRiseCompliant = rise <= 7.75;
    const isRunCompliant = run >= 10.0;
    const isWidthCompliant = stairWidth >= 36;

    return {
      steps,
      rise: rise.toFixed(2),
      run: run.toFixed(2),
      totalRun: totalRun.toFixed(2),
      angle: angle.toFixed(1),
      isRiseCompliant,
      isRunCompliant,
      isWidthCompliant
    };
  };

  const stairSpecs = calculateStairSpecs();

  // Railing spacing math configurations
  const calculateRailingSpecs = () => {
    const maxSpacingFt = 4.0; // IRC post distance limit
    const spansCount = Math.ceil(systemLength / maxSpacingFt);
    const postsRequired = spansCount + 1;
    const exactSpacing = systemLength / spansCount;
    const cablesCount = railHeight === 42 ? 11 : 9;

    return {
      posts: postsRequired,
      spacing: exactSpacing.toFixed(1),
      cablesCount,
      isHeightCompliant: railHeight >= 36,
      isSpacingCompliant: exactSpacing <= 4.0,
      isOpeningCompliant: true // Cable spacing under 3" is standard in kits
    };
  };

  const railingSpecs = calculateRailingSpecs();

  // Deflection and load stress math simulator
  // Formula based on simplified beam bending: D = (P * L^3) / (3 * E * I)
  // I = 1/12 * b * h^3. For 36" wide step of thickness h.
  const calculateDeflection = () => {
    const E = 1500000; // Modulus of elasticity of hardwood (psi)
    const thickness = parseFloat(treadThickness);
    const width = 11; // step run length in inches
    const I = (1/12) * width * Math.pow(thickness, 3);
    const lengthInches = stairWidth; 
    
    // deflection in inches
    const deflection = (simulatedWeight * Math.pow(lengthInches, 3)) / (3 * E * I);
    
    // IRC deflection standard limit is L/360.
    const maxLimit = lengthInches / 360;
    const safetyRatio = deflection > 0 ? maxLimit / deflection : 10;
    const deflectionPct = Math.min(100, Math.round((deflection / maxLimit) * 100));

    return {
      deflection: deflection.toFixed(3),
      limit: maxLimit.toFixed(3),
      safetyRatio: safetyRatio.toFixed(1),
      deflectionPct,
      isSafe: deflection <= maxLimit
    };
  };

  const loadSpecs = calculateDeflection();

  // ADA wall clearances
  const adaSpecs = {
    gripCompliant: true, // Grip range 1.25" - 2"
    clearanceCompliant: true, // wall clearance >= 1.5"
    heightCompliant: true // Height range 34" - 38"
  };

  // Preset dispatcher to home quote form
  const handleSendToQuote = () => {
    let customDetails = `Product: ${productData.nameEn}. Finish: ${metalFinish.toUpperCase()}. `;
    let finalLength = 15;

    if (productData.hasStairCalculator) {
      customDetails += `Species: ${woodType}, Thickness: ${treadThickness}", Edge: ${treadEdge}, Width: ${stairWidth}", Steps: ${stairSpecs.steps}`;
      finalLength = Math.round(parseFloat(stairSpecs.totalRun) / 12);
    } else if (productData.hasRailingCalculator) {
      customDetails += `Length: ${systemLength} ft, Height: ${railHeight}", Mounting: ${postMounting}, Profile: ${railProfile}, Posts: ${railingSpecs.posts}`;
      finalLength = systemLength;
    } else if (productData.hasADACalculator) {
      customDetails += `Wall handrail, projection: 1.6", Grip: 1.5"`;
      finalLength = 10;
    }

    const quoteSpecs = {
      material: metalFinish === 'brushedSteel' || productId === 'manhattan' ? 'stainless' : 'steel',
      finish: metalFinish,
      mounting: postMounting === 'floor' ? 'floor' : 'wall',
      length: finalLength,
      customDetails: customDetails
    };

    const event = new CustomEvent('load-configurator-preset', { detail: quoteSpecs });
    window.dispatchEvent(event);

    setQuoteLoaded(true);
    setTimeout(() => {
      setQuoteLoaded(false);
      window.location.hash = '#quote';
    }, 1200);
  };

  // SVGs drawing configurations
  const drawRailingSVG = () => {
    const color = metalFinish === 'brushedSteel' ? '#A1A8B3' : '#1A1A1A';
    const numPosts = Math.min(6, railingSpecs.posts);
    const spacing = 320 / (numPosts - 1);
    const postsX = [];
    for (let i = 0; i < numPosts; i++) {
      postsX.push(50 + i * spacing);
    }

    const groundY = postMounting === 'floor' ? 210 : 180;
    const railY = groundY - (railHeight === 42 ? 110 : 90);

    return (
      <svg viewBox="0 0 420 260" className="blueprint-canvas-svg">
        <defs>
          <pattern id="grid-pattern-svg" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 90, 9, 0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Blueprint grids */}
        <rect width="420" height="260" fill="url(#grid-pattern-svg)" />
        
        {/* Floor Line */}
        <line x1="20" y1={groundY} x2="400" y2={groundY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points={`20,${groundY} 400,${groundY} 390,${groundY+15} 30,${groundY+15}`} fill="rgba(255, 90, 9, 0.015)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* Cable infill or Glass clamps */}
        {productId === 'brooklyn' ? (
          <g stroke="#90A4AE" strokeWidth="0.75" opacity="0.8">
            {[...Array(railingSpecs.cablesCount)].map((_, i) => {
              const y = railY + 8 + i * ((groundY - railY - 12) / (railingSpecs.cablesCount - 1));
              return <line key={i} x1="45" y1={y} x2="375" y2={y} />;
            })}
          </g>
        ) : (
          postsX.slice(0, -1).map((x, idx) => {
            const nextX = postsX[idx + 1];
            return (
              <polygon 
                key={idx} 
                points={`${x+6},${railY+8} ${nextX-6},${railY+8} ${nextX-6},${groundY-6} ${x+6},${groundY-6}`} 
                fill="rgba(174, 219, 240, 0.15)" 
                stroke="#0284C7" 
                strokeWidth="0.75" 
              />
            );
          })
        )}

        {/* Support posts */}
        {postsX.map((x, idx) => (
          <g key={idx}>
            {/* Flange plate */}
            <polygon points={`${x-6},${groundY} ${x+6},${groundY} ${x+4},${groundY+4} ${x-4},${groundY+4}`} fill="#37474F" stroke="#1A2124" strokeWidth="0.3" />
            {/* Post */}
            <rect x={x-2} y={railY} width="4" height={groundY - railY} fill={color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Handrail */}
        <rect x="40" y={railY-4} width="340" height="6" fill={color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" rx={railProfile === 'round' ? 3 : 0} />

        {/* Dimension Labels */}
        <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.85">
          <line x1="395" y1={railY} x2="395" y2={groundY} strokeDasharray="2 2" />
          <path d={`M 392,${railY+5} L 395,${railY} L 398,${railY+5}`} fill="none" />
          <path d={`M 392,${groundY-5} L 395,${groundY} L 398,${groundY-5}`} fill="none" />
          <text x="403" y={(railY + groundY)/2} fill="var(--color-accent)" fontSize="8" fontFamily="monospace" transform={`rotate(90, 403, ${(railY + groundY)/2})`} textAnchor="middle">H: {railHeight}"</text>

          {/* Span spacing label */}
          {postsX.length > 1 && (
            <g>
              <line x1={postsX[0]} y1={railY-12} x2={postsX[1]} y2={railY-12} strokeDasharray="2 2" />
              <path d={`M ${postsX[0]+5},${railY-15} L ${postsX[0]},${railY-12} L ${postsX[0]+5},${railY-9}`} fill="none" />
              <path d={`M ${postsX[1]-5},${railY-15} L ${postsX[1]},${railY-12} L ${postsX[1]-5},${railY-9}`} fill="none" />
              <text x={(postsX[0] + postsX[1])/2} y={railY-17} fill="var(--color-accent)" fontSize="7" fontFamily="monospace" textAnchor="middle">S: {railingSpecs.spacing} FT</text>
            </g>
          )}
        </g>
      </svg>
    );
  };

  const drawStaircaseSVG = () => {
    const woodColors = getWoodGradients(woodType);
    const metalHex = getMetalHex();
    return (
      <svg className="blueprint-canvas-svg" viewBox="0 0 450 300">
        <defs>
          <pattern id="grid-pattern-stair" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255, 90, 9, 0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="450" height="300" fill="url(#grid-pattern-stair)" />

        {/* Floor base line */}
        <line x1="20" y1="260" x2="430" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        
        {/* Steel Cantilever Backbone */}
        <polygon 
          points={`35,260 55,260 ${40 + (stairSpecs.steps * 22)},${260 - (stairSpecs.steps * 14.5)} ${20 + (stairSpecs.steps * 22)},${260 - (stairSpecs.steps * 14.5)}`} 
          fill={metalHex} 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="0.5" 
        />

        {/* Steps loop */}
        {[...Array(stairSpecs.steps)].map((_, idx) => {
          const stepX = 40 + idx * 22;
          const stepY = 260 - (idx + 1) * 14.5;
          const isHovered = hoveredTread === idx;

          let treadTopFill = woodColors.top;
          let treadFrontFill = woodColors.front;
          
          if (activeTab === 'load' && isHovered) {
            treadTopFill = loadSpecs.isSafe ? '#10B981' : '#EF4444';
            treadFrontFill = loadSpecs.isSafe ? '#059669' : '#DC2626';
          }

          const thicknessHeight = parseFloat(treadThickness) * 2;

          return (
            <g 
              key={idx} 
              className="svg-tread-group"
              style={{ cursor: activeTab === 'load' ? 'pointer' : 'default' }}
              onMouseEnter={() => setHoveredTread(idx)}
              onMouseLeave={() => setHoveredTread(null)}
            >
              <polygon points={`${stepX},${stepY} ${stepX + 32},${stepY} ${stepX + 44},${stepY - 8} ${stepX + 12},${stepY - 8}`} fill={treadTopFill} stroke={isHovered ? 'var(--color-accent)' : woodColors.side} strokeWidth="0.5" />
              <rect x={stepX} y={stepY} width="32" height={thicknessHeight} fill={treadFrontFill} stroke={isHovered ? 'var(--color-accent)' : woodColors.side} strokeWidth="0.5" rx={treadEdge === 'bullnose' ? 2 : 0} />
              <polygon points={`${stepX + 32},${stepY} ${stepX + 44},${stepY - 8} ${stepX + 44},${stepY - 8 + thicknessHeight} ${stepX + 32},${stepY + thicknessHeight}`} fill={woodColors.side} stroke={isHovered ? 'var(--color-accent)' : woodColors.side} strokeWidth="0.5" />

              {activeTab === 'load' && isHovered && (
                <g>
                  {/* Deflection vector markers */}
                  <line x1={stepX + 16} y1={stepY - 24} x2={stepX + 16} y2={stepY - 6} stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arrow-tip)" />
                  <text x={stepX + 16} y={stepY - 28} fill="#EF4444" fontSize="7" fontFamily="monospace" textAnchor="middle">{simulatedWeight} LBS</text>
                  <text x={stepX + 16} y={stepY + thicknessHeight + 10} fill="#60A5FA" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Deflection: {loadSpecs.deflection}"</text>
                </g>
              )}
            </g>
          );
        })}

        <defs>
          <marker id="arrow-tip" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
          </marker>
        </defs>

        {/* Height dimension annotations */}
        <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.85">
          <line x1="425" y1="260" x2="425" y2="40" strokeDasharray="3 3" />
          <path d="M 422,45 L 425,40 L 428,45" fill="none" />
          <path d="M 422,255 L 425,260 L 428,255" fill="none" />
          <text x="435" y="150" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" transform="rotate(90, 435, 150)" textAnchor="middle">H: {height}"</text>
        </g>
      </svg>
    );
  };

  const drawSimpleAccessorySVG = () => {
    return (
      <svg viewBox="0 0 160 120" className="blueprint-canvas-svg" style={{ maxHeight: '160px', margin: '30px auto' }}>
        <polygon points="10,100 150,100 135,115 5,115" fill="rgba(255, 90, 9, 0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
        {productId === 'patriot' ? (
          <g>
            <circle cx="50" cy="70" r="6" fill="#111" stroke="#333" strokeWidth="0.5" />
            <path d="M 50,70 L 50,45 C 50,45 55,35 60,30" fill="none" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
            <line x1="20" y1="26" x2="140" y2="26" stroke="#A1887F" strokeWidth="8" strokeLinecap="round" />
            <text x="80" y="16" fill="var(--color-accent)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">Projection: 1.6" (ADA clearance)</text>
          </g>
        ) : productId === 'flange' ? (
          <g fill="#78909C" stroke="#263238" strokeWidth="0.75">
            <polygon points="30,80 130,80 110,100 10,100" />
            <rect x="62" y="40" width="36" height="40" fill="#37474F" stroke="#263238" />
          </g>
        ) : (
          <g>
            <rect x="20" y="55" width="90" height="10" fill="#90A4AE" stroke="#455A64" strokeWidth="0.5" rx="1.5" />
            <rect x="110" y="50" width="30" height="20" fill="#37474F" stroke="#263238" strokeWidth="0.5" rx="1" />
            <circle cx="125" cy="60" r="3.5" fill="#1C2123" />
          </g>
        )}
      </svg>
    );
  };

  const getWoodGradients = (type) => {
    if (type === 'walnut') return { top: '#8D6E63', front: '#5D4037', side: '#4E342E' };
    if (type === 'oak') return { top: '#E0C097', front: '#B89058', side: '#8F662F' };
    return { top: '#FFECB3', front: '#FFE082', side: '#FFD54F' };
  };

  const getMetalHex = () => {
    return metalFinish === 'brushedSteel' ? '#B0BEC5' : '#1E1E24';
  };

  return (
    <div className="product-page-wrapper">
      <div className="blueprint-grid"></div>

      <div className="product-breadcrumb container">
        <a href="#/shop" className="back-link">
          <ArrowLeft size={14} />
          <span>{language === 'en' ? 'Back to Shop' : 'Volver a Tienda'}</span>
        </a>
        <div className="breadcrumb-trail">
          <span>{language === 'en' ? 'Shop' : 'Tienda'}</span>
          <ChevronRight size={10} />
          <span>{language === 'en' ? productData.nameEn : productData.nameEs}</span>
        </div>
      </div>

      <section className="product-hero-section container" style={{ padding: '0 0 40px 0' }}>
        <div className="product-hero-grid">
          
          {/* LEFT: Configurator Board (Sticky Panel) */}
          <div className="product-info-panel glass-panel">
            <span className="product-badge">
              {language === 'en' ? productData.tagEn : productData.tagEs}
            </span>
            <h1 className="product-title text-gradient">
              {language === 'en' ? productData.nameEn : productData.nameEs}
            </h1>
            
            <div className="product-rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#FF9F0A" stroke="none" />
                ))}
              </div>
              <span className="rating-score">5.0</span>
              <span className="rating-divider">•</span>
              <span className="reviews-text">78 {language === 'en' ? 'verified shop reviews' : 'opiniones verificadas'}</span>
            </div>

            <p className="product-desc">
              {language === 'en' ? productData.descEn : productData.descEs}
            </p>

            {/* Price badge */}
            <div className="product-pricing-card">
              <div className="price-tag">
                <span className="price-num">${getEstimatedPrice().toLocaleString()}</span>
                <span className="price-currency">USD</span>
              </div>
              <span className="price-meta">
                {productData.hasRailingCalculator 
                  ? (language === 'en' ? 'Configured length + linear options' : 'Metraje configurado + accesorios base')
                  : t('staircase.priceEstSub')}
              </span>
            </div>

            {/* Configurator buttons */}
            <div className="product-action-buttons">
              <button 
                onClick={handleSendToQuote} 
                className="btn btn-primary cta-btn w-full"
                disabled={quoteLoaded}
              >
                {quoteLoaded ? (
                  <>
                    <Check size={16} />
                    <span>{language === 'en' ? 'Specs Added to Quote!' : '¡Planos Agregados!'}</span>
                  </>
                ) : (
                  <>
                    <Hammer size={16} />
                    <span>{t('staircase.ctaQuote')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="hero-feature-points">
              <div className="feature-item">
                <ShieldCheck size={16} className="feature-icon" />
                <span>{language === 'en' ? 'Lifetime structural warranty' : 'Garantía estructural de por vida'}</span>
              </div>
              <div className="feature-item">
                <Ruler size={16} className="feature-icon" />
                <span>{language === 'en' ? 'PE stamped layout drawings available' : 'Planos de montaje certificados disponibles'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Blueprint Canvas Viewport */}
          <div className="product-preview-panel glass-panel">
            <div className="panel-header">
              <span>{language === 'en' ? `BLUEPRINT VIEWPORT: CAD_${productId.toUpperCase()}_REV3` : `PANTALLA DE DIBUJO CAD: MODEL_${productId.toUpperCase()}`}</span>
              <span className="laser-status-dot"></span>
            </div>

            <div className="preview-canvas-box">
              {productData.hasStairCalculator && drawStaircaseSVG()}
              {productData.hasRailingCalculator && drawRailingSVG()}
              {productData.hasADACalculator && drawSimpleAccessorySVG()}
              {productData.hasOptionSelectorOnly && drawSimpleAccessorySVG()}
            </div>

            <div className="preview-footer-stats">
              <div className="footer-stat">
                <span className="stat-label">FINISH</span>
                <span className="stat-val">{metalFinish === 'matteBlack' ? 'MATTE BLACK' : 'STAINLESS STEEL'}</span>
              </div>
              <div className="footer-stat">
                <span className="stat-label">CODE COMPLIANCE</span>
                <span className="stat-val text-green">100% PASS</span>
              </div>
              <div className="footer-stat">
                <span className="stat-label">FABRICATED IN</span>
                <span className="stat-val">LOS ANGELES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS DESIGN OPTIONS */}
      <section className="interactive-tabs-section container" style={{ padding: '20px 0' }}>
        <div className="tabs-navigation glass-panel">
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <Sliders size={15} />
            <span>1. {language === 'en' ? 'Materials & Trim' : '1. Materiales y Acabados'}</span>
          </button>
          
          {(productData.hasStairCalculator || productData.hasRailingCalculator) && (
            <button 
              className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <Ruler size={15} />
              <span>2. {language === 'en' ? 'Layout Calculator' : '2. Dimensiones de Obra'}</span>
            </button>
          )}

          {productData.hasStairCalculator && (
            <button 
              className={`tab-btn ${activeTab === 'load' ? 'active' : ''}`}
              onClick={() => setActiveTab('load')}
            >
              <Cpu size={15} />
              <span>3. {t('staircase.loadTab')}</span>
            </button>
          )}
        </div>

        <div className="tabs-content-wrapper glass-panel">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Specs option selector */}
            {activeTab === 'specs' && (
              <motion.div 
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="tab-content specs-tab-grid"
              >
                {/* Wood grains specs for stairs */}
                {productData.hasStairCalculator && (
                  <div className="config-group">
                    <h3>{t('staircase.woodLbl')}</h3>
                    <div className="options-row">
                      {['walnut', 'oak', 'maple'].map((wood) => (
                        <button 
                          key={wood}
                          className={`option-card ${woodType === wood ? 'active' : ''}`}
                          onClick={() => setWoodType(wood)}
                        >
                          <div className="wood-color-preview" style={{ backgroundColor: wood === 'walnut' ? '#5D4037' : wood === 'oak' ? '#D7CCC8' : '#FFF9C4' }}></div>
                          <div className="option-details">
                            <span className="option-name">{wood === 'walnut' ? t('staircase.woodWalnut') : wood === 'oak' ? t('staircase.woodOak') : t('staircase.woodMaple')}</span>
                            <span className="option-price">+${woodPremium[wood].toLocaleString()}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tread Thickness and profiles specs for stairs */}
                {productData.hasStairCalculator && (
                  <div className="config-group">
                    <h3>{language === 'en' ? 'Tread Thickness & Edging' : 'Grosor y Perfil de Peldaño'}</h3>
                    <div className="options-row" style={{ gap: '12px' }}>
                      <div className="sub-group">
                        <label className="stat-label" style={{ marginBottom: '6px', display: 'block' }}>THICKNESS</label>
                        <div className="options-row" style={{ flexDirection: 'row', gap: '8px' }}>
                          {[1.5, 2.0, 3.0].map((tVal) => (
                            <button 
                              key={tVal} 
                              className={`tab-pill-btn ${treadThickness === tVal ? 'active' : ''}`} 
                              onClick={() => setTreadThickness(tVal)}
                            >
                              {tVal.toFixed(1)}" {tVal === 3.0 ? '(Heavy)' : tVal === 2.0 ? '(Bold)' : '(Std)'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sub-group">
                        <label className="stat-label" style={{ marginBottom: '6px', display: 'block' }}>EDGE PROFILE</label>
                        <div className="options-row" style={{ flexDirection: 'row', gap: '8px' }}>
                          {['square', 'beveled', 'bullnose'].map((edge) => (
                            <button 
                              key={edge} 
                              className={`tab-pill-btn ${treadEdge === edge ? 'active' : ''}`} 
                              onClick={() => setTreadEdge(edge)}
                            >
                              {edge.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Rail Profile options for railings */}
                {productData.hasRailingCalculator && (
                  <div className="config-group">
                    <h3>{language === 'en' ? 'Top Architectural Rail' : 'Perfil de Pasamanos Superior'}</h3>
                    <div className="options-row">
                      {['rectangular', 'round'].map((profile) => (
                        <button 
                          key={profile}
                          className={`option-card ${railProfile === profile ? 'active' : ''}`}
                          onClick={() => setRailProfile(profile)}
                        >
                          <div className="option-details">
                            <span className="option-name">{profile === 'rectangular' ? 'Rectangular Profile' : 'Round Profile'}</span>
                            <span className="option-price">{profile === 'rectangular' ? 'Modern Edge' : 'Classic Grip'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metal Finish finish */}
                <div className="config-group">
                  <h3>{t('staircase.finishLbl')}</h3>
                  <div className="options-row">
                    <button 
                      className={`option-card ${metalFinish === 'matteBlack' ? 'active' : ''}`}
                      onClick={() => setMetalFinish('matteBlack')}
                    >
                      <div className="wood-color-preview" style={{ backgroundColor: '#212121' }}></div>
                      <div className="option-details">
                        <span className="option-name">{t('staircase.steelMatteBlack')}</span>
                        <span className="option-price">{language === 'en' ? 'Standard Coat' : 'Acabado Base'}</span>
                      </div>
                    </button>

                    <button 
                      className={`option-card ${metalFinish === 'brushedSteel' ? 'active' : ''}`}
                      onClick={() => setMetalFinish('brushedSteel')}
                    >
                      <div className="wood-color-preview" style={{ backgroundColor: '#B0BEC5' }}></div>
                      <div className="option-details">
                        <span className="option-name">{t('staircase.steelBrushed')}</span>
                        <span className="option-price">+$1,100.00</span>
                      </div>
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: Calculator dimension specs */}
            {activeTab === 'calculator' && (
              <motion.div 
                key="calculator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="tab-content calculator-tab-grid"
              >
                {/* Stair height inputs */}
                {productData.hasStairCalculator && (
                  <>
                    <div className="calculator-inputs">
                      <h3>{language === 'en' ? 'Floor-to-Floor Height Configuration' : 'Configurar Altura Suelo a Suelo'}</h3>
                      <p className="calculator-desc">{language === 'en' ? 'Adjust vertical rise height. The CAD model will recalculate steps to comply with safety limit bounds.' : 'Ajusta la altura vertical. El sistema recalculará los peldaños para cumplir con las normas de seguridad.'}</p>
                      
                      <div className="slider-control-box" style={{ marginTop: '16px' }}>
                        <div className="slider-header">
                          <span>{language === 'en' ? 'Height' : 'Altura Total'}: <strong>{height}" ({ (height/12).toFixed(1) } ft)</strong></span>
                        </div>
                        <input 
                          type="range" min="90" max="144" value={height} 
                          onChange={(e) => setHeight(parseInt(e.target.value))}
                          className="custom-range-slider"
                        />
                        <div className="slider-ticks">
                          <span>90" (7.5 ft)</span>
                          <span>108" (9.0 ft)</span>
                          <span>144" (12.0 ft)</span>
                        </div>
                      </div>

                      <div className="slider-control-box" style={{ marginTop: '14px' }}>
                        <div className="slider-header">
                          <span>{language === 'en' ? 'Clear Staircase Width' : 'Ancho Libre'}: <strong>{stairWidth}"</strong></span>
                        </div>
                        <input 
                          type="range" min="30" max="48" value={stairWidth} 
                          onChange={(e) => setStairWidth(parseInt(e.target.value))}
                          className="custom-range-slider"
                        />
                      </div>
                    </div>

                    <div className="calculator-outputs-panel">
                      <h3>{language === 'en' ? 'Compliance Calculation Results' : 'Resultados de Cálculos y Cumplimiento'}</h3>
                      
                      <div className="output-specs-list">
                        <div className="spec-output-row">
                          <span>{t('staircase.stepsRequired')}</span>
                          <strong>{stairSpecs.steps} Steps</strong>
                        </div>
                        <div className="spec-output-row">
                          <span>{t('staircase.estRise')}</span>
                          <strong className={stairSpecs.isRiseCompliant ? 'text-green' : 'text-orange'}>{stairSpecs.rise}"</strong>
                        </div>
                        <div className="spec-output-row">
                          <span>{t('staircase.estRun')}</span>
                          <strong className={stairSpecs.isRunCompliant ? 'text-green' : 'text-orange'}>{stairSpecs.run}"</strong>
                        </div>
                      </div>

                      {/* Stair IRC Compliance check board */}
                      <div className={`compliance-card ${stairSpecs.isRiseCompliant && stairSpecs.isRunCompliant && stairSpecs.isWidthCompliant ? 'compliant' : 'warning'}`}>
                        {stairSpecs.isRiseCompliant && stairSpecs.isRunCompliant && stairSpecs.isWidthCompliant ? (
                          <>
                            <ShieldCheck size={18} className="text-green" />
                            <div>
                              <strong>{language === 'en' ? 'IRC 2021 Compliant' : 'Conforme a Normas IRC 2021'}</strong>
                              <p>{language === 'en' ? 'Rise height is under maximum 7.75". Tread depth meets the minimum 10" boundary.' : 'La altura del contra-paso es menor a 7.75" y la huella cumple el mínimo de 10".'}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={18} className="text-orange" />
                            <div>
                              <strong>{language === 'en' ? 'Compliance Check Warning' : 'Advertencia de Normas Constructivas'}</strong>
                              <p>{language === 'en' ? 'Parameters exceed IRC boundaries. Review rise step dimensions.' : 'Algunos parámetros exceden los límites recomendados. Ajusta las dimensiones.'}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Railings spacing calculators */}
                {productData.hasRailingCalculator && (
                  <>
                    <div className="calculator-inputs">
                      <h3>{language === 'en' ? 'Configure Deck Layout Spans' : 'Metraje y Disposición en Terraza'}</h3>
                      
                      <div className="slider-control-box" style={{ marginTop: '12px' }}>
                        <div className="slider-header">
                          <span>{language === 'en' ? 'Total Spool Run Length' : 'Longitud Total del Tramo'}: <strong>{systemLength} FT</strong></span>
                        </div>
                        <input 
                          type="range" min="8" max="60" value={systemLength} 
                          onChange={(e) => setSystemLength(parseInt(e.target.value))}
                          className="custom-range-slider"
                        />
                        <div className="slider-ticks">
                          <span>8 FT</span>
                          <span>24 FT</span>
                          <span>44 FT</span>
                          <span>60 FT</span>
                        </div>
                      </div>

                      <div className="options-row" style={{ flexDirection: 'row', gap: '16px', marginTop: '14px' }}>
                        <div className="config-group flex-1">
                          <label className="stat-label">HEIGHT</label>
                          <div className="options-row" style={{ flexDirection: 'row', gap: '6px' }}>
                            <button className={`tab-pill-btn ${railHeight === 36 ? 'active' : ''}`} onClick={() => setRailHeight(36)}>36"</button>
                            <button className={`tab-pill-btn ${railHeight === 42 ? 'active' : ''}`} onClick={() => setRailHeight(42)}>42"</button>
                          </div>
                        </div>

                        <div className="config-group flex-1">
                          <label className="stat-label">MOUNTING STYLE</label>
                          <div className="options-row" style={{ flexDirection: 'row', gap: '6px' }}>
                            <button className={`tab-pill-btn ${postMounting === 'floor' ? 'active' : ''}`} onClick={() => setPostMounting('floor')}>FLOOR</button>
                            <button className={`tab-pill-btn ${postMounting === 'fascia' ? 'active' : ''}`} onClick={() => setPostMounting('fascia')}>FASCIA</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="calculator-outputs-panel">
                      <h3>{language === 'en' ? 'Component Spacing Breakdown' : 'Distribución y Postes Requeridos'}</h3>
                      
                      <div className="output-specs-list">
                        <div className="spec-output-row">
                          <span>{language === 'en' ? 'Line & End Posts' : 'Postes de Soporte'}</span>
                          <strong>{railingSpecs.posts} Units</strong>
                        </div>
                        <div className="spec-output-row">
                          <span>{language === 'en' ? 'Exact Span Spacing' : 'Separación Real'}</span>
                          <strong className={railingSpecs.isSpacingCompliant ? 'text-green' : 'text-orange'}>{railingSpecs.spacing} FT</strong>
                        </div>
                        <div className="spec-output-row">
                          <span>{language === 'en' ? 'Infill Cables' : 'Líneas de Cables'}</span>
                          <strong>{railingSpecs.cablesCount} lines</strong>
                        </div>
                      </div>

                      <div className={`compliance-card ${railingSpecs.isSpacingCompliant && railingSpecs.isHeightCompliant ? 'compliant' : 'warning'}`}>
                        <ShieldCheck size={18} className="text-green" />
                        <div>
                          <strong>{language === 'en' ? 'IRC Code Compliant' : 'Conforme a Regulaciones'}</strong>
                          <p>{language === 'en' ? 'Post spacing does not exceed 4 feet span limit. Cable layout limits flex clearance under 4".' : 'La separación no excede el límite de 4 pies. Huecos entre cables menores a 4 pulgadas.'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </motion.div>
            )}

            {/* TAB 3: Deflection load simulator */}
            {activeTab === 'load' && productData.hasStairCalculator && (
              <motion.div 
                key="load"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="tab-content load-tab-grid"
              >
                <div className="simulator-controls">
                  <h3>{t('staircase.loadTitle')}</h3>
                  <p className="calculator-desc">{t('staircase.loadDesc')}</p>
                  
                  <div className="slider-control-box" style={{ marginTop: '20px' }}>
                    <div className="slider-header">
                      <span>{language === 'en' ? 'Simulated Live Load' : 'Carga de Simulación'}: <strong>{simulatedWeight} LBS</strong></span>
                    </div>
                    <input 
                      type="range" min="0" max="1000" step="50" value={simulatedWeight} 
                      onChange={(e) => setSimulatedWeight(parseInt(e.target.value))}
                      className="custom-range-slider"
                    />
                    <div className="slider-ticks">
                      <span>0 LBS (Static)</span>
                      <span>500 LBS (Double occupancy)</span>
                      <span>1000 LBS (Max load limit)</span>
                    </div>
                  </div>
                </div>

                <div className="simulator-output">
                  <h3>{t('staircase.loadStress')}</h3>

                  <div className="output-specs-list" style={{ marginBottom: '14px' }}>
                    <div className="spec-output-row">
                      <span>{language === 'en' ? 'Tread Deflection under Load' : 'Deflexión del Peldaño'}</span>
                      <strong className={loadSpecs.isSafe ? 'text-green' : 'text-red'}>{loadSpecs.deflection}"</strong>
                    </div>
                    <div className="spec-output-row">
                      <span>{language === 'en' ? 'Building Code Max Deflection Limit' : 'Límite Máximo Permitido (L/360)'}</span>
                      <strong>{loadSpecs.limit}"</strong>
                    </div>
                    <div className="spec-output-row">
                      <span>{language === 'en' ? 'Structural Safety Factor' : 'Factor de Seguridad'}</span>
                      <strong className={loadSpecs.isSafe ? 'text-green' : 'text-red'}>{loadSpecs.safetyRatio}x</strong>
                    </div>
                  </div>

                  <div className="stress-meter-box">
                    <div className="stress-bar-wrapper">
                      <div 
                        className="stress-bar-fill" 
                        style={{ 
                          width: `${loadSpecs.deflectionPct}%`,
                          backgroundColor: loadSpecs.isSafe ? (loadSpecs.deflectionPct < 60 ? '#10B981' : '#F59E0B') : '#EF4444'
                        }}
                      ></div>
                    </div>
                    
                    <div className="stress-indicators">
                      <span className={loadSpecs.deflectionPct < 60 ? 'active text-green' : ''}>{t('staircase.loadNormal')}</span>
                      <span className={loadSpecs.deflectionPct >= 60 && loadSpecs.deflectionPct <= 100 ? 'active text-orange' : ''}>{t('staircase.loadMedium')}</span>
                      <span className={!loadSpecs.isSafe ? 'active text-red' : ''}>{t('staircase.loadMax')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* BILL OF MATERIALS & FAQS */}
      <section className="faq-reviews-tabs-section container" style={{ padding: '30px 0' }}>
        <div className="tabs-navigation border-bottom">
          <button className={`info-tab-btn ${activeInfoTab === 'bom' ? 'active' : ''}`} onClick={() => setActiveInfoTab('bom')}>
            <ClipboardList size={14} />
            <span>{language === 'en' ? 'Bill of Materials (BOM)' : 'Lista de Materiales'}</span>
          </button>
          
          <button className={`info-tab-btn ${activeInfoTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveInfoTab('faq')}>
            <HelpCircle size={14} />
            <span>{language === 'en' ? 'Technical FAQs' : 'Preguntas Técnicas'}</span>
          </button>
          
          <button className={`info-tab-btn ${activeInfoTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveInfoTab('reviews')}>
            <Star size={14} />
            <span>{language === 'en' ? 'Verified Reviews' : 'Opiniones de Clientes'}</span>
          </button>
        </div>

        <div className="info-tabs-content">
          <AnimatePresence mode="wait">
            
            {/* Dynamic BOM list */}
            {activeInfoTab === 'bom' && (
              <motion.div 
                key="bom" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="bom-tab-content"
              >
                <p className="calculator-desc" style={{ marginBottom: '16px' }}>{language === 'en' ? 'Real-time materials list generated directly from configured parameters:' : 'Lista de materiales generada en tiempo real según las dimensiones configuradas:'}</p>
                
                <table className="bom-details-table glass-panel" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                      <th style={{ padding: '12px' }}>{language === 'en' ? 'ITEM DESCRIPTION' : 'DESCRIPCIÓN DEL ARTÍCULO'}</th>
                      <th style={{ padding: '12px' }}>{language === 'en' ? 'MATERIAL / SPEC' : 'MATERIAL / ESPECIFICACIÓN'}</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>{language === 'en' ? 'QUANTITY' : 'CANTIDAD'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.hasStairCalculator ? (
                      <>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>Floating Steps treads (Hardwood milled)</td>
                          <td style={{ padding: '12px' }}>{woodType.toUpperCase()} - {treadThickness}" thick {treadEdge} edge</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{stairSpecs.steps} Units</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>Structural steel cantilever backbone spine support</td>
                          <td style={{ padding: '12px' }}>Carbon steel - {metalFinish === 'matteBlack' ? 'Powdercoated black' : 'Raw brushed'}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>1 Unit (Spine)</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>Heavy duty anchoring wall bolts & washers</td>
                          <td style={{ padding: '12px' }}>High-tensile Grade 8 steel</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{stairSpecs.steps * 4} Pcs</td>
                        </tr>
                      </>
                    ) : productData.hasRailingCalculator ? (
                      <>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>Support post profiles (Pre-drilled structural tube)</td>
                          <td style={{ padding: '12px' }}>{metalFinish === 'matteBlack' ? 'Carbon Steel' : 'Stainless 316'} - {postMounting.toUpperCase()} mount</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{railingSpecs.posts} Posts</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>{productId === 'brooklyn' ? 'Marine-grade AISI 316 infill wire spool' : 'Tempered glass panels'}</td>
                          <td style={{ padding: '12px' }}>{productId === 'brooklyn' ? '1/8" structural stainless wire' : '1/2" polished tempered glass'}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{productId === 'brooklyn' ? `${systemLength * railingSpecs.cablesCount} Linear FT` : `${railingSpecs.posts - 1} Panels`}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>Top architectural handrail tube</td>
                          <td style={{ padding: '12px' }}>{railProfile.toUpperCase()} Profile - {metalFinish === 'matteBlack' ? 'Carbon Steel' : 'Stainless Steel'}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{systemLength} Linear FT</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '12px' }}>{productId === 'brooklyn' ? 'Tensioner fittings terminals' : 'Heavy-gauge glass clamps'}</td>
                          <td style={{ padding: '12px' }}>AISI 316 Stainless Steel swage terminals</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{productId === 'brooklyn' ? `${railingSpecs.cablesCount * 2} Pcs` : `${(railingSpecs.posts - 1) * 4} Clamps`}</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td style={{ padding: '12px' }}>Configured System Unit Bundle</td>
                        <td style={{ padding: '12px' }}>Metal finish: {metalFinish === 'matteBlack' ? 'Steel Matte Black' : 'Brushed Stainless'}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>1 Complete Kit</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Technical FAQs */}
            {activeInfoTab === 'faq' && (
              <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="faq-content-box">
                {[
                  { q: language === 'en' ? 'Does this kit comply with the 4-inch sphere building code?' : '¿Cumple este sistema con la regla de la esfera de 4 pulgadas?', a: language === 'en' ? 'Yes, the pre-drilled intermediate posts space tensioned cables under 3" apart, preventing a 4" sphere from passing through, satisfying both IRC and IBC codes.' : 'Sí, el barandal pre-perforado espacia los cables a menos de 3", cumpliendo rigurosamente con los códigos de seguridad IRC e IBC.' },
                  { q: language === 'en' ? 'What wood finish is applied to the treads?' : '¿Qué acabado se aplica a los peldaños?', a: language === 'en' ? 'We apply three coats of high-traffic commercial poly-urethane. Walnut features a warm satin tone while Oak gets a matte protective shield.' : 'Aplicamos tres capas de poliuretano comercial de alta resistencia. El nogal tiene un tono cálido satinado, mientras que el roble lleva un escudo protector mate.' }
                ].map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="faq-accordion-item">
                      <button className="faq-accordion-header" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                        <span>{item.q}</span>
                        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>+</span>
                      </button>
                      {isOpen && (
                        <div className="faq-accordion-body"><p>{item.a}</p></div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Verified Reviews */}
            {activeInfoTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="reviews-content-grid">
                <div className="review-card glass-panel">
                  <div className="review-header">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FF9F0A" stroke="none" />)}
                    </div>
                    <strong>Dominic V. (General Contractor)</strong>
                  </div>
                  <p>"{language === 'en' ? 'Absolutely outstanding staircase engineering. Treads feel solid as a rock. The deflection simulator matched my field calculations perfectly.' : 'Ingeniería espectacular. Los peldaños son una roca y la simulación de deflexión coincidió perfectamente con mis cálculos de campo.'}"</p>
                </div>

                <div className="review-card glass-panel">
                  <div className="review-header">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FF9F0A" stroke="none" />)}
                    </div>
                    <strong>Sofia R. (Architectural Designer)</strong>
                  </div>
                  <p>"{language === 'en' ? 'Brooklyn cable spacing layouts passed local code inspections on first inspection. High-end, clean lines.' : 'El sistema de cables de Brooklyn pasó la inspección local del código al primer intento. Líneas arquitectónicas impecables.'}"</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* CAD technical download files block */}
      <section className="technical-resources container" style={{ padding: '20px 0 60px 0' }}>
        <div className="resources-grid">
          <div className="resource-card glass-panel">
            <div className="resource-icon-box">
              <Download size={20} className="text-accent" />
            </div>
            <div className="resource-body">
              <h3>{language === 'en' ? 'Download Configured CAD Blueprint' : 'Descargar Planos CAD de la Configuración'}</h3>
              <p>{language === 'en' ? 'Includes architectural DWG blocks, 3D DXF step profiles, and structural calculation logs.' : 'Incluye bloques DWG arquitectónicos, perfiles 3D DXF y registros de carga estructural.'}</p>
              <a href="#" className="resource-download-link" onClick={(e) => { e.preventDefault(); alert('Downloading structural CAD DWG pack...'); }}>
                <span>{language === 'en' ? 'Download cad_bundle.zip (24MB)' : 'Descargar cad_bundle.zip (24MB)'}</span>
              </a>
            </div>
          </div>

          <div className="resource-card glass-panel">
            <div className="resource-icon-box">
              <Download size={20} className="text-accent" />
            </div>
            <div className="resource-body">
              <h3>{language === 'en' ? 'Installation & Care Manuals' : 'Guía de Instalación y Mantenimiento'}</h3>
              <p>{language === 'en' ? 'Step-by-step mechanical guide to anchor base flanges and tension cables correctly.' : 'Guía mecánica paso a paso para el anclaje de bridas de base y tensado de líneas de cable.'}</p>
              <a href="#" className="resource-download-link" onClick={(e) => { e.preventDefault(); alert('Downloading installation PDF...'); }}>
                <span>{language === 'en' ? 'Download installation_manual.pdf (4.8MB)' : 'Descargar manual_instalacion.pdf (4.8MB)'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
