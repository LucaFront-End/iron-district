import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFormCMS } from '../hooks/useFormCMS';
import { updateMetaTags } from '../services/seoConfig';
import { 
  Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, 
  Upload, FileText, CheckCircle2, ArrowRight, Calendar, 
  ExternalLink, Layers, ChevronDown, Check, Sparkles, Building, AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const { submitToCMS } = useFormCMS();

  useEffect(() => {
    updateMetaTags('contact');
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'railings',
    scope: 'commercial',
    linearFootage: 45,
    material: 'steel',
    finish: 'powder-matte-black',
    timeline: '1-2-months',
    notes: '',
    description: '',
    contactMethod: 'whatsapp',
    city: 'North Hollywood, CA'
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState(null);

  // Site Measurement & Consultation Scheduler State
  const [measurementDate, setMeasurementDate] = useState('');
  const [measurementTime, setMeasurementTime] = useState('10:00 AM');
  const [measurementType, setMeasurementType] = useState('site');
  const [measurementLocation, setMeasurementLocation] = useState('');
  const [measurementContactName, setMeasurementContactName] = useState('');
  const [measurementContactPhone, setMeasurementContactPhone] = useState('');
  const [measurementBooked, setMeasurementBooked] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const phoneDisplay = "(346) 234 96 40";
  const phoneCallUrl = "tel:13462349640";
  const whatsappUrl = "https://wa.me/13462349640?text=Hello%20Station%20Metalworks%20Team%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20fabrication%20project.";

  const faqs = [
    {
      q: isEs ? "¿Cuáles son los tiempos habituales de fabricación y entrega?" : "What are your typical fabrication and delivery lead times?",
      a: isEs 
        ? "Para herrajes y componentes estándar de nuestro catálogo oficial, el despacho toma de 24 a 48 horas. Para proyectos arquitectónicos a medida (escaleras, barandillas personalizadas, portones), el plazo estándar es de 3 a 5 semanas una vez aprobados los planos ejecutivos (shop drawings)." 
        : "Standard catalog components and hardware ordered via our online store ship within 24-48 hours. For bespoke architectural fabrication (custom stairs, monolithic railings, gates), our typical turnaround is 3-5 weeks following approved shop drawings."
    },
    {
      q: isEs ? "¿Proveen memorias de cálculo estructural y sello de Ingeniero Profesional (PE)?" : "Do you provide structural engineering calculations and PE stamps?",
      a: isEs 
        ? "Sí, contamos con ingenieros estructurales internos y asociados licenciados para emitir memorias de cálculo bajo normativas IBC, IRC y códigos locales en los 50 estados, garantizando cargas de impacto de 200 lbs y 50 plf." 
        : "Yes, our engineering department provides state-licensed Professional Engineer (PE) stamped shop drawings and structural calculations adhering to IBC/IRC standards (including 200 lb concentrated and 50 plf uniform load compliance)."
    },
    {
      q: isEs ? "¿Qué tipo de archivos puedo enviar para solicitar cotización?" : "What file formats can I upload for an estimate?",
      a: isEs 
        ? "Aceptamos planos ejecutivos en DWG, DXF, PDF, modelos 3D en STEP/IGES, archivos Revit/BIM, e incluso bocetos a mano alzada o fotos de obra acompañadas de medidas aproximadas." 
        : "We accept CAD formats (DWG, DXF), 3D solid models (STEP, IGES, Rhino), Revit BIM files, architectural vector PDFs, as well as hand sketches or jobsite photos with rough dimensions."
    },
    {
      q: isEs ? "¿Hacen envíos a todo el país y cómo protegen las piezas?" : "Do you ship nationwide and how are items protected?",
      a: isEs 
        ? "Despachamos a nivel nacional e internacional. Cada conjunto metálico es embalado en jaulas de madera reforzadas con envoltura de polietileno de alta densidad y amortiguación perimetral, garantizando que el acabado llegue impecable." 
        : "We ship across the continental US and worldwide. Every item is securely cradled in custom heavy-duty timber crating with high-density foam buffers and vapor-barrier wrap to guarantee finish perfection upon arrival."
    },
    {
      q: isEs ? "¿Ofrecen servicio de instalación en obra?" : "Do you provide on-site installation services?",
      a: isEs 
        ? "En el área metropolitana de Texas y proyectos comerciales selectos disponemos de cuadrillas propias de montaje. Para el resto del país, proveemos guías de anclaje milimétricas y soporte técnico en vivo para su contratista o instalador." 
        : "In regional metropolitan areas, our in-house certified union crews handle turnkey installation. For nationwide shipments, we supply detailed pre-drilled layout templates, hardware packs, and dedicated direct engineer phone support."
    }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(f => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: f.name.split('.').pop().toUpperCase()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRfq = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Transmit to Wix CMS Collection "Contacto"
    submitToCMS({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      service: formData.projectType,
      type: 'rfq-builder',
      source: 'Página de Contacto — Configurador RFQ',
      message: formData.description || 'Solicitud de cotización personalizada desde el estudio interactivo',
      details: {
        metodo_contacto_preferido: formData.contactMethod,
        tipo_proyecto: formData.projectType,
        metros_lineales: formData.linearFootage,
        material: formData.material,
        acabado: formData.finish,
        empresa: formData.company,
        archivos: uploadedFiles.map(f => f.name).join(', ') || 'Ninguno'
      }
    });

    try {
      await fetch("https://formsubmit.co/ajax/info@stationmetalworks.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nuevo Contacto Web: ${formData.name} (${formData.projectType || 'General'})`,
          _template: "blank",
          _language: "es",
          _captcha: "false",
          nombre: formData.name,
          email: formData.email,
          telefono: formData.phone,
          metodo_contacto_preferido: formData.contactMethod,
          tipo_proyecto: formData.projectType,
          metros_lineales: formData.linearFootage,
          detalles_proyecto: formData.description,
          archivos_adjuntos: uploadedFiles.map(f => f.name).join(', ') || 'Ninguno'
        })
      });
    } catch (err) {
      console.warn("Formsubmit response:", err);
    }

    setIsSubmitting(false);
    const rfqId = `SMW-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRfq({
      id: rfqId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      linearFootage: formData.linearFootage,
      projectType: formData.projectType
    });
  };

  const handleScheduleMeasurement = async (e) => {
    e.preventDefault();
    if (!measurementDate) return;

    // 1. Transmit to Wix CMS Collection "Contacto"
    submitToCMS({
      name: measurementContactName || 'Solicitante Levantamiento',
      phone: measurementContactPhone,
      service: measurementType,
      type: 'site-measurement',
      source: 'Página de Contacto — Agenda tu Levantamiento',
      message: `Solicitud de levantamiento en obra: ${measurementType} el ${measurementDate} (${measurementTime}) en ${measurementLocation || 'Ubicación no especificada'}`,
      details: {
        tipo_servicio: measurementType,
        fecha_preferida: measurementDate,
        horario: measurementTime,
        ubicacion_obra: measurementLocation || 'No especificada'
      }
    });

    try {
      await fetch("https://formsubmit.co/ajax/info@stationmetalworks.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nueva Solicitud de Levantamiento en Sitio: ${measurementDate} (${measurementType})`,
          _template: "blank",
          _language: "es",
          _captcha: "false",
          tipo_servicio: measurementType,
          fecha_preferida: measurementDate,
          horario: measurementTime,
          ubicacion_obra: measurementLocation || 'No especificada',
          contacto_nombre: measurementContactName,
          contacto_telefono: measurementContactPhone
        })
      });
    } catch (err) {
      console.warn("Formsubmit measurement error:", err);
    }

    setMeasurementBooked(true);
  };

  return (
    <div className="contact-page-wrapper">
      
      {/* SECTION 1: COMMAND CENTER & DIRECT CHANNELS HERO */}
      <section className="contact-hero-section">
        <div className="container">
          
          <div className="contact-status-bar">
            <div className="status-badge-online">
              <span className="pulsing-dot" />
              <span>{isEs ? "Oficina Técnica & Estimaciones: EN VIVO" : "Engineering & Estimating Desk: ONLINE"}</span>
              <span className="status-separator">|</span>
              <span className="status-sub">{isEs ? "Respuesta < 45 min" : "Avg response < 45 min"}</span>
            </div>
            <div className="csi-code-badge">
              {isEs ? "CÓDIGO CSI: 05 50 00 / 05 70 00" : "CSI SPEC CODES: 05 50 00 / 05 70 00"}
            </div>
          </div>

          <div className="contact-hero-grid">
            <div className="contact-hero-left">
              <h1 className="contact-main-title">
                {isEs ? (
                  <>Hablemos de tu Proyecto con <span className="accent-text">Ingenieros Reales</span></>
                ) : (
                  <>Direct Line to <span className="accent-text">Master Metalworkers</span> & Engineers</>
                )}
              </h1>
              <p className="contact-hero-desc">
                {isEs 
                  ? "Sin intermediarios ni presupuestos genéricos. Conéctate directamente con nuestro equipo de ingeniería estructural para cotizar proyectos a medida, consultar especificaciones técnicas o agendar una visita a nuestro taller."
                  : "No salespeople, no generic estimates. Connect directly with our structural engineering and fabrication team for rapid blueprint takeoffs, custom fabrication quotes, or workshop walkthroughs."}
              </p>

              <div className="contact-actions-row">
                <a href={phoneCallUrl} className="btn-call-direct">
                  <Phone size={18} className="icon-red" />
                  <span>{phoneDisplay}</span>
                </a>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-direct">
                  <MessageSquare size={18} />
                  <span>{isEs ? "WhatsApp Directo" : "Instant WhatsApp"}</span>
                </a>

                <a href="#rfq-studio" className="btn-rfq-scroll">
                  <span>{isEs ? "Subir Planos / RFQ" : "Upload Blueprints"}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="contact-quick-cards-grid">
              <div className="quick-card-dark">
                <span className="quick-card-tag">HQ & FABRICATION</span>
                <h4>Station Metalworks</h4>
                <p>13228 interior 12 Sherman Way<br />North Hollywood, CA 91605</p>
                <div className="quick-card-sub">
                  {isEs ? "Lun – Vie: 6:00 AM – 5:30 PM PT" : "Mon – Fri: 6:00 AM – 5:30 PM PT"}
                </div>
              </div>

              <div className="quick-card-white">
                <span className="quick-card-tag muted">{isEs ? "CORREO TÉCNICO" : "DIRECT EMAIL"}</span>
                <h4>Engineering Dispatch</h4>
                <a href="mailto:info@stationmetalworks.com" className="email-link">
                  info@stationmetalworks.com
                </a>
                <div className="quick-card-sub">
                  {isEs ? "Recepción 24/7 de archivos CAD" : "24/7 CAD & PDF intake"}
                </div>
              </div>

              <div className="quick-card-white">
                <span className="quick-card-tag muted">{isEs ? "GARANTÍA SLA" : "SLA COMMITMENT"}</span>
                <h4>&lt; 2 Horas</h4>
                <p>{isEs ? "Revisión preliminar de factibilidad técnica por un ingeniero calculista." : "Same-day preliminary feasibility & budget estimate by a licensed engineer."}</p>
              </div>

              <div className="quick-card-white">
                <span className="quick-card-tag muted">{isEs ? "COBERTURA" : "LOGISTICS"}</span>
                <h4>{isEs ? "Nacional e Int." : "50 States & Global"}</h4>
                <p>{isEs ? "Embalaje reforzado en madera y transporte asegurado a pie de obra." : "Engineered timber crating with dedicated flatbed jobsite delivery."}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: INTERACTIVE ARCHITECTURAL RFQ & BLUEPRINT UPLOAD STUDIO */}
      <section id="rfq-studio" className="rfq-studio-section container">
        <div className="rfq-studio-card">
          
          <div className="rfq-studio-header">
            <div>
              <div className="rfq-studio-eyebrow">
                <Sparkles size={14} className="icon-red" />
                <span>{isEs ? "Estudio Interactivo de Cotizaciones" : "Interactive Blueprint RFQ Studio"}</span>
              </div>
              <h2>{isEs ? "Configurador Técnico de Solicitud (RFQ)" : "Architectural Project Specification Builder"}</h2>
            </div>
            <div className="rfq-studio-header-right">
              <span className="mono-sub">STATION METALWORKS CAD PIPELINE</span>
              <div className="shop-cert">ISO 9001 / AWS Certified Shop</div>
            </div>
          </div>

          <div className="rfq-studio-body">
            
            {/* Form Column */}
            <form onSubmit={handleSubmitRfq} className="rfq-form-area">
              
              {/* Step 1: Project System Type */}
              <div className="form-group">
                <label className="form-step-label">
                  01 // {isEs ? "Selecciona el Sistema Arquitectónico" : "Select Architectural System"}
                </label>
                <div className="systems-select-grid">
                  {[
                    { id: 'stairs', label: isEs ? 'Escaleras Mono-Viga / Helicoidales' : 'Floating & Spiral Stairs' },
                    { id: 'railings', label: isEs ? 'Barandillas de Varilla / Cable' : 'Cable & Rod Railings' },
                    { id: 'glass', label: isEs ? 'Barandillas Vidrio Estructural' : 'Base-Shoe Glass Guardrails' },
                    { id: 'gates', label: isEs ? 'Portones de Entrada & Motorización' : 'Architectural Gates & Access' },
                    { id: 'structural', label: isEs ? 'Estructuras & Pérgolas de Acero' : 'Structural Canopies & Frames' },
                    { id: 'store', label: isEs ? 'Componentes de Tienda / Medida' : 'Modular Store Parts / Hardware' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, projectType: item.id })}
                      className={`system-select-btn ${formData.projectType === item.id ? 'active' : ''}`}
                    >
                      <Layers size={18} className="system-icon" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Linear Footage Slider */}
              <div className="form-group">
                <div className="slider-label-row">
                  <label className="form-step-label">
                    02 // {isEs ? "Metraje Lineal Estimado (LF)" : "Estimated Linear Footage (LF)"}
                  </label>
                  <span className="slider-val-badge">
                    {formData.linearFootage} {isEs ? 'Pies Lineales (~' + (formData.linearFootage * 0.3048).toFixed(1) + ' m)' : 'Linear Feet'}
                  </span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="350"
                  step="5"
                  value={formData.linearFootage}
                  onChange={(e) => setFormData({ ...formData, linearFootage: Number(e.target.value) })}
                  className="lf-range-slider"
                />
                <div className="slider-sub-ticks">
                  <span>10 LF (Residencial puntual)</span>
                  <span>100 LF (Deck / Balcón grande)</span>
                  <span>350+ LF (Complejo Comercial)</span>
                </div>
              </div>

              {/* Step 3: Material & Finish Dropdowns */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-step-label">
                    03 // {isEs ? "Aleación Metálica" : "Base Metal Alloy"}
                  </label>
                  <select 
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="custom-select"
                  >
                    <option value="steel">{isEs ? "Acero Estructural A36 Carbon Steel" : "A36 Structural Carbon Steel"}</option>
                    <option value="stainless-304">{isEs ? "Acero Inoxidable 304 (Interior/Seco)" : "304 Architectural Stainless (Interior)"}</option>
                    <option value="stainless-316">{isEs ? "Acero Inoxidable Marino 316 (Costa/Cloro)" : "316 Marine-Grade Stainless (Coastal)"}</option>
                    <option value="aluminum">{isEs ? "Aluminio Billet 6061-T6 (Ligero)" : "6061-T6 Aircraft Billet Aluminum"}</option>
                    <option value="brass">{isEs ? "Latón Arquitectónico / Bronce Satinado" : "Architectural Brass & Bronze"}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-step-label">
                    04 // {isEs ? "Acabado Superficial" : "Protective Surface Finish"}
                  </label>
                  <select 
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="custom-select"
                  >
                    <option value="powder-matte-black">{isEs ? "Powder Coat Negro Mate (Tiger Drylac)" : "Architectural Matte Black (Tiger Drylac)"}</option>
                    <option value="powder-bronze">{isEs ? "Powder Coat Bronce Anódico / Carbono" : "Anodic Bronze Metallic Powder Coat"}</option>
                    <option value="brushed-satin">{isEs ? "Cepillado Satinado Grano #4 (Inox)" : "#4 Directional Architectural Satin Brush"}</option>
                    <option value="galvanized">{isEs ? "Galvanizado en Caliente ASTM A123" : "Hot-Dip Galvanized ASTM A123"}</option>
                    <option value="raw">{isEs ? "Acero Natural Decapado (Para Taller)" : "Raw Mill-Finish (For local finisher)"}</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Blueprint Drag & Drop Zone */}
              <div className="form-group">
                <label className="form-step-label">
                  05 // {isEs ? "Adjuntar Planos / Bocetos (CAD, PDF, STEP)" : "Upload CAD, Blueprints, or Sketches"}
                </label>
                <div className="dropzone-box">
                  <input 
                    type="file" 
                    multiple
                    accept=".pdf,.dwg,.dxf,.step,.stp,.png,.jpg,.jpeg,.zip"
                    onChange={handleFileUpload}
                    className="file-hidden-input"
                  />
                  <div className="dropzone-content">
                    <div className="dropzone-icon-circle">
                      <Upload size={22} />
                    </div>
                    <p className="dropzone-title">
                      {isEs ? "Haz clic para seleccionar o arrastra archivos aquí" : "Click to select or drag & drop project files"}
                    </p>
                    <span className="dropzone-sub">DWG • DXF • PDF • STEP • IFC • ZIP (Max 100MB)</span>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="file-item-pill">
                        <div className="file-info">
                          <span className="file-type-badge">{file.type}</span>
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">({file.size})</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFile(idx)}
                          className="file-remove-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 5: Contact Details Inputs */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="field-label">{isEs ? "Nombre Completo *" : "Full Name *"}</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Liam Vance"
                    className="custom-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">{isEs ? "Correo Electrónico *" : "Email Address *"}</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="liam@vancestudio.com"
                    className="custom-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">{isEs ? "Teléfono / Móvil *" : "Phone Number *"}</label>
                  <input 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(346) 234 96 40"
                    className="custom-input"
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">{isEs ? "Estudio / Constructora" : "Company / Firm"}</label>
                  <input 
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vance Architectural Partners"
                    className="custom-input"
                  />
                </div>
              </div>

              {/* Step 6: Notes */}
              <div className="form-group">
                <label className="field-label">{isEs ? "Notas del Proyecto y Requerimientos de Código" : "Project Notes & Code Compliance Needs"}</label>
                <textarea 
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isEs ? "Indica alturas de barandilla (36\" o 42\"), tipo de anclaje (core drill, base plate, fascia mount), o si requiere memoria PE." : "Specify rail height (36\" or 42\"), mount type (fascia vs surface), or if PE engineering stamp is required for permitting."}
                  className="custom-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit-rfq"
              >
                {isSubmitting ? (
                  <span>{isEs ? "Transmitiendo Pliego CAD..." : "Processing Blueprint Intake..."}</span>
                ) : (
                  <>
                    <span>{isEs ? "Transmitir Solicitud a Oficina Técnica" : "Transmit RFQ to Structural Engineering Desk"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Live Spec Summary Sidebar */}
            <div className="rfq-summary-sidebar">
              <div>
                <span className="summary-eyebrow">LIVE SPEC SUMMARY</span>
                <h3 className="summary-title">{isEs ? "Ficha Técnica Resumen" : "Dynamic Takeoff Summary"}</h3>

                <div className="summary-cards-stack">
                  <div className="summary-item-card">
                    <span className="summary-item-lbl">{isEs ? "Sistema Seleccionado" : "Selected System"}</span>
                    <span className="summary-item-val capitalize">{formData.projectType}</span>
                  </div>

                  <div className="summary-item-card">
                    <span className="summary-item-lbl">{isEs ? "Escala / Metraje" : "Estimated Footage"}</span>
                    <span className="summary-item-val">{formData.linearFootage} LF</span>
                  </div>

                  <div className="summary-item-card">
                    <span className="summary-item-lbl">{isEs ? "Aleación" : "Material Alloy"}</span>
                    <span className="summary-item-val capitalize">{formData.material}</span>
                  </div>

                  <div className="summary-item-card">
                    <span className="summary-item-lbl">{isEs ? "Acabado" : "Finish Spec"}</span>
                    <span className="summary-item-val capitalize">{formData.finish.replace(/-/g, ' ')}</span>
                  </div>

                  <div className="summary-item-card">
                    <span className="summary-item-lbl">{isEs ? "Documentos Adjuntos" : "Uploaded CAD Files"}</span>
                    <span className="summary-item-val">{uploadedFiles.length} {isEs ? "archivo(s)" : "file(s)"}</span>
                  </div>
                </div>

                <div className="summary-promise-box">
                  <div className="promise-badge">
                    <ShieldCheck size={16} className="icon-red" />
                    <span>{isEs ? "COMPROMISO STATION" : "STATION PROMISE"}</span>
                  </div>
                  <p>
                    {isEs 
                      ? "Plano de taller (Shop Drawing) con sello PE disponible antes de cortar el primer gramo de acero." 
                      : "PE-stamped shop drawings guaranteed before raw stock hits our CNC laser cutting beds."}
                  </p>
                </div>
              </div>

              <div className="summary-footer-call">
                <span className="summary-footer-sub">{isEs ? "¿NECESITAS ASISTENCIA INMEDIATA?" : "PREFER PHONE DIRECT?"}</span>
                <a href={phoneCallUrl} className="summary-phone-link">
                  <Phone size={15} className="icon-red" />
                  <span>{phoneDisplay}</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* RFQ SUCCESS MODAL */}
      {submittedRfq && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-icon-success">
              <CheckCircle2 size={32} />
            </div>
            <span className="modal-eyebrow">
              {isEs ? "TRANSMISIÓN EXITOSA" : "RFQ TRANSMITTED SUCCESSFULLY"}
            </span>
            <h3 className="modal-rfq-id">{submittedRfq.id}</h3>
            <p className="modal-text">
              {isEs 
                ? `Gracias ${submittedRfq.name}. Tu pliego técnico para ${submittedRfq.projectType} (${submittedRfq.linearFootage} LF) fue asignado a un ingeniero calculista. Te enviaremos el reporte preliminar a ${submittedRfq.email} en menos de 2 horas.`
                : `Thank you ${submittedRfq.name}. Your specification package for ${submittedRfq.projectType} (${submittedRfq.linearFootage} LF) has been routed to an engineering specialist. Expect preliminary feasibility at ${submittedRfq.email} within 2 hours.`}
            </p>
            <div className="modal-actions-row">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-modal-wa">
                <span>{isEs ? "Avisar por WhatsApp" : "Confirm via WhatsApp"}</span>
              </a>
              <button onClick={() => setSubmittedRfq(null)} className="btn-modal-close">
                {isEs ? "Cerrar" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: AGENDA TU LEVANTAMIENTO TÉCNICO EN SITIO */}
      <section className="measurement-scheduler-section">
        <div className="container">
          
          <div className="section-header-center">
            <span className="section-eyebrow-red">
              {isEs ? "MEDICIÓN LÁSER & ASESORÍA EN OBRA" : "3D LASER MEASUREMENT & CONSULTATION"}
            </span>
            <h2 className="section-title-white">
              {isEs ? "Agenda tu Levantamiento Técnico" : "Schedule Your Site Measurement"}
            </h2>
            <p className="section-desc-light">
              {isEs 
                ? "Somos un equipo artesanal de ingeniería y taller a escala humana. Antes de iniciar la fabricación, acudimos a tu obra para realizar un levantamiento milimétrico con escáner láser 3D, verificar plomos, desniveles y anclajes estructurales." 
                : "We are a close-knit craftsman workshop focused on absolute precision. Before cutting raw steel, we take exact 3D laser measurements on your job site to ensure zero field modifications."}
            </p>
          </div>

          <div className="measurement-scheduler-box">
            <div className="measurement-scheduler-grid">
              
              <div className="measurement-info-col">
                <span className="measurement-eyebrow">
                  {isEs ? "CERO SORPRESAS EN MONTAJE" : "ZERO-SURPRISE INSTALLATION"}
                </span>
                <h3 className="measurement-title">
                  {isEs ? "¿Por qué agendar un levantamiento con Station Metalworks?" : "Why schedule an on-site survey with our team?"}
                </h3>
                <p className="measurement-desc">
                  {isEs 
                    ? "Coordinamos directamente con arquitectos, constructores y clientes particulares. Evaluamos el sustrato de fijación (hormigón, losa aligerada, madera estructural) y definimos la geometría exacta de escaleras, barandales y portones." 
                    : "We coordinate directly with architects, general contractors, and homeowners. We inspect structural anchoring substrates and calibrate exact geometries for custom stairs, railings, and gates."}
                </p>

                <div className="measurement-benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">📐</div>
                    <div>
                      <strong>{isEs ? "Escaneo Láser 3D de Alta Precisión" : "High-Precision 3D Laser Scanning"}</strong>
                      <p>{isEs ? "Captura milimétrica de desplomes, ángulos y niveles reales de losa." : "Millimeter-level verification of wall plumbs, floor levels, and spans."}</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">🛠️</div>
                    <div>
                      <strong>{isEs ? "Trato Directo con Maestros de Taller" : "Direct Craft Workshop Consultation"}</strong>
                      <p>{isEs ? "Sin intermediarios corporativos ni burocracia: hablas directamente con quienes fabrican." : "No corporate bureaucracy or salespeople: consult directly with fabricators."}</p>
                    </div>
                  </div>

                  <div className="benefit-item">
                    <div className="benefit-icon">📍</div>
                    <div>
                      <strong>{isEs ? "Cobertura de Levantamiento en Obra" : "On-Site Service Coverage"}</strong>
                      <p>{isEs ? "Área metropolitana de Los Angeles, Sur de California, Houston y Texas." : "Greater Los Angeles, Southern California, Houston, and Texas metro areas."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="measurement-form-col">
                {measurementBooked ? (
                  <div className="measurement-confirmed-box">
                    <div className="confirmed-icon">✓</div>
                    <h4>{isEs ? "¡Levantamiento Agendado con Éxito!" : "Measurement Request Confirmed!"}</h4>
                    <p>
                      {isEs 
                        ? `Hemos registrado tu solicitud para el ${measurementDate} (${measurementTime}) en ${measurementLocation || 'tu obra'}. Nuestro equipo técnico se comunicará contigo para confirmar los detalles de acceso.` 
                        : `We have registered your site measurement request for ${measurementDate} at ${measurementTime} (${measurementLocation || 'your jobsite'}). We will reach out to confirm access details.`}
                    </p>
                    <div className="confirmed-actions">
                      <a 
                        href={`https://wa.me/13462349640?text=${encodeURIComponent(
                          isEs
                            ? `Hola Station Metalworks, acabo de agendar un levantamiento técnico para el ${measurementDate} a las ${measurementTime} en ${measurementLocation || 'mi obra'}.`
                            : `Hello Station Metalworks, I just scheduled a site measurement for ${measurementDate} at ${measurementTime} at ${measurementLocation || 'my jobsite'}.`
                        )}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-confirmed-wa"
                      >
                        <MessageSquare size={16} />
                        <span>{isEs ? "Confirmar por WhatsApp" : "Confirm via WhatsApp"}</span>
                      </a>
                      <button onClick={() => setMeasurementBooked(false)} className="btn-rebook">
                        {isEs ? "Modificar o agendar otra cita" : "Modify or book another appointment"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleMeasurement} className="measurement-form">
                    <div className="measurement-input-group full-width">
                      <label>{isEs ? "Modalidad de Servicio" : "Service Type"} *</label>
                      <select 
                        value={measurementType}
                        onChange={(e) => setMeasurementType(e.target.value)}
                        className="measurement-select"
                      >
                        <option value="site">{isEs ? "📍 Levantamiento en Sitio / Obra (Medición Láser Presencial)" : "📍 On-Site Jobsite Measurement (In-Person Laser Survey)"}</option>
                        <option value="virtual">{isEs ? "💻 Consulta Virtual 3D / Revisión de Planos (Zoom)" : "💻 Virtual 3D Consultation (Zoom / Plan Review)"}</option>
                        <option value="shop">{isEs ? "🏭 Visita a Nuestro Taller (North Hollywood HQ)" : "🏭 Workshop Visit (North Hollywood HQ)"}</option>
                      </select>
                    </div>

                    <div className="measurement-form-row">
                      <div className="measurement-input-group">
                        <label>{isEs ? "Nombre del Responsable / Cliente *" : "Contact Name *"}</label>
                        <input 
                          type="text"
                          required
                          placeholder={isEs ? "ej. Arq. Daniel Soto" : "e.g. Liam Sterling"}
                          value={measurementContactName}
                          onChange={(e) => setMeasurementContactName(e.target.value)}
                          className="measurement-input"
                        />
                      </div>
                      <div className="measurement-input-group">
                        <label>{isEs ? "Teléfono de Contacto *" : "Phone Number *"}</label>
                        <input 
                          type="tel"
                          required
                          placeholder="(346) 234 96 40"
                          value={measurementContactPhone}
                          onChange={(e) => setMeasurementContactPhone(e.target.value)}
                          className="measurement-input"
                        />
                      </div>
                    </div>

                    <div className="measurement-input-group full-width">
                      <label>{isEs ? "Dirección o Ciudad de la Obra *" : "Jobsite Address or City *"}</label>
                      <input 
                        type="text"
                        required
                        placeholder={isEs ? "ej. Sherman Oaks, CA / Houston, TX" : "e.g. Beverly Hills, CA / Austin, TX"}
                        value={measurementLocation}
                        onChange={(e) => setMeasurementLocation(e.target.value)}
                        className="measurement-input"
                      />
                    </div>

                    <div className="measurement-form-row">
                      <div className="measurement-input-group">
                        <label>{isEs ? "Fecha Preferida *" : "Preferred Date *"}</label>
                        <input 
                          type="date"
                          required
                          value={measurementDate}
                          onChange={(e) => setMeasurementDate(e.target.value)}
                          className="measurement-input"
                        />
                      </div>

                      <div className="measurement-input-group">
                        <label>{isEs ? "Horario de Preferencia" : "Preferred Time Slot"}</label>
                        <select 
                          value={measurementTime}
                          onChange={(e) => setMeasurementTime(e.target.value)}
                          className="measurement-select"
                        >
                          <option value="08:00 AM">08:00 AM (Primera hora)</option>
                          <option value="10:30 AM">10:30 AM (Mañana)</option>
                          <option value="01:30 PM">01:30 PM (Mediodía)</option>
                          <option value="04:00 PM">04:00 PM (Tarde)</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn-measurement-submit">
                      <span>{isEs ? "Confirmar Agenda de Levantamiento" : "Confirm Site Measurement Request"}</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: 2-HOUR SLA GUARANTEE & ARCHITECTURAL FAQS */}
      <section className="sla-faq-section">
        <div className="container">
          
          <div className="sla-faq-grid">
            
            {/* SLA Badge & Statement */}
            <div className="sla-card">
              <div className="sla-icon-box">
                <Clock size={28} />
              </div>

              <span className="sla-eyebrow">
                {isEs ? "COMPROMISO CONTRACTUAL" : "RAPID RESPONSE SLA"}
              </span>

              <h3 className="sla-title">
                {isEs ? "Garantía de Respuesta en Menos de 2 Horas" : "The 2-Hour Feasibility Guarantee"}
              </h3>

              <p className="sla-desc">
                {isEs 
                  ? "Entendemos la presión de los plazos de licitación y los calendarios de obra. Cuando envías tus planos a Station Metalworks durante el horario laboral, un ingeniero especialista revisa las cargas, las tolerancias de anclaje y te devuelve feedback estructurado en menos de 120 minutos."
                  : "We understand commercial tender deadlines and critical path site milestones. When you submit drawing sets to Station Metalworks during business hours, an actual metal fabrication engineer reviews structural spans and attachment feasibility within 120 minutes."}
              </p>

              <div className="sla-checks-box">
                <div className="sla-check-item">
                  <Check size={16} className="icon-green" />
                  <span>{isEs ? "Revisión técnica de anclajes a obra" : "Site anchor substrate evaluation"}</span>
                </div>
                <div className="sla-check-item">
                  <Check size={16} className="icon-green" />
                  <span>{isEs ? "Desglose preliminar de costos y metraje" : "Preliminary cost and linear takeoff"}</span>
                </div>
                <div className="sla-check-item">
                  <Check size={16} className="icon-green" />
                  <span>{isEs ? "Cumplimiento con código IBC 200 lb" : "IBC 200 lb load check recommendation"}</span>
                </div>
              </div>

              <div className="sla-card-foot">
                <span className="sla-brand">STATION METALWORKS</span>
                <a href={whatsappUrl} className="sla-wa-link">
                  <span>{isEs ? "Chatear Ahora" : "Chat on WhatsApp"}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="faqs-column">
              <span className="section-eyebrow-red">
                {isEs ? "RESOLVEMOS TUS DUDAS" : "SPECIFICATION & PRODUCTION"}
              </span>
              <h2 className="faq-section-title">
                {isEs ? "Preguntas Frecuentes de Arquitectos y Contratistas" : "Frequently Asked Architectural Questions"}
              </h2>

              <div className="faq-items-list">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="faq-question-btn"
                      >
                        <span>{faq.q}</span>
                        <span className={`faq-expand-icon ${isOpen ? 'rotate' : ''}`}>+</span>
                      </button>

                      {isOpen && (
                        <div className="faq-answer-body">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SCOPED COMPREHENSIVE CSS */}
      <style>{`
        .contact-page-wrapper {
          padding-top: 90px;
          padding-bottom: 0;
          background-color: var(--color-surface-base, #F8FAFC);
          color: var(--color-brand-dark, #020032);
          font-family: var(--font-sans, 'Inter', sans-serif);
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 1. Hero & Command Center */
        .contact-hero-section {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          padding: 40px 0 70px 0;
          position: relative;
        }

        .contact-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .status-badge-online {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pulsing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
        }

        .status-separator {
          color: #6EE7B7;
        }

        .status-sub {
          color: #047857;
        }

        .csi-code-badge {
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-muted, #7c829c);
          letter-spacing: 0.05em;
        }

        .contact-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }

        .contact-main-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1.12;
          color: var(--color-brand-dark, #020032);
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .accent-text {
          color: var(--color-accent, #e00027);
        }

        .contact-hero-desc {
          font-size: 1.05rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 580px;
        }

        .contact-actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .btn-call-direct {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(2, 0, 50, 0.15);
        }

        .btn-call-direct:hover {
          background: #0a0750;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(2, 0, 50, 0.25);
        }

        .btn-whatsapp-direct {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #16a34a;
          color: #FFFFFF;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.2);
        }

        .btn-whatsapp-direct:hover {
          background: #15803d;
          transform: translateY(-2px);
        }

        .btn-rfq-scroll {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F1F5F9;
          color: var(--color-brand-dark, #020032);
          border: 1px solid #CBD5E1;
          padding: 14px 22px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-rfq-scroll:hover {
          background: #E2E8F0;
        }

        .icon-red {
          color: var(--color-accent, #e00027);
        }

        .contact-quick-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .quick-card-dark {
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          padding: 22px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 8px 24px rgba(2, 0, 50, 0.12);
        }

        .quick-card-dark h4 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }

        .quick-card-dark p {
          font-size: 0.8rem;
          color: #CBD5E1;
          line-height: 1.5;
          margin: 0;
        }

        .quick-card-white {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 22px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .quick-card-white h4 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .quick-card-white p {
          font-size: 0.8rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.5;
          margin: 0;
        }

        .quick-card-tag {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.05em;
        }

        .quick-card-tag.muted {
          color: var(--color-text-muted, #7c829c);
        }

        .quick-card-sub {
          font-family: monospace;
          font-size: 0.7rem;
          color: #94A3B8;
          margin-top: 4px;
        }

        .email-link {
          font-size: 0.82rem;
          color: var(--color-accent, #e00027);
          font-weight: 600;
          word-break: break-all;
        }

        /* 2. Interactive RFQ Studio */
        .rfq-studio-section {
          padding: 70px 0;
        }

        .rfq-studio-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(2, 0, 50, 0.08);
          overflow: hidden;
        }

        .rfq-studio-header {
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          padding: 28px 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 2px solid var(--color-accent, #e00027);
        }

        .rfq-studio-eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .rfq-studio-header h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .rfq-studio-header-right {
          text-align: right;
        }

        .mono-sub {
          font-family: monospace;
          font-size: 0.7rem;
          color: #94A3B8;
          display: block;
        }

        .shop-cert {
          font-size: 0.85rem;
          font-weight: 600;
          color: #E2E8F0;
        }

        .rfq-studio-body {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
        }

        .rfq-form-area {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-step-label {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-secondary, #3b3e54);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .field-label {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-secondary, #3b3e54);
          text-transform: uppercase;
        }

        .systems-select-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .system-select-btn {
          padding: 16px 14px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background: #F8FAFC;
          color: var(--color-text-primary, #020032);
          font-size: 0.8rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s;
        }

        .system-select-btn:hover {
          border-color: var(--color-border-hover);
          background: #FFFFFF;
        }

        .system-select-btn.active {
          border-color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.05);
          color: var(--color-accent, #e00027);
          box-shadow: 0 0 0 1px var(--color-accent, #e00027);
        }

        .system-icon {
          color: inherit;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slider-val-badge {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.1);
          padding: 4px 12px;
          border-radius: 8px;
        }

        .lf-range-slider {
          width: 100%;
          height: 8px;
          background: #E2E8F0;
          border-radius: 6px;
          outline: none;
          accent-color: var(--color-accent, #e00027);
          cursor: pointer;
          margin: 6px 0;
        }

        .slider-sub-ticks {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.68rem;
          color: #94A3B8;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .custom-select, .custom-input, .custom-textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: var(--color-brand-dark, #020032);
          font-size: 0.88rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .custom-select:focus, .custom-input:focus, .custom-textarea:focus {
          outline: none;
          border-color: var(--color-brand-dark, #020032);
          box-shadow: 0 0 0 2px rgba(2, 0, 50, 0.1);
        }

        .dropzone-box {
          position: relative;
          border: 2px dashed #CBD5E1;
          border-radius: 14px;
          padding: 30px;
          background: #F8FAFC;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .dropzone-box:hover {
          border-color: var(--color-accent, #e00027);
          background: #FFFFFF;
        }

        .file-hidden-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }

        .dropzone-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent, #e00027);
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .dropzone-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 4px 0;
        }

        .dropzone-sub {
          font-family: monospace;
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .file-item-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          border-radius: 8px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          font-family: monospace;
          font-size: 0.76rem;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-type-badge {
          background: var(--color-brand-dark, #020032);
          color: #FFF;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.65rem;
        }

        .file-name {
          font-weight: 600;
          color: #1E293B;
        }

        .file-size {
          color: #64748B;
        }

        .file-remove-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 2px 6px;
        }

        .file-remove-btn:hover {
          color: var(--color-accent, #e00027);
        }

        .btn-submit-rfq {
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          border: none;
          padding: 16px 28px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(224, 0, 39, 0.25);
        }

        .btn-submit-rfq:hover {
          background: #c20022;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(224, 0, 39, 0.35);
        }

        .rfq-summary-sidebar {
          background: #F8FAFC;
          border-left: 1px solid var(--color-border);
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .summary-eyebrow {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 6px;
        }

        .summary-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 20px 0;
        }

        .summary-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .summary-item-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .summary-item-lbl {
          font-family: monospace;
          font-size: 0.65rem;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .summary-item-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .summary-promise-box {
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .promise-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
        }

        .summary-promise-box p {
          font-size: 0.78rem;
          color: #CBD5E1;
          line-height: 1.5;
          margin: 0;
        }

        .summary-footer-call {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E2E8F0;
        }

        .summary-footer-sub {
          font-family: monospace;
          font-size: 0.68rem;
          color: #94A3B8;
          display: block;
          margin-bottom: 6px;
        }

        .summary-phone-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          text-decoration: none;
        }

        .summary-phone-link:hover {
          color: var(--color-accent, #e00027);
        }

        /* Success Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          padding: 36px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid #E2E8F0;
        }

        .modal-icon-success {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ECFDF5;
          color: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        .modal-eyebrow {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 6px;
        }

        .modal-rfq-id {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 12px 0;
        }

        .modal-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .modal-actions-row {
          display: flex;
          gap: 12px;
        }

        .btn-modal-wa {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          background: #16a34a;
          color: #FFF;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          text-align: center;
        }

        .btn-modal-close {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          background: #F1F5F9;
          color: var(--color-brand-dark, #020032);
          font-weight: 700;
          font-size: 0.88rem;
          border: none;
          cursor: pointer;
        }

        /* 3. Facility Blueprint Section */
        .facility-blueprint-section {
          background: #0B0E1B;
          color: #FFFFFF;
          padding: 90px 0;
        }

        .section-header-center {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 40px auto;
        }

        .section-eyebrow-red {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .section-title-white {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 2.6rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .section-title-dark {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 2.6rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .section-desc-light {
          font-size: 1.05rem;
          color: #94A3B8;
          line-height: 1.6;
          margin: 0;
        }

        .section-desc-dark {
          font-size: 1.05rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
          margin: 0;
        }

        .facility-tabs-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .facility-tab-btn {
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid #1E293B;
          background: #151A2E;
          color: #CBD5E1;
          font-family: monospace;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .facility-tab-btn:hover {
          background: #1E293B;
          color: #FFF;
        }

        .facility-tab-btn.active {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
          color: #FFF;
          box-shadow: 0 4px 14px rgba(224, 0, 39, 0.4);
        }

        .tab-indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #64748B;
        }

        .tab-indicator-dot.active {
          background: #FFFFFF;
        }

        /* 3. Measurement Scheduler Section */
        .measurement-scheduler-section {
          background: #0B0E1B;
          color: #FFFFFF;
          padding: 90px 0;
        }

        .measurement-scheduler-box {
          background: linear-gradient(135deg, var(--color-brand-dark, #020032) 0%, #0c0860 100%);
          border: 1px solid #232B47;
          border-radius: 20px;
          padding: 44px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .measurement-scheduler-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 40px;
          align-items: flex-start;
        }

        @media (max-width: 992px) {
          .measurement-scheduler-grid {
            grid-template-columns: 1fr;
          }
        }

        .measurement-eyebrow {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 8px;
        }

        .measurement-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 12px 0;
          line-height: 1.25;
        }

        .measurement-desc {
          font-size: 0.88rem;
          color: #CBD5E1;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .measurement-benefits-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .benefit-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 16px;
          border-radius: 10px;
        }

        .benefit-icon {
          font-size: 1.3rem;
          line-height: 1;
        }

        .benefit-item strong {
          display: block;
          font-size: 0.82rem;
          color: #FFFFFF;
          margin-bottom: 2px;
        }

        .benefit-item p {
          font-size: 0.75rem;
          color: #94A3B8;
          margin: 0;
          line-height: 1.4;
        }

        .measurement-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #151A2E;
          border: 1px solid #232B47;
          border-radius: 14px;
          padding: 28px;
        }

        .measurement-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 600px) {
          .measurement-form-row {
            grid-template-columns: 1fr;
          }
        }

        .measurement-input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .measurement-input-group.full-width {
          width: 100%;
        }

        .measurement-input-group label {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .measurement-select, .measurement-input {
          padding: 11px 14px;
          border-radius: 8px;
          background: #0B0E1B;
          border: 1px solid #232B47;
          color: #FFFFFF;
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .measurement-select:focus, .measurement-input:focus {
          border-color: var(--color-accent, #e00027);
        }

        .btn-measurement-submit {
          width: 100%;
          padding: 13px;
          margin-top: 6px;
          border-radius: 8px;
          background: var(--color-accent, #e00027);
          color: #FFF;
          border: none;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.2s;
        }

        .btn-measurement-submit:hover {
          background: #b80020 !important;
          color: #FFFFFF !important;
          transform: translateY(-1px);
        }

        .measurement-confirmed-box {
          background: rgba(6, 78, 59, 0.4);
          border: 1px solid #10B981;
          border-radius: 14px;
          padding: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .measurement-confirmed-box h4 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .measurement-confirmed-box p {
          font-size: 0.85rem;
          color: #D1FAE5;
          line-height: 1.55;
          margin: 0;
        }

        .confirmed-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 320px;
          margin-top: 8px;
        }

        .btn-confirmed-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #16a34a;
          color: #FFFFFF;
          padding: 12px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s;
        }

        .btn-confirmed-wa:hover {
          background: #15803d;
        }

        /* 5. SLA & FAQ Section */
        .sla-faq-section {
          background: #F1F5F9;
          border-top: 1px solid var(--color-border);
          padding: 80px 0 100px 0;
        }

        .sla-faq-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 48px;
          align-items: flex-start;
        }

        .sla-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        .sla-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          background: rgba(224, 0, 39, 0.08);
          color: var(--color-accent, #e00027);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .sla-eyebrow {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 4px;
        }

        .sla-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 14px 0;
          line-height: 1.25;
        }

        .sla-desc {
          font-size: 0.88rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .sla-checks-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .sla-check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: #1E293B;
        }

        .icon-green {
          color: #10B981;
        }

        .sla-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #F1F5F9;
        }

        .sla-brand {
          font-family: monospace;
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .sla-wa-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          text-decoration: none;
        }

        .faqs-column {
          display: flex;
          flex-direction: column;
        }

        .faq-section-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 4px 0 24px 0;
          line-height: 1.2;
        }

        .faq-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .faq-item-card.open {
          border-color: var(--color-brand-dark, #020032);
          box-shadow: 0 4px 16px rgba(2, 0, 50, 0.05);
        }

        .faq-question-btn {
          width: 100%;
          padding: 18px 22px;
          background: transparent;
          border: none;
          text-align: left;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s;
        }

        .faq-question-btn:hover {
          color: var(--color-accent, #e00027);
        }

        .faq-expand-icon {
          font-family: monospace;
          font-size: 1.4rem;
          color: #94A3B8;
          transition: transform 0.2s;
        }

        .faq-expand-icon.rotate {
          transform: rotate(45deg);
          color: var(--color-accent, #e00027);
        }

        .faq-answer-body {
          padding: 0 22px 20px 22px;
          font-size: 0.88rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.65;
          border-top: 1px solid #F1F5F9;
          padding-top: 14px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .contact-hero-grid, .rfq-studio-body, .facility-preview-grid, .tour-scheduler-grid, .sla-faq-grid {
            grid-template-columns: 1fr;
          }
          .dept-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .systems-select-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .rfq-summary-sidebar {
            border-left: none;
            border-top: 1px solid var(--color-border);
          }
        }

        @media (max-width: 640px) {
          .contact-main-title {
            font-size: 2.2rem;
          }
          .contact-quick-cards-grid, .form-grid-2, .tour-form-grid, .dept-cards-grid {
            grid-template-columns: 1fr;
          }
          .systems-select-grid {
            grid-template-columns: 1fr;
          }
          .rfq-form-area {
            padding: 24px;
          }
          .contact-actions-row {
            flex-direction: column;
          }
          .btn-call-direct, .btn-whatsapp-direct, .btn-rfq-scroll {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

    </div>
  );
}
