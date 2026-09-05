import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, Phone, Mail, MapPin, MessageSquare, ArrowRight, 
  Check, Loader2, FileText, Sparkles, Ruler, PenTool, Hammer, CheckCircle
} from 'lucide-react';
import { cmsService } from '../services/cmsService';

export default function ServiceCtaForm({ serviceId = 'stairs', serviceTitle = '' }) {
  const { language } = useLanguage();
  const isEs = language === 'es';

  // Service lookup
  const serviceOptions = [
    { id: 'stairs', nameEn: 'Staircase Systems', nameEs: 'Sistemas de Escaleras' },
    { id: 'railings', nameEn: 'Railing Systems', nameEs: 'Sistemas de Barandales' },
    { id: 'handrails', nameEn: 'ADA Handrails', nameEs: 'Pasamanos Continuos ADA' },
    { id: 'gates', nameEn: 'Gates & Pivot Doors', nameEs: 'Portones y Puertas de Autor' },
    { id: 'custom', nameEn: 'Custom Metalwork & Tables', nameEs: 'Fabricación Especial & Mesas' }
  ];

  const currentOption = serviceOptions.find(s => s.id === serviceId) || serviceOptions[0];
  const displayTitle = serviceTitle || (isEs ? currentOption.nameEs : currentOption.nameEn);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Houston, TX',
    service: serviceId,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert(isEs ? 'Por favor completa tu nombre, teléfono y correo.' : 'Please fill in your name, phone, and email.');
      return;
    }

    setIsSubmitting(true);

    const generatedId = 'SM-RFQ-' + Math.floor(1000 + Math.random() * 9000);
    const selectedServiceObj = serviceOptions.find(s => s.id === formData.service) || currentOption;
    const originText = `Página de Servicio: ${isEs ? selectedServiceObj.nameEs : selectedServiceObj.nameEn}`;

    setTimeout(() => {
      cmsService.saveLead({
        id: generatedId,
        status: 'new',
        origin: originText,
        client: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          clientType: 'homeowner'
        },
        services: [formData.service],
        projectScope: 'residential',
        priority: 'fast',
        message: formData.message || `Solicitud directa enviada desde ${originText}`,
        files: []
      });

      setIsSubmitting(false);
      setSubmittedLeadId(generatedId);
      setSubmitSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: 'Houston, TX',
      service: serviceId,
      message: ''
    });
  };

  return (
    <section className="service-cta-form-section" id="service-quote-form">
      <div className="container">
        <div className="service-cta-grid">
          
          {/* Left Column: Context & Process Overview */}
          <div className="service-cta-info">
            <div className="cta-eyebrow">
              <ShieldCheck size={14} className="text-crimson" />
              <span>{isEs ? 'SERVICIO COTIZABLE A MEDIDA // TALLER PROPIO' : 'BESPOKE QUOTED SERVICE // DIRECT SHOP'}</span>
            </div>

            <h2 className="cta-title">
              {isEs 
                ? `Cotiza tu Proyecto de ${displayTitle}` 
                : `Request a Custom Quote for ${displayTitle}`}
            </h2>

            <p className="cta-description">
              {isEs 
                ? 'No vendemos productos estandarizados en caja. Creamos estructuras de acero y forja arquitectónica a la medida exacta de tu espacio, con acompañamiento técnico en cada fase del proceso:' 
                : 'We do not sell mass-produced boxed products. We fabricate bespoke architectural metalwork tailored to your exact measurements through our four-stage custom process:'}
            </p>

            {/* The 4 Real Process Stages requested */}
            <div className="cta-process-pillars">
              <div className="pillar-item">
                <div className="pillar-num">01</div>
                <div className="pillar-content">
                  <strong>{isEs ? 'Levantamiento & Medición' : 'Site Survey & Laser Measurements'}</strong>
                  <p>{isEs ? 'Visita técnica y toma de cotas exactas en sitio.' : 'Field verification of structural points and load anchors.'}</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-num">02</div>
                <div className="pillar-content">
                  <strong>{isEs ? 'Diseño & Render 3D' : 'CAD Modeling & 3D Render'}</strong>
                  <p>{isEs ? 'Modelado tridimensional para aprobación del cliente.' : 'Visual rendering and engineering calculation sign-off.'}</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-num">03</div>
                <div className="pillar-content">
                  <strong>{isEs ? 'Creación en Taller' : 'Workshop Fabrication'}</strong>
                  <p>{isEs ? 'Corte láser y soldadura certificada AWS en Houston.' : 'CNC cutting and AWS D1.1 certified welding in Houston.'}</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-num">04</div>
                <div className="pillar-content">
                  <strong>{isEs ? 'Instalación en Obra' : 'On-Site Installation'}</strong>
                  <p>{isEs ? 'Montaje final con anclajes estructurales sin intermediarios.' : 'Turnkey installation and safety inspection by our crew.'}</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Bar */}
            <div className="cta-direct-contact-bar">
              <div className="contact-pill">
                <Phone size={14} className="text-crimson" />
                <a href="tel:+13462349640">(346) 234 96 40</a>
              </div>
              <div className="contact-pill">
                <MapPin size={14} className="text-crimson" />
                <span>Houston, Texas</span>
              </div>
              <div className="contact-pill wa">
                <MessageSquare size={14} />
                <a href="https://wa.me/13462349640" target="_blank" rel="noreferrer">WhatsApp (+1 346 234 9640)</a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Embedded Form */}
          <div className="service-cta-form-casing">
            {!submitSuccess ? (
              <form onSubmit={handleSubmit} className="cta-embedded-form">
                <div className="form-header">
                  <h3>{isEs ? 'Solicitar Presupuesto' : 'Request Estimate'}</h3>
                  <span className="form-sub">
                    {isEs ? 'Respuesta y contacto técnico en menos de 24 horas' : 'Engineering response within 24 hours'}
                  </span>
                </div>

                {/* Name */}
                <div className="form-group">
                  <label>{isEs ? 'Nombre Completo *' : 'Full Name *'}</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={isEs ? 'Ej. Robert Sterling' : 'e.g. Robert Sterling'}
                    className="cta-input"
                  />
                </div>

                {/* Phone & Email */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label>{isEs ? 'Teléfono / WhatsApp *' : 'Phone / WhatsApp *'}</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (346) 234-9640"
                      className="cta-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{isEs ? 'Correo Electrónico *' : 'Email Address *'}</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="robert@example.com"
                      className="cta-input"
                    />
                  </div>
                </div>

                {/* City & Service Selector */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label>{isEs ? 'Ciudad y Estado *' : 'City & State *'}</label>
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Houston, TX"
                      className="cta-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{isEs ? 'Servicio Requerido' : 'Service Required'}</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="cta-select"
                    >
                      {serviceOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {isEs ? opt.nameEs : opt.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project details */}
                <div className="form-group">
                  <label>{isEs ? 'Detalles de tu Obra / Dimensiones Estimadas' : 'Project Details / Estimated Dimensions'}</label>
                  <textarea 
                    name="message" 
                    rows="3" 
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={isEs 
                      ? 'Describe medidas aproximadas, tipo de espacio (interior/exterior), si cuentas con planos o la fecha estimada de entrega...'
                      : 'Describe approximate measurements, space type (interior/exterior), if you have blueprints, or target deadline...'}
                    className="cta-textarea"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="btn-submit-service-cta"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="spinner" size={16} />
                      <span>{isEs ? 'Enviando a Taller...' : 'Sending to Workshop...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEs ? `Enviar Solicitud de ${displayTitle}` : `Submit Quote for ${displayTitle}`}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="form-legal-note">
                  <ShieldCheck size={12} className="text-emerald" />
                  <span>
                    {isEs 
                      ? 'Tus datos se registran en nuestro CMS con el origen de este servicio para atención directa de José Almanza.'
                      : 'Logged directly in our CMS with service origin for priority review by master fabricator José Almanza.'}
                  </span>
                </div>
              </form>
            ) : (
              /* Success confirmation */
              <div className="cta-success-view">
                <div className="success-icon-badge">
                  <Check size={36} />
                </div>
                <span className="success-ref-code">{submittedLeadId}</span>
                <h4>{isEs ? '¡Solicitud Registrada en Taller!' : 'Inquiry Logged in Workshop!'}</h4>
                <p>
                  {isEs 
                    ? `Gracias ${formData.name}. Hemos recibido tu solicitud para ${displayTitle} en ${formData.city}. Nuestro equipo técnico preparará la propuesta preliminar.`
                    : `Thank you ${formData.name}. We have logged your request for ${displayTitle} in ${formData.city}. Our engineering team will review it shortly.`}
                </p>

                <div className="success-buttons-group">
                  <a 
                    href={`https://wa.me/13462349640?text=${encodeURIComponent(
                      isEs 
                        ? `Hola José / Station Metalworks, acabo de enviar una solicitud para ${displayTitle} (${submittedLeadId}) desde la web.`
                        : `Hello José / Station Metalworks, I just submitted RFQ ${submittedLeadId} for ${displayTitle} on your site.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-success-wa"
                  >
                    <MessageSquare size={16} />
                    <span>{isEs ? 'Avisar por WhatsApp (+1 346 234 9640)' : 'Chat on WhatsApp'}</span>
                  </a>

                  <a href="#/cms" className="btn-success-cms">
                    <span>{isEs ? 'Ver en Panel CMS de Taller' : 'Inspect in CMS Dashboard'}</span>
                  </a>

                  <button onClick={handleReset} className="btn-success-new">
                    {isEs ? 'Enviar otra consulta' : 'Submit another inquiry'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Scoped CSS */}
      <style>{`
        .service-cta-form-section {
          padding: 85px 0 95px 0;
          background: #020032;
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .service-cta-grid {
          background: rgba(255, 255, 255, 0.04) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 20px;
          padding: 44px;
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 48px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        .service-cta-grid:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(224, 0, 39, 0.4) !important;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6), 0 0 35px rgba(224, 0, 39, 0.12);
        }

        /* Left column */
        .service-cta-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.06em;
          background: rgba(224, 0, 39, 0.12);
          border: 1px solid rgba(224, 0, 39, 0.3);
          padding: 5px 12px;
          border-radius: 6px;
          align-self: flex-start;
        }

        .cta-title {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          color: #FFFFFF;
          margin: 0;
        }

        .cta-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #CBD5E1;
          margin: 0;
        }

        /* 4 Process Pillars */
        .cta-process-pillars {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 8px;
        }

        .pillar-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .pillar-num {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 900;
          color: var(--color-accent, #e00027);
          line-height: 1;
          margin-top: 2px;
        }

        .pillar-content strong {
          font-size: 0.82rem;
          color: #FFFFFF;
          display: block;
          margin-bottom: 2px;
        }

        .pillar-content p {
          font-size: 0.72rem;
          color: #94A3B8;
          margin: 0;
          line-height: 1.35;
        }

        .cta-direct-contact-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .contact-pill a {
          color: #FFFFFF;
          text-decoration: none;
        }

        .contact-pill.wa {
          background: rgba(37, 211, 102, 0.15);
          border-color: rgba(37, 211, 102, 0.3);
          color: #25D366;
        }

        .contact-pill.wa a {
          color: #25D366;
        }

        /* Right column: Form casing */
        .service-cta-form-casing {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        }

        .form-header {
          margin-bottom: 18px;
        }

        .form-header h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #020032;
          margin: 0 0 4px 0;
        }

        .form-sub {
          font-size: 0.78rem;
          color: #64748B;
        }

        .cta-embedded-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #020032;
        }

        .cta-input,
        .cta-select,
        .cta-textarea {
          width: 100%;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #020032;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .cta-input:focus,
        .cta-select:focus,
        .cta-textarea:focus {
          background: #FFFFFF;
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 0 0 3px rgba(224, 0, 39, 0.1);
        }

        .btn-submit-service-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          border: none;
          padding: 13px 20px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 6px;
        }

        .btn-submit-service-cta:hover {
          background: #c00022;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(224, 0, 39, 0.35);
        }

        .form-legal-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.70rem;
          color: #64748B;
          line-height: 1.35;
          margin-top: 2px;
        }

        /* Success View */
        .cta-success-view {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px 10px;
        }

        .success-icon-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #10B981;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
        }

        .success-ref-code {
          font-family: monospace;
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .cta-success-view h4 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #020032;
          margin: 0;
        }

        .cta-success-view p {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        .success-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 10px;
        }

        .btn-success-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #25D366;
          color: #FFFFFF;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          text-decoration: none;
        }

        .btn-success-cms {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #020032;
          color: #FFFFFF;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          text-decoration: none;
        }

        .btn-success-new {
          background: transparent;
          border: 1px solid #CBD5E1;
          color: #64748B;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .service-cta-grid {
            grid-template-columns: 1fr;
            padding: 32px 24px;
          }
        }

        @media (max-width: 768px) {
          .cta-process-pillars,
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .cta-title {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </section>
  );
}
