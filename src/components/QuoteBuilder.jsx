import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  UploadCloud, MessageSquare, PhoneCall, Check, Loader2, FileText, 
  ChevronRight, ChevronLeft, ShieldCheck, Building2, TrendingUp, 
  Columns, Activity, DoorClosed, Sparkles, MapPin, User, Mail, Phone,
  ExternalLink, ArrowRight, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cmsService } from '../services/cmsService';

export default function QuoteBuilder() {
  const { language, t } = useLanguage();
  const isEs = language === 'es';
  const fileInputRef = useRef(null);

  // Stepper state: 1 (Client Data), 2 (Services), 3 (Project & Files)
  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    // Step 1: Contact
    name: '',
    email: '',
    phone: '',
    city: 'Houston, TX',
    clientType: 'homeowner', // 'homeowner' | 'general_contractor' | 'architect' | 'commercial'
    // Step 2: Services
    services: ['stairs'], // array of selected services
    projectScope: 'residential', // 'residential' | 'commercial'
    // Step 3: Project Notes & Files
    message: '',
    priority: 'standard' // 'standard' | 'fast'
  });

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState(null);

  // 5 Core Workshop Services matching the site
  const workshopServices = [
    {
      id: 'stairs',
      titleEn: 'Staircase Systems',
      titleEs: 'Sistemas de Escaleras',
      subEn: 'Cantilevered, floating, helical & double stringer stairs',
      subEs: 'Monoviga, flotantes, helicoidales y zancas estructurales',
      icon: <TrendingUp size={22} className="service-card-icon" />
    },
    {
      id: 'railings',
      titleEn: 'Railing Systems',
      titleEs: 'Sistemas de Barandales',
      subEn: 'Marine-grade 316 cable, base-shoe glass & vertical picket',
      subEs: 'Cable marino 316, vidrio templado base-shoe y perfiles verticales',
      icon: <Columns size={22} className="service-card-icon" />
    },
    {
      id: 'handrails',
      titleEn: 'ADA Handrails',
      titleEs: 'Pasamanos Continuos ADA',
      subEn: 'Seamless 1.5" round & rectangular continuous graspable rails',
      subEs: 'Tubular 1.5" continuo, curvado mandril sin aristas, norma ADA',
      icon: <Activity size={22} className="service-card-icon" />
    },
    {
      id: 'gates',
      titleEn: 'Gates & Pivot Doors',
      titleEs: 'Portones y Puertas de Autor',
      subEn: 'Automated driveway cantilever gates & 12-ft monolithic pivot doors',
      subEs: 'Portones automatizados correderos y puertas pivotantes monolíticas',
      icon: <DoorClosed size={22} className="service-card-icon" />
    },
    {
      id: 'custom',
      titleEn: 'Custom Metalwork & Tables',
      titleEs: 'Fabricación Especial & Mesas',
      subEn: 'Monolithic blackened steel tables, CNC laser cutting & architectural iron',
      subEs: 'Mesas de autor pavonadas, corte láser CNC y estructuras de diseño',
      icon: <Sparkles size={22} className="service-card-icon" />
    }
  ];

  // Initialize unique lead ID on mount
  useEffect(() => {
    if (!leadId) {
      const code = 'SM-RFQ-' + Math.floor(1000 + Math.random() * 9000);
      setLeadId(code);
    }
  }, [leadId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle service in Step 2
  const toggleService = (srvId) => {
    setFormData((prev) => {
      const exists = prev.services.includes(srvId);
      if (exists) {
        if (prev.services.length === 1) return prev; // keep at least one
        return { ...prev, services: prev.services.filter(s => s !== srvId) };
      } else {
        return { ...prev, services: [...prev.services, srvId] };
      }
    });
  };

  // File Upload Handlers (Step 3)
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles) => {
    if (newFiles.length === 0) return;
    setIsUploading(true);

    setTimeout(() => {
      const processed = newFiles.map((file) => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        id: Math.random().toString(36).substr(2, 9),
        type: file.type
      }));
      setFiles((prev) => [...prev, ...processed]);
      setIsUploading(false);
    }, 800);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Step 1 -> Step 2: Auto-save draft to CMS!
  const goToStep2 = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      alert(isEs ? 'Por favor ingresa tu nombre completo.' : 'Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      alert(isEs ? 'Por favor ingresa tu correo electrónico.' : 'Please enter your email address.');
      return;
    }

    // Save lead draft in CMS
    cmsService.saveLead({
      id: leadId,
      status: 'draft_step1',
      client: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        clientType: formData.clientType
      },
      services: formData.services,
      projectScope: formData.projectScope,
      priority: formData.priority,
      message: formData.message,
      files: files
    });

    setStep(2);
  };

  // Step 2 -> Step 3: Update draft in CMS
  const goToStep3 = () => {
    cmsService.saveLead({
      id: leadId,
      status: 'draft_step1',
      client: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        clientType: formData.clientType
      },
      services: formData.services,
      projectScope: formData.projectScope,
      priority: formData.priority,
      message: formData.message,
      files: files
    });
    setStep(3);
  };

  // Step 3 -> Final Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const finalLead = cmsService.saveLead({
        id: leadId,
        status: 'new', // Completed quote request ready for workshop review
        client: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          clientType: formData.clientType
        },
        services: formData.services,
        projectScope: formData.projectScope,
        priority: formData.priority,
        message: formData.message,
        files: files
      });

      setIsSubmitting(false);
      setSubmittedLeadId(leadId);
      setSubmitSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    const newCode = 'SM-RFQ-' + Math.floor(1000 + Math.random() * 9000);
    setLeadId(newCode);
    setSubmitSuccess(false);
    setStep(1);
    setFiles([]);
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: 'Houston, TX',
      clientType: 'homeowner',
      services: ['stairs'],
      projectScope: 'residential',
      message: '',
      priority: 'standard'
    });
  };

  return (
    <section className="quote-section" id="quote">
      <div className="gradient-radial-glow pulse-glow" style={{ top: '15%', left: '8%', width: '380px', height: '380px' }}></div>
      
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="tag-label">
            <UploadCloud className="pulse-glow" size={14} />
            {isEs ? 'COTIZADOR DE TALLER // RFQ ESTUDIO' : 'WORKSHOP ESTIMATOR // RFQ STUDIO'}
          </span>
          <h2 className="text-gradient">
            {isEs ? 'Solicita tu Cotización de Fabricación' : 'Request Your Custom Fabrication Quote'}
          </h2>
          <p>
            {isEs 
              ? 'Conectamos directamente con nuestro taller en Houston. Ingresa tus datos, selecciona tus servicios y cuéntanos sobre tu obra para recibir una estimación técnica en 24 horas.' 
              : 'Direct connection to our Houston custom shop. Enter your details, choose your services, and submit your project specs for engineering review within 24 hours.'}
          </p>
        </div>

        {/* Dynamic Stepper Bar */}
        <div className="stepper-indicator-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
            <span className="dot-number">01</span>
            <span className="dot-label">{isEs ? 'Datos de Contacto' : 'Contact Data'}</span>
          </div>
          <div className="step-line-connector">
            <div className="connector-fill" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          </div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`} onClick={() => { if (formData.name && formData.email) setStep(2); }}>
            <span className="dot-number">02</span>
            <span className="dot-label">{isEs ? 'Servicios' : 'Services'}</span>
          </div>
          <div className="step-line-connector">
            <div className="connector-fill" style={{ width: step === 3 ? '100%' : '0%' }}></div>
          </div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`} onClick={() => { if (formData.name && formData.email) setStep(3); }}>
            <span className="dot-number">03</span>
            <span className="dot-label">{isEs ? 'Proyecto & Planos' : 'Project Details'}</span>
          </div>
        </div>

        {/* Main Grid Layout: Form Left, HUD Summary Right */}
        <div className="quote-grid">
          
          {/* Main Multistep Form Casing */}
          <div className="quote-form-container glass-panel">
            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <form className="quote-form" onSubmit={(e) => e.preventDefault()}>
                  
                  {/* =========================================================
                      PASO 1: Datos del Cliente (Guarda en CMS)
                     ========================================================= */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="step-casing"
                    >
                      <div className="step-header-banner">
                        <span className="step-count-pill">{isEs ? 'PASO 1 DE 3' : 'STEP 1 OF 3'}</span>
                        <h3 className="step-title">{isEs ? 'Tus Datos de Contacto' : 'Your Contact Details'}</h3>
                        <p className="step-desc">
                          {isEs 
                            ? 'Esta información se registrará de inmediato en nuestro sistema para que nuestro equipo técnico pueda comunicarse contigo.'
                            : 'Your information is recorded directly into our workshop pipeline so our engineering staff can contact you.'}
                        </p>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label">{isEs ? 'Nombre Completo *' : 'Full Name *'}</label>
                          <div className="input-with-icon">
                            <User size={16} className="input-icon" />
                            <input 
                              type="text" 
                              name="name" 
                              required 
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder={isEs ? 'Ej. Marcus Vance' : 'e.g. Marcus Vance'}
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">{isEs ? 'Correo Electrónico *' : 'Email Address *'}</label>
                          <div className="input-with-icon">
                            <Mail size={16} className="input-icon" />
                            <input 
                              type="email" 
                              name="email" 
                              required 
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="marcus@example.com"
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label">{isEs ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}</label>
                          <div className="input-with-icon">
                            <Phone size={16} className="input-icon" />
                            <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange} 
                              placeholder="+1 (346) 234-9640"
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">{isEs ? 'Ciudad y Estado' : 'City & State'}</label>
                          <div className="input-with-icon">
                            <MapPin size={16} className="input-icon" />
                            <input 
                              type="text" 
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange} 
                              placeholder="Houston, TX"
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Client Type Selector */}
                      <div className="form-group" style={{ marginTop: '6px' }}>
                        <label className="form-section-title">{isEs ? '¿En calidad de qué solicitas este proyecto?' : 'What best describes your role?'}</label>
                        <div className="client-role-grid">
                          {[
                            { id: 'homeowner', labelEn: 'Homeowner', labelEs: 'Propietario' },
                            { id: 'general_contractor', labelEn: 'General Contractor (GC)', labelEs: 'Constructor General' },
                            { id: 'architect', labelEn: 'Architect / Designer', labelEs: 'Arquitecto / Diseñador' },
                            { id: 'commercial', labelEn: 'Commercial / Developer', labelEs: 'Empresa / Comercial' }
                          ].map(role => (
                            <div 
                              key={role.id}
                              className={`role-select-card ${formData.clientType === role.id ? 'active' : ''}`}
                              onClick={() => setFieldValue('clientType', role.id)}
                            >
                              <span className="role-radio">
                                {formData.clientType === role.id && <Check size={12} />}
                              </span>
                              <span className="role-text">{isEs ? role.labelEs : role.labelEn}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation to Step 2 */}
                      <div className="form-navigation-row" style={{ marginTop: '24px' }}>
                        <div className="cms-autosave-indicator">
                          <ShieldCheck size={14} className="text-emerald" />
                          <span>{isEs ? 'Los datos se guardan en el CMS' : 'Auto-saved to Workshop CMS'}</span>
                        </div>
                        <button type="button" className="btn btn-primary nav-step-btn" onClick={goToStep2}>
                          <span>{isEs ? 'Continuar a Servicios' : 'Continue to Services'}</span>
                          <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      PASO 2: Selección de Servicios (Nombre + Icono de la web)
                     ========================================================= */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="step-casing"
                    >
                      <div className="step-header-banner">
                        <span className="step-count-pill">{isEs ? 'PASO 2 DE 3' : 'STEP 2 OF 3'}</span>
                        <h3 className="step-title">{isEs ? 'Selecciona los Servicios que Necesitas' : 'Select Required Services'}</h3>
                        <p className="step-desc">
                          {isEs 
                            ? 'Elige las disciplinas de forja y acero que requiere tu obra. Puedes seleccionar varias opciones.' 
                            : 'Select the metal fabrication disciplines required for your project. You can choose multiple options.'}
                        </p>
                      </div>

                      {/* Project Scope: Residential / Commercial */}
                      <div className="form-group">
                        <label className="form-section-title">{isEs ? 'Alcance del Proyecto' : 'Project Scope'}</label>
                        <div className="project-type-cards">
                          <div 
                            className={`type-select-card ${formData.projectScope === 'residential' ? 'active' : ''}`}
                            onClick={() => setFieldValue('projectScope', 'residential')}
                          >
                            <span className="type-check">{formData.projectScope === 'residential' && <Check size={12} />}</span>
                            <span className="type-name">{isEs ? 'Residencial de Autor' : 'Custom Residential'}</span>
                          </div>
                          <div 
                            className={`type-select-card ${formData.projectScope === 'commercial' ? 'active' : ''}`}
                            onClick={() => setFieldValue('projectScope', 'commercial')}
                          >
                            <span className="type-check">{formData.projectScope === 'commercial' && <Check size={12} />}</span>
                            <span className="type-name">{isEs ? 'Comercial & Alto Tránsito' : 'Commercial & High-Traffic'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Core Workshop Services Selection Cards */}
                      <div className="form-group" style={{ marginTop: '14px' }}>
                        <label className="form-section-title">
                          {isEs ? 'Disciplinas de Taller de Station Metalworks' : 'Station Metalworks Workshop Disciplines'}
                        </label>
                        <div className="services-selection-grid">
                          {workshopServices.map((srv) => {
                            const isSelected = formData.services.includes(srv.id);
                            return (
                              <div 
                                key={srv.id}
                                className={`service-select-box ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleService(srv.id)}
                              >
                                <div className="service-box-header">
                                  <div className="service-box-icon-wrap">
                                    {srv.icon}
                                  </div>
                                  <span className="service-box-check">
                                    {isSelected && <Check size={13} />}
                                  </span>
                                </div>
                                <div className="service-box-content">
                                  <h4 className="service-box-title">
                                    {isEs ? srv.titleEs : srv.titleEn}
                                  </h4>
                                  <p className="service-box-sub">
                                    {isEs ? srv.subEs : srv.subEn}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Navigation: Back / Continue */}
                      <div className="form-navigation-row" style={{ marginTop: '24px' }}>
                        <button type="button" className="btn btn-secondary nav-step-btn" onClick={() => setStep(1)}>
                          <ChevronLeft size={14} style={{ marginRight: '4px' }} />
                          <span>{isEs ? 'Atrás' : 'Back'}</span>
                        </button>
                        <button type="button" className="btn btn-primary nav-step-btn" onClick={goToStep3}>
                          <span>{isEs ? 'Continuar a Detalles & Planos' : 'Continue to Details & Plans'}</span>
                          <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      PASO 3: Detalles del Proyecto & Subir Imagen Opcional
                     ========================================================= */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="step-casing"
                    >
                      <div className="step-header-banner">
                        <span className="step-count-pill">{isEs ? 'PASO 3 DE 3' : 'STEP 3 OF 3'}</span>
                        <h3 className="step-title">{isEs ? 'Cuéntanos sobre tu Proyecto & Planos' : 'Project Details & Blueprints'}</h3>
                        <p className="step-desc">
                          {isEs 
                            ? 'Agrega detalles de tu obra y, si lo deseas, sube fotos, planos o bocetos (opcional) para afinar la cotización.' 
                            : 'Provide additional parameters and optionally upload blueprints, field sketches or photos to refine your quote.'}
                        </p>
                      </div>

                      {/* Project Message Textarea */}
                      <div className="form-group">
                        <label className="form-section-title">{isEs ? 'Detalles o Requerimientos de la Obra' : 'Project Details & Requirements'}</label>
                        <textarea 
                          name="message" 
                          rows="4" 
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder={isEs 
                            ? 'Cuéntanos dimensiones aproximadas, plazo de tiempo deseado, preferencias de acabado (acero negro, inox 316, pintura en polvo) o cualquier duda técnica...'
                            : 'Describe approximate dimensions, target installation timeframe, finish preferences (blackened steel, 316 stainless, powder coat) or technical questions...'}
                          className="form-text-area"
                        ></textarea>
                      </div>

                      {/* Optional File Upload Zone */}
                      <div className="form-group">
                        <label className="form-section-title">
                          {isEs ? 'Subir Planos, Fotos o Bocetos (Opcional)' : 'Upload Drawings, Photos or Blueprints (Optional)'}
                        </label>
                        <div 
                          className={`uploader-zone ${isUploading ? 'uploading' : ''}`}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current.click()}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            multiple 
                            style={{ display: 'none' }} 
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.dwg,.dxf"
                          />
                          {isUploading ? (
                            <div className="uploader-loading">
                              <Loader2 className="spinner" size={24} />
                              <span>{isEs ? 'Cargando archivos...' : 'Uploading files...'}</span>
                            </div>
                          ) : (
                            <>
                              <UploadCloud className="uploader-icon" size={26} />
                              <p className="uploader-text">
                                {isEs 
                                  ? 'Arrastra aquí fotos del espacio, planos PDF o bocetos a mano (o haz clic para explorar)'
                                  : 'Drag & drop photos, PDF blueprints or sketches here (or click to browse)'}
                              </p>
                              <span className="uploader-sub">PNG, JPG, PDF, DWG (Max 15MB)</span>
                            </>
                          )}
                        </div>

                        {/* Files list preview */}
                        {files.length > 0 && (
                          <div className="uploaded-files-list">
                            {files.map((file) => (
                              <div key={file.id} className="file-item">
                                <div className="file-info">
                                  <FileText size={15} className="text-crimson" />
                                  <span className="file-name">{file.name}</span>
                                  <span className="file-size-pill">{file.size}</span>
                                </div>
                                <button type="button" onClick={() => removeFile(file.id)} className="file-remove-btn" title="Remove">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Priority Queue Selector */}
                      <div className="form-group priority-queue-casing">
                        <label className="form-section-title">{isEs ? 'Prioridad de Revisión Técnica en Taller' : 'Workshop Engineering Priority'}</label>
                        <div className="priority-options">
                          <div 
                            className={`priority-pill ${formData.priority === 'standard' ? 'active' : ''}`}
                            onClick={() => setFieldValue('priority', 'standard')}
                          >
                            <span className="priority-check">{formData.priority === 'standard' && <Check size={12} />}</span>
                            <span>{isEs ? 'Estándar (Revisión técnica en 48-72h)' : 'Standard Queue (48-72h Technical Review)'}</span>
                          </div>
                          <div 
                            className={`priority-pill active-fast ${formData.priority === 'fast' ? 'active' : ''}`}
                            onClick={() => setFieldValue('priority', 'fast')}
                          >
                            <span className="priority-check green">{formData.priority === 'fast' && <Check size={12} />}</span>
                            <span className="fast-text">{isEs ? '⚡ Cola Rápida de Taller (Revisión en 24h - Gratis)' : '⚡ Rapid Shop Queue (24h Review - Free)'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation: Back / Submit */}
                      <div className="form-navigation-row" style={{ marginTop: '24px' }}>
                        <button type="button" className="btn btn-secondary nav-step-btn" onClick={() => setStep(2)} disabled={isSubmitting}>
                          <ChevronLeft size={14} style={{ marginRight: '4px' }} />
                          <span>{isEs ? 'Atrás' : 'Back'}</span>
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={handleSubmit}
                          className="btn btn-primary nav-step-btn submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="spinner" size={14} style={{ marginRight: '6px' }} />
                              <span>{isEs ? 'Registrando en Taller...' : 'Submitting to Shop...'}</span>
                            </>
                          ) : (
                            <>
                              <span>{isEs ? 'Enviar Solicitud al Taller' : 'Submit RFQ Request'}</span>
                              <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                </form>
              ) : (
                /* =========================================================
                   CONFIRMACIÓN EXITOSA
                   ========================================================= */
                <motion.div 
                  key="success"
                  className="form-success-message"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="success-icon-box">
                    <Check size={40} />
                  </div>
                  
                  <span className="success-code-tag">{submittedLeadId}</span>
                  <h3 className="success-title">
                    {isEs ? '¡Solicitud Recibida en Taller!' : 'Quote Request Received at Workshop!'}
                  </h3>
                  
                  <p className="success-desc">
                    {isEs 
                      ? `Gracias ${formData.name}. Tu solicitud se ha guardado en nuestro sistema CMS con el código ${submittedLeadId}. José Almanza y nuestro equipo técnico de soldadura revisarán los requerimientos para responderte a la brevedad.`
                      : `Thank you ${formData.name}. Your inquiry is logged in our CMS under reference ${submittedLeadId}. Master fabricator José Almanza and our engineering team will review your specifications shortly.`}
                  </p>

                  <div className="success-actions-cluster">
                    <a 
                      href={`https://wa.me/13462349640?text=${encodeURIComponent(
                        isEs 
                          ? `Hola José / Station Metalworks, acabo de enviar la solicitud de cotización ${submittedLeadId} a través de la web.`
                          : `Hello José / Station Metalworks, I just submitted RFQ ${submittedLeadId} through your website.`
                      )}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-success-wa"
                    >
                      <MessageSquare size={16} />
                      <span>{isEs ? 'Avisar por WhatsApp (+1 346 234 9640)' : 'Chat on WhatsApp (+1 346 234 9640)'}</span>
                    </a>

                    <a href="#/cms" className="btn-success-cms">
                      <ShieldCheck size={16} />
                      <span>{isEs ? 'Ver Solicitud en Panel CMS' : 'Inspect in CMS Dashboard'}</span>
                    </a>

                    <button 
                      onClick={handleResetForm} 
                      className="btn-success-new"
                    >
                      {isEs ? 'Nueva Solicitud' : 'Start Another Request'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Live Estimate HUD Overview Summary
             ========================================================= */}
          <div className="quote-info-card glass-panel">
            <div className="schematic-corner tl"></div>
            <div className="schematic-corner tr"></div>
            <div className="schematic-corner bl"></div>
            <div className="schematic-corner br"></div>

            <div className="hud-card-header">
              <h3 className="text-gradient">
                {isEs ? 'Resumen de Solicitud en Vivo' : 'Live Estimate Overview'}
              </h3>
              <span className="hud-lead-ref">{leadId}</span>
            </div>
            
            {/* Live Parameter HUD Summary */}
            <div className="live-parameter-hud">
              {/* Client Info */}
              <div className="hud-row">
                <span className="hud-lbl">{isEs ? 'CLIENTE' : 'CLIENT'}</span>
                <span className="hud-val highlight">
                  {formData.name.trim() ? formData.name : (isEs ? '(Paso 1 pendiente)' : '(Step 1 pending)')}
                </span>
              </div>

              {/* City / Location */}
              <div className="hud-row">
                <span className="hud-lbl">{isEs ? 'UBICACIÓN' : 'LOCATION'}</span>
                <span className="hud-val font-code">
                  {formData.city}
                </span>
              </div>

              {/* Scope */}
              <div className="hud-row">
                <span className="hud-lbl">{isEs ? 'TIPO DE OBRA' : 'PROJECT SCOPE'}</span>
                <span className="hud-val">
                  {formData.projectScope === 'commercial' 
                    ? (isEs ? 'COMERCIAL' : 'COMMERCIAL') 
                    : (isEs ? 'RESIDENCIAL' : 'RESIDENTIAL')}
                </span>
              </div>

              {/* Selected Services Cluster */}
              <div className="hud-row flex-col">
                <span className="hud-lbl">{isEs ? 'SERVICIOS SELECCIONADOS' : 'SELECTED SERVICES'}</span>
                <div className="hud-services-tags">
                  {formData.services.map((srvId) => {
                    const match = workshopServices.find(s => s.id === srvId);
                    return (
                      <span key={srvId} className="hud-service-chip">
                        <Check size={11} className="text-crimson" />
                        <span>{match ? (isEs ? match.titleEs : match.titleEn) : srvId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div className="hud-row">
                <span className="hud-lbl">{isEs ? 'COLA DE TALLER' : 'QUEUE PRIORITY'}</span>
                <span className={`hud-val highlight ${formData.priority === 'fast' ? 'green' : ''}`}>
                  {formData.priority === 'fast' 
                    ? (isEs ? '⚡ PRIORIDAD 24H' : '⚡ 24H RAPID') 
                    : (isEs ? 'ESTÁNDAR' : 'STANDARD')}
                </span>
              </div>

              {/* Files Uploaded Counter */}
              {files.length > 0 && (
                <div className="hud-row flex-col">
                  <span className="hud-lbl">{isEs ? 'PLANOS / FOTOS ADJUNTAS' : 'ATTACHED FILES'}</span>
                  <div className="hud-files-preview">
                    {files.map(f => (
                      <span key={f.id} className="hud-file-tag">
                        <FileText size={11} />
                        {f.name.length > 18 ? f.name.substring(0, 16) + '...' : f.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Contact Buttons */}
            <div className="contact-actions">
              <a 
                href="https://wa.me/13462349640" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-btn wa-btn"
              >
                <MessageSquare size={18} />
                <span>WhatsApp (+1 346 234 9640)</span>
              </a>

              <a href="tel:+13462349640" className="contact-btn call-btn">
                <PhoneCall size={18} />
                <span>(346) 234 96 40</span>
              </a>
            </div>

            {/* Workshop Headquarters Info */}
            <div className="contact-info-list">
              <div className="info-row">
                <span className="info-label">{isEs ? 'HORARIO DE TALLER:' : 'SHOP HOURS:'}</span>
                <span className="info-val">Mon - Fri, 8AM - 6PM CST</span>
              </div>
              <div className="info-row">
                <span className="info-label">{isEs ? 'TIEMPO DE RESPUESTA:' : 'RESPONSE TIME:'}</span>
                <span className="info-val">{isEs ? 'Menos de 2 horas' : 'Under 2 hours'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{isEs ? 'SEDE & TALLER:' : 'HEADQUARTERS:'}</span>
                <span className="info-val">Houston, TX</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Scoped CSS */}
      <style>{`
        .quote-section {
          background-color: var(--color-bg);
          padding-top: 90px;
          padding-bottom: 110px;
          position: relative;
        }

        .quote-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 36px;
          margin-top: 36px;
        }

        /* Multistep Stepper Indicator */
        .stepper-indicator-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 600px;
          margin: 30px auto 10px auto;
          position: relative;
        }

        .step-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          cursor: pointer;
        }

        .dot-number {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-weight: 800;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .step-dot.active .dot-number {
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 0 14px rgba(224, 0, 39, 0.4);
        }

        .dot-label {
          font-family: monospace;
          font-size: 0.68rem;
          margin-top: 6px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .step-dot.active .dot-label {
          color: var(--color-brand-dark, #020032);
        }

        .step-line-connector {
          flex: 1;
          height: 2px;
          background: var(--color-border);
          margin: 0 10px;
          margin-top: -16px;
          position: relative;
          overflow: hidden;
        }

        .connector-fill {
          height: 100%;
          background: var(--color-accent, #e00027);
          width: 0%;
          transition: width 0.3s ease;
        }

        /* Multistep Form Container */
        .quote-form-container {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 34px 32px;
          box-shadow: 0 8px 30px rgba(2, 0, 50, 0.04);
        }

        .step-casing {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .step-header-banner {
          margin-bottom: 8px;
        }

        .step-count-pill {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .step-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 8px 0 4px 0;
        }

        .step-desc {
          font-size: 0.85rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.5;
          margin: 0;
        }

        .form-section-title {
          font-family: monospace;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--color-brand-dark, #020032);
          font-weight: 800;
          margin-bottom: 6px;
          display: block;
          letter-spacing: 0.04em;
        }

        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .form-input {
          width: 100%;
          padding: 11px 14px 11px 38px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.88rem;
          color: var(--color-brand-dark, #020032);
          outline: none;
          transition: all 0.2s ease;
          background: #FFFFFF;
        }

        .form-input:focus {
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 0 0 3px rgba(224, 0, 39, 0.1);
        }

        /* Client Role Selection */
        .client-role-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .role-select-card {
          border: 1px solid var(--color-border);
          background: #F8FAFC;
          padding: 12px 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .role-select-card:hover {
          border-color: var(--color-accent, #e00027);
        }

        .role-select-card.active {
          border-color: var(--color-brand-dark, #020032);
          background: #FFFFFF;
          box-shadow: 0 4px 12px rgba(2, 0, 50, 0.05);
        }

        .role-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }

        .role-select-card.active .role-radio {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
          color: #FFFFFF;
        }

        .role-text {
          font-size: 0.80rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        /* Scope Cards */
        .project-type-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .type-select-card {
          border: 1px solid var(--color-border);
          background: #F8FAFC;
          padding: 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .type-select-card:hover {
          border-color: var(--color-accent, #e00027);
        }

        .type-select-card.active {
          border-color: var(--color-brand-dark, #020032);
          background: #FFFFFF;
          box-shadow: 0 4px 12px rgba(2, 0, 50, 0.05);
        }

        .type-check {
          width: 18px;
          height: 18px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }

        .type-select-card.active .type-check {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
          color: #FFFFFF;
        }

        .type-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        /* Services Selection Cards Grid */
        .services-selection-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .service-select-box {
          border: 1px solid var(--color-border);
          background: #F8FAFC;
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .service-select-box:hover {
          border-color: var(--color-accent, #e00027);
          background: #FFFFFF;
        }

        .service-select-box.selected {
          border-color: var(--color-brand-dark, #020032);
          background: #FFFFFF;
          box-shadow: 0 4px 16px rgba(2, 0, 50, 0.06);
          border-left: 4px solid var(--color-accent, #e00027);
        }

        .service-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-box-icon-wrap {
          color: var(--color-accent, #e00027);
        }

        .service-box-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
        }

        .service-select-box.selected .service-box-check {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
          color: #FFFFFF;
        }

        .service-box-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0 0 2px 0;
        }

        .service-box-sub {
          font-size: 0.78rem;
          color: var(--color-text-secondary, #3b3e54);
          margin: 0;
          line-height: 1.4;
        }

        /* Step 3 Styling */
        .form-text-area {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.88rem;
          color: var(--color-brand-dark, #020032);
          outline: none;
          background: #FFFFFF;
          resize: vertical;
          font-family: inherit;
          line-height: 1.5;
        }

        .form-text-area:focus {
          border-color: var(--color-accent, #e00027);
          box-shadow: 0 0 0 3px rgba(224, 0, 39, 0.1);
        }

        .uploader-zone {
          border: 2px dashed var(--color-border);
          background: #F8FAFC;
          border-radius: 10px;
          padding: 24px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .uploader-zone:hover {
          border-color: var(--color-accent, #e00027);
          background: #FFF5F5;
        }

        .uploader-icon {
          color: var(--color-accent, #e00027);
        }

        .uploader-text {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .uploader-sub {
          font-size: 0.68rem;
          color: #94A3B8;
        }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          padding: 7px 12px;
          border-radius: 6px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-name {
          font-size: 0.80rem;
          font-weight: 600;
          color: var(--color-brand-dark, #020032);
        }

        .file-size-pill {
          font-family: monospace;
          font-size: 0.68rem;
          color: #64748B;
        }

        .file-remove-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 2px 6px;
        }

        .file-remove-btn:hover {
          color: var(--color-accent, #e00027);
        }

        /* Priority Selector */
        .priority-queue-casing {
          margin-top: 6px;
        }

        .priority-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .priority-pill {
          border: 1px solid var(--color-border);
          background: #F8FAFC;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
          transition: all 0.2s;
        }

        .priority-pill:hover {
          border-color: var(--color-accent, #e00027);
        }

        .priority-pill.active {
          border-color: var(--color-brand-dark, #020032);
          background: #FFFFFF;
        }

        .priority-pill.active-fast.active {
          border-color: #10B981;
          background: rgba(16, 185, 129, 0.05);
        }

        .priority-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .priority-pill.active .priority-check {
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
        }

        .priority-pill.active-fast.active .priority-check.green {
          background: #10B981;
          border-color: #10B981;
          color: #FFFFFF;
        }

        .fast-text {
          color: #059669;
        }

        /* Form Navigation Row */
        .form-navigation-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .cms-autosave-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          color: #059669;
          font-weight: 700;
        }

        .nav-step-btn {
          display: inline-flex;
          align-items: center;
          padding: 11px 22px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-step-btn.submit {
          background: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
        }

        .nav-step-btn.submit:hover {
          background: #c00022;
          box-shadow: 0 6px 18px rgba(224, 0, 39, 0.3);
        }

        /* Success Message Screen */
        .form-success-message {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .success-icon-box {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #10B981;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        .success-code-tag {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.1);
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid rgba(224, 0, 39, 0.2);
        }

        .success-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-brand-dark, #020032);
          margin: 0;
        }

        .success-desc {
          font-size: 0.90rem;
          color: var(--color-text-secondary, #3b3e54);
          line-height: 1.6;
          max-width: 480px;
          margin: 0;
        }

        .success-actions-cluster {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 380px;
          margin-top: 14px;
        }

        .btn-success-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #25D366;
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-success-wa:hover {
          background: #1EBE5D;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.3);
        }

        .btn-success-cms {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--color-brand-dark, #020032);
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-success-cms:hover {
          background: #06033E;
          transform: translateY(-2px);
        }

        .btn-success-new {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary, #3b3e54);
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .btn-success-new:hover {
          color: var(--color-brand-dark, #020032);
          border-color: var(--color-brand-dark, #020032);
        }

        /* Right Column: HUD Overview Card */
        .quote-info-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 30px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 22px;
          box-shadow: 0 8px 30px rgba(2, 0, 50, 0.04);
          height: fit-content;
        }

        .hud-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hud-lead-ref {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .live-parameter-hud {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hud-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.80rem;
        }

        .hud-row.flex-col {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .hud-lbl {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted, #7c829c);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .hud-val {
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .hud-val.highlight {
          color: var(--color-brand-dark, #020032);
          font-weight: 800;
        }

        .hud-val.highlight.green {
          color: #059669;
        }

        .font-code {
          font-family: monospace;
        }

        .hud-services-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          width: 100%;
        }

        .hud-service-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-brand-dark, #020032);
        }

        .hud-files-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .hud-file-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.68rem;
          color: var(--color-accent, #e00027);
          font-family: monospace;
        }

        .contact-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .wa-btn {
          background: #25D366;
          color: #FFFFFF;
        }

        .wa-btn:hover {
          background: #1EBE5D;
          transform: translateY(-1px);
        }

        .call-btn {
          background: #F8FAFC;
          color: var(--color-brand-dark, #020032);
          border: 1px solid var(--color-border);
        }

        .call-btn:hover {
          border-color: var(--color-accent, #e00027);
          background: #FFFFFF;
        }

        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--color-border);
          padding-top: 14px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
        }

        .info-label {
          font-family: monospace;
          color: var(--color-text-muted, #7c829c);
          font-weight: 700;
        }

        .info-val {
          color: var(--color-brand-dark, #020032);
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .quote-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .quote-form-container {
            padding: 24px 18px;
          }
          .form-group-row,
          .client-role-grid,
          .project-type-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
