import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Ruler, Scissors, Flame, Truck, CheckCircle, Workflow } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProcessFlow() {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const stepRefs = useRef([]);
  const sparksRef = useRef([]);

  const steps = [
    {
      num: '01',
      icon: Ruler,
      title: t('process.step1Title'),
      desc: t('process.step1Desc'),
      techCode: 'CAD_DRAFT.01'
    },
    {
      num: '02',
      icon: Scissors,
      title: t('process.step2Title'),
      desc: t('process.step2Desc'),
      techCode: 'TIG_WELD.02'
    },
    {
      num: '03',
      icon: Flame,
      title: t('process.step3Title'),
      desc: t('process.step3Desc'),
      techCode: 'POWDER_COAT.03'
    },
    {
      num: '04',
      icon: CheckCircle,
      title: t('process.step4Title'),
      desc: t('process.step4Desc'),
      techCode: 'QC_METROLOGY.04'
    },
    {
      num: '05',
      icon: Truck,
      title: t('process.step5Title'),
      desc: t('process.step5Desc'),
      techCode: 'TRANSIT_LOGISTICS.05'
    }
  ];

  // Monitor scroll positions of each step card to set active step
  useEffect(() => {
    const handleScroll = () => {
      const viewHeight = window.innerHeight;
      const midPoint = viewHeight / 2.2; // center bias

      let currentActive = 0;
      let minDistance = Infinity;

      stepRefs.current.forEach((ref, idx) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - midPoint);
        if (distance < minDistance) {
          minDistance = distance;
          currentActive = idx;
        }
      });

      setActiveStep(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Welding sparks canvas loop (Active only during activeStep === 1 - welding stage)
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

    const updateSparks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sparks = sparksRef.current;

      // 1. Emit sparks at the joint location if activeStep is Welding (1)
      if (activeStep === 1) {
        // Joint position at SVG coords transformed to canvas
        const scaleX = canvas.width / 400;
        const scaleY = canvas.height / 300;
        
        // Let's emit sparks at two joints (base and clamp)
        const joints = [
          { x: 200 * scaleX, y: 220 * scaleY },
          { x: 200 * scaleX, y: 110 * scaleY }
        ];

        joints.forEach(j => {
          for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.0 + Math.random() * 3.5;
            sparks.push({
              x: j.x,
              y: j.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 0.5,
              gravity: 0.1,
              alpha: 1.0,
              decay: 0.02 + Math.random() * 0.02,
              size: 1 + Math.random() * 1.5,
              color: '#3B82F6' // Electric welding sparks
            });
          }
        });
      }

      // 2. Render & update existing sparks
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
  }, [activeStep]);

  return (
    <section className="process-flow-section" id="process" ref={sectionRef}>
      <div className="blueprint-grid"></div>

      <div className="container process-container">
        {/* Left Column: Stuck Assembly Graphics Visualizer */}
        <div className="process-stuck-visualizer">
          <div className="visualizer-card glass-panel">
            <div className="schematic-corner tl"></div>
            <div className="schematic-corner tr"></div>
            <div className="schematic-corner bl"></div>
            <div className="schematic-corner br"></div>

            <div className="visualizer-header">
              <span className="visualizer-title">LIVE_FABRICATION_CYCLE.DAT</span>
              <span className="visualizer-status">
                {activeStep === 0 && '✏️ DRAFTING'}
                {activeStep === 1 && '⚡ WELDING'}
                {activeStep === 2 && '🎨 POWDER COATING'}
                {activeStep === 3 && '🔎 QC PASSING'}
                {activeStep === 4 && '📦 READY FOR PACKING'}
              </span>
            </div>

            {/* Dynamic Rendering Canvas and SVG */}
            <div className="visualizer-body">
              <svg className="assembly-svg" viewBox="0 0 400 300">
                <defs>
                  {/* Metal Post 3D finishes */}
                  <linearGradient id="post-front-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#37474F" />
                    <stop offset="30%" stopColor="#90A4AE" />
                    <stop offset="70%" stopColor="#455A64" />
                    <stop offset="100%" stopColor="#263238" />
                  </linearGradient>

                  <linearGradient id="post-side-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#212121" />
                    <stop offset="100%" stopColor="#111111" />
                  </linearGradient>

                  <linearGradient id="post-coated-front" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A2A2E" />
                    <stop offset="50%" stopColor="#4A4A52" />
                    <stop offset="70%" stopColor="#2A2A2E" />
                    <stop offset="100%" stopColor="#161618" />
                  </linearGradient>

                  <linearGradient id="post-coated-side" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E1E20" />
                    <stop offset="100%" stopColor="#0B0B0C" />
                  </linearGradient>

                  <linearGradient id="concrete-floor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ECEFF1" />
                    <stop offset="100%" stopColor="#B0BEC5" />
                  </linearGradient>

                  <linearGradient id="coating-cloud-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF5A09" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FF5A09" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="wood-crate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D7CCC8" />
                    <stop offset="50%" stopColor="#A1887F" />
                    <stop offset="100%" stopColor="#5D4037" />
                  </linearGradient>
                </defs>

                {/* 3D Slab Base (Concrete Floor) */}
                <polygon points="20,240 380,240 340,280 10,280" fill="url(#concrete-floor)" stroke="#78909C" strokeWidth="0.75" />
                <polygon points="10,280 340,280 340,286 10,286" fill="#78909C" stroke="#455A64" strokeWidth="0.5" />
                <polygon points="340,280 380,240 380,246 340,286" fill="#546E7A" stroke="#455A64" strokeWidth="0.5" />

                {/* CAD Grid Backdrop (Only in design/weld) */}
                <g opacity={activeStep <= 1 ? 0.08 : 0.02} stroke="currentColor" strokeWidth="0.5">
                  <line x1="0" y1="75" x2="400" y2="75" />
                  <line x1="0" y1="150" x2="400" y2="150" />
                  <line x1="0" y1="225" x2="400" y2="225" />
                  <line x1="100" y1="0" x2="100" y2="300" />
                  <line x1="200" y1="0" x2="200" y2="300" />
                  <line x1="300" y1="0" x2="300" y2="300" />
                </g>
                <AnimatePresence mode="wait">
                  <motion.g
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {/* MAIN 3D POST ASSEMBLY SUB-GROUPS */}
                    <g className={activeStep === 0 ? "blueprint-draft-mode" : "solid-metal-mode"}>
                      {/* Flange Mounting Base Plate (3D Bevel) */}
                      {/* Top Face */}
                      <polygon points="160,225 240,225 250,215 170,215" fill={activeStep >= 2 ? "url(#post-coated-front)" : activeStep === 1 ? "url(#post-front-metal)" : "none"} stroke="#263238" strokeWidth="0.75" />
                      {/* Front Face */}
                      <polygon points="160,225 240,225 240,231 160,231" fill={activeStep >= 2 ? "url(#post-coated-side)" : activeStep === 1 ? "url(#post-side-metal)" : "none"} stroke="#263238" strokeWidth="0.75" />
                      {/* Side Face */}
                      <polygon points="240,225 250,215 250,221 240,231" fill={activeStep >= 2 ? "url(#post-coated-side)" : activeStep === 1 ? "url(#post-side-metal)" : "none"} stroke="#263238" strokeWidth="0.75" />

                      {/* Anchor bolts & Washers */}
                      {activeStep >= 1 && (
                        <g stroke="#37474F" strokeWidth="0.5">
                          {/* Left bolts */}
                          <ellipse cx="178" cy="220" rx="3.5" ry="1.5" fill="#B0BEC5" />
                          <rect x="176.5" y="215" width="3" height="5" fill="#CFD8DC" />
                          <ellipse cx="178" cy="215" rx="1.5" ry="0.6" fill="#FFF" />

                          {/* Right bolts */}
                          <ellipse cx="232" cy="220" rx="3.5" ry="1.5" fill="#B0BEC5" />
                          <rect x="230.5" y="215" width="3" height="5" fill="#CFD8DC" />
                          <ellipse cx="232" cy="215" rx="1.5" ry="0.6" fill="#FFF" />
                        </g>
                      )}

                      {/* Main Post Tube Profile (Front and side faces) */}
                      {/* Front face of square column */}
                      <rect x="193" y="60" width="14" height="155" fill={activeStep >= 3 ? "url(#post-coated-front)" : activeStep >= 2 ? "url(#post-front-metal)" : activeStep === 1 ? "url(#post-front-metal)" : "none"} stroke="#263238" strokeWidth="0.75" />
                      {/* Side face of square column */}
                      <polygon points="207,60 213,54 213,209 207,215" fill={activeStep >= 3 ? "url(#post-coated-side)" : activeStep >= 2 ? "url(#post-side-metal)" : activeStep === 1 ? "url(#post-side-metal)" : "none"} stroke="#263238" strokeWidth="0.75" />
                      {/* Cap highlight */}
                      <polygon points="193,60 207,60 213,54 199,54" fill="#212121" stroke="#263238" strokeWidth="0.5" />

                      {/* 3D Saddle Handrail Support Bracket at top */}
                      <path d="M 197,54 L 209,54 L 209,46 C 209,46 205,46 203,40 C 201,46 197,46 197,46 Z" fill={activeStep >= 2 ? "url(#post-coated-front)" : "none"} stroke="#263238" strokeWidth="0.5" />
                      <path d="M 185,38 L 221,38 L 221,34 L 185,34 Z" fill={activeStep >= 2 ? "url(#post-coated-front)" : "none"} stroke="#263238" strokeWidth="0.5" />
                      {/* fixing screws */}
                      {activeStep >= 2 && (
                        <g fill="#FFF" stroke="#212121" strokeWidth="0.3">
                          <circle cx="192" cy="36" r="0.8" />
                          <circle cx="214" cy="36" r="0.8" />
                        </g>
                      )}

                      {/* 3D Heavy Glass Clamps fitted on post */}
                      {/* Top Clamp */}
                      <rect x="183" y="100" width="10" height="15" fill={activeStep >= 2 ? "url(#post-coated-front)" : "none"} stroke="#263238" strokeWidth="0.5" rx="0.5" />
                      <rect x="181" y="103" width="2" height="9" fill="#111" />
                      {/* Bottom Clamp */}
                      <rect x="183" y="170" width="10" height="15" fill={activeStep >= 2 ? "url(#post-coated-front)" : "none"} stroke="#263238" strokeWidth="0.5" rx="0.5" />
                      <rect x="181" y="173" width="2" height="9" fill="#111" />
                    </g>

                    {/* STEP 1: BLUEPRINT DESIGN OVERLAY (Design) */}
                    {activeStep === 0 && (
                      <g stroke="#0284C7" strokeWidth="0.75" fill="none">
                        {/* Dimension Height guideline brackets */}
                        <line x1="140" y1="54" x2="140" y2="225" />
                        <line x1="135" y1="54" x2="145" y2="54" />
                        <line x1="135" y1="225" x2="145" y2="225" />
                        <text x="130" y="140" fill="#0284C7" fontSize="8" fontFamily="monospace" transform="rotate(-90, 130, 140)" textAnchor="middle">H = 1100.00 mm</text>

                        {/* Dimension Width base flange bracket */}
                        <line x1="160" y1="245" x2="250" y2="245" />
                        <line x1="160" y1="240" x2="160" y2="250" />
                        <line x1="250" y1="240" x2="250" y2="250" />
                        <text x="205" y="255" fill="#0284C7" fontSize="8" fontFamily="monospace" textAnchor="middle">W = 90.00 mm</text>

                        {/* Welding technical annotation symbol flag */}
                        <path d="M 233,217 L 265,185 L 310,185" />
                        <polygon points="233,217 239,219 237,214" fill="#0284C7" />
                        <text x="270" y="180" fill="#0284C7" fontSize="8" fontFamily="monospace">FILLET WELD 6mm</text>
                      </g>
                    )}

                    {/* STEP 2: ROBOTIC WELDING DETAILS (Welding) */}
                    {activeStep === 1 && (
                      <g>
                        {/* Welded joints highlighted in orange/blue */}
                        <path d="M 183,217 Q 193,217 193,215" stroke="#FF5A09" strokeWidth="2.5" fill="none" />
                        <path d="M 225,225 Q 230,223 233,217" stroke="#FF5A09" strokeWidth="2.5" fill="none" />

                        {/* Weld joint ripples details */}
                        <circle cx="183" cy="217" r="4" fill="#3B82F6" className="pulse-glow" />
                        <circle cx="233" cy="217" r="4" fill="#3B82F6" className="pulse-glow" />

                        {/* Detailed Welding Torch head (TIG gas nozzle) pointing at weld joint */}
                        <g transform="translate(230, 160) rotate(-25)">
                          {/* Ceramic gas cup */}
                          <polygon points="0,35 12,38 9,52 -3,49" fill="#FF8A65" stroke="#D84315" strokeWidth="0.5" />
                          {/* Torch body handle */}
                          <rect x="-1" y="0" width="10" height="35" fill="#212121" rx="1" />
                          {/* Tungsten electrode needle */}
                          <line x1="5" y1="45" x2="5" y2="60" stroke="#FFF" strokeWidth="1.5" />
                          {/* Gas feed hose */}
                          <path d="M 5,0 C 5,-15 15,-20 15,-30" fill="none" stroke="#546E7A" strokeWidth="2" />
                          {/* Welding arc glow flash */}
                          <circle cx="5" cy="60" r="6" fill="#90CAF9" className="pulse-glow" />
                        </g>
                      </g>
                    )}

                    {/* STEP 3: ELECTROSTATIC POWDER COATING WORK (Coating) */}
                    {activeStep === 2 && (
                      <g>
                        {/* Visual sweep partition showing coating progress */}
                        {/* We mask or split-render the post: top is coated matte black, bottom is raw silver steel */}
                        {/* Top Coated Overlay (replaces top raw rects) */}
                        <rect x="193" y="60" width="14" height="60" fill="url(#post-coated-front)" stroke="#263238" strokeWidth="0.75" />
                        <polygon points="207,60 213,54 213,114 207,120" fill="url(#post-coated-side)" stroke="#263238" strokeWidth="0.75" />

                        {/* Coating transition line (laser boundary) */}
                        <line x1="180" y1="120" x2="225" y2="120" stroke="#FF5A09" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px #FF5A09)' }} />
                        <text x="232" y="123" fill="#FF5A09" fontSize="7" fontFamily="monospace" fontWeight="bold">COAT LIMIT</text>

                        {/* Electrostatic Spray Nozzle gun spraying mist */}
                        <g transform="translate(80, 70)">
                          <rect x="0" y="20" width="35" height="12" fill="#37474F" rx="1" />
                          <rect x="5" y="32" width="8" height="20" fill="#212121" transform="rotate(15, 5, 32)" />
                          {/* Spray Cloud Gradient */}
                          <polygon points="35,26 125,-10 125,75 35,26" fill="url(#coating-cloud-grad)" opacity="0.65" />
                          {/* Floating Powder Paint particles inside cloud */}
                          <circle cx="60" cy="18" r="1.5" fill="#FF5A09" opacity="0.8" />
                          <circle cx="90" cy="8" r="1.2" fill="#FF5A09" opacity="0.6" />
                          <circle cx="75" cy="35" r="1.5" fill="#FF5A09" opacity="0.8" />
                          <circle cx="105" cy="22" r="1" fill="#FF5A09" opacity="0.5" />
                        </g>
                      </g>
                    )}

                    {/* STEP 4: PRECISION QC CHECK & METROLOGY (Quality Control) */}
                    {activeStep === 3 && (
                      <g stroke="#10B981" strokeWidth="1" fill="none">
                        {/* Green measurement digital indicator calipers wrapping around clamp */}
                        <g transform="translate(140, 95)" stroke="#10B981">
                          {/* Caliper Bar */}
                          <rect x="0" y="10" width="130" height="8" fill="#ECEFF1" stroke="#10B981" strokeWidth="0.75" />
                          {/* Fixed jaw (left) */}
                          <path d="M 40,10 L 40,30 L 44,30 L 44,18 Z" fill="#CFD8DC" />
                          {/* Sliding jaw (right) */}
                          <path d="M 75,10 L 75,30 L 71,30 L 71,18 Z" fill="#CFD8DC" />
                          {/* Readout label */}
                          <text x="58" y="5" fill="#10B981" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">50.00 mm</text>
                        </g>

                        {/* Surface Roughness test callout */}
                        <path d="M 213,180 L 250,180 L 270,160" />
                        <circle cx="213" cy="180" r="12" strokeDasharray="3 1" />
                        <circle cx="213" cy="180" r="2.5" fill="#10B981" />
                        
                        {/* Technical quality assessment overlay HUD panel */}
                        <g transform="translate(250, 110)">
                          <rect x="0" y="0" width="105" height="42" fill="rgba(16, 185, 129, 0.04)" stroke="#10B981" strokeWidth="0.75" rx="3" />
                          <text x="6" y="12" fill="#10B981" fontSize="7" fontFamily="monospace" fontWeight="bold">QC_METROLOGY_PASS</text>
                          <text x="6" y="24" fill="var(--color-text-secondary)" fontSize="6" fontFamily="monospace">DFT_COAT: 3.2 MILS</text>
                          <text x="6" y="34" fill="var(--color-text-secondary)" fontSize="6" fontFamily="monospace">LOAD: 200 LBS PASS</text>
                        </g>
                      </g>
                    )}

                    {/* STEP 5: DETAILED 3D WOODEN SHIPPING CRATE (Delivery) */}
                    {activeStep === 4 && (
                      <g>
                        {/* The 3D Wooden Shipping Crate surrounding the post */}
                        {/* Draw back faces first */}
                        <polygon points="120,40 280,40 280,240 120,240" fill="url(#wood-crate-grad)" stroke="#5D4037" strokeWidth="1" />
                        
                        {/* Draw some wood texture lines in background */}
                        <line x1="120" y1="80" x2="280" y2="80" stroke="#5D4037" strokeWidth="0.5" opacity="0.3" />
                        <line x1="120" y1="140" x2="280" y2="140" stroke="#5D4037" strokeWidth="0.5" opacity="0.3" />
                        
                        {/* The metal brackets, packing bands wrap around */}
                        <rect x="145" y="40" width="8" height="200" fill="#455A64" stroke="#263238" strokeWidth="0.5" opacity="0.8" />
                        <rect x="245" y="40" width="8" height="200" fill="#455A64" stroke="#263238" strokeWidth="0.5" opacity="0.8" />

                        {/* Front planks frame */}
                        {/* Horizontal top plank */}
                        <rect x="110" y="30" width="180" height="24" fill="url(#wood-crate-grad)" stroke="#5D4037" strokeWidth="1.5" />
                        {/* Horizontal bottom plank */}
                        <rect x="110" y="226" width="180" height="24" fill="url(#wood-crate-grad)" stroke="#5D4037" strokeWidth="1.5" />
                        {/* Left vertical framing plank */}
                        <rect x="110" y="54" width="22" height="172" fill="url(#wood-crate-grad)" stroke="#5D4037" strokeWidth="1.5" />
                        {/* Right vertical framing plank */}
                        <rect x="268" y="54" width="22" height="172" fill="url(#wood-crate-grad)" stroke="#5D4037" strokeWidth="1.5" />

                        {/* Heavy metal corner braces with bolts */}
                        {/* TL corner */}
                        <polygon points="110,30 132,30 132,54 110,54" fill="#37474F" stroke="#212121" strokeWidth="0.5" />
                        <circle cx="121" cy="42" r="0.8" fill="#FFF" />
                        {/* TR corner */}
                        <polygon points="268,30 290,30 290,54 268,54" fill="#37474F" stroke="#212121" strokeWidth="0.5" />
                        <circle cx="279" cy="42" r="0.8" fill="#FFF" />

                        {/* Technical shipping stencils stenciled in dark brown */}
                        <text x="200" y="110" fill="#3E2723" fontSize="16" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" opacity="0.8">IRON DISTRICT</text>
                        <text x="200" y="130" fill="#3E2723" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.8">HEAVY FAB / FABRICACION</text>
                        
                        {/* Standard cargo logo stencils */}
                        {/* Fragile Glass cup */}
                        <g transform="translate(150, 160)" stroke="#3E2723" strokeWidth="1" fill="none" opacity="0.8">
                          <path d="M 0,0 L 12,0 L 12,5 L 6,12 L 6,16 M 2,16 L 10,16" />
                          <line x1="6" y1="0" x2="6" y2="6" strokeDasharray="1 1" />
                        </g>
                        {/* Up Arrows */}
                        <g transform="translate(230, 160)" stroke="#3E2723" strokeWidth="1.2" fill="none" opacity="0.8">
                          <path d="M 5,16 L 5,2 M 1,6 L 5,2 L 9,6" />
                          <path d="M 13,16 L 13,2 M 9,6 L 13,2 L 17,6" />
                        </g>

                        {/* barcode overlay */}
                        <g fill="#212121">
                          <rect x="180" y="70" width="2" height="15" />
                          <rect x="183" y="70" width="1" height="15" />
                          <rect x="185" y="70" width="3" height="15" />
                          <rect x="189" y="70" width="1" height="15" />
                          <rect x="191" y="70" width="2" height="15" />
                          <rect x="194" y="70" width="4" height="15" />
                          <rect x="199" y="70" width="1" height="15" />
                        </g>
                      </g>
                    )}
                  </motion.g>
                </AnimatePresence>
              </svg>

              {/* Sparks emitter canvas */}
              <canvas ref={canvasRef} className="visualizer-sparks-canvas" />
            </div>

            {/* Bottom info panel */}
            <div className="visualizer-footer-data">
              <div className="tech-row">
                <span className="tech-lbl">SYSTEM NODE:</span>
                <span className="tech-val">{steps[activeStep].techCode}</span>
              </div>
              <div className="tech-row">
                <span className="tech-lbl">CYCLE TIME:</span>
                <span className="tech-val">
                  {activeStep === 0 && '48 HOURS'}
                  {activeStep === 1 && '24 HOURS'}
                  {activeStep === 2 && '12 HOURS'}
                  {activeStep === 3 && '2 HOURS'}
                  {activeStep === 4 && 'Transit Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Natural Scrolling Cards */}
        <div className="process-scrolling-cards">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className={`process-scroll-card glass-panel ${activeStep === index ? 'active' : ''}`}
                ref={el => stepRefs.current[index] = el}
              >
                <div className="process-header">
                  <span className="process-number">0{index + 1}</span>
                  <div className="process-icon-box">
                    <Icon size={22} />
                  </div>
                </div>

                <div className="process-body">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>

                <div className="process-card-footer">
                  <span className="tech-code">STEP_SYS_REF.0{index + 1}</span>
                  <span className="tech-status">
                    {activeStep === index ? 'RUNNING' : activeStep > index ? 'COMPLETED' : 'QUEUED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .process-flow-section {
          background-color: var(--color-bg);
          position: relative;
          padding-top: 100px;
          padding-bottom: 120px;
          overflow: visible !important; /* Release sticky */
        }

        .process-container {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 80px;
          align-items: flex-start;
        }

        /* Sticky Left Column */
        .process-stuck-visualizer {
          position: sticky;
          top: 130px;
          height: calc(100vh - 180px);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .visualizer-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          padding: 24px;
          border-radius: 12px;
          background: var(--color-surface-base);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .visualizer-header {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .visualizer-status {
          color: var(--color-accent);
          font-weight: bold;
          letter-spacing: 0.05em;
        }

        .visualizer-body {
          position: relative;
          background: rgba(0, 0, 0, 0.015);
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }

        .assembly-svg {
          width: 100%;
          height: auto;
          z-index: 2;
        }

        .visualizer-sparks-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        .visualizer-footer-data {
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tech-row {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.7rem;
        }

        .tech-lbl {
          color: var(--color-text-muted);
        }

        .tech-val {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        /* Right Column scrolling steps cards */
        .process-scrolling-cards {
          display: flex;
          flex-direction: column;
          gap: 120px; /* High spacing for scroll transitions */
          padding-bottom: 150px;
        }

        .process-scroll-card {
          padding: 30px;
          min-height: 240px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 8px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease;
          opacity: 0.45;
        }

        .process-scroll-card.active {
          opacity: 1;
          border-color: var(--color-accent);
          transform: scale(1.02) translateX(10px);
          box-shadow: 0 10px 30px rgba(var(--color-accent-rgb), 0.08);
        }

        .process-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .process-number {
          font-family: monospace;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--color-text-muted);
          opacity: 0.3;
          line-height: 1;
          transition: var(--transition-fast);
        }

        .process-scroll-card.active .process-number {
          color: var(--color-accent);
          opacity: 0.7;
        }

        .process-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.01);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
        }

        .process-scroll-card.active .process-icon-box {
          background: rgba(255, 90, 9, 0.1);
          border-color: var(--color-accent);
          color: var(--color-accent);
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.15);
        }

        .process-body h3 {
          font-size: 1.15rem;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .process-body p {
          color: var(--color-text-secondary);
          font-size: 0.88rem;
          line-height: 1.6;
        }

        .process-card-footer {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
          margin-top: 20px;
        }

        .tech-status {
          color: var(--color-text-muted);
        }

        .process-scroll-card.active .tech-status {
          color: #10B981;
          font-weight: bold;
        }

        /* Blueprint Outline override inside visualizer card */
        .blueprint-draft-mode * {
          fill: none !important;
          stroke: #0284C7 !important; /* Blueprint technical blue */
          stroke-width: 1.2px !important;
          stroke-dasharray: 4 2 !important;
          opacity: 0.85 !important;
          transition: all 0.25s ease;
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
          .process-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .process-stuck-visualizer {
            display: none; /* Hide visualizer on mobile for accessibility */
          }
          .process-scrolling-cards {
            gap: 30px;
            padding-bottom: 40px;
          }
          .process-scroll-card {
            opacity: 1;
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </section>
  );
}
