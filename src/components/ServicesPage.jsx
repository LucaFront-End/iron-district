import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ruler, Flame, Settings, ArrowRight, ShieldCheck, 
  Workflow, Layers, Sparkles, Hammer, Cpu, ChevronRight, PenTool
} from 'lucide-react';

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('stairs');
  const [activeStep, setActiveStep] = useState(0);

  // Categories database
  const categories = {
    stairs: {
      titleEn: 'Staircase Systems',
      titleEs: 'Sistemas de Escaleras',
      descEn: 'Architectural stairs engineered for structural weight loads and modern luxury.',
      descEs: 'Escaleras arquitectónicas calculadas para cargas estructurales y lujo moderno.',
      itemsEn: ['Floating Staircases (Cantilevered)', 'Straight Monostringer Stairs', 'Helicoidal & Spiral Stairs', 'Commercial Multi-Level Stairs', 'Exterior Anti-Slip Stairs'],
      itemsEs: ['Escaleras Flotantes (En Voladizo)', 'Escaleras Rectas con Mono-Viga', 'Escaleras Helicoidales y Caracol', 'Escaleras Comerciales Multiuso', 'Escaleras Exteriores Antideslizantes'],
      badgeEn: 'A36 Carbon Steel & Hardwoods',
      badgeEs: 'Acero A36 y Maderas Nobles',
      svg: (
        <svg viewBox="0 0 200 150" className="service-svg-graphic">
          <line x1="20" y1="130" x2="180" y2="130" stroke="var(--color-border)" strokeWidth="1" />
          <polygon points="40,130 60,130 140,50 120,50" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="0.5" />
          <g fill="#B0BEC5" stroke="#37474F" strokeWidth="0.5">
            <rect x="40" y="120" width="30" height="10" rx="1" />
            <rect x="65" y="100" width="30" height="10" rx="1" />
            <rect x="90" y="80" width="30" height="10" rx="1" />
            <rect x="115" y="60" width="30" height="10" rx="1" />
            <rect x="140" y="40" width="30" height="10" rx="1" />
          </g>
        </svg>
      )
    },
    railings: {
      titleEn: 'Railing Systems',
      titleEs: 'Sistemas de Barandales',
      descEn: 'Premium deck and balcony railings compliant with residential & commercial safety codes.',
      descEs: 'Barandales de balcones y terrazas que cumplen rigurosamente con códigos de edificación.',
      itemsEn: ['Marine-Grade Cable Railings', 'Tempered Safety Glass Railings', 'Modern Horizontal Slat Railings', 'Architectural Aluminum Systems', 'Structural Steel Guardrails'],
      itemsEs: ['Barandales de Cable Grado Marino', 'Barandales de Cristal Templado', 'Barandales de Listón Horizontal', 'Sistemas de Aluminio Arquitectónico', 'Guardarraíles Estructurales de Acero'],
      badgeEn: 'AISI 316 Stainless Steel',
      badgeEs: 'Acero Inoxidable AISI 316',
      svg: (
        <svg viewBox="0 0 200 150" className="service-svg-graphic">
          <line x1="20" y1="130" x2="180" y2="130" stroke="var(--color-border)" strokeWidth="1" />
          <rect x="50" y="40" width="4" height="90" fill="#E0E0E0" stroke="#333" strokeWidth="0.5" />
          <rect x="150" y="40" width="4" height="90" fill="#E0E0E0" stroke="#333" strokeWidth="0.5" />
          <line x1="30" y1="40" x2="170" y2="40" stroke="#E0E0E0" strokeWidth="5" strokeLinecap="round" />
          <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.6">
            <line x1="52" y1="55" x2="150" y2="55" />
            <line x1="52" y1="70" x2="150" y2="70" />
            <line x1="52" y1="85" x2="150" y2="85" />
            <line x1="52" y1="100" x2="150" y2="100" />
            <line x1="52" y1="115" x2="150" y2="115" />
          </g>
        </svg>
      )
    },
    handrails: {
      titleEn: 'ADA Handrails',
      titleEs: 'Pasamanos ADA',
      descEn: 'Wall and ground-mounted assistance rails conforming to commercial accessibility guidelines.',
      descEs: 'Pasamanos de asistencia para muros y pisos conformes a directivas ADA comerciales.',
      itemsEn: ['Wall-Mounted Grab Rails', 'Floor Post-Mounted Handrails', 'Stainless Steel Grab Rails', 'Wrought Iron Handrails', 'ADA Compliance Verification Plans'],
      itemsEs: ['Pasamanos Anclados a Muro', 'Pasamanos con Postes a Piso', 'Pasamanos de Acero Inoxidable', 'Pasamanos de Hierro Forjado', 'Diseños Certificados ADA'],
      badgeEn: '1.25" - 2" ADA Standard Grips',
      badgeEs: 'Grip Estándar ADA de 1.25" - 2"',
      svg: (
        <svg viewBox="0 0 200 150" className="service-svg-graphic">
          <circle cx="60" cy="90" r="5" fill="#333" />
          <path d="M 60,90 L 60,65 C 60,65 65,55 75,50" fill="none" stroke="#212121" strokeWidth="3" />
          <line x1="30" y1="45" x2="170" y2="45" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      )
    },
    gates: {
      titleEn: 'Gates & Fences',
      titleEs: 'Portones y Cercas',
      descEn: 'Heavy duty driveway gates and structural privacy perimeter fencing.',
      descEs: 'Portones de acceso pesados y cercas perimetrales estructurales de privacidad.',
      itemsEn: ['Sliding Driveway Gates', 'Decorative Swing Gates', 'Automatic Gate Opener Mounts', 'Privacy Aluminum Fences', 'Security Steel Enclosures'],
      itemsEs: ['Portones Deslizantes de Entrada', 'Portones Batientes Decorativos', 'Soportes para Motores Automáticos', 'Cercas de Privacidad de Aluminio', 'Cercados de Seguridad de Acero'],
      badgeEn: '6061 Structural Aluminum',
      badgeEs: 'Aluminio Estructural 6061',
      svg: (
        <svg viewBox="0 0 200 150" className="service-svg-graphic">
          <line x1="20" y1="130" x2="180" y2="130" stroke="var(--color-border)" strokeWidth="1" />
          <rect x="40" y="40" width="120" height="90" fill="none" stroke="#E0E0E0" strokeWidth="2.5" />
          <line x1="40" y1="40" x2="160" y2="130" stroke="#333" strokeWidth="1" />
          <line x1="160" y1="40" x2="40" y2="130" stroke="#333" strokeWidth="1" />
          <g stroke="var(--color-accent)" strokeWidth="0.75" opacity="0.6">
            <line x1="60" y1="40" x2="60" y2="130" />
            <line x1="80" y1="40" x2="80" y2="130" />
            <line x1="100" y1="40" x2="100" y2="130" />
            <line x1="120" y1="40" x2="120" y2="130" />
            <line x1="140" y1="40" x2="140" y2="130" />
          </g>
        </svg>
      )
    },
    specialty: {
      titleEn: 'Custom Fabrication',
      titleEs: 'Fabricación Especializada',
      descEn: 'Architectural metal designs tailored exactly to dimensions and blueprints.',
      descEs: 'Diseños metálicos a medida fabricados a partir de tus planos o renders.',
      itemsEn: ['Architectural Steel Balconies', 'Outdoor Custom Metal Pergolas', 'Heavy Duty Structural Supports', 'Precision MIG/TIG Custom Welding', 'Showroom Custom Metalwork'],
      itemsEs: ['Balcones de Acero Arquitectónicos', 'Pérgolas de Metal a Medida', 'Soportes Estructurales Pesados', 'Soldadura de Precisión MIG/TIG', 'Diseños Artísticos en Metal'],
      badgeEn: 'Tailored Blueprint Welding',
      badgeEs: 'Soldadura Estructural Bajo Plano',
      svg: (
        <svg viewBox="0 0 200 150" className="service-svg-graphic">
          <circle cx="100" cy="75" r="30" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="70" y="45" width="60" height="60" fill="none" stroke="#ECEFF1" strokeWidth="1" />
          <polygon points="100,20 150,110 50,110" fill="none" stroke="#E0E0E0" strokeWidth="1" />
        </svg>
      )
    }
  };

  // Stepper steps database
  const steps = [
    {
      titleEn: '1. Blueprint Upload',
      titleEs: '1. Medidas y Planos',
      descEn: 'Submit your structural sketches, linear feet measurements, or custom inspiration photos directly to our engineers.',
      descEs: 'Envíanos tus bocetos, dimensiones lineales o fotografías de inspiración directamente a nuestro equipo técnico.'
    },
    {
      titleEn: '2. 3D CAD Design Approval',
      titleEs: '2. Diseño y Render 3D',
      descEn: 'Our design office builds a precise 3D model and layout schematic. We review parameters and safety codes together.',
      descEs: 'Nuestros diseñadores crean un plano técnico y render 3D. Evaluamos juntos la disposición y las normativas de seguridad.'
    },
    {
      titleEn: '3. Precision Production',
      titleEs: '3. Fabricación a Medida',
      descEn: 'We cut components using fiber optic lasers and hand-weld assemblies under structural AWS code standards in Los Angeles.',
      descEs: 'Cortamos las piezas mediante láser de fibra óptica y soldamos a mano bajo estándares estructurales AWS en Los Ángeles.'
    },
    {
      titleEn: '4. Delivery & Staging',
      titleEs: '4. Envío o Instalación',
      descEn: 'Finished parts are carefully boxed and shipped nationwide in robust crates, complete with blueprints for staging.',
      descEs: 'Embalamos las piezas y las enviamos a todo el país, incluyendo guías paso a paso para la instalación en obra.'
    }
  ];

  return (
    <div className="services-page-wrapper">
      <div className="blueprint-grid"></div>

      <header className="services-header container">
        <span className="services-badge">
          <Workflow size={12} className="pulse-glow" style={{ marginRight: '6px' }} />
          {language === 'en' ? 'OUR CAPABILITIES' : 'NUESTRAS CAPACIDADES'}
        </span>
        <h1 className="text-gradient">{t('services.title')}</h1>
        <p className="services-subtitle">{t('services.subtitle')}</p>
      </header>

      {/* SECTION 1: Service Switcher Grid */}
      <section className="services-selection container">
        <div className="services-layout-grid">
          
          {/* Left panel: category pills */}
          <div className="services-tabs-menu glass-panel">
            {Object.keys(categories).map((key) => {
              const cat = categories[key];
              const title = language === 'en' ? cat.titleEn : cat.titleEs;
              return (
                <button
                  key={key}
                  className={`service-tab-pill-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <ChevronRight size={12} className="bullet-arrow" />
                  <span>{title}</span>
                </button>
              );
            })}
          </div>

          {/* Right panel: Active category specs */}
          <div className="services-detail-board glass-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="service-detail-view"
              >
                <div className="service-details-content">
                  <span className="category-meta-tag">{categories[activeCategory].badgeEn.toUpperCase()}</span>
                  <h2>{language === 'en' ? categories[activeCategory].titleEn : categories[activeCategory].titleEs}</h2>
                  <p>{language === 'en' ? categories[activeCategory].descEn : categories[activeCategory].descEs}</p>

                  <div className="sub-items-checklist">
                    <h3>{language === 'en' ? 'CORE SERVICES INCLUDED' : 'SERVICIOS PRINCIPALES'}</h3>
                    <ul>
                      {(language === 'en' ? categories[activeCategory].itemsEn : categories[activeCategory].itemsEs).map((item, idx) => (
                        <li key={idx}>
                          <ShieldCheck size={14} className="check-icon text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-landing-link-wrapper" style={{ marginTop: '24px' }}>
                    <a 
                      href={`#/services/${activeCategory}`}
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '10px 18px' }}
                    >
                      <span>{t('services.viewDetails')}</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="service-details-graphic">
                  {categories[activeCategory].svg}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 2: Process Stepper */}
      <section className="fabrication-stepper-section container">
        <div className="section-header">
          <span className="tag-label">{language === 'en' ? '4-STEP METALS WORKFLOW' : 'PROCESO EN 4 PASOS'}</span>
          <h2>{t('services.processTitle')}</h2>
          <p>{language === 'en' ? 'How we transform raw engineering dimensions into fully staged architectural steel masterpieces.' : 'Cómo transformamos planos o dimensiones iniciales en piezas metálicas estructurales listas para instalar.'}</p>
        </div>

        <div className="stepper-interactive-grid">
          {/* Stepper progress selector indicator bar */}
          <div className="stepper-dots-bar glass-panel">
            {steps.map((step, idx) => (
              <button 
                key={idx}
                className={`step-selector-dot-btn ${activeStep === idx ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <span className="dot-number">{idx + 1}</span>
                <span className="dot-label">{language === 'en' ? step.titleEn.split('. ')[1] : step.titleEs.split('. ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Detailed step card display */}
          <div className="active-step-details-card glass-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="step-detail-card-layout"
              >
                <div className="step-number-heavy-badge">{activeStep + 1}</div>
                <div className="step-text-details">
                  <h3>{language === 'en' ? steps[activeStep].titleEn : steps[activeStep].titleEs}</h3>
                  <p>{language === 'en' ? steps[activeStep].descEn : steps[activeStep].descEs}</p>
                </div>
                
                <div className="step-graphic-panel">
                  {activeStep === 0 && <Ruler size={36} className="text-accent step-svg-glow" />}
                  {activeStep === 1 && <PenTool size={36} className="text-accent step-svg-glow" />}
                  {activeStep === 2 && <Flame size={36} className="text-accent step-svg-glow" />}
                  {activeStep === 3 && <Settings size={36} className="text-accent step-svg-glow" />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 3: Materials & Capability Standards */}
      <section className="metals-capability-matrix-section container">
        <div className="section-header">
          <span className="tag-label">{language === 'en' ? 'ENGINEERING STANDARDS' : 'ESTÁNDARES DE INGENIERÍA'}</span>
          <h2>{t('services.specsMatrix')}</h2>
          <p>{language === 'en' ? 'We operate with strict structural tolerances and metal treatments to meet commercial building codes.' : 'Trabajamos con rigurosas tolerancias estructurales y tratamientos de metal para cumplir códigos comerciales.'}</p>
        </div>

        <div className="capabilities-matrix-grid">
          <div className="capability-card glass-panel">
            <Layers size={20} className="text-accent" />
            <h3>{t('services.tolerance')}</h3>
            <p>{language === 'en' ? 'All CNC laser cutting cuts are executed to ±0.1mm tolerance. Mechanical parts fit with absolute precision.' : 'Los cortes láser CNC se ejecutan a una tolerancia de ±0.1mm. Encaje mecánico perfecto en obra.'}</p>
          </div>

          <div className="capability-card glass-panel">
            <Hammer size={20} className="text-accent" />
            <h3>{t('services.weldingCert')}</h3>
            <p>{language === 'en' ? 'All shop welding complies with AWS D1.1 (Steel) and D1.2 (Aluminum) structural code specifications.' : 'Toda soldadura cumple con el código AWS D1.1 (Acero) y AWS D1.2 (Aluminio) para resistencia estructural.'}</p>
          </div>

          <div className="capability-card glass-panel">
            <ShieldCheck size={20} className="text-accent" />
            <h3>{t('services.loadTolerance')}</h3>
            <p>{language === 'en' ? 'Cantilever treads are tested to withstand concentrated loads exceeding 1000 lbs, bypassing L/360 rules.' : 'Peldaños en voladizo certificados para soportar cargas concentradas mayores a 1000 lbs (excediendo L/360).'}</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Custom Project CTA */}
      <section className="services-action-cta container">
        <div className="services-cta-panel glass-panel">
          <div className="cta-content">
            <Sparkles size={24} className="text-accent pulse-glow" />
            <h2>{t('services.ctaTitle')}</h2>
            <p>{t('services.ctaDesc')}</p>
          </div>
          <a href="#quote" className="btn btn-primary cta-btn-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>{t('services.ctaBtn')}</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <style>{`
        .services-page-wrapper {
          padding-top: 110px;
          padding-bottom: 80px;
          position: relative;
        }

        .services-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
          text-align: center;
          align-items: center;
        }

        .services-badge {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-accent);
          background: rgba(255, 90, 9, 0.08);
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .services-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .services-subtitle {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        /* Layout switcher grid */
        .services-layout-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 30px;
        }

        .services-tabs-menu {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .service-tab-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--color-text-secondary);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.8rem;
          text-align: left;
          cursor: pointer;
          border-radius: 6px;
          transition: var(--transition-fast);
        }

        .service-tab-pill-btn:hover {
          color: var(--color-text-primary);
          background: var(--color-surface-elevated);
        }

        .service-tab-pill-btn.active {
          background-color: var(--color-text-primary);
          color: var(--color-bg);
          border-color: var(--color-text-primary);
        }

        .service-tab-pill-btn.active .bullet-arrow {
          color: var(--color-accent);
          transform: translateX(2px);
        }

        .bullet-arrow {
          color: var(--color-text-muted);
          transition: transform 0.2s ease;
        }

        /* Active Detail Board */
        .services-detail-board {
          padding: 30px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .service-detail-view {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: center;
        }

        .category-meta-tag {
          font-family: monospace;
          font-size: 0.58rem;
          color: var(--color-accent);
          background: rgba(255, 90, 9, 0.08);
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 700;
          margin-bottom: 12px;
          display: inline-block;
        }

        .service-details-content h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .service-details-content p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .sub-items-checklist h3 {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .sub-items-checklist ul {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sub-items-checklist li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .check-icon {
          color: var(--color-accent);
        }

        .service-details-graphic {
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 20px;
          height: 180px;
        }

        .service-svg-graphic {
          max-height: 100%;
        }

        /* Stepper interactive section */
        .stepper-interactive-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 30px;
          align-items: stretch;
          margin-top: 40px;
        }

        .stepper-dots-bar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px 16px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .step-selector-dot-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: var(--color-text-muted);
          text-align: left;
          transition: var(--transition-fast);
        }

        .step-selector-dot-btn:hover {
          color: var(--color-text-primary);
        }

        .dot-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-weight: 700;
          font-size: 0.72rem;
          transition: var(--transition-fast);
        }

        .dot-label {
          font-size: 0.78rem;
          font-weight: 600;
        }

        .step-selector-dot-btn.active {
          color: var(--color-text-primary);
        }

        .step-selector-dot-btn.active .dot-number {
          background: var(--color-accent);
          color: #FFF;
          border-color: var(--color-accent);
          box-shadow: 0 0 10px rgba(255, 90, 9, 0.3);
        }

        /* Step details card */
        .active-step-details-card {
          padding: 30px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          position: relative;
        }

        .step-detail-card-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 30px;
        }

        .step-number-heavy-badge {
          font-family: monospace;
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255, 90, 9, 0.08);
          position: absolute;
          left: 20px;
          top: 10px;
        }

        .step-text-details {
          max-width: 460px;
          z-index: 2;
        }

        .step-text-details h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step-text-details p {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .step-graphic-panel {
          padding: 24px;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 12px rgba(255, 90, 9, 0.02);
        }

        .step-svg-glow {
          filter: drop-shadow(0 0 6px rgba(255, 90, 9, 0.15));
        }

        /* Capability Matrix */
        .capabilities-matrix-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 40px;
        }

        .capability-card {
          padding: 24px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .capability-card h3 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .capability-card p {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* CTA Panel */
        .services-action-cta {
          margin-top: 40px;
        }

        .services-cta-panel {
          padding: 30px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .cta-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cta-content h2 {
          font-size: 1.3rem;
          font-weight: 800;
        }

        .cta-content p {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .cta-btn-link {
          padding: 12px 24px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
        }

        @media (max-width: 992px) {
          .services-layout-grid, .service-detail-view, .stepper-interactive-grid, .step-detail-card-layout, .capabilities-matrix-grid, .services-cta-panel {
            grid-template-columns: 1fr;
          }
          .services-tabs-menu, .stepper-dots-bar {
            flex-direction: row;
            overflow-x: auto;
          }
          .services-cta-panel {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
