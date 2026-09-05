import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Ruler, Hammer, PenTool, 
  Upload, Sparkles, AlertTriangle, FileText, ChevronRight, 
  Cpu, Award, Truck, Layers, Activity, HelpCircle,
  Eye, Maximize2, X, MapPin, CheckCircle
} from 'lucide-react';

import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import handrailsImg from '../assets/service_handrails.png';
import gatesImg from '../assets/service_gates.png';
import customImg from '../assets/service_custom.png';
import ServiceCtaForm from './ServiceCtaForm';
import { updateMetaTags } from '../services/seoConfig';

export default function ServiceDetailPage({ serviceId }) {
  const { t, language } = useLanguage();

  useEffect(() => {
    updateMetaTags(`services/${serviceId}`);
  }, [serviceId]);
  
  // Custom states inside single pages
  const [railingLength, setRailingLength] = useState(25);
  const [stairsHeight, setStairsHeight] = useState(108);
  const [customFile, setCustomFile] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [activeLightbox, setActiveLightbox] = useState(null);

  const serviceImages = {
    stairs: stairsImg,
    railings: railingsImg,
    handrails: handrailsImg,
    gates: gatesImg,
    custom: customImg,
    specialty: customImg
  };

  // Curated architectural project installations per service
  const galleryData = useMemo(() => ({
    stairs: [
      {
        id: 'st-1',
        titleEn: 'Beverly Hills Cantilever Residence',
        titleEs: 'Residencia Cantilever Beverly Hills',
        type: 'residential',
        location: 'Beverly Hills, CA',
        materials: 'A36 Steel Spine • 3.0" American Walnut',
        finish: 'Matte Black Electrostatic & Satin Wood Oil',
        descEn: 'Floating mono-stringer staircase with concealed steel channel wall embedding and frameless laminated glass guards.',
        descEs: 'Escalera voladiza mono-viga empotrada a muro de concreto con peldaños de nogal macizo y barandal de cristal templado.',
        image: stairsImg,
        badge: 'Award Winner'
      },
      {
        id: 'st-2',
        titleEn: 'Austin Hillside Architectural Monostringer',
        titleEs: 'Mono-Viga Arquitectónica Austin Hillside',
        type: 'residential',
        location: 'Austin, TX',
        materials: '12"x6" Structural Tube • White Oak Treads',
        finish: 'Raw Industrial Clear Coat',
        descEn: 'Dramatic double-height flight spanning 18 feet without intermediate supports, engineered with sub-millimeter deflection.',
        descEs: 'Tramo de doble altura de 18 pies sin apoyos intermedios, calculada con deflexión inferior al estándar L/360.',
        image: '/gallery/gallery_stairs_austin.jpg',
        badge: 'Featured in ArchDaily'
      },
      {
        id: 'st-3',
        titleEn: 'Culver City Tech Studio Double Flight',
        titleEs: 'Doble Tramo Estudio Creativo Culver City',
        type: 'commercial',
        location: 'Los Angeles, CA',
        materials: 'Zig-Zag Profiled Plate • Steel Bar Grating',
        finish: 'Midnight Navy Powder Coat',
        descEn: 'Commercial high-traffic open riser staircase built to IBC egress guidelines with integrated emergency strip lighting.',
        descEs: 'Escalera de alto tránsito conforme a normas IBC con peldaños de rejilla electroforjada e iluminación LED rasante.',
        image: '/gallery/gallery_stairs_commercial.jpg',
        badge: 'Commercial Grade'
      },
      {
        id: 'st-4',
        titleEn: 'Hidden Stringer Anchor Detail',
        titleEs: 'Detalle de Anclaje Oculto de Peldaño',
        type: 'details',
        location: 'Workshop In-House Test',
        materials: '1/2" CNC Plasma Plate • Grade 8 Hardware',
        finish: 'Passivated Primer',
        descEn: 'Internal steel torque box tested to withstand 1,200 lbs dynamic tip point load per individual floating step.',
        descEs: 'Caja de torsión interna probada para soportar más de 1,200 lbs de carga puntual en el extremo del peldaño.',
        image: '/gallery/gallery_stairs_detail.jpg',
        badge: 'PE Certified'
      }
    ],
    railings: [
      {
        id: 'ra-1',
        titleEn: 'Pacific Palisades Coastal Deck Railing',
        titleEs: 'Barandal Costero Pacific Palisades',
        type: 'residential',
        location: 'Pacific Palisades, CA',
        materials: 'AISI 316 Stainless Posts • 1/8" Marine Wire',
        finish: '320-Grit Directional Satin Finish',
        descEn: 'Marine-grade cable railing system designed for saltwater corrosion resistance and unobstructed ocean views.',
        descEs: 'Sistema de cable de acero grado marino diseñado contra corrosión salina con vistas ininterrumpidas al océano.',
        image: '/gallery/gallery_railing_cable.jpg',
        badge: 'Corrosion Shield'
      },
      {
        id: 'ra-2',
        titleEn: 'Aspen Modern Mountain Chalet Railing',
        titleEs: 'Barandal Chalet de Montaña Aspen',
        type: 'residential',
        location: 'Aspen, CO',
        materials: '2"x2" Carbon Steel Posts • Walnut Top Rail',
        finish: 'Blackened Thermal Patina',
        descEn: 'Custom heavy-wall steel posts core-drilled into natural slate floor, accented by a warm sculpted hardwood cap.',
        descEs: 'Postes de acero anclados a piso de pizarra natural con pasamanos superior de madera maciza de nogal.',
        image: railingsImg,
        badge: 'High Altitude Test'
      },
      {
        id: 'ra-3',
        titleEn: 'Miami Biscayne Bay Glass Balustrade',
        titleEs: 'Barandal de Cristal Bahía de Miami',
        type: 'commercial',
        location: 'Miami, FL',
        materials: '1/2" Laminated Tempered Glass • Fascia Base Shoe',
        finish: 'Anodized Architectural Silver',
        descEn: 'High-wind load glass guardrail certified to withstand 140 mph hurricane gusts on a 24th floor rooftop terrace.',
        descEs: 'Barandal de cristal laminado certificado para resistir vientos de huracán de 140 mph en terraza de piso 24.',
        image: '/gallery/gallery_railing_glass.jpg',
        badge: 'Hurricane Rated'
      },
      {
        id: 'ra-4',
        titleEn: 'Swage Tensioner Precision Fitting',
        titleEs: 'Detalle de Tensor Swage Invisible',
        type: 'details',
        location: 'Station Metalworks Cleanroom',
        materials: 'Machined 316 Stainless Steel',
        finish: 'Electro-Polished Clean',
        descEn: 'Concealed swage receiver hidden entirely inside the end post with zero exposed threads or nuts.',
        descEs: 'Receptor swage oculto totalmente en el interior del poste terminal sin tuercas ni roscas a la vista.',
        image: railingsImg,
        badge: 'Zero Hardware Reveal'
      }
    ],
    handrails: [
      {
        id: 'hr-1',
        titleEn: 'Bel Air Gallery Continuous Wall Handrail',
        titleEs: 'Pasamanos Continuo Galería Bel Air',
        type: 'residential',
        location: 'Bel Air, CA',
        materials: '2"x0.5" Slim Oval Lux Stainless Steel',
        finish: 'Fine Hairline Brushed Stainless',
        descEn: 'Architectural slim oval handrail with custom curved 90-degree transitions and hidden wall mounting studs.',
        descEs: 'Pasamanos ovalado ultra delgado con transiciones curvas a 90 grados y fijaciones invisibles a muro.',
        image: handrailsImg,
        badge: 'Architect Favorite'
      },
      {
        id: 'hr-2',
        titleEn: 'Houston Medical Center ADA Access Rail',
        titleEs: 'Pasamanos ADA Centro Médico Houston',
        type: 'commercial',
        location: 'Houston, TX',
        materials: '1.5" OD Round AISI 304 Tubing',
        finish: 'Antimicrobial Powder Coat',
        descEn: 'Full 120-foot ramp compliance system meeting commercial ADA Chapter 5 clearances and tactile end returns.',
        descEs: 'Sistema de rampa de 120 pies continuos conforme a directivas ADA con terminales cerrados hacia muro.',
        image: '/gallery/gallery_handrail_ada.jpg',
        badge: '100% ADA Pass'
      },
      {
        id: 'hr-3',
        titleEn: 'Chicago Downtown Boutique Hotel Stairway',
        titleEs: 'Escalera Hotel Boutique Chicago',
        type: 'commercial',
        location: 'Chicago, IL',
        materials: 'Wrought Iron Forged Handrail • Brass End Caps',
        finish: 'Matte Charcoal & Satin Brass',
        descEn: 'Handcrafted wrought steel stair handrail with solid turned brass end stops and decorative wall rosettes.',
        descEs: 'Pasamanos de hierro forjado a mano con remates torneados de latón y rosetas decorativas de sujeción.',
        image: handrailsImg,
        badge: 'Custom Forge'
      },
      {
        id: 'hr-4',
        titleEn: 'Wall Clearance & Bracket Mount Detail',
        titleEs: 'Detalle de Soporte y Holgura de Agarre',
        type: 'details',
        location: 'Station Metalworks Studio',
        materials: 'Solid CNC Machined Stainless Steel',
        finish: 'Matte Black PVD Coating',
        descEn: 'Heavy duty architectural bracket engineered for 300 lbs point load exceeding building code minimums.',
        descEs: 'Soporte mecanizado en acero macizo probado para resistir más de 300 lbs de esfuerzo puntual.',
        image: handrailsImg,
        badge: 'Heavy Duty 300lb'
      }
    ],
    gates: [
      {
        id: 'gt-1',
        titleEn: 'Brentwood Modern Cantilever Driveway Gate',
        titleEs: 'Portón Voladizo Brentwood',
        type: 'residential',
        location: 'Brentwood, CA',
        materials: '6061-T6 Aluminum Frame • Dark Oak Slats',
        finish: 'Architectural Textured Charcoal',
        descEn: 'Automatic 22-foot cantilever slide gate floating effortlessly over sloped ground with hidden motor housing.',
        descEs: 'Portón voladizo motorizado de 22 pies sin riel de piso, con cerramiento de lamas y automatización integrada.',
        image: '/gallery/gallery_gate_sliding.jpg',
        badge: 'Estate Class'
      },
      {
        id: 'gt-2',
        titleEn: 'Scottsdale Desert Courtyard Privacy Gate',
        titleEs: 'Puerta de Privacidad Scottsdale Desert',
        type: 'residential',
        location: 'Scottsdale, AZ',
        materials: 'Structural Corten & Laser Slat Steel',
        finish: 'Controlled Oxidation Patina',
        descEn: 'Perimeter pedestrian security gate featuring geometric laser-cut ventilation patterns and smart lock integration.',
        descEs: 'Puerta peatonal perimetral con perforado láser geométrico y cerradura inteligente de alta seguridad.',
        image: '/gallery/gallery_gate_pivot.jpg',
        badge: 'Desert Rust Proof'
      },
      {
        id: 'gt-3',
        titleEn: 'Houston Corporate HQ Security Gate Array',
        titleEs: 'Control de Acceso Corporativo Houston',
        type: 'commercial',
        location: 'Houston, TX',
        materials: 'Heavy Wall Steel Tubing • Anti-Climb Mesh',
        finish: 'Dual Layer Hot-Dip Galvanized & Epoxy',
        descEn: 'Industrial crash-rated security gate perimeter with high-cycle hydraulic operators tested for 500 cycles/day.',
        descEs: 'Sistema de portones industriales con certificación contra impactos y operadores hidráulicos de alto ciclo.',
        image: gatesImg,
        badge: 'Crash Rated'
      },
      {
        id: 'gt-4',
        titleEn: 'Internal Carriage Roller Detail',
        titleEs: 'Detalle de Carro y Rodamientos de Guía',
        type: 'details',
        location: 'Station Metalworks Assembly Bay',
        materials: 'Sealed Double Bearings • CNC Machined Track',
        finish: 'Zinc Dichromate Plated',
        descEn: 'Heavy duty sealed bearing truck assembly providing whisper-quiet slide operation even under 2,000 lb gate weights.',
        descEs: 'Conjunto de rodamientos sellados de precisión que asegura deslizamiento ultrasilencioso en portones de hasta 2,000 lbs.',
        image: gatesImg,
        badge: 'Whisper Glide'
      }
    ],
    custom: [
      {
        id: 'cs-1',
        titleEn: 'Silicon Valley Tech Campus Architectural Trellis',
        titleEs: 'Pérgola Arquitectónica Silicon Valley',
        type: 'commercial',
        location: 'Palo Alto, CA',
        materials: 'W8x24 Wide Flange Steel Beams • Aluminum Louvers',
        finish: 'Fluoropolymer 20-Year Exterior Coat',
        descEn: '60-foot outdoor cantilevered shade pergola engineered to span open plaza areas with concealed internal drainage.',
        descEs: 'Pérgola en voladizo de 60 pies con drenaje interno oculto en vigas estructurales y lamas de sombra reguladas.',
        image: '/gallery/gallery_custom_screen.jpg',
        badge: 'Massive Structural'
      },
      {
        id: 'cs-2',
        titleEn: 'Hollywood Hills Geometric Corten Fire Feature',
        titleEs: 'Hogar Exterior Corten Hollywood Hills',
        type: 'residential',
        location: 'Hollywood Hills, CA',
        materials: '3/8" Weathering Steel Plate (ASTM A588)',
        finish: 'Natural Weathering Rust Patina',
        descEn: 'Custom geometric outdoor fireplace designed in collaboration with award-winning California architects.',
        descEs: 'Chimenea exterior escultórica fabricada en chapa gruesa de acero corten soldada en chaflán continuo.',
        image: customImg,
        badge: 'Sculptural Art'
      },
      {
        id: 'cs-3',
        titleEn: 'Downtown LA Industrial Steel & Glass Partition',
        titleEs: 'Mampara Acústica Acero y Cristal DTLA',
        type: 'commercial',
        location: 'Downtown Los Angeles, CA',
        materials: 'Solid Hot-Rolled Steel Tees • Acoustic Glass',
        finish: 'Matte Black Waxed Steel',
        descEn: 'Warehouse loft floor-to-ceiling multi-panel acoustic room divider with custom pivot doors and magnetic latches.',
        descEs: 'División de piso a techo estilo industrial con puertas pivotantes de acero laminado en caliente y cristal acústico.',
        image: customImg,
        badge: 'Acoustic Rated'
      },
      {
        id: 'cs-4',
        titleEn: 'Pristine TIG Stacked-Dimes Weld Detail',
        titleEs: 'Detalle de Soldadura TIG Escamada',
        type: 'details',
        location: 'AWS Certification Test Cell',
        materials: 'AISI 316L Stainless Steel Plate',
        finish: 'Passivated Clean Weld',
        descEn: 'Structural full-penetration weld completed by AWS D1.1 certified master welders under inert argon shielding.',
        descEs: 'Cordón de soldadura TIG de penetración completa ejecutado por soldadores homologados bajo atmósfera de argón.',
        image: customImg,
        badge: 'AWS D1.1 Certified'
      }
    ]
  }), []);

  const servicesData = useMemo(() => ({
    stairs: {
      titleEn: 'Staircase Systems & Cantilevers',
      titleEs: 'Sistemas de Escaleras y Estructuras en Voladizo',
      subtitleEn: 'Floating cantilevered and monostringer staircase systems designed for modern residential luxury and engineered for structural load bearing.',
      subtitleEs: 'Sistemas de escaleras flotantes y mono-viga diseñados para residencias de lujo y calculados bajo rigurosos coeficientes de carga.',
      materialsEn: 'A36 Structural Carbon Steel core, premium walnut / white oak hardwood treads (1.5" to 3.0" thicknesses), high-tensile wall anchoring channels.',
      materialsEs: 'Núcleo de acero estructural A36, huellas de madera dura de nogal y roble (de 1.5" a 3.0"), canales de anclaje de alta resistencia a tracción.',
      codeEn: 'Complies with IRC 2021 code specifications (rise height <= 7.75", run depth >= 10", clear width >= 36", load-tested to exceed concentrated load of 1000 lbs).',
      codeEs: 'Cumple con códigos IRC 2021 (contrahuella <= 7.75", huella >= 10", ancho de paso >= 36", carga concentrada probada por encima de 1000 lbs).',
      priceRange: '$5,800 - $14,000+',
      ctaProduct: 'horizon',
      // Specs details
      specs: [
        { labelEn: 'Deflection Limit', labelEs: 'Límite de Deflexión', val: 'L/360 Compliant' },
        { labelEn: 'ASTM Grade', labelEs: 'Grado ASTM', val: 'A36 Carbon Steel' },
        { labelEn: 'Max Anchor Pullout', labelEs: 'Tensión Máxima de Anclaje', val: '12,500 lbs/viga' },
        { labelEn: 'Wood Moisture Limit', labelEs: 'Límite de Humedad de Madera', val: '6% - 8% Oven-Dried' }
      ]
    },
    railings: {
      titleEn: 'Cable & Glass Railing Systems',
      titleEs: 'Sistemas de Barandales de Cable y Cristal',
      subtitleEn: 'Pre-engineered tensioned marine-grade cable and tempered glass railings designed for high wind load deck resistance and balcony safety.',
      subtitleEs: 'Sistemas de barandales pre-calculados con cable tensado grado marino y paneles de cristal, diseñados para resistir cargas de viento y balcones seguros.',
      materialsEn: 'AISI 316 Marine Grade Stainless Steel wire ropes (1/8" or 3/16"), solid carbon steel posts, custom powder-coat finishes, tempered safety glass.',
      materialsEs: 'Cable de acero inoxidable AISI 316 grado marino (1/8" o 3/16"), postes de acero sólido, pintura al horno y cristal de seguridad templado.',
      codeEn: 'Complies with IBC & IRC post spacing codes (maximum 4.0 ft post separation, maximum 3.0" under-rail spacing, handrail lateral load resistance >200 lbs).',
      codeEs: 'Cumple con reglamentaciones IBC e IRC (máximo 4.0 pies entre postes, aberturas bajo pasamanos menores a 3", pasamanos con resistencia lateral >200 lbs).',
      priceRange: '$895 - $3,200+',
      ctaProduct: 'brooklyn',
      specs: [
        { labelEn: 'Tension Load Rating', labelEs: 'Carga de Tensión de Cable', val: '350 lbs per line' },
        { labelEn: 'Stainless Grade', labelEs: 'Grado de Inoxidable', val: 'AISI 316 Marine' },
        { labelEn: 'Glass Spec', labelEs: 'Especificación de Vidrio', val: '1/2" Fully Tempered' },
        { labelEn: 'Wind Load Rating', labelEs: 'Resistencia a Ráfagas de Viento', val: '110 mph Wind Pressure' }
      ]
    },
    handrails: {
      titleEn: 'ADA Accessible Grab Railings',
      titleEs: 'Pasamanos Accesibles Conformes ADA',
      subtitleEn: 'Heavy duty modular wall-mounted and floor-mounted assistance rails conforming to commercial access guidelines and handgrip clearance rules.',
      subtitleEs: 'Pasamanos modulares anclados a muros y pisos, conformes con directivas de accesibilidad comerciales y diámetros de agarre certificados.',
      materialsEn: 'AISI 304 & 316 Brushed Stainless Steel tubing (1.5" OD), wrought iron hand-welded brackets, powder-coated modular joints.',
      materialsEs: 'Tuberías de acero inoxidable cepillado AISI 304 y 316 (1.5" diámetro exterior), soportes de hierro forjado y juntas modulares.',
      codeEn: 'Complies with ADA Chapter 5 (installation height 34"-38", minimum wall clearance of 1.5", grip diameter between 1.25" and 2.0", returns to wall).',
      codeEs: 'Cumple con el Capítulo 5 de ADA (altura de montaje 34"-38", holgura con muro mínima de 1.5", diámetro de agarre entre 1.25"-2.0" y terminales curvos).',
      priceRange: '$450 - $1,800+',
      ctaProduct: 'patriot',
      specs: [
        { labelEn: 'Outside Diameter', labelEs: 'Diámetro Exterior', val: '1.50" (38mm) OD' },
        { labelEn: 'Wall Clearance', labelEs: 'Distancia al Muro', val: '1.625" (41mm)' },
        { labelEn: 'Bracket Load Rating', labelEs: 'Soporte de Carga de Soporte', val: '250 lbs point load' },
        { labelEn: 'Finish Grit', labelEs: 'Grano de Pulido', val: '240-Grit Hairline Brushed' }
      ]
    },
    gates: {
      titleEn: 'Driveway Gates & Privacy Enclosures',
      titleEs: 'Portones Deslizantes y Cercas de Privacidad',
      subtitleEn: 'Automatic driveway swing and slide gates engineered for residential estates, integrated security tracks, and privacy perimeter boundaries.',
      subtitleEs: 'Portones deslizantes y batientes automatizados para residencias y cercados modulares de privacidad de lamas de aluminio anodizado.',
      materialsEn: '6061-T6 Structural Aluminum frame, industrial roller bearings, ground tracks, magnetic lock integrations, architectural slat privacy panels.',
      materialsEs: 'Estructura de aluminio estructural 6061-T6, rodamientos sellados industriales, rieles de piso, lamas de privacidad de aluminio.',
      codeEn: 'Fully structural designs engineered against wind-shear pressures up to 110 mph, integrated physical safety loop sensors support.',
      codeEs: 'Diseños estructurales resistentes a ráfagas de viento de hasta 110 mph, preparados para lazos sensores y células de seguridad.',
      priceRange: '$1,850 - $6,500+',
      ctaProduct: 'sentinel',
      specs: [
        { labelEn: 'Alloy Grade', labelEs: 'Aleación de Aluminio', val: '6061-T6 Aircraft-Grade' },
        { labelEn: 'Wind Shear Limit', labelEs: 'Límite de Viento de Corte', val: '110 mph resistance' },
        { labelEn: 'Track Tolerance', labelEs: 'Tolerancia de Riel', val: '±0.5mm alignment' },
        { labelEn: 'Hinge Load Limit', labelEs: 'Carga de Bisagra de Entrada', val: '1,200 lbs gate weight' }
      ]
    },
    custom: {
      titleEn: 'Custom Heavy Metal Fabrication Hub',
      titleEs: 'Fabricación Especializada y Corte Láser',
      subtitleEn: 'Tailor-made architectural steel assemblies constructed directly from client blueprints, CAD datasets, TIG/MIG welding, and CNC cuts.',
      subtitleEs: 'Fabricación de piezas de acero arquitectónico hechas a medida de tus planos constructivos o archivos vectoriales de AutoCAD/DXF.',
      materialsEn: 'All metals: carbon steel plates, marine stainless profiles, brass, bronze, heavy beam structures, and structural tubings.',
      materialsEs: 'Todo tipo de metales: placas de acero pesado, inoxidable marino, bronce, latón, perfiles estructurales de viga e industriales.',
      codeEn: 'All welders are certified to AWS D1.1 (Structural Steel) and AWS D1.2 (Structural Aluminum) code standards. Tolerances to ±0.1mm.',
      codeEs: 'Soldadores homologados bajo normativas de seguridad estructural AWS D1.1 y D1.2. Tolerancias mecánicas a ±0.1mm.',
      priceRange: 'Custom Quote / Presupuesto a Medida',
      ctaProduct: 'custom',
      specs: [
        { labelEn: 'CNC Precision Limit', labelEs: 'Límite de Precisión CNC', val: '±0.05mm positioning' },
        { labelEn: 'Welding Standards', labelEs: 'Normas de Soldadura', val: 'AWS D1.1 Certified' },
        { labelEn: 'Laser Power Source', labelEs: 'Potencia de Fuente de Láser', val: '6kW Fiber Optic' },
        { labelEn: 'Quality Testing', labelEs: 'Pruebas de Calidad', val: 'Ultrasonic Joint NDT' }
      ]
    }
  }), []);

  const data = servicesData[serviceId] || servicesData.custom;

  // Spacing math for layout previews
  const computedPostCount = Math.ceil(railingLength / 4) + 1;
  const computedSteps = Math.round(stairsHeight / 7.25);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCustomFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCustomFile(e.target.files[0]);
    }
  };

  // SVGs drawing configurations
  const drawServiceSVG = () => {
    return (
      <svg viewBox="0 0 450 300" className="blueprint-canvas-svg">
        <defs>
          <pattern id="detail-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 90, 9, 0.05)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="metal-hand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECEFF1" />
            <stop offset="50%" stopColor="#90A4AE" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>
          <linearGradient id="wood-tread-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D7CCC8" />
            <stop offset="100%" stopColor="#8D6E63" />
          </linearGradient>
          <linearGradient id="stringer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#455A64" />
            <stop offset="100%" stopColor="#263238" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)" />
          </marker>
        </defs>
        <rect width="450" height="300" fill="url(#detail-grid)" />

        {/* CAD Ruler ticks on borders */}
        <g stroke="rgba(255, 90, 9, 0.15)" strokeWidth="0.75" opacity="0.6">
          <line x1="10" y1="10" x2="440" y2="10" />
          <line x1="10" y1="290" x2="440" y2="290" />
          <line x1="10" y1="10" x2="10" y2="290" />
          <line x1="440" y1="10" x2="440" y2="290" />
          {/* Ticks */}
          {[...Array(22)].map((_, i) => (
            <React.Fragment key={i}>
              <line x1={10 + i * 20} y1="10" x2={10 + i * 20} y2="15" />
              <line x1={10 + i * 20} y1="285" x2={10 + i * 20} y2="290" />
            </React.Fragment>
          ))}
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <line x1="10" y1={10 + i * 20} x2="15" y2={10 + i * 20} />
              <line x1="435" y1={10 + i * 20} x2="440" y2={10 + i * 20} />
            </React.Fragment>
          ))}
        </g>

        {/* Compass/Legend block */}
        <g opacity="0.5" transform="translate(390, 40)">
          <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <polygon points="0,-15 -4,-3 4,-3" fill="var(--color-accent)" />
          <text x="0" y="-20" fill="var(--color-text-muted)" fontSize="6" fontFamily="monospace" textAnchor="middle">N</text>
        </g>

        {serviceId === 'stairs' ? (
          <g>
            {/* Wall plate anchors */}
            <rect x="25" y="45" width="12" height="215" fill="#37474F" stroke="#263238" rx="2" />
            {[...Array(5)].map((_, i) => (
              <circle key={i} cx="31" cy={65 + i * 45} r="2.5" fill="#111" stroke="#ECEFF1" strokeWidth="0.5" />
            ))}

            {/* Mono-stringer steel beam */}
            <polygon points="37,250 37,260 280,100 262,90" fill="url(#stringer-grad)" stroke="#111" strokeWidth="0.5" />
            
            {/* Stair treads */}
            {[...Array(computedSteps)].map((_, i) => {
              const x = 45 + i * 22;
              const y = 260 - (i + 1) * 14.5;
              return (
                <g key={i}>
                  {/* Metal tread support bracket */}
                  <polygon points={`${x+4},${y+4} ${x+26},${y+4} ${x+20},${y+10} ${x+8},${y+10}`} fill="#455A64" stroke="#263238" strokeWidth="0.5" />
                  {/* Hardwood Tread block */}
                  <rect x={x} y={y} width="32" height="5" fill="url(#wood-tread-grad)" stroke="#3E2723" strokeWidth="0.75" rx="0.5" />
                  {/* grain overlay */}
                  <line x1={x+2} y1={y+2} x2={x+30} y2={y+2} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                </g>
              );
            })}

            {/* Dynamic dimensional arrows & labels */}
            <g stroke="var(--color-accent)" strokeWidth="0.75" fill="none" opacity="0.9">
              {/* Floor level reference */}
              <line x1="30" y1="260" x2="350" y2="260" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 1" />
              
              {/* Step rise run dimension */}
              <path d="M 67,240.5 L 67,245.5 L 45,245.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="56" y="238" fill="var(--color-accent)" fontSize="6" fontFamily="monospace" textAnchor="middle">10.0" RUN</text>
              <text x="75" y="252" fill="var(--color-accent)" fontSize="6" fontFamily="monospace" textAnchor="start">7.25" RISE</text>

              {/* Total Height indicator */}
              <line x1="380" y1="260" x2="380" y2={260 - (computedSteps * 14.5)} markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <line x1="375" y1="260" x2="385" y2="260" stroke="var(--color-accent)" />
              <line x1="375" y1={260 - (computedSteps * 14.5)} x2="385" y2={260 - (computedSteps * 14.5)} stroke="var(--color-accent)" />
              <text x="392" y={260 - (computedSteps * 7.25)} fill="var(--color-accent)" fontSize="7" fontFamily="monospace" textAnchor="middle" transform={`rotate(90, 392, ${260 - (computedSteps * 7.25)})`}>H: {stairsHeight}" ({computedSteps} steps)</text>
            </g>
          </g>
        ) : serviceId === 'railings' ? (
          <g>
            <line x1="30" y1="240" x2="420" y2="240" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            
            {/* Top rail cap */}
            <rect x="44" y="80" width="362" height="6" fill="url(#wood-tread-grad)" stroke="#3E2723" strokeWidth="0.5" rx="1.5" />
            
            {/* Cable wires (multiple running horizontally) */}
            {[...Array(9)].map((_, wIdx) => {
              const yPos = 90 + wIdx * 14;
              return (
                <line key={wIdx} x1="50" y1={yPos} x2="400" y2={yPos} stroke="#CFD8DC" strokeWidth="0.5" opacity="0.65" />
              );
            })}

            {/* Posts */}
            {[...Array(computedPostCount)].map((_, i) => {
              const x = 50 + i * (350 / (computedPostCount - 1));
              return (
                <g key={i}>
                  {/* Metal Post core */}
                  <rect x={x-2.5} y="86" width="5" height="154" fill="#37474F" stroke="#263238" strokeWidth="0.5" />
                  {/* Floor flange mount */}
                  <rect x={x-6} y="235" width="12" height="5" fill="#78909C" rx="1" />
                  <circle cx={x-4} cy="237.5" r="0.75" fill="#111" />
                  <circle cx={x+4} cy="237.5" r="0.75" fill="#111" />
                  {/* Top connector */}
                  <rect x={x-3.5} y="82" width="7" height="4" fill="#B0BEC5" />
                </g>
              );
            })}

            {/* Spanning dimension helpers */}
            <g stroke="var(--color-accent)" strokeWidth="0.75" fill="none" opacity="0.9">
              <line x1="50" y1="65" x2="400" y2="65" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <line x1="50" y1="60" x2="50" y2="70" stroke="var(--color-accent)" />
              <line x1="400" y1="60" x2="400" y2="70" stroke="var(--color-accent)" />
              <text x="225" y="55" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" textAnchor="middle">LENGTH: {railingLength} FT ({computedPostCount} POSTS)</text>

              {/* Spacing width arrow */}
              {computedPostCount > 2 && (
                <g>
                  <line x1="50" y1="120" x2={50 + (350 / (computedPostCount - 1))} y2="120" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                  <text x={50 + (175 / (computedPostCount - 1))} y="112" fill="var(--color-accent)" fontSize="6" fontFamily="monospace" textAnchor="middle">S &lt; 4.0 FT</text>
                </g>
              )}
            </g>
          </g>
        ) : serviceId === 'handrails' ? (
          <g transform="translate(10, 0)">
            {/* Wall outline section */}
            <line x1="140" y1="40" x2="140" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Wall base bracket plate */}
            <rect x="135" y="130" width="10" height="50" fill="#37474F" stroke="#263238" rx="2" />
            <circle cx="140" cy="140" r="1.5" fill="#111" />
            <circle cx="140" cy="170" r="1.5" fill="#111" />

            {/* Bracket arm structure */}
            <path d="M 145,155 L 205,155 C 205,155 220,155 220,135 L 220,105" fill="none" stroke="url(#metal-hand-grad)" strokeWidth="7" strokeLinecap="round" />
            {/* Saddle connector */}
            <rect x="208" y="96" width="24" height="4" fill="#78909C" rx="1" />

            {/* Tubular Handrail circle section */}
            <circle cx="220" cy="80" r="18" fill="url(#metal-hand-grad)" stroke="#111" strokeWidth="1" />
            <circle cx="220" cy="80" r="15" fill="#0B0E14" stroke="#ECEFF1" strokeWidth="0.5" strokeDasharray="2 2" />

            {/* ADA clearance dimensions */}
            <g stroke="var(--color-accent)" strokeWidth="0.75" fill="none" opacity="0.9" fontSize="7" fontFamily="monospace">
              {/* Clearance bracket to wall */}
              <line x1="140" y1="110" x2="202" y2="110" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <line x1="140" y1="105" x2="140" y2="115" stroke="var(--color-accent)" />
              <line x1="202" y1="105" x2="202" y2="115" stroke="var(--color-accent)" />
              <text x="171" y="122" fill="var(--color-accent)" textAnchor="middle">1.5" MIN</text>

              {/* Handgrip outer diameter */}
              <line x1="202" y1="80" x2="238" y2="80" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="220" y="60" fill="var(--color-accent)" textAnchor="middle">1.5" OD GRIP</text>

              {/* Handrail clearance indicator info */}
              <text x="260" y="150" fill="var(--color-accent)" fontSize="8">ADA COMPLIANT SPEC</text>
              <text x="260" y="165" fill="var(--color-text-secondary)" fontSize="7">Chapter 5 Handrail Details</text>
            </g>
          </g>
        ) : serviceId === 'gates' ? (
          <g>
            {/* Pillars */}
            <rect x="35" y="50" width="30" height="190" fill="#37474F" stroke="#263238" rx="2" />
            <rect x="385" y="50" width="30" height="190" fill="#37474F" stroke="#263238" rx="2" />
            
            {/* Main structural track */}
            <line x1="45" y1="230" x2="405" y2="230" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

            {/* Sliding Gate Panel */}
            <g transform="translate(10, 0)">
              {/* Gate structural framework frame */}
              <rect x="75" y="65" width="280" height="160" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
              {/* Diagonal frame support */}
              <line x1="75" y1="65" x2="355" y2="225" stroke="var(--color-accent)" strokeWidth="1.5" />
              
              {/* Slat boundaries inside frame */}
              {[...Array(14)].map((_, i) => {
                const xPos = 85 + i * 19;
                return (
                  <line key={i} x1={xPos} y1="68" x2={xPos} y2="222" stroke="rgba(var(--color-accent-rgb), 0.4)" strokeWidth="0.75" />
                );
              })}

              {/* Roller guide wheels */}
              <circle cx="115" cy="230" r="6" fill="#111" stroke="#ECEFF1" strokeWidth="1" />
              <circle cx="315" cy="230" r="6" fill="#111" stroke="#ECEFF1" strokeWidth="1" />
            </g>

            {/* Gate dimensions text */}
            <g stroke="var(--color-accent)" strokeWidth="0.75" fill="none" opacity="0.9">
              <line x1="75" y1="40" x2="375" y2="40" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="225" y="32" fill="var(--color-accent)" fontSize="8" fontFamily="monospace" textAnchor="middle">GATE CLEAR OPENING: 10.0 FT</text>
            </g>
          </g>
        ) : (
          <g>
            {/* Orthographic layout blueprint */}
            
            {/* Top view details */}
            <g transform="translate(30, 40)">
              <rect x="0" y="0" width="140" height="80" fill="none" stroke="#90A4AE" strokeWidth="1" />
              <circle cx="70" cy="40" r="25" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="0" x2="140" y2="80" stroke="#455A64" strokeWidth="0.5" />
              <line x1="140" y1="0" x2="0" y2="80" stroke="#455A64" strokeWidth="0.5" />
              <text x="70" y="-8" fill="#ECEFF1" fontSize="8" fontFamily="monospace" textAnchor="middle">TOP VIEW</text>
            </g>

            {/* Side view detail */}
            <g transform="translate(240, 40)">
              <rect x="0" y="0" width="160" height="80" fill="none" stroke="#90A4AE" strokeWidth="1" />
              <polygon points="10,70 80,10 150,70" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
              <line x1="80" y1="10" x2="80" y2="70" stroke="var(--color-accent)" strokeWidth="0.75" strokeDasharray="1 1" />
              <text x="80" y="-8" fill="#ECEFF1" fontSize="8" fontFamily="monospace" textAnchor="middle">FRONT VIEW</text>
            </g>

            {/* Welds symbols and notes */}
            <g transform="translate(30, 160)" fontSize="7" fontFamily="monospace" fill="var(--color-accent)">
              {/* Welding symbol drawing */}
              <line x1="30" y1="60" x2="100" y2="60" stroke="var(--color-accent)" strokeWidth="1" />
              <line x1="30" y1="60" x2="15" y2="75" stroke="var(--color-accent)" strokeWidth="1" markerEnd="url(#arrow)" />
              <polygon points="100,60 110,50 110,70" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
              <text x="65" y="52" textAnchor="middle">TYP. FILLET</text>
              
              {/* General blueprint notes */}
              <text x="140" y="25" fill="#ECEFF1" fontSize="8">FABRICATION DETAILS & SYMBOLS</text>
              <text x="140" y="45" fill="#CBD5E1">- Joint Welding Code: AWS D1.1</text>
              <text x="140" y="60" fill="#CBD5E1">- CNC Laser Cut Allowance: ±0.1mm</text>
              <text x="140" y="75" fill="#CBD5E1">- Surface Finish: Polyester Powder Coat</text>
            </g>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="single-service-page">
      
      {/* 1. ARCHITECTURAL HERO BANNER */}
      <section className="service-hero-section">
        <div className="blueprint-grid-hero"></div>
        <div className="radial-accent-overlay"></div>

        <div className="container hero-content-layout">
          <div className="hero-text-block">
            
            {/* Breadcrumb Trail */}
            <div className="breadcrumb-box">
              <a href="#/services" className="breadcrumb-back-btn">
                <ArrowLeft size={12} />
                <span>{language === 'en' ? 'Back' : 'Atrás'}</span>
              </a>
              <div className="breadcrumb-separator">|</div>
              <div className="breadcrumb-path">
                <span>{language === 'en' ? 'Services' : 'Servicios'}</span>
                <ChevronRight size={10} />
                <span className="active-path">{language === 'en' ? data.titleEn : data.titleEs}</span>
              </div>
            </div>

            <span className="tech-badge">
              <Cpu size={12} className="pulse-glow" />
              <span>{language === 'en' ? '0.01MM CAD PRECISION' : 'PRECISIÓN CAD DE 0.01MM'}</span>
            </span>

            <h1 className="text-gradient-stairs">{language === 'en' ? data.titleEn : data.titleEs}</h1>
            <p className="hero-description">{language === 'en' ? data.subtitleEn : data.subtitleEs}</p>

            <div className="hero-info-grid">
              <div className="hero-info-card">
                <span className="info-label">{language === 'en' ? 'TOLERANCES' : 'TOLERANCIAS'}</span>
                <span className="info-val">±0.1mm CNC</span>
              </div>
              <div className="hero-info-card">
                <span className="info-label">{language === 'en' ? 'WELDING STANDARD' : 'SOLDADURA'}</span>
                <span className="info-val">AWS D1.1/D1.2</span>
              </div>
              <div className="hero-info-card">
                <span className="info-label">{language === 'en' ? 'FABRICATION' : 'FABRICACIÓN'}</span>
                <span className="info-val">Houston, TX</span>
              </div>
            </div>
          </div>

          {/* Premium Image Frame */}
          <div className="hero-image-frame-container">
            <div className="hero-lens-glare"></div>
            <div className="image-frame-border">
              <img 
                src={serviceImages[serviceId]} 
                alt={language === 'en' ? data.titleEn : data.titleEs} 
                className="hero-service-rendered-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC CALCULATOR & CAD VIEWER */}
      <section className="estimator-blueprint-section container">
        <div className="section-title-box">
          <span className="tag-label">{language === 'en' ? 'INTEGRATED CONFIGURATOR' : 'CONFIGURADOR INTEGRADO'}</span>
          <h2>{language === 'en' ? 'Layout Calculation & CAD Draft' : 'Calculador de Medidas y Dibujo CAD'}</h2>
          <p>{language === 'en' ? 'Tweak parameters in real-time to preview engineering layouts and compliance checkpoints.' : 'Modifica dimensiones para previsualizar planos y códigos constructivos.'}</p>
        </div>

        <div className="calculator-layout-grid">
          
          {/* Controls Panel */}
          <div className="estimator-controls-panel glass-panel">
            <div className="config-group">
              <h3>{language === 'en' ? 'MATERIAL COMPOSITION' : 'COMPOSICIÓN DE MATERIALES'}</h3>
              <p className="materials-summary">{language === 'en' ? data.materialsEn : data.materialsEs}</p>
            </div>

            <div className="config-group">
              <h3>{language === 'en' ? 'CODE COMPLIANCE LOGS' : 'REGISTRO DE NORMATIVA'}</h3>
              <div className="compliance-tag-badge">
                <ShieldCheck size={16} className="text-accent" />
                <span>{language === 'en' ? data.codeEn : data.codeEs}</span>
              </div>
            </div>

            {/* Custom interactive inputs per service category */}
            {serviceId === 'stairs' && (
              <div className="config-group">
                <h3>{language === 'en' ? 'Floor-to-Floor Height (in)' : 'Altura Suelo a Suelo (pulgadas)'}</h3>
                <div className="custom-slider-box">
                  <div className="slider-header-vals">
                    <span>{stairsHeight}" ({ (stairsHeight/12).toFixed(1) } FT)</span>
                    <span className="steps-count-val">{computedSteps} {language === 'en' ? 'Steps' : 'Peldaños'}</span>
                  </div>
                  <input 
                    type="range" min="90" max="144" value={stairsHeight} 
                    onChange={(e) => setStairsHeight(parseInt(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>
              </div>
            )}

            {serviceId === 'railings' && (
              <div className="config-group">
                <h3>{language === 'en' ? 'Total Line Spacing (ft)' : 'Longitud Total de Tramo (pies)'}</h3>
                <div className="custom-slider-box">
                  <div className="slider-header-vals">
                    <span>{railingLength} linear FT</span>
                    <span className="steps-count-val">{computedPostCount} {language === 'en' ? 'Posts' : 'Postes'}</span>
                  </div>
                  <input 
                    type="range" min="8" max="60" value={railingLength} 
                    onChange={(e) => setRailingLength(parseInt(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>
              </div>
            )}

            {/* Custom order form uploader interface (Only for custom fab ordering) */}
            {serviceId === 'custom' && (
              <div className="config-group">
                <h3>{language === 'en' ? 'CAD Blueprint Uploader (DXF/DWG/Images)' : 'Subidor de Planos y Bocetos'}</h3>
                <div 
                  className="file-drop-zone glass-panel"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  style={{ border: '1px dashed var(--color-border)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.015)' }}
                  onClick={() => document.getElementById('scratch-file-input').click()}
                >
                  <Upload size={24} className="text-accent" style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {customFile ? `${customFile.name} (${(customFile.size/1024).toFixed(1)} KB)` : (language === 'en' ? 'Drop DXF/DWG here, or click to upload' : 'Arrastra archivos DXF/DWG aquí o haz clic')}
                  </p>
                  <input 
                    type="file" 
                    id="scratch-file-input" 
                    onChange={handleFileSelect} 
                    style={{ display: 'none' }} 
                  />
                </div>
              </div>
            )}

            <div className="estimator-pricing-block">
              <span className="price-label">{language === 'en' ? 'ESTIMATED PRICE RANGE' : 'RANGO DE PRECIO ESTIMADO'}</span>
              <span className="price-value">{data.priceRange}</span>
            </div>

            <a 
              href={data.ctaProduct === 'custom' ? '#quote' : `#/product/${data.ctaProduct}`}
              className="btn btn-primary config-cta-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', fontSize: '0.8rem', width: '100%', textTransform: 'uppercase' }}
            >
              <Hammer size={15} />
              <span>{serviceId === 'custom' ? (language === 'en' ? 'Start Consultation' : 'Iniciar Consulta') : (language === 'en' ? 'Configure Components' : 'Configurar Componentes')}</span>
            </a>
          </div>

          {/* Blueprint Drafting Board */}
          <div className="estimator-blueprint-board glass-panel">
            <div className="blueprint-board-header">
              <span>{language === 'en' ? 'DRAFT SCHEMATIC VIEWPORT' : 'VISTA DE PLANO DIBUJO CAD'}</span>
              <span className="terminal-dot"></span>
            </div>
            <div className="blueprint-canvas-viewport">
              {drawServiceSVG()}
            </div>
          </div>

        </div>
      </section>

      {/* 3. ARCHITECTURAL GALLERY & REAL INSTALLATIONS */}
      <section className="service-gallery-section container">
        <div className="section-title-box">
          <span className="tag-label">{language === 'en' ? 'BUILT WORK GALLERY' : 'GALERÍA DE OBRAS REALIZADAS'}</span>
          <h2>{language === 'en' ? 'Featured Installations & Case Studies' : 'Instalaciones Destacadas y Casos de Éxito'}</h2>
          <p>
            {language === 'en'
              ? 'Explore completed custom metal assemblies engineered, fabricated, and installed across luxury residential and commercial spaces.'
              : 'Explora proyectos reales de estructuras metálicas diseñadas, fabricadas e instaladas en residencias de lujo y obras comerciales.'}
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="gallery-filters-row">
          {[
            { id: 'all', labelEn: 'All Projects', labelEs: 'Todos los Proyectos' },
            { id: 'residential', labelEn: 'Luxury Residential', labelEs: 'Residencial de Lujo' },
            { id: 'commercial', labelEn: 'Commercial & Public', labelEs: 'Comercial y Público' },
            { id: 'details', labelEn: 'Technical Details', labelEs: 'Detalles de Fabricación' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`gallery-filter-pill ${galleryFilter === tab.id ? 'active' : ''}`}
              onClick={() => setGalleryFilter(tab.id)}
            >
              <span>{language === 'en' ? tab.labelEn : tab.labelEs}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="service-gallery-grid">
          {(galleryData[serviceId] || galleryData['custom'])
            .filter((item) => galleryFilter === 'all' || item.type === galleryFilter)
            .map((item) => (
              <div 
                key={item.id} 
                className="gallery-project-card glass-panel"
                onClick={() => setActiveLightbox(item)}
              >
                <div className="gallery-img-container">
                  <img src={item.image} alt={item.titleEn} className="gallery-card-img" />
                  <div className="gallery-card-badge">{item.badge}</div>
                  <div className="gallery-hover-overlay">
                    <span className="overlay-inspect-btn">
                      <Maximize2 size={16} />
                      <span>{language === 'en' ? 'Inspect Specs' : 'Ver Detalles'}</span>
                    </span>
                  </div>
                </div>

                <div className="gallery-card-body">
                  <div className="gallery-meta-row">
                    <span className="gallery-location">
                      <MapPin size={12} className="text-accent" />
                      <span>{item.location}</span>
                    </span>
                    <span className="gallery-type-tag">{item.type.toUpperCase()}</span>
                  </div>

                  <h3 className="gallery-card-title">{language === 'en' ? item.titleEn : item.titleEs}</h3>
                  <p className="gallery-card-desc">{language === 'en' ? item.descEn : item.descEs}</p>

                  <div className="gallery-card-specs">
                    <div className="gallery-spec-pill">
                      <strong>{language === 'en' ? 'Materials:' : 'Materiales:'}</strong> {item.materials}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeLightbox && (
            <div className="gallery-lightbox-overlay" onClick={() => setActiveLightbox(null)}>
              <motion.div 
                className="gallery-lightbox-modal glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="lightbox-close-btn" 
                  onClick={() => setActiveLightbox(null)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <div className="lightbox-content-grid">
                  <div className="lightbox-img-side">
                    <img src={activeLightbox.image} alt={activeLightbox.titleEn} className="lightbox-full-img" />
                    <span className="lightbox-badge-float">{activeLightbox.badge}</span>
                  </div>

                  <div className="lightbox-info-side">
                    <span className="lightbox-location-tag">
                      <MapPin size={13} className="text-accent" />
                      <span>{activeLightbox.location}</span>
                    </span>

                    <h2>{language === 'en' ? activeLightbox.titleEn : activeLightbox.titleEs}</h2>
                    <p className="lightbox-desc">{language === 'en' ? activeLightbox.descEn : activeLightbox.descEs}</p>

                    <div className="lightbox-specs-table">
                      <div className="lightbox-spec-row">
                        <span className="lbl">{language === 'en' ? 'STRUCTURAL ALLOY' : 'ALEACIÓN ESTRUCTURAL'}</span>
                        <span className="val">{activeLightbox.materials}</span>
                      </div>
                      <div className="lightbox-spec-row">
                        <span className="lbl">{language === 'en' ? 'SURFACE FINISH' : 'ACABADO SUPERFICIAL'}</span>
                        <span className="val">{activeLightbox.finish}</span>
                      </div>
                      <div className="lightbox-spec-row">
                        <span className="lbl">{language === 'en' ? 'FABRICATION TIME' : 'TIEMPO DE FABRICACIÓN'}</span>
                        <span className="val">2 - 3 Weeks Certified</span>
                      </div>
                      <div className="lightbox-spec-row">
                        <span className="lbl">{language === 'en' ? 'IBC/IRC CODE COMPLIANCE' : 'NORMATIVA CONSTRUCTIVA'}</span>
                        <span className="val text-green">100% Full Pass</span>
                      </div>
                    </div>

                    <div className="lightbox-actions-row">
                      <a 
                        href="#quote" 
                        onClick={() => setActiveLightbox(null)}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', width: '100%' }}
                      >
                        <Hammer size={16} />
                        <span>{language === 'en' ? 'Request Similar Custom Estimate' : 'Solicitar Presupuesto Similar'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. NEW SECTION A: ENGINEERING & MATERIALS SPECIFICATIONS MATRIX */}
      <section className="engineering-specs-section container">
        <div className="section-title-box">
          <span className="tag-label">{language === 'en' ? 'STRUCTURAL CAPABILITY' : 'CAPACIDAD ESTRUCTURAL'}</span>
          <h2>{language === 'en' ? 'Engineering Specifications Matrix' : 'Matriz de Especificaciones de Ingeniería'}</h2>
          <p>{language === 'en' ? 'Certified structural metrics and metallurgical compositions logged by our design office.' : 'Métricas certificadas y especificaciones metalúrgicas registradas en nuestra oficina de ingeniería.'}</p>
        </div>

        <div className="specs-matrix-grid">
          {data.specs && data.specs.map((spec, idx) => (
            <div key={idx} className="spec-metric-card glass-panel">
              <div className="spec-metric-icon">
                <Layers size={18} className="text-accent" />
              </div>
              <div className="spec-metric-details">
                <span className="metric-label">{language === 'en' ? spec.labelEn : spec.labelEs}</span>
                <span className="metric-val">{spec.val}</span>
              </div>
            </div>
          ))}

          <div className="spec-metric-card glass-panel">
            <div className="spec-metric-icon">
              <Award size={18} className="text-accent" />
            </div>
            <div className="spec-metric-details">
              <span className="metric-label">{language === 'en' ? 'Metal Certification' : 'Certificación de Metal'}</span>
              <span className="metric-val">ASTM Certified Grades</span>
            </div>
          </div>

          <div className="spec-metric-card glass-panel">
            <div className="spec-metric-icon">
              <Activity size={18} className="text-accent" />
            </div>
            <div className="spec-metric-details">
              <span className="metric-label">{language === 'en' ? 'Fatigue Life Standard' : 'Vida Útil a Fatiga'}</span>
              <span className="metric-val">100,000+ Cycles Tested</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BESPOKE FABRICATION & INSTALLATION PROCESS TIMELINE */}
      <section className="fabrication-timeline-section container">
        <div className="section-title-box">
          <span className="tag-label">{language === 'en' ? 'BESPOKE PRODUCTION PIPELINE' : 'PROCESO DE SERVICIO COTIZABLE'}</span>
          <h2>{language === 'en' ? 'From Field Measurements to Turnkey Installation' : 'Del Levantamiento en Obra a la Instalación Final'}</h2>
          <p>{language === 'en' ? 'Because our architectural works are custom quoted and not boxed mass products, our 4-phase execution guarantees zero tolerance errors.' : 'Como son servicios cotizables y no productos en serie, nuestro proceso integral en 4 fases asegura precisión estructural y ajuste perfecto en obra.'}</p>
        </div>

        <div className="logistics-timeline-flow glass-panel">
          
          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <Ruler size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 1: Field Survey & Measurements' : 'Fase 1: Levantamiento Técnico en Obra'}</h4>
            <p>{language === 'en' ? 'On-site technical survey, laser scanning, and structural anchor point verification.' : 'Visita a obra, escaneo láser y toma milimétrica de cotas y niveles estructurales.'}</p>
          </div>

          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <PenTool size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 2: Architectural CAD & 3D Render' : 'Fase 2: Diseño Arquitectónico & Render 3D'}</h4>
            <p>{language === 'en' ? '3D modeling, photorealistic renders, and structural calculations for client approval.' : 'Modelado 3D, renders fotorrealistas y cálculo de cargas para aprobación previa del cliente.'}</p>
          </div>

          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <Hammer size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 3: Workshop Fabrication' : 'Fase 3: Creación & Fabricación en Taller'}</h4>
            <p>{language === 'en' ? 'Precision fiber laser cutting and hand-welding under AWS D1.1 standards in Houston.' : 'Corte láser CNC, forja y soldadura certificada AWS D1.1 en nuestro taller propio de Houston.'}</p>
          </div>

          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <ShieldCheck size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 4: On-Site Precision Installation' : 'Fase 4: Instalación Profesional en Sitio'}</h4>
            <p>{language === 'en' ? 'Turnkey installation, structural mechanical anchoring, and final safety load testing.' : 'Montaje directo por nuestro equipo, anclajes estructurales y prueba final de seguridad.'}</p>
          </div>

        </div>
      </section>

      {/* 5. DOWNLOAD DOCUMENTATION RESOURCES */}
      <section className="technical-resources container" style={{ marginTop: '40px', marginBottom: '90px' }}>
        <div className="resources-grid">
          <div className="resource-card glass-panel">
            <div className="resource-icon-box">
              <FileText size={20} className="text-accent" />
            </div>
            <div className="resource-body">
              <h3>{language === 'en' ? 'Download Engineering PE Stamped Calculations' : 'Cálculos de Ingeniería Certificados PE'}</h3>
              <p>{language === 'en' ? 'PE structural engineering review validating linear weight load resistance guidelines.' : 'Informe de ingeniería estructural PE que certifica límites de flexión y cargas de tracción.'}</p>
              <a href="#" className="resource-download-link" onClick={(e) => { e.preventDefault(); alert('Downloading PE reports package...'); }}>
                <span>Download pe_calculations.pdf (8.2MB)</span>
              </a>
            </div>
          </div>

          <div className="resource-card glass-panel">
            <div className="resource-icon-box">
              <ShieldCheck size={20} className="text-accent" />
            </div>
            <div className="resource-body">
              <h3>{language === 'en' ? 'Material Traceability Certifications' : 'Certificados de Calidad de Metal'}</h3>
              <p>{language === 'en' ? 'Material logs validating compositions of our carbon steel plates and AISI stainless profiles.' : 'Certificaciones de trazabilidad que garantizan la pureza química y elasticidad del acero.'}</p>
              <a href="#" className="resource-download-link" onClick={(e) => { e.preventDefault(); alert('Downloading SGS certifications...'); }}>
                <span>Download material_cert.pdf (3.4MB)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION WITH EMBEDDED QUOTE FORM (SENDS SERVICE ORIGIN TO CMS) */}
      <ServiceCtaForm 
        serviceId={serviceId} 
        serviceTitle={language === 'en' ? data.titleEn : data.titleEs} 
      />

      <style>{`
        .single-service-page {
          padding-bottom: 80px;
        }

        /* 1. Hero area layout */
        .service-hero-section {
          position: relative;
          padding-top: 130px;
          padding-bottom: 70px;
          background: radial-gradient(circle at 80% 20%, rgba(224, 0, 39, 0.08) 0%, transparent 60%),
                      linear-gradient(180deg, #020032 0%, #060447 100%);
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .blueprint-grid-hero {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(rgba(224, 0, 39, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(224, 0, 39, 0.04) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.85;
          z-index: 1;
        }

        .radial-accent-overlay {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.12) 0%, transparent 70%);
          right: -100px;
          top: -100px;
          z-index: 2;
          pointer-events: none;
        }

        .hero-content-layout {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 50px;
          align-items: center;
        }

        .breadcrumb-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          font-family: monospace;
          font-size: 0.72rem;
        }

        .breadcrumb-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-accent);
          font-weight: 700;
          transition: var(--transition-fast);
        }

        .breadcrumb-back-btn:hover {
          color: #FFFFFF;
          transform: translateX(-2px);
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.25);
        }

        .breadcrumb-path {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.6);
        }

        .active-path {
          color: #FFFFFF;
          font-weight: 600;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.62rem;
          color: var(--color-accent);
          background: rgba(var(--color-accent-rgb), 0.15);
          border: 1px solid rgba(var(--color-accent-rgb), 0.35);
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .text-gradient-stairs {
          font-size: 2.8rem;
          font-weight: 900;
          line-height: 1.1;
          color: #FFF;
          margin-bottom: 16px;
        }

        .hero-description {
          font-size: 0.95rem;
          color: #CBD5E1;
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 30px;
        }

        .hero-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 24px;
        }

        .hero-info-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-family: monospace;
          font-size: 0.62rem;
          color: #94A3B8;
          letter-spacing: 0.05em;
        }

        .info-val {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          color: #FFFFFF;
        }

        /* 3D Glass Image Frame */
        .hero-image-frame-container {
          position: relative;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .hero-lens-glare {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%, rgba(255, 90, 9, 0.02) 100%);
          pointer-events: none;
          z-index: 3;
          border-radius: 12px;
        }

        .image-frame-border {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          aspect-ratio: 4 / 3;
        }

        .hero-service-rendered-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-image-frame-container:hover .hero-service-rendered-img {
          transform: scale(1.03);
        }

        /* 2. Estimator and Blueprint configuration layout */
        .section-title-box {
          margin-top: 50px;
          margin-bottom: 24px;
        }

        .tag-label {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-accent);
          font-weight: bold;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 6px;
        }

        .section-title-box h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .section-title-box p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .calculator-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 30px;
          align-items: stretch;
        }

        .estimator-controls-panel {
          padding: 24px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .config-group h3 {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .materials-summary {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .compliance-tag-badge {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(255, 90, 9, 0.03);
          border: 1px solid rgba(255, 90, 9, 0.1);
          padding: 12px;
          border-radius: 6px;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        .custom-slider-box {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          padding: 16px;
          border-radius: 8px;
        }

        .slider-header-vals {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .steps-count-val {
          font-family: monospace;
          color: var(--color-accent);
        }

        .custom-range-slider {
          width: 100%;
          accent-color: var(--color-accent);
          cursor: pointer;
        }

        .estimator-pricing-block {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          padding: 16px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-label {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
        }

        .price-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        /* Blueprint Board */
        .estimator-blueprint-board {
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .blueprint-board-header {
          padding: 14px 20px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          font-weight: 700;
        }

        .terminal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4CAF50;
        }

        .blueprint-canvas-viewport {
          padding: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }

        /* 3. Specs Matrix Grid */
        .specs-matrix-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .spec-metric-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 10px;
        }

        .spec-metric-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(255, 90, 9, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spec-metric-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label {
          font-family: monospace;
          font-size: 0.58rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .metric-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        /* 4. Logistics progress timeline */
        .logistics-timeline-flow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 30px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .timeline-step-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }

        .step-badge-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 90, 9, 0.08);
          border: 1px solid rgba(255, 90, 9, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          transition: var(--transition-fast);
        }

        .timeline-step-card:hover .step-badge-circle {
          background: var(--color-accent);
          color: #FFF;
          box-shadow: 0 0 10px rgba(255, 90, 9, 0.2);
        }

        .timeline-step-card h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .timeline-step-card p {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        /* Resources grids */
        .technical-resources {
          margin-top: 40px;
          margin-bottom: 90px;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* 3. GALLERY SECTION STYLES */
        .service-gallery-section {
          padding-top: 20px;
          padding-bottom: 40px;
        }

        .gallery-filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }

        .gallery-filter-pill {
          padding: 8px 18px;
          border-radius: 30px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gallery-filter-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .gallery-filter-pill.active {
          background: var(--color-text-primary);
          color: #FFF;
          border-color: var(--color-text-primary);
        }

        .service-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .gallery-project-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .gallery-project-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
          box-shadow: 0 12px 32px rgba(2, 0, 50, 0.08);
        }

        .gallery-img-container {
          position: relative;
          height: 240px;
          background: #020032;
          overflow: hidden;
        }

        .gallery-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .gallery-project-card:hover .gallery-card-img {
          transform: scale(1.05);
        }

        .gallery-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(2, 0, 50, 0.85);
          backdrop-filter: blur(6px);
          color: #FFF;
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 2;
        }

        .gallery-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(2, 0, 50, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 3;
        }

        .gallery-project-card:hover .gallery-hover-overlay {
          opacity: 1;
        }

        .overlay-inspect-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          color: var(--color-text-primary);
          padding: 10px 18px;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        }

        .gallery-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .gallery-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .gallery-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
        }

        .gallery-type-tag {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .gallery-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .gallery-card-desc {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        .gallery-card-specs {
          border-top: 1px dashed var(--color-border);
          padding-top: 10px;
          margin-top: 4px;
        }

        .gallery-spec-pill {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
        }

        /* Lightbox Modal */
        .gallery-lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.7);
          backdrop-filter: blur(8px);
          z-index: 3500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .gallery-lightbox-modal {
          width: 100%;
          max-width: 900px;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--color-border);
        }

        .lightbox-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(2, 0, 50, 0.08);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-text-primary);
          z-index: 10;
          transition: background 0.2s;
        }

        .lightbox-close-btn:hover {
          background: var(--color-accent);
          color: #FFF;
        }

        .lightbox-content-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
        }

        .lightbox-img-side {
          position: relative;
          background: #020032;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 420px;
        }

        .lightbox-full-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lightbox-badge-float {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(2, 0, 50, 0.9);
          color: #FFF;
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .lightbox-info-side {
          padding: 36px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lightbox-location-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }

        .lightbox-info-side h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.25;
          margin: 0;
        }

        .lightbox-desc {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .lightbox-specs-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px 0;
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }

        .lightbox-spec-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lightbox-spec-row .lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
        }

        .lightbox-spec-row .val {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .lightbox-spec-row .val.text-green {
          color: #10B981;
        }

        @media (max-width: 992px) {
          .hero-content-layout, .calculator-layout-grid, .specs-matrix-grid, .logistics-timeline-flow, .resources-grid, .service-gallery-grid {
            grid-template-columns: 1fr;
          }
          .lightbox-content-grid {
            grid-template-columns: 1fr;
          }
          .lightbox-img-side {
            min-height: 260px;
          }
          .hero-image-frame-container {
            max-width: 480px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
