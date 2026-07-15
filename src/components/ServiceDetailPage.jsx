import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Ruler, Hammer, PenTool, 
  Upload, Sparkles, AlertTriangle, FileText, ChevronRight, 
  Cpu, Award, Truck, Layers, Activity, HelpCircle
} from 'lucide-react';

import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import handrailsImg from '../assets/service_handrails.png';
import gatesImg from '../assets/service_gates.png';
import customImg from '../assets/service_custom.png';

export default function ServiceDetailPage({ serviceId }) {
  const { t, language } = useLanguage();
  
  // Custom states inside single pages
  const [railingLength, setRailingLength] = useState(25);
  const [stairsHeight, setStairsHeight] = useState(108);
  const [customFile, setCustomFile] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

  const serviceImages = {
    stairs: stairsImg,
    railings: railingsImg,
    handrails: handrailsImg,
    gates: gatesImg,
    custom: customImg,
    specialty: customImg
  };

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
                  <line key={i} x1={xPos} y1="68" x2={xPos} y2="222" stroke="rgba(255, 90, 9, 0.4)" strokeWidth="0.75" />
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
              <text x="140" y="45" fill="var(--color-text-secondary)">- Joint Welding Code: AWS D1.1</text>
              <text x="140" y="60" fill="var(--color-text-secondary)">- CNC Laser Cut Allowance: ±0.1mm</text>
              <text x="140" y="75" fill="var(--color-text-secondary)">- Surface Finish: Polyester Powder Coat</text>
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
                <span className="info-val">Los Angeles, CA</span>
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

      {/* 3. NEW SECTION A: ENGINEERING & MATERIALS SPECIFICATIONS MATRIX */}
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

      {/* 4. NEW SECTION B: FABRICATION LOGISTICS PROGRESS TIMELINE */}
      <section className="fabrication-timeline-section container">
        <div className="section-title-box">
          <span className="tag-label">{language === 'en' ? 'PRODUCTION PIPELINE' : 'LÍNEA DE PRODUCCIÓN'}</span>
          <h2>{language === 'en' ? 'Staging & Fabrication Timeline' : 'Fases de Logística, Producción y Montaje'}</h2>
          <p>{language === 'en' ? 'How we execute, inspect, and transport custom metal assemblies from layout to field installation.' : 'Cómo ejecutamos, inspeccionamos y transportamos estructuras metálicas desde el taller hasta la obra.'}</p>
        </div>

        <div className="logistics-timeline-flow glass-panel">
          
          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <PenTool size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 1: CAD Approval' : 'Fase 1: Aprobación CAD'}</h4>
            <p>{language === 'en' ? 'AutoCAD detailing and design parameters check against safety guidelines.' : 'Dibujos de detalle en 2D y modelos 3D validados bajo normas locales.'}</p>
          </div>

          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <Cpu size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 2: CNC Laser Slicing' : 'Fase 2: Corte Láser CNC'}</h4>
            <p>{language === 'en' ? 'Heavy structural plates sliced cleanly using our 6kW fiber laser cutters.' : 'Corte limpio de chapas y perfiles pesados con tolerancia de ±0.1mm.'}</p>
          </div>

          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <Hammer size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 3: Structural Welding' : 'Fase 3: Soldadura Estructural'}</h4>
            <p>{language === 'en' ? 'Joints hand-welded under structural AWS TIG standards in Los Angeles.' : 'Unión de perfiles mediante soldadura MIG/TIG homologada AWS D1.1.'}</p>
          </div>

          <div className="timeline-step-card">
            <div className="step-badge-circle">
              <Truck size={16} />
            </div>
            <h4>{language === 'en' ? 'Phase 4: Sealed Delivery' : 'Fase 4: Despacho y Envío'}</h4>
            <p>{language === 'en' ? 'Components are crated and shipped with linear installation staging templates.' : 'Embalaje de seguridad en cajas de madera con guías de ensamblaje.'}</p>
          </div>

        </div>
      </section>

      {/* 5. DOWNLOAD DOCUMENTATION RESOURCES */}
      <section className="technical-resources container" style={{ marginTop: '20px' }}>
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

      <style>{`
        .single-service-page {
          padding-bottom: 80px;
        }

        /* 1. Hero area layout */
        .service-hero-section {
          position: relative;
          padding-top: 130px;
          padding-bottom: 60px;
          background: #0B0E14; /* Deep dark tone */
          overflow: hidden;
          border-bottom: 1px solid var(--color-border);
        }

        .blueprint-grid-hero {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(rgba(255, 90, 9, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 90, 9, 0.02) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.85;
          z-index: 1;
        }

        .radial-accent-overlay {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 90, 9, 0.06) 0%, transparent 70%);
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
          color: var(--color-text-primary);
          transform: translateX(-2px);
        }

        .breadcrumb-separator {
          color: var(--color-border);
        }

        .breadcrumb-path {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
        }

        .active-path {
          color: var(--color-text-secondary);
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.62rem;
          color: var(--color-accent);
          background: rgba(255, 90, 9, 0.08);
          border: 1px solid rgba(255, 90, 9, 0.15);
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
          color: var(--color-text-secondary);
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 30px;
        }

        .hero-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          border-top: 1px solid var(--color-border);
          padding-top: 24px;
        }

        .hero-info-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-family: monospace;
          font-size: 0.58rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }

        .info-val {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--color-text-primary);
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
        .resources-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 992px) {
          .hero-content-layout, .calculator-layout-grid, .specs-matrix-grid, .logistics-timeline-flow, .resources-grid {
            grid-template-columns: 1fr;
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
