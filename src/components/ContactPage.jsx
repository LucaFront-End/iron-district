import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, 
  Upload, FileText, CheckCircle2, ArrowRight, Calendar, 
  ExternalLink, Layers, ChevronDown, Check, Sparkles, Building, AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

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
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState(null);

  // Facility Map Interactive Zone
  const [activeFacilityZone, setActiveFacilityZone] = useState('laser');

  // Tour Scheduler State
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('10:00 AM');
  const [tourType, setTourType] = useState('in-person');
  const [tourBooked, setTourBooked] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const phoneDisplay = "(346) 234 96 40";
  const phoneCallUrl = "tel:13462349640";
  const whatsappUrl = "https://wa.me/13462349640?text=Hello%20Station%20Metalworks%20Team%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20fabrication%20project.";

  const facilityZones = {
    laser: {
      name: isEs ? "Bahía Láser de Fibra 6kW CNC" : "6kW CNC Fiber Laser Bay",
      specs: isEs ? "Cama de corte 4000x2000mm • Precisión ±0.05mm • Corte nitrógeno de alta pureza" : "4000x2000mm bed • ±0.05mm precision • Ultra-clean nitrogen cut",
      leadTech: "Marcus Vance, Lead Laser Programmer",
      status: isEs ? "Operativo al 88% de capacidad" : "Operational at 88% capacity",
      desc: isEs 
        ? "Transformamos chapas y perfiles estructurales de hasta 1 pulgada de espesor con tolerancias de grado aeroespacial." 
        : "Where heavy structural plates up to 1\" thick are cut with aerospace-grade edge quality and zero dross.",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    },
    bending: {
      name: isEs ? "Plegadora Hidráulica CNC 250 Toneladas" : "250-Ton CNC Synchronized Press Brake",
      specs: isEs ? "Control 7 ejes • Repetibilidad angular ±0.2° • Compensación dinámica de flecha" : "7-axis CNC control • ±0.2° angular repeatability • Dynamic crowning",
      leadTech: "Eduardo Ortiz, Master Press Operator",
      status: isEs ? "Operativo" : "Operational",
      desc: isEs
        ? "Conformado preciso de zancas de escaleras mono-viga, barandillas facetadas y perfiles arquitectónicos a medida."
        : "Precision forming of monolithic stair stringers, architectural facias, and structural box sections.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    },
    welding: {
      name: isEs ? "Células Quirúrgicas de Soldadura TIG / MIG" : "TIG/MIG Surgical Clean Welding Bays",
      specs: isEs ? "Soldadores certificados AWS D1.1 y D1.2 • Purga trasera para inox • Pulido sanitario satinado #4" : "AWS D1.1 & D1.2 certified • Back-purged stainless • Sanity #4 satin brush",
      leadTech: "David Kovacs, Quality & Weld Master",
      status: isEs ? "6 bahías activas" : "6 active bays",
      desc: isEs
        ? "Nuestras uniones son invisibles al tacto o resaltadas con cordones TIG de escama de pez perfectos según la estética del diseño."
        : "Seamless structural joins or exposed architectural stack-of-dimes welds ground smooth to perfection.",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80"
    },
    powder: {
      name: isEs ? "Túnel Automatizado Powder Coat de 40 Pies" : "40-Foot Automated Powder Coat & Cure Bay",
      specs: isEs ? "Horno convección 400°F • Polímeros SuperDurable TGIC • Ensayo niebla salina 2,000+ hrs" : "400°F convection cure • SuperDurable TGIC resins • 2,000+ hr salt spray rated",
      leadTech: "Elena Rostova, Finish Specialist",
      status: isEs ? "Secuencia continua" : "Continuous cycle",
      desc: isEs
        ? "Aplicación electrostática de micropulverizado que cura en un acabado ultra resistente al rayado y a la intemperie marina."
        : "Electrostatic application delivering monolithic, marine-grade protective finishes in custom architect-specified sheens.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    },
    dispatch: {
      name: isEs ? "Montaje de Prueba 1:1, Control IBC y Despacho" : "1:1 Pre-Assembly, IBC Inspection & Crating",
      specs: isEs ? "Maquetación en taller antes de envío • Huella de anclaje láser • Encofrado de exportación de alta protección" : "Full dry-fit in shop • Laser verified anchors • Heavy-duty timber crating",
      leadTech: "Carlos Mendez, Field Logistics Lead",
      status: isEs ? "Despachos diarios" : "Daily dispatch",
      desc: isEs
        ? "Cero sorpresas en obra: cada escalera o tramo de baranda se pre-ensambla milimétricamente en taller antes de encajonar."
        : "Zero on-site surprises: every system is pre-assembled on our shop floor before insured nationwide dispatch.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
    }
  };

  const departments = [
    {
      role: isEs ? "Estimación y Licitaciones Comerciales" : "Commercial Estimating & Bid Takeoffs",
      contact: "bids@stationmetalworks.com",
      phoneExt: "Ext. 101",
      lead: "Mark Sterling, PE",
      focus: isEs ? "Para Contratistas Generales, licitaciones CSI Div 05 y proyectos de gran escala." : "For General Contractors, CSI Div 05 specifications, and commercial packages.",
      actionText: isEs ? "Enviar Pliego / Planos" : "Submit Blueprint Package"
    },
    {
      role: isEs ? "Ingeniería de Detalle y Modelado BIM" : "Architectural Engineering & BIM / Revit",
      contact: "bim@stationmetalworks.com",
      phoneExt: "Ext. 104",
      lead: "Ing. Sofia Benitez",
      focus: isEs ? "Modelado 3D, cálculos estructurales con memoria y sellos PE para permisos." : "3D parametric modeling, PE stamped load calculations, and municipal permits.",
      actionText: isEs ? "Consultar con BIM Lead" : "Consult BIM Lead"
    },
    {
      role: isEs ? "Proyectos Residenciales Exclusivos" : "Luxury Residential & Bespoke Design",
      contact: "residential@stationmetalworks.com",
      phoneExt: "Ext. 102",
      lead: "Julian Karr, Design Director",
      focus: isEs ? "Escaleras flotantes, barandillas de autor, portones automatizados de alta gama." : "Floating mono-stringer stairs, artistic guardrails, motorized architectural gates.",
      actionText: isEs ? "Agendar Llamada de Diseño" : "Schedule Design Call"
    },
    {
      role: isEs ? "Tienda Wix y Componentes Modulares" : "Wix Store Logistics & Hardware Orders",
      contact: "orders@stationmetalworks.com",
      phoneExt: "Ext. 108",
      lead: "Operations Desk",
      focus: isEs ? "Seguimiento de pedidos de nuestra tienda online, repuestos y herrajes modulares." : "Tracking online store orders, modular railing components, and hardware kits.",
      actionText: isEs ? "Consultar Pedido" : "Inquire Order"
    }
  ];

  const faqs = [
    {
      q: isEs ? "¿Cuáles son los tiempos habituales de fabricación y entrega?" : "What are your typical fabrication and delivery lead times?",
      a: isEs 
        ? "Para herrajes y componentes estándar de nuestra tienda Wix, el despacho toma de 24 a 48 horas. Para proyectos arquitectónicos a medida (escaleras, barandillas personalizadas, portones), el plazo estándar es de 3 a 5 semanas una vez aprobados los planos ejecutivos (shop drawings)." 
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

  const handleSubmitRfq = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
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
    }, 850);
  };

  const handleBookTour = (e) => {
    e.preventDefault();
    if (!tourDate) return;
    setTourBooked(true);
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
                <p>2400 Industrial Parkway, Suite 100<br />Houston, TX 77032</p>
                <div className="quick-card-sub">
                  {isEs ? "Lun – Vie: 6:00 AM – 5:30 PM CT" : "Mon – Fri: 6:00 AM – 5:30 PM CT"}
                </div>
              </div>

              <div className="quick-card-white">
                <span className="quick-card-tag muted">{isEs ? "CORREO TÉCNICO" : "DIRECT EMAIL"}</span>
                <h4>Engineering Dispatch</h4>
                <a href="mailto:engineering@stationmetalworks.com" className="email-link">
                  engineering@stationmetalworks.com
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
                    { id: 'store', label: isEs ? 'Componentes Tienda Wix / Medida' : 'Custom Modular Store Parts' }
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

      {/* SECTION 3: INTERACTIVE FACILITY BLUEPRINT & WALKTHROUGH SCHEDULER */}
      <section className="facility-blueprint-section">
        <div className="container">
          
          <div className="section-header-center">
            <span className="section-eyebrow-red">
              {isEs ? "TRANSPARENCIA TOTAL EN PLANTA" : "45,000 SQ FT FABRICATION PLANT"}
            </span>
            <h2 className="section-title-white">
              {isEs ? "Explorador de Bahías Técnicas & Visitas Guiadas" : "Interactive Shop Blueprint & Tour Booking"}
            </h2>
            <p className="section-desc-light">
              {isEs 
                ? "Conoce cada etapa de nuestra planta de transformación. Arquitectos y directores de obra son bienvenidos a recorrer nuestras bahías de corte, plegado y pintura." 
                : "Explore our aerospace-grade fabrication line or schedule an in-person walkthrough with our engineering director."}
            </p>
          </div>

          {/* Interactive Zone Navigator Tabs */}
          <div className="facility-tabs-bar">
            {Object.keys(facilityZones).map((zoneKey) => {
              const zone = facilityZones[zoneKey];
              const isActive = activeFacilityZone === zoneKey;
              return (
                <button
                  key={zoneKey}
                  onClick={() => setActiveFacilityZone(zoneKey)}
                  className={`facility-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <span className={`tab-indicator-dot ${isActive ? 'active' : ''}`} />
                  <span>{zone.name.split(' ')[0]} {zone.name.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Zone Card Preview */}
          <div className="facility-preview-card">
            <div className="facility-preview-grid">
              
              <div className="facility-info-side">
                <div className="zone-status-row">
                  <span className="zone-id-tag">ZONE {activeFacilityZone.toUpperCase()}</span>
                  <span className="zone-live-status">
                    <span className="pulsing-green-dot" />
                    {facilityZones[activeFacilityZone].status}
                  </span>
                </div>

                <h3 className="zone-name-title">
                  {facilityZones[activeFacilityZone].name}
                </h3>
                
                <p className="zone-desc-text">
                  {facilityZones[activeFacilityZone].desc}
                </p>

                <div className="zone-specs-box">
                  <div className="spec-row">
                    <span className="spec-label">SPECS:</span>
                    <span className="spec-val">{facilityZones[activeFacilityZone].specs}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">LEAD:</span>
                    <span className="spec-val">{facilityZones[activeFacilityZone].leadTech}</span>
                  </div>
                </div>
              </div>

              <div className="facility-image-side">
                <div className="facility-img-wrapper">
                  <img 
                    src={facilityZones[activeFacilityZone].image} 
                    alt={facilityZones[activeFacilityZone].name}
                    className="facility-img" 
                  />
                  <div className="facility-img-overlay" />
                  <div className="cam-feed-label">
                    <span>LIVE WORKSHOP CAM</span>
                    <span className="feed-status">FEED ACTIVE</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Tour Booking Inline Form */}
          <div className="tour-scheduler-box">
            <div className="tour-scheduler-grid">
              
              <div className="tour-info-col">
                <span className="tour-eyebrow">
                  {isEs ? "AGENDA PRIVADA" : "VIP SHOP WALKTHROUGH"}
                </span>
                <h3 className="tour-title">
                  {isEs ? "Reserva una Visita Técnica al Taller" : "Schedule an In-Person Shop Consultation"}
                </h3>
                <p className="tour-desc">
                  {isEs 
                    ? "Invitamos a arquitectos, diseñadores de interiores y contratistas a evaluar nuestras muestras de materiales, acabados de pintura y tolerancia de soldadura en vivo." 
                    : "Architects and general contractors are welcome to inspect material specimens, weld seams, and powder coating swatches with our principal engineer."}
                </p>
              </div>

              <div className="tour-form-col">
                {tourBooked ? (
                  <div className="tour-confirmed-box">
                    <div className="confirmed-icon">✓</div>
                    <h4>{isEs ? "Visita Solicitada con Éxito" : "Tour Request Confirmed"}</h4>
                    <p>
                      {isEs 
                        ? `Te hemos enviado una confirmación de calendario para el ${tourDate} a las ${tourTime}. Te esperamos en nuestra planta central.` 
                        : `We have sent a calendar invite for ${tourDate} at ${tourTime}. We look forward to welcoming you.`}
                    </p>
                    <button onClick={() => setTourBooked(false)} className="btn-rebook">
                      {isEs ? "Agendar otra fecha" : "Book another slot"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookTour} className="tour-form-grid">
                    <div className="tour-input-group">
                      <label>{isEs ? "Modalidad" : "Tour Type"}</label>
                      <select 
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value)}
                        className="tour-select"
                      >
                        <option value="in-person">{isEs ? "Presencial (Houston HQ)" : "In-Person (Houston HQ)"}</option>
                        <option value="virtual">{isEs ? "Virtual CAD / Zoom 3D" : "Virtual Zoom 3D Walkthrough"}</option>
                      </select>
                    </div>

                    <div className="tour-input-group">
                      <label>{isEs ? "Fecha Preferida" : "Preferred Date"}</label>
                      <input 
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="tour-input"
                      />
                    </div>

                    <div className="tour-input-group">
                      <label>{isEs ? "Horario" : "Time Slot"}</label>
                      <select 
                        value={tourTime}
                        onChange={(e) => setTourTime(e.target.value)}
                        className="tour-select"
                      >
                        <option value="09:00 AM">09:00 AM CT</option>
                        <option value="11:00 AM">11:00 AM CT</option>
                        <option value="02:00 PM">02:00 PM CT</option>
                        <option value="04:00 PM">04:00 PM CT</option>
                      </select>
                    </div>

                    <div className="tour-submit-cell">
                      <button type="submit" className="btn-tour-submit">
                        <span>{isEs ? "Confirmar Reserva" : "Confirm Appointment"}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: DEPARTMENT SPECIALISTS DIRECTORY */}
      <section className="departments-section container">
        <div className="section-header-center">
          <span className="section-eyebrow-red">
            {isEs ? "EQUIPO DIRECTO" : "DIRECT ACCESS"}
          </span>
          <h2 className="section-title-dark">
            {isEs ? "Directorio de Especialistas por Área" : "Department Engineering Directory"}
          </h2>
          <p className="section-desc-dark">
            {isEs 
              ? "Acceso sin rodeos a los ingenieros y jefes de taller encargados de cada división." 
              : "Skip the switchboard. Contact our specialized leads directly for project-specific inquiries."}
          </p>
        </div>

        <div className="dept-cards-grid">
          {departments.map((dept, index) => (
            <div key={index} className="dept-card">
              <div>
                <div className="dept-card-top">
                  <span className="dept-ext-badge">{dept.phoneExt}</span>
                  <span className="dept-active-dot" />
                </div>

                <h3 className="dept-role-title">{dept.role}</h3>
                <div className="dept-lead-name">{dept.lead}</div>
                <p className="dept-focus-desc">{dept.focus}</p>
              </div>

              <div className="dept-card-bottom">
                <a href={`mailto:${dept.contact}`} className="dept-email-link">
                  ✉ {dept.contact}
                </a>
                <a 
                  href={`mailto:${dept.contact}?subject=Inquiry%20from%20Station%20Metalworks%20Site`}
                  className="btn-dept-action"
                >
                  {dept.actionText}
                </a>
              </div>
            </div>
          ))}
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

        .facility-preview-card {
          background: #151A2E;
          border: 1px solid #232B47;
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .facility-preview-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 36px;
          align-items: center;
        }

        .zone-status-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .zone-id-tag {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.12);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(224, 0, 39, 0.25);
        }

        .zone-live-status {
          font-family: monospace;
          font-size: 0.72rem;
          color: #34D399;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pulsing-green-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
        }

        .zone-name-title {
          font-size: 2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 14px 0;
        }

        .zone-desc-text {
          font-size: 0.95rem;
          color: #94A3B8;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .zone-specs-box {
          background: #0B0E1B;
          border: 1px solid #1E293B;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: monospace;
          font-size: 0.75rem;
        }

        .spec-row {
          display: flex;
          gap: 8px;
        }

        .spec-label {
          color: var(--color-accent, #e00027);
          font-weight: 700;
        }

        .spec-val {
          color: #CBD5E1;
        }

        .facility-img-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          border: 1px solid #232B47;
        }

        .facility-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .facility-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(11, 14, 27, 0.8) 0%, transparent 60%);
        }

        .cam-feed-label {
          position: absolute;
          bottom: 12px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.7rem;
          color: #E2E8F0;
        }

        .feed-status {
          color: #34D399;
        }

        .tour-scheduler-box {
          background: linear-gradient(135deg, var(--color-brand-dark, #020032) 0%, #0c0860 100%);
          border: 1px solid #232B47;
          border-radius: 20px;
          padding: 40px;
        }

        .tour-scheduler-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 36px;
          align-items: center;
        }

        .tour-eyebrow {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 6px;
        }

        .tour-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 12px 0;
        }

        .tour-desc {
          font-size: 0.88rem;
          color: #CBD5E1;
          line-height: 1.6;
          margin: 0;
        }

        .tour-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .tour-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tour-input-group label {
          font-family: monospace;
          font-size: 0.68rem;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .tour-select, .tour-input {
          padding: 10px 14px;
          border-radius: 8px;
          background: #0B0E1B;
          border: 1px solid #232B47;
          color: #FFFFFF;
          font-size: 0.82rem;
          font-family: inherit;
        }

        .tour-submit-cell {
          display: flex;
          align-items: flex-end;
        }

        .btn-tour-submit {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: var(--color-accent, #e00027);
          color: #FFF;
          border: none;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s;
        }

        .btn-tour-submit:hover {
          background: #c20022;
        }

        .tour-confirmed-box {
          background: rgba(6, 78, 59, 0.4);
          border: 1px solid #10B981;
          border-radius: 14px;
          padding: 24px;
          text-align: center;
        }

        .confirmed-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #10B981;
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          margin: 0 auto 10px auto;
        }

        .tour-confirmed-box h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px 0;
        }

        .tour-confirmed-box p {
          font-size: 0.8rem;
          color: #D1FAE5;
          margin: 0;
        }

        .btn-rebook {
          background: transparent;
          border: none;
          color: #34D399;
          font-family: monospace;
          font-size: 0.72rem;
          text-decoration: underline;
          cursor: pointer;
          margin-top: 10px;
        }

        /* 4. Departments Directory */
        .departments-section {
          padding: 80px 0;
        }

        .dept-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .dept-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.25s;
        }

        .dept-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-brand-dark, #020032);
          box-shadow: 0 12px 30px rgba(2, 0, 50, 0.08);
        }

        .dept-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .dept-ext-badge {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .dept-active-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
        }

        .dept-role-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 4px 0;
          line-height: 1.25;
        }

        .dept-lead-name {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-muted, #7c829c);
          margin-bottom: 12px;
        }

        .dept-focus-desc {
          font-size: 0.82rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .dept-card-bottom {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid #F1F5F9;
        }

        .dept-email-link {
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-text-secondary, #3b3e54);
          text-decoration: none;
          word-break: break-all;
        }

        .dept-email-link:hover {
          color: var(--color-accent, #e00027);
        }

        .btn-dept-action {
          padding: 9px 12px;
          border-radius: 8px;
          background: #F1F5F9;
          color: var(--color-brand-dark, #020032);
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
        }

        .btn-dept-action:hover {
          background: var(--color-brand-dark, #020032);
          color: #FFF;
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
