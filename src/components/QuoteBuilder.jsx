import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UploadCloud, MessageSquare, PhoneCall, Check, Loader2, File, ChevronRight, ChevronLeft, ShieldCheck, Box, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteBuilder() {
  const { t, language } = useLanguage();
  const fileInputRef = useRef(null);

  // Multistep state
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'residential',
    style: 'brooklyn',
    length: 15,
    message: '',
    priority: 'standard'
  });
  
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Listen to preset load events from the catalog clicks
  useEffect(() => {
    const handlePresetLoad = (e) => {
      const { material, finish, mounting, length } = e.detail;
      let style = 'brooklyn';
      if (mounting === 'floor') style = 'chicago';
      if (mounting === 'cable') style = 'brooklyn';
      if (mounting === 'glass' || finish === 'brushedSteel') style = 'manhattan';
      if (mounting === 'wall') style = 'aspen';

      setFormData((prev) => ({
        ...prev,
        style,
        length: length || 15
      }));
      setStep(2); // Jump directly to specifications step
    };
    window.addEventListener('load-configurator-preset', handlePresetLoad);
    return () => window.removeEventListener('load-configurator-preset', handlePresetLoad);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    simulateFileUpload(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    simulateFileUpload(selectedFiles);
  };

  const simulateFileUpload = (newFiles) => {
    if (newFiles.length === 0) return;
    setIsUploading(true);

    setTimeout(() => {
      setFiles((prev) => [
        ...prev,
        ...newFiles.map((file) => ({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          id: Math.random().toString(36).substr(2, 9)
        }))
      ]);
      setIsUploading(false);
    }, 1200);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: 'residential',
        style: 'brooklyn',
        length: 15,
        message: '',
        priority: 'standard'
      });
      setFiles([]);
      setStep(1);
    }, 2000);
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const activeText = {
    en: {
      step1: 'Scope',
      step2: 'Specs',
      step3: 'Contact',
      projType: 'Project Scope',
      res: 'Residential Project',
      com: 'Commercial Project',
      styleSelect: ' Raling Design Model',
      lenSelect: 'Estimated Length',
      uploadTitle: 'Upload drawings, sketches or blueprint plans',
      messagePlaceholder: 'Describe your structural parameters, hardware preferences or design requirements...',
      priorityLbl: 'Laser Queue Priority Allocation',
      priorityStd: 'Standard Allocation (5-7 Days)',
      priorityFast: 'Rapid Laser Queue Fast-Track (+0.00 / Free)',
      submitBtn: 'Submit Quote Request',
      nextBtn: 'Continue',
      backBtn: 'Back',
      summaryTitle: 'Live Estimate Overview',
      summaryEmpty: 'Select project parameters...',
      summaryFile: 'Files Uploaded'
    },
    es: {
      step1: 'Alcance',
      step2: 'Medidas',
      step3: 'Contacto',
      projType: 'Tipo de Obra',
      res: 'Proyecto Residencial',
      com: 'Proyecto Comercial',
      styleSelect: 'Modelo de Barandal',
      lenSelect: 'Longitud Estimada',
      uploadTitle: 'Sube planos, bocetos o especificaciones',
      messagePlaceholder: 'Describe los parámetros de obra, preferencias de anclaje o requisitos...',
      priorityLbl: 'Prioridad en Cola de Corte Láser',
      priorityStd: 'Asignación Estándar (5-7 Días)',
      priorityFast: 'Entrada Rápida a Cola Láser (Gratis)',
      submitBtn: 'Enviar Solicitud',
      nextBtn: 'Siguiente',
      backBtn: 'Atrás',
      summaryTitle: 'Resumen de Presupuesto',
      summaryEmpty: 'Selecciona parámetros...',
      summaryFile: 'Planos cargados'
    }
  }[language] || {
    en: {}
  };

  return (
    <section className="quote-section" id="quote">
      <div className="gradient-radial-glow pulse-glow" style={{ top: '20%', left: '10%', width: '350px', height: '350px' }}></div>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="tag-label">
            <UploadCloud className="pulse-glow" size={14} />
            {t('quote.tag')}
          </span>
          <h2 className="text-gradient">{t('quote.title')}</h2>
          <p>{t('quote.desc')}</p>
        </div>

        {/* Dynamic Stepper Bar */}
        <div className="stepper-indicator-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>
            <span className="dot-number">01</span>
            <span className="dot-label">{activeText.step1}</span>
          </div>
          <div className="step-line-connector">
            <div className="connector-fill" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          </div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>
            <span className="dot-number">02</span>
            <span className="dot-label">{activeText.step2}</span>
          </div>
          <div className="step-line-connector">
            <div className="connector-fill" style={{ width: step === 3 ? '100%' : '0%' }}></div>
          </div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>
            <span className="dot-number">03</span>
            <span className="dot-label">{activeText.step3}</span>
          </div>
        </div>

        <div className="quote-grid">
          
          {/* Main Multistep Form Casing */}
          <div className="quote-form-container glass-panel">
            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <form onSubmit={handleSubmit} className="quote-form">
                  
                  {/* STEP 1: Scope & Style */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="step-casing"
                    >
                      <label className="form-section-title">{activeText.projType}</label>
                      <div className="project-type-cards">
                        <div 
                          className={`type-select-card ${formData.projectType === 'residential' ? 'active' : ''}`}
                          onClick={() => setFieldValue('projectType', 'residential')}
                        >
                          <span className="type-check">{formData.projectType === 'residential' && <Check size={12} />}</span>
                          <span className="type-name">{activeText.res}</span>
                        </div>
                        <div 
                          className={`type-select-card ${formData.projectType === 'commercial' ? 'active' : ''}`}
                          onClick={() => setFieldValue('projectType', 'commercial')}
                        >
                          <span className="type-check">{formData.projectType === 'commercial' && <Check size={12} />}</span>
                          <span className="type-name">{activeText.com}</span>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '20px' }}>
                        <label className="form-section-title">{activeText.styleSelect}</label>
                        <div className="style-option-grid">
                          {[
                            { id: 'brooklyn', name: 'Brooklyn (Cable)' },
                            { id: 'manhattan', name: 'Manhattan (Glass)' },
                            { id: 'chicago', name: 'Chicago (Spindles)' },
                            { id: 'aspen', name: 'Aspen (Wood)' }
                          ].map((item) => (
                            <div 
                              key={item.id}
                              className={`style-select-pill ${formData.style === item.id ? 'active' : ''}`}
                              onClick={() => setFieldValue('style', item.id)}
                            >
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="form-navigation-row" style={{ marginTop: '30px' }}>
                        <div></div> {/* Empty spacer */}
                        <button type="button" className="btn btn-primary nav-step-btn" onClick={nextStep}>
                          <span>{activeText.nextBtn}</span>
                          <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Measurements & Blueprints */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="step-casing"
                    >
                      <div className="form-group">
                        <label className="form-section-title">{activeText.lenSelect}</label>
                        <div className="length-slider-casing">
                          <input 
                            type="range" 
                            name="length"
                            min="3" 
                            max="60" 
                            value={formData.length} 
                            onChange={handleInputChange}
                            className="form-range-slider"
                          />
                          <div className="length-val-badge">
                            <span>{formData.length} {t('configurator.ft')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-section-title">{activeText.uploadTitle}</label>
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
                          />
                          {isUploading ? (
                            <div className="uploader-loading">
                              <Loader2 className="spinner" size={24} />
                              <span>Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <UploadCloud className="uploader-icon" size={26} />
                              <p className="uploader-text">{t('quote.upload')}</p>
                            </>
                          )}
                        </div>

                        {/* Files list */}
                        {files.length > 0 && (
                          <div className="uploaded-files-list">
                            {files.map((file) => (
                              <div key={file.id} className="file-item">
                                <div className="file-info">
                                  <File size={14} className="text-accent" />
                                  <span className="file-name">{file.name}</span>
                                </div>
                                <button type="button" onClick={() => removeFile(file.id)} className="file-remove-btn">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <textarea 
                          name="message" 
                          rows="3" 
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder={activeText.messagePlaceholder}
                          className="form-text-area"
                        ></textarea>
                      </div>

                      <div className="form-navigation-row">
                        <button type="button" className="btn btn-secondary nav-step-btn" onClick={prevStep}>
                          <ChevronLeft size={14} style={{ marginRight: '4px' }} />
                          <span>{activeText.backBtn}</span>
                        </button>
                        <button type="button" className="btn btn-primary nav-step-btn" onClick={nextStep}>
                          <span>{activeText.nextBtn}</span>
                          <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Contact details & submit */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="step-casing"
                    >
                      <div className="form-group-row">
                        <div className="form-group">
                          <label>{t('quote.fullName')}</label>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="form-group">
                          <label>{t('quote.email')}</label>
                          <input 
                            type="email" 
                            name="email" 
                            required 
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>{t('quote.phone')}</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange} 
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      {/* Dynamic Priority Queue Selector */}
                      <div className="form-group priority-queue-casing">
                        <label className="form-section-title">{activeText.priorityLbl}</label>
                        <div className="priority-options">
                          <div 
                            className={`priority-pill ${formData.priority === 'standard' ? 'active' : ''}`}
                            onClick={() => setFieldValue('priority', 'standard')}
                          >
                            <span className="priority-check">{formData.priority === 'standard' && <Check size={12} />}</span>
                            <span>{activeText.priorityStd}</span>
                          </div>
                          <div 
                            className={`priority-pill active-fast ${formData.priority === 'fast' ? 'active' : ''}`}
                            onClick={() => setFieldValue('priority', 'fast')}
                          >
                            <span className="priority-check green">{formData.priority === 'fast' && <Check size={12} />}</span>
                            <span className="fast-text">{activeText.priorityFast}</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-navigation-row" style={{ marginTop: '24px' }}>
                        <button type="button" className="btn btn-secondary nav-step-btn" onClick={prevStep} disabled={isSubmitting}>
                          <ChevronLeft size={14} style={{ marginRight: '4px' }} />
                          <span>{activeText.backBtn}</span>
                        </button>
                        
                        <button 
                          type="submit" 
                          className="btn btn-primary nav-step-btn submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="spinner" size={14} style={{ marginRight: '6px' }} />
                              <span>{t('quote.sending')}</span>
                            </>
                          ) : (
                            <span>{activeText.submitBtn}</span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                </form>
              ) : (
                <motion.div 
                  key="success"
                  className="form-success-message"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="success-icon-box">
                    <Check size={36} />
                  </div>
                  <h3>{t('quote.success')}</h3>
                  <button 
                    onClick={() => setSubmitSuccess(false)} 
                    className="btn btn-secondary success-back-btn"
                  >
                    Send Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Live Estimate Overview summary */}
          <div className="quote-info-card glass-panel">
            <div className="schematic-corner tl"></div>
            <div className="schematic-corner tr"></div>
            <div className="schematic-corner bl"></div>
            <div className="schematic-corner br"></div>

            <h3 className="text-gradient">{activeText.summaryTitle}</h3>
            
            {/* Live Parameter HUD Summary */}
            <div className="live-parameter-hud">
              <div className="hud-row">
                <span className="hud-lbl">PROJECT TYPE</span>
                <span className="hud-val highlight">
                  {formData.projectType.toUpperCase()}
                </span>
              </div>
              <div className="hud-row">
                <span className="hud-lbl">DESIGN STYLE</span>
                <span className="hud-val font-code">
                  {formData.style.toUpperCase()}
                </span>
              </div>
              <div className="hud-row">
                <span className="hud-lbl">ESTIMATED RUN</span>
                <span className="hud-val">
                  {formData.length} FT
                </span>
              </div>
              <div className="hud-row">
                <span className="hud-lbl">PRIORITY ALLOCATION</span>
                <span className="hud-val highlight green">
                  {formData.priority === 'fast' ? 'RAPID LASER' : 'STANDARD'}
                </span>
              </div>

              {files.length > 0 && (
                <div className="hud-row flex-col">
                  <span className="hud-lbl">{activeText.summaryFile}</span>
                  <div className="hud-files-preview">
                    {files.map(f => (
                      <span key={f.id} className="hud-file-tag">{f.name.substring(0, 16)}...</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="contact-actions">
              <a 
                href="https://wa.me/13462349640" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-btn wa-btn"
              >
                <MessageSquare size={18} />
                <span>{t('quote.whatsapp')}</span>
              </a>

              <a href="tel:+13462349640" className="contact-btn call-btn">
                <PhoneCall size={18} />
                <span>{t('quote.callUs')}</span>
              </a>
            </div>

            <div className="contact-info-list">
              <div className="info-row">
                <span className="info-label">OFFICE HOURS:</span>
                <span className="info-val">Mon - Fri, 8AM - 6PM PST</span>
              </div>
              <div className="info-row">
                <span className="info-label">RESPONSE TIME:</span>
                <span className="info-val">Under 2 hours</span>
              </div>
              <div className="info-row">
                <span className="info-label">HEADQUARTERS:</span>
                <span className="info-val">Los Angeles, CA</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .quote-section {
          background-color: var(--color-bg);
          padding-top: 100px;
          padding-bottom: 120px;
          position: relative;
        }

        .quote-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }

        /* Multistep Indicator */
        .stepper-indicator-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 550px;
          margin: 30px auto 10px auto;
          position: relative;
        }

        .step-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .dot-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-weight: 700;
          font-size: 0.75rem;
          transition: all 0.3s ease;
        }

        .step-dot.active .dot-number {
          background: var(--color-text-primary);
          color: var(--color-bg);
          border-color: var(--color-text-primary);
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .dot-label {
          font-family: monospace;
          font-size: 0.65rem;
          margin-top: 6px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .step-dot.active .dot-label {
          color: var(--color-text-primary);
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
          background: var(--color-text-primary);
          width: 0%;
          transition: width 0.3s ease;
        }

        /* Multistep Forms */
        .quote-form-container {
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 30px;
        }

        .step-casing {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-section-title {
          font-family: monospace;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 4px;
          display: block;
        }

        /* Card Selector row */
        .project-type-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .type-select-card {
          border: 1px solid var(--color-border);
          background: var(--color-surface-elevated);
          padding: 18px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .type-select-card:hover {
          border-color: var(--color-accent);
        }

        .type-select-card.active {
          border-color: var(--color-text-primary);
          background: var(--color-surface-base);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .type-check {
          width: 16px;
          height: 16px;
          border: 1px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
        }

        .type-select-card.active .type-check {
          background: var(--color-text-primary);
          border-color: var(--color-text-primary);
          color: var(--color-bg);
        }

        .type-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        /* Railing styles grid */
        .style-option-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .style-select-pill {
          padding: 10px 14px;
          border: 1px solid var(--color-border);
          background: var(--color-surface-elevated);
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.72rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .style-select-pill:hover {
          border-color: var(--color-accent);
        }

        .style-select-pill.active {
          background: var(--color-text-primary);
          color: var(--color-bg);
          border-color: var(--color-text-primary);
        }

        /* Length slider style */
        .length-slider-casing {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .form-range-slider {
          flex: 1;
          height: 4px;
          background: var(--color-border);
          border-radius: 2px;
          outline: none;
          accent-color: var(--color-accent);
        }

        .length-val-badge {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          padding: 6px 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: bold;
        }

        /* Text Area */
        .form-text-area {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-surface-elevated);
          font-size: 0.8rem;
          outline: none;
          resize: none;
        }

        .form-text-area:focus {
          border-color: var(--color-accent);
        }

        /* Priority queue pills */
        .priority-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .priority-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--color-border);
          padding: 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.72rem;
          cursor: pointer;
          background: var(--color-surface-elevated);
          transition: all 0.2s;
        }

        .priority-pill.active {
          border-color: var(--color-text-primary);
          background: var(--color-surface-base);
        }

        .priority-pill.active-fast.active {
          border-color: #10B981;
          background: rgba(16, 185, 129, 0.02);
        }

        .priority-check {
          width: 14px;
          height: 14px;
          border-radius: 2px;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF;
        }

        .priority-pill.active .priority-check {
          background: var(--color-text-primary);
          border-color: var(--color-text-primary);
          color: var(--color-bg);
        }

        .priority-pill.active-fast.active .priority-check.green {
          background: #10B981;
          border-color: #10B981;
        }

        .fast-text {
          font-weight: bold;
        }

        /* Navigation steps footer */
        .form-navigation-row {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }

        .nav-step-btn {
          display: flex;
          align-items: center;
          font-size: 0.78rem;
          padding: 8px 16px;
        }

        .nav-step-btn.submit {
          background: var(--color-accent);
          color: #FFF;
          border: none;
        }

        .nav-step-btn.submit:hover {
          background: var(--color-text-primary);
        }

        /* Live HUD Parameter Summary card on right */
        .live-parameter-hud {
          background: rgba(0,0,0,0.02);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .hud-row {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.72rem;
          border-bottom: 1px dashed var(--color-border);
          padding-bottom: 8px;
        }

        .hud-row.flex-col {
          flex-direction: column;
          gap: 6px;
          border-bottom: none;
          padding-bottom: 0;
        }

        .hud-lbl {
          color: var(--color-text-muted);
        }

        .hud-val {
          color: var(--color-text-primary);
          font-weight: bold;
        }

        .hud-val.highlight {
          color: var(--color-accent);
        }

        .hud-val.highlight.green {
          color: #10B981;
        }

        .hud-files-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }

        .hud-file-tag {
          font-size: 0.62rem;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--color-text-secondary);
        }

        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid var(--color-border);
          padding-top: 24px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.75rem;
        }

        .info-label {
          color: var(--color-text-muted);
        }

        .info-val {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        /* Missing Form Elements Styles */
        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
          width: 100%;
        }

        .form-group label {
          font-family: monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="tel"] {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
          font-size: 0.8rem;
          outline: none;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .form-group input[type="text"]:focus,
        .form-group input[type="email"]:focus,
        .form-group input[type="tel"]:focus {
          border-color: var(--color-accent);
          background: var(--color-surface-base);
        }

        /* File Upload Styles */
        .uploader-zone {
          border: 2px dashed var(--color-border);
          background: var(--color-surface-elevated);
          border-radius: 6px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          text-align: center;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .uploader-zone:hover {
          border-color: var(--color-accent);
          background: rgba(255, 90, 9, 0.01);
        }

        .uploader-icon {
          color: var(--color-text-muted);
        }

        .uploader-text {
          font-size: 0.72rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .uploader-subtext {
          font-size: 0.6rem;
          color: var(--color-text-muted);
        }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
        }

        .file-name {
          font-weight: 600;
        }

        .file-remove-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.75rem;
          transition: color 0.15s;
        }

        .file-remove-btn:hover {
          color: #EF4444;
        }

        /* Success screen styles */
        .form-success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 10px;
          gap: 16px;
        }

        .success-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #10B981;
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .form-success-message h3 {
          font-size: 1.1rem;
          color: var(--color-text-primary);
        }

        .success-back-btn {
          font-size: 0.75rem;
          padding: 8px 16px;
        }

        /* Action Buttons on Right Card */
        .contact-actions {
          display: flex;
          gap: 12px;
          margin-top: 15px;
          margin-bottom: 20px;
        }

        .contact-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          transition: all 0.2s;
        }

        .wa-btn {
          background: #25D366;
          color: #FFFFFF;
          border: 1px solid #25D366;
        }

        .wa-btn:hover {
          background: #20BA5A;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
          transform: translateY(-1px);
        }

        .call-btn {
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .call-btn:hover {
          border-color: var(--color-text-primary);
          transform: translateY(-1px);
        }

        /* Card corner design tags */
        .schematic-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1px solid var(--color-border);
          pointer-events: none;
        }

        .schematic-corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
        .schematic-corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
        .schematic-corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
        .schematic-corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; }
      `}</style>
    </section>
  );
}
