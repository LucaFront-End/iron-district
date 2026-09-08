import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Accessibility, 
  Eye, 
  ZoomIn, 
  Type, 
  Pause, 
  RotateCcw, 
  X, 
  Check, 
  Link2, 
  AlignJustify,
  Maximize2
} from 'lucide-react';

export default function InclusiveAccessWidget() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const [isOpen, setIsOpen] = useState(false);

  // Settings state initialized from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sm_access_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read access settings from localStorage');
    }
    return {
      textSize: 'normal', // 'normal' | 'lg' | 'xl'
      highContrast: false,
      dyslexiaFont: false,
      highlightLinks: false,
      pauseAnimations: false,
      readingGuide: false,
      enhancedSpacing: false
    };
  });

  // Track cursor Y for reading guide
  const [guideY, setGuideY] = useState(200);

  // Save settings and apply CSS classes on body
  useEffect(() => {
    try {
      localStorage.setItem('sm_access_settings', JSON.stringify(settings));
    } catch (e) {
      // Ignore
    }

    const doc = document.documentElement;

    // 1. Text size
    doc.classList.remove('access-text-lg', 'access-text-xl');
    if (settings.textSize === 'lg') doc.classList.add('access-text-lg');
    if (settings.textSize === 'xl') doc.classList.add('access-text-xl');

    // 2. High contrast
    if (settings.highContrast) {
      doc.classList.add('access-high-contrast');
    } else {
      doc.classList.remove('access-high-contrast');
    }

    // 3. Dyslexia font
    if (settings.dyslexiaFont) {
      doc.classList.add('access-dyslexic');
    } else {
      doc.classList.remove('access-dyslexic');
    }

    // 4. Highlight links
    if (settings.highlightLinks) {
      doc.classList.add('access-highlight-links');
    } else {
      doc.classList.remove('access-highlight-links');
    }

    // 5. Pause animations
    if (settings.pauseAnimations) {
      doc.classList.add('access-pause-animations');
    } else {
      doc.classList.remove('access-pause-animations');
    }

    // 6. Enhanced spacing
    if (settings.enhancedSpacing) {
      doc.classList.add('access-enhanced-spacing');
    } else {
      doc.classList.remove('access-enhanced-spacing');
    }
  }, [settings]);

  // Handle cursor movement for reading guide ruler
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e) => {
      setGuideY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  // Keyboard shortcut: Alt + A to toggle widget
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cycleTextSize = () => {
    setSettings(prev => {
      if (prev.textSize === 'normal') return { ...prev, textSize: 'lg' };
      if (prev.textSize === 'lg') return { ...prev, textSize: 'xl' };
      return { ...prev, textSize: 'normal' };
    });
  };

  const resetSettings = () => {
    setSettings({
      textSize: 'normal',
      highContrast: false,
      dyslexiaFont: false,
      highlightLinks: false,
      pauseAnimations: false,
      readingGuide: false,
      enhancedSpacing: false
    });
  };

  const hasActiveModifiers = 
    settings.textSize !== 'normal' ||
    settings.highContrast ||
    settings.dyslexiaFont ||
    settings.highlightLinks ||
    settings.pauseAnimations ||
    settings.readingGuide ||
    settings.enhancedSpacing;

  return (
    <>
      {/* Reading Guide Line */}
      {settings.readingGuide && (
        <div 
          className="inclusive-reading-guide" 
          style={{ top: `${guideY}px` }}
          aria-hidden="true"
        />
      )}

      {/* Floating Trigger Button (Bottom-Left) */}
      <button
        type="button"
        id="btn-inclusive-access"
        className={`inclusive-access-trigger ${hasActiveModifiers ? 'has-active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isEs ? 'Opciones de accesibilidad e inclusión web (Alt + A)' : 'Accessibility & inclusive tools (Alt + A)'}
        title={isEs ? 'Accesibilidad e Inclusión (Alt + A)' : 'Inclusive Accessibility (Alt + A)'}
      >
        <div className="trigger-icon-wrap">
          <Accessibility size={24} />
          {hasActiveModifiers && <span className="active-dot" />}
        </div>
        <span className="trigger-label">
          {isEs ? 'Accesibilidad' : 'Accessibility'}
        </span>
      </button>

      {/* Accessibility Flyout Panel */}
      {isOpen && (
        <div className="inclusive-access-backdrop" onClick={() => setIsOpen(false)}>
          <div 
            className="inclusive-access-panel" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-panel-title"
          >
            {/* Header */}
            <div className="access-panel-header">
              <div className="header-title-group">
                <div className="header-icon-badge">
                  <Accessibility size={20} />
                </div>
                <div>
                  <h3 id="access-panel-title">
                    {isEs ? 'Accesibilidad e Inclusión' : 'Inclusive Accessibility'}
                  </h3>
                  <p className="header-sub">
                    {isEs ? 'Personaliza tu experiencia de navegación (WCAG 2.1)' : 'Customize your visual and reading experience'}
                  </p>
                </div>
              </div>
              <button 
                className="btn-close-access" 
                onClick={() => setIsOpen(false)}
                aria-label={isEs ? 'Cerrar panel' : 'Close panel'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content / Controls Grid */}
            <div className="access-controls-grid">
              
              {/* 1. Text Size */}
              <button 
                type="button"
                className={`access-card ${settings.textSize !== 'normal' ? 'active' : ''}`}
                onClick={cycleTextSize}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <ZoomIn size={18} />
                  </div>
                  <span className="card-state-badge">
                    {settings.textSize === 'normal' && (isEs ? '100%' : '100%')}
                    {settings.textSize === 'lg' && '+15%'}
                    {settings.textSize === 'xl' && '+30%'}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Tamaño de Texto' : 'Text Size'}</strong>
                  <span>{isEs ? 'Aumenta el tamaño legible' : 'Enlarge typography scale'}</span>
                </div>
              </button>

              {/* 2. High Contrast */}
              <button 
                type="button"
                className={`access-card ${settings.highContrast ? 'active' : ''}`}
                onClick={() => toggleSetting('highContrast')}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <Eye size={18} />
                  </div>
                  <span className="card-indicator">
                    {settings.highContrast && <Check size={14} />}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Alto Contraste' : 'High Contrast'}</strong>
                  <span>{isEs ? 'Fondo oscuro de alto contraste' : 'Enhanced stark black & white'}</span>
                </div>
              </button>

              {/* 3. Dyslexia Font */}
              <button 
                type="button"
                className={`access-card ${settings.dyslexiaFont ? 'active' : ''}`}
                onClick={() => toggleSetting('dyslexiaFont')}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <Type size={18} />
                  </div>
                  <span className="card-indicator">
                    {settings.dyslexiaFont && <Check size={14} />}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Tipografía Dislexia' : 'Dyslexia Font'}</strong>
                  <span>{isEs ? 'Fuente legible con espaciado' : 'Clear letterforms for dyslexia'}</span>
                </div>
              </button>

              {/* 4. Highlight Links */}
              <button 
                type="button"
                className={`access-card ${settings.highlightLinks ? 'active' : ''}`}
                onClick={() => toggleSetting('highlightLinks')}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <Link2 size={18} />
                  </div>
                  <span className="card-indicator">
                    {settings.highlightLinks && <Check size={14} />}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Resaltar Enlaces' : 'Highlight Links'}</strong>
                  <span>{isEs ? 'Subraya botones y vínculos' : 'Mark all actionable links'}</span>
                </div>
              </button>

              {/* 5. Pause Animations */}
              <button 
                type="button"
                className={`access-card ${settings.pauseAnimations ? 'active' : ''}`}
                onClick={() => toggleSetting('pauseAnimations')}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <Pause size={18} />
                  </div>
                  <span className="card-indicator">
                    {settings.pauseAnimations && <Check size={14} />}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Pausar Movimiento' : 'Pause Animations'}</strong>
                  <span>{isEs ? 'Detiene carruseles y efectos' : 'Stops continuous motions'}</span>
                </div>
              </button>

              {/* 6. Reading Guide */}
              <button 
                type="button"
                className={`access-card ${settings.readingGuide ? 'active' : ''}`}
                onClick={() => toggleSetting('readingGuide')}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <Maximize2 size={18} />
                  </div>
                  <span className="card-indicator">
                    {settings.readingGuide && <Check size={14} />}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Guía de Lectura' : 'Reading Guide'}</strong>
                  <span>{isEs ? 'Regla que sigue tu cursor' : 'Focus line follows cursor'}</span>
                </div>
              </button>

              {/* 7. Enhanced Spacing */}
              <button 
                type="button"
                className={`access-card ${settings.enhancedSpacing ? 'active' : ''}`}
                onClick={() => toggleSetting('enhancedSpacing')}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <AlignJustify size={18} />
                  </div>
                  <span className="card-indicator">
                    {settings.enhancedSpacing && <Check size={14} />}
                  </span>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Espaciado Amplio' : 'Text Spacing'}</strong>
                  <span>{isEs ? 'Mayor espacio entre líneas' : 'Increased line & letter spacing'}</span>
                </div>
              </button>

              {/* 8. Reset All */}
              <button 
                type="button"
                className="access-card reset-card"
                onClick={resetSettings}
              >
                <div className="card-top">
                  <div className="card-icon">
                    <RotateCcw size={18} />
                  </div>
                </div>
                <div className="card-info">
                  <strong>{isEs ? 'Restablecer Todo' : 'Reset Defaults'}</strong>
                  <span>{isEs ? 'Volver a vista original' : 'Restore original styles'}</span>
                </div>
              </button>

            </div>

            {/* Footer Notice */}
            <div className="access-panel-footer">
              <span className="badge-wcag">WCAG 2.1 AA COMPLIANT</span>
              <span className="footer-tip">
                {isEs ? 'Presiona Alt + A en cualquier momento' : 'Press Alt + A anytime'}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Scoped CSS for Widget and Global Accessibility Overrides */}
      <style>{`
        /* Floating Button */
        .inclusive-access-trigger {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 9990;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #020032;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 10px 16px;
          border-radius: 9999px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(224, 0, 39, 0.2);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s ease;
        }

        .inclusive-access-trigger:hover {
          background: #e00027;
          border-color: #e00027;
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(224, 0, 39, 0.45);
        }

        .inclusive-access-trigger.has-active {
          border-color: #25D366;
          box-shadow: 0 0 20px rgba(37, 211, 102, 0.35);
        }

        .trigger-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .active-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #25D366;
          border-radius: 50%;
          border: 2px solid #020032;
        }

        .trigger-label {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* Reading Guide */
        .inclusive-reading-guide {
          position: fixed;
          left: 0;
          width: 100vw;
          height: 4px;
          background: #e00027;
          box-shadow: 0 0 12px rgba(224, 0, 39, 0.8), 0 0 20px rgba(224, 0, 39, 0.5);
          pointer-events: none;
          z-index: 99999;
          transform: translateY(-50%);
          transition: top 0.04s ease-out;
        }

        /* Backdrop & Flyout */
        .inclusive-access-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9998;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: 24px;
          animation: accessFadeIn 0.2s ease-out;
        }

        @keyframes accessFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .inclusive-access-panel {
          width: 100%;
          max-width: 480px;
          max-height: 85vh;
          background: #0d0f22;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(224, 0, 39, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: accessSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes accessSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .access-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-badge {
          width: 38px;
          height: 38px;
          background: rgba(224, 0, 39, 0.15);
          border: 1px solid rgba(224, 0, 39, 0.3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e00027;
        }

        .access-panel-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .header-sub {
          margin: 2px 0 0 0;
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .btn-close-access {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #CBD5E1;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-close-access:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
        }

        /* Controls Grid */
        .access-controls-grid {
          padding: 20px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-height: calc(85vh - 150px);
        }

        .access-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          color: #FFFFFF;
          font-family: inherit;
        }

        .access-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .access-card.active {
          background: rgba(224, 0, 39, 0.15);
          border-color: #e00027;
          box-shadow: 0 4px 16px rgba(224, 0, 39, 0.25);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 8px;
        }

        .card-icon {
          color: #CBD5E1;
        }

        .access-card.active .card-icon {
          color: #e00027;
        }

        .card-state-badge {
          font-size: 0.70rem;
          font-weight: 800;
          font-family: monospace;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          color: #FFFFFF;
        }

        .access-card.active .card-state-badge {
          background: #e00027;
          color: #FFFFFF;
        }

        .card-indicator {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .access-card.active .card-indicator {
          background: #e00027;
          border-color: #e00027;
          color: #FFFFFF;
        }

        .card-info strong {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 2px;
        }

        .card-info span {
          display: block;
          font-size: 0.70rem;
          color: #94A3B8;
          line-height: 1.25;
        }

        .access-card.reset-card:hover {
          border-color: #F59E0B;
        }

        /* Footer */
        .access-panel-footer {
          padding: 12px 20px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .badge-wcag {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #10B981;
        }

        .footer-tip {
          font-size: 0.68rem;
          color: #64748B;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .inclusive-access-trigger {
            bottom: 80px;
            left: 16px;
            padding: 8px 12px;
          }
          .trigger-label {
            display: none;
          }
          .inclusive-access-backdrop {
            padding: 0;
            align-items: flex-end;
          }
          .inclusive-access-panel {
            max-width: 100%;
            border-radius: 20px 20px 0 0;
          }
          .access-controls-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ========================================================= */
        /* GLOBAL INCLUSIVE ACCESSIBILITY OVERRIDES APPLIED ON HTML  */
        /* ========================================================= */

        /* 1. Text Sizing */
        html.access-text-lg {
          font-size: 115% !important;
        }
        html.access-text-xl {
          font-size: 130% !important;
        }

        /* 2. High Contrast Mode */
        html.access-high-contrast {
          filter: contrast(160%) !important;
        }
        html.access-high-contrast body {
          background: #000000 !important;
          color: #FFFFFF !important;
        }
        html.access-high-contrast * {
          border-color: #FFFFFF !important;
        }

        /* 3. Dyslexia Friendly Font */
        html.access-dyslexic,
        html.access-dyslexic * {
          font-family: 'Comic Sans MS', 'Trebuchet MS', 'Arial Rounded MT Bold', sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.12em !important;
        }

        /* 4. Highlight Links */
        html.access-highlight-links a,
        html.access-highlight-links button {
          text-decoration: underline 3px #FACC15 !important;
          outline: 2px solid #FACC15 !important;
          outline-offset: 2px !important;
        }

        /* 5. Pause Animations */
        html.access-pause-animations *,
        html.access-pause-animations *::before,
        html.access-pause-animations *::after {
          animation-play-state: paused !important;
          transition-duration: 0.001s !important;
        }

        /* 6. Enhanced Spacing */
        html.access-enhanced-spacing body,
        html.access-enhanced-spacing p,
        html.access-enhanced-spacing span,
        html.access-enhanced-spacing a {
          line-height: 2 !important;
          letter-spacing: 0.08em !important;
        }
      `}</style>
    </>
  );
}
