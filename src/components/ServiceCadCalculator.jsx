import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, Check, Send, 
  Settings2, User, Ruler, Sparkles, MessageSquare, Phone, 
  MapPin, Mail, Layers, Cpu, Compass, CheckCircle2,
  RefreshCw, Info, ChevronRight, FileText
} from 'lucide-react';

export default function ServiceCadCalculator({ serviceId = 'gates', data = {} }) {
  const { language } = useLanguage();
  const isEs = language === 'es';

  // Multistep state: 1 (Client data), 2 (Dimensions & technical config), 3 (Calculation result & submission)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [folioCode, setFolioCode] = useState(() => 'SM-CALC-' + Math.floor(1000 + Math.random() * 9000));

  // Step 1: Client Data
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'North Hollywood, CA'
  });

  // Step 2: Technical Specifications & Measurements
  // Gates
  const [gateWidth, setGateWidth] = useState(12); // ft (6 to 28)
  const [gateHeight, setGateHeight] = useState(6); // ft (4 to 10)
  const [gateOpening, setGateOpening] = useState('sliding'); // sliding, swing, pivot, folding
  const [gateOperation, setGateOperation] = useState('automated'); // automated, manual
  const [gateMaterial, setGateMaterial] = useState('steel'); // steel, aluminum, iron, stainless
  const [gateFinish, setGateFinish] = useState('matte_black'); // matte_black, semi_gloss, aged_bronze, grey_primer, raw_steel

  // Stairs
  const [stairHeight, setStairHeight] = useState(108); // inches (90 to 150)
  const [stairWidth, setStairWidth] = useState(36); // inches (32 to 48)
  const [stairTread, setStairTread] = useState('walnut'); // walnut, oak, steel
  const [stairStructure, setStairStructure] = useState('mono'); // mono, floating, double
  const [stairFinish, setStairFinish] = useState('matte_black');

  // Railings
  const [railingFt, setRailingFt] = useState(24); // linear ft (8 to 80)
  const [railingHeight, setRailingHeight] = useState(42); // 36 or 42 inches
  const [railingInfill, setRailingInfill] = useState('cable'); // cable, glass, vertical
  const [railingFinish, setRailingFinish] = useState('matte_black');

  // Handrails
  const [handrailFt, setHandrailFt] = useState(14); // linear ft (4 to 30)
  const [handrailProfile, setHandrailProfile] = useState('round_15'); // round_15, rect_2x1
  const [handrailMounting, setHandrailMounting] = useState('wall'); // wall, post
  const [handrailFinish, setHandrailFinish] = useState('matte_black');

  // Custom Metalwork
  const [customLength, setCustomLength] = useState(8); // ft
  const [customWidth, setCustomWidth] = useState(4); // ft
  const [customType, setCustomType] = useState('table'); // table, pergola, screen, canopy
  const [customMaterial, setCustomMaterial] = useState('steel');
  const [customFinish, setCustomFinish] = useState('matte_black');

  // Notes / Project details
  const [projectNotes, setProjectNotes] = useState('');

  // Handle client input changes
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  // Step 1 Validation
  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    if (!clientData.name.trim() || !clientData.phone.trim() || !clientData.email.trim()) {
      alert(isEs ? 'Por favor completa tu nombre, teléfono y correo electrónico.' : 'Please fill in your name, phone, and email.');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation & Proceed to calculation
  const handleProceedToStep3 = () => {
    setStep(3);
  };

  // Real-time Pricing Calculator Algorithm
  const calculatedEstimate = useMemo(() => {
    let minPrice = 0;
    let maxPrice = 0;
    let areaOrUnits = '';
    let specsSummary = '';

    if (serviceId === 'gates') {
      const sqft = gateWidth * gateHeight;
      const basePerSqft = gateMaterial === 'stainless' ? 95 : gateMaterial === 'aluminum' ? 75 : gateMaterial === 'iron' ? 80 : 65;
      const openingFactor = gateOpening === 'pivot' ? 1.35 : gateOpening === 'folding' ? 1.25 : gateOpening === 'swing' ? 1.15 : 1.0;
      const motorCost = gateOperation === 'automated' ? 1650 : 0;
      
      const rawBase = sqft * basePerSqft * openingFactor + motorCost;
      minPrice = Math.round((rawBase * 0.9) / 50) * 50;
      maxPrice = Math.round((rawBase * 1.25) / 50) * 50;
      areaOrUnits = `${sqft} sq ft (${gateWidth}' W x ${gateHeight}' H)`;
      specsSummary = `${isEs ? 'Apertura' : 'Opening'}: ${gateOpening.toUpperCase()} | ${isEs ? 'Operación' : 'Drive'}: ${gateOperation === 'automated' ? (isEs ? 'Motor Eléctrico' : 'Automated Motor') : (isEs ? 'Manual' : 'Manual')}`;
    } else if (serviceId === 'stairs') {
      const stepsCount = Math.round(stairHeight / 7.5);
      const costPerStep = stairStructure === 'floating' ? 420 : stairStructure === 'mono' ? 360 : 310;
      const treadExtra = stairTread === 'walnut' ? 90 : stairTread === 'oak' ? 70 : 45;
      const totalPerStep = costPerStep + treadExtra;
      
      minPrice = Math.round((stepsCount * totalPerStep * 0.92) / 50) * 50;
      maxPrice = Math.round((stepsCount * totalPerStep * 1.25) / 50) * 50;
      areaOrUnits = `${stepsCount} ${isEs ? 'Peldaños' : 'Steps'} (${(stairHeight/12).toFixed(1)} ft H)`;
      specsSummary = `${isEs ? 'Estructura' : 'Structure'}: ${stairStructure.toUpperCase()} | ${isEs ? 'Huellas' : 'Treads'}: ${stairTread.toUpperCase()}`;
    } else if (serviceId === 'railings') {
      const costPerFt = railingInfill === 'glass' ? 240 : railingInfill === 'cable' ? 165 : 140;
      const heightFactor = railingHeight === 42 ? 1.15 : 1.0;
      const base = railingFt * costPerFt * heightFactor;
      
      minPrice = Math.round((base * 0.9) / 50) * 50;
      maxPrice = Math.round((base * 1.22) / 50) * 50;
      areaOrUnits = `${railingFt} ${isEs ? 'Pies lineales' : 'Linear ft'} (${railingHeight}" H)`;
      specsSummary = `${isEs ? 'Relleno' : 'Infill'}: ${railingInfill.toUpperCase()} | ${isEs ? 'Altura Código' : 'Code Height'}: ${railingHeight}"`;
    } else if (serviceId === 'handrails') {
      const costPerFt = handrailProfile === 'rect_2x1' ? 78 : 65;
      const mountExtra = handrailMounting === 'post' ? 250 : 80;
      const base = (handrailFt * costPerFt) + mountExtra;
      
      minPrice = Math.round((base * 0.9) / 25) * 25;
      maxPrice = Math.round((base * 1.2) / 25) * 25;
      areaOrUnits = `${handrailFt} ${isEs ? 'Pies continuos' : 'Continuous ft'}`;
      specsSummary = `${isEs ? 'Perfil' : 'Profile'}: ${handrailProfile === 'round_15' ? '1.5" Round ADA' : '2x1" Rectangular'} | ${isEs ? 'Montaje' : 'Mount'}: ${handrailMounting.toUpperCase()}`;
    } else {
      const sqft = customLength * customWidth;
      const baseCost = sqft * 110 + 600;
      minPrice = Math.round((baseCost * 0.9) / 50) * 50;
      maxPrice = Math.round((baseCost * 1.3) / 50) * 50;
      areaOrUnits = `${sqft} sq ft (${customLength}' x ${customWidth}')`;
      specsSummary = `${isEs ? 'Tipología' : 'Type'}: ${customType.toUpperCase()}`;
    }

    return {
      min: minPrice,
      max: maxPrice,
      formatted: `$${minPrice.toLocaleString()} – $${maxPrice.toLocaleString()}`,
      areaOrUnits,
      specsSummary
    };
  }, [serviceId, gateWidth, gateHeight, gateOpening, gateOperation, gateMaterial, stairHeight, stairWidth, stairTread, stairStructure, railingFt, railingHeight, railingInfill, handrailFt, handrailProfile, handrailMounting, customLength, customWidth, customType, isEs]);

  // Final FormSubmit Handler
  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      _subject: `Cálculo Técnico #${folioCode}: ${clientData.name} - ${data.titleEn || serviceId}`,
      _template: "blank",
      _language: "es",
      _captcha: "false",
      folio_calculo: folioCode,
      servicio: isEs ? data.titleEs : data.titleEn,
      nombre_cliente: clientData.name,
      telefono: clientData.phone,
      email: clientData.email,
      ciudad: clientData.city,
      estimado_calculado: calculatedEstimate.formatted,
      dimensiones: calculatedEstimate.areaOrUnits,
      especificaciones_tecnicas: calculatedEstimate.specsSummary,
      notas_adicionales: projectNotes || 'Sin notas adicionales'
    };

    if (serviceId === 'gates') {
      payload.ancho_pies = gateWidth;
      payload.alto_pies = gateHeight;
      payload.tipo_apertura = gateOpening;
      payload.operacion = gateOperation;
      payload.material = gateMaterial;
      payload.color_acabado = gateFinish;
    } else if (serviceId === 'stairs') {
      payload.altura_suelo_pulgadas = stairHeight;
      payload.ancho_escalera = stairWidth;
      payload.material_huellas = stairTread;
      payload.estructura = stairStructure;
      payload.acabado = stairFinish;
    } else if (serviceId === 'railings') {
      payload.longitud_pies_lineales = railingFt;
      payload.altura_barandal = railingHeight;
      payload.sistema_relleno = railingInfill;
      payload.acabado = railingFinish;
    } else if (serviceId === 'handrails') {
      payload.longitud_pasamanos = handrailFt;
      payload.perfil = handrailProfile;
      payload.tipo_montaje = handrailMounting;
      payload.acabado = handrailFinish;
    } else {
      payload.medidas_personalizadas = `${customLength}ft x ${customWidth}ft`;
      payload.tipo_proyecto = customType;
      payload.acabado = customFinish;
    }

    try {
      await fetch("https://formsubmit.co/ajax/info@stationmetalworks.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("FormSubmit notice:", err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleResetCalculator = () => {
    setIsSubmitted(false);
    setStep(1);
    setFolioCode('SM-CALC-' + Math.floor(1000 + Math.random() * 9000));
  };

  // SVG CAD Renderer dynamically reacting to inputs
  const renderLiveCadSvg = () => {
    if (serviceId === 'gates') {
      // Dynamic gate sizing
      const displayW = Math.min(Math.max(gateWidth, 6), 28);
      const displayH = Math.min(Math.max(gateHeight, 4), 10);
      
      // Proportional box inside 460x280 viewport
      const svgWidth = 240 + (displayW - 6) * (140 / 22);
      const svgHeight = 120 + (displayH - 4) * (70 / 6);
      const startX = (460 - svgWidth) / 2;
      const startY = 230 - svgHeight;

      const slatsCount = Math.round(displayW * 1.1);

      return (
        <svg viewBox="0 0 460 280" className="cad-interactive-svg">
          <defs>
            <pattern id="cad-sub-grid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
            <marker id="cad-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--color-accent, #e00027)" />
            </marker>
          </defs>

          {/* Blueprint Grid */}
          <rect width="100%" height="100%" fill="#070913" />
          <rect width="100%" height="100%" fill="url(#cad-sub-grid)" />

          {/* Ground Line */}
          <line x1="20" y1="240" x2="440" y2="240" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Structural Pillars */}
          <rect x={startX - 32} y={startY - 15} width="24" height={svgHeight + 25} fill="#263238" stroke="#37474F" strokeWidth="1" rx="2" />
          <rect x={startX + svgWidth + 8} y={startY - 15} width="24" height={svgHeight + 25} fill="#263238" stroke="#37474F" strokeWidth="1" rx="2" />

          {/* Gate Outer Frame */}
          <rect 
            x={startX} 
            y={startY} 
            width={svgWidth} 
            height={svgHeight} 
            fill="rgba(224, 0, 39, 0.05)" 
            stroke="var(--color-accent, #e00027)" 
            strokeWidth="2.5" 
          />

          {/* Diagonal Cross Brace or Vertical Slats */}
          {gateOpening === 'sliding' && (
            <line x1={startX} y1={startY} x2={startX + svgWidth} y2={startY + svgHeight} stroke="var(--color-accent, #e00027)" strokeWidth="1.5" strokeDasharray="3 3" />
          )}

          {gateOpening === 'swing' && (
            <>
              <line x1={startX + svgWidth/2} y1={startY} x2={startX + svgWidth/2} y2={startY + svgHeight} stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx={startX + 2} cy={startY + 20} r="4" fill="#FACC15" />
              <circle cx={startX + 2} cy={startY + svgHeight - 20} r="4" fill="#FACC15" />
              <circle cx={startX + svgWidth - 2} cy={startY + 20} r="4" fill="#FACC15" />
              <circle cx={startX + svgWidth - 2} cy={startY + svgHeight - 20} r="4" fill="#FACC15" />
            </>
          )}

          {gateOpening === 'pivot' && (
            <>
              <line x1={startX + 35} y1={startY - 10} x2={startX + 35} y2={startY + svgHeight + 10} stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx={startX + 35} cy={startY} r="6" fill="#38BDF8" />
              <circle cx={startX + 35} cy={startY + svgHeight} r="6" fill="#38BDF8" />
            </>
          )}

          {/* Slats */}
          {[...Array(slatsCount)].map((_, i) => {
            const x = startX + (i + 1) * (svgWidth / (slatsCount + 1));
            return (
              <line key={i} x1={x} y1={startY + 4} x2={x} y2={startY + svgHeight - 4} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            );
          })}

          {/* Automated Drive Unit (If Automated) */}
          {gateOperation === 'automated' && (
            <g transform={`translate(${startX - 28}, 215)`}>
              <rect x="0" y="0" width="22" height="22" fill="#020032" stroke="#25D366" strokeWidth="1.5" rx="3" />
              <circle cx="11" cy="11" r="4" fill="#25D366" />
              <text x="11" y="32" fill="#25D366" fontSize="5" fontFamily="monospace" textAnchor="middle">MOTOR 24V</text>
            </g>
          )}

          {/* Roller Wheels if sliding */}
          {gateOpening === 'sliding' && (
            <>
              <circle cx={startX + 25} cy={startY + svgHeight + 5} r="6" fill="#111" stroke="#ECEFF1" strokeWidth="1.5" />
              <circle cx={startX + svgWidth - 25} cy={startY + svgHeight + 5} r="6" fill="#111" stroke="#ECEFF1" strokeWidth="1.5" />
            </>
          )}

          {/* Width Dimension Arrow */}
          <line x1={startX} y1={startY - 25} x2={startX + svgWidth} y2={startY - 25} stroke="var(--color-accent, #e00027)" strokeWidth="1" markerStart="url(#cad-arrow)" markerEnd="url(#cad-arrow)" />
          <line x1={startX} y1={startY - 30} x2={startX} y2={startY - 20} stroke="var(--color-accent, #e00027)" strokeWidth="1" />
          <line x1={startX + svgWidth} y1={startY - 30} x2={startX + svgWidth} y2={startY - 20} stroke="var(--color-accent, #e00027)" strokeWidth="1" />
          <text x={startX + svgWidth/2} y={startY - 32} fill="var(--color-accent, #e00027)" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            CLEAR OPENING: {gateWidth}.0 FT ({gateWidth * 12}")
          </text>

          {/* Height Dimension Arrow */}
          <line x1={startX + svgWidth + 40} y1={startY} x2={startX + svgWidth + 40} y2={startY + svgHeight} stroke="var(--color-accent, #e00027)" strokeWidth="1" markerStart="url(#cad-arrow)" markerEnd="url(#cad-arrow)" />
          <line x1={startX + svgWidth + 35} y1={startY} x2={startX + svgWidth + 45} y2={startY} stroke="var(--color-accent, #e00027)" strokeWidth="1" />
          <line x1={startX + svgWidth + 35} y1={startY + svgHeight} x2={startX + svgWidth + 45} y2={startY + svgHeight} stroke="var(--color-accent, #e00027)" strokeWidth="1" />
          <text 
            x={startX + svgWidth + 52} 
            y={startY + svgHeight/2} 
            fill="var(--color-accent, #e00027)" 
            fontSize="8" 
            fontFamily="monospace" 
            fontWeight="bold" 
            textAnchor="middle" 
            transform={`rotate(90, ${startX + svgWidth + 52}, ${startY + svgHeight/2})`}
          >
            H: {gateHeight}.0 FT ({gateHeight * 12}")
          </text>

          {/* Live Specs Footnote Badge */}
          <g transform="translate(25, 266)">
            <text fill="#94A3B8" fontSize="7" fontFamily="monospace">
              MATERIAL: {gateMaterial.toUpperCase()} | FINISH: {gateFinish.toUpperCase().replace('_', ' ')} | OPERATION: {gateOperation.toUpperCase()}
            </text>
          </g>
        </svg>
      );
    }

    if (serviceId === 'stairs') {
      const stepsCount = Math.round(stairHeight / 7.5);
      const svgHeight = Math.min(Math.max((stairHeight / 144) * 160, 100), 180);
      
      return (
        <svg viewBox="0 0 460 280" className="cad-interactive-svg">
          <rect width="100%" height="100%" fill="#070913" />
          <line x1="20" y1="240" x2="440" y2="240" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />
          
          {/* Central spine beam */}
          <line x1="60" y1="230" x2={60 + stepsCount * 22} y2={230 - svgHeight} stroke="var(--color-accent, #e00027)" strokeWidth="6" />

          {/* Treads */}
          {[...Array(stepsCount)].map((_, i) => {
            const x = 50 + i * 22;
            const y = 230 - (i + 1) * (svgHeight / stepsCount);
            return (
              <g key={i}>
                <polygon points={`${x+4},${y+4} ${x+26},${y+4} ${x+20},${y+10} ${x+8},${y+10}`} fill="#455A64" stroke="#263238" strokeWidth="0.5" />
                <rect x={x} y={y} width="32" height="6" fill={stairTread === 'walnut' ? '#8D6E63' : stairTread === 'oak' ? '#D7CCC8' : '#78909C'} stroke="#111" strokeWidth="0.75" rx="1" />
              </g>
            );
          })}

          <text x="230" y="35" fill="var(--color-accent, #e00027)" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            FLOOR-TO-FLOOR HEIGHT: {stairHeight}" ({(stairHeight/12).toFixed(1)} FT) — {stepsCount} STEPS
          </text>
          <text x="230" y="266" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
            TREADS: {stairTread.toUpperCase()} | WIDTH: {stairWidth}" | STRUCTURE: {stairStructure.toUpperCase()}
          </text>
        </svg>
      );
    }

    if (serviceId === 'railings') {
      const postsCount = Math.max(Math.round(railingFt / 4) + 1, 3);
      return (
        <svg viewBox="0 0 460 280" className="cad-interactive-svg">
          <rect width="100%" height="100%" fill="#070913" />
          <line x1="20" y1="230" x2="440" y2="230" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Top Rail */}
          <rect x="40" y="100" width="380" height="7" fill="var(--color-accent, #e00027)" rx="1.5" />

          {/* Cables or Glass */}
          {railingInfill === 'cable' && (
            [...Array(8)].map((_, wIdx) => (
              <line key={wIdx} x1="45" y1={115 + wIdx * 14} x2="415" y2={115 + wIdx * 14} stroke="#CFD8DC" strokeWidth="0.8" opacity="0.7" />
            ))
          )}
          {railingInfill === 'glass' && (
            <rect x="45" y="112" width="370" height="110" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" strokeWidth="0.75" />
          )}
          {railingInfill === 'vertical' && (
            [...Array(24)].map((_, i) => (
              <line key={i} x1={48 + i * 15.5} y1="107" x2={48 + i * 15.5} y2="225" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            ))
          )}

          {/* Posts */}
          {[...Array(postsCount)].map((_, i) => {
            const x = 45 + i * (370 / (postsCount - 1));
            return (
              <g key={i}>
                <rect x={x - 3} y="107" width="6" height="123" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                <rect x={x - 7} y="226" width="14" height="4" fill="#78909C" rx="1" />
              </g>
            );
          })}

          <text x="230" y="55" fill="var(--color-accent, #e00027)" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            RAILING LENGTH: {railingFt} LINEAR FT — {postsCount} STRUCTURAL POSTS
          </text>
          <text x="230" y="266" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
            HEIGHT: {railingHeight}" CODE COMPLIANT | INFILL: {railingInfill.toUpperCase()}
          </text>
        </svg>
      );
    }

    // Default or Handrails / Custom
    return (
      <svg viewBox="0 0 460 280" className="cad-interactive-svg">
        <rect width="100%" height="100%" fill="#070913" />
        <line x1="20" y1="240" x2="440" y2="240" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />
        
        {/* Wall & bracket schematic */}
        <line x1="120" y1="40" x2="120" y2="240" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="114" y="120" width="12" height="60" fill="#37474F" rx="2" />
        <path d="M 126,150 L 190,150 C 205,150 215,140 215,125 L 215,100" fill="none" stroke="var(--color-accent, #e00027)" strokeWidth="8" strokeLinecap="round" />
        <circle cx="215" cy="80" r="22" fill="none" stroke="var(--color-accent, #e00027)" strokeWidth="4" />
        <circle cx="215" cy="80" r="18" fill="#111" />

        <text x="230" y="45" fill="var(--color-accent, #e00027)" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          {serviceId === 'handrails' ? `ADA CONTINUOUS HANDRAIL: ${handrailFt} FT` : `CUSTOM ARCHITECTURAL CAD: ${customLength}' x ${customWidth}'`}
        </text>
        <text x="230" y="266" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
          ENGINEERING DRAWING VERIFIED // STATION METALWORKS NORTH HOLLYWOOD CA
        </text>
      </svg>
    );
  };

  return (
    <section className="estimator-blueprint-section container" id="calculador-tecnico">
      
      {/* Title Banner */}
      <div className="section-title-box">
        <span className="tag-label">
          {isEs ? 'CONFIGURADOR Y CALCULADOR TÉCNICO' : 'INTEGRATED TECHNICAL CALCULATOR'}
        </span>
        <h2>
          {isEs ? 'Calculador de Medidas y Dibujo CAD' : 'Layout Calculation & CAD Draft'}
        </h2>
        <p>
          {isEs 
            ? 'Ingresa tus medidas de obra para calcular en vivo el presupuesto estimado y visualizar el plano técnico correspondiente.'
            : 'Enter your project dimensions to calculate an instant estimate and preview real-time engineering blueprints.'}
        </p>
      </div>

      {/* Multistep Steps Navigation Bar */}
      <div className="calculator-stepper-nav">
        <button 
          className={`step-nav-pill ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
          onClick={() => setStep(1)}
        >
          <span className="step-num">{step > 1 ? <Check size={12} /> : '1'}</span>
          <span className="step-txt">{isEs ? '1. Datos del Cliente' : '1. Contact Details'}</span>
        </button>

        <div className="step-nav-separator"></div>

        <button 
          className={`step-nav-pill ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
          onClick={() => {
            if (clientData.name && clientData.phone && clientData.email) setStep(2);
            else alert(isEs ? 'Por favor completa el Paso 1 primero.' : 'Please complete Step 1 first.');
          }}
        >
          <span className="step-num">{step > 2 ? <Check size={12} /> : '2'}</span>
          <span className="step-txt">{isEs ? '2. Medidas & Opciones' : '2. Dimensions & Options'}</span>
        </button>

        <div className="step-nav-separator"></div>

        <button 
          className={`step-nav-pill ${step === 3 ? 'active' : ''}`}
          onClick={() => {
            if (clientData.name && clientData.phone && clientData.email) setStep(3);
            else alert(isEs ? 'Por favor completa el Paso 1 y 2 primero.' : 'Please complete Steps 1 & 2 first.');
          }}
        >
          <span className="step-num">3</span>
          <span className="step-txt">{isEs ? '3. Cálculo & Cotización' : '3. Estimate & Submit'}</span>
        </button>
      </div>

      {/* Main Calculator Grid: Controls on Left, Live CAD on Right */}
      <div className="calculator-layout-grid">
        
        {/* Left Column: Interactive Multistep Form */}
        <div className="estimator-controls-panel glass-panel">
          
          {/* =========================================================
              ETAPA 1: DATOS DEL CLIENTE
             ========================================================= */}
          {step === 1 && (
            <form onSubmit={handleProceedToStep2} className="calculator-step-container">
              <div className="calc-step-header">
                <div className="step-badge">
                  <User size={14} />
                  <span>{isEs ? 'PASO 1: DATOS DEL SOLICITANTE' : 'STEP 1: APPLICANT INFO'}</span>
                </div>
                <h3>{isEs ? 'Identificación del Proyecto' : 'Project Identification'}</h3>
                <p>
                  {isEs 
                    ? 'Tus datos son necesarios para asociar el plano calculado y enviarte el desglose técnico oficial a tu correo o WhatsApp.'
                    : 'Required to link your calculated blueprint and dispatch official technical bids to your email or WhatsApp.'}
                </p>
              </div>

              <div className="calc-form-fields">
                <div className="calc-input-group">
                  <label>{isEs ? 'Nombre Completo *' : 'Full Name *'}</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={clientData.name}
                      onChange={handleClientChange}
                      placeholder={isEs ? 'Ej. Roberto Gómez' : 'e.g. Robert Smith'}
                      className="calc-input"
                    />
                  </div>
                </div>

                <div className="calc-form-row">
                  <div className="calc-input-group">
                    <label>{isEs ? 'Teléfono / WhatsApp *' : 'Phone / WhatsApp *'}</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon" />
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={clientData.phone}
                        onChange={handleClientChange}
                        placeholder="+1 (346) 234-9640"
                        className="calc-input"
                      />
                    </div>
                  </div>

                  <div className="calc-input-group">
                    <label>{isEs ? 'Correo Electrónico *' : 'Email Address *'}</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon" />
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={clientData.email}
                        onChange={handleClientChange}
                        placeholder="contacto@ejemplo.com"
                        className="calc-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-input-group">
                  <label>{isEs ? 'Ciudad y Estado *' : 'City & State *'}</label>
                  <div className="input-with-icon">
                    <MapPin size={16} className="input-icon" />
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      value={clientData.city}
                      onChange={handleClientChange}
                      placeholder="North Hollywood, CA"
                      className="calc-input"
                    />
                  </div>
                </div>
              </div>

              <div className="calc-step-actions">
                <div className="safe-ssl-note">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>{isEs ? 'Privacidad garantizada / Sin spam' : 'Privacy secured / No spam'}</span>
                </div>

                <button type="submit" className="btn btn-primary btn-calc-next">
                  <span>{isEs ? 'Continuar a Medidas Técnicas' : 'Continue to Dimensions'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              ETAPA 2: ESPECIFICACIONES Y MEDIDAS TÉCNICAS
             ========================================================= */}
          {step === 2 && (
            <div className="calculator-step-container">
              <div className="calc-step-header">
                <div className="step-badge">
                  <Ruler size={14} />
                  <span>{isEs ? 'PASO 2: DIMENSIONES Y MECANISMOS' : 'STEP 2: SPECS & SIZING'}</span>
                </div>
                <h3>{isEs ? 'Configura las Medidas y Materiales' : 'Configure Dimensions & Materials'}</h3>
                <p>
                  {isEs 
                    ? 'Ajusta las medidas y opciones. El plano CAD de la derecha responderá a tus cambios en tiempo real.'
                    : 'Adjust parameters below. The CAD blueprint on the right reflects your adjustments live.'}
                </p>
              </div>

              {/* GATES SPECIFIC CONTROLS */}
              {serviceId === 'gates' && (
                <div className="calc-custom-controls">
                  
                  {/* Width slider & direct number */}
                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Ancho de Claro (Pies)' : 'Clear Opening Width (ft)'}</label>
                      <span className="badge-measure-val">{gateWidth} FT ({gateWidth * 12}")</span>
                    </div>
                    <input 
                      type="range" 
                      min="6" 
                      max="28" 
                      step="1" 
                      value={gateWidth} 
                      onChange={(e) => setGateWidth(parseInt(e.target.value))}
                      className="calc-range-slider"
                    />
                    <div className="slider-ticks">
                      <span>6' ft</span>
                      <span>12' ft</span>
                      <span>18' ft</span>
                      <span>28' ft</span>
                    </div>
                  </div>

                  {/* Height slider & direct number */}
                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Alto del Portón (Pies)' : 'Gate Height (ft)'}</label>
                      <span className="badge-measure-val">{gateHeight} FT ({gateHeight * 12}")</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="10" 
                      step="0.5" 
                      value={gateHeight} 
                      onChange={(e) => setGateHeight(parseFloat(e.target.value))}
                      className="calc-range-slider"
                    />
                    <div className="slider-ticks">
                      <span>4' ft (Bajo)</span>
                      <span>6' ft (Estándar)</span>
                      <span>8' ft (Privacidad)</span>
                      <span>10' ft (Monolítico)</span>
                    </div>
                  </div>

                  {/* Opening Type */}
                  <div className="calc-control-group">
                    <label>{isEs ? 'Tipo de Apertura' : 'Opening System'}</label>
                    <div className="calc-options-grid-2x2">
                      {[
                        { id: 'sliding', labelEs: 'Corredizo Cantilever', labelEn: 'Sliding Cantilever' },
                        { id: 'swing', labelEs: 'Abatible Doble Hoja', labelEn: 'Dual Swing Leaf' },
                        { id: 'pivot', labelEs: 'Pivotante Monolítico', labelEn: 'Monolithic Pivot' },
                        { id: 'folding', labelEs: 'Plegable Bi-fold', labelEn: 'Bi-fold Folding' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          type="button"
                          className={`calc-option-card ${gateOpening === item.id ? 'active' : ''}`}
                          onClick={() => setGateOpening(item.id)}
                        >
                          <span className="opt-radio">{gateOpening === item.id && <Check size={10} />}</span>
                          <span className="opt-title">{isEs ? item.labelEs : item.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operation Mode: Manual vs Automated */}
                  <div className="calc-control-group">
                    <label>{isEs ? 'Operación del Portón' : 'Operation Drive'}</label>
                    <div className="calc-options-grid-2x2">
                      <button 
                        type="button"
                        className={`calc-option-card ${gateOperation === 'automated' ? 'active' : ''}`}
                        onClick={() => setGateOperation('automated')}
                      >
                        <span className="opt-radio">{gateOperation === 'automated' && <Check size={10} />}</span>
                        <div className="opt-text-block">
                          <strong>{isEs ? 'Automático (Motor 24V)' : 'Automated (24V Motor)'}</strong>
                          <span>{isEs ? 'Motor LiftMaster + Controles' : 'LiftMaster Drive + Remotes'}</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        className={`calc-option-card ${gateOperation === 'manual' ? 'active' : ''}`}
                        onClick={() => setGateOperation('manual')}
                      >
                        <span className="opt-radio">{gateOperation === 'manual' && <Check size={10} />}</span>
                        <div className="opt-text-block">
                          <strong>{isEs ? 'Manual (Sin Motor)' : 'Manual (No Motor)'}</strong>
                          <span>{isEs ? 'Cerrojo industrial de piso' : 'Heavy mechanical slide lock'}</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Material Selector */}
                  <div className="calc-control-group">
                    <label>{isEs ? 'Tipo de Material' : 'Structural Material'}</label>
                    <div className="calc-options-grid-2x2">
                      {[
                        { id: 'steel', labelEs: 'Acero Estructural Cal. 11', labelEn: 'Heavy Structural Steel' },
                        { id: 'aluminum', labelEs: 'Aluminio 6061 Anticorrosión', labelEn: '6061 Rustproof Aluminum' },
                        { id: 'iron', labelEs: 'Hierro Forjado Macizo', labelEn: 'Solid Wrought Iron' },
                        { id: 'stainless', labelEs: 'Acero Inoxidable 316', labelEn: 'Marine Stainless 316' }
                      ].map(mat => (
                        <button 
                          key={mat.id}
                          type="button"
                          className={`calc-option-card ${gateMaterial === mat.id ? 'active' : ''}`}
                          onClick={() => setGateMaterial(mat.id)}
                        >
                          <span className="opt-radio">{gateMaterial === mat.id && <Check size={10} />}</span>
                          <span className="opt-title">{isEs ? mat.labelEs : mat.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Finish / Color */}
                  <div className="calc-control-group">
                    <label>{isEs ? 'Color / Acabado Electrostático' : 'Finish & Color'}</label>
                    <div className="calc-swatch-row">
                      {[
                        { id: 'matte_black', nameEs: 'Negro Mate', nameEn: 'Matte Black', color: '#141416' },
                        { id: 'semi_gloss', nameEs: 'Negro Brillo', nameEn: 'Semi-Gloss', color: '#2B2B30' },
                        { id: 'aged_bronze', nameEs: 'Bronce Envejecido', nameEn: 'Aged Bronze', color: '#5A3D28' },
                        { id: 'grey_primer', nameEs: 'Primer Gris', nameEn: 'Grey Primer', color: '#94A3B8' },
                        { id: 'raw_steel', nameEs: 'Acero Pavonado', nameEn: 'Raw Steel', color: '#4A4C54' }
                      ].map(sw => (
                        <button
                          key={sw.id}
                          type="button"
                          className={`calc-swatch-btn ${gateFinish === sw.id ? 'active' : ''}`}
                          onClick={() => setGateFinish(sw.id)}
                          title={isEs ? sw.nameEs : sw.nameEn}
                        >
                          <span className="swatch-circle" style={{ background: sw.color }}></span>
                          <span className="swatch-label">{isEs ? sw.nameEs : sw.nameEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STAIRS SPECIFIC CONTROLS */}
              {serviceId === 'stairs' && (
                <div className="calc-custom-controls">
                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Altura Suelo a Suelo (Pulgadas)' : 'Floor-to-Floor Height (in)'}</label>
                      <span className="badge-measure-val">{stairHeight}" ({(stairHeight/12).toFixed(1)} FT)</span>
                    </div>
                    <input 
                      type="range" min="90" max="150" step="1" 
                      value={stairHeight} 
                      onChange={(e) => setStairHeight(parseInt(e.target.value))}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Tipo de Huella' : 'Tread Wood Species'}</label>
                    <div className="calc-options-grid-2x2">
                      {[
                        { id: 'walnut', labelEs: 'Nogal Americano Macizo', labelEn: 'Solid American Walnut' },
                        { id: 'oak', labelEs: 'Roble Blanco Selecto', labelEn: 'Select White Oak' },
                        { id: 'steel', labelEs: 'Placa de Acero Antideslizante', labelEn: 'Diamond Plate Steel' }
                      ].map(t => (
                        <button 
                          key={t.id}
                          type="button"
                          className={`calc-option-card ${stairTread === t.id ? 'active' : ''}`}
                          onClick={() => setStairTread(t.id)}
                        >
                          <span className="opt-radio">{stairTread === t.id && <Check size={10} />}</span>
                          <span className="opt-title">{isEs ? t.labelEs : t.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Estructura Portante' : 'Stringer Structure'}</label>
                    <div className="calc-options-grid-2x2">
                      {[
                        { id: 'mono', labelEs: 'Monoviga Central Oculta', labelEn: 'Center Mono-Stringer' },
                        { id: 'floating', labelEs: 'Voladizo Flotante en Muro', labelEn: 'Cantilevered Floating' },
                        { id: 'double', labelEs: 'Doble Zanca Lateral en U', labelEn: 'Dual Side C-Channels' }
                      ].map(s => (
                        <button 
                          key={s.id}
                          type="button"
                          className={`calc-option-card ${stairStructure === s.id ? 'active' : ''}`}
                          onClick={() => setStairStructure(s.id)}
                        >
                          <span className="opt-radio">{stairStructure === s.id && <Check size={10} />}</span>
                          <span className="opt-title">{isEs ? s.labelEs : s.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* RAILINGS SPECIFIC CONTROLS */}
              {serviceId === 'railings' && (
                <div className="calc-custom-controls">
                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Longitud Total de Tramo (Pies Lineales)' : 'Total Linear Footage (ft)'}</label>
                      <span className="badge-measure-val">{railingFt} FT</span>
                    </div>
                    <input 
                      type="range" min="8" max="80" step="2" 
                      value={railingFt} 
                      onChange={(e) => setRailingFt(parseInt(e.target.value))}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Sistema de Relleno' : 'Infill Type'}</label>
                    <div className="calc-options-grid-2x2">
                      {[
                        { id: 'cable', labelEs: 'Cable Marino 316 Tensado', labelEn: '316 Marine Cable Wire' },
                        { id: 'glass', labelEs: 'Vidrio Templado Laminado 1/2"', labelEn: '1/2" Laminated Glass' },
                        { id: 'vertical', labelEs: 'Barrotes Verticales Forjados', labelEn: 'Vertical Forged Balusters' }
                      ].map(inf => (
                        <button 
                          key={inf.id}
                          type="button"
                          className={`calc-option-card ${railingInfill === inf.id ? 'active' : ''}`}
                          onClick={() => setRailingInfill(inf.id)}
                        >
                          <span className="opt-radio">{railingInfill === inf.id && <Check size={10} />}</span>
                          <span className="opt-title">{isEs ? inf.labelEs : inf.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Altura de Código' : 'Code Height'}</label>
                    <div className="calc-options-grid-2x2">
                      <button 
                        type="button"
                        className={`calc-option-card ${railingHeight === 36 ? 'active' : ''}`}
                        onClick={() => setRailingHeight(36)}
                      >
                        <span className="opt-radio">{railingHeight === 36 && <Check size={10} />}</span>
                        <span className="opt-title">36" (Residencial Estándar)</span>
                      </button>
                      <button 
                        type="button"
                        className={`calc-option-card ${railingHeight === 42 ? 'active' : ''}`}
                        onClick={() => setRailingHeight(42)}
                      >
                        <span className="opt-radio">{railingHeight === 42 && <Check size={10} />}</span>
                        <span className="opt-title">42" (Comercial / Balcones)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* HANDRAILS SPECIFIC CONTROLS */}
              {serviceId === 'handrails' && (
                <div className="calc-custom-controls">
                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Longitud Total del Pasamanos (Pies)' : 'Continuous Length (ft)'}</label>
                      <span className="badge-measure-val">{handrailFt} FT ({handrailFt * 12}")</span>
                    </div>
                    <input 
                      type="range" min="4" max="30" step="1" 
                      value={handrailFt} 
                      onChange={(e) => setHandrailFt(parseInt(e.target.value))}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Perfil de Agarre' : 'Graspable Profile'}</label>
                    <div className="calc-options-grid-2x2">
                      <button 
                        type="button"
                        className={`calc-option-card ${handrailProfile === 'round_15' ? 'active' : ''}`}
                        onClick={() => setHandrailProfile('round_15')}
                      >
                        <span className="opt-radio">{handrailProfile === 'round_15' && <Check size={10} />}</span>
                        <span className="opt-title">{isEs ? 'Tubular 1.5" Redondo ADA' : '1.5" Round ADA Tube'}</span>
                      </button>
                      <button 
                        type="button"
                        className={`calc-option-card ${handrailProfile === 'rect_2x1' ? 'active' : ''}`}
                        onClick={() => setHandrailProfile('rect_2x1')}
                      >
                        <span className="opt-radio">{handrailProfile === 'rect_2x1' && <Check size={10} />}</span>
                        <span className="opt-title">{isEs ? 'Rectangular 2x1" Perfil' : '2x1" Rectangular Profile'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Tipo de Fijación' : 'Mounting Interface'}</label>
                    <div className="calc-options-grid-2x2">
                      <button 
                        type="button"
                        className={`calc-option-card ${handrailMounting === 'wall' ? 'active' : ''}`}
                        onClick={() => setHandrailMounting('wall')}
                      >
                        <span className="opt-radio">{handrailMounting === 'wall' && <Check size={10} />}</span>
                        <span className="opt-title">{isEs ? 'Soportes de Muro Reforzados' : 'Wall Brackets'}</span>
                      </button>
                      <button 
                        type="button"
                        className={`calc-option-card ${handrailMounting === 'post' ? 'active' : ''}`}
                        onClick={() => setHandrailMounting('post')}
                      >
                        <span className="opt-radio">{handrailMounting === 'post' && <Check size={10} />}</span>
                        <span className="opt-title">{isEs ? 'Postes a Suelo / Piso' : 'Floor-Mounted Posts'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOM FAB CONTROLS */}
              {serviceId === 'custom' && (
                <div className="calc-custom-controls">
                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Largo Estimado (Pies)' : 'Estimated Length (ft)'}</label>
                      <span className="badge-measure-val">{customLength} FT</span>
                    </div>
                    <input 
                      type="range" min="3" max="24" step="1" 
                      value={customLength} 
                      onChange={(e) => setCustomLength(parseInt(e.target.value))}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-control-group">
                    <div className="slider-header-row">
                      <label>{isEs ? 'Ancho Estimado (Pies)' : 'Estimated Width (ft)'}</label>
                      <span className="badge-measure-val">{customWidth} FT</span>
                    </div>
                    <input 
                      type="range" min="2" max="14" step="1" 
                      value={customWidth} 
                      onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                      className="calc-range-slider"
                    />
                  </div>

                  <div className="calc-control-group">
                    <label>{isEs ? 'Tipología de Obra' : 'Structure Type'}</label>
                    <div className="calc-options-grid-2x2">
                      {[
                        { id: 'table', labelEs: 'Mesa de Acero Monolítica', labelEn: 'Steel Monolithic Table' },
                        { id: 'screen', labelEs: 'Mampara Divisoria Láser', labelEn: 'Laser CNC Screen' },
                        { id: 'pergola', labelEs: 'Pérgola / Estructura Techo', labelEn: 'Steel Pergola Framework' },
                        { id: 'canopy', labelEs: 'Marquesina Volada Entrada', labelEn: 'Cantilever Entry Canopy' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          type="button"
                          className={`calc-option-card ${customType === item.id ? 'active' : ''}`}
                          onClick={() => setCustomType(item.id)}
                        >
                          <span className="opt-radio">{customType === item.id && <Check size={10} />}</span>
                          <span className="opt-title">{isEs ? item.labelEs : item.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Project Details */}
              <div className="calc-control-group">
                <label>{isEs ? 'Notas del Proyecto / Detalles de Sitio' : 'Project Notes / Site Observations'}</label>
                <textarea 
                  rows="2"
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder={isEs ? 'Escribe aquí si requieres instalación en North Hollywood o zonas aledañas, fecha tentativa o si tienes planos...' : 'Note your target timeline, city requirements, or if you already have drawings...'}
                  className="calc-textarea"
                />
              </div>

              {/* Nav buttons */}
              <div className="calc-step-actions">
                <button type="button" className="btn btn-secondary btn-calc-back" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} />
                  <span>{isEs ? 'Atrás: Datos' : 'Back: Contact'}</span>
                </button>

                <button type="button" className="btn btn-primary btn-calc-next" onClick={handleProceedToStep3}>
                  <span>{isEs ? 'Ver Cálculo de Precio y Registrar' : 'Calculate & Review Bid'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* =========================================================
              ETAPA 3: CÁLCULO ESTIMADO Y ENVÍO / REGISTRO
             ========================================================= */}
          {step === 3 && !isSubmitted && (
            <div className="calculator-step-container">
              <div className="calc-step-header">
                <div className="step-badge">
                  <Sparkles size={14} />
                  <span>{isEs ? 'PASO 3: ESTIMACIÓN DE TALLER' : 'STEP 3: WORKSHOP BID'}</span>
                </div>
                <h3>{isEs ? 'Presupuesto Estimado en Vivo' : 'Live Engineering Estimate'}</h3>
                <p>
                  {isEs 
                    ? 'Calculado con base en las dimensiones reales seleccionadas y costos actuales de acero y forja.' 
                    : 'Generated based on your exact square footage, structural materials, and shop fabrication time.'}
                </p>
              </div>

              {/* Live Calculated Price Box */}
              <div className="calc-result-hero-box">
                <span className="result-label">{isEs ? 'RANGO DE PRECIO ESTIMADO' : 'ESTIMATED PRICE RANGE'}</span>
                <div className="result-amount-display">{calculatedEstimate.formatted}</div>
                <div className="result-scope-pill">
                  <Compass size={13} className="text-accent" />
                  <span>{calculatedEstimate.areaOrUnits}</span>
                </div>
              </div>

              {/* Calculation Breakdown Cards */}
              <div className="calc-summary-specs-list">
                <div className="calc-spec-item">
                  <span className="spec-name">{isEs ? 'Solicitante' : 'Client'}:</span>
                  <span className="spec-val">{clientData.name} ({clientData.phone})</span>
                </div>
                <div className="calc-spec-item">
                  <span className="spec-name">{isEs ? 'Ubicación' : 'Location'}:</span>
                  <span className="spec-val">{clientData.city}</span>
                </div>
                <div className="calc-spec-item">
                  <span className="spec-name">{isEs ? 'Disciplina' : 'Discipline'}:</span>
                  <span className="spec-val">{isEs ? data.titleEs : data.titleEn}</span>
                </div>
                <div className="calc-spec-item">
                  <span className="spec-name">{isEs ? 'Configuración' : 'Specs'}:</span>
                  <span className="spec-val">{calculatedEstimate.specsSummary}</span>
                </div>
                <div className="calc-spec-item">
                  <span className="spec-name">{isEs ? 'Tiempo de Fabricación' : 'Lead Time'}:</span>
                  <span className="spec-val text-emerald">{isEs ? '10 – 14 Días Hábiles' : '10 – 14 Business Days'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="calc-step-actions">
                <button type="button" className="btn btn-secondary btn-calc-back" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} />
                  <span>{isEs ? 'Modificar Medidas' : 'Modify Sizing'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-primary btn-calc-submit" 
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                >
                  {isSubmitting ? (
                    <span>{isEs ? 'Transmitiendo a Taller...' : 'Transmitting to Shop...'}</span>
                  ) : (
                    <>
                      <span>{isEs ? 'Confirmar y Enviar Solicitud' : 'Confirm & Submit Quote'}</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="calc-footnote-guarantee">
                <ShieldCheck size={14} className="text-emerald" />
                <span>
                  {isEs 
                    ? 'Este cálculo es una propuesta preliminar sujeta a rectificación de medidas en sitio por Station Metalworks.' 
                    : 'Preliminary estimate subject to final field verification by Station Metalworks.'}
                </span>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {isSubmitted && (
            <div className="calc-success-view">
              <div className="calc-success-badge">
                <CheckCircle2 size={48} />
              </div>
              <span className="calc-folio-tag">{folioCode}</span>
              <h3>{isEs ? '¡Cálculo Registrado Exitosamente!' : 'Calculation Registered!'}</h3>
              <p>
                {isEs 
                  ? `Gracias ${clientData.name}. Tu estimación de ${calculatedEstimate.formatted} para ${data.titleEs || serviceId} en ${clientData.city} ha sido recibida por nuestro taller en North Hollywood. Te contactaremos en menos de 24 horas.`
                  : `Thank you ${clientData.name}. Your estimate of ${calculatedEstimate.formatted} for ${data.titleEn || serviceId} in ${clientData.city} has been received by our North Hollywood workshop. We will contact you within 24 hours.`}
              </p>

              <div className="calc-success-actions">
                <a 
                  href={`https://wa.me/13462349640?text=${encodeURIComponent(
                    isEs 
                      ? `Hola José / Station Metalworks, realicé un cálculo en la web (${folioCode}) para ${data.titleEs}: ${calculatedEstimate.areaOrUnits} con estimado de ${calculatedEstimate.formatted}. Mi nombre es ${clientData.name}.`
                      : `Hello José / Station Metalworks, I generated layout calculation ${folioCode} for ${data.titleEn}: ${calculatedEstimate.areaOrUnits} estimated at ${calculatedEstimate.formatted}. My name is ${clientData.name}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-calc-wa"
                >
                  <MessageSquare size={16} />
                  <span>{isEs ? 'Avisar por WhatsApp (+1 346 234 9640)' : 'Chat on WhatsApp (+1 346 234 9640)'}</span>
                </a>

                <button onClick={handleResetCalculator} className="btn-calc-restart">
                  <RefreshCw size={14} />
                  <span>{isEs ? 'Calcular Otra Medida' : 'Calculate Another Measure'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Engineering CAD Blueprint Board */}
        <div className="estimator-blueprint-board glass-panel">
          <div className="blueprint-board-header">
            <div className="cad-header-left">
              <Compass size={15} className="text-accent" />
              <span>{isEs ? 'VISTA DE PLANO DIBUJO CAD EN TIEMPO REAL' : 'REAL-TIME DRAFT SCHEMATIC VIEWPORT'}</span>
            </div>
            <div className="cad-header-right">
              <span className="cad-live-tag">LIVE CAD</span>
              <span className="terminal-dot"></span>
            </div>
          </div>

          <div className="blueprint-canvas-viewport">
            {renderLiveCadSvg()}
          </div>

          {/* Technical Specs Footer */}
          <div className="blueprint-specs-footer">
            <div className="footer-spec-box">
              <span className="spec-sub">{isEs ? 'DIMENSIÓN' : 'DIMENSION'}</span>
              <strong>{calculatedEstimate.areaOrUnits}</strong>
            </div>
            <div className="footer-spec-box">
              <span className="spec-sub">{isEs ? 'PRESUPUESTO ESTIMADO' : 'LIVE ESTIMATE'}</span>
              <strong className="text-accent">{calculatedEstimate.formatted}</strong>
            </div>
            <div className="footer-spec-box">
              <span className="spec-sub">{isEs ? 'NORMA APLICABLE' : 'STANDARD'}</span>
              <strong>AWS D1.1 / ASTM</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Scoped CSS */}
      <style>{`
        .estimator-blueprint-section {
          padding-top: 20px;
          padding-bottom: 70px;
        }

        /* Stepper navigation */
        .calculator-stepper-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .step-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .step-nav-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
        }

        .step-nav-pill.active {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
          color: #FFFFFF;
          box-shadow: 0 4px 16px rgba(224, 0, 39, 0.35);
        }

        .step-nav-pill.completed {
          border-color: #10B981;
          color: #10B981;
        }

        .step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .step-nav-pill.active .step-num {
          background: #FFFFFF;
          color: var(--color-accent, #e00027);
        }

        .step-nav-separator {
          width: 30px;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
        }

        /* Layout Grid */
        .calculator-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 32px;
          align-items: stretch;
        }

        .estimator-controls-panel {
          padding: 32px;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .calculator-step-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .calc-step-header {
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 16px;
        }

        .step-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.70rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .calc-step-header h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #020032;
          margin: 0 0 4px 0;
        }

        .calc-step-header p {
          font-size: 0.80rem;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        /* Form Inputs */
        .calc-form-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .calc-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .calc-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .calc-input-group label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #020032;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #94A3B8;
          pointer-events: none;
        }

        .calc-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #020032;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .calc-input:focus {
          background: #FFFFFF;
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 0 0 3px rgba(224, 0, 39, 0.1);
        }

        .calc-textarea {
          width: 100%;
          padding: 10px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.82rem;
          color: #020032;
          outline: none;
          resize: vertical;
          font-family: inherit;
        }

        .calc-textarea:focus {
          background: #FFFFFF;
          border-color: var(--color-accent, #e00027);
        }

        /* Sliders and Range Controls */
        .calc-custom-controls {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .calc-control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .calc-control-group label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #020032;
        }

        .slider-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .badge-measure-val {
          font-family: monospace;
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          border: 1px solid rgba(224, 0, 39, 0.25);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .calc-range-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #E2E8F0;
          outline: none;
          accent-color: var(--color-accent, #e00027);
          cursor: pointer;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: #94A3B8;
          font-family: monospace;
        }

        /* 2x2 Option Cards */
        .calc-options-grid-2x2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .calc-option-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .calc-option-card:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
        }

        .calc-option-card.active {
          background: rgba(224, 0, 39, 0.06);
          border-color: var(--color-accent, #e00027);
        }

        .opt-radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          background: #FFFFFF;
          flex-shrink: 0;
        }

        .calc-option-card.active .opt-radio {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
        }

        .opt-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: #020032;
        }

        .opt-text-block strong {
          font-size: 0.76rem;
          font-weight: 700;
          color: #020032;
          display: block;
        }

        .opt-text-block span {
          font-size: 0.68rem;
          color: #64748B;
          display: block;
        }

        /* Swatches */
        .calc-swatch-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .calc-swatch-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .calc-swatch-btn.active {
          border-color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.06);
        }

        .swatch-circle {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .swatch-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #020032;
        }

        /* Step Actions */
        .calc-step-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 10px;
          padding-top: 14px;
          border-top: 1px solid #E2E8F0;
        }

        .safe-ssl-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.70rem;
          color: #64748B;
        }

        .btn-calc-next,
        .btn-calc-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-calc-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F1F5F9;
          color: #475569;
          border: 1px solid #CBD5E1;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.80rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-calc-back:hover {
          background: #E2E8F0;
          color: #020032;
        }

        /* Result Hero Box in Step 3 */
        .calc-result-hero-box {
          background: #020032;
          color: #FFFFFF;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.2);
        }

        .result-label {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-accent, #e00027);
        }

        .result-amount-display {
          font-size: 2.2rem;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: -0.02em;
        }

        .result-scope-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #E2E8F0;
        }

        .calc-summary-specs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 16px;
        }

        .calc-spec-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .spec-name {
          color: #64748B;
          font-weight: 600;
        }

        .spec-val {
          color: #020032;
          font-weight: 700;
          text-align: right;
        }

        .calc-footnote-guarantee {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.70rem;
          color: #64748B;
          margin-top: 4px;
        }

        /* Success View */
        .calc-success-view {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 30px 10px;
        }

        .calc-success-badge {
          color: #10B981;
        }

        .calc-folio-tag {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 12px;
          border-radius: 6px;
        }

        .calc-success-view h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #020032;
          margin: 0;
        }

        .calc-success-view p {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        .calc-success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 380px;
          margin-top: 14px;
        }

        .btn-calc-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #25D366;
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
        }

        .btn-calc-wa:hover {
          background: #1EBE5D;
        }

        .btn-calc-restart {
          background: transparent;
          border: 1px solid #CBD5E1;
          color: #64748B;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.80rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* Right Column: Blueprint Board */
        .estimator-blueprint-board {
          display: flex;
          flex-direction: column;
          background: #0B0E17;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .blueprint-board-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cad-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: #E2E8F0;
          letter-spacing: 0.06em;
        }

        .cad-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cad-live-tag {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 800;
          background: rgba(37, 211, 102, 0.15);
          color: #25D366;
          border: 1px solid rgba(37, 211, 102, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .blueprint-canvas-viewport {
          flex: 1;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #070913;
          position: relative;
        }

        .cad-interactive-svg {
          width: 100%;
          height: 100%;
          max-height: 380px;
          display: block;
        }

        .blueprint-specs-footer {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-spec-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .spec-sub {
          font-family: monospace;
          font-size: 0.65rem;
          color: #94A3B8;
          letter-spacing: 0.04em;
        }

        .footer-spec-box strong {
          font-size: 0.82rem;
          color: #FFFFFF;
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .calculator-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .calc-form-row,
          .calc-options-grid-2x2 {
            grid-template-columns: 1fr;
          }
          .blueprint-specs-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </section>
  );
}
