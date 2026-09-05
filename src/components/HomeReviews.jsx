import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Star, ShieldCheck, CheckCircle2, ArrowRight, 
  MessageSquare, Quote, ThumbsUp, Building2, UserCheck, Sparkles
} from 'lucide-react';

export default function HomeReviews() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const [activeTab, setActiveTab] = useState('all');

  const filterTabs = [
    { id: 'all', labelEn: 'All Reviews (6)', labelEs: 'Todas las Reseñas (6)' },
    { id: 'architect', labelEn: 'Architects & Engineers', labelEs: 'Arquitectos & Ingenieros' },
    { id: 'contractor', labelEn: 'General Contractors', labelEs: 'Constructores & Contratistas' },
    { id: 'homeowner', labelEn: 'Private Homeowners', labelEs: 'Propietarios Residenciales' }
  ];

  const reviews = [
    {
      id: 1,
      category: 'architect',
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
      category: 'contractor',
      name: 'Marcus Vance',
      roleEn: 'General Contractor • Vance Luxury Estates',
      roleEs: 'Contratista General • Vance Luxury Estates',
      location: 'Austin, TX',
      projectEn: 'Lake Austin 180-ft Coastal Cable Railing System',
      projectEs: 'Sistema de Barandilla de Cable en Lake Austin',
      rating: 5,
      date: 'July 2026',
      textEn: 'We order all our railing posts and ADA handrails from their custom shop. The packaging in custom timber crates ensured not a single scratch on 180 feet of powder-coated steel. The crew installed in record time with zero callbacks.',
      textEs: 'Pedimos todos los postes y pasamanos ADA en su taller a medida. El empaque en cajas de madera reforzadas garantizó cero rayones en 180 pies de acero con recubrimiento en polvo. El equipo instaló todo en tiempo récord sin observaciones.',
    },
    {
      id: 3,
      category: 'architect',
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
      category: 'homeowner',
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
      category: 'contractor',
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
      category: 'architect',
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
    }
  ];

  const filteredReviews = activeTab === 'all'
    ? reviews
    : reviews.filter(r => r.category === activeTab);

  return (
    <section className="home-reviews-section" id="reviews">
      <div className="container">
        
        {/* Section Header */}
        <div className="home-reviews-header">
          <div className="reviews-eyebrow">
            <UserCheck size={14} className="icon-crimson" />
            <span>{isEs ? 'REPUTACIÓN VERIFICADA // RESEÑAS' : 'VERIFIED REPUTATION // REVIEWS'}</span>
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
                  ? 'Lee testimonios verificados de arquitectos colegiados, constructores de residencias de lujo y propietarios que confían en Station Metalworks para sus obras más exigentes.'
                  : 'Read genuine reviews from licensed architects, custom estate builders, and discerning homeowners who trust Station Metalworks for life-safety structural installations.'}
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
                  <span className="sc-lbl">{isEs ? 'Subcontratas' : 'Subcontractors'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="reviews-filter-tabs">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`review-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{isEs ? tab.labelEs : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="reviews-cards-grid">
          {filteredReviews.map(r => (
            <div key={r.id} className="review-card">
              {/* Top Row: Stars + Date + Verified Badge */}
              <div className="review-card-top">
                <div className="stars-row">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <span className="verified-badge">
                  <ShieldCheck size={13} className="text-emerald" />
                  {isEs ? 'Proyecto Verificado' : 'Verified Project'}
                </span>
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
                  {r.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="author-info">
                  <h4 className="author-name">{r.name}</h4>
                  <span className="author-role">{isEs ? r.roleEs : r.roleEn}</span>
                  <span className="author-loc">{r.location} • {r.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="reviews-bottom-banner">
          <div className="banner-text">
            <h4>{isEs ? '¿Quieres ver más referencias o hablar con nuestro equipo?' : 'Looking to inspect references or talk to our engineers?'}</h4>
            <p>{isEs ? 'Proporcionamos memorias de cálculo PE, muestras físicas de acabado y referencias de obra directa.' : 'We provide PE structural calculations, physical coating swatches, and direct client references.'}</p>
          </div>
          <div className="banner-actions">
            <a href="#/contact" className="btn-review-contact">
              <span>{isEs ? 'Contactar a Nuestro Equipo' : 'Connect with our Team'}</span>
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
        }

        .home-reviews-header {
          margin-bottom: 40px;
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
          max-width: 640px;
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

        /* Tabs */
        .reviews-filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .review-tab-btn {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary, #3b3e54);
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .review-tab-btn:hover {
          border-color: var(--color-accent, #e00027);
          color: var(--color-brand-dark, #020032);
        }

        .review-tab-btn.active {
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          border-color: var(--color-brand-dark, #020032);
          box-shadow: 0 4px 12px rgba(2, 0, 50, 0.15);
        }

        /* Reviews Grid */
        .reviews-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .review-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 6px 20px rgba(2, 0, 50, 0.03);
          transition: all 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 14px 32px rgba(2, 0, 50, 0.09);
        }

        .review-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: #10B981;
          background: rgba(16, 185, 129, 0.1);
          padding: 4px 9px;
          border-radius: 999px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .review-quote-text {
          font-size: 0.92rem;
          line-height: 1.65;
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
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.06);
          padding: 6px 10px;
          border-radius: 6px;
          border-left: 2px solid var(--color-accent, #e00027);
        }

        .review-author-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid var(--color-border);
          padding-top: 14px;
        }

        .author-avatar-initials {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-accent, #e00027);
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .author-role {
          font-size: 0.76rem;
          color: var(--color-text-secondary, #3b3e54);
          font-weight: 600;
        }

        .author-loc {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted, #7c829c);
        }

        /* Bottom Banner */
        .reviews-bottom-banner {
          margin-top: 48px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 30px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .banner-text h4 {
          font-size: 1.25rem;
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
          .reviews-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .reviews-cards-grid {
            grid-template-columns: 1fr;
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
