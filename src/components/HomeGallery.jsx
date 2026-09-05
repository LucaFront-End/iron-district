import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Eye, ArrowRight, X, ShieldCheck, MapPin, 
  Calendar, Layers, Filter, CheckCircle2, Sliders, Sparkles
} from 'lucide-react';
import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import handrailsImg from '../assets/service_handrails.png';
import gatesImg from '../assets/service_gates.png';
import customImg from '../assets/service_custom.png';
import installImage from '../assets/railing_install.png';

export default function HomeGallery() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filterTabs = [
    { id: 'all', labelEn: 'All Projects', labelEs: 'Todos los Proyectos' },
    { id: 'stairs', labelEn: 'Staircases', labelEs: 'Escaleras' },
    { id: 'railings', labelEn: 'Railings & Balustrades', labelEs: 'Barandillas' },
    { id: 'gates', labelEn: 'Estate Gates', labelEs: 'Portones' },
    { id: 'custom', labelEn: 'Custom & Tables', labelEs: 'Especiales & Mesas' }
  ];

  const projects = [
    {
      id: 'p1',
      category: 'stairs',
      titleEn: 'Bel Air Cantilevered Mono-Stringer Staircase',
      titleEs: 'Escalera Monoviga Voladiza en Bel Air',
      location: 'Bel Air, California',
      alloyEn: 'A36 Structural Steel & White Oak',
      alloyEs: 'Acero Estructural A36 y Roble Blanco',
      finishEn: 'Tiger Drylac Architectural Matte Black',
      finishEs: 'Tiger Drylac Negro Mate Arquitectónico',
      standard: 'IBC §1607.8 / ASTM E985',
      descEn: 'A 24-foot continuous structural steel spine concealed inside wall framing, holding 500-lb rated cantilever floating oak boxed treads with integrated LED under-glow.',
      descEs: 'Viga estructural de 24 pies anclada a losa y muro, soportando peldaños voladizos de roble macizo con resistencia certificada de 500 lb por peldaño y luz LED oculta.',
      image: stairsImg,
      year: '2026'
    },
    {
      id: 'p2',
      category: 'railings',
      titleEn: 'Biscayne Bay Oceanfront Cable Balustrade',
      titleEs: 'Barandilla de Cable Marino en Biscayne Bay',
      location: 'Miami, Florida',
      alloyEn: 'AISI 316 Marine Stainless Steel',
      alloyEs: 'Acero Inoxidable Marino AISI 316',
      finishEn: 'Electro-Polished & Tiger TGIC Coating',
      finishEs: 'Electropulido y Tiger TGIC Anti-Corrosión',
      standard: 'ASTM A580 / Miami-Dade 140mph Wind',
      descEn: '180 linear feet of continuous perimeter balcony cable guardrail engineered to endure aggressive ocean salt spray and Category 4 hurricane gust turbulence.',
      descEs: '180 pies lineales de barandilla con tensores hidráulicos ocultos en postes de esquina, certificada para soportar vientos de huracán de 140 mph frente al mar.',
      image: railingsImg,
      year: '2026'
    },
    {
      id: 'p3',
      category: 'gates',
      titleEn: 'Beverly Hills Automated Pivot Estate Gate',
      titleEs: 'Portón Pivotante Automatizado en Beverly Hills',
      location: 'Beverly Hills, California',
      alloyEn: '6061-T6 Aircraft Billet Aluminum',
      alloyEs: 'Aluminio Billet Estructural 6061-T6',
      finishEn: 'Anodic Dark Bronze Metallic Powder',
      finishEs: 'Polvo Metálico Bronce Anódico Oscuro',
      standard: 'UL 325 / ASTM F2200 Gate Safety',
      descEn: 'Motorized dual-leaf pivot gate featuring CNC laser-slotted louvers, concealed hydraulic ground pivot operators, and integrated warm IP68 landscape illumination.',
      descEs: 'Portón pivotante motorizado con lamas ranuradas láser para privacidad total, bisagras con cojinetes sellados de 3,000 lb y tiras LED rasantes IP68.',
      image: gatesImg,
      year: '2025'
    },
    {
      id: 'p4',
      category: 'railings',
      titleEn: 'Aspen Alpine Continuous Ergonomic Handrail',
      titleEs: 'Pasamanos Ergonómico Continuo en Aspen Estate',
      location: 'Aspen, Colorado',
      alloyEn: 'Heavy-Wall 316 Stainless Steel Tubing',
      alloyEs: 'Tubo de Inox 316 de Alto Espesor',
      finishEn: '#4 Directional Satin Architectural Polish',
      finishEs: 'Pulido Satinado Grano #4 Anti-Huellas',
      standard: 'ADAAG Chapter 5 / IBC 1014',
      descEn: 'Smooth continuous 1.5-inch OD graspable handrail traversing a 3-flight luxury alpine mountain staircase with zero visible welds or seam lines.',
      descEs: 'Pasamanos continuo de 1.5" de diámetro con curvado milimétrico por mandril, uniones empotradas invisibles y anclajes químicos a prueba de sismos.',
      image: handrailsImg,
      year: '2026'
    },
    {
      id: 'p5',
      category: 'custom',
      titleEn: 'Austin Executive Penthouse Steel Dining Table',
      titleEs: 'Mesa Monumental de Comedor en Acero y Cristal',
      location: 'Austin, Texas',
      alloyEn: '1/2" Solid Structural Steel Plate',
      alloyEs: 'Placa Maciza de Acero A36 de 1/2"',
      finishEn: 'Gunmetal Hand-Rubbed Patina & Clear Matte',
      finishEs: 'Pátina Artesanal Grafito y Sellador Mate',
      standard: 'AWS D1.1 Full Penetration Flush Grind',
      descEn: 'A sculptural 14-foot monolithic dining conference table with internal anti-torsion trussing and flush-ground invisible TIG joints holding 900 lbs of smoked glass.',
      descEs: 'Mesa de autor de 14 pies con estructura interna antitorsión y uniones TIG pulidas a ras, diseñada como pieza escultórica central para un ático corporativo.',
      image: customImg,
      year: '2026'
    },
    {
      id: 'p6',
      category: 'railings',
      titleEn: 'Malibu Coastal Deck Railing & On-Site Assembly',
      titleEs: 'Barandilla Base-Shoe en Terraza Costera de Malibú',
      location: 'Malibu, California',
      alloyEn: 'Extruded Structural Aluminum & SentryGlas',
      alloyEs: 'Aluminio Extruido Base-Shoe y SentryGlas',
      finishEn: 'Anodized 25-Micron Architectural Clear',
      finishEs: 'Anodizado Arquitectónico de 25 Micras',
      standard: 'IBC 2407 Glass Guardrail Protocol',
      descEn: 'Precision on-site install of dry-glazed structural glass shoes embedded directly into timber floor joists, offering unobstructed Pacific Ocean horizon views.',
      descEs: 'Instalación profesional de canal base-shoe embutido con vidrio laminado templado de 1/2", proporcionando vista panorámica pura y protección anticaídas.',
      image: installImage,
      year: '2025'
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section className="home-gallery-section" id="portfolio">
      <div className="container">
        
        {/* Gallery Header */}
        <div className="home-gallery-header">
          <div className="gallery-eyebrow">
            <Sparkles size={14} className="icon-crimson" />
            <span>{isEs ? 'PORTAFOLIO DE OBRAS // NUESTRO TRABAJO' : 'PORTFOLIO // OUR WORK'}</span>
          </div>
          <div className="gallery-header-row">
            <div>
              <h2 className="gallery-title text-gradient">
                {isEs 
                  ? 'Nuestro Trabajo: Obras Arquitectónicas Reales' 
                  : 'Our Work: Heirloom Architectural Installations'}
              </h2>
              <p className="gallery-subtitle">
                {isEs
                  ? 'Explora proyectos residenciales y comerciales de alta exigencia fabricados e instalados con precisión milimétrica en todo el país.'
                  : 'Explore real-world high-end residential and commercial installations engineered and fabricated with uncompromising precision across the nation.'}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="gallery-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`gallery-filter-btn ${activeFilter === tab.id ? 'active' : ''}`}
                >
                  <span>{isEs ? tab.labelEs : tab.labelEn}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="gallery-projects-grid">
          {filteredProjects.map((proj) => (
            <div 
              key={proj.id} 
              className="gallery-project-card"
              onClick={() => setSelectedProject(proj)}
            >
              {/* Image with zoom on hover */}
              <div className="project-image-box">
                <img src={proj.image} alt={proj.titleEn} className="project-card-img" />
                <div className="project-card-overlay">
                  <div className="inspect-btn-glow">
                    <Eye size={18} />
                    <span>{isEs ? 'Inspeccionar Proyecto' : 'Inspect Project'}</span>
                  </div>
                </div>
                <div className="project-top-badges">
                  <span className="project-loc-badge">
                    <MapPin size={11} />
                    {proj.location}
                  </span>
                  <span className="project-year-badge">{proj.year}</span>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="project-card-info">
                <span className="project-standard-tag">{proj.standard}</span>
                <h3 className="project-title">{isEs ? proj.titleEs : proj.titleEn}</h3>
                <p className="project-alloy-line">
                  <strong>{isEs ? 'Material:' : 'Alloy:'}</strong> {isEs ? proj.alloyEs : proj.alloyEn}
                </p>
                <div className="project-cta-line">
                  <span>{isEs ? 'Ver Detalles Técnicos' : 'View Engineering Specs'}</span>
                  <ArrowRight size={14} className="proj-arrow" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner to RFQ */}
        <div className="gallery-bottom-cta">
          <div className="cta-left">
            <h4>{isEs ? '¿Tienes un plano arquitectónico o proyecto a medida?' : 'Have an Architectural Blueprint or Custom Project?'}</h4>
            <p>
              {isEs 
                ? 'Envíanos tus medidas, renders o modelos Revit para recibir una revisión de ingeniería y cotización formal en 24-48 horas.'
                : 'Send us your drawings, CAD files, or sketches for an engineering review and guaranteed estimate within 24-48 hours.'}
            </p>
          </div>
          <div className="cta-right">
            <a href="#/contact#rfq-studio" className="btn-gallery-rfq">
              <span>{isEs ? 'Solicitar Cotización RFQ' : 'Submit Plans for RFQ'}</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

      </div>

      {/* LIGHTBOX MODAL INSPECTOR */}
      {selectedProject && (
        <div className="gallery-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="gallery-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedProject(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="modal-content-layout">
              <div className="modal-media-pane">
                <img src={selectedProject.image} alt={selectedProject.titleEn} className="modal-hero-img" />
                <div className="modal-media-caption">
                  <MapPin size={14} />
                  <span>{selectedProject.location} • {selectedProject.year}</span>
                </div>
              </div>

              <div className="modal-details-pane">
                <div className="modal-detail-head">
                  <span className="modal-standard-chip">{selectedProject.standard}</span>
                  <h3 className="modal-title">{isEs ? selectedProject.titleEs : selectedProject.titleEn}</h3>
                  <p className="modal-desc">{isEs ? selectedProject.descEs : selectedProject.descEn}</p>
                </div>

                <div className="modal-specs-table">
                  <div className="spec-row">
                    <span className="spec-k">{isEs ? 'Ubicación de Obra' : 'Installation Site'}</span>
                    <span className="spec-v">{selectedProject.location}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-k">{isEs ? 'Aleación Base' : 'Base Material'}</span>
                    <span className="spec-v">{isEs ? selectedProject.alloyEs : selectedProject.alloyEn}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-k">{isEs ? 'Acabado Superficial' : 'Protective Finish'}</span>
                    <span className="spec-v">{isEs ? selectedProject.finishEs : selectedProject.finishEn}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-k">{isEs ? 'Protocolo Estructural' : 'Structural Standard'}</span>
                    <span className="spec-v text-crimson">{selectedProject.standard}</span>
                  </div>
                </div>

                <div className="modal-quality-tags">
                  <div className="tag-check">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>{isEs ? 'Pre-ensamblado 100% en seco antes de despacho' : '100% shop dry-fit tested before shipping'}</span>
                  </div>
                  <div className="tag-check">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>{isEs ? 'Soldadores certificados AWS D1.1' : 'Welded by AWS D1.1 certified artisans'}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <a href="#/contact" className="btn-modal-inquire" onClick={() => setSelectedProject(null)}>
                    <span>{isEs ? 'Cotizar Proyecto Similar' : 'Request Similar Project'}</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS */}
      <style>{`
        .home-gallery-section {
          padding: 85px 0 95px 0;
          background: #F8FAFC;
          position: relative;
        }

        .home-gallery-header {
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .gallery-eyebrow {
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

        .gallery-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .gallery-title {
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.2;
          color: var(--color-brand-dark, #020032);
          margin-bottom: 8px;
        }

        .gallery-subtitle {
          font-size: 1rem;
          color: var(--color-text-secondary, #3b3e54);
          max-width: 620px;
          line-height: 1.6;
          margin: 0;
        }

        /* Filter Tabs */
        .gallery-filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .gallery-filter-btn {
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

        .gallery-filter-btn:hover {
          border-color: var(--color-accent, #e00027);
          color: var(--color-brand-dark, #020032);
        }

        .gallery-filter-btn.active {
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          border-color: var(--color-brand-dark, #020032);
          box-shadow: 0 4px 12px rgba(2, 0, 50, 0.15);
        }

        /* Projects Grid */
        .gallery-projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .gallery-project-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 20px rgba(2, 0, 50, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-project-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 16px 36px rgba(2, 0, 50, 0.12);
        }

        .project-image-box {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #020032;
        }

        .project-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-project-card:hover .project-card-img {
          transform: scale(1.08);
        }

        .project-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(2, 0, 50, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .gallery-project-card:hover .project-card-overlay {
          opacity: 1;
        }

        .inspect-btn-glow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 800;
          padding: 10px 18px;
          border-radius: 999px;
          box-shadow: 0 0 20px rgba(224, 0, 39, 0.6);
          transform: translateY(10px);
          transition: transform 0.25s ease;
        }

        .gallery-project-card:hover .inspect-btn-glow {
          transform: translateY(0);
        }

        .project-top-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }

        .project-loc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(6px);
          padding: 4px 9px;
          border-radius: 6px;
        }

        .project-year-badge {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: #F87171;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(6px);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .project-card-info {
          padding: 24px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .project-standard-tag {
          font-family: monospace;
          font-size: 0.66rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.05em;
        }

        .project-title {
          font-size: 1.12rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          line-height: 1.35;
          margin: 0;
        }

        .project-alloy-line {
          font-size: 0.82rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.4;
          margin: 0;
        }

        .project-cta-line {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          transition: color 0.2s;
        }

        .proj-arrow {
          color: var(--color-accent, #e00027);
          transition: transform 0.2s ease;
        }

        .gallery-project-card:hover .project-cta-line {
          color: var(--color-accent, #e00027);
        }

        .gallery-project-card:hover .proj-arrow {
          transform: translateX(4px);
        }

        /* Bottom RFQ Strip */
        .gallery-bottom-cta {
          margin-top: 50px;
          background: linear-gradient(135deg, #020032 0%, #080544 100%);
          border: 1px solid rgba(224, 0, 39, 0.3);
          border-radius: 18px;
          padding: 36px 44px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          box-shadow: 0 12px 32px rgba(2, 0, 50, 0.15);
        }

        .cta-left h4 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px 0;
        }

        .cta-left p {
          font-size: 0.92rem;
          color: #CBD5E1;
          margin: 0;
          max-width: 600px;
          line-height: 1.5;
        }

        .btn-gallery-rfq {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px rgba(224, 0, 39, 0.4);
          white-space: nowrap;
        }

        .btn-gallery-rfq:hover {
          background: #c20022;
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(224, 0, 39, 0.55);
        }

        /* MODAL DIALOG */
        .gallery-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.75);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .gallery-modal-dialog {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 960px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.06);
          border: none;
          color: var(--color-brand-dark, #020032);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: var(--color-accent, #e00027);
          color: #FFF;
        }

        .modal-content-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .modal-media-pane {
          position: relative;
          background: #020032;
        }

        .modal-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          min-height: 380px;
        }

        .modal-media-caption {
          position: absolute;
          bottom: 16px;
          left: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.74rem;
          color: #FFF;
          background: rgba(2, 0, 50, 0.85);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .modal-details-pane {
          padding: 38px 34px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-standard-chip {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .modal-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 8px 0 10px 0;
          line-height: 1.3;
        }

        .modal-desc {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-text-secondary, #3b3e54);
          margin: 0;
        }

        .modal-specs-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #F8FAFC;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
          padding-bottom: 6px;
        }

        .spec-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .spec-k {
          font-family: monospace;
          color: var(--color-text-muted, #7c829c);
          font-weight: 600;
        }

        .spec-v {
          font-family: monospace;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          text-align: right;
        }

        .modal-quality-tags {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tag-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-brand-dark, #020032);
        }

        .btn-modal-inquire {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--color-accent, #e00027);
          color: #FFF;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.92rem;
          text-decoration: none;
          transition: all 0.2s;
          width: 100%;
        }

        .btn-modal-inquire:hover {
          background: #c20022;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .gallery-projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .modal-content-layout {
            grid-template-columns: 1fr;
          }
          .modal-hero-img {
            min-height: 260px;
          }
        }

        @media (max-width: 640px) {
          .gallery-projects-grid {
            grid-template-columns: 1fr;
          }
          .gallery-title {
            font-size: 1.8rem;
          }
          .gallery-bottom-cta {
            padding: 26px 20px;
          }
          .modal-details-pane {
            padding: 24px 20px;
          }
        }
      `}</style>
    </section>
  );
}
