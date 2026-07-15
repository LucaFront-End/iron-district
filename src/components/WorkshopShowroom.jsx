import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Settings, Ruler, Scissors, Flame, CheckCircle } from 'lucide-react';

// Sub-component for each horizontal slide to isolate its own Canvas particle loop
const WorkshopSlide = ({ tab, index, scrollProgress }) => {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const particlesRef = useRef([]);

  // Loop for the specific slide's spark canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let loopId;

    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.x < 0 || p.x > canvas.width || p.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Generate automated active ambient sparks if hovering and tab is laser/welding
      if (isHovering && (tab.id === 'laser' || tab.id === 'welding')) {
        const x = canvas.width / 2 + (Math.random() - 0.5) * 80;
        const y = canvas.height / 2 + (Math.random() - 0.5) * 40;
        const particleColor = tab.id === 'laser' ? '#FF5A09' : '#3B82F6';

        for (let k = 0; k < 2; k++) {
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.7) * 5,
            gravity: 0.15,
            alpha: 1.0,
            decay: 0.015 + Math.random() * 0.01,
            size: 1.5 + Math.random() * 2,
            color: particleColor,
            glow: 10
          });
        }
      }

      loopId = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(loopId);
    };
  }, [tab.id, isHovering]);

  const triggerSparkBurst = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const particleColor = tab.id === 'laser' ? '#FF5A09' : 
                          tab.id === 'welding' ? '#3B82F6' : 
                          tab.id === 'coating' ? '#10B981' : '#F59E0B';

    const count = tab.id === 'welding' || tab.id === 'laser' ? 40 : 15;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        gravity: 0.12,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        size: 1 + Math.random() * 2.5,
        color: particleColor,
        glow: 8 + Math.random() * 10
      });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !isHovering) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const particleColor = tab.id === 'laser' ? '#FF5A09' : 
                          tab.id === 'welding' ? '#3B82F6' : 
                          tab.id === 'coating' ? '#10B981' : '#F59E0B';

    if (Math.random() < 0.6) {
      particlesRef.current.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 0.5,
        gravity: 0.05,
        alpha: 0.8,
        decay: 0.02 + Math.random() * 0.02,
        size: 1 + Math.random() * 2,
        color: particleColor,
        glow: 5
      });
    }
  };

  // SVG Renderings
  const renderVisualMock = () => {
    switch (tab.id) {
      case 'laser':
        return (
          <div className="process-graphics-content">
            <svg viewBox="0 0 400 300" className="graphics-svg">
              <defs>
                <linearGradient id="laser-steel-plate" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78909C" />
                  <stop offset="100%" stopColor="#37474F" />
                </linearGradient>
                <linearGradient id="gantry-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#CFD8DC" />
                  <stop offset="50%" stopColor="#90A4AE" />
                  <stop offset="100%" stopColor="#455A64" />
                </linearGradient>
              </defs>

              {/* Laser Cutting Gantry Frame (Overhead Slider) */}
              <rect x="40" y="30" width="320" height="12" fill="url(#gantry-grad)" stroke="#37474F" strokeWidth="1" rx="2" />
              <line x1="40" y1="36" x2="360" y2="36" stroke="#ECEFF1" strokeWidth="1" />
              
              {/* Heavy Duty 3D Steel Sheet (Raw material being cut) */}
              <polygon points="60,170 340,170 300,240 20,240" fill="url(#laser-steel-plate)" stroke="#263238" strokeWidth="1" />
              <polygon points="20,240 300,240 300,246 20,246" fill="#212121" />
              <polygon points="300,240 340,170 340,176 300,246" fill="#1C2123" />

              {/* The Laser-Cut path in progress (Railing profile silhouette) */}
              <g stroke="#FF5A09" strokeWidth="2.5" fill="none" opacity="0.9">
                {/* Horizontal cut line */}
                <path d="M 60,210 L 220,210" />
                {/* Cut indicator slots (fish-scale cuts) */}
                <circle cx="90" cy="210" r="3" fill="#FF5A09" opacity="0.3" stroke="none" />
                <circle cx="150" cy="210" r="3" fill="#FF5A09" opacity="0.3" stroke="none" />
              </g>

              {/* Animated Laser Cutting Head (Gantry Slide) */}
              <motion.g
                animate={{ x: [0, 80, -20, 60, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '200px', originY: '36px' }}
              >
                {/* Support pillar from gantry */}
                <rect x="188" y="42" width="24" height="60" fill="url(#gantry-grad)" stroke="#37474F" strokeWidth="0.75" />
                {/* Nozzle body with pneumatic cooling lines */}
                <rect x="180" y="102" width="40" height="25" fill="#37474F" rx="1" />
                <rect x="183" y="106" width="34" height="3" fill="#FF5A09" />
                {/* Copper Nozzle tip */}
                <polygon points="194,127 206,127 202,142 198,142" fill="#D84315" stroke="#5D4037" strokeWidth="0.5" />
                {/* Laser core line */}
                <line x1="200" y1="142" x2="200" y2="210" stroke="#FF5A09" strokeWidth="2" />
                <line x1="200" y1="142" x2="200" y2="210" stroke="#FFF" strokeWidth="0.5" opacity="0.7" />
                {/* Technical crosshair at cutting coordinate */}
                <circle cx="200" cy="210" r="6" fill="none" stroke="#FF5A09" strokeWidth="0.5" strokeDasharray="2 1" />
              </motion.g>

              {/* Coordinates digital HUD overlay */}
              <text x="50" y="275" fill="var(--color-text-muted)" fontSize="9" fontFamily="monospace">G-CODE: G01 X200.00 Y210.00 Z0.00</text>
              <text x="350" y="275" fill="var(--color-accent)" fontSize="9" fontFamily="monospace" textAnchor="end">LASER ACTIVE</text>
            </svg>
            <div className="hover-hint">CLICK TO ENGAGE FIBER LASER</div>
          </div>
        );
      case 'welding':
        return (
          <div className="process-graphics-content">
            <svg viewBox="0 0 400 300" className="graphics-svg">
              <defs>
                <linearGradient id="robot-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7043" />
                  <stop offset="60%" stopColor="#F4511E" />
                  <stop offset="100%" stopColor="#BF360C" />
                </linearGradient>
                <linearGradient id="welded-joint" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#455A64" />
                  <stop offset="50%" stopColor="#90A4AE" />
                  <stop offset="100%" stopColor="#263238" />
                </linearGradient>
              </defs>

              {/* 3D Intersecting Metal Tubes being welded */}
              {/* Horizontal tube */}
              <rect x="80" y="200" width="240" height="20" fill="url(#welded-joint)" stroke="#1C2123" strokeWidth="1" />
              <rect x="80" y="201" width="240" height="2" fill="rgba(255,255,255,0.25)" />
              {/* Vertical tube joint */}
              <rect x="180" y="100" width="40" height="100" fill="url(#welded-joint)" stroke="#1C2123" strokeWidth="1" />
              <rect x="181" y="100" width="2" height="100" fill="rgba(255,255,255,0.25)" />
              
              {/* Welding seam ripples (TIG weld fishscales) */}
              <g stroke="rgba(255, 90, 9, 0.45)" strokeWidth="2.5" fill="none">
                {/* Weld beads */}
                <path d="M 180,200 C 182,197 185,197 187,200 C 189,197 192,197 194,200 C 196,197 199,197 201,200 C 203,197 206,197 208,200 C 210,197 213,197 215,200 C 217,197 220,197 222,200" />
              </g>

              {/* 6-Axis Industrial Welding Robot Arm (3D details) */}
              <motion.g
                animate={{ rotate: [-2, 3, -1, 3, -2], x: [0, 5, -5, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: '70px', originY: '60px' }}
              >
                {/* Robot Main Shoulder Rotation Base */}
                <circle cx="70" cy="60" r="22" fill="#37474F" stroke="#212121" strokeWidth="1" />
                {/* Lower Arm Segment */}
                <rect x="58" y="60" width="24" height="90" fill="url(#robot-orange)" rx="4" stroke="#D84315" strokeWidth="1" />
                <rect x="68" y="60" width="4" height="90" fill="rgba(255,255,255,0.3)" />
                {/* Elbow joint */}
                <circle cx="70" cy="150" r="14" fill="#37474F" stroke="#212121" />
                {/* Upper Wrist Segment rotated to weld point */}
                <g style={{ transform: 'rotate(42deg)', transformOrigin: '70px 150px' }}>
                  <rect x="60" y="150" width="20" height="80" fill="url(#robot-orange)" rx="3" stroke="#D84315" strokeWidth="1" />
                  <rect x="68" y="150" width="4" height="80" fill="rgba(255,255,255,0.3)" />
                  {/* Wrist rotator */}
                  <rect x="62" y="230" width="16" height="8" fill="#212121" />
                  {/* Welding gun torch nozzle */}
                  <polygon points="64,238 76,238 72,255 68,255" fill="url(#gantry-grad)" stroke="#37474F" strokeWidth="0.5" />
                  {/* Contact wire electrode */}
                  <line x1="70" y1="255" x2="70" y2="265" stroke="#E59866" strokeWidth="1.5" />
                  {/* Welding electric arc blue core */}
                  <circle cx="70" cy="265" r="4" fill="#3B82F6" className="pulse-glow" />
                </g>
              </motion.g>

              {/* Shielding gas indicator overlay */}
              <text x="50" y="275" fill="var(--color-text-muted)" fontSize="9" fontFamily="monospace">GAS FEED: 18 L/MIN Ar/CO2</text>
              <text x="350" y="275" fill="#3B82F6" fontSize="9" fontFamily="monospace" textAnchor="end">ARC IGNITED</text>
            </svg>
            <div className="hover-hint">CLICK TO IGNITE ROBOTIC ARC</div>
          </div>
        );
      case 'coating':
        return (
          <div className="process-graphics-content">
            <svg viewBox="0 0 400 300" className="graphics-svg">
              <defs>
                <linearGradient id="coating-rack-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#CFD8DC" />
                  <stop offset="100%" stopColor="#78909C" />
                </linearGradient>
                <linearGradient id="spray-cloud" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Overhead Conveyor Track Roller and Chain */}
              <line x1="30" y1="30" x2="370" y2="30" stroke="#455A64" strokeWidth="4" />
              <rect x="180" y="24" width="40" height="12" fill="#212121" rx="1" />
              <circle cx="190" cy="30" r="4" fill="#FFF" />
              <circle cx="210" cy="30" r="4" fill="#FFF" />
              {/* Hanging hooks */}
              <path d="M 200,36 L 200,70" stroke="#78909C" strokeWidth="2.5" fill="none" />

              {/* Railing panel being coated (Half Raw Gray Steel, Half coated in Green/Black) */}
              <g transform="translate(100, 70)">
                {/* Raw Steel half (Left) */}
                <rect x="0" y="0" width="100" height="120" fill="url(#coating-rack-grad)" stroke="#455A64" strokeWidth="1.5" />
                {/* Horizontal railing lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#263238" strokeWidth="5" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="#263238" strokeWidth="5" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#263238" strokeWidth="5" />
                {/* Balusters */}
                <line x1="20" y1="0" x2="20" y2="120" stroke="#263238" strokeWidth="3" />
                <line x1="50" y1="0" x2="50" y2="120" stroke="#263238" strokeWidth="3" />
                <line x1="80" y1="0" x2="80" y2="120" stroke="#263238" strokeWidth="3" />

                {/* Coated Powder half (Right) */}
                <rect x="100" y="0" width="100" height="120" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
                <line x1="100" y1="20" x2="200" y2="20" stroke="#047857" strokeWidth="5" />
                <line x1="100" y1="60" x2="200" y2="60" stroke="#047857" strokeWidth="5" />
                <line x1="100" y1="100" x2="200" y2="100" stroke="#047857" strokeWidth="5" />
                <line x1="120" y1="0" x2="120" y2="120" stroke="#047857" strokeWidth="3" />
                <line x1="150" y1="0" x2="150" y2="120" stroke="#047857" strokeWidth="3" />
                <line x1="180" y1="0" x2="180" y2="120" stroke="#047857" strokeWidth="3" />
              </g>

              {/* Electrostatic Field curved lines showing charge attraction */}
              <path d="M 85,130 Q 140,110 180,130" stroke="#10B981" strokeWidth="0.75" strokeDasharray="3 3" fill="none" opacity="0.6" />
              <path d="M 85,160 Q 140,180 180,160" stroke="#10B981" strokeWidth="0.75" strokeDasharray="3 3" fill="none" opacity="0.6" />

              {/* Electrostatic Spray Gun with hoses (Animated vertically) */}
              <motion.g
                animate={{ y: [-20, 80, -20] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Gun Body */}
                <rect x="30" y="100" width="35" height="15" fill="#212121" rx="2" stroke="#444" strokeWidth="0.5" />
                {/* Pistol handle */}
                <rect x="35" y="115" width="10" height="25" fill="#212121" rx="1" transform="rotate(15, 35, 115)" />
                {/* Paint hose */}
                <path d="M 40,138 C 30,170 20,180 20,210" fill="none" stroke="#78909C" strokeWidth="2.5" />
                {/* Nozzle diffuser */}
                <polygon points="65,102 78,95 78,120 65,113" fill="#666" />
                {/* Sprayed powder cloud gradient */}
                <polygon points="78,107 180,50 180,165 78,107" fill="url(#spray-cloud)" opacity="0.45" />
              </motion.g>

              {/* Thickness Spec HUD */}
              <text x="50" y="275" fill="var(--color-text-muted)" fontSize="9" fontFamily="monospace">CHARGE: Negative 60kV</text>
              <text x="350" y="275" fill="#10B981" fontSize="9" fontFamily="monospace" textAnchor="end">COATING IN PROGRESS</text>
            </svg>
            <div className="hover-hint">CLICK TO SPRAY POWDER COAT</div>
          </div>
        );
      case 'assembly':
        return (
          <div className="process-graphics-content">
            <svg viewBox="0 0 400 300" className="graphics-svg">
              <defs>
                {/* Caliper satin chrome texture */}
                <linearGradient id="caliper-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ECEFF1" />
                  <stop offset="50%" stopColor="#B0BEC5" />
                  <stop offset="100%" stopColor="#78909C" />
                </linearGradient>
              </defs>

              {/* Background technical schematic lines */}
              <path d="M 40,230 L 360,230" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
              <path d="M 80,40 L 80,250" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
              <path d="M 320,40 L 320,250" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

              {/* The Metal Piece being measured (3D Square Tube) */}
              <rect x="70" y="110" width="50" height="90" fill="url(#laser-steel-plate)" stroke="#263238" strokeWidth="1" />
              <polygon points="70,110 120,110 135,95 85,95" fill="#78909C" stroke="#263238" strokeWidth="0.5" />
              <polygon points="120,110 135,95 135,185 120,200" fill="#37474F" stroke="#263238" strokeWidth="0.5" />

              {/* Precision Digital Caliper measuring the tube width */}
              <motion.g
                animate={{ x: [0, 8, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Main scale bar */}
                <rect x="110" y="135" width="220" height="14" fill="url(#caliper-grad)" stroke="#455A64" strokeWidth="0.75" />
                {/* Caliper measurement ticks */}
                <g stroke="#37474F" strokeWidth="0.5">
                  <line x1="130" y1="135" x2="130" y2="140" />
                  <line x1="150" y1="135" x2="150" y2="140" />
                  <line x1="170" y1="135" x2="170" y2="140" />
                  <line x1="190" y1="135" x2="190" y2="140" />
                  <line x1="210" y1="135" x2="210" y2="140" />
                  <line x1="230" y1="135" x2="230" y2="140" />
                  <line x1="250" y1="135" x2="250" y2="140" />
                </g>

                {/* Fixed caliper jaw (Left) */}
                <path d="M 120,135 L 120,195 L 115,195 L 110,149 L 110,135 Z" fill="url(#caliper-grad)" stroke="#455A64" strokeWidth="0.75" />

                {/* Sliding digital LCD head */}
                <g transform="translate(60, 0)">
                  <rect x="150" y="122" width="60" height="40" fill="#455A64" rx="2" stroke="#263238" strokeWidth="1" />
                  {/* Digital screen */}
                  <rect x="156" y="128" width="48" height="18" fill="#E0F2F1" stroke="#004D40" strokeWidth="0.5" />
                  {/* Measurement Readout */}
                  <text x="180" y="141" fill="#004D40" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">50.00 mm</text>
                  
                  {/* Buttons */}
                  <circle cx="162" cy="154" r="2" fill="#D32F2F" />
                  <circle cx="174" cy="154" r="2" fill="#1976D2" />
                  <circle cx="186" cy="154" r="2" fill="#388E3C" />

                  {/* Sliding jaw pointer */}
                  <path d="M 150,135 L 150,195 L 145,195 L 140,149 Z" fill="url(#caliper-grad)" stroke="#455A64" strokeWidth="0.75" />
                </g>
              </motion.g>

              {/* Quality inspection stamp callout */}
              <g stroke="#10B981" strokeWidth="1.5">
                <circle cx="310" cy="90" r="26" fill="none" strokeDasharray="4 2" />
                <circle cx="310" cy="90" r="22" fill="none" />
                <text x="310" y="93" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-15, 310, 93)">QC PASSED</text>
              </g>

              {/* Calibration digital indicators */}
              <text x="50" y="275" fill="var(--color-text-muted)" fontSize="9" fontFamily="monospace">CALIBRATION: ISO 9001 REF: 0.01mm</text>
              <text x="350" y="275" fill="#10B981" fontSize="9" fontFamily="monospace" textAnchor="end">DIMENSIONS OK</text>
            </svg>
            <div className="hover-hint">CLICK TO RUN CALIPER SIMULATION</div>
          </div>
        );
      default:
        return null;
    }
  };

  const StepIcon = tab.icon;

  return (
    <div className="showroom-slide-view">
      <div className="slide-content-container">
        {/* Left Column: Localized Details */}
        <div className="slide-text-side">
          <div className="slide-tag-badge" style={{ '--badge-theme': tab.color }}>
            <StepIcon size={14} />
            <span>STAGE 0{index + 1}</span>
          </div>
          <h3 className="slide-title">{tab.title}</h3>
          <p className="slide-description">{tab.desc}</p>

          <div className="slide-spec-table">
            <div className="spec-table-row">
              <span className="spec-table-lbl">TOLERANCE SPEC:</span>
              <span className="spec-table-val">+/- 0.05mm</span>
            </div>
            <div className="spec-table-row">
              <span className="spec-table-lbl">STATION ID:</span>
              <span className="spec-table-val">LA_HUB_0{index + 1}</span>
            </div>
            <div className="spec-table-row">
              <span className="spec-table-lbl">QUALITY INSPECTION:</span>
              <span className="spec-table-val green-tag">PASSED</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Box with particles */}
        <div 
          className="slide-display-side glass-panel"
          ref={containerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={triggerSparkBurst}
        >
          <div className="schematic-corner tl"></div>
          <div className="schematic-corner tr"></div>
          <div className="schematic-corner bl"></div>
          <div className="schematic-corner br"></div>

          {renderVisualMock()}

          <canvas ref={canvasRef} className="spark-canvas" />
        </div>
      </div>
    </div>
  );
};

export default function WorkshopShowroom() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const tabs = [
    { id: 'laser', title: t('showroom.laser'), desc: t('showroom.laserDesc'), color: '#FF5A09', icon: Scissors },
    { id: 'welding', title: t('showroom.welding'), desc: t('showroom.weldingDesc'), color: '#3B82F6', icon: Flame },
    { id: 'coating', title: t('showroom.coating'), desc: t('showroom.coatingDesc'), color: '#10B981', icon: Settings },
    { id: 'assembly', title: t('showroom.assembly'), desc: t('showroom.assemblyDesc'), color: '#F59E0B', icon: CheckCircle }
  ];

  // Monitor vertical scroll of this section to translate horizontally
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Start calculation when the section top reaches the top of the viewport
      const totalScrollableHeight = rect.height - viewHeight;
      if (totalScrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Calculate current active slide index for navigation bar
  const activeIdx = Math.round(scrollProgress * 3);

  // Smooth scroll vertical viewport when clicking slide indicator dots
  const scrollToSlide = (idx) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const totalScrollableHeight = rect.height - viewHeight;
    const targetY = window.scrollY + rect.top + (totalScrollableHeight * (idx / 3));

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };

  return (
    <section className="showroom-scroll-section" ref={sectionRef} id="showroom">
      <div className="sticky-scroll-wrapper">
        <div className="blueprint-grid"></div>

        {/* Sticky Fixed Header */}
        <div className="showroom-sticky-header">
          <div className="container header-container-showroom">
            <div className="fixed-title-block">
              <span className="tag-label">
                <Settings className="pulse-glow" size={14} />
                {t('showroom.tag')}
              </span>
              <h2 className="text-gradient fixed-section-title">{t('showroom.title')}</h2>
            </div>

            {/* Slide Navigation Progress Bar / Indicators */}
            <div className="showroom-scroll-nav">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSlide(idx)}
                  className={`showroom-nav-dot ${activeIdx === idx ? 'active' : ''}`}
                  style={{ '--dot-accent': tab.color }}
                >
                  <span className="dot-circle"></span>
                  <span className="dot-label">{tab.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Slides track */}
        <div 
          className="horizontal-slides-track"
          style={{ 
            transform: `translateX(-${scrollProgress * 75}%)` 
          }}
        >
          {tabs.map((tab, index) => (
            <WorkshopSlide 
              key={tab.id}
              tab={tab}
              index={index}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>
      </div>

      <style>{`
        .showroom-scroll-section {
          height: 300vh; /* scroll duration */
          background-color: var(--color-bg);
          position: relative;
          overflow: visible !important;
        }

        .sticky-scroll-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Fixed Title block styling */
        .showroom-sticky-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 100px 0 20px;
          z-index: 100;
          pointer-events: none;
        }

        .header-container-showroom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .fixed-title-block {
          pointer-events: auto;
        }

        .fixed-section-title {
          font-size: 2.2rem;
          margin-top: 4px;
        }

        /* Scroll Progress Dots */
        .showroom-scroll-nav {
          display: flex;
          gap: 16px;
          pointer-events: auto;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 8px 16px;
        }

        .showroom-nav-dot {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          opacity: 0.4;
          transition: var(--transition-fast);
          padding: 4px;
        }

        .showroom-nav-dot:hover {
          opacity: 0.7;
        }

        .showroom-nav-dot.active {
          opacity: 1;
        }

        .dot-circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-text-muted);
          transition: var(--transition-fast);
        }

        .showroom-nav-dot.active .dot-circle {
          background: var(--dot-accent);
          transform: scale(1.3);
          box-shadow: 0 0 8px var(--dot-accent);
        }

        .dot-label {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Horizontal Track */
        .horizontal-slides-track {
          display: flex;
          width: 400vw;
          height: 100%;
          transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
        }

        /* Individual slide content */
        .showroom-slide-view {
          width: 100vw;
          height: 100%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 180px 80px 80px;
        }

        .slide-content-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 60px;
          align-items: center;
        }

        .slide-text-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .slide-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--badge-theme);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
        }

        .slide-title {
          font-size: 2rem;
          color: var(--color-text-primary);
        }

        .slide-description {
          color: var(--color-text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Spec Table */
        .slide-spec-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
          margin-top: 12px;
        }

        .spec-table-row {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.75rem;
        }

        .spec-table-lbl {
          color: var(--color-text-muted);
        }

        .spec-table-val {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .spec-table-val.green-tag {
          color: #10B981;
        }

        /* Visual Card */
        .slide-display-side {
          position: relative;
          background: rgba(0, 0, 0, 0.015);
          border-radius: 12px;
          overflow: hidden;
          height: 380px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: crosshair;
        }

        .process-graphics-content {
          width: 100%;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .graphics-svg {
          width: 100%;
          max-width: 380px;
          height: auto;
        }

        .hover-hint {
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 15px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          pointer-events: none;
        }

        .spark-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
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
          .showroom-scroll-section {
            height: auto;
          }
          .sticky-scroll-wrapper {
            position: relative;
            height: auto;
            width: 100%;
            overflow: visible;
          }
          .showroom-sticky-header {
            position: relative;
            padding: 60px 0 20px;
          }
          .header-container-showroom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .horizontal-slides-track {
            flex-direction: column;
            width: 100%;
            transform: none !important;
          }
          .showroom-slide-view {
            width: 100%;
            padding: 40px 24px;
            height: auto;
          }
          .slide-content-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .showroom-scroll-nav {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </section>
  );
}
