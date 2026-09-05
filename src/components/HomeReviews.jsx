import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Star, ShieldCheck, ArrowRight, Building2, UserCheck, Sparkles, MapPin
} from 'lucide-react';

export default function HomeReviews() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  // Row 1: 7 Distinct High-Caliber Reviews (Architects, Contractors, Engineers, Homeowners)
  const row1Reviews = [
    {
      id: 1,
      categoryEn: 'Architect',
      categoryEs: 'Arquitecto',
      name: 'Arthur Sterling, AIA',
      roleEn: 'Principal Architect • Sterling & Partners',
      roleEs: 'Arquitecto Principal • Sterling & Partners',
      location: 'Los Angeles, CA',
      projectEn: 'Bel Air Cantilevered Floating Staircase',
      projectEs: 'Escalera Voladiza Monoviga en Bel Air',
      rating: 5,
      date: 'August 2026',
      textEn: 'Station Metalworks is in a league of their own. We submitted complex Revit models for a 22-foot cantilevered staircase. They caught two engineering clash points before fabrication and delivered with zero field modifications required. Absolute perfection.',
      textEs: 'Station Metalworks está en un nivel superior. Enviamos modelos complejos de Revit para una escalera voladiza de 22 pies. Detectaron dos interferencias de cálculo antes de fabricar y la entregaron lista sin necesidad de ajustes en obra. Perfección absoluta.'
    },
    {
      id: 2,
      categoryEn: 'General Contractor',
      categoryEs: 'Constructor GC',
      name: 'Marcus Vance',
      roleEn: 'General Contractor • Vance Luxury Estates',
      roleEs: 'Contratista General • Vance Luxury Estates',
      location: 'Austin, TX',
      projectEn: 'Lake Austin 180-ft Coastal Cable Railing System',
      projectEs: 'Sistema de Barandilla de Cable en Lake Austin',
      rating: 5,
      date: 'July 2026',
      textEn: 'We order all our railing posts and ADA handrails from their custom shop. The packaging in custom timber crates ensured not a single scratch on 180 feet of powder-coated steel. The crew installed in record time with zero callbacks.',
      textEs: 'Pedimos todos los postes y pasamanos ADA en su taller a medida. El empaque en cajas de madera reforzadas garantizó cero rayones en 180 pies de acero con recubrimiento en polvo. El equipo instaló todo en tiempo récord sin observaciones.'
    },
    {
      id: 3,
      categoryEn: 'Architecture Director',
      categoryEs: 'Arquitectura Interior',
      name: 'Danielle Moreau, LEED AP',
      roleEn: 'Interior Architecture Director • Studio M',
      roleEs: 'Directora de Arquitectura Interior • Studio M',
      location: 'Miami, FL',
      projectEn: 'Biscayne Bay Penthouse Glass Balustrade',
      projectEs: 'Barandilla de Vidrio en Ático de Biscayne Bay',
      rating: 5,
      date: 'June 2026',
      textEn: 'Marine-grade AISI 316 stainless steel was non-negotiable for this oceanfront project. Station Metalworks provided certified metallurgical heat logs and hurricane wind load calculations that sailed through municipal plan check.',
      textEs: 'El acero inoxidable AISI 316 grado marino era imprescindible frente al mar. Station Metalworks proporcionó ensayos de colada y memorias de cálculo de viento que pasaron la revisión municipal sin observaciones.'
    },
    {
      id: 4,
      categoryEn: 'Estate Owner',
      categoryEs: 'Propietario',
      name: 'Dr. Julian & Clara Hayes',
      roleEn: 'Homeowners • Private Residence',
      roleEs: 'Propietarios • Residencia Privada',
      location: 'Beverly Hills, CA',
      projectEn: 'Custom Automated Cantilever Driveway Gate',
      projectEs: 'Portón Automatizado de Entrada en Beverly Hills',
      rating: 5,
      date: 'May 2026',
      textEn: 'The gate glides so silently our neighbors did not even realize it was moving. The horizontal slats provide 100% privacy while looking like a sculptural art piece from the street. Outstanding craftsmanship and personal care.',
      textEs: 'El portón se desliza tan silenciosamente que los vecinos ni notaron el movimiento. Las lamas horizontales brindan total privacidad con una presencia escultórica impecable desde la calle. Mano de obra y atención insuperables.'
    },
    {
      id: 5,
      categoryEn: 'Project Manager',
      categoryEs: 'Director de Obra',
      name: 'Carlos Mendonça',
      roleEn: 'Commercial Project Manager • Apex Builds',
      roleEs: 'Director de Obra Comercial • Apex Builds',
      location: 'Houston, TX',
      projectEn: 'Corporate Headquarters Tables & ADA Grab Rails',
      projectEs: 'Mesas Corporativas de Acero y Pasamanos ADA',
      rating: 5,
      date: 'April 2026',
      textEn: 'We needed 3 oversized structural conference tables and 240 ft of continuous ADA handrails on an aggressive 4-week deadline. The shop delivered two days early with flawless flush-ground welds and zero defects. True masters.',
      textEs: 'Necesitábamos 3 mesas de juntas de gran formato y 240 pies de pasamanos ADA en un plazo récord de 4 semanas. El taller entregó dos días antes con uniones pulidas impecables y cero defectos. Maestros del oficio.'
    },
    {
      id: 6,
      categoryEn: 'Interior Designer',
      categoryEs: 'Diseño de Interiores',
      name: 'Elena Rostova',
      roleEn: 'Luxury Interior Designer • Rostova Atelier',
      roleEs: 'Diseñadora de Interiores de Lujo • Rostova Atelier',
      location: 'Dallas, TX',
      projectEn: 'Preston Hollow Custom Mezzanine Railing',
      projectEs: 'Barandilla de Vidrio y Acero en Mezanina',
      rating: 5,
      date: 'March 2026',
      textEn: 'Finding fabricators who understand high-design tolerances without compromising on life-safety codes is exceedingly rare. Station Metalworks bridged the gap between our creative vision and city engineering permits seamlessly.',
      textEs: 'Encontrar fabricantes que entiendan la alta exigencia de diseño sin comprometer la seguridad estructural es casi imposible. Station Metalworks unió nuestra visión estética con los permisos municipales a la perfección.'
    },
    {
      id: 7,
      categoryEn: 'Structural Engineer',
      categoryEs: 'Ingeniero Estructural',
      name: 'Robert MacIntyre, PE',
      roleEn: 'Senior Structural Engineer • MacIntyre Engineering',
      roleEs: 'Ingeniero Estructural Senior • MacIntyre Engineering',
      location: 'Aspen, CO',
      projectEn: 'Double-Stringer Alpine Helical Staircase',
      projectEs: 'Escalera Helicoidal Alpina Doble Zanca',
      rating: 5,
      date: 'February 2026',
      textEn: 'Their shop drawings and finite element analysis (FEA) for the double stringer staircase were textbook perfection. Weld penetration inspections passed ultrasound testing on the first pass with zero porosity.',
      textEs: 'Sus planos de taller y análisis por elementos finitos (FEA) para la escalera helicoidal fueron una obra maestra de ingeniería. Las inspecciones de soldadura por ultrasonido pasaron a la primera con cero porosidad.'
    }
  ];

  // Row 2: 7 Distinct Additional High-Caliber Reviews (Moving in Opposite Direction)
  const row2Reviews = [
    {
      id: 8,
      categoryEn: 'Estate Owner',
      categoryEs: 'Propietaria',
      name: 'Sofia Alarcón',
      roleEn: 'Ranch Owner • Hill Country Heritage',
      roleEs: 'Propietaria de Finca • Hill Country Heritage',
      location: 'Fredericksburg, TX',
      projectEn: 'Artisanal Estate Perimeter Iron Fence & Crested Gate',
      projectEs: 'Cerca Perimetral de Hierro Forjado y Portón Emblasonado',
      rating: 5,
      date: 'January 2026',
      textEn: 'We wanted a timeless perimeter wrought iron fence that could withstand the Texas sun and torrential rains. José and his team forged bespoke finials that match our 1920s limestone ranch house. Worth every penny.',
      textEs: 'Queríamos una cerca perimetral de hierro forjado atemporal que resistiera el sol de Texas y lluvias torrenciales. José y su equipo forjaron remates a medida que combinan con nuestro rancho de piedra caliza de 1920. Valió cada centavo.'
    },
    {
      id: 9,
      categoryEn: 'Custom Builder',
      categoryEs: 'Constructor de Autor',
      name: 'David K. Sterling',
      roleEn: 'Custom Home Builder • Sterling Ridge Homes',
      roleEs: 'Constructor de Residencias de Autor • Sterling Ridge Homes',
      location: 'Houston, TX',
      projectEn: 'The River Oaks Residence Monolithic Pivot Door',
      projectEs: 'Puerta Pivotante Monolítica en River Oaks',
      rating: 5,
      date: 'December 2025',
      textEn: 'A 12-foot tall steel and thermal glass pivot door is a massive liability if the balance is off by 1mm. Station Metalworks installed industrial FritsJurgens pivot hinges and the door opens with the touch of a single finger.',
      textEs: 'Una puerta pivotante de 12 pies de acero y vidrio térmico es un riesgo enorme si el balance falla por 1mm. Station Metalworks instaló pivotes industriales FritsJurgens y la puerta abre con el empuje de un solo dedo.'
    },
    {
      id: 10,
      categoryEn: 'Lead Architect',
      categoryEs: 'Arquitecto Principal',
      name: 'Harrison Blake, AIA',
      roleEn: 'Lead Architect • Blake & Vanguard Architecture',
      roleEs: 'Arquitecto Principal • Blake & Vanguard Architecture',
      location: 'Dallas, TX',
      projectEn: 'Highland Park Minimalist Base-Shoe Glass Railing',
      projectEs: 'Barandilla Minimalista Base-Shoe en Highland Park',
      rating: 5,
      date: 'November 2025',
      textEn: 'Zero visible hardware, 200-lb top rail point load compliance, and crystal-clear low-iron laminated glass. They coordinated with our flooring subcontractor for recessed channels without a single hitch.',
      textEs: 'Cero tornillería visible, cumplimiento de carga puntual de 200 libras y vidrio laminado extraclaro sin distorsión. Coordinaron con el equipo de pisos para dejar los canales embutidos sin contratiempos.'
    },
    {
      id: 11,
      categoryEn: 'Coastal Specifier',
      categoryEs: 'Especificación Costera',
      name: 'Camila Valenzuela',
      roleEn: 'Architectural Specifier • Valenzuela Coastal',
      roleEs: 'Especificadora Técnica • Valenzuela Coastal',
      location: 'Corpus Christi, TX',
      projectEn: 'Seawall Promenade Stainless Cable Balustrade',
      projectEs: 'Barandilla de Cable Marino en Malecón',
      rating: 5,
      date: 'October 2025',
      textEn: 'Salt spray destroys standard railings in 18 months. Station Metalworks electro-polished every single 316 fitting and passivated the welds. Three years later, there is zero tea-staining or discoloration.',
      textEs: 'La niebla marina destruye barandales comunes en 18 meses. Station Metalworks electropolió cada tensor 316 y pasivó las soldaduras. Tres años después, no hay rastro de manchas ni decoloración.'
    },
    {
      id: 12,
      categoryEn: 'Safety Director',
      categoryEs: 'Director de Seguridad',
      name: 'Gregory Vance',
      roleEn: 'Safety Director • Lone Star Commercial',
      roleEs: 'Director de Seguridad de Obra • Lone Star Commercial',
      location: 'San Antonio, TX',
      projectEn: 'Commercial Multi-Story Core Stair & Exit Rails',
      projectEs: 'Núcleo de Escalera Comercial & Pasamanos de Salida',
      rating: 5,
      date: 'September 2025',
      textEn: 'City inspectors in San Antonio are notoriously strict on graspability and returns. Station Metalworks produced 1.5-inch continuous pipe rails with smooth radiused corners that passed final inspection in 10 minutes.',
      textEs: 'Los inspectores en San Antonio son muy rigurosos con la ergonomía de agarre y retornos. Station Metalworks fabricó pasamanos continuos de 1.5 pulgadas con curvas perfectas que pasaron inspección en 10 minutos.'
    },
    {
      id: 13,
      categoryEn: 'Private Collector',
      categoryEs: 'Propietarios',
      name: 'Laurent & Beatrice Dupont',
      roleEn: 'Homeowners • Modernist Estate',
      roleEs: 'Propietarios • Residencia Modernista',
      location: 'Memorial, Houston, TX',
      projectEn: 'Custom Monolithic Steel Dining Table (14-ft)',
      projectEs: 'Mesa de Comedor Monolítica en Acero de 14 Pies',
      rating: 5,
      date: 'August 2025',
      textEn: 'We commissioned a 14-foot dining table with a monolithic blackened steel base and walnut slab inlay. The weld seams are completely invisible; the steel looks like a single carved piece of obsidian.',
      textEs: 'Encargamos una mesa de comedor de 14 pies con base monolítica de acero pavonado negro y encimera de nogal. Las uniones soldadas son totalmente invisibles; el acero parece una sola pieza esculpida de obsidiana.'
    },
    {
      id: 14,
      categoryEn: 'Landscape Architect',
      categoryEs: 'Arquitecto Paisajista',
      name: 'Nathanial Cross',
      roleEn: 'Principal Landscape Architect • Cross & Ground',
      roleEs: 'Arquitecto Paisajista Principal • Cross & Ground',
      location: 'The Woodlands, TX',
      projectEn: 'Architectural Cantilevered Steel Pergola',
      projectEs: 'Pérgola Voladiza Estructural en Acero',
      rating: 5,
      date: 'July 2025',
      textEn: 'They engineered hidden drainage within the 6x6 structural steel columns and laser-cut louver blades that block harsh Texas western sun while allowing ambient breeze. A triumph of custom metal craft.',
      textEs: 'Diseñaron desagües ocultos dentro de las columnas estructurales de 6x6 y lamas cortadas por láser que bloquean el sol del oeste de Texas permitiendo la brisa. Un triunfo de la forja arquitectónica moderna.'
    }
  ];

  const renderReviewCard = (r, keyPrefix = '') => (
    <div key={`${keyPrefix}-${r.id}`} className="review-marquee-card">
      {/* Top Row: Stars + Category Pill + Verified */}
      <div className="review-card-top">
        <div className="stars-row">
          {[...Array(r.rating)].map((_, i) => (
            <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
          ))}
        </div>
        <div className="badges-cluster">
          <span className="category-pill">
            {isEs ? r.categoryEs : r.categoryEn}
          </span>
          <span className="verified-badge">
            <ShieldCheck size={12} className="text-emerald" />
            {isEs ? 'Verificado' : 'Verified'}
          </span>
        </div>
      </div>

      {/* Quote Body */}
      <p className="review-quote-text">
        &ldquo;{isEs ? r.textEs : r.textEn}&rdquo;
      </p>

      {/* Project Badge */}
      <div className="review-project-badge">
        <Building2 size={13} />
        <span>{isEs ? r.projectEs : r.projectEn}</span>
      </div>

      {/* Client Info Footer */}
      <div className="review-author-footer">
        <div className="author-avatar-initials">
          {r.name.split(' ').map(n => n[0]).filter(c => /[A-Z]/.test(c)).slice(0, 2).join('')}
        </div>
        <div className="author-info">
          <h4 className="author-name">{r.name}</h4>
          <span className="author-role">{isEs ? r.roleEs : r.roleEn}</span>
          <span className="author-loc">
            <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
            {r.location} • {r.date}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="home-reviews-section" id="reviews">
      {/* Header Container */}
      <div className="container">
        <div className="home-reviews-header">
          <div className="reviews-eyebrow">
            <UserCheck size={14} className="icon-crimson" />
            <span>{isEs ? 'REPUTACIÓN VERIFICADA // RESEÑAS EN VIVO' : 'VERIFIED REPUTATION // LIVE REVIEWS'}</span>
          </div>
          
          <div className="reviews-header-row">
            <div>
              <h2 className="reviews-title text-gradient">
                {isEs 
                  ? 'La Confianza de Quienes Construyen con Excelencia' 
                  : 'Trusted by Leading Architects, Builders & Homeowners'}
              </h2>
              <p className="reviews-subtitle">
                {isEs
                  ? 'Explora las opiniones continuas de arquitectos colegiados, constructores residenciales de lujo y propietarios privados que certifican la precisión, seguridad y maestría de Station Metalworks.'
                  : 'Explore continuous verified feedback from licensed architects, custom luxury estate builders, and discerning homeowners who rely on Station Metalworks for life-safety structural installations.'}
              </p>
            </div>

            {/* Overall Trust Scorecard */}
            <div className="trust-scorecard">
              <div className="scorecard-top">
                <span className="big-rating">4.98</span>
                <div className="stars-cluster">
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span className="scorecard-sub">{isEs ? 'Basado en 180+ obras' : 'Based on 180+ projects'}</span>
                </div>
              </div>
              <div className="scorecard-stats">
                <div className="sc-stat">
                  <span className="sc-val">100%</span>
                  <span className="sc-lbl">{isEs ? 'Paso de Permisos' : 'Permit Pass Rate'}</span>
                </div>
                <div className="sc-stat">
                  <span className="sc-val">0</span>
                  <span className="sc-lbl">{isEs ? 'Subcontratistas' : 'Subcontractors'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Dual Marquee Wrapper (Bleed across screen with Side Blur) */}
      <div className="reviews-marquee-wrapper">
        {/* Left & Right Blur Vignettes */}
        <div className="marquee-edge-blur-left" aria-hidden="true" />
        <div className="marquee-edge-blur-right" aria-hidden="true" />

        {/* Row 1: Moves Smoothly from Right to Left (Continuous, Never Stops) */}
        <div className="marquee-row-track">
          <div className="marquee-group-left">
            {row1Reviews.map(r => renderReviewCard(r, 'r1-a'))}
          </div>
          <div className="marquee-group-left" aria-hidden="true">
            {row1Reviews.map(r => renderReviewCard(r, 'r1-b'))}
          </div>
        </div>

        {/* Row 2: Moves Smoothly from Left to Right (Continuous, Never Stops) */}
        <div className="marquee-row-track">
          <div className="marquee-group-right">
            {row2Reviews.map(r => renderReviewCard(r, 'r2-a'))}
          </div>
          <div className="marquee-group-right" aria-hidden="true">
            {row2Reviews.map(r => renderReviewCard(r, 'r2-b'))}
          </div>
        </div>
      </div>

      {/* Bottom Container / Action Banner */}
      <div className="container">
        <div className="reviews-bottom-banner">
          <div className="banner-text">
            <h4>{isEs ? '¿Quieres ver más referencias técnicas o hablar con el taller?' : 'Looking to inspect structural references or consult our shop?'}</h4>
            <p>{isEs ? 'Proporcionamos memorias de cálculo estructural PE, muestras físicas de acabado y contacto con clientes directos.' : 'We provide PE structural engineering calculations, physical coating swatches, and direct client references.'}</p>
          </div>
          <div className="banner-actions">
            <a href="#/contact" className="btn-review-contact">
              <span>{isEs ? 'Hablar con Nuestro Equipo' : 'Connect with our Team'}</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Scoped CSS */}
      <style>{`
        .home-reviews-section {
          padding: 85px 0 95px 0;
          background: #FFFFFF;
          position: relative;
          border-top: 1px solid var(--color-border);
          overflow: hidden;
        }

        .home-reviews-header {
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reviews-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.06em;
          background: rgba(224, 0, 39, 0.08);
          padding: 5px 12px;
          border-radius: 6px;
          align-self: flex-start;
        }

        .reviews-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          flex-wrap: wrap;
        }

        .reviews-title {
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.2;
          color: var(--color-brand-dark, #020032);
          margin-bottom: 8px;
        }

        .reviews-subtitle {
          font-size: 1rem;
          color: var(--color-text-secondary, #3b3e54);
          max-width: 660px;
          line-height: 1.6;
          margin: 0;
        }

        /* Scorecard */
        .trust-scorecard {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 18px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 4px 16px rgba(2, 0, 50, 0.04);
        }

        .scorecard-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .big-rating {
          font-family: monospace;
          font-size: 2.4rem;
          font-weight: 900;
          color: var(--color-brand-dark, #020032);
          line-height: 1;
        }

        .stars-cluster {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .stars-row {
          display: flex;
          gap: 3px;
        }

        .scorecard-sub {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted, #7c829c);
          font-weight: 700;
        }

        .scorecard-stats {
          display: flex;
          gap: 20px;
          border-top: 1px solid var(--color-border);
          padding-top: 10px;
        }

        .sc-stat {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sc-val {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
        }

        .sc-lbl {
          font-size: 0.68rem;
          color: var(--color-text-muted, #7c829c);
          font-weight: 600;
        }

        /* ==========================================================================
           Dual Marquee Carousels with Side Blur Vignettes
           ========================================================================== */
        .reviews-marquee-wrapper {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          overflow: hidden;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* Left Blur Vignette */
        .marquee-edge-blur-left {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 180px;
          z-index: 20;
          pointer-events: none;
          background: linear-gradient(
            to right, 
            #FFFFFF 20%, 
            rgba(255, 255, 255, 0.9) 50%, 
            rgba(255, 255, 255, 0.3) 80%, 
            rgba(255, 255, 255, 0) 100%
          );
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          mask-image: linear-gradient(to right, black 30%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, black 30%, transparent 100%);
        }

        /* Right Blur Vignette */
        .marquee-edge-blur-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 180px;
          z-index: 20;
          pointer-events: none;
          background: linear-gradient(
            to left, 
            #FFFFFF 20%, 
            rgba(255, 255, 255, 0.9) 50%, 
            rgba(255, 255, 255, 0.3) 80%, 
            rgba(255, 255, 255, 0) 100%
          );
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          mask-image: linear-gradient(to left, black 30%, transparent 100%);
          -webkit-mask-image: linear-gradient(to left, black 30%, transparent 100%);
        }

        .marquee-row-track {
          display: flex;
          gap: 24px;
          width: 100%;
          overflow: visible;
          user-select: none;
        }

        /* Group Left: Right-to-Left Infinite Scroll */
        .marquee-group-left {
          display: flex;
          gap: 24px;
          flex-shrink: 0;
          animation: infiniteMarqueeScrollLeft 48s linear infinite;
          will-change: transform;
        }

        /* Group Right: Left-to-Right Infinite Scroll */
        .marquee-group-right {
          display: flex;
          gap: 24px;
          flex-shrink: 0;
          animation: infiniteMarqueeScrollRight 48s linear infinite;
          will-change: transform;
        }

        /* Keyframes: Zero Jumps, Seamless 100% + gap offset */
        @keyframes infiniteMarqueeScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 24px));
          }
        }

        @keyframes infiniteMarqueeScrollRight {
          0% {
            transform: translateX(calc(-100% - 24px));
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Card Styling */
        .review-marquee-card {
          width: 390px;
          min-height: 290px;
          flex-shrink: 0;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          box-shadow: 0 4px 18px rgba(2, 0, 50, 0.035);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .review-marquee-card:hover {
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 10px 28px rgba(2, 0, 50, 0.08);
        }

        .review-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .badges-cluster {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .category-pill {
          font-family: monospace;
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          background: #F1F5F9;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 800;
          color: #10B981;
          background: rgba(16, 185, 129, 0.1);
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .review-quote-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-brand-dark, #020032);
          font-style: italic;
          margin: 0;
          flex: 1;
        }

        .review-project-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.70rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.06);
          padding: 5px 9px;
          border-radius: 6px;
          border-left: 2px solid var(--color-accent, #e00027);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .review-author-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
        }

        .author-avatar-initials {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-accent, #e00027);
          flex-shrink: 0;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
        }

        .author-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-role {
          font-size: 0.74rem;
          color: var(--color-text-secondary, #3b3e54);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-loc {
          font-family: monospace;
          font-size: 0.67rem;
          color: var(--color-text-muted, #7c829c);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Bottom Banner */
        .reviews-bottom-banner {
          margin-top: 36px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 28px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .banner-text h4 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 4px 0;
        }

        .banner-text p {
          font-size: 0.88rem;
          color: var(--color-text-secondary, #3b3e54);
          margin: 0;
        }

        .btn-review-contact {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.25s;
          white-space: nowrap;
        }

        .btn-review-contact:hover {
          background: var(--color-accent, #e00027);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(224, 0, 39, 0.25);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .marquee-edge-blur-left,
          .marquee-edge-blur-right {
            width: 110px;
          }
        }

        @media (max-width: 768px) {
          .review-marquee-card {
            width: 320px;
            min-height: 270px;
            padding: 20px 18px;
          }
          .marquee-edge-blur-left,
          .marquee-edge-blur-right {
            width: 50px;
          }
          .reviews-title {
            font-size: 1.8rem;
          }
          .trust-scorecard {
            width: 100%;
          }
          .reviews-bottom-banner {
            padding: 24px 20px;
          }
        }
      `}</style>
    </section>
  );
}
