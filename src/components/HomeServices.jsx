import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, ShieldCheck, CheckCircle2, ChevronRight,
  Layers, Compass, Flame, Sliders, Sparkles
} from 'lucide-react';
import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import handrailsImg from '../assets/service_handrails.png';
import gatesImg from '../assets/service_gates.png';
import customImg from '../assets/service_custom.png';

export default function HomeServices() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const servicesData = [
    {
      id: 'stairs',
      titleEn: 'Architectural Staircases',
      titleEs: 'Sistemas de Escaleras de Autor',
      categoryEn: 'CANTILEVER & MONOSTRINGER',
      categoryEs: 'MONOVIGA & PELDAÑOS VOLADIZOS',
      descEn: 'Monolithic floating spines, spiral helicoidal runs, and commercial stairs engineered for zero deflection and IBC code compliance.',
      descEs: 'Vigas centrales flotantes, peldaños voladizos empotrados y escaleras monumentales calculadas para deflexión cero y código IBC.',
      specs: [
        { labelEn: 'Structural Alloy', labelEs: 'Aleación', val: 'A36 Carbon Steel' },
        { labelEn: 'Max Span', labelEs: 'Luz Máxima', val: '24 ft Free Span' },
        { labelEn: 'Code Standard', labelEs: 'Código', val: 'IBC Section 1607' }
      ],
      badgeEn: 'A36 High-Tensile Steel',
      badgeEs: 'Acero de Alta Resistencia',
      image: stairsImg,
      link: '#/services/stairs'
    },
    {
      id: 'railings',
      titleEn: 'Structural Railing Systems',
      titleEs: 'Sistemas de Barandillas',
      categoryEn: 'GLASS SHOE & MARINE CABLE',
      categoryEs: 'VIDRIO BASE-SHOE & CABLE MARINO',
      descEn: 'Architectural glass balustrades and horizontal marine cable railings engineered for 200 lb concentrated loads and coastal wind forces.',
      descEs: 'Barandillas de vidrio laminado embutido y tensores de cable marino 316, ensayados para cargas de 200 lb y vientos costeros.',
      specs: [
        { labelEn: 'Point Load', labelEs: 'Carga Puntual', val: '200 lb Certified' },
        { labelEn: 'Material', labelEs: 'Material', val: 'Marine 316 Stainless' },
        { labelEn: 'Weather Rating', labelEs: 'Clima', val: '2,000+ Hr Salt Spray' }
      ],
      badgeEn: '316 Marine Stainless',
      badgeEs: 'Acero Inox Marino 316',
      image: railingsImg,
      link: '#/services/railings'
    },
    {
      id: 'handrails',
      titleEn: 'Continuous ADA Handrails',
      titleEs: 'Pasamanos Ergonómicos ADA',
      categoryEn: 'ACCESSIBILITY & SAFETY',
      categoryEs: 'ACCESIBILIDAD & SEGURIDAD',
      descEn: 'Wall and floor mounted graspable handrails featuring smooth mandrel bends, radiused returns, and heavy-duty structural anchors.',
      descEs: 'Pasamanos continuos fijados a muro o piso bajo normativa de accesibilidad ADA, con curvas de mandril sin arrugas y anclajes reforzados.',
      specs: [
        { labelEn: 'Profile', labelEs: 'Perfil', val: '1.5" OD Continuous' },
        { labelEn: 'Anchor Rating', labelEs: 'Anclaje', val: '12,500 lb Tensile' },
        { labelEn: 'Standard', labelEs: 'Normativa', val: 'ADAAG Chapter 5' }
      ],
      badgeEn: 'ADA Chapter 5 Compliant',
      badgeEs: 'Normativa ADA Garantizada',
      image: handrailsImg,
      link: '#/services/handrails'
    },
    {
      id: 'gates',
      titleEn: 'Motorized Estate Gates',
      titleEs: 'Portones y Cercas de Seguridad',
      categoryEn: 'AUTOMATED ACCESS & PERIMETER',
      categoryEs: 'ACCESO AUTOMATIZADO & PERÍMETRO',
      descEn: 'Monumental pivot entries, cantilever sliding gates, and perimeter fencing with anti-sag internal skeletons and sealed pivot bearings.',
      descEs: 'Portones pivotantes monumentales, hojas corredizas automatizadas y cercados perimetrales con entramado antitorsión y cojinetes sellados.',
      specs: [
        { labelEn: 'Bearing Rating', labelEs: 'Capacidad Eje', val: '3,000 lb Static' },
        { labelEn: 'Lock Mechanism', labelEs: 'Cierre', val: 'Anti-Pry Tongue' },
        { labelEn: 'Drive System', labelEs: 'Motorización', val: 'UL 325 Automated' }
      ],
      badgeEn: 'UL 325 Automated Drive',
      badgeEs: 'Automatización Segura UL',
      image: gatesImg,
      link: '#/services/gates'
    },
    {
      id: 'custom',
      titleEn: 'Bespoke Metal Fabrication',
      titleEs: 'Fabricación Especial a Medida',
      categoryEn: 'ARCHITECTURAL FURNITURE & STRUCTURES',
      categoryEs: 'MOBILIARIO DE AUTOR & ESTRUCTURAS',
      descEn: 'Monolithic steel dining tables, architectural pergolas, and bespoke artistic features with flush-ground seamless welds.',
      descEs: 'Mesas de comedor monolíticas, bases para salas de juntas, pérgolas y proyectos especiales con cordones de soldadura pulidos a ras.',
      specs: [
        { labelEn: 'Welder Cert', labelEs: 'Certificación', val: 'AWS D1.1 Code' },
        { labelEn: 'Fabrication', labelEs: 'Producción', val: '100% In-House' },
        { labelEn: 'Finish', labelEs: 'Acabado', val: 'Baked Powder Coat' }
      ],
      badgeEn: 'AWS D1.1 Certified Welds',
      badgeEs: 'Soldadura Certificada AWS',
      image: customImg,
      link: '#/services/custom'
    }
  ];

  return (
    <section className="home-services-section" id="services-preview">
      <div className="container">
        
        {/* Section Header */}
        <div className="home-services-header">
          <div className="services-eyebrow">
            <Layers size={14} className="icon-crimson" />
            <span>{isEs ? 'DISCIPLINAS DE FABRICACIÓN // SERVICIOS' : 'FABRICATION DISCIPLINES // SERVICES'}</span>
          </div>
          <div className="header-flex-row">
            <div>
              <h2 className="services-main-title text-gradient">
                {isEs 
                  ? 'Soluciones Metálicas de Ingeniería para Cada Espacio' 
                  : 'Engineered Architectural Solutions for Every Space'}
              </h2>
              <p className="services-subtitle">
                {isEs 
                  ? 'Desde escaleras flotantes monoviga y barandillas de vidrio hasta portones automatizados y mobiliario exclusivo. Cada obra se diseña, calcula y forja a medida en nuestro taller.'
                  : 'From cantilevered floating staircases and glass guardrails to automated security gates and custom metal furniture. Every system is engineered to order in our facility.'}
              </p>
            </div>
            <a href="#/services" className="btn-view-all-services">
              <span>{isEs ? 'Ver Catálogo de Servicios' : 'View Full Services Hub'}</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Featured Services Grid */}
        <div className="services-cards-grid">
          {servicesData.map((svc, index) => {
            const isFeatured = index === 0;
            return (
              <div 
                key={svc.id} 
                className={`service-card ${isFeatured ? 'featured-card' : ''}`}
              >
                {/* Background Image Container with Overlay */}
                <div className="service-card-media">
                  <img src={svc.image} alt={svc.titleEn} className="service-media-img" />
                  <div className="service-media-overlay" />
                  <span className="service-card-badge">{isEs ? svc.badgeEs : svc.badgeEn}</span>
                </div>

                {/* Card Content Body */}
                <div className="service-card-body">
                  <div className="service-card-top">
                    <span className="service-card-category">
                      {isEs ? svc.categoryEs : svc.categoryEn}
                    </span>
                    <h3 className="service-card-title">
                      {isEs ? svc.titleEs : svc.titleEn}
                    </h3>
                    <p className="service-card-desc">
                      {isEs ? svc.descEs : svc.descEn}
                    </p>
                  </div>

                  {/* Micro-specs grid */}
                  <div className="service-specs-pill-grid">
                    {svc.specs.map((spec, i) => (
                      <div key={i} className="spec-pill-item">
                        <span className="spec-pill-lbl">{isEs ? spec.labelEs : spec.labelEn}:</span>
                        <span className="spec-pill-val">{spec.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="service-card-footer">
                    <a href={svc.link} className="service-action-link">
                      <span>{isEs ? 'Explorar Especificaciones' : 'Inspect Specifications'}</span>
                      <ChevronRight size={16} className="arrow-icon" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Assurance Bar */}
        <div className="services-trust-bar">
          <div className="trust-item">
            <ShieldCheck size={18} className="text-emerald" />
            <span>{isEs ? '100% Homologado con Códigos IBC & IRC' : '100% IBC & IRC Building Code Compliant'}</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <Flame size={18} className="text-crimson" />
            <span>{isEs ? 'Soldadores Homologados AWS D1.1 / D1.2' : 'AWS D1.1 Certified Structural Welders'}</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <Sparkles size={18} className="text-amber" />
            <span>{isEs ? 'Acabado Electrostático 2,000+ Horas Sal' : '2,000+ Hr Architectural Powder Coating'}</span>
          </div>
        </div>

      </div>

      {/* Scoped CSS */}
      <style>{`
        .home-services-section {
          padding: 85px 0 95px 0;
          background: #FFFFFF;
          position: relative;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .home-services-header {
          margin-bottom: 48px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .services-eyebrow {
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

        .header-flex-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .services-main-title {
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.2;
          color: var(--color-brand-dark, #020032);
          margin-bottom: 10px;
        }

        .services-subtitle {
          font-size: 1rem;
          color: var(--color-text-secondary, #3b3e54);
          max-width: 680px;
          line-height: 1.6;
          margin: 0;
        }

        .btn-view-all-services {
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
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(2, 0, 50, 0.15);
          white-space: nowrap;
        }

        .btn-view-all-services:hover {
          background: var(--color-accent, #e00027);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(224, 0, 39, 0.25);
        }

        /* Services Grid */
        .services-cards-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }

        /* Cards layout: Card 0 and 1 span 6 cols, cards 2, 3, 4 span 4 cols */
        .service-card:nth-child(1),
        .service-card:nth-child(2) {
          grid-column: span 6;
        }

        .service-card:nth-child(3),
        .service-card:nth-child(4),
        .service-card:nth-child(5) {
          grid-column: span 4;
        }

        .service-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 24px rgba(2, 0, 50, 0.04);
          position: relative;
        }

        .service-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 16px 36px rgba(2, 0, 50, 0.12);
        }

        .service-card-media {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #020032;
        }

        .service-card:nth-child(1) .service-card-media,
        .service-card:nth-child(2) .service-card-media {
          height: 280px;
        }

        .service-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .service-card:hover .service-media-img {
          transform: scale(1.07);
        }

        .service-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(2, 0, 50, 0.05) 0%, rgba(2, 0, 50, 0.5) 100%);
        }

        .service-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: #FFFFFF;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 5px 10px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .service-card-body {
          padding: 26px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .service-card-top {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .service-card-category {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.06em;
        }

        .service-card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          line-height: 1.3;
          margin: 0;
        }

        .service-card-desc {
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--color-text-secondary, #3b3e54);
          margin: 0;
        }

        /* Micro Specs */
        .service-specs-pill-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          background: #F8FAFC;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .spec-pill-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.76rem;
        }

        .spec-pill-lbl {
          font-family: monospace;
          color: var(--color-text-muted, #7c829c);
          font-weight: 600;
        }

        .spec-pill-val {
          font-family: monospace;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
        }

        .service-card-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid var(--color-border);
        }

        .service-action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .arrow-icon {
          color: var(--color-accent, #e00027);
          transition: transform 0.2s ease;
        }

        .service-card:hover .service-action-link {
          color: var(--color-accent, #e00027);
        }

        .service-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        /* Trust Bar */
        .services-trust-bar {
          margin-top: 48px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 18px 30px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .trust-divider {
          width: 1px;
          height: 24px;
          background: var(--color-border);
        }

        .text-emerald { color: #10B981; }
        .text-amber { color: #F59E0B; }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .services-cards-grid {
            grid-template-columns: 1fr;
          }
          .service-card:nth-child(1),
          .service-card:nth-child(2),
          .service-card:nth-child(3),
          .service-card:nth-child(4),
          .service-card:nth-child(5) {
            grid-column: span 1;
          }
          .service-card-media {
            height: 220px !important;
          }
          .trust-divider {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .services-main-title {
            font-size: 1.8rem;
          }
          .services-trust-bar {
            flex-direction: column;
            align-items: flex-start;
            padding: 18px 20px;
          }
        }
      `}</style>
    </section>
  );
}
