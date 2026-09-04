import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, Cpu, Award, Hammer, PenTool, 
  Layers, Activity, CheckCircle2, ArrowRight, Zap, 
  Flame, RefreshCw, Users, MapPin, Calendar, Clock,
  Sparkles, Check, ChevronRight, Eye, Droplets
} from 'lucide-react';
import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import gatesImg from '../assets/service_gates.png';
import installImage from '../assets/railing_install.png';

export default function AboutPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const [activeMachine, setActiveMachine] = useState('laser');

  // Interactive Lab State for Section 4 (The WOW Section)
  const [labMode, setLabMode] = useState('anatomy'); // 'anatomy' | 'metallurgy'
  const [activeSystem, setActiveSystem] = useState('stairs');
  const [activeHotspot, setActiveHotspot] = useState(0);

  // Metallurgy Lab State
  const [selectedAlloy, setSelectedAlloy] = useState('steel');
  const [selectedFinish, setSelectedFinish] = useState('powder-black');

  // Machine tour data
  const machines = {
    laser: {
      nameEn: '6kW Trumpf TruLaser 3030 Fiber Cutter',
      nameEs: 'Cortadora Láser de Fibra 6kW Trumpf TruLaser',
      category: 'CNC LASER SLICING',
      tolerance: '±0.05 mm (0.002 in)',
      speed: '140 m/min Rapid Traverse',
      capacity: 'Up to 1.0" Carbon Steel / 0.75" Stainless',
      descEn: 'Ultra-high-density fiber laser delivering mirror-smooth edge cuts without heat distortion or slag burrs. Eliminates secondary machining and guarantees seamless interlocking joints.',
      descEs: 'Láser de fibra óptica de densidad extrema que produce cantos pulidos sin deformación térmica ni rebabas. Garantiza encajes milimétricos y ensambles estructurales perfectos.',
      metrics: [
        { labelEn: 'Beam Accuracy', labelEs: 'Precisión de Haz', val: '0.01 mm' },
        { labelEn: 'Laser Power', labelEs: 'Potencia Láser', val: '6,000 Watts' },
        { labelEn: 'Bed Dimensions', labelEs: 'Mesa de Trabajo', val: '10 ft x 5 ft' }
      ]
    },
    brake: {
      nameEn: '250-Ton CNC Hydraulic Press Brake',
      nameEs: 'Plegadora Hidráulica CNC de 250 Toneladas',
      category: 'PRECISION FORMING',
      tolerance: '±0.1° Angular Precision',
      speed: 'Variable Tonnage Control',
      capacity: 'Up to 14 ft Single Continuous Bends',
      descEn: '8-axis robotic backgauge with laser-assisted angle measuring. Capable of cold-forming high-tensile structural steel plates and tight architectural stair stringer bends.',
      descEs: 'Topes de 8 ejes con medidor láser de ángulos en tiempo real. Plegado en frío de placas estructurales de alta resistencia y zancas continuas para escaleras de lujo.',
      metrics: [
        { labelEn: 'Bending Force', labelEs: 'Fuerza de Plegado', val: '250 US Tons' },
        { labelEn: 'Bed Length', labelEs: 'Longitud de Mesa', val: '14.2 Feet' },
        { labelEn: 'Angle Control', labelEs: 'Control de Ángulo', val: 'Laser Dynamic' }
      ]
    },
    welding: {
      nameEn: 'AWS D1.1 Orbital & Pulsed TIG Welding Cells',
      nameEs: 'Celdas de Soldadura TIG Pulsada y Orbital AWS',
      category: 'METALLURGICAL FUSION',
      tolerance: '100% Penetration Inspection',
      speed: 'Inert Argon Gas Purge 99.99%',
      capacity: 'Carbon Steel, Stainless 304/316, 6061 Aluminum',
      descEn: 'Master artisans hand-fuse joints with stacked-dime aesthetic precision alongside robotic orbital arms, ensuring continuous structural bonds certified for high-seismic and wind loads.',
      descEs: 'Uniones soldadas a mano con estética impecable de moneda escamada y brazos orbitales automáticos. Soldadura homologada para zonas sísmicas y cargas de huracán.',
      metrics: [
        { labelEn: 'Welder Cert', labelEs: 'Certificación', val: 'AWS D1.1 / D1.2' },
        { labelEn: 'Gas Atmosphere', labelEs: 'Gas de Protección', val: '99.99% Argon' },
        { labelEn: 'Testing Method', labelEs: 'Método de Ensayo', val: 'Ultrasonic / Dye' }
      ]
    },
    powder: {
      nameEn: '40-Foot Automated Gema Powder Coat & Curing Oven',
      nameEs: 'Túnel de Pintura Powder Coat Gema de 40 Pies',
      category: 'PROTECTIVE FINISHING',
      tolerance: '3.5 - 4.5 Mils DFT Uniformity',
      speed: '400°F Cross-Linked Convection',
      capacity: 'Oversized Railings & Single-Piece Stringers',
      descEn: 'Architectural-grade thermoset powder application with electrostatic precision. 5-stage pre-treatment iron phosphate wash ensures maximum adhesion and a 2,000+ hour ASTM salt spray rating.',
      descEs: 'Aplicación electrostática de micropulverizado termoendurecible de grado arquitectónico. Lavado de fosfatado en 5 etapas para resistencia de 2,000+ horas de niebla salina.',
      metrics: [
        { labelEn: 'Salt Spray Rating', labelEs: 'Niebla Salina', val: '2,000+ Hrs' },
        { labelEn: 'Curing Temp', labelEs: 'Temp. de Curado', val: '400°F (204°C)' },
        { labelEn: 'Max Piece Length', labelEs: 'Largo Máximo', val: '40 Feet' }
      ]
    }
  };

  // SECTION 4: INTERACTIVE DISSECTION LAB DATA
  const anatomySystems = {
    stairs: {
      name: isEs ? "Escalera Monoviga Voladiza" : "Cantilever Mono-Stringer Staircase",
      subtitle: isEs ? "Acero estructural de alta resistencia A36 y peldaños flotantes" : "A36 high-tensile structural steel with floating boxed treads",
      image: stairsImg,
      hotspots: [
        {
          id: 0,
          x: 28, y: 65,
          title: isEs ? "Placa Base & Anclaje Químico Hilti" : "Structural Substrate Base & Anchor",
          spec: isEs ? "Perno Hilti HIT-HY 200 • Carga admisible 12,500 lb tracción" : "Hilti HIT-HY 200 anchors • 12,500 lb tensile pullout rated",
          standard: "IBC Section 1607.8 / ASTM E985",
          desc: isEs 
            ? "Placa de anclaje de 3/4\" de espesor cortada en láser CNC con orificios ranurados para ajuste milimétrico en losa de hormigón."
            : "3/4\" thick laser-cut base plate with CNC slotted holes for field micro-alignment to structural slab."
        },
        {
          id: 1,
          x: 48, y: 45,
          title: isEs ? "Viga Central Tubular Monolítica" : "Monolithic Box Stringer Beam",
          spec: isEs ? "Tubo estructural 10\" x 4\" x 3/8\" • Deflexión L/360 garantizada" : "10\" x 4\" x 3/8\" HSS Tube • Guaranteed L/360 deflection under full load",
          standard: "AISC Steel Construction Manual 15th Ed.",
          desc: isEs
            ? "Viga continua plegada en frío en nuestra prensa CNC de 250 toneladas para eliminar juntas débiles y garantizar una rigidez absoluta sin vibración al paso."
            : "Single-piece cold formed stringer eliminating structural splices and ensuring bounce-free rigidity under live foot traffic."
        },
        {
          id: 2,
          x: 72, y: 32,
          title: isEs ? "Soporte Oculto de Peldaño Flotante" : "Concealed Floating Tread Bracket",
          spec: isEs ? "Chapa plegada 1/2\" A36 • Soldadura perimetral TIG penetración completa" : "1/2\" formed A36 plate • 100% full-penetration perimeter TIG weld",
          standard: "AWS D1.1 Certified Fusion",
          desc: isEs
            ? "Cada soporte de peldaño queda totalmente embutido dentro de la madera noble o piedra, dando la ilusión óptica de suspensión en el aire."
            : "Precision brackets conceal completely inside solid hardwood or stone treads for true zero-reveal floating aesthetics."
        },
        {
          id: 3,
          x: 82, y: 15,
          title: isEs ? "Pasamanos Ergonómico Integrado" : "Ergonomic Continuous Handrail",
          spec: isEs ? "Tubo inox 316 1-1/2\" OD • Agarre continuo ADA compliant" : "1.5\" OD 316 Stainless • ADA 26 CFR 36 continuous graspability",
          standard: "ADAAG Chapter 5 / IBC 1014",
          desc: isEs
            ? "Curvado por mandril sin arrugas ni deformación de sección, pulido a grano satinado #4 suave al tacto."
            : "Mandrel-bent with zero ovality, finished to a sanitary #4 architectural satin brush that never tarnishes."
        }
      ]
    },
    railings: {
      name: isEs ? "Barandilla de Varilla & Vidrio Base-Shoe" : "Architectural Base-Shoe Glass Guardrail",
      subtitle: isEs ? "Vidrio laminado templado 1/2\" y perfil de fijación embutido" : "1/2\" tempered laminated glass with structural dry-glaze shoe",
      image: railingsImg,
      hotspots: [
        {
          id: 0,
          x: 20, y: 80,
          title: isEs ? "Perfil Base-Shoe de Aluminio Extruido" : "Structural Extruded Base Shoe",
          spec: isEs ? "Aleación 6005A-T61 • Resistencia al vuelco 50 plf" : "6005A-T61 alloy • 50 plf linear overturning load rated",
          standard: "IBC 2407 Glass in Handrails",
          desc: isEs
            ? "Canal continuo fijado al canto de losa que elimina postes verticales y ofrece una transparencia visual ininterrumpida."
            : "Fascia or top-mount continuous channel eliminating vertical balusters for seamless glass panoramas."
        },
        {
          id: 1,
          x: 50, y: 45,
          title: isEs ? "Panel de Vidrio Laminado SentryGlas" : "SentryGlas Structural Interlayer Panel",
          spec: isEs ? "1/2\" Templado + 0.060\" PVB • Retención de fragmentos 100%" : "1/2\" Tempered + 0.060\" SentryGlas ionoplast interlayer",
          standard: "ASTM C1172 / SGCC Certified",
          desc: isEs
            ? "Incluso en el improbable caso de rotura de ambas hojas, la membrana estructural mantiene el panel rígido e impidide caídas."
            : "Stands rigid and maintains post-breakage barrier protection even under severe impact or wind loads."
        },
        {
          id: 2,
          x: 75, y: 12,
          title: isEs ? "Tapa Superior de Acero Inoxidable Marino" : "Marine-Grade 316 Stainless Top Cap",
          spec: isEs ? "Perfil U mecanizado CNC • Junta EPDM aislante galvánica" : "CNC-milled U-channel • Isolating EPDM glazing gasket",
          standard: "ASTM A554 Marine Grade",
          desc: isEs
            ? "Protege el canto del vidrio y distribuye cargas de impacto en todo el conjunto de barandilla."
            : "Provides load-sharing redundancy across panels while protecting glass edges from point impacts."
        }
      ]
    },
    gates: {
      name: isEs ? "Portón Arquitectónico Pivotante Motorizado" : "Architectural Motorized Pivot Gate",
      subtitle: isEs ? "Estructura interna tubular aligerada y lamas mecanizadas láser" : "Concealed structural tube framework with CNC slotted louvers",
      image: gatesImg,
      hotspots: [
        {
          id: 0,
          x: 25, y: 85,
          title: isEs ? "Cojinete Pivotante Hidráulico Subterráneo" : "In-Ground Hydraulic Pivot Bearing",
          spec: isEs ? "Capacidad estática 3,000 lbs • Cierre suave regulable 2 velocidades" : "3,000 lb load capacity • Dual-speed hydraulic soft-close",
          standard: "ANSI/BHMA A156.4 Grade 1",
          desc: isEs
            ? "Mecanismo embutido en fosa de acero inoxidable sellada que soporta hojas gigantes de hasta 14 pies con empuje de un solo dedo."
            : "Sealed stainless pit enclosure carrying oversized 14-ft leaves with effortless one-finger operation."
        },
        {
          id: 1,
          x: 55, y: 40,
          title: isEs ? "Entramado Interno Antitorsión" : "Anti-Sag Internal Truss Geometry",
          spec: isEs ? "Tubo estructural 3\" x 3\" • Flecha nula en voladizo" : "3\" x 3\" HSS inner skeleton • Zero diagonal sag over time",
          standard: "ASTM A500 Grade B",
          desc: isEs
            ? "Soldadura oculta que evita la caída de la punta del portón a lo largo de décadas de uso continuo."
            : "Engineered triangulation concealed behind face panels prevents leaf drop and hinge binding permanently."
        },
        {
          id: 2,
          x: 78, y: 20,
          title: isEs ? "Acabado Powder Coat SuperDurable Tiger Drylac" : "Tiger Drylac SuperDurable Powder Shell",
          spec: isEs ? "Micropulverizado curado a 400°F • 2,000 hrs niebla salina" : "TGIC polyester resin • 2,000+ hr salt spray corrosion barrier",
          standard: "AAMA 2604 Weatherability",
          desc: isEs
            ? "Capa protectora molecularmente entrelazada resistente a rayos UV intensos, rayaduras y lluvia ácida."
            : "High-integrity barrier coating tested in south Florida exposure racks for 5+ years with zero chalking."
        }
      ]
    }
  };

  const alloysData = {
    steel: {
      name: isEs ? "Acero Estructural A36 Carbon Steel" : "A36 Structural Carbon Steel",
      yield: "36,000 - 45,000 PSI",
      tensile: "58,000 - 80,000 PSI",
      hardness: "140 Brinell",
      saltSpray: "2,000+ Hrs (w/ Powder Coat)",
      recycled: "100% Electric Arc Furnace (EAF)",
      bestFor: isEs ? "Estructuras de carga pesada, escaleras monumentales, perfiles para interiores y exteriores protegidos." : "Heavy load-bearing stairs, commercial frames, interior monolithic stringers with baked powder coats.",
      badge: "HEAVY-DUTY STRUCTURAL"
    },
    stainless: {
      name: isEs ? "Acero Inoxidable Marino 316" : "316 Marine-Grade Stainless Steel",
      yield: "42,000 PSI",
      tensile: "85,000 PSI",
      hardness: "160 Brinell",
      saltSpray: "3,500+ Hrs Non-Oxidizing",
      recycled: "85% Recycled Content",
      bestFor: isEs ? "Entornos costeros, barandillas junto a piscinas cloradas, terrazas marinas expuestas y arquitectura sanitaria." : "Coastal oceanfront decks, chlorinated swimming pool perimeters, and exposed exterior handrails with zero rust.",
      badge: "MAX CORROSION RESISTANCE"
    },
    aluminum: {
      name: isEs ? "Aluminio Billet Estructural 6061-T6" : "6061-T6 Aircraft Billet Aluminum",
      yield: "40,000 PSI",
      tensile: "45,000 PSI",
      hardness: "95 Brinell (Lightweight)",
      saltSpray: "2,500+ Hrs Anodized",
      recycled: "100% Infinitely Recyclable",
      bestFor: isEs ? "Estructuras ligeras, pérgolas suspendidas, perfiles base-shoe para vidrio y barandillas de balcón de bajo peso propio." : "Weight-critical cantilever balconies, glass base-shoe channels, and exterior canopies requiring zero iron oxides.",
      badge: "AEROSPACE LIGHTWEIGHT"
    },
    brass: {
      name: isEs ? "Latón Arquitectónico C385 & Bronce" : "Architectural C385 Brass & Bronze",
      yield: "30,000 PSI",
      tensile: "60,000 PSI",
      hardness: "120 Brinell",
      saltSpray: "Natural Self-Healing Patina",
      recycled: "90% Circular Brass",
      bestFor: isEs ? "Residencias de ultra-lujo, pasamanos táctiles de autor, detalles de boutique y hoteles de alta gama." : "High-end luxury estates, tactile custom handrails, boutique retail entrances with hand-rubbed living patina finishes.",
      badge: "ARTISANAL LUXURY"
    }
  };

  const finishesData = {
    'powder-black': {
      name: isEs ? "Tiger Drylac Negro Mate Arquitectónico" : "Tiger Drylac SuperDurable Matte Black",
      dft: "3.5 - 4.5 Mils",
      cure: "400°F (204°C) Convection",
      sheen: "Matte 15% Gloss",
      colorHex: "#1A1A1A"
    },
    'powder-bronze': {
      name: isEs ? "Polvo Metálico Bronce Anódico" : "Anodic Bronze Metallic Powder",
      dft: "3.8 - 4.6 Mils",
      cure: "400°F (204°C) Convection",
      sheen: "Satin 30% Metallic Flake",
      colorHex: "#4A3B32"
    },
    'satin-brush': {
      name: isEs ? "Cepillado Satinado Direccional Grano #4" : "#4 Directional Architectural Satin Brush",
      dft: "Mechanical Grain Micro-Polish",
      cure: "Passivated Nitric Bath",
      sheen: "Semi-Reflective Brushed Metal",
      colorHex: "#C5C7D0"
    },
    'galvanized': {
      name: isEs ? "Galvanizado en Caliente ASTM A123" : "Hot-Dip Galvanized ASTM A123 (Molten Zinc)",
      dft: "4.0 - 6.0 Mils Zinc Metallurgical Bond",
      cure: "840°F (449°C) Zinc Kettle Dip",
      sheen: "Industrial Spangled Matte Gray",
      colorHex: "#8F96A0"
    }
  };

  const currentAnatomy = anatomySystems[activeSystem];
  const currentHotspotData = currentAnatomy.hotspots[activeHotspot] || currentAnatomy.hotspots[0];

  return (
    <div className="about-page-wrapper">
      
      {/* 1. MANIFESTO & HERITAGE HERO */}
      <section className="about-hero-section container">
        <div className="about-hero-header">
          <div className="about-tag">
            <ShieldCheck size={16} />
            <span>{language === 'en' ? 'PRECISION STRUCTURAL FABRICATION' : 'FABRICACIÓN ESTRUCTURAL DE PRECISIÓN'}</span>
          </div>
          <h1 className="text-gradient">
            {language === 'en' 
              ? 'Where Heavy Metallurgy Meets Architectural Grace.' 
              : 'Donde la Metalurgia Pesada se Une a la Elegancia Arquitectónica.'}
          </h1>
          <p className="about-hero-lead">
            {language === 'en'
              ? 'Station Metalworks is not a typical welding shop. We are an advanced engineering studio where laser optics, CNC press brakes, and master blacksmithing converge to build heirloom-grade stairs, railings, and structural installations.'
              : 'Station Metalworks no es una herrería convencional. Somos un estudio de ingeniería avanzada donde la óptica láser, el plegado CNC y la maestría artesanal convergen para crear escaleras, barandillas y estructuras para toda la vida.'}
          </p>
        </div>

        {/* Live KPI Ticker */}
        <div className="about-stats-grid">
          <div className="stat-card">
            <span className="stat-val">1,400+</span>
            <span className="stat-lbl">{language === 'en' ? 'Installations Delivered' : 'Obras Instaladas'}</span>
            <span className="stat-sub">{language === 'en' ? 'Across 50 states' : 'En todo el país'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">±0.05 mm</span>
            <span className="stat-lbl">{language === 'en' ? 'CNC Slicing Precision' : 'Tolerancia CNC'}</span>
            <span className="stat-sub">{language === 'en' ? 'Aerospace-grade fiber cut' : 'Corte láser sin rebabas'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">100%</span>
            <span className="stat-lbl">{language === 'en' ? 'In-House Fabrication' : 'Fabricación Propia'}</span>
            <span className="stat-sub">{language === 'en' ? 'Zero subcontracting' : 'Cero subcontrataciones'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">2,000+ hr</span>
            <span className="stat-lbl">{language === 'en' ? 'Salt Spray Barrier' : 'Ensayo Niebla Salina'}</span>
            <span className="stat-sub">{language === 'en' ? 'ASTM B117 rated finishes' : 'Acabados marinos certificados'}</span>
          </div>
        </div>
      </section>

      {/* 2. HIGH-TECH MACHINERY & WORKSHOP TOUR */}
      <section className="machinery-tour-section container">
        <div className="section-header">
          <span className="tag-label">
            <Cpu size={14} />
            {language === 'en' ? 'OUR INDUSTRIAL ARSENAL' : 'NUESTRO ARSENAL INDUSTRIAL'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'High-Precision Machine Fleet' : 'Maquinaria de Precisión de Grado Industrial'}
          </h2>
          <p>
            {language === 'en'
              ? 'Click to inspect the cutting-edge machinery powering every bend, slice, weld, and coat in our 45,000 sq ft facility.'
              : 'Haz clic para explorar la maquinaria de última generación que respalda cada corte, pliegue, soldadura y acabado en nuestra planta.'}
          </p>
        </div>

        <div className="machinery-tour-layout">
          {/* Machine selector tabs */}
          <div className="machinery-tabs-nav">
            {Object.keys(machines).map((key) => {
              const m = machines[key];
              const isActive = activeMachine === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveMachine(key)}
                  className={`machinery-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="machinery-tab-cat">{m.category}</span>
                  <span className="machinery-tab-name">{language === 'en' ? m.nameEn : m.nameEs}</span>
                  <span className="machinery-tab-tol">Tol: {m.tolerance}</span>
                </button>
              );
            })}
          </div>

          {/* Machine display panel */}
          <div className="machinery-display-panel">
            <div className="machinery-header">
              <span className="machine-cat-badge">{machines[activeMachine].category}</span>
              <span className="machine-tol-badge">
                <ShieldCheck size={14} />
                {machines[activeMachine].tolerance}
              </span>
            </div>

            <h3 className="machine-title">
              {language === 'en' ? machines[activeMachine].nameEn : machines[activeMachine].nameEs}
            </h3>

            <p className="machine-desc">
              {language === 'en' ? machines[activeMachine].descEn : machines[activeMachine].descEs}
            </p>

            <div className="machine-specs-grid">
              <div className="machine-spec-item">
                <span className="lbl">{language === 'en' ? 'Operational Speed' : 'Velocidad'}</span>
                <span className="val">{machines[activeMachine].speed}</span>
              </div>
              <div className="machine-spec-item">
                <span className="lbl">{language === 'en' ? 'Working Capacity' : 'Capacidad de Carga'}</span>
                <span className="val">{machines[activeMachine].capacity}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="machine-metrics-row">
              {machines[activeMachine].metrics.map((met, idx) => (
                <div key={idx} className="machine-metric-item">
                  <span className="val">{met.val}</span>
                  <span className="lbl">{language === 'en' ? met.labelEn : met.labelEs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENGINEERING RIGOR & CERTIFICATIONS MATRIX */}
      <section className="rigor-matrix-section container">
        <div className="section-header">
          <span className="tag-label">
            <Award size={14} />
            {language === 'en' ? 'CODE COMPLIANCE & SAFETY' : 'CÓDIGO Y SEGURIDAD ESTRUCTURAL'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'The Station Engineering Protocol' : 'El Protocolo de Ingeniería Station'}
          </h2>
          <p>
            {language === 'en'
              ? 'Every design is engineered to exceed International Building Code (IBC) and Residential Code (IRC) standards.'
              : 'Cada sistema se diseña para superar los estándares de los códigos internacionales de construcción IBC e IRC.'}
          </p>
        </div>

        <div className="rigor-cards-grid">
          <div className="rigor-card">
            <div className="rigor-icon-box">
              <Activity size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? 'IBC 200 lb Point Load Certified' : 'Carga Puntual IBC 200 lb Certificada'}</h4>
            <p>
              {language === 'en'
                ? 'All railings withstand a minimum 200 lb concentrated load applied in any direction along the top rail with zero permanent deformation.'
                : 'Todas nuestras barandillas resisten una carga concentrada de 200 lb en cualquier dirección sin deformación permanente.'}
            </p>
            <span className="rigor-badge">IBC §1607.8.1 COMPLIANT</span>
          </div>

          <div className="rigor-card">
            <div className="rigor-icon-box">
              <Flame size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? 'AWS D1.1 Certified Welders' : 'Soldadores Homologados AWS D1.1'}</h4>
            <p>
              {language === 'en'
                ? 'Every structural weld is executed by certified craftsmen using back-purged argon gas, eliminating porosity and micro-fractures.'
                : 'Cada soldadura estructural es realizada por maestros certificados con purga de argón, eliminando porosidades y microfisuras.'}
            </p>
            <span className="rigor-badge">AWS D1.1 / D1.2 PROTOCOL</span>
          </div>

          <div className="rigor-card">
            <div className="rigor-icon-box">
              <ShieldCheck size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? '2,000+ Hr Salt Fog Exposure' : '2,000+ Horas Niebla Salina ASTM'}</h4>
            <p>
              {language === 'en'
                ? 'Our multi-layer powder coating withstands ASTM B117 salt spray tests, offering coastal protection against humidity and sea breeze.'
                : 'Nuestros recubrimientos soportan ensayos ASTM B117 de niebla salina, protegiendo proyectos costeros de la corrosión marina.'}
            </p>
            <span className="rigor-badge">ASTM B117 & AAMA 2604</span>
          </div>

          <div className="rigor-card">
            <div className="rigor-icon-box">
              <Zap size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? 'Dynamic Structural FEA Analysis' : 'Análisis Estructural de Elementos Finitos (FEA)'}</h4>
            <p>
              {language === 'en'
                ? 'Before laser slicing, our engineers run 3D stress simulations to identify deflection zones and ensure 100% permit approval.'
                : 'Antes de cortar la primera chapa, simulamos tensiones en 3D para identificar deflexiones y garantizar la aprobación de permisos.'}
            </p>
            <span className="rigor-badge">PE STAMP READY</span>
          </div>
        </div>
      </section>

      {/* 4. THE WOW SECTION: INTERACTIVE ARCHITECTURAL METALLURGY & CAD DISSECTION STUDIO (Replaces the repetitive 4-card team grid) */}
      <section className="interactive-lab-section container">
        <div className="lab-wrapper-card">
          
          {/* Section Header with Mode Switcher */}
          <div className="lab-top-header">
            <div>
              <div className="lab-eyebrow">
                <Users size={14} className="icon-crimson" />
                <span>{isEs ? "LOS ARTESANOS TRAS EL ACERO // GREMIO DE INGENIERÍA" : "THE ARTISANS BEHIND THE STEEL // ENGINEERING GUILD"}</span>
              </div>
              <h2 className="lab-main-title">
                {isEs ? "Disección de Oficio & Laboratorio de Metalurgia" : "Mastercraft Dissection & Metallurgy Studio"}
              </h2>
              <p className="lab-subtitle">
                {isEs 
                  ? "En lugar de simples palabras, te invitamos a diseccionar en tiempo real cómo nuestros maestros soldadores AWS, ingenieros PE y programadores CNC forjan cada ensamble arquitectónico."
                  : "Experience the true artisan rigor behind Station Metalworks: inspect 3D structural CAD blueprints, micro-tolerances, and interactive alloy performance."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="lab-mode-switcher">
              <button 
                onClick={() => setLabMode('anatomy')} 
                className={`lab-switch-btn ${labMode === 'anatomy' ? 'active' : ''}`}
              >
                <Eye size={15} />
                <span>{isEs ? "Disección CAD 3D" : "CAD Anatomy"}</span>
              </button>
              <button 
                onClick={() => setLabMode('metallurgy')} 
                className={`lab-switch-btn ${labMode === 'metallurgy' ? 'active' : ''}`}
              >
                <Layers size={15} />
                <span>{isEs ? "Metalurgia & Acabados" : "Alloys & Finishes"}</span>
              </button>
            </div>
          </div>

          {/* MODE 1: EXPLODED ANATOMY INSPECTOR */}
          {labMode === 'anatomy' && (
            <div className="anatomy-mode-stage">
              
              {/* System Selector Pills */}
              <div className="system-pill-tabs">
                {[
                  { id: 'stairs', label: isEs ? "Escalera Flotante Monoviga" : "Cantilever Floating Stair" },
                  { id: 'railings', label: isEs ? "Barandilla Vidrio Base-Shoe" : "Glass Base-Shoe Guardrail" },
                  { id: 'gates', label: isEs ? "Portón Pivotante de Autor" : "Architectural Pivot Gate" }
                ].map((sys) => (
                  <button
                    key={sys.id}
                    onClick={() => {
                      setActiveSystem(sys.id);
                      setActiveHotspot(0);
                    }}
                    className={`system-pill-btn ${activeSystem === sys.id ? 'active' : ''}`}
                  >
                    <span>{sys.label}</span>
                  </button>
                ))}
              </div>

              {/* Anatomy Canvas & Dynamic Spec Inspector */}
              <div className="anatomy-interactive-grid">
                
                {/* Visual Canvas with Hotspot Beacons */}
                <div className="anatomy-canvas-container">
                  <div className="blueprint-overlay-grid" />
                  <img 
                    src={currentAnatomy.image} 
                    alt={currentAnatomy.name} 
                    className="anatomy-featured-img" 
                  />
                  
                  {/* Hotspots */}
                  {currentAnatomy.hotspots.map((spot, index) => {
                    const isSelected = activeHotspot === index;
                    return (
                      <button
                        key={spot.id}
                        onClick={() => setActiveHotspot(index)}
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        className={`hotspot-pin ${isSelected ? 'active' : ''}`}
                        title={spot.title}
                      >
                        <span className="hotspot-pulse" />
                        <span className="hotspot-num">{index + 1}</span>
                      </button>
                    );
                  })}

                  <div className="canvas-system-tag">
                    <span className="sys-title">{currentAnatomy.name}</span>
                    <span className="sys-sub">{currentAnatomy.subtitle}</span>
                  </div>
                </div>

                {/* Hotspot Micro-Spec Detail Card */}
                <div className="hotspot-detail-card">
                  <div className="detail-card-head">
                    <span className="node-index-badge">
                      {isEs ? `PUNTO DE INSPECCIÓN 0${activeHotspot + 1}` : `INSPECTION NODE 0${activeHotspot + 1}`}
                    </span>
                    <span className="standard-chip">{currentHotspotData.standard}</span>
                  </div>

                  <h3 className="detail-node-title">{currentHotspotData.title}</h3>

                  <div className="spec-metric-highlight">
                    <span className="highlight-lbl">{isEs ? "TOLERANCIA / VALOR ENSAYADO" : "TESTED VALUE / TOLERANCE"}</span>
                    <span className="highlight-val">{currentHotspotData.spec}</span>
                  </div>

                  <p className="detail-node-desc">
                    {currentHotspotData.desc}
                  </p>

                  <div className="node-assurance-bullets">
                    <div className="bullet-row">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{isEs ? "Diseñado para superar código IBC 200 lb y 50 plf" : "Exceeds IBC 200 lb point & 50 plf uniform load"}</span>
                    </div>
                    <div className="bullet-row">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{isEs ? "Pre-ensamblado en seco en taller antes de despacho" : "100% dry-fit pre-assembled in shop before dispatch"}</span>
                    </div>
                    <div className="bullet-row">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{isEs ? "Garantía estructural de por vida en cordones de soldadura" : "Lifetime structural warranty on all fusion welds"}</span>
                    </div>
                  </div>

                  <div className="detail-card-actions">
                    <a href="#/contact" className="btn-detail-inquire">
                      <span>{isEs ? "Consultar este Sistema" : "Inquire This System"}</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* MODE 2: METALLURGY & COATINGS LAB */}
          {labMode === 'metallurgy' && (
            <div className="metallurgy-mode-stage">
              
              <div className="metallurgy-selectors-row">
                
                {/* Base Alloy Selector */}
                <div className="metal-group">
                  <label className="metal-group-lbl">
                    01 // {isEs ? "Seleccionar Aleación Base" : "Select Base Metal Alloy"}
                  </label>
                  <div className="metal-options-stack">
                    {[
                      { id: 'steel', name: isEs ? "Acero Estructural A36 Carbon" : "A36 Carbon Steel", tag: "Heavy Structural" },
                      { id: 'stainless', name: isEs ? "Acero Inoxidable Marino 316" : "316 Marine Stainless", tag: "Max Coastal" },
                      { id: 'aluminum', name: isEs ? "Aluminio Billet 6061-T6" : "6061-T6 Aircraft Aluminum", tag: "Ultralight 0% Rust" },
                      { id: 'brass', name: isEs ? "Latón Arquitectónico C385" : "C385 Architectural Brass", tag: "Luxury Patina" }
                    ].map((alloy) => (
                      <button
                        key={alloy.id}
                        onClick={() => setSelectedAlloy(alloy.id)}
                        className={`metal-choice-btn ${selectedAlloy === alloy.id ? 'active' : ''}`}
                      >
                        <div className="choice-left">
                          <span className="choice-title">{alloy.name}</span>
                          <span className="choice-tag">{alloy.tag}</span>
                        </div>
                        <span className={`choice-indicator ${selectedAlloy === alloy.id ? 'active' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Surface Coating Selector */}
                <div className="metal-group">
                  <label className="metal-group-lbl">
                    02 // {isEs ? "Seleccionar Acabado Protector" : "Select Protective Coating"}
                  </label>
                  <div className="metal-options-stack">
                    {Object.keys(finishesData).map((finishKey) => {
                      const f = finishesData[finishKey];
                      const isSelected = selectedFinish === finishKey;
                      return (
                        <button
                          key={finishKey}
                          onClick={() => setSelectedFinish(finishKey)}
                          className={`finish-choice-btn ${isSelected ? 'active' : ''}`}
                        >
                          <div className="finish-swatch-box">
                            <span className="swatch-color-circle" style={{ backgroundColor: f.colorHex }} />
                            <div>
                              <span className="finish-name">{f.name}</span>
                              <span className="finish-sheen">{f.sheen}</span>
                            </div>
                          </div>
                          <span className={`choice-indicator ${isSelected ? 'active' : ''}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Dynamic Metallurgy Performance Matrix */}
              <div className="metallurgy-results-card">
                <div className="results-head">
                  <div className="head-info">
                    <span className="alloy-badge">{alloysData[selectedAlloy].badge}</span>
                    <h3 className="selected-spec-title">
                      {alloysData[selectedAlloy].name} + {finishesData[selectedFinish].name}
                    </h3>
                  </div>
                  <div className="eco-loop-status">
                    <RefreshCw size={14} className="text-emerald" />
                    <span>{isEs ? "Ciclo Circular 100% Reciclable" : "100% Circular Metal Loop"}</span>
                  </div>
                </div>

                <div className="metal-stats-metrics-grid">
                  <div className="metal-metric-item">
                    <span className="metric-lbl">{isEs ? "Límite Elástico (Yield)" : "Yield Strength"}</span>
                    <span className="metric-val">{alloysData[selectedAlloy].yield}</span>
                  </div>
                  <div className="metal-metric-item">
                    <span className="metric-lbl">{isEs ? "Resistencia a la Tracción" : "Tensile Strength"}</span>
                    <span className="metric-val">{alloysData[selectedAlloy].tensile}</span>
                  </div>
                  <div className="metal-metric-item">
                    <span className="metric-lbl">{isEs ? "Barrera de Niebla Salina" : "Salt Spray Rating"}</span>
                    <span className="metric-val text-crimson">{alloysData[selectedAlloy].saltSpray}</span>
                  </div>
                  <div className="metal-metric-item">
                    <span className="metric-lbl">{isEs ? "Espesor de Película Seca (DFT)" : "Coating Thickness (DFT)"}</span>
                    <span className="metric-val">{finishesData[selectedFinish].dft}</span>
                  </div>
                </div>

                <div className="metal-best-for-box">
                  <span className="best-for-lbl">{isEs ? "APLICACIÓN ARQUITECTÓNICA RECOMENDADA:" : "RECOMMENDED ARCHITECTURAL APPLICATION:"}</span>
                  <p className="best-for-desc">{alloysData[selectedAlloy].bestFor}</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 5. LINDO Y NORMAL CTA (CLEAN, ELEGANT, GUARANTEED CONTRAST, NO HOVER BUG) */}
      <section className="normal-cta-section container">
        <div className="normal-cta-card">
          <div className="normal-cta-content">
            <div className="normal-cta-badge">
              <RefreshCw size={13} className="text-emerald" />
              <span>{isEs ? 'CICLO CIRCULAR DE ACERO 100% RECICLABLE' : 'CIRCULAR STEEL ECO-LOOP'}</span>
            </div>
            <h2>{isEs ? 'Construido una Vez. Hecho para Generaciones.' : 'Built Once. Built for Generations.'}</h2>
            <p>
              {isEs 
                ? 'El acero y el aluminio son 100% infinitamente reciclables sin degradación de propiedades mecánicas. Todo nuestro retal de taller se reintegra a hornos de arco eléctrico y nuestros procesos de acabado electrostático curados a 400°F emiten 0% solventes COV dañinos.'
                : 'Steel and aluminum are 100% infinitely recyclable without material degradation. 100% of our workshop scrap is returned to North American electric arc furnaces, and our 400°F powder coating processes emit zero harmful VOC solvents.'}
            </p>
          </div>
          <div className="normal-cta-actions">
            <a href="#/contact" className="btn-cta-visit">
              <span>{isEs ? 'Agendar Visita al Taller' : 'Schedule a Workshop Visit'}</span>
              <ArrowRight size={16} />
            </a>
            <a href="#/contact#rfq-studio" className="btn-cta-rfq">
              <span>{isEs ? 'Solicitar Presupuesto RFQ' : 'Request Architectural RFQ'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* SCOPED COMPREHENSIVE CSS */}
      <style>{`
        .about-page-wrapper {
          padding-top: 100px;
          padding-bottom: 90px;
          position: relative;
          background: #FFFFFF;
          color: var(--color-brand-dark, #020032);
        }

        /* 1. Hero */
        .about-hero-section {
          position: relative;
          padding: 40px 0 60px 0;
          overflow: hidden;
        }

        .about-hero-header {
          max-width: 820px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .about-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 12px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .about-hero-header h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .about-hero-lead {
          font-size: 1.1rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 28px 34px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.04);
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-right: 1px solid var(--color-border);
          padding-right: 20px;
        }

        .stat-card:last-child {
          border-right: none;
        }

        .stat-val {
          font-family: monospace;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--color-accent, #e00027);
          line-height: 1;
        }

        .stat-lbl {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .stat-sub {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--color-text-muted, #7c829c);
        }

        /* 2. Machinery Tour */
        .machinery-tour-section {
          padding: 70px 0;
        }

        .section-header {
          max-width: 700px;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tag-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          text-transform: uppercase;
        }

        .section-header h2 {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .section-header p {
          font-size: 0.95rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
        }

        .machinery-tour-layout {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 24px;
          align-items: stretch;
        }

        .machinery-tabs-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .machinery-tab-btn {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 20px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary, #3b3e54);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .machinery-tab-btn:hover {
          border-color: var(--color-accent, #e00027);
          color: var(--color-brand-dark, #020032);
        }

        .machinery-tab-btn.active {
          background: var(--color-brand-dark, #020032);
          color: #FFF;
          border-color: var(--color-brand-dark, #020032);
        }

        .machinery-tab-cat {
          font-family: monospace;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          opacity: 0.75;
        }

        .machinery-tab-name {
          font-size: 0.95rem;
          font-weight: 800;
        }

        .machinery-tab-tol {
          font-family: monospace;
          font-size: 0.7rem;
          opacity: 0.85;
          color: var(--color-accent, #e00027);
        }

        .machinery-tab-btn.active .machinery-tab-tol {
          color: #F87171;
        }

        .machinery-display-panel {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.04);
        }

        .machinery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .machine-cat-badge {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .machine-tol-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: #10B981;
        }

        .machine-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0;
          line-height: 1.25;
        }

        .machine-desc {
          font-size: 0.92rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
          margin: 0;
        }

        .machine-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #F8FAFC;
          padding: 18px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }

        .machine-spec-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .machine-spec-item .lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted, #7c829c);
          text-transform: uppercase;
        }

        .machine-spec-item .val {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .machine-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .machine-metric-item {
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
          background: #F8FAFC;
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .machine-metric-item .val {
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
        }

        .machine-metric-item .lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-secondary, #3b3e54);
        }

        /* 3. Rigor Matrix */
        .rigor-matrix-section {
          padding: 60px 0;
        }

        .rigor-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .rigor-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          transition: transform 0.25s, border-color 0.25s;
        }

        .rigor-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 10px 25px rgba(2, 0, 50, 0.06);
        }

        .rigor-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: rgba(224, 0, 39, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rigor-card h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          line-height: 1.3;
          margin: 0;
        }

        .rigor-card p {
          font-size: 0.82rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.55;
          margin: 0;
          flex: 1;
        }

        .rigor-badge {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          border-top: 1px dashed var(--color-border);
          padding-top: 12px;
        }

        /* 4. THE WOW SECTION: INTERACTIVE CAD & METALLURGY LAB (REPLACED REPETITIVE 4 CARDS) */
        .interactive-lab-section {
          padding: 50px 0 60px 0;
        }

        .lab-wrapper-card {
          background: #0B0E1B;
          color: #FFFFFF;
          border: 1px solid #232B47;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
        }

        .lab-top-header {
          padding: 40px 44px 30px 44px;
          border-bottom: 1px solid #1E293B;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 24px;
        }

        .lab-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .icon-crimson {
          color: var(--color-accent, #e00027);
        }

        .lab-main-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 2.3rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        }

        .lab-subtitle {
          font-size: 0.95rem;
          color: #94A3B8;
          max-width: 680px;
          line-height: 1.6;
          margin: 0;
        }

        .lab-mode-switcher {
          display: flex;
          background: #151A2E;
          border: 1px solid #232B47;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }

        .lab-switch-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-family: monospace;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .lab-switch-btn.active {
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          box-shadow: 0 2px 10px rgba(224, 0, 39, 0.35);
        }

        /* Mode 1: Anatomy */
        .anatomy-mode-stage {
          padding: 32px 44px 44px 44px;
        }

        .system-pill-tabs {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .system-pill-btn {
          padding: 10px 20px;
          border-radius: 999px;
          background: #151A2E;
          border: 1px solid #232B47;
          color: #CBD5E1;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .system-pill-btn:hover {
          border-color: #334155;
          color: #FFFFFF;
        }

        .system-pill-btn.active {
          background: #FFFFFF;
          color: var(--color-brand-dark, #020032);
          border-color: #FFFFFF;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
        }

        .anatomy-interactive-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 32px;
          align-items: center;
        }

        .anatomy-canvas-container {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: #151A2E;
          border: 1px solid #232B47;
          aspect-ratio: 16 / 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blueprint-overlay-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        .anatomy-featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          filter: contrast(110%);
        }

        .canvas-system-tag {
          position: absolute;
          bottom: 16px;
          left: 20px;
          background: rgba(11, 14, 27, 0.85);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #232B47;
          display: flex;
          flex-direction: column;
        }

        .sys-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .sys-sub {
          font-family: monospace;
          font-size: 0.68rem;
          color: #94A3B8;
        }

        /* Hotspot Pins */
        .hotspot-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-brand-dark, #020032);
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 800;
          z-index: 10;
          transition: all 0.25s;
        }

        .hotspot-pin:hover, .hotspot-pin.active {
          background: var(--color-accent, #e00027);
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 0 20px rgba(224, 0, 39, 0.8);
        }

        .hotspot-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid var(--color-accent, #e00027);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .hotspot-detail-card {
          background: #151A2E;
          border: 1px solid #232B47;
          border-radius: 18px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .node-index-badge {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.12);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(224, 0, 39, 0.25);
        }

        .standard-chip {
          font-family: monospace;
          font-size: 0.7rem;
          color: #94A3B8;
        }

        .detail-node-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.25;
        }

        .spec-metric-highlight {
          background: #0B0E1B;
          border: 1px solid #1E293B;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .highlight-lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: #64748B;
          text-transform: uppercase;
        }

        .highlight-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: #E2E8F0;
        }

        .detail-node-desc {
          font-size: 0.88rem;
          color: #94A3B8;
          line-height: 1.6;
          margin: 0;
        }

        .node-assurance-bullets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid #1E293B;
        }

        .bullet-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #CBD5E1;
        }

        .text-emerald {
          color: #10B981;
        }

        .detail-card-actions {
          margin-top: 8px;
        }

        .btn-detail-inquire {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s;
        }

        .btn-detail-inquire:hover {
          background: #c20022;
        }

        /* Mode 2: Metallurgy */
        .metallurgy-mode-stage {
          padding: 32px 44px 44px 44px;
        }

        .metallurgy-selectors-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 28px;
        }

        .metal-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metal-group-lbl {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .metal-options-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metal-choice-btn, .finish-choice-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-radius: 12px;
          background: #151A2E;
          border: 1px solid #232B47;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .metal-choice-btn:hover, .finish-choice-btn:hover {
          border-color: #334155;
          background: #1B223C;
        }

        .metal-choice-btn.active, .finish-choice-btn.active {
          border-color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
        }

        .choice-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .choice-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .choice-tag {
          font-family: monospace;
          font-size: 0.68rem;
          color: #94A3B8;
        }

        .finish-swatch-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .swatch-color-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }

        .finish-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #FFFFFF;
          display: block;
        }

        .finish-sheen {
          font-family: monospace;
          font-size: 0.68rem;
          color: #94A3B8;
        }

        .choice-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #334155;
        }

        .choice-indicator.active {
          background: var(--color-accent, #e00027);
          box-shadow: 0 0 8px var(--color-accent, #e00027);
        }

        .metallurgy-results-card {
          background: #151A2E;
          border: 1px solid #232B47;
          border-radius: 18px;
          padding: 32px;
        }

        .results-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .alloy-badge {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.12);
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 4px;
          display: inline-block;
        }

        .selected-spec-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .eco-loop-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          color: #34D399;
        }

        .metal-stats-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .metal-metric-item {
          background: #0B0E1B;
          border: 1px solid #1E293B;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: #64748B;
          text-transform: uppercase;
        }

        .metric-val {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .text-crimson {
          color: var(--color-accent, #e00027);
        }

        .metal-best-for-box {
          background: rgba(224, 0, 39, 0.05);
          border: 1px solid rgba(224, 0, 39, 0.2);
          border-radius: 10px;
          padding: 16px 20px;
        }

        .best-for-lbl {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          display: block;
          margin-bottom: 4px;
        }

        .best-for-desc {
          font-size: 0.85rem;
          color: #CBD5E1;
          margin: 0;
          line-height: 1.55;
        }

        /* 5. LINDO Y NORMAL CTA */
        .normal-cta-section {
          padding: 30px 0 80px 0;
        }

        .normal-cta-card {
          background: var(--color-brand-dark, #020032);
          border-radius: 20px;
          padding: 48px 56px;
          color: #FFFFFF;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 32px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 16px 40px rgba(2, 0, 50, 0.15);
          transition: all 0.3s ease;
        }

        .normal-cta-card:hover {
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 20px 50px rgba(2, 0, 50, 0.25);
        }

        .normal-cta-content {
          max-width: 680px;
        }

        .normal-cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #34D399;
          background: rgba(16, 185, 129, 0.12);
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid rgba(16, 185, 129, 0.25);
          margin-bottom: 16px;
        }

        .normal-cta-content h2 {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 2.3rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          margin: 0 0 14px 0;
          letter-spacing: -0.02em;
        }

        .normal-cta-content p {
          font-size: 0.95rem;
          color: #CBD5E1;
          line-height: 1.6;
          margin: 0;
        }

        .normal-cta-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-cta-visit {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          padding: 14px 26px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(224, 0, 39, 0.3);
        }

        .btn-cta-visit:hover {
          background: #c20022;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(224, 0, 39, 0.45);
        }

        .btn-cta-rfq {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-cta-rfq:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: #FFFFFF;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .about-stats-grid, .machinery-tour-layout, .rigor-cards-grid {
            grid-template-columns: 1fr;
          }
          .anatomy-interactive-grid, .metallurgy-selectors-row, .metal-stats-metrics-grid {
            grid-template-columns: 1fr;
          }
          .stat-card {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 14px;
          }
          .normal-cta-card {
            padding: 36px 30px;
          }
          .normal-cta-actions {
            width: 100%;
          }
          .btn-cta-visit, .btn-cta-rfq {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .about-hero-header h1, .lab-main-title, .normal-cta-content h2 {
            font-size: 2.1rem;
          }
          .lab-top-header, .anatomy-mode-stage, .metallurgy-mode-stage {
            padding: 24px;
          }
          .normal-cta-actions {
            flex-direction: column;
            width: 100%;
          }
          .btn-cta-visit, .btn-cta-rfq {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
