import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFormCMS } from '../hooks/useFormCMS';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Search, X, ExternalLink, Send, CheckCircle2, 
  Sparkles, MessageCircle, ArrowRight, Compass, 
  Pin, ShieldCheck, Link as LinkIcon, UploadCloud, SlidersHorizontal
} from 'lucide-react';

import { ARCHITECTURAL_PINTEREST_PINS, INSPIRATION_SUGGESTIONS } from '../data/realPinterestPins';

// Spanish & English stopwords that should not break multi-word search queries (e.g. "puertas de vidrio", "escaleras para interior")
const SEARCH_STOPWORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'con', 'para', 'por', 'en', 'y', 'e', 'a', 'o', 'al',
  'of', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'by'
]);

// Strip accents, lowercase, trim
const normalizeSearchText = (text) => {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

// Simple stemming helper for plural Spanish/English words (e.g. puertas -> puerta, railings -> railing)
const getWordStems = (word) => {
  const clean = word.toLowerCase().trim();
  const stems = new Set([clean]);
  if (clean.endsWith('es') && clean.length > 4) stems.add(clean.slice(0, -2));
  if (clean.endsWith('s') && clean.length > 3) stems.add(clean.slice(0, -1));
  return Array.from(stems);
};

// Check if a search term matches text directly or via word stems
const matchSearchTerm = (term, text) => {
  if (!term) return true;
  if (text.includes(term)) return true;

  const stems = getWordStems(term);
  for (const stem of stems) {
    if (text.includes(stem)) return true;
  }

  // Synonym bridges (vidrio/cristal, puerta/door, reja/porton, celosia/laser)
  if ((term === 'cristal' || term === 'cristales') && (text.includes('vidrio') || text.includes('glass'))) return true;
  if ((term === 'vidrio' || term === 'vidrios') && (text.includes('cristal') || text.includes('glass'))) return true;
  if ((term === 'puerta' || term === 'puertas') && (text.includes('door') || text.includes('porton'))) return true;
  if ((term === 'door' || term === 'doors') && (text.includes('puerta') || text.includes('gate'))) return true;
  if ((term === 'reja' || term === 'rejas') && (text.includes('porton') || text.includes('barandal') || text.includes('gate'))) return true;
  if ((term === 'celosia' || term === 'celosias') && (text.includes('laser') || text.includes('panel') || text.includes('screen'))) return true;

  return false;
};

export default function PinterestInspirationBoard() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { submitToCMS } = useFormCMS();

  // Search and active suggestion state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSuggestionId, setActiveSuggestionId] = useState('all');

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('smw_pinterest_favorites');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // External Pin Quick Quote Drawer/Modal
  const [externalPinModal, setExternalPinModal] = useState(false);
  const [externalPinUrl, setExternalPinUrl] = useState('');

  // Quote Request Modal for a specific pin
  const [quotingPin, setQuotingPin] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  // Toggle favorite with persistent count
  const toggleFavorite = (pinId, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = !prev[pinId];
      const updated = { ...prev, [pinId]: isFav };
      try {
        localStorage.setItem('smw_pinterest_favorites', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return updated;
    });
  };

  // Handle clicking an inspiration suggestion pill
  const handleSelectSuggestion = (suggestion) => {
    setActiveSuggestionId(suggestion.id);
    setSearchQuery(suggestion.query);
  };

  // Handle user typing freely in the search box
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Check if input matches any predefined suggestion
    const matched = INSPIRATION_SUGGESTIONS.find(
      s => s.query && val.toLowerCase().trim() === s.query.toLowerCase().trim()
    );
    setActiveSuggestionId(matched ? matched.id : (val.trim() ? 'custom' : 'all'));
  };

  // Filtered architectural pins (smart, bilingual, stopword-filtered, accent & plural insensitive)
  const filteredPins = useMemo(() => {
    return ARCHITECTURAL_PINTEREST_PINS.filter((pin) => {
      // 1. Filter by Favorites if 'favorites' active
      if (activeSuggestionId === 'favorites') {
        if (!favorites[pin.id]) return false;
      }

      // 2. Free-text search query across titles, tags, category and bilingual keywords
      if (searchQuery.trim()) {
        const rawTerms = normalizeSearchText(searchQuery).split(/\s+/).filter(Boolean);
        // Filter out stopwords unless all terms entered were stopwords
        let meaningfulTerms = rawTerms.filter(t => !SEARCH_STOPWORDS.has(t) && t.length > 1);
        if (meaningfulTerms.length === 0) {
          meaningfulTerms = rawTerms;
        }

        const searchableText = normalizeSearchText([
          pin.titleEn || '',
          pin.titleEs || '',
          pin.category || '',
          pin.categoryNameEn || '',
          pin.categoryNameEs || '',
          pin.board || '',
          (pin.tags || []).join(' '),
          (pin.keywords || []).join(' ')
        ].join(' '));

        // Every meaningful term (or its plural stem / synonym) must match
        const matchesAll = meaningfulTerms.every(term => matchSearchTerm(term, searchableText));
        if (!matchesAll) return false;
      }

      return true;
    });
  }, [searchQuery, activeSuggestionId, favorites]);

  // Submit Quote Modal
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone) return;

    setIsSubmitting(true);
    try {
      const pinTitle = quotingPin 
        ? (isEn ? quotingPin.titleEn : quotingPin.titleEs) 
        : (externalPinUrl || 'Enlace Externo de Pinterest');
      const pinLink = quotingPin?.pinterestUrl || externalPinUrl || 'No indicado';
      const pinImg = quotingPin?.image || '';

      const payload = {
        _subject: `[INSPIRACIÓN PINTEREST] Cotización de Diseño: ${pinTitle}`,
        _template: 'blank',
        _language: 'es',
        _captcha: 'false',
        pin_id: quotingPin?.id || 'EXTERNAL_PIN',
        pin_titulo: pinTitle,
        pin_enlace: pinLink,
        pin_imagen: pinImg,
        pin_tablero: quotingPin?.board || 'Pinterest',
        cliente_nombre: quoteForm.name,
        cliente_telefono: quoteForm.phone,
        cliente_email: quoteForm.email,
        cliente_ciudad: quoteForm.city || 'No especificada',
        detalles_proyecto: quoteForm.notes || 'Solicitud generada desde el buscador de inspiración de Pinterest',
        origen: 'Buscador de Pinterest Real Station Metalworks'
      };

      // 1. Transmit to Wix CMS Collection "Contacto"
      submitToCMS({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        city: quoteForm.city,
        service: pinTitle,
        type: 'pinterest-inspiration',
        source: 'Inspiración Pinterest — Cotizar Diseño',
        message: quoteForm.notes || `Cotización de diseño para: ${pinTitle}`,
        details: payload
      });

      await fetch('https://formsubmit.co/ajax/info@stationmetalworks.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      setQuoteSent(true);
    } catch (err) {
      console.error('Error submitting quote request:', err);
      setQuoteSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeQuoteModal = () => {
    setQuotingPin(null);
    setExternalPinModal(false);
    setQuoteSent(false);
    setQuoteForm({ name: '', phone: '', email: '', city: '', notes: '' });
  };

  const favoritesCount = Object.values(favorites).filter(Boolean).length;

  return (
    <section className="pinterest-board-section container" id="lookbook">
      
      {/* 1. HEADER & PINTEREST BADGE */}
      <div className="section-header">
        <div className="pinterest-badge-pill">
          <Pin size={13} className="pin-icon-red" />
          <span>{isEn ? 'PINTEREST ARCHITECTURAL HUB' : 'INSPIRACIÓN PINTEREST EN VIVO'}</span>
        </div>
        <h2 className="text-gradient">
          {isEn ? 'Search Architectural Metalwork Inspirations' : 'Explora Inspiraciones de Diseño en Acero & Metal'}
        </h2>
        <p>
          {isEn
            ? 'Discover real metalwork ideas directly from Pinterest. Search floating stairs, cable railings, modern pivot gates, or laser screens. Save your favorites with the heart ❤️ or request a direct custom fabrication quote.'
            : 'Encuentra ideas reales de herrería y arquitectura directamente de Pinterest. Busca escaleras voladizas, barandales de cable, portones pivotantes o celosías. Guarda tus favoritas con el corazón ❤️ o cotiza su fabricación en nuestro taller.'}
        </p>
      </div>

      {/* 2. UNIFIED PINTEREST SEARCH & INSPIRATION COMMAND BAR */}
      <div className="pinterest-search-command-hub glass-panel">
        
        {/* Main Search Input */}
        <div className="pinterest-hero-search-wrapper">
          <div className="pinterest-search-box-unified">
            <Search size={18} className="search-icon-red" />
            <input
              type="text"
              className="pinterest-search-input-unified"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={
                isEn 
                  ? "Search Pinterest ideas (e.g. 'floating stairs', 'cable railing', 'modern pivot gate', 'black steel', 'glass')..."
                  : "Buscar en Pinterest (ej: 'escaleras flotantes', 'barandales de cable', 'portones modernos', 'vidrio', 'acero negro')..."
              }
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn-unified" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveSuggestionId('all');
                }}
                title={isEn ? "Clear search" : "Limpiar búsqueda"}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Direct Live Pinterest External Search Button */}
          {searchQuery.trim() && (
            <a 
              href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery.trim() + ' architectural metalwork')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="search-live-pinterest-btn"
              title={isEn ? `Search "${searchQuery}" on live Pinterest` : `Buscar "${searchQuery}" en vivo en Pinterest`}
            >
              <Pin size={14} fill="#FFF" color="#FFF" />
              <span>{isEn ? 'Search on Live Pinterest' : 'Buscar en Pinterest en Vivo'}</span>
              <ExternalLink size={12} />
            </a>
          )}

          {/* Quick Paste External Pin Link Button */}
          <button 
            type="button" 
            className="paste-external-pin-btn"
            onClick={() => setExternalPinModal(true)}
            title={isEn ? "Quote a specific Pin URL from your phone" : "Cotizar un enlace de Pin que viste en tu app"}
          >
            <LinkIcon size={14} />
            <span>{isEn ? 'Quote a Pin URL' : 'Cotizar un Link de Pinterest'}</span>
          </button>
        </div>

        {/* 3. SUGERENCIAS DE BÚQUEDA INTERACTIVAS (Inspiration Suggestions) */}
        <div className="inspiration-suggestions-tray">
          <div className="suggestions-header-label">
            <Sparkles size={13} className="text-accent" />
            <span>{isEn ? 'Inspiration Suggestions:' : 'Sugerencias de Búsqueda:'}</span>
          </div>

          <div className="suggestions-scrollable-chips">
            {INSPIRATION_SUGGESTIONS.map((sug) => {
              const isActive = activeSuggestionId === sug.id && (sug.query === '' ? searchQuery === '' : searchQuery === sug.query);
              return (
                <button
                  key={sug.id}
                  type="button"
                  className={`suggestion-chip ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectSuggestion(sug)}
                >
                  <span>{isEn ? sug.labelEn : sug.labelEs}</span>
                </button>
              );
            })}

            {/* Saved with Heart Filter Chip */}
            <button
              type="button"
              className={`suggestion-chip favorites-chip ${activeSuggestionId === 'favorites' ? 'active' : ''}`}
              onClick={() => {
                if (activeSuggestionId === 'favorites') {
                  setActiveSuggestionId('all');
                  setSearchQuery('');
                } else {
                  setActiveSuggestionId('favorites');
                  setSearchQuery('');
                }
              }}
            >
              <Heart 
                size={13} 
                fill={favoritesCount > 0 ? '#E60023' : 'none'} 
                color={favoritesCount > 0 ? '#E60023' : 'currentColor'} 
              />
              <span>{isEn ? `Saved with Heart (${favoritesCount})` : `Mis Guardados (${favoritesCount})`}</span>
            </button>
          </div>
        </div>

        {/* Live Results Counter Bar */}
        <div className="search-status-bar">
          <span className="results-count-text">
            {isEn
              ? `Showing ${filteredPins.length} architectural metalwork inspirations`
              : `Mostrando ${filteredPins.length} inspiraciones en herrería y acero`}
            {searchQuery && (
              <span className="query-highlight-badge">
                "{searchQuery}"
              </span>
            )}
          </span>

          {searchQuery && (
            <button 
              className="reset-query-link"
              onClick={() => {
                setSearchQuery('');
                setActiveSuggestionId('all');
              }}
            >
              {isEn ? 'Reset to all' : 'Ver todos los diseños'}
            </button>
          )}
        </div>

      </div>

      {/* 4. REAL PINTEREST WATERFALL MASONRY GRID */}
      {filteredPins.length === 0 ? (
        <div className="empty-pins-box glass-panel">
          <div className="empty-pins-icon-wrap">
            <Pin size={38} className="pin-icon-red" />
          </div>
          <h3>
            {isEn 
              ? `Search +10,000 Live Pins for "${searchQuery}" on Pinterest` 
              : `Explora +10,000 Pines en Vivo de "${searchQuery}" en Pinterest`}
          </h3>
          <p>
            {isEn 
              ? `Our quick catalog has 30+ signature workshop projects, but you have total freedom to browse live on Pinterest. Found any metalwork design you love? Send us the Pin link or photo, and we will custom fabricate it to your exact specifications.` 
              : `Nuestro catálogo rápido tiene más de 30 proyectos de taller, pero tienes libertad total para explorar en vivo en Pinterest. ¿Encontraste un diseño que te encante? Pega el link del Pin o envíanos la foto y te lo fabricamos a medida exacta.`}
          </p>
          <div className="empty-state-actions">
            <a 
              href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery ? `${searchQuery} architectural metalwork` : 'modern steel metalwork architecture')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pinterest-live-action"
            >
              <Pin size={16} fill="#FFF" color="#FFF" />
              <span>{isEn ? `Open "${searchQuery}" on Pinterest ↗` : `Buscar "${searchQuery}" en Pinterest ↗`}</span>
            </a>
            
            <button 
              type="button" 
              className="btn-quote-custom-pin"
              onClick={() => {
                setExternalPinUrl(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`);
                setExternalPinModal(true);
              }}
            >
              <LinkIcon size={14} />
              <span>{isEn ? 'Quote a Custom Pin Link' : 'Cotizar un Link de Pinterest'}</span>
            </button>

            <button 
              type="button" 
              className="btn-reset-to-all" 
              onClick={() => { 
                setSearchQuery(''); 
                setActiveSuggestionId('all'); 
              }}
            >
              {isEn ? 'View All Designs' : 'Ver Todos los Diseños'}
            </button>
          </div>
        </div>
      ) : (
        <div className="pinterest-waterfall-grid">
          {filteredPins.map((pin, index) => {
            const isFav = !!favorites[pin.id];
            const currentLikes = pin.likes + (isFav ? 1 : 0);
            const renderGatewayCard = index === 2;

            return (
              <React.Fragment key={pin.id}>
                {renderGatewayCard && (
                  <div key="live-gateway-card-inline" className="pin-card-wrapper live-gateway-card-wrapper">
                    <div className="pin-card live-gateway-card">
                      <div className="live-gateway-top-bar">
                        <div className="live-gateway-brand">
                          <div className="pinterest-icon-bubble">
                            <Pin size={18} fill="#FFF" color="#FFF" />
                          </div>
                          <div>
                            <div className="live-gateway-badge">{isEn ? 'LIVE PINTEREST EXPLORER' : 'EXPLORADOR PINTEREST EN VIVO'}</div>
                            <div className="live-gateway-subbadge">{isEn ? '+10,000+ Ideas' : '+10,000+ Ideas en Vivo'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="live-gateway-body">
                        <h4 className="live-gateway-title">
                          {isEn 
                            ? (searchQuery.trim() ? `Explore unlimited live pins for "${searchQuery}"` : 'Browse 100,000+ Architectural Metalwork Ideas')
                            : (searchQuery.trim() ? `Explora miles de pines en vivo para "${searchQuery}"` : 'Explora +100,000 Diseños de Herrería en Pinterest')}
                        </h4>
                        <p className="live-gateway-desc">
                          {isEn
                            ? 'Discover real-time boards and trending concepts directly on Pinterest. If you see any design, our Los Angeles & Houston workshops will build it to order.'
                            : 'Navega tableros y tendencias en tiempo real directamente en Pinterest. Cualquier diseño que encuentres, nuestro taller de Los Ángeles y Houston te lo fabrica a medida.'}
                        </p>
                      </div>

                      <div className="live-gateway-actions">
                        <a 
                          href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(
                            searchQuery.trim() ? `${searchQuery.trim()} architectural metalwork` : 'modern architectural steel metalwork'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="live-gateway-primary-btn"
                        >
                          <Pin size={15} fill="#FFF" color="#FFF" />
                          <span>{isEn ? 'Open Pinterest Search' : 'Abrir Búsqueda en Pinterest'}</span>
                          <ExternalLink size={12} />
                        </a>

                        <button 
                          type="button" 
                          className="live-gateway-quote-btn"
                          onClick={() => {
                            if (searchQuery.trim()) {
                              setExternalPinUrl(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery.trim())}`);
                            }
                            setExternalPinModal(true);
                          }}
                        >
                          <LinkIcon size={14} />
                          <span>{isEn ? 'Quote a Pin URL from App' : 'Cotizar un Link de tu App'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pin-card-wrapper">
                  <div className="pin-card glass-panel">
                    
                    {/* Photo Container */}
                    <div className="pin-media-box">
                      <img 
                        src={pin.image} 
                        alt={isEn ? pin.titleEn : pin.titleEs} 
                        className="pin-img" 
                        loading="lazy" 
                      />
                      
                      {/* Top Badges: Direct Save on Pinterest & Interactive Heart */}
                      <div className="pin-top-overlay">
                        <a 
                          href={pin.pinterestUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="pinterest-save-tag"
                          title={isEn ? "View on Pinterest" : "Ver en Pinterest"}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pin size={12} fill="#FFF" color="#FFF" />
                          <span>Pinterest</span>
                        </a>

                        <button 
                          className={`pin-heart-btn ${isFav ? 'liked' : ''}`}
                          onClick={(e) => toggleFavorite(pin.id, e)}
                          title={isFav ? (isEn ? "Saved to your list" : "Guardado en tus favoritos") : (isEn ? "Save design" : "Guardar diseño")}
                        >
                          <Heart 
                            size={15} 
                            fill={isFav ? '#E60023' : 'none'} 
                            color={isFav ? '#E60023' : '#FFF'} 
                            className={isFav ? 'heart-bounce' : ''}
                          />
                          <span className="heart-count">{currentLikes}</span>
                        </button>
                      </div>

                      {/* Hover Overlay with Quote Button & Open Pinterest Button */}
                      <div className="pin-hover-backdrop">
                        <button 
                          className="pin-quote-btn"
                          onClick={() => setQuotingPin(pin)}
                        >
                          <Sparkles size={14} />
                          <span>{isEn ? 'Quote this Custom Design' : 'Cotizar este Trabajo'}</span>
                        </button>

                        <a 
                          href={pin.pinterestUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="pin-external-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{isEn ? 'Open Original Pin' : 'Ver Pin en Pinterest'}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    {/* Pin Info Body */}
                    <div className="pin-body">
                      <div className="pin-category-row">
                        <span className="pin-board-badge">
                          <Pin size={10} className="pin-icon-red" />
                          <span>{isEn ? pin.categoryNameEn : pin.categoryNameEs}</span>
                        </span>
                        <span className="pin-likes-micro">
                          <Heart size={11} fill={isFav ? '#E60023' : 'none'} color={isFav ? '#E60023' : '#94a3b8'} />
                          <span>{currentLikes}</span>
                        </span>
                      </div>

                      <h4 className="pin-title" title={isEn ? pin.titleEn : pin.titleEs}>
                        {isEn ? pin.titleEn : pin.titleEs}
                      </h4>

                      <p className="pin-desc">
                        {isEn ? pin.descEn : pin.descEs}
                      </p>

                      {pin.tags && pin.tags.length > 0 && (
                        <div className="pin-tags-row">
                          {pin.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="pin-tag"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(tag.replace('#', ''));
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pin-footer-actions">
                        <button 
                          className="quote-work-inline-btn"
                          onClick={() => setQuotingPin(pin)}
                        >
                          <span>{isEn ? 'Request Quote for this Work' : 'Pedir Cotización de este Trabajo'}</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* If fewer than 3 pins, render the live Pinterest gateway card at the end */}
          {filteredPins.length < 3 && (
            <div key="live-gateway-card-tail" className="pin-card-wrapper live-gateway-card-wrapper">
              <div className="pin-card live-gateway-card">
                <div className="live-gateway-top-bar">
                  <div className="live-gateway-brand">
                    <div className="pinterest-icon-bubble">
                      <Pin size={18} fill="#FFF" color="#FFF" />
                    </div>
                    <div>
                      <div className="live-gateway-badge">{isEn ? 'LIVE PINTEREST EXPLORER' : 'EXPLORADOR PINTEREST EN VIVO'}</div>
                      <div className="live-gateway-subbadge">{isEn ? '+10,000+ Ideas' : '+10,000+ Ideas en Vivo'}</div>
                    </div>
                  </div>
                </div>

                <div className="live-gateway-body">
                  <h4 className="live-gateway-title">
                    {isEn 
                      ? (searchQuery.trim() ? `Explore unlimited live pins for "${searchQuery}"` : 'Browse 100,000+ Architectural Metalwork Ideas')
                      : (searchQuery.trim() ? `Explora miles de pines en vivo para "${searchQuery}"` : 'Explora +100,000 Diseños de Herrería en Pinterest')}
                  </h4>
                  <p className="live-gateway-desc">
                    {isEn
                      ? 'Discover real-time boards and trending concepts directly on Pinterest. If you see any design, our Los Angeles & Houston workshops will build it to order.'
                      : 'Navega tableros y tendencias en tiempo real directamente en Pinterest. Cualquier diseño que encuentres, nuestro taller de Los Ángeles y Houston te lo fabrica a medida.'}
                  </p>
                </div>

                <div className="live-gateway-actions">
                  <a 
                    href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(
                      searchQuery.trim() ? `${searchQuery.trim()} architectural metalwork` : 'modern architectural steel metalwork'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="live-gateway-primary-btn"
                  >
                    <Pin size={15} fill="#FFF" color="#FFF" />
                    <span>{isEn ? 'Open Pinterest Search' : 'Abrir Búsqueda en Pinterest'}</span>
                    <ExternalLink size={12} />
                  </a>

                  <button 
                    type="button" 
                    className="live-gateway-quote-btn"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setExternalPinUrl(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                      setExternalPinModal(true);
                    }}
                  >
                    <LinkIcon size={14} />
                    <span>{isEn ? 'Quote a Pin URL from App' : 'Cotizar un Link de tu App'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. MODAL: COTIZAR TRABAJO O ENLACE EXTERNO DE PINTEREST */}
      <AnimatePresence>
        {(quotingPin || externalPinModal) && (
          <div className="quote-pin-modal-overlay" onClick={closeQuoteModal}>
            <motion.div 
              className="quote-pin-modal-card glass-panel"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={closeQuoteModal}>
                <X size={18} />
              </button>

              {!quoteSent ? (
                <div className="quote-modal-content-grid">
                  
                  {/* Left: Real Pinterest Photo Preview */}
                  <div className="modal-pin-preview">
                    <div className="preview-img-box">
                      <img 
                        src={quotingPin ? quotingPin.image : 'https://i.pinimg.com/736x/d6/8d/42/d68d4287a0abda3c0df86258e24f60d5.jpg'} 
                        alt="Pin preview" 
                        className="modal-preview-img" 
                      />
                      <span className="modal-pin-cat">
                        {quotingPin ? (isEn ? quotingPin.categoryNameEn : quotingPin.categoryNameEs) : 'PINTEREST PIN'}
                      </span>
                    </div>

                    <div className="modal-pin-meta">
                      <div className="pin-ref-id">
                        {quotingPin ? `REF: #${quotingPin.id.toUpperCase()}` : 'DISEÑO PERSONALIZADO PINTEREST'}
                      </div>
                      <h3 className="modal-pin-title">
                        {quotingPin ? (isEn ? quotingPin.titleEn : quotingPin.titleEs) : (externalPinUrl || 'Diseño de Pinterest')}
                      </h3>
                      
                      {quotingPin && (
                        <p className="modal-pin-desc">{isEn ? quotingPin.descEn : quotingPin.descEs}</p>
                      )}

                      {quotingPin?.pinterestUrl && (
                        <a 
                          href={quotingPin.pinterestUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="modal-pin-link-btn"
                        >
                          <Pin size={12} className="pin-icon-red" />
                          <span>{isEn ? 'View on Pinterest' : 'Ver en Pinterest.com'}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      <div className="modal-guarantee-badge">
                        <ShieldCheck size={14} className="text-accent" />
                        <span>{isEn ? 'Custom Fabricated in Houston & N. Hollywood' : 'Fabricación 100% a Medida en Taller'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quotation Form */}
                  <div className="modal-quote-form-col">
                    <div className="form-header">
                      <div className="badge-micro">
                        <Sparkles size={12} className="text-accent" />
                        <span>{isEn ? 'DIRECT WORKSHOP INQUIRY' : 'SOLICITUD DIRECTA DE TALLER'}</span>
                      </div>
                      <h2>{isEn ? 'Quote this Custom Design' : 'Cotizar este Trabajo a Medida'}</h2>
                      <p>
                        {isEn 
                          ? 'Send us your estimated dimensions or project location. We will calculate an estimate within 24 business hours.' 
                          : 'Envíanos tus medidas o cuéntanos de tu proyecto. El equipo técnico de taller te responderá con una propuesta.'}
                      </p>
                    </div>

                    {/* If opening via external link button, show input for link */}
                    {externalPinModal && (
                      <div className="form-group external-url-input-group">
                        <label>{isEn ? 'Pinterest Pin URL from your app / browser:' : 'Enlace del Pin de tu app o navegador:'}</label>
                        <input 
                          type="url"
                          placeholder="https://www.pinterest.com/pin/..."
                          value={externalPinUrl}
                          onChange={(e) => setExternalPinUrl(e.target.value)}
                          className="external-pin-input"
                        />
                      </div>
                    )}

                    <form onSubmit={handleQuoteSubmit} className="modal-quote-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>{isEn ? 'Full Name *' : 'Nombre Completo *'}</label>
                          <input 
                            type="text" 
                            required
                            placeholder={isEn ? "e.g. Michael Jordan" : "ej. Carlos Mendoza"}
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>{isEn ? 'Phone / WhatsApp *' : 'Teléfono / WhatsApp *'}</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="(818) 000-0000"
                            value={quoteForm.phone}
                            onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>{isEn ? 'Email Address' : 'Correo Electrónico'}</label>
                          <input 
                            type="email" 
                            placeholder="contacto@ejemplo.com"
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>{isEn ? 'City / State' : 'Ciudad y Estado'}</label>
                          <input 
                            type="text" 
                            placeholder={isEn ? "Los Angeles, CA or Houston, TX" : "Houston, TX o Los Angeles, CA"}
                            value={quoteForm.city}
                            onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>{isEn ? 'Approximate Dimensions or Notes' : 'Medidas Aproximadas o Detalles'}</label>
                        <textarea 
                          rows={3}
                          placeholder={isEn ? "e.g. 18 feet length, interior stairs, residential installation..." : "ej. 16 pies de largo, barandal para interior de casa, instalación en segundo piso..."}
                          value={quoteForm.notes}
                          onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        />
                      </div>

                      <div className="form-actions-row">
                        <button 
                          type="submit" 
                          className="btn btn-primary submit-quote-btn"
                          disabled={isSubmitting}
                        >
                          <Send size={15} />
                          <span>{isSubmitting ? (isEn ? 'Sending...' : 'Enviando...') : (isEn ? 'Submit Quote Request' : 'Enviar Solicitud a Taller')}</span>
                        </button>
                        
                        <a 
                          href={`https://wa.me/18189139598?text=${encodeURIComponent(
                            `Hola Station Metalworks, me interesa cotizar una fabricación similar a este diseño de Pinterest: "${quotingPin ? (isEn ? quotingPin.titleEn : quotingPin.titleEs) : (externalPinUrl || 'Diseño de Pinterest')}". Enlace: ${quotingPin?.pinterestUrl || externalPinUrl || ''}`
                          )}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="whatsapp-quick-btn"
                        >
                          <MessageCircle size={16} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </form>

                  </div>

                </div>
              ) : (
                <div className="quote-success-view">
                  <div className="success-icon-circle">
                    <CheckCircle2 size={42} className="text-accent" />
                  </div>
                  <h3>{isEn ? 'Inquiry Sent to Station Metalworks!' : '¡Solicitud Enviada al Taller!'}</h3>
                  <p>
                    {isEn
                      ? `We received your request for "${quotingPin ? quotingPin.titleEn : 'Pinterest Custom Design'}". Our workshop engineering team will review your specifications and contact you shortly.`
                      : `Recibimos tu solicitud para el diseño. El equipo técnico de taller revisará los datos y se comunicará contigo a la brevedad.`}
                  </p>

                  <div className="success-actions">
                    <a 
                      href={`https://wa.me/18189139598?text=${encodeURIComponent(
                        `Hola Station Metalworks, acabo de solicitar la cotización para el diseño de Pinterest en su sitio web.`
                      )}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <MessageCircle size={16} />
                      <span>{isEn ? 'Continue on WhatsApp' : 'Continuar por WhatsApp'}</span>
                    </a>
                    <button className="btn btn-secondary" onClick={closeQuoteModal}>
                      {isEn ? 'Close & Keep Exploring' : 'Cerrar y Seguir Explorando'}
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .pinterest-board-section {
          padding-top: 50px;
          padding-bottom: 70px;
        }

        .pinterest-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #E60023;
          background: rgba(230, 0, 35, 0.08);
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 14px;
        }

        .pin-icon-red {
          color: #E60023;
        }

        /* UNIFIED PINTEREST SEARCH COMMAND HUB */
        .pinterest-search-command-hub {
          margin-top: 32px;
          margin-bottom: 36px;
          padding: 24px;
          border-radius: 16px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pinterest-hero-search-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .pinterest-search-box-unified {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon-red {
          position: absolute;
          left: 18px;
          color: #E60023;
          pointer-events: none;
        }

        .pinterest-search-input-unified {
          width: 100%;
          padding: 15px 44px 15px 50px;
          background: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 30px;
          font-size: 0.96rem;
          font-weight: 500;
          color: #0F172A;
          outline: none;
          transition: all 0.25s ease;
        }

        .pinterest-search-input-unified:focus {
          border-color: #E60023;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(230, 0, 35, 0.12);
        }

        .clear-search-btn-unified {
          position: absolute;
          right: 16px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #E2E8F0;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-search-btn-unified:hover {
          background: #0F172A;
          color: #FFFFFF;
        }

        .search-live-pinterest-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 14px 20px;
          background: #E60023;
          border: 1.5px solid #E60023;
          border-radius: 30px;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
          color: #FFFFFF;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(230, 0, 35, 0.25);
        }

        .search-live-pinterest-btn:hover {
          background: #C8001F;
          border-color: #C8001F;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(230, 0, 35, 0.35);
          color: #FFFFFF;
        }

        .paste-external-pin-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 30px;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .paste-external-pin-btn:hover {
          border-color: #E60023;
          color: #E60023;
          background: #FFF5F5;
        }

        /* INSPIRATION SUGGESTIONS TRAY */
        .inspiration-suggestions-tray {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 4px;
        }

        .suggestions-header-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .suggestions-scrollable-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .suggestion-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 15px;
          background: #F1F5F9;
          border: 1px solid transparent;
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-chip:hover {
          background: #E2E8F0;
          color: #0F172A;
          transform: translateY(-1px);
        }

        .suggestion-chip.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.2);
        }

        .favorites-chip {
          margin-left: auto;
          background: rgba(230, 0, 35, 0.08);
          color: #E60023;
          border: 1px solid rgba(230, 0, 35, 0.2);
        }

        .favorites-chip:hover {
          background: rgba(230, 0, 35, 0.15);
          color: #E60023;
        }

        .favorites-chip.active {
          background: #E60023;
          color: #FFFFFF;
          border-color: #E60023;
          box-shadow: 0 4px 12px rgba(230, 0, 35, 0.3);
        }

        /* Search Status Bar */
        .search-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
          font-size: 0.8rem;
          color: #64748B;
        }

        .query-highlight-badge {
          margin-left: 6px;
          font-weight: 700;
          color: #E60023;
          background: rgba(230, 0, 35, 0.08);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .reset-query-link {
          background: transparent;
          border: none;
          color: #B8332A;
          font-weight: 700;
          font-size: 0.78rem;
          cursor: pointer;
          text-decoration: underline;
        }

        /* 4. MASONRY WATERFALL PIN GRID */
        .pinterest-waterfall-grid {
          column-count: 3;
          column-gap: 22px;
        }

        @media (max-width: 1024px) {
          .pinterest-waterfall-grid {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .pinterest-waterfall-grid {
            column-count: 1;
          }
        }

        .pin-card-wrapper {
          break-inside: avoid;
          margin-bottom: 22px;
        }

        .pin-card {
          border-radius: 16px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
        }

        .pin-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
          border-color: rgba(230, 0, 35, 0.3);
        }

        .pin-media-box {
          position: relative;
          width: 100%;
          min-height: 240px;
          max-height: 420px;
          overflow: hidden;
          background: #0F172A;
        }

        .pin-img {
          width: 100%;
          height: auto;
          min-height: 240px;
          max-height: 420px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .pin-card:hover .pin-img {
          transform: scale(1.04);
        }

        /* Top Overlay Badges */
        .pin-top-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 3;
        }

        .pinterest-save-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: #E60023;
          color: #FFFFFF;
          border-radius: 20px;
          font-size: 0.74rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s;
        }

        .pinterest-save-tag:hover {
          background: #AD081B;
          transform: scale(1.05);
        }

        .pin-heart-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px;
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          cursor: pointer;
          font-family: monospace;
          font-size: 0.78rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .pin-heart-btn:hover {
          background: rgba(15, 23, 42, 0.95);
          transform: scale(1.06);
        }

        .pin-heart-btn.liked {
          background: #FFFFFF;
          color: #E60023;
          border-color: #E60023;
        }

        .heart-bounce {
          animation: heartBounceAnim 0.35s ease forwards;
        }

        @keyframes heartBounceAnim {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }

        .pin-hover-backdrop {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 20px;
          gap: 10px;
          transition: opacity 0.25s ease;
          z-index: 2;
        }

        .pin-card:hover .pin-hover-backdrop {
          opacity: 1;
        }

        .pin-quote-btn {
          width: 100%;
          padding: 11px 16px;
          background: #B8332A;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(184, 51, 42, 0.4);
        }

        .pin-quote-btn:hover {
          background: #8F231C;
          transform: translateY(-2px);
        }

        .pin-external-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          color: #E2E8F0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .pin-external-link:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }

        .pin-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pin-category-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pin-board-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #E60023;
          letter-spacing: 0.04em;
        }

        .pin-likes-micro {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-family: monospace;
          color: #64748B;
        }

        .pin-title {
          font-family: var(--font-heading);
          font-size: 0.98rem;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.38;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pin-desc {
          font-size: 0.82rem;
          color: #64748B;
          line-height: 1.45;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pin-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 4px;
        }

        .pin-tag {
          font-family: monospace;
          font-size: 0.68rem;
          color: #64748B;
          background: #F1F5F9;
          padding: 2px 7px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pin-tag:hover {
          background: #E2E8F0;
          color: #B8332A;
        }

        .pin-footer-actions {
          margin-top: 10px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .quote-work-inline-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quote-work-inline-btn:hover {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        /* LIVE PINTEREST GATEWAY CARD IN MASONRY GRID */
        .live-gateway-card-wrapper {
          break-inside: avoid;
          margin-bottom: 22px;
        }

        .live-gateway-card {
          background: linear-gradient(155deg, #0F172A 0%, #1E293B 60%, #1A0D15 100%);
          border: 1.5px solid rgba(230, 0, 35, 0.4);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 0 25px rgba(230, 0, 35, 0.15);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .live-gateway-card::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(230, 0, 35, 0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        .live-gateway-card:hover {
          transform: translateY(-4px);
          border-color: #E60023;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35), 0 0 35px rgba(230, 0, 35, 0.3);
        }

        .live-gateway-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .live-gateway-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pinterest-icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #E60023;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(230, 0, 35, 0.4);
        }

        .live-gateway-badge {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #FF4D6D;
          text-transform: uppercase;
        }

        .live-gateway-subbadge {
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .live-gateway-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .live-gateway-title {
          font-family: var(--font-heading);
          font-size: 1.12rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.35;
          margin: 0;
        }

        .live-gateway-desc {
          font-size: 0.84rem;
          color: #CBD5E1;
          line-height: 1.5;
          margin: 0;
        }

        .live-gateway-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }

        .live-gateway-primary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 18px;
          background: #E60023;
          color: #FFFFFF;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(230, 0, 35, 0.35);
        }

        .live-gateway-primary-btn:hover {
          background: #C8001F;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(230, 0, 35, 0.5);
          color: #FFFFFF;
        }

        .live-gateway-quote-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.08);
          color: #F1F5F9;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .live-gateway-quote-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
        }

        /* Empty State */
        .empty-pins-box {
          padding: 60px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          border-radius: 16px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        .empty-pins-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(230, 0, 35, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .empty-pins-box h3 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          max-width: 600px;
        }

        .empty-pins-box p {
          max-width: 580px;
          font-size: 0.92rem;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
        }

        .empty-state-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }

        .btn-pinterest-live-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #E60023;
          color: #FFFFFF;
          border-radius: 30px;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(230, 0, 35, 0.35);
        }

        .btn-pinterest-live-action:hover {
          background: #C8001F;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(230, 0, 35, 0.45);
          color: #FFFFFF;
        }

        .btn-quote-custom-pin {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          border-radius: 30px;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-quote-custom-pin:hover {
          background: #1E293B;
          transform: translateY(-2px);
        }

        .btn-reset-to-all {
          display: inline-flex;
          align-items: center;
          padding: 12px 20px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 30px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset-to-all:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        /* MODAL STYLES */
        .quote-pin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .quote-pin-modal-card {
          position: relative;
          width: 100%;
          max-width: 860px;
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #F1F5F9;
          border: none;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #0F172A;
          color: #FFFFFF;
        }

        .quote-modal-content-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
        }

        @media (max-width: 768px) {
          .quote-modal-content-grid {
            grid-template-columns: 1fr;
          }
        }

        .modal-pin-preview {
          background: #F8FAFC;
          border-right: 1px solid #E2E8F0;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .preview-img-box {
          position: relative;
          width: 100%;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
          background: #0F172A;
        }

        .modal-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-pin-cat {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .pin-ref-id {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 800;
          color: #E60023;
          margin-bottom: 4px;
        }

        .modal-pin-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          line-height: 1.35;
        }

        .modal-pin-desc {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.4;
          margin: 4px 0;
        }

        .modal-pin-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #E60023;
          text-decoration: none;
          margin-top: 6px;
          padding: 6px 10px;
          background: rgba(230, 0, 35, 0.08);
          border-radius: 6px;
          transition: all 0.2s;
        }

        .modal-pin-link-btn:hover {
          background: rgba(230, 0, 35, 0.15);
          text-decoration: underline;
        }

        .modal-guarantee-badge {
          margin-top: 10px;
          padding: 10px 12px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.74rem;
          font-weight: 600;
          color: #334155;
        }

        .modal-quote-form-col {
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-header h2 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          margin: 4px 0 6px;
          color: #0F172A;
        }

        .form-header p {
          font-size: 0.84rem;
          color: #64748B;
          margin: 0;
        }

        .external-url-input-group {
          background: #F8FAFC;
          padding: 12px;
          border-radius: 8px;
          border: 1px dashed #CBD5E1;
        }

        .modal-quote-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 540px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
        }

        .form-group input,
        .form-group textarea {
          padding: 10px 12px;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.86rem;
          color: #0F172A;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #B8332A;
        }

        .form-actions-row {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .submit-quote-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          font-weight: 700;
        }

        .whatsapp-quick-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: #25D366;
          color: #FFFFFF;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.86rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .whatsapp-quick-btn:hover {
          background: #1EBE5D;
        }

        /* Success View */
        .quote-success-view {
          padding: 60px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .success-icon-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(184, 51, 42, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .quote-success-view h3 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .quote-success-view p {
          max-width: 520px;
          font-size: 0.9rem;
          color: #64748B;
          line-height: 1.6;
          margin: 0;
        }

        .success-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
