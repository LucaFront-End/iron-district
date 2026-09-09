import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, Layers, ShieldCheck, Sparkles, MapPin, 
  ArrowRight, Maximize2, X, CheckCircle2, MessageCircle, 
  Ruler, Calendar, Compass, FileText, ChevronRight
} from 'lucide-react';

export default function PortfolioPage() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: 'all', labelEn: 'All Projects', labelEs: 'Todos los Proyectos' },
    { id: 'stairs', labelEn: 'Floating Stairs', labelEs: 'Escaleras y Monovigas' },
    { id: 'railings', labelEn: 'Cable & Glass Railings', labelEs: 'Barandales y Balustradas' },
    { id: 'doors', labelEn: 'Steel & Glass Doors', labelEs: 'Puertas de Vidrio y Acero' },
    { id: 'gates', labelEn: 'Automated Driveway Gates', labelEs: 'Portones Automatizados' },
    { id: 'cellars', labelEn: 'Wine Cellars & Screens', labelEs: 'Cavas y Celosías' }
  ];

  const projects = [
    {
      id: 'austin-mono-stair',
      titleEn: 'Austin Hillside Monostring Floating Staircase',
      titleEs: 'Escalera Flotante Monoviga Austin Hillside',
      category: 'stairs',
      location: 'Austin, TX',
      typologyEn: 'Luxury Custom Residential',
      typologyEs: 'Residencial de Lujo a Medida',
      year: '2026',
      image: '/gallery/gallery_stairs_austin.jpg',
      materialsEn: 'A36 Heavy Structural Steel Spine • Solid White Oak Treads • Concealed Embeds',
      materialsEs: 'Viga Central Acero Estructural A36 • Huellas Roble Blanco Macizo • Anclajes Ocultos',
      finishEn: 'Tiger Drylac Matte Black Electrostatic Powder Coat',
      finishEs: 'Termolacado Electrostático Tiger Drylac Negro Mate',
      tolerances: '± 0.5 mm laser calibrated',
      specsEn: 'Cantilevered 42" treads engineered for 300 lbs point load deflection. Embedded structural stringer concealed behind drywall backing.',
      specsEs: 'Huellas voladizas de 42" calculadas para deflexión de 300 lbs puntuales. Viga estructural embutida en muro de carga.',
      codeCompliance: 'IBC 2024 / IRC Section R311.7',
      highlights: [
        isEn ? 'Concealed wall backing steel plate' : 'Placa de acero embebida en muro',
        isEn ? 'Integrated LED step channel raceways' : 'Ductos empotrados para iluminación LED',
        isEn ? 'Vibration-damped acoustic tread cushions' : 'Aislantes acústicos antivibración en huellas'
      ]
    },
    {
      id: 'french-doors-beverly',
      titleEn: 'Thermally Broken Steel French Patio Doors',
      titleEs: 'Puertas Francesas en Acero con Rotura de Puente Térmico',
      category: 'doors',
      location: 'Beverly Hills, CA',
      typologyEn: 'Modern Villa Estate',
      typologyEs: 'Residencia Contemporánea',
      year: '2026',
      image: '/gallery/gallery_glass_doors_french.jpg',
      materialsEn: 'Thermally-Broken Cold-Rolled Steel • 1" Low-E Argon-Filled Double Glazing',
      materialsEs: 'Perfiles de Acero con Rotura Térmica • Vidrio Doble 1" Low-E con Gas Argón',
      finishEn: 'Architectural Bronze Patina & UV Protective Clear Shield',
      finishEs: 'Pátina Bronce Arquitectónico con Barniz Poliuretano UV',
      tolerances: 'Weather-tight dual compression EPDM gaskets',
      specsEn: 'Multi-point German locking hardware with flush threshold for seamless indoor-outdoor floor transition.',
      specsEs: 'Cerradura multipunto alemana con solera enrasada a suelo para transición continua interior-exterior.',
      codeCompliance: 'NFRC Energy Star / Title 24 California',
      highlights: [
        isEn ? 'U-Factor 0.28 thermal efficiency' : 'Eficiencia térmica U-Factor 0.28',
        isEn ? 'Hand-welded narrow sightline muntins' : 'Parteluces de perfilería ultra delgada',
        isEn ? 'Magnetic child-safe slam resistance' : 'Retenedores magnéticos antichoque'
      ]
    },
    {
      id: 'laguna-cable-railing',
      titleEn: 'Laguna Beach Coastal Cable Railing System',
      titleEs: 'Barandal Perimetral de Cable Náutico Laguna Beach',
      category: 'railings',
      location: 'Laguna Beach, CA',
      typologyEn: 'Oceanfront Terrace',
      typologyEs: 'Terraza Frente al Mar',
      year: '2026',
      image: '/gallery/gallery_railing_cable.jpg',
      materialsEn: 'Marine-Grade AISI 316 Stainless Steel Posts • 1/8" 1x19 Cable Assemblies',
      materialsEs: 'Postes Acero Inoxidable AISI 316 Marino • Cables 1/8" Construcción 1x19',
      finishEn: 'Ultra-Fine 320-Grit Directional Satin Polish',
      finishEs: 'Pulido Satinado Direccional Grano 320',
      tolerances: 'Zero salt spray corrosion test (1500 hr ASTM B117)',
      specsEn: 'Engineered for 50 lbs/ft continuous horizontal top rail loading with 200 lbs concentrated live load proof testing.',
      specsEs: 'Diseñado para carga continua de 50 lbs/pie en pasamanos y prueba de carga puntual de 200 lbs.',
      codeCompliance: 'IBC 2024 Chapter 10 / California Building Code',
      highlights: [
        isEn ? 'Hidden internal turnbuckle tensioners' : 'Tensores ocultos en el interior del poste',
        isEn ? 'Electropolished corrosion passivation' : 'Pasivado electrolítico anticorrosión marina',
        isEn ? 'Continuous tactile ADA compliant grab bar' : 'Pasamanos táctil con continuidad certificada ADA'
      ]
    },
    {
      id: 'pivot-monumental-gate',
      titleEn: 'Monumental Sculptural Pivot Entry Gate',
      titleEs: 'Portón Pivotante Monumental de Acceso Principal',
      category: 'gates',
      location: 'Malibu, CA',
      typologyEn: 'Private Hillside Sanctuary',
      typologyEs: 'Residencia Privada en Colina',
      year: '2026',
      image: '/gallery/gallery_gate_pivot.jpg',
      materialsEn: 'Corten Weathering Steel Panels • Internal Heavy RHS Structural Skeleton',
      materialsEs: 'Paneles Acero Corten Autooxidable • Esqueleto Interno Tubo Estructural RHS',
      finishEn: 'Stabilized Natural Rust Patina with Silane Sealer',
      finishEs: 'Óxido Natural Estabilizado con Sellador de Silano',
      tolerances: 'Heavy-duty hydraulic bottom pivot with 2,500 lbs capacity',
      specsEn: '10-foot tall monumental pivot weighing 850 lbs with smooth 1-finger effortless gliding actuation.',
      specsEs: 'Hoja pivotante de 10 pies de altura y 850 lbs que se acciona suavemente con un solo dedo.',
      codeCompliance: 'ASTM F2200 Gate Safety Standards',
      highlights: [
        isEn ? 'Adjustable closing speed hydraulic dampener' : 'Freno hidráulico con velocidad de cierre ajustable',
        isEn ? 'Integrated smart keypad & motor box housing' : 'Alojamiento oculto para motor y teclado inteligente',
        isEn ? 'Concealed magnetic reed position sensor' : 'Sensor magnético oculto para domótica'
      ]
    },
    {
      id: 'aspen-wine-cellar',
      titleEn: 'Climate-Controlled Glass & Steel Wine Sanctuary',
      titleEs: 'Cava Climatizada Hermética con Perfilería de Acero y Cristal',
      category: 'cellars',
      location: 'Aspen, CO',
      typologyEn: 'Private Collector Residence',
      typologyEs: 'Residencia de Coleccionista',
      year: '2026',
      image: '/gallery/gallery_wine_cellar_doors.jpg',
      materialsEn: 'Micro-Slim Solid Steel T-Profiles • Dual Pane Tempered Glass with Argon',
      materialsEs: 'Perfiles T Sólidos de Acero Micro-Slim • Vidrio Doble Templado con Argón',
      finishEn: 'Charcoal Black Powder Coat with Brushed Brass Hardware',
      finishEs: 'Termolacado Negro Carbón con Herrajes en Latón Cepillado',
      tolerances: 'Vapor-barrier sealed perimeter frame',
      specsEn: 'Continuous perimeter magnetic thermal seals maintaining constant 55°F / 70% humidity environment.',
      specsEs: 'Sellos perimetrales magnéticos continuos para mantener 55°F constantes y 70% de humedad relativa.',
      codeCompliance: 'Energy Efficiency ASTM C1363',
      highlights: [
        isEn ? 'Thermal break jambs prevent outer condensation' : 'Marco con rotura para evitar condensación exterior',
        isEn ? 'Concealed concealed overhead pivots' : 'Pivotes empotrados en dintel superior',
        isEn ? 'Custom bottle racking precision brackets' : 'Soportes de botellas cortados a láser'
      ]
    },
    {
      id: 'west-hollywood-sliding',
      titleEn: 'Architectural Minimalist Sliding Glass Partitions',
      titleEs: 'Cerramiento Corredizo Minimalista en Acero y Vidrio',
      category: 'doors',
      location: 'West Hollywood, CA',
      typologyEn: 'Luxury Loft Penthouse',
      typologyEs: 'Penthouse Tipo Loft',
      year: '2026',
      image: '/gallery/gallery_sliding_glass_doors.jpg',
      materialsEn: 'Precision Laser-Slit Structural Steel • 1/2" Clear Tempered Acoustic Glass',
      materialsEs: 'Acero Estructural Calibrado • Vidrio Acústico Templado 1/2"',
      finishEn: 'Matte Industrial Black Electrostatic Coating',
      finishEs: 'Acabado Negro Industrial Electrostático Mate',
      tolerances: 'Soft-close hydraulic braking in both directions',
      specsEn: 'Top-hung stainless steel tandem ball-bearing rollers with zero bottom floor track trip hazard.',
      specsEs: 'Rodamientos tándem de acero inoxidable en guía superior suspendida sin riel inferior tropezable.',
      codeCompliance: 'ADA Accessibility Compliant Threshold',
      highlights: [
        isEn ? 'Top-hung track concealed within ceiling plenum' : 'Riel superior embutido en falso techo',
        isEn ? 'Acoustic drop-down bottom seal on door close' : 'Burlete guillotina acústico automático al cerrar',
        isEn ? 'Full height seamless floor-to-ceiling panels' : 'Hojas de piso a techo sin uniones horizontales'
      ]
    },
    {
      id: 'miami-glass-balustrade',
      titleEn: 'Structural Frameless Glass Base Shoe Balustrade',
      titleEs: 'Barandilla de Vidrio Laminado con Perfil Oculto en Losa',
      category: 'railings',
      location: 'Miami, FL',
      typologyEn: 'Biscayne Bay Penthouse',
      typologyEs: 'Penthouse Biscayne Bay',
      year: '2026',
      image: '/gallery/gallery_railing_glass.jpg',
      materialsEn: '9/16" SentryGlas (SG) Laminated Tempered Glass • 6005-T5 Aluminum Base Shoe',
      materialsEs: 'Vidrio Templado Laminado 9/16" Interlayer SentryGlas • Perfil Base Aluminio 6005-T5',
      finishEn: 'Fascia Clad in 24-Gauge Matte Black Stainless Steel',
      finishEs: 'Embellecedor en Acero Inoxidable Negro Mate Calibre 24',
      tolerances: 'Impact hurricane certified (Miami-Dade NOA standard)',
      specsEn: 'Dry-glaze taper wedge system allows rapid panel plumb adjustment and future glass replacement.',
      specsEs: 'Sistema de cuñas secas para aplomado milimétrico y rápido recambio sin silicona estructural.',
      codeCompliance: 'Miami-Dade Large Missile Impact / IBC 2407',
      highlights: [
        isEn ? 'High hurricane wind load capacity (160+ MPH)' : 'Resistencia a vientos de huracán (160+ MPH)',
        isEn ? 'Zero obstruction panoramic horizon view' : 'Visión panorámica 100% limpia sin postes',
        isEn ? 'Integrated drainage weep holes' : 'Drenaje perimetral integrado contra agua pluvial'
      ]
    },
    {
      id: 'scottsdale-sliding-gate',
      titleEn: 'Cantilever Sliding Driveway Security Gate',
      titleEs: 'Portón Corredizo Automatizado con Lamas de Privacidad',
      category: 'gates',
      location: 'Scottsdale, AZ',
      typologyEn: 'Modern Desert Compound',
      typologyEs: 'Residencia Contemporánea Desierto',
      year: '2026',
      image: '/gallery/gallery_gate_sliding.jpg',
      materialsEn: 'Heavy Steel RHS Frame • 2" Louver Aluminum Slat Infills',
      materialsEs: 'Marco en Perfil Estructural RHS • Lamas de Aluminio Tipo Persiana de 2"',
      finishEn: 'High-Durability AkzoNobel Sandtex Textured Dark Bronze',
      finishEs: 'Pintura Texturizada AkzoNobel Sandtex Bronce Oscuro',
      tolerances: 'Internal dual guide rollers with nylon wheels',
      specsEn: '24-foot motorized cantilever span with zero ground track, allowing smooth operation over uneven desert terrain.',
      specsEs: 'Vano voladizo motorizado de 24 pies sin riel de suelo, ideal para accesos con desniveles o gravilla.',
      codeCompliance: 'UL325 Class I Residential Gate Operator Safety',
      highlights: [
        isEn ? 'High-speed commercial DC operator (1 ft/sec)' : 'Motor comercial DC de apertura rápida (1 pie/seg)',
        isEn ? 'Built-in photo eye obstacle detection' : 'Fotocélulas y bandas de seguridad antiatrapamiento',
        isEn ? 'Solar auxiliary charging backup kit' : 'Batería de respaldo con carga auxiliar'
      ]
    },
    {
      id: 'palisades-laser-screen',
      titleEn: 'Parametric CNC Laser-Cut Privacy Screen & Trellis',
      titleEs: 'Celosía Paramétrica de Privacidad en Corte Láser CNC',
      category: 'cellars',
      location: 'Pacific Palisades, CA',
      typologyEn: 'Courtyard Architecture',
      typologyEs: 'Patio Central Arquitectónico',
      year: '2026',
      image: '/gallery/gallery_custom_screen.jpg',
      materialsEn: '3/16" Marine Aluminum Sheet 5052-H32 • Structural Steel Tube Supports',
      materialsEs: 'Placa de Aluminio Marino 3/16" 5052-H32 • Tubos Estructurales de Soporte',
      finishEn: 'Fine Sandstone Texture Electrostatically Applied',
      finishEs: 'Textura Arena Fina Electrostática Termoendurecida',
      tolerances: 'Fiber laser cut with 0.1 mm edge cleanliness',
      specsEn: 'Custom geometric perforated pattern calculated to provide 70% direct sunlight shade while maintaining gentle airflow.',
      specsEs: 'Patrón geométrico perforado que brinda 70% de sombra solar manteniendo flujo continuo de brisa.',
      codeCompliance: 'Wind Deflection Tested to 110 MPH Gusts',
      highlights: [
        isEn ? 'Zero visible hardware on front elevation' : 'Cero tornillería visible en cara frontal',
        isEn ? 'Shadow casting architectural effect' : 'Juego de sombras y claroscuros geométricos',
        isEn ? 'Modular interlocking mounting plates' : 'Fijación modular oculta con clips mecanizados'
      ]
    },
    {
      id: 'dtla-commercial-spiral',
      titleEn: 'Architectural Dual-Stringer Commercial Staircase',
      titleEs: 'Escalera Helicoidal Comercial de Doble Zanca',
      category: 'stairs',
      location: 'Downtown Los Angeles, CA',
      typologyEn: 'Design Headquarters & Showroom',
      typologyEs: 'Showroom & Corporativo',
      year: '2026',
      image: '/gallery/gallery_stairs_commercial.jpg',
      materialsEn: 'Laser-Cut Curvilinear 1/2" Plate Stringers • Pan-Filled Concrete Treads',
      materialsEs: 'Zancas Curvilíneas en Placa de 1/2" • Huellas en Bandeja con Hormigón Visto',
      finishEn: 'Charcoal High-Traffic Polyurethane Powder Finish',
      finishEs: 'Poliuretano Alto Tráfico en Polvo Color Carbón',
      tolerances: 'Rigid zero-sway structural seismic anchors',
      specsEn: 'Engineered for 100 lbs/sq ft commercial live loads with seismic connection brackets at mezzanine landings.',
      specsEs: 'Cálculo para 100 lbs/pie² de sobrecarga de uso comercial con anclajes sismorresistentes.',
      codeCompliance: 'IBC Chapter 10 Means of Egress / ADA Compliance',
      highlights: [
        isEn ? 'Factory pre-assembled into 2 modular sections' : 'Premontada en taller en 2 módulos para izaje rápido',
        isEn ? 'Full-penetration ultrasonically tested welds' : 'Soldaduras a tope ensayadas por ultrasonido',
        isEn ? 'Integrated continuous smooth LED underside channel' : 'Canal LED continuo integrado en zanca inferior'
      ]
    },
    {
      id: 'san-diego-ada-handrail',
      titleEn: 'Continuous Smooth Architectural ADA Handrail',
      titleEs: 'Pasamanos Continuo Certificado ADA para Rampa',
      category: 'railings',
      location: 'San Diego, CA',
      typologyEn: 'Civic Cultural Center',
      typologyEs: 'Centro Cultural Cívico',
      year: '2026',
      image: '/gallery/gallery_handrail_ada.jpg',
      materialsEn: '1-1/2" O.D. Schedule 40 Stainless Steel Tube • Concealed Rosette Mounting',
      materialsEs: 'Tubo de Inoxidable 1-1/2" O.D. • Bridas de Fijación con Roseta Oculta',
      finishEn: 'Brushed #4 Satin Architectural Finish',
      finishEs: 'Satinado Arquitectónico Grano #4',
      tolerances: 'Seamless mandrel-bent return ends',
      specsEn: 'Continuous 1-1/2" gripping clearance from finished wall. 12-inch extensions at top and bottom landings compliant with CBC Title 24.',
      specsEs: 'Distancia libre de 1-1/2" a muro. Prolongaciones de 12" al inicio y final según normativa de accesibilidad CBC.',
      codeCompliance: 'ADA Standards Section 505 / ANSI A117.1',
      highlights: [
        isEn ? 'Zero sharp edges, smooth mandrel-drawn curves' : 'Curvado por mandril sin estrías ni bordes afilados',
        isEn ? 'Internal chemical anchor stud bolts' : 'Espárragos con anclaje químico epóxico de alta carga',
        isEn ? 'Full pass-through city inspector approval' : 'Aprobado sin observaciones por inspectores cívicos'
      ]
    },
    {
      id: 'malibu-pivot-glass-door',
      titleEn: 'Oversized Steel & Glass Architectural Pivot Door',
      titleEs: 'Puerta Pivotante Monumental en Acero y Cristal Laminado',
      category: 'doors',
      location: 'Malibu, CA',
      typologyEn: 'Modern Oceanfront Residence',
      typologyEs: 'Residencia Costera Moderna',
      year: '2026',
      image: '/gallery/gallery_glass_door_pivot.jpg',
      materialsEn: 'Heavy Cold-Formed Steel Frame • 1/2" Low-Iron Starphire Tempered Glass',
      materialsEs: 'Marco Acero Estructural Plegado • Cristal Starphire Extraclaro 1/2"',
      finishEn: 'Satin Midnight Black Baked Enamel',
      finishEs: 'Esmalte Horneado Negro Satinado Profundo',
      tolerances: 'Concealed FritsJurgens System M+ pivot hinge',
      specsEn: '9-foot high by 5-foot wide pivot door balanced to operate with 12 Newtons opening force.',
      specsEs: 'Hoja de 9 pies de alto por 5 de ancho con pivote FritsJurgens System M+ regulable.',
      codeCompliance: 'Title 24 / Acoustic STC 38 Sound Dampening',
      highlights: [
        isEn ? 'FritsJurgens concealed pivot hardware' : 'Bisagra de pivote oculta FritsJurgens',
        isEn ? 'Magnetic weather seals on 4 sides' : 'Sellado perimetral magnético de 4 caras',
        isEn ? 'Custom forged solid steel pull bar' : 'Tirador macizo forjado a mano de 6 pies'
      ]
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="portfolio-page-wrapper">
      <div className="blueprint-grid"></div>

      {/* 1. HERO SECTION */}
      <section className="portfolio-hero container">
        <div className="portfolio-hero-header">
          <div className="portfolio-badge">
            <Sparkles size={14} className="text-accent" />
            <span>{isEn ? 'STATION METALWORKS ARCHITECTURAL PORTFOLIO' : 'PORTAFOLIO DE OBRA STATION METALWORKS'}</span>
          </div>
          <h1 className="text-gradient">
            {isEn ? 'Mastery in Architectural Steel, Glass & Precision Metal.' : 'Maestría en Acero, Vidrio y Precisión Estructural.'}
          </h1>
          <p className="portfolio-lead">
            {isEn
              ? 'Explore our curated gallery of structural staircases, minimalist glass partitions, custom cable railings, and automated gates executed with aerospace tolerances for luxury residences and prominent commercial projects.'
              : 'Explora nuestra galería selecta de escaleras flotantes, puertas de acero con rotura térmica, barandales de vidrio y portones automatizados fabricados con tolerancias milimétricas para residencias de lujo y obras arquitectónicas.'}
          </p>

          <div className="portfolio-stats-bar glass-panel">
            <div className="stat-box">
              <span className="stat-number text-accent">450+</span>
              <span className="stat-label">{isEn ? 'Projects Fabricated' : 'Obras Fabricadas'}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number text-accent">±0.5mm</span>
              <span className="stat-label">{isEn ? 'Laser Precision' : 'Precisión Láser'}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number text-accent">IBC 2024</span>
              <span className="stat-label">{isEn ? 'Engineered Code' : 'Cálculo Estructural'}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number text-accent">100%</span>
              <span className="stat-label">{isEn ? 'In-House Curation' : 'Fabricación Propia'}</span>
            </div>
          </div>
        </div>

        {/* 2. FILTER PILLS */}
        <div className="portfolio-filters-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              <span>{isEn ? cat.labelEn : cat.labelEs}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PROJECT GRID */}
      <section className="portfolio-grid-section container">
        <motion.div 
          layout 
          className="portfolio-grid"
        >
          <AnimatePresence>
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="project-card glass-panel"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="project-image-wrapper">
                  <img src={proj.image} alt={isEn ? proj.titleEn : proj.titleEs} className="project-img" loading="lazy" />
                  <div className="project-overlay-badge">
                    <span className="project-category-tag">
                      {categories.find(c => c.id === proj.category)?.[isEn ? 'labelEn' : 'labelEs']}
                    </span>
                    <span className="project-loc-tag">
                      <MapPin size={11} />
                      <span>{proj.location}</span>
                    </span>
                  </div>

                  <div className="project-hover-curtain">
                    <button className="inspect-quick-btn" title={isEn ? 'Inspect Project Specs' : 'Ver Detalles del Proyecto'}>
                      <Maximize2 size={16} />
                      <span>{isEn ? 'View Technical Specs' : 'Inspeccionar Proyecto'}</span>
                    </button>
                  </div>
                </div>

                <div className="project-card-body">
                  <div className="project-card-meta">
                    <span className="typology-tag">{isEn ? proj.typologyEn : proj.typologyEs}</span>
                    <span className="year-tag">{proj.year}</span>
                  </div>

                  <h3 className="project-card-title">{isEn ? proj.titleEn : proj.titleEs}</h3>

                  <p className="project-card-materials">
                    <span className="spec-label">{isEn ? 'Materials:' : 'Materiales:'}</span> {isEn ? proj.materialsEn : proj.materialsEs}
                  </p>

                  <div className="project-card-footer">
                    <span className="finish-tag">
                      <ShieldCheck size={13} className="text-accent" />
                      <span>{proj.codeCompliance}</span>
                    </span>
                    <span className="action-inspect-link">
                      <span>{isEn ? 'Inspect' : 'Ver Ficha'}</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 4. TECHNICAL INSPECTION MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
            <motion.div 
              className="project-modal glass-panel"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setSelectedProject(null)} aria-label="Cerrar modal">
                <X size={22} />
              </button>

              <div className="modal-content-grid">
                {/* Image Column */}
                <div className="modal-image-column">
                  <div className="modal-image-box">
                    <img src={selectedProject.image} alt={isEn ? selectedProject.titleEn : selectedProject.titleEs} className="modal-big-img" />
                    <div className="modal-image-gradient"></div>
                    <div className="modal-image-location-pill">
                      <MapPin size={13} className="text-accent" />
                      <span>{selectedProject.location} • {selectedProject.year}</span>
                    </div>
                  </div>
                </div>

                {/* Info Column */}
                <div className="modal-info-column">
                  <div className="modal-header-meta">
                    <span className="modal-category-badge">
                      {categories.find(c => c.id === selectedProject.category)?.[isEn ? 'labelEn' : 'labelEs']}
                    </span>
                    <span className="modal-typology-badge">{isEn ? selectedProject.typologyEn : selectedProject.typologyEs}</span>
                  </div>

                  <h2 className="modal-project-title">{isEn ? selectedProject.titleEn : selectedProject.titleEs}</h2>

                  <p className="modal-specs-text">{isEn ? selectedProject.specsEn : selectedProject.specsEs}</p>

                  <div className="modal-specs-list">
                    <div className="spec-row">
                      <div className="spec-icon-title">
                        <Layers size={15} className="text-accent" />
                        <strong>{isEn ? 'Materials & Build:' : 'Materiales y Estructura:'}</strong>
                      </div>
                      <span className="spec-value">{isEn ? selectedProject.materialsEn : selectedProject.materialsEs}</span>
                    </div>

                    <div className="spec-row">
                      <div className="spec-icon-title">
                        <Sparkles size={15} className="text-accent" />
                        <strong>{isEn ? 'Surface Finish:' : 'Acabado Superficial:'}</strong>
                      </div>
                      <span className="spec-value">{isEn ? selectedProject.finishEn : selectedProject.finishEs}</span>
                    </div>

                    <div className="spec-row">
                      <div className="spec-icon-title">
                        <Ruler size={15} className="text-accent" />
                        <strong>{isEn ? 'Dimensional Tolerance:' : 'Tolerancia Dimensional:'}</strong>
                      </div>
                      <span className="spec-value">{selectedProject.tolerances}</span>
                    </div>

                    <div className="spec-row">
                      <div className="spec-icon-title">
                        <ShieldCheck size={15} className="text-accent" />
                        <strong>{isEn ? 'Engineering Code Compliance:' : 'Normativa y Códigos:'}</strong>
                      </div>
                      <span className="spec-value">{selectedProject.codeCompliance}</span>
                    </div>
                  </div>

                  {/* Highlights Pill Array */}
                  <div className="modal-highlights-box">
                    <h4>{isEn ? 'Architectural Highlights & Details:' : 'Detalles de Ejecución y Montaje:'}</h4>
                    <ul className="highlights-list">
                      {selectedProject.highlights.map((h, hIdx) => (
                        <li key={hIdx}>
                          <CheckCircle2 size={14} className="text-accent" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modal Action CTA Buttons */}
                  <div className="modal-actions-row">
                    <a 
                      href="#/contact" 
                      className="btn btn-primary modal-quote-btn"
                      onClick={() => setSelectedProject(null)}
                    >
                      <Compass size={16} />
                      <span>{isEn ? 'Schedule Site Measurement' : 'Agendar Levantamiento para este Estilo'}</span>
                    </a>

                    <a 
                      href={`https://wa.me/13462349640?text=${encodeURIComponent(
                        isEn 
                          ? `Hello Station Metalworks, I am interested in custom fabrication inspired by your portfolio project: "${selectedProject.titleEn}" (${selectedProject.location}).`
                          : `Hola Station Metalworks, me interesa una cotización para un proyecto inspirado en su obra de portafolio: "${selectedProject.titleEs}" (${selectedProject.location}).`
                      )}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="modal-wa-btn"
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PORTFOLIO BOTTOM CTA */}
      <section className="portfolio-bottom-cta container">
        <div className="cta-banner-card glass-panel">
          <div className="cta-content">
            <span className="cta-eyebrow">
              <Compass size={14} />
              {isEn ? 'TECHNICAL SITE MEASUREMENT & CONSULTATION' : 'LEVANTAMIENTO TÉCNICO EN SITIO'}
            </span>
            <h2>{isEn ? 'Ready to Bring High-Precision Steel to Your Project?' : '¿Listo para Construir con Acero de Precisión en tu Obra?'}</h2>
            <p>
              {isEn
                ? 'From residential floating stairs to custom pivot doors and marine-grade balustrades, we handle structural engineering calculations, 3D laser measurement, fabrication, and clean installation.'
                : 'Desde escaleras voladizas de diseño hasta puertas pivotantes y barandales costeros, nos encargamos del levantamiento láser 3D, memorias de cálculo, manufactura en taller y montaje en obra.'}
            </p>
          </div>
          <div className="cta-buttons">
            <a href="#/contact" className="btn btn-primary cta-main-btn">
              <Compass size={16} />
              <span>{isEn ? 'Schedule Site Measurement' : 'Agenda tu Levantamiento'}</span>
            </a>
            <a href="#/shop" className="btn btn-secondary cta-sec-btn">
              <span>{isEn ? 'Browse Store Products' : 'Ver Productos en Tienda'}</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        .portfolio-page-wrapper {
          padding-top: 105px;
          padding-bottom: 90px;
          position: relative;
        }

        .portfolio-hero {
          padding: 30px 0 20px 0;
        }

        .portfolio-hero-header {
          max-width: 860px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .portfolio-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 12px;
          border-radius: 4px;
          align-self: flex-start;
          letter-spacing: 0.04em;
        }

        .portfolio-hero-header h1 {
          font-size: 2.9rem;
          font-weight: 800;
          line-height: 1.15;
          color: var(--color-text-primary);
        }

        .portfolio-lead {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .portfolio-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 20px 28px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          margin-top: 15px;
          box-shadow: 0 8px 25px rgba(2, 0, 50, 0.04);
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-right: 1px solid var(--color-border);
          padding-right: 16px;
        }

        .stat-box:last-child {
          border-right: none;
          padding-right: 0;
        }

        .stat-number {
          font-size: 1.4rem;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        /* Filter Pills */
        .portfolio-filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 36px 0 24px 0;
        }

        .filter-btn {
          padding: 9px 18px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 25px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
          transform: translateY(-1px);
        }

        .filter-btn.active {
          background: var(--color-text-primary);
          color: #FFFFFF;
          border-color: var(--color-text-primary);
          box-shadow: 0 4px 12px rgba(2, 0, 50, 0.15);
        }

        /* Projects Grid */
        .portfolio-grid-section {
          padding-bottom: 50px;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .project-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-accent);
          box-shadow: 0 16px 36px rgba(2, 0, 50, 0.08);
        }

        .project-image-wrapper {
          position: relative;
          height: 250px;
          background: #020032;
          overflow: hidden;
        }

        .project-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .project-card:hover .project-img {
          transform: scale(1.05);
        }

        .project-overlay-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .project-category-tag {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(4px);
          padding: 3px 9px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .project-loc-tag {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 600;
          color: #FFFFFF;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(4px);
          padding: 3px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .project-hover-curtain {
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

        .project-card:hover .project-hover-curtain {
          opacity: 1;
        }

        .inspect-quick-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #FFFFFF;
          color: var(--color-text-primary);
          border: none;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s;
        }

        .inspect-quick-btn:hover {
          transform: scale(1.04);
        }

        .project-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .project-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .typology-tag {
          font-weight: 600;
          color: var(--color-accent);
        }

        .year-tag {
          font-family: monospace;
        }

        .project-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin: 0;
        }

        .project-card-materials {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        .spec-label {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .project-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px dashed var(--color-border);
          padding-top: 12px;
          margin-top: 4px;
        }

        .finish-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .action-inspect-link {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-accent);
          font-family: var(--font-heading);
        }

        /* Technical Lightbox Modal */
        .project-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.75);
          backdrop-filter: blur(8px);
          z-index: 4000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .project-modal {
          width: 100%;
          max-width: 980px;
          max-height: 90vh;
          overflow-y: auto;
          background: #FFFFFF;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(2, 0, 50, 0.08);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-primary);
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: var(--color-accent);
          color: #FFFFFF;
        }

        .modal-content-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.3fr;
        }

        .modal-image-column {
          position: relative;
          background: #020032;
          min-height: 480px;
        }

        .modal-image-box {
          position: sticky;
          top: 0;
          height: 100%;
          width: 100%;
        }

        .modal-big-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .modal-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 60%, rgba(2,0,50,0.85) 100%);
        }

        .modal-image-location-pill {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          color: var(--color-text-primary);
          padding: 6px 14px;
          border-radius: 20px;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .modal-info-column {
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-header-meta {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .modal-category-badge {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 3px 10px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .modal-typology-badge {
          font-size: 0.74rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .modal-project-title {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.25;
          margin: 0;
        }

        .modal-specs-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .modal-specs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px 20px;
        }

        .spec-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.78rem;
        }

        .spec-icon-title {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-primary);
          font-weight: 700;
        }

        .spec-value {
          color: var(--color-text-secondary);
          padding-left: 21px;
          line-height: 1.45;
        }

        .modal-highlights-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-highlights-box h4 {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .highlights-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0;
          margin: 0;
        }

        .highlights-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .modal-actions-row {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .modal-quote-btn {
          flex: 1;
          justify-content: center;
          padding: 12px 18px;
          font-size: 0.82rem;
        }

        .modal-quote-btn:hover {
          background: #B80020 !important;
          color: #FFFFFF !important;
        }

        .modal-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #25D366;
          color: #FFFFFF;
          padding: 12px 18px;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }

        .modal-wa-btn:hover {
          background: #1EBE5D;
          transform: translateY(-1px);
        }

        /* Bottom CTA Banner */
        .portfolio-bottom-cta {
          margin-top: 40px;
        }

        .cta-banner-card {
          background: linear-gradient(135deg, #020032 0%, #0c085e 100%);
          border-radius: 16px;
          padding: 48px;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 30px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.18);
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .cta-content h2 {
          font-size: 1.9rem;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 12px 0;
          color: #FFFFFF;
        }

        .cta-content p {
          font-size: 0.9rem;
          color: #CBD5E1;
          line-height: 1.6;
          margin: 0;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cta-main-btn {
          justify-content: center;
          padding: 14px 24px;
        }

        .cta-main-btn:hover {
          background: #B80020 !important;
          color: #FFFFFF !important;
        }

        .cta-sec-btn {
          justify-content: center;
          padding: 14px 24px;
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .cta-sec-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .modal-content-grid {
            grid-template-columns: 1fr;
          }
          .modal-image-column {
            min-height: 300px;
            height: 320px;
          }
          .cta-banner-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
          .portfolio-hero-header h1 {
            font-size: 2.1rem;
          }
          .portfolio-stats-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-box:nth-child(2) {
            border-right: none;
          }
          .modal-info-column {
            padding: 24px 20px;
          }
          .modal-actions-row {
            flex-direction: column;
          }
          .cta-banner-card {
            padding: 30px 24px;
          }
        }
      `}</style>
    </div>
  );
}
