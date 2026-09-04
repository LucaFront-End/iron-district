import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Cpu, Award, Hammer, PenTool, 
  Layers, Activity, CheckCircle2, ArrowRight, Zap, 
  Flame, RefreshCw, Users, MapPin, Calendar, Clock
} from 'lucide-react';
import installImage from '../assets/railing_install.png';

export default function AboutPage() {
  const { language } = useLanguage();
  const [activeMachine, setActiveMachine] = useState('laser');

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
      nameEn: '40ft Automated Gema Electrostatic Coating Bay',
      nameEs: 'Línea Automatizada de Pintura en Polvo 40ft Gema',
      category: 'SURFACE ARMOR',
      tolerance: '3.0 - 5.0 Mils Dry Film Thickness',
      speed: 'Conveyorized 400°F Curing',
      capacity: '2,000+ Hours Salt Spray Pass (ASTM B117)',
      descEn: 'Multi-stage iron phosphate pre-wash followed by automated electrostatic powder gun arrays. Cured at 400°F for extreme chemical, UV, and salt-air corrosion resistance.',
      descEs: 'Lavado químico de fosfatizado en caliente y pistolas electrostáticas automatizadas. Horneado a 400°F para máxima resistencia a rayos UV, intemperie y salinidad marina.',
      metrics: [
        { labelEn: 'Salt Spray Life', labelEs: 'Ensayo Niebla Salina', val: '2,000+ Hours' },
        { labelEn: 'Bake Temp', labelEs: 'Temp. Horneado', val: '400°F (204°C)' },
        { labelEn: 'Max Piece Length', labelEs: 'Largo Máximo', val: '38 Feet' }
      ]
    }
  };

  const selectedMachineData = machines[activeMachine];

  // Team profiles
  const teamMembers = [
    {
      name: 'Marco Vance, PE',
      roleEn: 'Principal Structural Engineer',
      roleEs: 'Ingeniero Estructural Principal',
      credentials: 'MS Structural Eng. Stanford • PE License #C84920',
      bioEn: 'Over 18 years calculating cantilever moments, seismic drift, and IBC compliance for high-end modern residential and civic metal projects.',
      bioEs: 'Más de 18 años calculando momentos flectores, deflexiones sísmicas y códigos IBC para residencias de lujo y obras cívicas.',
      badge: 'PE Stamped Drawings'
    },
    {
      name: 'Elena Rostova',
      roleEn: 'Master Artisan & Lead Welder',
      roleEs: 'Maestra Artesana y Jefa de Soldadura',
      credentials: 'AWS D1.1 Certified Master • 15 Yrs Guild Experience',
      bioEn: 'Pioneered Station Metalworks signature stacked-dimes TIG finish. Trained in traditional European forging and contemporary aerospace alloys.',
      bioEs: 'Creadora del sello de soldadura TIG de moneda escamada de la empresa. Formada en forja tradicional europea y aleaciones aeroespaciales.',
      badge: 'Master Guild'
    },
    {
      name: 'David Chen',
      roleEn: 'Director of CNC & Automation',
      roleEs: 'Director de CNC y Automatización',
      credentials: 'BS Mechatronics • 12 Yrs Multi-Axis Robotics',
      bioEn: 'Oversees 5-axis fiber laser cutting parameters, nested CAM plate yields, and sub-millimeter tooling tolerances across our workshop floor.',
      bioEs: 'Supervisa los parámetros de corte láser, optimización de aprovechamiento de chapa y tolerancias milimétricas en el taller.',
      badge: 'CAM Optimizer'
    },
    {
      name: 'Carlos Mendoza',
      roleEn: 'Quality & Metallurgical Inspector',
      roleEs: 'Inspector de Calidad y Metalurgia',
      credentials: 'AWS CWI Inspector • ASNT NDT Level II',
      bioEn: 'Guarantees that every structural weld, mill test certificate, and powder coat thickness adheres strictly to ASTM and IBC safety specifications.',
      bioEs: 'Garantiza que cada cordón de soldadura, certificado de colada de acero y micraje de pintura cumpla con las normas ASTM e IBC.',
      badge: 'Certified CWI'
    }
  ];

  return (
    <div className="about-page-wrapper">
      <div className="blueprint-grid"></div>

      {/* 1. MANIFESTO & HERITAGE HERO */}
      <section className="about-hero-section">
        <div className="radial-accent-overlay"></div>
        <div className="container">
          <div className="about-hero-header">
            <span className="about-tag">
              <ShieldCheck size={13} className="text-accent" />
              <span>{language === 'en' ? 'EST. 2012 • ARCHITECTURAL FABRICATION GUILD' : 'EST. 2012 • TALLER DE FABRICACIÓN ARQUITECTÓNICA'}</span>
            </span>
            <h1 className="text-gradient">
              {language === 'en' ? 'Crafting Structural Permanence.' : 'Construyendo Permanencia Estructural.'}
            </h1>
            <p className="about-hero-lead">
              {language === 'en'
                ? 'We believe exceptional architecture demands uncompromising metalwork. Station Metalworks was founded on a simple principle: zero outsourcing, military-grade CNC precision, and master metallurgical craftsmanship under one roof.'
                : 'Creemos que la arquitectura excepcional exige estructuras metálicas sin concesiones. Station Metalworks nació bajo un principio claro: cero subcontratación, precisión CNC milimétrica y maestría artesanal bajo un mismo techo.'}
            </p>
          </div>

          {/* KPI Stats Row */}
          <div className="about-stats-grid glass-panel">
            <div className="stat-card">
              <span className="stat-number text-accent">1,400+</span>
              <span className="stat-label">{language === 'en' ? 'Projects Installed' : 'Proyectos Instalados'}</span>
              <span className="stat-sub">{language === 'en' ? 'Nationwide Delivery' : 'Envíos a todo el país'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number text-accent">±0.05mm</span>
              <span className="stat-label">{language === 'en' ? 'CNC Tolerances' : 'Tolerancias CNC'}</span>
              <span className="stat-sub">{language === 'en' ? 'Sub-millimeter accuracy' : 'Precisión submimétrica'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number text-accent">100%</span>
              <span className="stat-label">{language === 'en' ? 'In-House Fabricated' : 'Fabricación Propia'}</span>
              <span className="stat-sub">{language === 'en' ? 'Zero outsourced steps' : 'Cero intermediarios'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number text-accent">LIFETIME</span>
              <span className="stat-label">{language === 'en' ? 'Structural Guarantee' : 'Garantía Estructural'}</span>
              <span className="stat-sub">{language === 'en' ? 'Tested to ASTM limits' : 'Probado bajo normas ASTM'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE HIGH-TECH WORKSHOP & MACHINERY TOUR */}
      <section className="machinery-tour-section container">
        <div className="section-header">
          <span className="tag-label">
            <Cpu size={14} className="pulse-glow" />
            {language === 'en' ? 'IN-HOUSE MACHINING POWER' : 'POTENCIA DE MAQUINARIA PROPIA'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Inside Our Advanced Machine Shop' : 'Dentro de Nuestro Taller de Alta Tecnología'}
          </h2>
          <p>
            {language === 'en'
              ? 'Click through our flagship industrial equipment to inspect the tolerances, speeds, and metallurgical capabilities driving every custom build.'
              : 'Selecciona cada equipo industrial para explorar las tolerancias, capacidades y tecnologías que dan vida a cada una de nuestras piezas.'}
          </p>
        </div>

        <div className="machinery-tour-layout">
          {/* Machine Tabs */}
          <div className="machinery-nav-tabs">
            {[
              { id: 'laser', labelEn: '1. 6kW Fiber Laser Cutter', labelEs: '1. Corte Láser de Fibra 6kW', icon: Zap },
              { id: 'brake', labelEn: '2. 250-Ton CNC Press Brake', labelEs: '2. Plegadora CNC 250T', icon: Layers },
              { id: 'welding', labelEn: '3. AWS TIG & Orbital Cells', labelEs: '3. Celdas de Soldadura TIG', icon: Flame },
              { id: 'powder', labelEn: '4. 40ft Powder Coating Bay', labelEs: '4. Línea de Pintura 40ft', icon: RefreshCw },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`machinery-tab-btn ${activeMachine === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveMachine(tab.id)}
                >
                  <Icon size={18} />
                  <span>{language === 'en' ? tab.labelEn : tab.labelEs}</span>
                </button>
              );
            })}
          </div>

          {/* Machine Detail Card */}
          <div className="machinery-display-panel glass-panel">
            <div className="machinery-header">
              <span className="machine-cat-badge">{selectedMachineData.category}</span>
              <span className="machine-tol-badge">
                <CheckCircle2 size={13} className="text-green" />
                <span>{selectedMachineData.tolerance}</span>
              </span>
            </div>

            <h3 className="machine-title">
              {language === 'en' ? selectedMachineData.nameEn : selectedMachineData.nameEs}
            </h3>

            <p className="machine-desc">
              {language === 'en' ? selectedMachineData.descEn : selectedMachineData.descEs}
            </p>

            <div className="machine-specs-row">
              <div className="machine-spec-box">
                <span className="spec-lbl">{language === 'en' ? 'OPERATING SPEED' : 'VELOCIDAD OPERATIVA'}</span>
                <span className="spec-val">{selectedMachineData.speed}</span>
              </div>
              <div className="machine-spec-box">
                <span className="spec-lbl">{language === 'en' ? 'MAX THICKNESS' : 'ESPESOR MÁXIMO'}</span>
                <span className="spec-val">{selectedMachineData.capacity}</span>
              </div>
            </div>

            <div className="machine-metrics-row">
              {selectedMachineData.metrics.map((m, idx) => (
                <div key={idx} className="machine-metric-item">
                  <span className="val text-accent">{m.val}</span>
                  <span className="lbl">{language === 'en' ? m.labelEn : m.labelEs}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENGINEERING RIGOR & QUALITY MATRIX */}
      <section className="rigor-matrix-section container">
        <div className="section-header">
          <span className="tag-label">
            <Award size={14} />
            {language === 'en' ? 'TESTED & CERTIFIED' : 'ENSAYOS Y CERTIFICACIONES'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Four Pillars of Structural Rigor' : 'Cuatro Pilares de Rigor Estructural'}
          </h2>
          <p>
            {language === 'en'
              ? 'Every weld, bend, and anchoring bracket is calculated to exceed North American building codes.'
              : 'Cada soldadura, pliegue y placa de anclaje se diseña para superar los códigos de construcción de Norteamérica.'}
          </p>
        </div>

        <div className="rigor-cards-grid">
          <div className="rigor-card glass-panel">
            <div className="rigor-icon-box">
              <ShieldCheck size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? 'IBC & IRC Code Compliance' : 'Cumplimiento Códigos IBC e IRC'}</h4>
            <p>
              {language === 'en'
                ? 'Stair risers under 7.75", handrail clearances between 1.25" and 2.0", and lateral load capacity exceeding 200 lbs linear force.'
                : 'Contrahuellas menores a 7.75", diámetros de pasamanos ergonómicos y capacidad de carga lateral superior a 200 lbs de fuerza continua.'}
            </p>
            <div className="rigor-badge">Standard Passed: 100%</div>
          </div>

          <div className="rigor-card glass-panel">
            <div className="rigor-icon-box">
              <Layers size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? 'ASTM Certified Metallurgical Grades' : 'Aleaciones Certificadas ASTM'}</h4>
            <p>
              {language === 'en'
                ? 'Traceable mill certs on all A36 structural carbon steel and AISI 304/316 marine stainless. Verified tensile yield strength of 36,000 to 75,000 PSI.'
                : 'Certificados de colada trazables en todo el acero A36 y acero inoxidable AISI 304/316. Límite elástico de 36,000 a 75,000 PSI verificado.'}
            </p>
            <div className="rigor-badge">Full Traceability</div>
          </div>

          <div className="rigor-card glass-panel">
            <div className="rigor-icon-box">
              <Activity size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? '2,000+ Hr Salt Spray Environmental Testing' : 'Ensayo Niebla Salina 2,000+ Horas'}</h4>
            <p>
              {language === 'en'
                ? 'ASTM B117 salt fog chamber tested. Our multi-stage pretreatment and 400°F cured powder barrier withstands extreme ocean salt air and freeze-thaw cycles.'
                : 'Ensayado en cámara salina ASTM B117. Nuestro pretratamiento y pintura curada a 400°F resiste ambientes marítimos y ciclos de congelación.'}
            </p>
            <div className="rigor-badge">Marine Grade Defense</div>
          </div>

          <div className="rigor-card glass-panel">
            <div className="rigor-icon-box">
              <Hammer size={24} className="text-accent" />
            </div>
            <h4>{language === 'en' ? '12,500 lb Hydraulic Anchor Pullout' : 'Ensayo de Tracción 12,500 lbs'}</h4>
            <p>
              {language === 'en'
                ? 'Every wall bracket design is stress-tested with calibrated hydraulic rams, guaranteeing zero anchoring pullout even under extreme dynamic impact.'
                : 'Cada diseño de soporte de anclaje se ensaya con gatos hidráulicos calibrados, garantizando cero desprendimiento ante impactos imprevistos.'}
            </p>
            <div className="rigor-badge">Ultimate Safety Margin</div>
          </div>
        </div>
      </section>

      {/* 4. MASTER ARTISANS & ENGINEERING LEADERSHIP */}
      <section className="team-section container">
        <div className="section-header">
          <span className="tag-label">
            <Users size={14} />
            {language === 'en' ? 'THE ARTISANS BEHIND THE STEEL' : 'LOS ARTESANOS TRAS EL ACERO'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Engineering & Fabrication Guild' : 'Equipo de Ingeniería y Maestros Metalúrgicos'}
          </h2>
          <p>
            {language === 'en'
              ? 'Decades of combined structural expertise, AWS welding certifications, and architectural passion.'
              : 'Décadas de experiencia estructural combinada, certificaciones de soldadura AWS y pasión por el detalle arquitectónico.'}
          </p>
        </div>

        <div className="team-cards-grid">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-card glass-panel">
              <div className="team-card-header">
                <span className="team-badge">{member.badge}</span>
              </div>
              <h3 className="member-name">{member.name}</h3>
              <span className="member-role">{language === 'en' ? member.roleEn : member.roleEs}</span>
              <span className="member-cred">{member.credentials}</span>
              <p className="member-bio">{language === 'en' ? member.bioEn : member.bioEs}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SUSTAINABLE METALS & LIFETIME COMMITMENT + CTA */}
      <section className="sustainability-cta-section container">
        <div className="sustainability-box glass-panel">
          <div className="sustainability-content">
            <span className="eco-badge">
              <RefreshCw size={13} className="text-green" />
              <span>{language === 'en' ? 'CIRCULAR STEEL ECO-LOOP' : 'CICLO CIRCULAR DE ACERO 100% RECICLABLE'}</span>
            </span>
            <h2>{language === 'en' ? 'Built Once. Built for Generations.' : 'Construido una Vez. Hecho para Generaciones.'}</h2>
            <p>
              {language === 'en'
                ? 'Steel and aluminum are 100% infinitely recyclable without material degradation. 100% of our workshop scrap is returned to North American electric arc furnaces, and our powder coating processes emit zero harmful VOC solvents.'
                : 'El acero y el aluminio son 100% reciclables sin pérdida de propiedades mecánicas. Todo nuestro retal se reintegra a hornos de arco eléctrico y nuestros procesos de pintura emiten 0% solventes COV.'}
            </p>

            <div className="sustainability-actions">
              <a href="#/contact" className="btn btn-primary consultation-btn">
                <span>{language === 'en' ? 'Schedule a Workshop Visit' : 'Agendar Visita al Taller'}</span>
                <ArrowRight size={16} />
              </a>
              <a href="#quote" className="btn btn-secondary quote-btn">
                <span>{language === 'en' ? 'Request Architectural RFQ' : 'Solicitar Presupuesto RFQ'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-page-wrapper {
          padding-top: 100px;
          padding-bottom: 90px;
          position: relative;
        }

        /* 1. Hero */
        .about-hero-section {
          position: relative;
          padding: 40px 0 60px 0;
          overflow: hidden;
        }

        .about-hero-header {
          max-width: 800px;
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
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 12px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .about-hero-header h1 {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.15;
          color: var(--color-text-primary);
        }

        .about-hero-lead {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 28px 34px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
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
          padding-right: 0;
        }

        .stat-number {
          font-family: monospace;
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
        }

        .stat-label {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .stat-sub {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
        }

        /* 2. Machinery Tour */
        .machinery-tour-section {
          padding: 60px 0;
        }

        .machinery-tour-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 30px;
          align-items: stretch;
          margin-top: 30px;
        }

        .machinery-nav-tabs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .machinery-tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .machinery-tab-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .machinery-tab-btn.active {
          background: var(--color-text-primary);
          color: #FFF;
          border-color: var(--color-text-primary);
        }

        .machinery-display-panel {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 34px;
          display: flex;
          flex-direction: column;
          gap: 18px;
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
          color: var(--color-accent);
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
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin: 0;
          line-height: 1.25;
        }

        .machine-desc {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .machine-specs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 14px 0;
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }

        .machine-spec-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-muted);
        }

        .spec-val {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-text-primary);
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
        }

        .machine-metric-item .lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-text-secondary);
        }

        /* 3. Rigor Matrix */
        .rigor-matrix-section {
          padding: 60px 0;
        }

        .rigor-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 30px;
        }

        .rigor-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.25s, border-color 0.25s;
        }

        .rigor-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
          box-shadow: 0 10px 25px rgba(2, 0, 50, 0.05);
        }

        .rigor-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: rgba(224, 0, 39, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rigor-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin: 0;
        }

        .rigor-card p {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        .rigor-badge {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent);
          border-top: 1px dashed var(--color-border);
          padding-top: 10px;
        }

        /* 4. Team */
        .team-section {
          padding: 60px 0;
        }

        .team-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 30px;
        }

        .team-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .team-card-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 4px;
        }

        .team-badge {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          color: #2563EB;
          background: rgba(37, 99, 235, 0.08);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .member-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin: 0;
        }

        .member-role {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-accent);
        }

        .member-cred {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          border-bottom: 1px dashed var(--color-border);
          padding-bottom: 8px;
        }

        .member-bio {
          font-size: 0.76rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 4px 0 0 0;
        }

        /* 5. Sustainability & CTA */
        .sustainability-cta-section {
          padding: 40px 0 60px 0;
        }

        .sustainability-box {
          background: linear-gradient(135deg, #020032 0%, #080452 100%);
          color: #FFFFFF;
          padding: 50px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .eco-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.15);
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .sustainability-content h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 14px;
          line-height: 1.2;
        }

        .sustainability-content p {
          font-size: 0.95rem;
          color: #CBD5E1;
          max-width: 720px;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .sustainability-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .consultation-btn {
          padding: 14px 28px;
          font-size: 0.88rem;
        }

        .quote-btn {
          padding: 14px 28px;
          font-size: 0.88rem;
          background: rgba(255, 255, 255, 0.1);
          color: #FFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .quote-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #FFF;
        }

        @media (max-width: 992px) {
          .about-stats-grid, .machinery-tour-layout, .rigor-cards-grid, .team-cards-grid {
            grid-template-columns: 1fr;
          }
          .stat-card {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 14px;
          }
        }
      `}</style>
    </div>
  );
}
