import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Play, ShieldCheck, Cpu, Anchor, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const { t, language } = useLanguage();

  // Selected product state
  const [selectedProd, setSelectedProd] = useState('stairs');
  // Visual view toggle: 'render' or 'cad'
  const [viewMode, setViewMode] = useState('render');
  
  // Animation states for the "Laser Cutting" sequence
  const [isFabricating, setIsFabricating] = useState(true);
  const [laserProgress, setLaserProgress] = useState(0); // 0 to 1

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameId = useRef(null);
  const sparksRef = useRef([]);

  // Product definitions
  const products = {
    stairs: {
      nameEn: 'Floating Staircase System',
      nameEs: 'Sistema de Escalera Flotante',
      descEn: 'Walnut treads with structural steel backing and heavy duty cable guardrails.',
      descEs: 'Peldaños de nogal con soporte estructural de acero y barandal de cable de alta resistencia.',
      angle: '34°',
      mounting: language === 'en' ? 'Floor/Wall Anchor' : 'Anclaje a Piso/Muro',
      capacity: '400 lbs',
      // Coordinates of stairs for laser path drawing
      pathPoints: [
        { x: 30, y: 210 }, // Floor start
        { x: 100, y: 190 }, // Step 1 start
        { x: 150, y: 190 },
        { x: 170, y: 155 }, // Step 2 start
        { x: 220, y: 155 },
        { x: 240, y: 120 }, // Step 3 start
        { x: 290, y: 120 },
        { x: 310, y: 85 },  // Step 4 start
        { x: 360, y: 85 },
        { x: 380, y: 50 }   // Top landing
      ]
    },
    handrail: {
      nameEn: 'Modern Wall Handrail',
      nameEs: 'Pasamanos Moderno de Muro',
      descEn: 'Matte black powder-coated steel handrail with custom industrial mount brackets.',
      descEs: 'Pasamanos de acero pintado en polvo negro mate con soportes de montaje industrial.',
      angle: '30° - 38°',
      mounting: language === 'en' ? 'Wall Bracket Studs' : 'Soportes de Muro a Perno',
      capacity: '250 lbs',
      pathPoints: [
        { x: 50, y: 160 }, // Left plate
        { x: 90, y: 130 },  // Left bracket arm joint
        { x: 40, y: 140 },  // Left end of handrail
        { x: 360, y: 40 },  // Right end of handrail
        { x: 310, y: 55 },  // Right bracket arm joint
        { x: 270, y: 85 }   // Right plate
      ]
    },
    glass: {
      nameEn: 'Tempered Glass Railing',
      nameEs: 'Barandal de Vidrio Templado',
      descEn: 'Satin brushed stainless steel posts clamping thick 1/2" tempered safety glass.',
      descEs: 'Postes de acero inoxidable cepillado con abrazaderas para cristal templado de 12mm.',
      angle: '90° (Flat)',
      mounting: language === 'en' ? 'Floor/Fascia Mount' : 'Montaje a Piso o Lateral',
      capacity: '300 lbs',
      pathPoints: [
        { x: 30, y: 180 },  // Ground line
        { x: 370, y: 180 },
        { x: 70, y: 180 },  // Post 1 vertical cut
        { x: 70, y: 60 },
        { x: 330, y: 180 }, // Post 2 vertical cut
        { x: 330, y: 60 },
        { x: 80, y: 70 },   // Glass panel outline
        { x: 320, y: 70 },
        { x: 320, y: 175 },
        { x: 80, y: 175 }
      ]
    }
  };

  // Trigger fabrication animation when changing products
  useEffect(() => {
    setIsFabricating(true);
    setLaserProgress(0);
    sparksRef.current = [];

    let startTime = null;
    const duration = 1200; // Fast-paced cutting (1.2 seconds)

    const animateLaser = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      setLaserProgress(progress);

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animateLaser);
      } else {
        setTimeout(() => {
          setIsFabricating(false);
        }, 300);
      }
    };

    animationFrameId.current = requestAnimationFrame(animateLaser);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [selectedProd]);

  // Particle Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let loopId;

    const resizeCanvas = () => {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const activeProduct = products[selectedProd];
    const points = activeProduct.pathPoints;

    const updateSparks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isFabricating && points.length > 1) {
        const segmentCount = points.length - 1;
        const targetSegmentFloat = laserProgress * segmentCount;
        const segmentIdx = Math.floor(targetSegmentFloat);
        const segmentProgress = targetSegmentFloat - segmentIdx;

        let lx = 0;
        let ly = 0;

        if (segmentIdx >= segmentCount) {
          const lastPoint = points[points.length - 1];
          lx = lastPoint.x;
          ly = lastPoint.y;
        } else {
          const p1 = points[segmentIdx];
          const p2 = points[segmentIdx + 1];
          lx = p1.x + (p2.x - p1.x) * segmentProgress;
          ly = p1.y + (p2.y - p1.y) * segmentProgress;
        }

        const scaleX = canvas.width / 400;
        const scaleY = canvas.height / 240;
        const cx = lx * scaleX;
        const cy = ly * scaleY;

        const sparksToEmit = 4;
        for (let i = 0; i < sparksToEmit; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4.5;
          sparksRef.current.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5, // push upwards
            gravity: 0.15,
            alpha: 1.0,
            decay: 0.02 + Math.random() * 0.02,
            size: 1.5 + Math.random() * 2,
            color: '#e00027'
          });
        }

        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#e00027';
        ctx.fillStyle = '#e00027';
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      loopId = requestAnimationFrame(updateSparks);
    };

    updateSparks();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(loopId);
    };
  }, [selectedProd, isFabricating, laserProgress]);

  // Interpolates SVG drawing path for real-time laser effect
  const renderLaserSVGPath = () => {
    const points = products[selectedProd].pathPoints;
    if (points.length < 2) return null;

    const segmentCount = points.length - 1;
    const targetSegmentFloat = laserProgress * segmentCount;
    const currentSegmentIdx = Math.floor(targetSegmentFloat);

    let pathString = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i <= currentSegmentIdx; i++) {
      pathString += ` L ${points[i].x} ${points[i].y}`;
    }

    if (currentSegmentIdx < segmentCount) {
      const p1 = points[currentSegmentIdx];
      const p2 = points[currentSegmentIdx + 1];
      const partialT = targetSegmentFloat - currentSegmentIdx;
      const lx = p1.x + (p2.x - p1.x) * partialT;
      const ly = p1.y + (p2.y - p1.y) * partialT;
      pathString += ` L ${lx} ${ly}`;
    }

    return (
      <path 
        d={pathString} 
        fill="none" 
        stroke="var(--color-accent)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        className="laser-cut-path"
      />
    );
  };

  const getProductSpecs = () => products[selectedProd];

  return (
    <section className="hero-section" id="home">
      <div className="blueprint-grid"></div>
      <div className="gradient-radial-glow pulse-glow" style={{ top: '10%', right: '10%' }}></div>
      <div className="gradient-radial-glow pulse-glow" style={{ bottom: '15%', left: '5%', width: '300px', height: '300px' }}></div>

      <div className="container hero-container">
        {/* Left Column: Localized Text & CTAs */}
        <div className="hero-content">
          <div className="hero-badge-wrapper">
            <span className="hero-badge">
              <span className="badge-dot"></span>
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="hero-title">
            <span className="text-gradient block">{t('hero.title1')}</span>
            <span className="text-accent block">{t('hero.title2')}</span>
          </h1>

          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>

          <div className="hero-ctas">
            <a href="#configurator" className="btn-primary hero-btn-main">
              {t('hero.ctaPrimary')}
              <ArrowRight size={16} />
            </a>
            <a href="#showroom" className="btn-secondary hero-btn-sec">
              <Play size={16} className="play-icon" />
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>

        {/* Right Column: Laser Fabricator & Interactive Showcase */}
        <div className="hero-showcase-column">
          <div className="showcase-tabs">
            <button 
              className={`showcase-tab ${selectedProd === 'stairs' ? 'active' : ''}`}
              onClick={() => setSelectedProd('stairs')}
            >
              {language === 'en' ? 'Stairs' : 'Escaleras'}
            </button>
            <button 
              className={`showcase-tab ${selectedProd === 'handrail' ? 'active' : ''}`}
              onClick={() => setSelectedProd('handrail')}
            >
              {language === 'en' ? 'Handrails' : 'Pasamanos'}
            </button>
            <button 
              className={`showcase-tab ${selectedProd === 'glass' ? 'active' : ''}`}
              onClick={() => setSelectedProd('glass')}
            >
              {language === 'en' ? 'Glass Railings' : 'Barandales'}
            </button>
          </div>

          <div className="schematic-card glass-panel">
            {/* Structural corner marks */}
            <div className="schematic-corner tl"></div>
            <div className="schematic-corner tr"></div>
            <div className="schematic-corner bl"></div>
            <div className="schematic-corner br"></div>

            <div className="schematic-header">
              <span className="schematic-title">
                {selectedProd.toUpperCase()}_3D_ISOMETRIC.DXF
              </span>
              <span className="schematic-status">
                {isFabricating ? '⚡ LASER FABRICATING...' : 'READY'}
              </span>
            </div>

            {/* Main Interactive Graphic Canvas & SVG */}
            <div className="schematic-body-container">
              <div className={`schematic-body ${isFabricating ? 'raw-steel-plate' : 'finished-surface'}`}>
                
                {/* SVG Visual Renders */}
                <svg className="schematic-svg" viewBox="0 0 400 240">
                  {/* Grid Lines behind */}
                  <g opacity={isFabricating ? 0.05 : 0.08} stroke="currentColor" strokeWidth="0.5">
                    <line x1="0" y1="60" x2="400" y2="60" />
                    <line x1="0" y1="120" x2="400" y2="120" />
                    <line x1="0" y1="180" x2="400" y2="180" />
                    <line x1="100" y1="0" x2="100" y2="240" />
                    <line x1="200" y1="0" x2="200" y2="240" />
                    <line x1="300" y1="0" x2="300" y2="240" />
                  </g>

                  {/* Ground reference line in perspective */}
                  <polygon points="10,210 390,210 370,225 30,225" fill="rgba(0,0,0,0.02)" stroke="var(--color-border)" strokeWidth="1" />

                  {/* LASER PATH DRAWING (When fabricating) */}
                  {isFabricating && renderLaserSVGPath()}

                  {/* DETAILED RENDER VIEW (Idle state) */}
                  {!isFabricating && (
                    <g className="render-graphics-group">
                      {selectedProd === 'stairs' && (
                        <>
                          {/* 3D Isometric concrete floor base */}
                          <polygon points="30,210 200,210 180,225 10,225" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="1" />
                          
                          {/* Stairs background 3D structural stringer support */}
                          <polygon points="50,185 65,185 325,45 310,45" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                          <polygon points="65,185 65,195 325,55 325,45" fill="#212121" stroke="#263238" strokeWidth="0.5" />
                          
                          {/* Wall anchor plate at bottom */}
                          <polygon points="35,185 55,185 55,200 35,200" fill="#78909C" stroke="#37474F" strokeWidth="0.5" />
                          <circle cx="40" cy="190" r="1.5" fill="#CFD8DC" />
                          <circle cx="50" cy="190" r="1.5" fill="#CFD8DC" />
                          <circle cx="40" cy="196" r="1.5" fill="#CFD8DC" />
                          <circle cx="50" cy="196" r="1.5" fill="#CFD8DC" />
                          
                          {/* Floating Wooden Treads with 3D isometric perspective */}
                          {/* Step 1 */}
                          <g>
                            {/* Tread Top Face */}
                            <polygon points="100,172 135,172 145,162 110,162" fill="url(#tread-wood-top)" stroke="#8D6E63" strokeWidth="0.5" />
                            {/* Tread Front Face */}
                            <rect x="100" y="172" width="35" height="6" fill="url(#tread-wood-front)" stroke="#5D4037" strokeWidth="0.5" rx="0.5" />
                            {/* Tread Side Face */}
                            <polygon points="135,172 145,162 145,168 135,178" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
                            {/* Wood grain details */}
                            <line x1="105" y1="174" x2="125" y2="174" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                            <line x1="112" y1="165" x2="132" y2="165" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                          </g>

                          {/* Step 2 */}
                          <g>
                            <polygon points="170,137 205,137 215,127 180,127" fill="url(#tread-wood-top)" stroke="#8D6E63" strokeWidth="0.5" />
                            <rect x="170" y="137" width="35" height="6" fill="url(#tread-wood-front)" stroke="#5D4037" strokeWidth="0.5" rx="0.5" />
                            <polygon points="205,137 215,127 215,133 205,143" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
                            <line x1="175" y1="139" x2="195" y2="139" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                            <line x1="182" y1="130" x2="202" y2="130" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                          </g>

                          {/* Step 3 */}
                          <g>
                            <polygon points="240,102 275,102 285,92 250,92" fill="url(#tread-wood-top)" stroke="#8D6E63" strokeWidth="0.5" />
                            <rect x="240" y="102" width="35" height="6" fill="url(#tread-wood-front)" stroke="#5D4037" strokeWidth="0.5" rx="0.5" />
                            <polygon points="275,102 285,92 285,98 275,108" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
                            <line x1="245" y1="104" x2="265" y2="104" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                            <line x1="252" y1="95" x2="272" y2="95" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                          </g>

                          {/* Step 4 */}
                          <g>
                            <polygon points="310,67 345,67 355,57 320,57" fill="url(#tread-wood-top)" stroke="#8D6E63" strokeWidth="0.5" />
                            <rect x="310" y="67" width="35" height="6" fill="url(#tread-wood-front)" stroke="#5D4037" strokeWidth="0.5" rx="0.5" />
                            <polygon points="345,67 355,57 355,63 345,73" fill="#5D4037" stroke="#3E2723" strokeWidth="0.5" />
                            <line x1="315" y1="69" x2="335" y2="69" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                            <line x1="322" y1="60" x2="342" y2="60" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                          </g>

                          {/* 3D Round Steel Baluster Posts */}
                          {/* Post 1 */}
                          <g>
                            {/* Base Plate Flange */}
                            <polygon points="107,171 127,171 133,165 113,165" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="107,171 127,171 127,174 107,174" fill="#212121" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="127,171 133,165 133,168 127,174" fill="#1C2123" />
                            {/* Anchor bolts detail */}
                            <circle cx="111" cy="172.5" r="0.8" fill="#FFF" />
                            <circle cx="123" cy="172.5" r="0.8" fill="#FFF" />
                            {/* Round Post column */}
                            <rect x="117" y="85" width="6" height="82" fill="url(#metal-grad)" stroke="#263238" strokeWidth="0.5" />
                            {/* Post Cylindrical Shading Highlight */}
                            <rect x="118" y="85" width="1.5" height="82" fill="rgba(255,255,255,0.4)" />
                          </g>

                          {/* Post 2 */}
                          <g>
                            <polygon points="247,101 267,101 273,95 253,95" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="247,101 267,101 267,104 247,104" fill="#212121" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="267,101 273,95 273,98 267,104" fill="#1C2123" />
                            <circle cx="251" cy="102.5" r="0.8" fill="#FFF" />
                            <circle cx="263" cy="102.5" r="0.8" fill="#FFF" />
                            <rect x="257" y="50" width="6" height="51" fill="url(#metal-grad)" stroke="#263238" strokeWidth="0.5" />
                            <rect x="258" y="50" width="1.5" height="51" fill="rgba(255,255,255,0.4)" />
                          </g>

                          {/* 3D Tensioned Cable Guardrails */}
                          <g stroke="#78909C" strokeWidth="1">
                            {/* Cable 1 */}
                            <line x1="120" y1="105" x2="260" y2="70" />
                            <line x1="260" y1="70" x2="330" y2="52" />
                            {/* Cable 2 */}
                            <line x1="120" y1="120" x2="260" y2="85" />
                            <line x1="260" y1="85" x2="330" y2="67" />
                            {/* Cable 3 */}
                            <line x1="120" y1="135" x2="260" y2="100" />
                            <line x1="260" y1="100" x2="330" y2="82" />

                            {/* Hex Nut tensioners detailed drawing */}
                            <g fill="#B0BEC5" stroke="#37474F" strokeWidth="0.4">
                              <rect x="113" y="103.5" width="4" height="3" rx="0.5" />
                              <rect x="113" y="118.5" width="4" height="3" rx="0.5" />
                              <rect x="113" y="133.5" width="4" height="3" rx="0.5" />
                              
                              <rect x="263" y="68.5" width="4" height="3" rx="0.5" />
                              <rect x="263" y="83.5" width="4" height="3" rx="0.5" />
                              <rect x="263" y="98.5" width="4" height="3" rx="0.5" />
                            </g>
                          </g>

                          {/* Handrail cylindrical top bar floating in perspective */}
                          <line x1="110" y1="85" x2="340" y2="30" stroke="#1A1A1C" strokeWidth="8" strokeLinecap="round" />
                          <line x1="110" y1="85" x2="340" y2="30" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
                          {/* 3D highlight glow */}
                          <line x1="110" y1="84" x2="340" y2="29" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />

                          {/* Dimension annotation lines */}
                          <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.8">
                            <line x1="365" y1="30" x2="365" y2="210" strokeDasharray="2 2" />
                            <path d="M 362,34 L 365,30 L 368,34" fill="none" />
                            <path d="M 362,206 L 365,210 L 368,206" fill="none" />
                            <text x="372" y="120" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" transform="rotate(90, 372, 120)" textAnchor="middle">H: 108.0"</text>
                            
                            <path d="M 90,210 A 40 40 0 0 1 125,188" fill="none" />
                            <text x="133" y="204" fill="var(--color-accent)" fontSize="7" fontFamily="monospace">θ = 34.0°</text>
                          </g>
                        </>
                      )}

                      {selectedProd === 'handrail' && (
                        <>
                          {/* Realistic Concrete Wall background formwork pattern */}
                          <g opacity="0.15" stroke="var(--color-text-primary)" strokeWidth="0.5">
                            {/* Panel seams */}
                            <line x1="20" y1="0" x2="20" y2="240" />
                            <line x1="200" y1="0" x2="200" y2="240" />
                            <line x1="380" y1="0" x2="380" y2="240" />
                            <line x1="0" y1="120" x2="400" y2="120" />
                            {/* Formwork tie holes */}
                            <circle cx="50" cy="40" r="2.5" fill="none" />
                            <circle cx="170" cy="40" r="2.5" fill="none" />
                            <circle cx="230" cy="40" r="2.5" fill="none" />
                            <circle cx="350" cy="40" r="2.5" fill="none" />
                            <circle cx="50" cy="180" r="2.5" fill="none" />
                            <circle cx="170" cy="180" r="2.5" fill="none" />
                            <circle cx="230" cy="180" r="2.5" fill="none" />
                            <circle cx="350" cy="180" r="2.5" fill="none" />
                          </g>

                          {/* 3D Wall mount brackets with plates, arms, and screws */}
                          {/* Bracket 1 (Left) */}
                          <g>
                            {/* Wall Plate with bevel shading */}
                            <circle cx="60" cy="160" r="14" fill="url(#metal-grad)" stroke="#37474F" strokeWidth="1" />
                            <circle cx="60" cy="160" r="10" fill="#263238" stroke="#1A2124" strokeWidth="0.5" />
                            {/* Plate Screws */}
                            <circle cx="60" cy="153" r="1.5" fill="#FFF" />
                            <circle cx="54" cy="164" r="1.5" fill="#FFF" />
                            <circle cx="66" cy="164" r="1.5" fill="#FFF" />
                            {/* Curved Cast Bracket Arm with shading */}
                            <path d="M 60,160 C 80,160 95,145 95,120" fill="none" stroke="url(#metal-grad)" strokeWidth="5.5" strokeLinecap="round" />
                            <path d="M 60,160 C 80,160 95,145 95,120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                            {/* Top collar adapter holding rail */}
                            <rect x="91" y="117" width="8" height="3" fill="#212121" rx="0.5" />
                            <circle cx="95" cy="118.5" r="0.8" fill="#FFF" />
                          </g>

                          {/* Bracket 2 (Right) */}
                          <g>
                            <circle cx="270" cy="85" r="14" fill="url(#metal-grad)" stroke="#37474F" strokeWidth="1" />
                            <circle cx="270" cy="85" r="10" fill="#263238" stroke="#1A2124" strokeWidth="0.5" />
                            <circle cx="270" cy="79" r="1.5" fill="#FFF" />
                            <circle cx="265" cy="90" r="1.5" fill="#FFF" />
                            <circle cx="275" cy="90" r="1.5" fill="#FFF" />
                            <path d="M 270,85 C 290,85 305,70 305,45" fill="none" stroke="url(#metal-grad)" strokeWidth="5.5" strokeLinecap="round" />
                            <path d="M 270,85 C 290,85 305,70 305,45" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                            <rect x="301" y="42" width="8" height="3" fill="#212121" rx="0.5" />
                            <circle cx="305" cy="43.5" r="0.8" fill="#FFF" />
                          </g>

                          {/* Heavy Duty Cylindrical Handrail with 3D highlight and endcaps */}
                          <line x1="40" y1="140" x2="360" y2="40" stroke="#111" strokeWidth="14" strokeLinecap="round" />
                          <line x1="40" y1="140" x2="360" y2="40" stroke="var(--color-accent)" strokeWidth="4.5" strokeLinecap="round" />
                          <line x1="40" y1="137" x2="360" y2="37" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                          
                          {/* 3D End Caps with steel core */}
                          <circle cx="40" cy="140" r="7" fill="#212121" stroke="#e00027" strokeWidth="1" />
                          <circle cx="40" cy="140" r="3" fill="url(#metal-grad)" />
                          
                          <circle cx="360" cy="40" r="7" fill="#212121" stroke="#e00027" strokeWidth="1" />
                          <circle cx="360" cy="40" r="3" fill="url(#metal-grad)" />

                          {/* Dimension labels */}
                          <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.8">
                            <line x1="95" y1="120" x2="60" y2="120" strokeDasharray="2 2" />
                            <line x1="60" y1="120" x2="60" y2="160" strokeDasharray="2 2" />
                            <text x="78" y="115" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" textAnchor="middle">D: 3.5"</text>
                            
                            <text x="200" y="80" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" transform="rotate(-17.3, 200, 80)" textAnchor="middle">L: 144.0"</text>
                          </g>
                        </>
                      )}

                      {selectedProd === 'glass' && (
                        <>
                          {/* 3D Concrete floor slab with texture and side depth */}
                          <polygon points="20,180 380,180 360,205 10,205" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="1" />
                          <polygon points="10,205 360,205 360,215 10,215" fill="#B0BEC5" stroke="#90A4AE" strokeWidth="1" />
                          
                          {/* Concrete aggregate stipple pattern */}
                          <circle cx="40" cy="192" r="0.5" fill="#90A4AE" />
                          <circle cx="120" cy="195" r="0.7" fill="#90A4AE" />
                          <circle cx="220" cy="190" r="0.5" fill="#90A4AE" />
                          <circle cx="300" cy="197" r="0.6" fill="#90A4AE" />

                          {/* Glass Light reflection polygons */}
                          <polygon points="80,70 320,70 320,175 80,175" fill="url(#glass-grad)" stroke="#0284C7" strokeWidth="1.5" rx="3" />
                          
                          {/* 3D safety glass chamfered interior border */}
                          <rect x="83" y="73" width="234" height="99" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                          
                          {/* Highlights */}
                          <polygon points="130,73 180,73 220,172 170,172" fill="rgba(255,255,255,0.22)" />
                          <polygon points="230,73 245,73 285,172 270,172" fill="rgba(255,255,255,0.12)" />

                          {/* 3D Square Stainless Steel Posts */}
                          {/* Post 1 (Left) */}
                          <g>
                            {/* Base Plate Flange */}
                            <polygon points="62,175 82,175 88,169 68,169" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="62,175 82,175 82,181 62,181" fill="#212121" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="82,175 88,169 88,175 82,181" fill="#1C2123" />
                            <circle cx="66" cy="178" r="1" fill="#FFF" />
                            <circle cx="78" cy="178" r="1" fill="#FFF" />
                            {/* Post Column */}
                            <rect x="71" y="60" width="8" height="115" fill="url(#metal-grad)" stroke="#37474F" strokeWidth="0.5" />
                            <rect x="72" y="60" width="2" height="115" fill="rgba(255,255,255,0.4)" />
                            {/* Post top cap */}
                            <polygon points="70,60 79,60 81,58 72,58" fill="#212121" />
                          </g>

                          {/* Post 2 (Right) */}
                          <g>
                            <polygon points="322,175 342,175 348,169 328,169" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="322,175 342,175 342,181 322,181" fill="#212121" stroke="#263238" strokeWidth="0.5" />
                            <polygon points="342,175 348,169 348,175 342,181" fill="#1C2123" />
                            <circle cx="326" cy="178" r="1" fill="#FFF" />
                            <circle cx="338" cy="178" r="1" fill="#FFF" />
                            <rect x="331" y="60" width="8" height="115" fill="url(#metal-grad)" stroke="#37474F" strokeWidth="0.5" />
                            <rect x="332" y="60" width="2" height="115" fill="rgba(255,255,255,0.4)" />
                            <polygon points="330,60 339,60 341,58 332,58" fill="#212121" />
                          </g>

                          {/* Glass Clamps with detailed gasket lines and socket screws */}
                          <g fill="#78909C" stroke="#37474F" strokeWidth="0.5">
                            {/* Post 1 Top Clamp */}
                            <rect x="79" y="80" width="7" height="13" rx="1.5" />
                            <line x1="79.5" y1="81" x2="79.5" y2="92" stroke="#000" strokeWidth="1" /> {/* Gasket */}
                            <circle cx="82.5" cy="86.5" r="1.2" fill="#ECEFF1" /> {/* Center screw */}

                            {/* Post 1 Bottom Clamp */}
                            <rect x="79" y="135" width="7" height="13" rx="1.5" />
                            <line x1="79.5" y1="136" x2="79.5" y2="147" stroke="#000" strokeWidth="1" />
                            <circle cx="82.5" cy="141.5" r="1.2" fill="#ECEFF1" />

                            {/* Post 2 Top Clamp */}
                            <rect x="326" y="80" width="7" height="13" rx="1.5" />
                            <line x1="332.5" y1="81" x2="332.5" y2="92" stroke="#000" strokeWidth="1" />
                            <circle cx="329.5" cy="86.5" r="1.2" fill="#ECEFF1" />

                            {/* Post 2 Bottom Clamp */}
                            <rect x="326" y="135" width="7" height="13" rx="1.5" />
                            <line x1="332.5" y1="136" x2="332.5" y2="147" stroke="#000" strokeWidth="1" />
                            <circle cx="329.5" cy="141.5" r="1.2" fill="#ECEFF1" />
                          </g>

                          {/* Dimension annotation lines */}
                          <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.8">
                            <line x1="80" y1="50" x2="320" y2="50" strokeDasharray="2 2" />
                            <path d="M 85,47 L 80,50 L 85,53" fill="none" />
                            <path d="M 315,47 L 320,50 L 315,63" fill="none" />
                            <text x="200" y="44" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" textAnchor="middle">W: 96.0"</text>
                            
                            <line x1="365" y1="60" x2="365" y2="180" strokeDasharray="2 2" />
                            <path d="M 362,64 L 365,60 L 368,64" fill="none" />
                            <path d="M 362,176 L 365,180 L 368,176" fill="none" />
                            <text x="373" y="120" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" transform="rotate(90, 373, 120)" textAnchor="middle">H: 42.0"</text>
                          </g>
                        </>
                      )}
                    </g>
                  )}

                  {/* Defs gradients */}
                  <defs>
                    <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ECEFF1" />
                      <stop offset="50%" stopColor="#90A4AE" />
                      <stop offset="100%" stopColor="#546E7A" />
                    </linearGradient>
                    <linearGradient id="tread-wood-top" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E5D3C3" />
                      <stop offset="100%" stopColor="#B58A63" />
                    </linearGradient>
                    <linearGradient id="tread-wood-front" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#B58A63" />
                      <stop offset="100%" stopColor="#7F5539" />
                    </linearGradient>
                    <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(224, 242, 254, 0.45)" />
                      <stop offset="100%" stopColor="rgba(186, 230, 253, 0.15)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Particle Sparks Canvas */}
                <canvas ref={canvasRef} className="hero-spark-canvas" />
              </div>
            </div>

            {/* Technical product descriptions */}
            <div className="schematic-footer-details">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedProd}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="product-specs-panel"
                >
                  <div className="spec-row">
                    <span className="spec-name">
                      {language === 'en' ? getProductSpecs().nameEn : getProductSpecs().nameEs}
                    </span>
                  </div>
                  <p className="spec-desc-text">
                    {language === 'en' ? getProductSpecs().descEn : getProductSpecs().descEs}
                  </p>
                  
                  <div className="specs-grid">
                    <div>
                      <span className="grid-label">ANGLE</span>
                      <span className="grid-value">{getProductSpecs().angle}</span>
                    </div>
                    <div>
                      <span className="grid-label">MOUNT</span>
                      <span className="grid-value">{getProductSpecs().mounting}</span>
                    </div>
                    <div>
                      <span className="grid-label">MAX CAPACITY</span>
                      <span className="grid-value">{getProductSpecs().capacity}</span>
                    </div>
                  </div>

                  {selectedProd === 'stairs' && (
                    <div style={{ marginTop: '12px', borderTop: '1px dashed var(--color-border)', paddingTop: '12px' }}>
                      <a href="#/staircase-system" className="btn btn-secondary w-full" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '0.72rem', backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', transition: 'var(--transition-fast)' }}>
                        <Settings size={12} className="text-accent" />
                        <span>{language === 'en' ? 'View Technical Product Page' : 'Ver Ficha Técnica de Producto'}</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section at the bottom of hero */}
      <div className="hero-stats-bar">
        <div className="container stats-container">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Anchor className="stat-icon" />
            </div>
            <div>
              <h3>{t('hero.statUSA')}</h3>
              <p>{t('hero.statUSASub')}</p>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Cpu className="stat-icon" />
            </div>
            <div>
              <h3>{t('hero.statPrecision')}</h3>
              <p>{t('hero.statPrecisionSub')}</p>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <ShieldCheck className="stat-icon" />
            </div>
            <div>
              <h3>{t('hero.statWarranty')}</h3>
              <p>{t('hero.statWarrantySub')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding-top: 160px;
          padding-bottom: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 60px;
          align-items: center;
          z-index: 10;
        }

        .hero-content {
          max-width: 680px;
        }

        .hero-badge-wrapper {
          margin-bottom: 24px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--color-border);
          border-radius: 30px;
          padding: 6px 16px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background-color: var(--color-accent);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(var(--color-accent-rgb), 0.4);
        }

        .hero-title {
          font-size: 3.5rem;
          line-height: 1.05;
          margin-bottom: 24px;
          cursor: default;
        }

        .hero-title span {
          transition: filter 0.4s ease, transform 0.4s ease;
        }

        .hero-title:hover span {
          filter: drop-shadow(0 0 15px rgba(var(--color-accent-rgb), 0.12));
        }

        .hero-title .block {
          display: block;
        }

        .hero-subtitle {
          color: var(--color-text-secondary);
          font-size: 1.15rem;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hero-btn-main {
          padding: 16px 36px;
          font-size: 0.9rem;
        }

        .hero-btn-sec {
          padding: 16px 36px;
          font-size: 0.9rem;
        }

        .play-icon {
          fill: currentColor;
        }

        /* Product Showcase Area */
        .hero-showcase-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .showcase-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: var(--color-surface-base);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .showcase-tab {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.8rem;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .showcase-tab.active {
          background: var(--color-bg);
          color: var(--color-accent);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .schematic-card {
          position: relative;
          width: 100%;
          padding: 24px;
          border-radius: 12px;
          overflow: hidden;
        }

        .schematic-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1.5px solid var(--color-text-muted);
          pointer-events: none;
          opacity: 0.5;
        }

        .schematic-corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
        .schematic-corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
        .schematic-corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
        .schematic-corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; }

        .schematic-header {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .schematic-status {
          color: var(--color-accent);
          letter-spacing: 0.05em;
          font-weight: bold;
        }

        .schematic-body-container {
          position: relative;
          background: rgba(0, 0, 0, 0.015);
          border-radius: 6px;
          overflow: hidden;
        }

        .schematic-body {
          display: flex;
          justify-content: center;
          padding: 12px;
          transition: background 0.3s ease;
          position: relative;
        }

        .schematic-body.raw-steel-plate {
          background: rgba(17, 17, 19, 0.95);
        }

        .schematic-body.finished-surface {
          background: rgba(0, 0, 0, 0.01);
        }

        .schematic-svg {
          width: 100%;
          height: auto;
          z-index: 2;
        }

        .hero-spark-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        .laser-cut-path {
          filter: drop-shadow(0 0 6px var(--color-accent));
        }

        .schematic-footer-details {
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
          margin-top: 16px;
        }

        .product-specs-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .spec-row {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-text-primary);
        }

        .spec-desc-text {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
          margin-top: 4px;
        }

        .grid-label {
          display: block;
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          margin-bottom: 2px;
        }

        .grid-value {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        /* Stats Bar */
        .hero-stats-bar {
          margin-top: 100px;
          width: 100%;
          border-top: 1px solid var(--color-border);
          background: rgba(248, 249, 250, 0.85);
          backdrop-filter: blur(10px);
          padding: 24px 0;
          z-index: 10;
        }

        .stats-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.015);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
        }

        .stat-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .stat-card p {
          color: var(--color-text-secondary);
          font-size: 0.85rem;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border);
        }

        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-content {
            text-align: center;
            max-width: 100%;
          }
          .hero-badge-wrapper, .hero-ctas {
            justify-content: center;
          }
          .hero-graphics {
            width: 100%;
          }
          .stats-container {
            flex-direction: column;
            gap: 32px;
          }
          .stat-divider {
            display: none;
          }
          .stat-card {
            width: 100%;
            justify-content: center;
            text-align: center;
            flex-direction: column;
          }
          .hero-section {
            padding-top: 120px;
          }
        }

        @media (max-width: 600px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-ctas {
            flex-direction: column;
            width: 100%;
          }
          .hero-ctas a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
