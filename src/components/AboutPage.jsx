import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { updateMetaTags } from '../services/seoConfig';
import { 
  ShieldCheck, Cpu, Award, Hammer, PenTool, 
  Layers, Activity, CheckCircle2, ArrowRight, Zap, 
  Flame, RefreshCw, Users, MapPin, Calendar, Clock,
  Sparkles, Check, ChevronRight, Eye, Droplets,
  Quote, HeartHandshake, Shield
} from 'lucide-react';
import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import gatesImg from '../assets/service_gates.png';
import installImage from '../assets/railing_install.png';

export default function AboutPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  useEffect(() => {
    updateMetaTags('about');
  }, []);
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
          x: 40.5, y: 92,
          title: isEs ? "Placa Base & Anclaje a Suelo (A36)" : "Floor Base Plate & Anchor Flange",
          spec: isEs ? "Placa A36 3/4\" • Pernos Hilti HIT-HY 200 • 12,500 lb tracción" : "3/4\" A36 plate • Hilti HIT-HY 200 anchors • 12,500 lb tensile pullout",
          standard: "IBC Section 1607.8 / ASTM E985",
          desc: isEs 
            ? "Placa de anclaje de 3/4\" cortada con láser CNC de fibra, empernada a la losa de hormigón para absorción de momentos flectores."
            : "Heavy-duty 3/4\" laser-cut base plate anchored with structural chemical anchors into the concrete slab."
        },
        {
          id: 1,
          x: 40.5, y: 55,
          title: isEs ? "Poste Estructural & Soldadura TIG AWS D1.1" : "Structural Upright Post & TIG Weld",
          spec: isEs ? "Tubo estructural 2\" x 1\" • Fusión 100% penetración • Pulido a ras" : "2\" x 1\" HSS tube • 100% penetration TIG fusion • Flush ground finish",
          standard: "AWS D1.1 Structural Welding Protocol",
          desc: isEs
            ? "Unión soldada por arco de tungsteno con purga de argón al 99.99%, eliminando porosidades y asegurando rigidez ante cargas laterales de 200 lb."
            : "Tungsten inert gas welded with back-purged argon, certified to eliminate porosity and guarantee 200 lb lateral code compliance."
        },
        {
          id: 2,
          x: 74, y: 55,
          title: isEs ? "Soporte Oculto en Muro (Peldaño Voladizo)" : "Concealed Cantilever Wall Embed",
          spec: isEs ? "Chapa A36 1/2\" embutida • Capacidad 500 lb por peldaño sin flecha" : "1/2\" A36 structural embed plate • 500 lb rating per tread zero deflection",
          standard: "AISC Steel Construction Manual / IBC 1607",
          desc: isEs
            ? "Estructura de acero oculta dentro del muro de hormigón que sostiene los peldaños de roble macizo con estética flotante pura sin pilares visibles."
            : "Engineered steel spine concealed within the concrete shear wall, supporting solid hardwood treads with zero visible column supports."
        },
        {
          id: 3,
          x: 44, y: 30,
          title: isEs ? "Pasamanos Continuo Ergonómico ADA" : "Continuous ADA Graspable Handrail",
          spec: isEs ? "Tubo inox 316 1-1/2\" OD • Agarre continuo sin arrugas de doblado" : "1.5\" OD 316 Stainless • Continuous graspability ADA 26 CFR 36",
          standard: "ADAAG Chapter 5 / IBC 1014",
          desc: isEs
            ? "Curvado por mandril con tolerancias aeroespaciales y acabado cepillado satinado grano #4 anti-huellas."
            : "Mandrel-bent with zero section ovality, finished to a fingerprint-resistant #4 architectural satin brush."
        },
        {
          id: 4,
          x: 32, y: 9,
          title: isEs ? "Barandilla de Vidrio en Mezanina Superior" : "Mezzanine Glass Guardrail",
          spec: isEs ? "Vidrio laminado 1/2\" SentryGlas • Canal embutido 50 plf" : "1/2\" SentryGlas laminated glass • 50 plf linear overturning load",
          standard: "IBC 2407 Glass in Handrails",
          desc: isEs
            ? "Remate superior del vano con barandilla de vidrio estructural embutida para máxima entrada de luz y seguridad."
            : "Upper floor glass guardrail set in structural base-shoe channel delivering unobstructed sightlines and full fall protection."
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
          x: 58, y: 84,
          title: isEs ? "Placa Base & Anclaje a Cubierta de Madera" : "Deck Corner Flange & Structural Mount",
          spec: isEs ? "Pletina mecanizada CNC • Pernos pasantes Inox 316 grado marino" : "CNC machined flange • 316 marine through-bolts rated for coastal wind",
          standard: "IBC Section 1607.8 / ASTM E985",
          desc: isEs
            ? "Anclaje de alta resistencia fijado directamente a las viguetas maestras de la terraza, resistente a vientos de 140 mph."
            : "Heavy-duty base plate secured directly into deck structural joists, engineered for 140 mph coastal hurricane wind loads."
        },
        {
          id: 1,
          x: 48, y: 70,
          title: isEs ? "Tensores de Cable Inox 316 Grado Marino" : "Marine 316 Stainless Cable Infill",
          spec: isEs ? "Cable 1/8\" 1x19 • Separación 3\" (supera código esfera 4\")" : "1/8\" 1x19 cable • 3\" spacing (exceeds 4\" sphere code test)",
          standard: "ASTM A580 / ASTM A492 Cable Standards",
          desc: isEs
            ? "Cables de acero inoxidable 316 con terminales de compresión ocultos dentro de los postes para una vista infinita al mar."
            : "High-tensile 316 stainless cables with concealed hydraulic-swaged tensioners inside end posts for unobstructed ocean views."
        },
        {
          id: 2,
          x: 72, y: 62,
          title: isEs ? "Poste Esquinero & Acabado SuperDurable" : "Structural Corner Post & Powder Finish",
          spec: isEs ? "Tubo 2\" x 2\" • Recubrimiento Tiger Drylac • 2,000+ hrs niebla salina" : "2\" x 2\" HSS • Tiger Drylac TGIC • 2,000+ hr salt fog barrier",
          standard: "AAMA 2604 Weatherability Specification",
          desc: isEs
            ? "Poste robusto que soporta la tensión combinada de todas las líneas de cable sin deflectar ni perder alineación."
            : "Reinforced post engineered to withstand cumulative cable tension without twisting or bowing over time."
        },
        {
          id: 3,
          x: 62, y: 46,
          title: isEs ? "Pasamanos Superior Monolítico de Remate" : "Monolithic Continuous Top Railing",
          spec: isEs ? "Tubo rectangular soldado en inglete a 45° • Pulido sin juntas" : "Mitered 45° corners • Flush ground invisible seams",
          standard: "IBC 1015 Guardrails Specification",
          desc: isEs
            ? "Pasamanos de línea continua que distribuye cargas de impacto a lo largo de todos los postes de la terraza."
            : "Continuous top rail providing load-sharing redundancy and a sleek modern architectural cap."
        },
        {
          id: 4,
          x: 14, y: 8,
          title: isEs ? "Barandilla en Terraza Superior" : "Upper Balcony Railing Extension",
          spec: isEs ? "Perfilería unificada en toda la fachada • Conexión sismorresistente" : "Unified architectural profiles • Seismic and wind load certified",
          standard: "ASCE 7-16 Minimum Design Loads",
          desc: isEs
            ? "Mismo lenguaje arquitectónico extendido a las terrazas del segundo nivel para coherencia visual absoluta."
            : "Extends identical design language to the second level, creating a unified architectural envelope."
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
          x: 12, y: 53,
          title: isEs ? "Pilar de Hormigón & Bisagra Pivotante Oculta" : "Structural Pillar & Concealed Heavy Hinge",
          spec: isEs ? "Cojinete de acero inoxidable sellado • Capacidad 3,000 lbs" : "Sealed stainless pivot bearing • 3,000 lb static leaf rating",
          standard: "ANSI/BHMA A156.4 Grade 1 Certified",
          desc: isEs
            ? "Eje pivotante de alta precisión embutido en columna estructural que permite girar hojas de 14 pies con empuje de un dedo."
            : "Heavy-duty underground and upper pivot bearings allowing massive gate leaves to swing silently with zero friction."
        },
        {
          id: 1,
          x: 32, y: 58,
          title: isEs ? "Lamas Horizontales con Iluminación LED Integrada" : "CNC Laser Slotted Louvers & LED Channels",
          spec: isEs ? "Corte láser de fibra 6kW • Ranura milimétrica para tira LED IP68" : "6kW fiber laser slots • Integrated IP68 architectural linear LED",
          standard: "UL 8750 LED Equipment / AAMA 2604",
          desc: isEs
            ? "Ranurado continuo que proyecta luz arquitectónica rasante cálida hacia la entrada vehicular durante la noche."
            : "Laser-cut horizontal louvers housing concealed low-voltage warm architectural lighting for night visibility."
        },
        {
          id: 2,
          x: 49.5, y: 60,
          title: isEs ? "Cierre Central Antiapalancamiento" : "Anti-Pry Center Interlock & Latch",
          spec: isEs ? "Tolerancia de encaje 1.5 mm • Burlete de absorción acústica" : "1.5 mm closure tolerance • Neoprene acoustic dampener",
          standard: "ASTM F2200 Automated Gate Safety",
          desc: isEs
            ? "Machihembrado de acero de 1/4\" que bloquea la unión central impidiendo cualquier apalancamiento exterior."
            : "Interlocking full-height steel tongue prevents forced entry while magnetic catches ensure whisper-quiet closure."
        },
        {
          id: 3,
          x: 68, y: 58,
          title: isEs ? "Estructura Interna de Tubo A36 Antitorsión" : "Anti-Sag Structural Internal Skeleton",
          spec: isEs ? "Tubo estructural 3\" x 3\" HSS • Flecha nula en voladizo" : "3\" x 3\" HSS inner trussing • Zero sag over 20-year span",
          standard: "ASTM A500 Grade B Structural Tubing",
          desc: isEs
            ? "Entramado interno triangular oculto tras las chapas que elimina cualquier flexión diagonal a lo largo de décadas."
            : "Internal structural triangulation hidden behind face plates ensures the gate wing never droops or binds."
        },
        {
          id: 4,
          x: 87, y: 54,
          title: isEs ? "Columna Receptora & Acabado Polimérico" : "Receiving Column & Exterior Finish",
          spec: isEs ? "Capa electrostática 4.0 mils • Curado 400°F libre de solventes" : "4.0 mils TGIC powder barrier • 400°F zero-VOC cure",
          standard: "AAMA 2604 / ASTM D3359 Adhesion",
          desc: isEs
            ? "Columna terminal con sensor óptico de seguridad y acabado ultra resistente a impactos de grava y rayos UV."
            : "Terminal post housing safety photo-eyes, finished to withstand road gravel, sun exposure, and extreme weather."
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
            <span>{isEs ? 'FABRICACIÓN METÁLICA ARQUITECTÓNICA // HECHO PARA DURAR' : 'ARCHITECTURAL CUSTOM FABRICATION // BUILT TO LAST'}</span>
          </div>
          <h1 className="text-gradient">
            {isEs 
              ? 'Donde el Rigor Estructural se Une a la Elegancia Arquitectónica.' 
              : 'Where Structural Rigor Meets Architectural Grace.'}
          </h1>
          <p className="about-hero-lead">
            {isEs
              ? 'Station Metalworks es un estudio de fabricación metálica personalizada de alta gama, dedicado a la ingeniería de precisión y la durabilidad arquitectónica. Respaldados por más de dos décadas de maestría en soldadura estructural certificada, diseñamos, fabricamos e instalamos puertas de autor, barandillas, pasamanos, mesas y proyectos a medida concebidos para proteger a las personas, realzar los espacios y trascender generaciones.'
              : 'Station Metalworks is an advanced custom metal fabrication studio dedicated to precision engineering and heirloom-grade craftsmanship. Rooted in over two decades of certified structural welding expertise, we design, fabricate, and install bespoke architectural doors, railings, stairs, and custom metal furniture engineered to protect families and endure for generations.'}
          </p>
        </div>

        {/* Live KPI Ticker */}
        <div className="about-stats-grid">
          <div className="stat-card">
            <span className="stat-val">20+ {isEs ? 'Años' : 'Yrs'}</span>
            <span className="stat-lbl">{isEs ? 'Maestría en Metalurgia' : 'Structural Mastery'}</span>
            <span className="stat-sub">{isEs ? 'Más de 20 años de oficio certificado' : 'Over two decades of certified welding'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">100%</span>
            <span className="stat-lbl">{isEs ? 'Fabricación Propia' : 'In-House Fabrication'}</span>
            <span className="stat-sub">{isEs ? 'Cero subcontrataciones, control integral' : 'Zero subcontracting, total shop control'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">AWS D1.1</span>
            <span className="stat-lbl">{isEs ? 'Soldadura Homologada' : 'Certified Welding Standard'}</span>
            <span className="stat-sub">{isEs ? 'Fusión estructural certificada' : 'Structural code-compliant fusion'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-val">1,400+</span>
            <span className="stat-lbl">{isEs ? 'Obras Entregadas' : 'Completed Installations'}</span>
            <span className="stat-sub">{isEs ? 'Residencial y comercial en todo el país' : 'Residential & commercial nationwide'}</span>
          </div>
        </div>
      </section>

      {/* 2. THE STATION HERITAGE & PHILOSOPHY */}
      <section className="founder-story-section container">
        <div className="founder-story-container">
          
          {/* Section Header */}
          <div className="section-header">
            <span className="tag-label">
              <Hammer size={14} />
              {isEs ? 'NUESTRA FILOSOFÍA DE OFICIO // MÁS DE 20 AÑOS' : 'OUR FOUNDING HERITAGE // OVER 20 YEARS'}
            </span>
            <h2 className="text-gradient">
              {isEs 
                ? 'Dos Décadas de Rigor Estructural Guiadas por la Seguridad Humana' 
                : 'Over Two Decades of Structural Rigor, Driven by Human Safety'}
            </h2>
            <p>
              {isEs
                ? 'Nuestra empresa se fundó sobre un principio innegociable: la auténtica fabricación metálica no consiste simplemente en transformar acero, sino en garantizar la seguridad, la estabilidad y la tranquilidad diaria de las personas.'
                : 'Our foundation was built on an uncompromising truth: architectural metalwork is not merely about shaping steel — it is about the safety, comfort, and peace of mind of the people who rely on it every day.'}
            </p>
          </div>

          {/* Top Row: Executive Vision Card / Brand Manifesto */}
          <div className="founder-voice-card">
            <div className="voice-card-glow" />
            <div className="voice-card-header">
              <div className="voice-badge">
                <Sparkles size={16} className="icon-crimson" />
                <span>{isEs ? 'EL MANIFIESTO STATION // FILOSOFÍA DE TALLER' : 'THE STATION CREED // WORKSHOP ETHOS'}</span>
              </div>
              <div className="cert-stamp">
                <ShieldCheck size={16} />
                <span>AWS D1.1 STRUCTURAL STANDARD • 20+ YRS</span>
              </div>
            </div>

            <blockquote className="founder-speech">
              {isEs ? (
                <>
                  <p className="speech-p highlight">
                    &ldquo;En el trabajo con acero, no existe margen para el compromiso. Cada barandilla que resguarda una escalera, cada puerta de autor que protege un hogar y cada cordón de soldadura fundido en nuestro taller conlleva una responsabilidad humana fundamental: la seguridad de las familias.&rdquo;
                  </p>
                  <p className="speech-p">
                    &ldquo;Nuestra historia nació de una rigurosa formación técnica y disciplina de precisión que evolucionó hacia la maestría del metal y el fuego. Con más de dos décadas de experiencia como soldadores certificados, sentimos un orgullo genuino en cada ensamble que creamos: soluciones hechas a medida con honestidad, sin atajos y con garantía de por vida.&rdquo;
                  </p>
                </>
              ) : (
                <>
                  <p className="speech-p highlight">
                    &ldquo;When building with steel, there is zero margin for compromise. Every railing guarding a flight of stairs, every architectural door securing a home, and every weld bead fused in our shop carries an essential human responsibility: the safety of families.&rdquo;
                  </p>
                  <p className="speech-p">
                    &ldquo;Our story began with rigorous technical discipline that naturally evolved into a deep mastery of metallurgy and certified structural welding. With over two decades of hands-on experience, we take genuine artisan pride in every assembly we forge: bespoke solutions engineered with absolute integrity, zero shortcuts, and lifetime durability.&rdquo;
                  </p>
                </>
              )}
            </blockquote>

            <div className="founder-profile-footer">
              <div className="founder-meta">
                <div className="founder-avatar-initials">SM</div>
                <div>
                  <h4 className="founder-name">{isEs ? 'Herencia Station Metalworks' : 'Station Metalworks Heritage'}</h4>
                  <span className="founder-role">
                    {isEs ? 'Más de 20 Años Forjando Estructuras de Autor' : 'Over 20 Years of Certified Structural Metallurgy'}
                  </span>
                </div>
              </div>
              <div className="founder-credentials">
                <span className="cred-chip">✓ {isEs ? 'Ingeniería Orientada a la Seguridad' : 'Safety-First Engineering'}</span>
                <span className="cred-chip">✓ {isEs ? 'Fabricación Propia en Taller' : '100% In-House Shop Control'}</span>
                <span className="cred-chip">✓ {isEs ? 'Garantía Estructural de Por Vida' : 'Lifetime Structural Guarantee'}</span>
              </div>
            </div>
          </div>

          {/* 3 Core Philosophical Pillars */}
          <div className="founder-pillars-grid">
            
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Zap size={22} className="text-crimson" />
              </div>
              <h3>{isEs ? 'De la Precisión Técnica a la Maestría Estructural' : 'Technical Precision to Structural Mastery'}</h3>
              <p>
                {isEs 
                  ? 'Nuestros orígenes se forjaron en una rigurosa disciplina técnica, donde la exactitud matemática y el respeto irrestricto por las normativas eran indispensables. Esa base evolucionó hacia una profunda especialización en metalurgia y soldadura estructural certificada, aportando más de dos décadas de dominio continuo sobre acero al carbono, acero inoxidable y aleaciones estructurales.'
                  : 'Our origins are rooted in rigorous technical and electrical discipline, where mathematical exactitude and code adherence were non-negotiable. That foundation evolved into specialized metallurgical mastery and certified structural welding, bringing more than two decades of continuous expertise over heavy carbon steel, stainless, and architectural alloys.'}
              </p>
              <span className="pillar-tag">{isEs ? 'RIGOR TÉCNICO & CERTIFICACIÓN AWS' : 'TECHNICAL RIGOR & AWS CERTIFICATION'}</span>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <HeartHandshake size={22} className="text-crimson" />
              </div>
              <h3>{isEs ? 'Vocación de Servicio & Orgullo Artesanal' : 'A Genuine Calling to Support & Serve'}</h3>
              <p>
                {isEs
                  ? 'Creemos que el verdadero valor de nuestro oficio radica en apoyar a propietarios, arquitectos y constructores a convertir conceptos complejos en realidades tangibles y seguras. No somos intermediarios ni vendedores impersonales: somos artesanos comprometidos que atienden a cada cliente con transparencia y sienten un orgullo profundo por cada obra entregada.'
                  : 'We believe the true value of our craft lies in partnering with homeowners, architects, and builders to transform complex concepts into tangible, enduring realities. We are not brokers or sales representatives: we are dedicated craftsmen who treat every client with transparency and take immense personal pride in every delivered project.'}
              </p>
              <span className="pillar-tag">{isEs ? 'ORGULLO ARTESANAL & ATENCIÓN DIRECTA' : 'ARTISAN PRIDE & DIRECT COLLABORATION'}</span>
            </div>

            <div className="pillar-card highlight-safety">
              <div className="pillar-icon-box">
                <ShieldCheck size={22} className="text-crimson" />
              </div>
              <h3>{isEs ? 'La Seguridad Humana Como Estándar Sagrado' : 'Human Safety as an Unyielding Standard'}</h3>
              <p>
                {isEs
                  ? 'Para nosotros, una barandilla jamás es un simple elemento estético; es el apoyo en el que confían niños y ancianos. Una puerta no es solo un marco; es el escudo protector de un hogar. Toda placa de anclaje, perno estructural y cordón de soldadura se calcula y ejecuta para superar con holgura los códigos internacionales de edificación IBC.'
                  : 'To us, a railing is never merely decorative; it is the vital safeguard holding families and visitors safe above an elevation. A door is not just an entry; it is a household’s primary shield. Every anchor plate, structural bolt, and full-penetration weld is engineered to comfortably surpass International Building Code (IBC) standards.'}
              </p>
              <span className="pillar-tag">{isEs ? 'CÓDIGO IBC // SEGURIDAD TOTAL' : 'IBC COMPLIANCE // ZERO COMPROMISE'}</span>
            </div>

          </div>

          {/* 4 Direct Specialty Cards */}
          <div className="specialties-section">
            <div className="specialties-header">
              <span className="specialties-eyebrow">
                {isEs ? 'DISCIPLINAS DE FABRICACIÓN EN TALLER // LÍNEAS PRINCIPALES' : 'CORE WORKSHOP DISCIPLINES // PRIMARY CAPABILITIES'}
              </span>
              <h3>
                {isEs 
                  ? 'Soluciones Metálicas Arquitectónicas Diseñadas y Fabricadas a Medida' 
                  : 'Architectural Metal Solutions Designed & Built to Order'}
              </h3>
            </div>

            <div className="specialties-grid">
              
              <div className="specialty-card">
                <div className="spec-number">01</div>
                <h4>{isEs ? 'Puertas de Autor & Portones de Seguridad' : 'Architectural Doors & Entry Gates'}</h4>
                <p>
                  {isEs
                    ? 'Puertas pivotantes monumentales, portones corredizos automatizados y accesos de seguridad con bastidores internos antitorsión, cerraduras de alta seguridad antiapalancamiento y bisagras de pivote selladas con cojinetes inoxidables.'
                    : 'Monumental pivot doors, automated sliding driveway gates, and security entries engineered with rigid anti-sag internal skeletons, anti-pry deadbolt interlocks, and whisper-quiet stainless pivot bearings.'}
                </p>
                <div className="spec-tags">
                  <span>{isEs ? 'Puertas Pivotantes' : 'Pivot Doors'}</span>
                  <span>{isEs ? 'Portones Corredizos' : 'Sliding Gates'}</span>
                  <span>{isEs ? 'Cerraduras Antirrobo' : 'Anti-Pry Security'}</span>
                </div>
              </div>

              <div className="specialty-card">
                <div className="spec-number">02</div>
                <h4>{isEs ? 'Barandillas Estructurales para Toda la Vida' : 'High-Load Structural Railing Systems'}</h4>
                <p>
                  {isEs
                    ? 'Sistemas de barandillas modernas de cable marino, vidrio estructural embutido o acero arquitectónico para escaleras monumentales, terrazas y balcones voladizos. Superan la norma IBC de 200 lb de carga puntual con deflexión nula.'
                    : 'Architectural cable railings, monolithic base-shoe glass, and steel guardrails for monumental stairs, exterior decks, and cantilever balconies. Engineered to exceed 200 lb concentrated loads with zero structural deflection.'}
                </p>
                <div className="spec-tags">
                  <span>{isEs ? 'Sistemas de Cable' : 'Cable Systems'}</span>
                  <span>{isEs ? 'Vidrio Estructural' : 'Glass Base-Shoe'}</span>
                  <span>{isEs ? 'Deflexión Cero' : 'Zero Deflection'}</span>
                </div>
              </div>

              <div className="specialty-card">
                <div className="spec-number">03</div>
                <h4>{isEs ? 'Pasamanos Continuos de Alto Tránsito' : 'Continuous Ergonomic Handrails'}</h4>
                <p>
                  {isEs
                    ? 'Pasamanos fijados a muro o a suelo con agarre continuo bajo normativa de accesibilidad ADA, curvado de mandril sin arrugas ni deformación, retornos redondeados suaves y anclajes estructurales ensayados para alto tránsito.'
                    : 'Wall-mounted and floor-supported handrails engineered to ADA accessibility standards, featuring smooth continuous graspability, wrinkle-free mandrel bends, radiused returns, and heavy-duty structural anchor mounts.'}
                </p>
                <div className="spec-tags">
                  <span>{isEs ? 'Normativa ADA' : 'ADA Compliant'}</span>
                  <span>{isEs ? 'Inox 316 Marino' : 'Marine 316 Stainless'}</span>
                  <span>{isEs ? 'Curvado por Mandril' : 'Mandrel Bent'}</span>
                </div>
              </div>

              <div className="specialty-card">
                <div className="spec-number">04</div>
                <h4>{isEs ? 'Mesas Estructurales & Mobiliario de Autor' : 'Bespoke Metal Tables & Studio Furniture'}</h4>
                <p>
                  {isEs
                    ? 'Mesas de comedor monumentales, escritorios ejecutivos y bases metálicas de diseño arquitectónico con uniones soldadas invisibles pulidas a ras, estructuras reforzadas antitorsión y recubrimiento electrostático termoendurecido.'
                    : 'Statement dining tables, executive desks, and architectural metal bases featuring seamless flush-ground welded joints, concealed cable routing, rigid anti-twist framing, and baked protective powder finishes.'}
                </p>
                <div className="spec-tags">
                  <span>{isEs ? 'Mesas de Comedor' : 'Dining Tables'}</span>
                  <span>{isEs ? 'Bases de Diseño' : 'Designer Bases'}</span>
                  <span>{isEs ? 'Uniones Invisibles' : 'Seamless Welds'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. HIGH-TECH MACHINERY & WORKSHOP TOUR */}
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

        /* 2. Founder Story: José Almanza */
        .founder-story-section {
          padding: 60px 0 70px 0;
          position: relative;
        }

        .founder-story-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .founder-voice-card {
          position: relative;
          background: linear-gradient(140deg, #020032 0%, #0A0648 60%, #150942 100%);
          border: 1px solid rgba(224, 0, 39, 0.35);
          border-radius: 20px;
          padding: 42px 48px;
          box-shadow: 0 16px 40px rgba(2, 0, 50, 0.25);
          overflow: hidden;
        }

        .voice-card-glow {
          position: absolute;
          top: -80px;
          right: -80px;
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(224, 0, 39, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        .voice-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
        }

        .voice-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: #FF5A70;
          background: rgba(224, 0, 39, 0.15);
          border: 1px solid rgba(224, 0, 39, 0.3);
          padding: 5px 12px;
          border-radius: 6px;
        }

        .cert-stamp {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: #10B981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 6px 14px;
          border-radius: 999px;
        }

        .founder-speech {
          margin: 0;
          padding-left: 20px;
          border-left: 3px solid var(--color-accent, #e00027);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .speech-p {
          font-size: 1.15rem;
          line-height: 1.65;
          color: #DDE2EB;
          font-style: italic;
          font-family: var(--font-heading);
          margin: 0;
        }

        .speech-p.highlight {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFFFFF;
          font-style: normal;
        }

        .speech-p.highlight-accent {
          font-weight: 700;
          color: #FFA3A3;
          font-style: normal;
        }

        .founder-profile-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }

        .founder-meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .founder-avatar-initials {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(224, 0, 39, 0.4);
          border: 2px solid #FFF;
        }

        .founder-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 2px 0;
        }

        .founder-role {
          font-family: monospace;
          font-size: 0.76rem;
          color: #94A3B8;
        }

        .founder-credentials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cred-chip {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #34D399;
          background: rgba(52, 211, 153, 0.12);
          border: 1px solid rgba(52, 211, 153, 0.25);
          padding: 5px 12px;
          border-radius: 6px;
        }

        /* 3 Pillars */
        .founder-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .pillar-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 30px 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 6px 20px rgba(2, 0, 50, 0.03);
          transition: all 0.2s ease;
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 12px 30px rgba(2, 0, 50, 0.08);
        }

        .pillar-card.highlight-safety {
          border-color: rgba(224, 0, 39, 0.25);
          background: linear-gradient(180deg, #FFFFFF 0%, #FFF7F7 100%);
        }

        .pillar-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(224, 0, 39, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pillar-card h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .pillar-card p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-secondary, #3b3e54);
          margin: 0;
        }

        .pillar-tag {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.05em;
          margin-top: auto;
          padding-top: 10px;
        }

        /* 4 Specialties */
        .specialties-section {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .specialties-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .specialties-eyebrow {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.06em;
        }

        .specialties-header h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .specialties-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .specialty-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .specialty-card:hover {
          transform: translateY(-3px);
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 10px 24px rgba(224, 0, 39, 0.08);
        }

        .spec-number {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 900;
          color: var(--color-accent, #e00027);
        }

        .specialty-card h4 {
          font-size: 1rem;
          font-weight: 800;
          line-height: 1.35;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .specialty-card p {
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--color-text-secondary, #3b3e54);
          margin: 0;
        }

        .spec-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
          padding-top: 10px;
        }

        .spec-tags span {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          background: #EEF2F6;
          color: var(--color-brand-dark, #020032);
          padding: 3px 8px;
          border-radius: 4px;
        }

        /* 3. Machinery Tour */
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
          grid-template-columns: 1.1fr 1fr;
          gap: 32px;
          align-items: center;
        }

        .anatomy-canvas-container {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: #0B0E1B;
          border: 1px solid #232B47;
          width: 100%;
          aspect-ratio: 1 / 1;
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
          opacity: 0.9;
          filter: contrast(110%);
          display: block;
        }

        .canvas-system-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(11, 14, 27, 0.88);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #232B47;
          display: flex;
          flex-direction: column;
          z-index: 5;
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
          .founder-pillars-grid {
            grid-template-columns: 1fr;
          }
          .specialties-grid {
            grid-template-columns: repeat(2, 1fr);
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
          .founder-voice-card {
            padding: 26px 20px;
          }
          .founder-speech {
            padding-left: 14px;
          }
          .speech-p {
            font-size: 1.02rem;
          }
          .speech-p.highlight {
            font-size: 1.15rem;
          }
          .founder-profile-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          .specialties-section {
            padding: 24px 18px;
          }
          .specialties-grid {
            grid-template-columns: 1fr;
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
