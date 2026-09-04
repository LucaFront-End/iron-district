import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

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
      specs: isEs ? "Cama de corte 4000x2000mm • Precisión ±0.05mm • Corte nitrógeno de alta pureza sin rebabas" : "4000x2000mm bed • ±0.05mm precision • Ultra-clean nitrogen cut",
      leadTech: "Marcus Vance, Lead Laser Programmer",
      status: isEs ? "Operativo al 88% de capacidad" : "Operational at 88% capacity",
      desc: isEs 
        ? "Aquí transformamos chapas y perfiles estructurales de hasta 1\" de espesor con tolerancias de grado aeroespacial." 
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
      name: isEs ? "Túnel Automatizado de Pintura Powder Coat de 40 Pies" : "40-Foot Automated Powder Coat & Cure Bay",
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
    }, 900);
  };

  const handleBookTour = (e) => {
    e.preventDefault();
    if (!tourDate) return;
    setTourBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#020032] pt-24 pb-20 selection:bg-[#e00027] selection:text-white">
      
      {/* SECTION 1: COMMAND CENTER & DIRECT CHANNELS HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-12 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(#020032_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{isEs ? "Oficina Técnica & Estimaciones: EN VIVO" : "Engineering & Estimating Desk: ONLINE"}</span>
              <span className="text-emerald-400">|</span>
              <span className="text-emerald-700">{isEs ? "Respuesta < 45 min" : "Avg response < 45 min"}</span>
            </div>

            <div className="text-xs font-mono text-slate-500">
              {isEs ? "CÓDIGO CSI DIVISION: 05 50 00 / 05 70 00" : "CSI SPEC CODES: 05 50 00 / 05 70 00"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#020032] tracking-tight leading-[1.1] mb-6">
                {isEs ? (
                  <>Hablemos de tu Proyecto con <span className="text-[#e00027]">Ingenieros Reales</span></>
                ) : (
                  <>Direct Line to <span className="text-[#e00027]">Master Metalworkers</span> & Engineers</>
                )}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8">
                {isEs 
                  ? "Sin intermediarios ni presupuestos genéricos. Conéctate directamente con nuestro equipo de ingeniería estructural para cotizar proyectos a medida, consultar especificaciones técnicas o agendar una visita a nuestro taller."
                  : "No salespeople, no generic estimates. Connect directly with our structural engineering and fabrication team for rapid blueprint takeoffs, custom fabrication quotes, or workshop walkthroughs."}
              </p>

              {/* Direct Quick Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                <a 
                  href={phoneCallUrl} 
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#020032] text-white font-bold text-base hover:bg-[#0a0750] shadow-lg shadow-[#020032]/10 transition-all transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 text-[#e00027]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{phoneDisplay}</span>
                </a>

                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.768-5.767zm9.969 5.766c0 5.503-4.477 9.98-9.98 9.98-1.748 0-3.385-.453-4.819-1.246l-5.201 1.363 1.391-5.076c-.918-1.512-1.451-3.279-1.451-5.167 0-5.503 4.477-9.98 9.98-9.98 5.503 0 9.98 4.477 9.98 9.98z" />
                  </svg>
                  <span>{isEs ? "WhatsApp Directo" : "Instant WhatsApp"}</span>
                </a>

                <a 
                  href="#rfq-studio" 
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-100 text-[#020032] font-semibold text-base hover:bg-slate-200 border border-slate-300 transition-all"
                >
                  <span>{isEs ? "Subir Planos / RFQ" : "Upload Blueprints"}</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Dispatch Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#020032] text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e00027]/10 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-[#e00027] uppercase font-bold">HQ & FABRICATION</span>
                <h3 className="font-bold text-lg mt-1 mb-1">Station Metalworks</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  2400 Industrial Parkway, Suite 100<br />
                  Houston, TX 77032
                </p>
                <div className="mt-3 text-[11px] font-mono text-slate-400">
                  {isEs ? "Lun – Vie: 6:00 AM – 5:30 PM CT" : "Mon – Fri: 6:00 AM – 5:30 PM CT"}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">{isEs ? "CORREO TÉCNICO" : "DIRECT EMAIL"}</span>
                <h3 className="font-bold text-lg text-[#020032] mt-1 mb-1">Engineering Dispatch</h3>
                <a href="mailto:engineering@stationmetalworks.com" className="text-xs text-[#e00027] font-semibold hover:underline break-all">
                  engineering@stationmetalworks.com
                </a>
                <div className="mt-3 text-[11px] font-mono text-slate-500">
                  {isEs ? "Recepción 24/7 de archivos CAD" : "24/7 CAD & PDF intake"}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">{isEs ? "GARANTÍA SLA" : "SLA COMMITMENT"}</span>
                <h3 className="font-bold text-lg text-[#020032] mt-1 mb-1">&lt; 2 Horas</h3>
                <p className="text-xs text-slate-600">
                  {isEs ? "Revisión preliminar de factibilidad técnica por un ingeniero calculista." : "Same-day preliminary feasibility & budget estimate by a licensed engineer."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">{isEs ? "COBERTURA" : "LOGISTICS"}</span>
                <h3 className="font-bold text-lg text-[#020032] mt-1 mb-1">{isEs ? "Nacional e Int." : "50 States & Global"}</h3>
                <p className="text-xs text-slate-600">
                  {isEs ? "Embalaje reforzado en madera y transporte asegurado a pie de obra." : "Engineered timber crating with dedicated flatbed jobsite delivery."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: INTERACTIVE ARCHITECTURAL RFQ & BLUEPRINT UPLOAD STUDIO */}
      <section id="rfq-studio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          
          <div className="bg-[#020032] px-8 py-6 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#e00027] uppercase tracking-widest mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e00027]" />
                {isEs ? "Estudio Interactivo de Cotizaciones" : "Interactive Blueprint RFQ Studio"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isEs ? "Configurador Técnico de Solicitud (RFQ)" : "Architectural Project Specification Builder"}
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-slate-400">STATION METALWORKS CAD PIPELINE</span>
              <div className="text-sm font-semibold text-slate-200">ISO 9001 / AWS Certified Shop</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Form Column */}
            <form onSubmit={handleSubmitRfq} className="lg:col-span-8 p-6 sm:p-10 space-y-8">
              
              {/* Step 1: Project System Type */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-500 mb-3">
                  01 // {isEs ? "Selecciona el Sistema Arquitectónico" : "Select Architectural System"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'stairs', label: isEs ? 'Escaleras Mono-Viga / Helicoidales' : 'Floating & Spiral Stairs', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                    { id: 'railings', label: isEs ? 'Barandillas de Varilla / Cable' : 'Cable & Rod Railings', icon: 'M4 6h16M4 12h16M4 18h16' },
                    { id: 'glass', label: isEs ? 'Barandillas Vidrio Estructural' : 'Base-Shoe Glass Guardrails', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                    { id: 'gates', label: isEs ? 'Portones de Entrada & Motorización' : 'Architectural Gates & Access', icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z' },
                    { id: 'structural', label: isEs ? 'Estructuras & Pérgolas de Acero' : 'Structural Canopies & Frames', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                    { id: 'store', label: isEs ? 'Componentes Tienda Wix / Medida' : 'Custom Modular Store Parts', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, projectType: item.id })}
                      className={`p-4 rounded-xl text-left border transition-all text-xs font-semibold flex flex-col justify-between min-h-[90px] ${
                        formData.projectType === item.id 
                          ? 'border-[#e00027] bg-[#e00027]/5 text-[#020032] ring-2 ring-[#e00027]/20 shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <svg className={`w-5 h-5 mb-2 ${formData.projectType === item.id ? 'text-[#e00027]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Linear Footage & Scale Interactive Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono tracking-wider uppercase text-slate-500">
                    02 // {isEs ? "Metraje Lineal Estimado (LF)" : "Estimated Linear Footage (LF)"}
                  </label>
                  <span className="font-mono text-sm font-bold text-[#e00027] bg-[#e00027]/10 px-3 py-1 rounded-lg">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#e00027]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>10 LF (Residencial puntual)</span>
                  <span>100 LF (Deck / Balcón grande)</span>
                  <span>350+ LF (Complejo Comercial)</span>
                </div>
              </div>

              {/* Step 3: Material & Finish Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-slate-500 mb-2">
                    03 // {isEs ? "Aleación Metálica" : "Base Metal Alloy"}
                  </label>
                  <select 
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-[#020032] focus:outline-none focus:border-[#020032] focus:ring-1 focus:ring-[#020032]"
                  >
                    <option value="steel">{isEs ? "Acero Estructural A36 Carbon Steel" : "A36 Structural Carbon Steel"}</option>
                    <option value="stainless-304">{isEs ? "Acero Inoxidable 304 (Interior/Seco)" : "304 Architectural Stainless (Interior)"}</option>
                    <option value="stainless-316">{isEs ? "Acero Inoxidable Marino 316 (Costa/Cloro)" : "316 Marine-Grade Stainless (Coastal)"}</option>
                    <option value="aluminum">{isEs ? "Aluminio Billet 6061-T6 (Ligero)" : "6061-T6 Aircraft Billet Aluminum"}</option>
                    <option value="brass">{isEs ? "Latón Arquitectónico / Bronce Satinado" : "Architectural Brass & Bronze"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-slate-500 mb-2">
                    04 // {isEs ? "Acabado Superficial" : "Protective Surface Finish"}
                  </label>
                  <select 
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-[#020032] focus:outline-none focus:border-[#020032] focus:ring-1 focus:ring-[#020032]"
                  >
                    <option value="powder-matte-black">{isEs ? "Powder Coat Negro Mate Arquitectónico (Tiger Drylac)" : "Architectural Matte Black (Tiger Drylac)"}</option>
                    <option value="powder-bronze">{isEs ? "Powder Coat Bronce Anódico / Carbono" : "Anodic Bronze Metallic Powder Coat"}</option>
                    <option value="brushed-satin">{isEs ? "Cepillado Satinado Grano #4 (Inox)" : "#4 Directional Architectural Satin Brush"}</option>
                    <option value="galvanized">{isEs ? "Galvanizado en Caliente ASTM A123" : "Hot-Dip Galvanized ASTM A123"}</option>
                    <option value="raw">{isEs ? "Acero Natural Decapado (Para Taller)" : "Raw Mill-Finish (For local finisher)"}</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Blueprint & CAD File Upload Dropzone */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-slate-500 mb-2">
                  05 // {isEs ? "Adjuntar Planos / Bocetos / Especificaciones (CAD, PDF, STEP)" : "Upload CAD, Blueprints, or Sketches"}
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-[#e00027] rounded-2xl p-6 text-center transition-all bg-slate-50/50 group">
                  <input 
                    type="file" 
                    multiple
                    accept=".pdf,.dwg,.dxf,.step,.stp,.png,.jpg,.jpeg,.zip"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#e00027] group-hover:border-[#e00027] transition-all mb-3 shadow-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-[#020032]">
                      {isEs ? "Haz clic para seleccionar o arrastra archivos aquí" : "Click to select or drag & drop project files"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      DWG • DXF • PDF • STEP • IFC • ZIP (Max 100MB)
                    </p>
                  </div>
                </div>

                {/* Uploaded Files Chips */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="px-2 py-0.5 rounded bg-[#020032] text-white font-bold text-[10px]">{file.type}</span>
                          <span className="truncate font-semibold text-slate-800">{file.name}</span>
                          <span className="text-slate-400">({file.size})</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFile(idx)}
                          className="text-slate-400 hover:text-[#e00027] p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 5: Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-1">{isEs ? "Nombre Completo *" : "Full Name *"}</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Liam Vance"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#020032]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-1">{isEs ? "Correo Electrónico *" : "Email Address *"}</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="liam@vancestudio.com"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#020032]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-1">{isEs ? "Teléfono / Móvil *" : "Phone Number *"}</label>
                  <input 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(346) 234 96 40"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#020032]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-1">{isEs ? "Estudio / Constructora" : "Company / Firm"}</label>
                  <input 
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vance Architectural Partners"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#020032]"
                  />
                </div>
              </div>

              {/* Step 6: Notes */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-1">{isEs ? "Notas del Proyecto y Requerimientos de Código" : "Project Notes & Code Compliance Needs"}</label>
                <textarea 
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isEs ? "Indica alturas de barandilla (36\" o 42\"), tipo de anclaje (core drill, base plate, fascia mount), o si requiere memoria PE." : "Specify rail height (36\" or 42\"), mount type (fascia vs surface), or if PE engineering stamp is required for permitting."}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#020032]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#e00027] text-white font-bold text-base hover:bg-[#c20022] shadow-xl shadow-[#e00027]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>{isEs ? "Procesando Pliego CAD..." : "Processing Blueprint Intake..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isEs ? "Transmitir Solicitud a Oficina Técnica" : "Transmit RFQ to Structural Engineering Desk"}</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Live Spec Summary Sidebar */}
            <div className="lg:col-span-4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#e00027] font-bold mb-2">LIVE SPEC SUMMARY</div>
                <h3 className="text-xl font-bold text-[#020032] mb-6">
                  {isEs ? "Ficha Técnica Resumen" : "Dynamic Takeoff Summary"}
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block font-mono uppercase text-[10px]">{isEs ? "Sistema Seleccionado" : "Selected System"}</span>
                    <span className="font-bold text-sm text-[#020032] capitalize">{formData.projectType}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block font-mono uppercase text-[10px]">{isEs ? "Escala / Metraje" : "Estimated Footage"}</span>
                    <span className="font-bold text-sm text-[#020032]">{formData.linearFootage} LF</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block font-mono uppercase text-[10px]">{isEs ? "Aleación" : "Material Alloy"}</span>
                    <span className="font-bold text-sm text-[#020032] capitalize">{formData.material}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block font-mono uppercase text-[10px]">{isEs ? "Acabado" : "Finish Spec"}</span>
                    <span className="font-bold text-sm text-[#020032] capitalize">{formData.finish.replace(/-/g, ' ')}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-slate-400 block font-mono uppercase text-[10px]">{isEs ? "Documentos Adjuntos" : "Uploaded CAD Files"}</span>
                    <span className="font-bold text-sm text-[#020032]">{uploadedFiles.length} {isEs ? "archivo(s)" : "file(s)"}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-[#020032] text-white">
                  <div className="flex items-center gap-2 text-[#e00027] font-mono text-xs font-bold mb-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{isEs ? "COMPROMISO STATION" : "STATION PROMISE"}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isEs 
                      ? "Plano de taller (Shop Drawing) con sello PE disponible antes de cortar el primer gramo de acero." 
                      : "PE-stamped shop drawings guaranteed before raw stock hits our CNC laser cutting beds."}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block mb-2">{isEs ? "¿NECESITAS ASISTENCIA INMEDIATA?" : "PREFER PHONE DIRECT?"}</span>
                <a href={phoneCallUrl} className="flex items-center gap-2 text-sm font-bold text-[#020032] hover:text-[#e00027] transition-colors">
                  <svg className="w-4 h-4 text-[#e00027]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{phoneDisplay}</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* RFQ SUCCESS MODAL */}
      {submittedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020032]/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl border border-slate-200 relative">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-[#e00027] uppercase tracking-widest">
              {isEs ? "TRANSMISIÓN EXITOSA" : "RFQ TRANSMITTED SUCCESSFULLY"}
            </span>
            <h3 className="text-2xl font-black text-[#020032] mt-1 mb-2">
              {submittedRfq.id}
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {isEs 
                ? `Gracias ${submittedRfq.name}. Tu pliego técnico para ${submittedRfq.projectType} (${submittedRfq.linearFootage} LF) fue asignado a un ingeniero calculista. Te enviaremos el reporte preliminar a ${submittedRfq.email} en menos de 2 horas.`
                : `Thank you ${submittedRfq.name}. Your specification package for ${submittedRfq.projectType} (${submittedRfq.linearFootage} LF) has been routed to an engineering specialist. Expect preliminary feasibility at ${submittedRfq.email} within 2 hours.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <span>{isEs ? "Avisar por WhatsApp" : "Confirm via WhatsApp"}</span>
              </a>
              <button
                onClick={() => setSubmittedRfq(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-[#020032] font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                {isEs ? "Cerrar" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INTERACTIVE FACILITY BLUEPRINT & WALKTHROUGH SCHEDULER */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-[#e00027] tracking-widest uppercase font-bold">
              {isEs ? "TRANSPARENCIA TOTAL EN PLANTA" : "45,000 SQ FT FABRICATION PLANT"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2 mb-4">
              {isEs ? "Explorador de Bahías Técnicas & Visitas Guiadas" : "Interactive Shop Blueprint & Tour Booking"}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              {isEs 
                ? "Conoce cada etapa de nuestra planta de transformación. Arquitectos y directores de obra son bienvenidos a recorrer nuestras bahías de corte, plegado y pintura." 
                : "Explore our aerospace-grade fabrication line or schedule an in-person walkthrough with our engineering director."}
            </p>
          </div>

          {/* Interactive Zone Navigator Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {Object.keys(facilityZones).map((zoneKey) => {
              const zone = facilityZones[zoneKey];
              const isActive = activeFacilityZone === zoneKey;
              return (
                <button
                  key={zoneKey}
                  onClick={() => setActiveFacilityZone(zoneKey)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'bg-[#e00027] text-white shadow-lg shadow-[#e00027]/30 scale-105' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-500'}`} />
                  <span>{zone.name.split(' ')[0]} {zone.name.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Zone Card Preview */}
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-6 sm:p-10 backdrop-blur-xl mb-16 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded bg-[#020032] text-[#e00027] text-xs font-mono font-bold border border-slate-700">
                    ZONE {activeFacilityZone.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {facilityZones[activeFacilityZone].status}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                  {facilityZones[activeFacilityZone].name}
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {facilityZones[activeFacilityZone].desc}
                </p>

                <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex items-start gap-2">
                    <span className="text-[#e00027] font-bold">SPECS:</span>
                    <span>{facilityZones[activeFacilityZone].specs}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">LEAD:</span>
                    <span>{facilityZones[activeFacilityZone].leadTech}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-700 shadow-xl group">
                  <img 
                    src={facilityZones[activeFacilityZone].image} 
                    alt={facilityZones[activeFacilityZone].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-xs font-mono text-slate-300">
                    <span>LIVE WORKSHOP CAM</span>
                    <span className="text-emerald-400">FEED ACTIVE</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Tour Booking Inline Form */}
          <div className="bg-gradient-to-r from-[#020032] to-[#0a0750] border border-slate-700 rounded-3xl p-8 sm:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6">
                <span className="text-xs font-mono text-[#e00027] uppercase tracking-widest font-bold">
                  {isEs ? "AGENDA PRIVADA" : "VIP SHOP WALKTHROUGH"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-2 mb-4">
                  {isEs ? "Reserva una Visita Técnica al Taller" : "Schedule an In-Person Shop Consultation"}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {isEs 
                    ? "Invitamos a arquitectos, diseñadores de interiores y contratistas a evaluar nuestras muestras de materiales, acabados de pintura y tolerancia de soldadura en vivo." 
                    : "Architects and general contractors are welcome to inspect material specimens, weld seams, and powder coating swatches with our principal engineer."}
                </p>
              </div>

              <div className="lg:col-span-6">
                {tourBooked ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      ✓
                    </div>
                    <h4 className="font-bold text-lg text-white mb-1">
                      {isEs ? "Visita Solicitada con Éxito" : "Tour Request Confirmed"}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {isEs 
                        ? `Te hemos enviado una invitación de calendario para el ${tourDate} a las ${tourTime}. Te esperamos en nuestra planta central.` 
                        : `We have sent a calendar invite for ${tourDate} at ${tourTime}. We look forward to welcoming you.`}
                    </p>
                    <button 
                      onClick={() => setTourBooked(false)}
                      className="mt-4 text-xs font-mono text-emerald-400 underline hover:text-emerald-300"
                    >
                      {isEs ? "Agendar otra fecha" : "Book another slot"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookTour} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">{isEs ? "Modalidad" : "Tour Type"}</label>
                      <select 
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#e00027]"
                      >
                        <option value="in-person">{isEs ? "Presencial (Houston HQ)" : "In-Person (Houston HQ)"}</option>
                        <option value="virtual">{isEs ? "Virtual CAD / Zoom 3D" : "Virtual Zoom 3D Walkthrough"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">{isEs ? "Fecha Preferida" : "Preferred Date"}</label>
                      <input 
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#e00027]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">{isEs ? "Horario" : "Time Slot"}</label>
                      <select 
                        value={tourTime}
                        onChange={(e) => setTourTime(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#e00027]"
                      >
                        <option value="09:00 AM">09:00 AM CT</option>
                        <option value="11:00 AM">11:00 AM CT</option>
                        <option value="02:00 PM">02:00 PM CT</option>
                        <option value="04:00 PM">04:00 PM CT</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#e00027] text-white font-bold text-xs hover:bg-[#c20022] transition-all flex items-center justify-center gap-2"
                      >
                        <span>{isEs ? "Confirmar Reserva" : "Confirm Appointment"}</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#e00027] tracking-widest uppercase font-bold">
            {isEs ? "EQUIPO DIRECTO" : "DIRECT ACCESS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#020032] tracking-tight mt-2 mb-4">
            {isEs ? "Directorio de Especialistas por Área" : "Department Engineering Directory"}
          </h2>
          <p className="text-slate-600 text-base">
            {isEs 
              ? "Acceso sin rodeos a los ingenieros y jefes de taller encargados de cada división." 
              : "Skip the switchboard. Contact our specialized leads directly for project-specific inquiries."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#020032] transition-all hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#e00027] bg-[#e00027]/10 px-2 py-0.5 rounded">
                    {dept.phoneExt}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <h3 className="font-bold text-lg text-[#020032] group-hover:text-[#e00027] transition-colors leading-snug mb-1">
                  {dept.role}
                </h3>
                
                <div className="text-xs font-mono text-slate-500 mb-3 font-semibold">
                  {dept.lead}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {dept.focus}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <a 
                  href={`mailto:${dept.contact}`} 
                  className="block text-xs font-mono text-slate-700 hover:text-[#e00027] truncate font-medium"
                >
                  ✉ {dept.contact}
                </a>
                <a 
                  href={`mailto:${dept.contact}?subject=Inquiry%20from%20Station%20Metalworks%20Site`}
                  className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-[#020032] hover:text-white text-[#020032] font-semibold text-xs transition-colors text-center block"
                >
                  {dept.actionText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: 2-HOUR SLA GUARANTEE & ARCHITECTURAL FAQS */}
      <section className="bg-slate-100 border-t border-slate-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* SLA Badge & Statement */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[#e00027]/10 text-[#e00027] flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <span className="text-xs font-mono text-[#e00027] uppercase tracking-widest font-bold">
                {isEs ? "COMPROMISO CONTRACTUAL" : "RAPID RESPONSE SLA"}
              </span>

              <h3 className="text-2xl font-black text-[#020032] mt-1 mb-3">
                {isEs ? "Garantía de Respuesta en Menos de 2 Horas" : "The 2-Hour Feasibility Guarantee"}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {isEs 
                  ? "Entendemos la presión de los plazos de licitación y los calendarios de obra. Cuando envías tus planos a Station Metalworks durante el horario laboral, un ingeniero especialista revisa las cargas, las tolerancias de anclaje y te devuelve feedback estructurado en menos de 120 minutos."
                  : "We understand commercial tender deadlines and critical path site milestones. When you submit drawing sets to Station Metalworks during business hours, an actual metal fabrication engineer reviews structural spans and attachment feasibility within 120 minutes."}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2 text-slate-700">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <span>✓</span> {isEs ? "Revisión técnica de anclajes a obra" : "Site anchor substrate evaluation"}
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <span>✓</span> {isEs ? "Desglose preliminar de costos y metraje" : "Preliminary cost and linear takeoff"}
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <span>✓</span> {isEs ? "Cumplimiento con código IBC 200 lb" : "IBC 200 lb load check recommendation"}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">STATION METALWORKS</span>
                <a href={whatsappUrl} className="text-xs font-bold text-[#e00027] hover:underline flex items-center gap-1">
                  <span>{isEs ? "Chatear Ahora" : "Chat on WhatsApp"}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono text-[#e00027] tracking-widest uppercase font-bold">
                {isEs ? "RESOLVEMOS TUS DUDAS" : "SPECIFICATION & PRODUCTION"}
              </span>
              <h2 className="text-3xl font-black text-[#020032] tracking-tight mt-1 mb-8">
                {isEs ? "Preguntas Frecuentes de Arquitectos y Contratistas" : "Frequently Asked Architectural Questions"}
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div 
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-[#020032] hover:text-[#e00027] transition-colors"
                      >
                        <span>{faq.q}</span>
                        <span className={`text-xl font-mono text-slate-400 transition-transform ${isOpen ? 'rotate-45 text-[#e00027]' : ''}`}>
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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

    </div>
  );
}
