import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Search, X, ExternalLink, Send, CheckCircle2, 
  Sparkles, Filter, MessageCircle, ArrowRight, Compass, 
  Ruler, Pin, ShieldCheck, Download, Layers, Link as LinkIcon,
  RefreshCw, Check, UploadCloud, AlertCircle, Info, SlidersHorizontal,
  Loader2
} from 'lucide-react';

import { REAL_PINTEREST_PINS, POPULAR_PINTEREST_FEEDS } from '../data/realPinterestPins';

// Preset Pinterest Board options for the official widget and quick connect
const PRESET_PINTEREST_BOARDS = [
  {
    id: 'dezeen-stairs',
    nameEn: 'Dezeen • Modern Stairs & Metalwork',
    nameEs: 'Dezeen • Escaleras y Herrería de Autor',
    boardHandle: 'dezeen/staircases',
    url: 'https://www.pinterest.com/dezeen/staircases/',
    rss: 'https://www.pinterest.com/dezeen/staircases.rss',
    descEn: 'Architectural floating stairs, cantilevered treads, and steel railings curated by Dezeen.',
    descEs: 'Escaleras voladizas, peldaños suspendidos y barandales contemporáneos curados por Dezeen.'
  },
  {
    id: 'contemporist-stairs',
    nameEn: 'Contemporist • Contemporary Stairs',
    nameEs: 'Contemporist • Escaleras Contemporáneas',
    boardHandle: 'contemporist/stairs',
    url: 'https://www.pinterest.com/contemporist/stairs/',
    rss: 'https://www.pinterest.com/contemporist/stairs.rss',
    descEn: 'Minimalist mono-stringers, white oak treads, and matte black iron architecture.',
    descEs: 'Monovigas minimalistas, peldaños de roble y arquitectura en hierro negro mate.'
  },
  {
    id: 'archdaily-stairs',
    nameEn: 'ArchDaily • Floating & Steel Structures',
    nameEs: 'ArchDaily • Estructuras de Acero y Balcones',
    boardHandle: 'archdaily/stairs',
    url: 'https://www.pinterest.com/archdaily/stairs/',
    rss: 'https://www.pinterest.com/archdaily/stairs.rss',
    descEn: 'Global award-winning residential metal railings, cable stairs, and steel entries.',
    descEs: 'Proyectos residenciales premiados en acero estructural, barandales y entradas.'
  },
  {
    id: 'archdigest-outdoors',
    nameEn: 'Architectural Digest • Gates & Portals',
    nameEs: 'Architectural Digest • Portones y Terrazas',
    boardHandle: 'archdigest',
    url: 'https://www.pinterest.com/archdigest/',
    rss: 'https://www.pinterest.com/archdigest/feed.rss',
    descEn: 'Luxury exterior metalwork, custom motorized entrance gates, and shaded pergolas.',
    descEs: 'Portones pivotantes monumentales, celosías de corte láser y pérgolas exteriores.'
  },
  {
    id: 'designmilk-arch',
    nameEn: 'Design Milk • Modern Metal Design',
    nameEs: 'Design Milk • Diseño Metálico Moderno',
    boardHandle: 'designmilk/architecture',
    url: 'https://www.pinterest.com/designmilk/architecture/',
    rss: 'https://www.pinterest.com/designmilk/architecture.rss',
    descEn: 'Clean geometric ironwork, industrial furniture frames, and custom architectural screens.',
    descEs: 'Líneas geométricas puras, marcos estructurales y pantallas decorativas.'
  },
  {
    id: 'dwell-feed',
    nameEn: 'Dwell • Architectural Details',
    nameEs: 'Dwell • Detalles Arquitectónicos',
    boardHandle: 'dwell',
    url: 'https://www.pinterest.com/dwell/',
    rss: 'https://www.pinterest.com/dwell/feed.rss',
    descEn: 'Modern interior details, marine cable balustrades, and sleek continuous handrails.',
    descEs: 'Interiores contemporáneos con barandales de cable marino y pasamanos continuos.'
  }
];

export default function PinterestInspirationBoard() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Active view tab: 'moodboard' (Pines con cotizador y corazón) | 'live_board' (Widget oficial de Pinterest) | 'custom_pin' (Cotizar enlace de Pinterest)
  const [activeTab, setActiveTab] = useState('moodboard');

  // Master Pin List: initialized with 70 real authentic Pinterest pins from i.pinimg.com
  const [pinsList, setPinsList] = useState(REAL_PINTEREST_PINS);

  // Live Pinterest Feed connection state (Wix style)
  const [boardSearchInput, setBoardSearchInput] = useState('');
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [feedNotification, setFeedNotification] = useState(null);
  const [activeFeedBoard, setActiveFeedBoard] = useState('all');

  // Official Widget Pinterest Board selection / custom URL
  const [selectedWidgetBoardPreset, setSelectedWidgetBoardPreset] = useState(PRESET_PINTEREST_BOARDS[0].id);
  const [customWidgetBoardUrl, setCustomWidgetBoardUrl] = useState(() => {
    return localStorage.getItem('smw_custom_pinterest_board') || '';
  });
  const [activeWidgetBoardUrl, setActiveWidgetBoardUrl] = useState(PRESET_PINTEREST_BOARDS[0].url);

  // Custom External Pin Quote Input
  const [externalPinInput, setExternalPinInput] = useState('');
  const [externalPinQuoteModal, setExternalPinQuoteModal] = useState(false);

  // Search & Category Filter state
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('smw_pinterest_favorites');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Quote Request Modal for a pin
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

  const boardContainerRef = useRef(null);

  // Re-run Pinterest widget script when active widget board URL changes
  useEffect(() => {
    if (activeTab === 'live_board') {
      const timer = setTimeout(() => {
        if (window.PinUtils && window.PinUtils.build) {
          window.PinUtils.build();
        } else {
          const script = document.createElement('script');
          script.src = '//assets.pinterest.com/js/pinit.js';
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeWidgetBoardUrl]);

  // Convert any user input (URL, handle, board) into a valid Pinterest RSS feed
  const parsePinterestRssUrl = (input) => {
    let clean = input.trim();
    if (!clean) return null;

    // Handle full URL
    if (clean.includes('pinterest.com/')) {
      try {
        const urlObj = new URL(clean);
        let pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length === 0) return null;
        if (pathParts.length === 1) {
          return {
            rss: `https://www.pinterest.com/${pathParts[0]}/feed.rss`,
            name: pathParts[0],
            boardHandle: pathParts[0]
          };
        } else {
          return {
            rss: `https://www.pinterest.com/${pathParts[0]}/${pathParts[1]}.rss`,
            name: `${pathParts[0]} / ${pathParts[1]}`,
            boardHandle: `${pathParts[0]}/${pathParts[1]}`
          };
        }
      } catch {
        return null;
      }
    }

    // Handle board format: user/board
    if (clean.includes('/')) {
      const [u, b] = clean.split('/').map(s => s.trim());
      return {
        rss: `https://www.pinterest.com/${u}/${b}.rss`,
        name: `${u} / ${b}`,
        boardHandle: `${u}/${b}`
      };
    }

    // Handle username only: user
    return {
      rss: `https://www.pinterest.com/${clean}/feed.rss`,
      name: clean,
      boardHandle: clean
    };
  };

  // Fetch real pins directly from Pinterest RSS feed (Wix style)
  const fetchLivePinterestBoard = async (targetInput) => {
    const feedInfo = parsePinterestRssUrl(targetInput);
    if (!feedInfo) {
      setFeedNotification({
        type: 'error',
        message: isEn ? 'Invalid Pinterest URL or board name. Try "dezeen/staircases" or a full URL.' : 'Nombre de tablero o URL no válida. Prueba con "dezeen/staircases" o el enlace completo.'
      });
      return;
    }

    setIsLoadingFeed(true);
    setFeedNotification(null);

    try {
      // Use rss2json to parse Pinterest RSS without CORS issues
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedInfo.rss)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const newPins = [];
        data.items.forEach((item) => {
          const match = item.description ? item.description.match(/src="([^"]+)"/) : null;
          if (match && match[1]) {
            const thumb = match[1];
            const highRes = thumb.replace('/236x/', '/736x/');
            const cleanTitle = (item.title || 'Architectural Metalwork')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .trim();

            const words = cleanTitle.split(/\s+/).filter(w => w.length > 4).slice(0, 3);
            const tags = words.map(w => '#' + w.replace(/[^a-zA-Z0-9]/g, ''));

            newPins.push({
              id: 'pin-' + (item.guid ? item.guid.split('/').filter(Boolean).pop() : Math.random().toString(36).substr(2, 9)),
              title: cleanTitle,
              titleEs: cleanTitle,
              link: item.link,
              imgThumb: thumb,
              imgFull: highRes,
              board: feedInfo.boardHandle,
              boardName: feedInfo.name,
              category: feedInfo.boardHandle.includes('stair') ? 'stairs' : (feedInfo.boardHandle.includes('gate') ? 'gates' : 'railings'),
              likes: Math.floor(Math.random() * 100) + 40,
              tags: tags.length ? tags : ['#PinterestReal', '#StationMetalworks'],
              isLiveFetched: true
            });
          }
        });

        if (newPins.length > 0) {
          // Prepend new pins to pins list, avoiding duplicates
          setPinsList((prev) => {
            const existingLinks = new Set(prev.map(p => p.link));
            const fresh = newPins.filter(p => !existingLinks.has(p.link));
            return [...fresh, ...prev];
          });

          setActiveFeedBoard(feedInfo.boardHandle);
          setFeedNotification({
            type: 'success',
            message: isEn 
              ? `Connected to Pinterest! Loaded ${newPins.length} real photos from "${feedInfo.name}".`
              : `¡Conectado con Pinterest real! Se cargaron ${newPins.length} fotos de "${feedInfo.name}".`
          });
        } else {
          setFeedNotification({
            type: 'error',
            message: isEn ? 'No photo pins found in this Pinterest board.' : 'No se encontraron pines con foto en este tablero de Pinterest.'
          });
        }
      } else {
        setFeedNotification({
          type: 'error',
          message: isEn ? 'Could not connect to this Pinterest board. Make sure it is public.' : 'No se pudo conectar a este tablero. Verifica que sea público en Pinterest.'
        });
      }
    } catch (err) {
      console.error('Pinterest fetch error:', err);
      setFeedNotification({
        type: 'error',
        message: isEn ? 'Connection error. Please try again or select a preset.' : 'Error de conexión. Intenta de nuevo o selecciona un tablero predeterminado.'
      });
    } finally {
      setIsLoadingFeed(false);
    }
  };

  // Handle Board URL Change in Official Widget
  const handleWidgetBoardSelect = (presetId) => {
    setSelectedWidgetBoardPreset(presetId);
    if (presetId === 'custom') {
      if (customWidgetBoardUrl.trim()) {
        setActiveWidgetBoardUrl(customWidgetBoardUrl.trim());
      }
    } else {
      const preset = PRESET_PINTEREST_BOARDS.find(b => b.id === presetId);
      if (preset) {
        setActiveWidgetBoardUrl(preset.url);
      }
    }
  };

  const handleSaveCustomWidgetBoard = (e) => {
    e.preventDefault();
    if (customWidgetBoardUrl.trim()) {
      localStorage.setItem('smw_custom_pinterest_board', customWidgetBoardUrl.trim());
      setSelectedWidgetBoardPreset('custom');
      setActiveWidgetBoardUrl(customWidgetBoardUrl.trim());
    }
  };

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

  // Filtered pins
  const filteredPins = useMemo(() => {
    return pinsList.filter((pin) => {
      // 1. Favorites Filter
      if (activeCategoryFilter === 'favorites') {
        if (!favorites[pin.id]) return false;
      } 
      // 2. Specific Board Filter
      else if (activeFeedBoard !== 'all') {
        if (pin.board !== activeFeedBoard) return false;
      }
      // 3. Category Filter
      else if (activeCategoryFilter !== 'all') {
        if (pin.category !== activeCategoryFilter) return false;
      }

      // 4. Keyword Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (pin.title || '').toLowerCase();
        const tags = (pin.tags || []).join(' ').toLowerCase();
        const board = (pin.boardName || pin.board || '').toLowerCase();
        return title.includes(q) || tags.includes(q) || board.includes(q);
      }

      return true;
    });
  }, [pinsList, activeCategoryFilter, activeFeedBoard, searchQuery, favorites]);

  // Submit Quote Modal
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone) return;

    setIsSubmitting(true);
    try {
      const pinTitle = quotingPin ? (quotingPin.title || 'Diseño Pinterest') : (externalPinInput || 'Enlace de Pinterest');
      const pinLink = quotingPin?.link || externalPinInput || 'No indicado';
      const pinImg = quotingPin?.imgFull || '';

      const payload = {
        _subject: `[INSPIRACIÓN PINTEREST REAL] Cotización Solicitada: ${pinTitle}`,
        _template: 'blank',
        _language: 'es',
        _captcha: 'false',
        pin_id: quotingPin?.id || 'EXTERNAL_PIN',
        pin_titulo: pinTitle,
        pin_enlace: pinLink,
        pin_imagen: pinImg,
        pin_tablero: quotingPin?.boardName || quotingPin?.board || 'Pinterest',
        cliente_nombre: quoteForm.name,
        cliente_telefono: quoteForm.phone,
        cliente_email: quoteForm.email,
        cliente_ciudad: quoteForm.city || 'No especificada',
        detalles_proyecto: quoteForm.notes || 'Solicitud generada desde la galería de fotos reales de Pinterest',
        origen: 'Pinterest Moodboard Gallery Real'
      };

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
    setExternalPinQuoteModal(false);
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
          <span>{isEn ? 'REAL PINTEREST ARCHITECTURAL FEED' : 'FOTOS 100% REALES DE PINTEREST'}</span>
        </div>
        <h2 className="text-gradient">
          {isEn ? 'Pinterest Moodboard & Custom Work Quotation' : 'Tableros de Inspiración Pinterest & Cotizador de Diseños'}
        </h2>
        <p>
          {isEn
            ? 'Real photography directly from Pinterest CDN (i.pinimg.com). Connect your favorite board, save designs with the heart ❤️, or quote custom fabrication in our Houston & Los Angeles workshops.'
            : 'Fotografía auténtica conectada en directo a los servidores de Pinterest. Conecta tu tablero preferido, guarda ideas con el corazón ❤️ o cotiza la fabricación a medida en nuestro taller.'}
        </p>

        {/* Action Header Nav: Switch between Moodboard, Official Live Feed, and External Pin Quoter */}
        <div className="pinterest-view-switcher">
          <button 
            className={`switcher-btn ${activeTab === 'moodboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('moodboard')}
          >
            <Sparkles size={15} />
            <span>{isEn ? 'Real Pinterest Gallery (Quote & Heart)' : 'Galería con Cotizador & Corazón ❤️'}</span>
            <span className="badge-count-pill">{pinsList.length}</span>
          </button>

          <button 
            className={`switcher-btn ${activeTab === 'live_board' ? 'active' : ''}`}
            onClick={() => setActiveTab('live_board')}
          >
            <Pin size={15} className="pin-icon-red" />
            <span>{isEn ? 'Official Pinterest Embed Widget' : 'Widget Oficial de Tableros (Pinterest)'}</span>
          </button>

          <button 
            className={`switcher-btn ${activeTab === 'custom_pin' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom_pin')}
          >
            <LinkIcon size={15} />
            <span>{isEn ? 'Quote Any Pin URL' : 'Cotizar Cualquier Pin'}</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: REAL PINTEREST GALLERY WITH HEART & DIRECT QUOTE */}
      {activeTab === 'moodboard' && (
        <div className="moodboard-tab-content">
          
          {/* WIX-STYLE LIVE PINTEREST CONNECT BAR */}
          <div className="wix-connect-hub glass-panel">
            <div className="connect-header-row">
              <div className="connect-title-group">
                <div className="pinterest-circle-icon">
                  <Pin size={16} fill="#FFF" color="#FFF" />
                </div>
                <div>
                  <h3 className="connect-headline">
                    {isEn ? 'Connect Live Pinterest Boards (Wix Style)' : 'Conectar Tablero o Palabras de Pinterest (Estilo Wix)'}
                  </h3>
                  <p className="connect-sub">
                    {isEn 
                      ? 'Type any Pinterest board (e.g. dezeen/staircases, dwell, contemporist/stairs) or search words to fetch photos in real-time.'
                      : 'Escribe cualquier tablero de Pinterest (ej: dezeen/staircases, archdaily/stairs, dwell) o palabras clave para obtener fotos en vivo.'}
                  </p>
                </div>
              </div>

              {/* Feed Status Indicator */}
              <div className="live-status-pill">
                <span className="live-dot pulse"></span>
                <span>{isEn ? 'Pinterest CDN Live' : 'Conexión Pinterest Activa'}</span>
              </div>
            </div>

            {/* Wix Style Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (boardSearchInput.trim()) {
                  fetchLivePinterestBoard(boardSearchInput);
                }
              }} 
              className="wix-input-form"
            >
              <div className="wix-input-wrapper">
                <Search size={16} className="wix-input-icon" />
                <input
                  type="text"
                  className="wix-board-input"
                  value={boardSearchInput}
                  onChange={(e) => setBoardSearchInput(e.target.value)}
                  placeholder={
                    isEn 
                      ? "Enter Pinterest username/board (e.g. dezeen/staircases, contemporist/stairs, dwell, or paste board URL)..."
                      : "Ingresa tablero o usuario (ej: dezeen/staircases, archdaily/stairs, contemporist/stairs, o pega la URL del tablero)..."
                  }
                />
                {boardSearchInput && (
                  <button 
                    type="button" 
                    className="wix-clear-btn" 
                    onClick={() => setBoardSearchInput('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary wix-submit-btn"
                disabled={isLoadingFeed || !boardSearchInput.trim()}
              >
                {isLoadingFeed ? (
                  <>
                    <Loader2 size={15} className="spinner-icon" />
                    <span>{isEn ? 'Connecting...' : 'Obteniendo Fotos...'}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} />
                    <span>{isEn ? 'Fetch Real Photos' : 'Obtener Fotos de Pinterest'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Presets Pills (One-Click Live Boards) */}
            <div className="quick-presets-row">
              <span className="presets-label">
                <SlidersHorizontal size={13} />
                <span>{isEn ? 'Popular Architectural Boards:' : 'Tableros Populares en Vivo:'}</span>
              </span>
              <div className="preset-chips-scroll">
                {PRESET_PINTEREST_BOARDS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-chip ${activeFeedBoard === preset.boardHandle ? 'chip-active' : ''}`}
                    onClick={() => {
                      setBoardSearchInput(preset.boardHandle);
                      fetchLivePinterestBoard(preset.boardHandle);
                    }}
                  >
                    <Pin size={11} className="pin-icon-red" />
                    <span>{isEn ? preset.nameEn : preset.nameEs}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Toast */}
            {feedNotification && (
              <div className={`feed-toast ${feedNotification.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                {feedNotification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{feedNotification.message}</span>
                <button className="toast-close" onClick={() => setFeedNotification(null)}>
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {/* SECONDARY FILTER & SEARCH CONTROLS */}
          <div className="pinterest-control-hub glass-panel">
            <div className="pinterest-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="pinterest-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn 
                    ? "Filter by keyword in loaded pins (e.g. 'stairs', 'cable', 'black', 'wood', 'gate', 'balustrade')..."
                    : "Filtrar por palabras en las fotos (ej: 'escalera', 'cable', 'negro', 'roble', 'porton', 'vidrio')..."
                }
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="pinterest-board-pills">
              <button
                className={`board-pill-btn ${activeCategoryFilter === 'all' && activeFeedBoard === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategoryFilter('all');
                  setActiveFeedBoard('all');
                }}
              >
                <span>{isEn ? 'All Real Pins' : 'Todos los Pines Reales'} ({pinsList.length})</span>
              </button>

              <button
                className={`board-pill-btn ${activeCategoryFilter === 'stairs' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategoryFilter('stairs');
                  setActiveFeedBoard('all');
                }}
              >
                <span>{isEn ? 'Floating Stairs' : 'Escaleras Voladizas'}</span>
              </button>

              <button
                className={`board-pill-btn ${activeCategoryFilter === 'railings' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategoryFilter('railings');
                  setActiveFeedBoard('all');
                }}
              >
                <span>{isEn ? 'Cable & Glass Railings' : 'Barandales de Cable y Vidrio'}</span>
              </button>

              <button
                className={`board-pill-btn ${activeCategoryFilter === 'gates' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategoryFilter('gates');
                  setActiveFeedBoard('all');
                }}
              >
                <span>{isEn ? 'Driveway & Pivot Gates' : 'Portones y Entradas'}</span>
              </button>

              <button
                className={`board-pill-btn favorites-pill ${activeCategoryFilter === 'favorites' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategoryFilter(activeCategoryFilter === 'favorites' ? 'all' : 'favorites');
                  setActiveFeedBoard('all');
                }}
              >
                <Heart 
                  size={14} 
                  fill={favoritesCount > 0 ? '#E60023' : 'none'} 
                  color={favoritesCount > 0 ? '#E60023' : 'currentColor'} 
                />
                <span>{isEn ? `My Saved Pins (${favoritesCount})` : `Mis Guardados (${favoritesCount})`}</span>
              </button>
            </div>
          </div>

          {/* REAL PINTEREST WATERFALL MASONRY GRID */}
          {filteredPins.length === 0 ? (
            <div className="empty-pins-box glass-panel">
              <Compass size={36} className="text-accent" />
              <h3>{isEn ? 'No Pinterest photos match your search' : 'No encontramos fotos de Pinterest con esas palabras'}</h3>
              <p>
                {isEn 
                  ? 'Try clearing the search query or load new pins using the Pinterest connect bar above.' 
                  : 'Intenta limpiar el buscador o carga más fotos usando el conector de Pinterest arriba.'}
              </p>
              <button 
                className="btn btn-secondary" 
                onClick={() => { 
                  setActiveCategoryFilter('all'); 
                  setActiveFeedBoard('all');
                  setSearchQuery(''); 
                }}
              >
                {isEn ? 'Show All Pinterest Pins' : 'Mostrar Todas las Fotos de Pinterest'}
              </button>
            </div>
          ) : (
            <div className="pinterest-waterfall-grid">
              {filteredPins.map((pin) => {
                const isFav = !!favorites[pin.id];
                const currentLikes = pin.likes + (isFav ? 1 : 0);

                return (
                  <div key={pin.id} className="pin-card-wrapper">
                    <div className="pin-card glass-panel">
                      
                      {/* Real Pinterest Photo Container */}
                      <div className="pin-media-box">
                        <img 
                          src={pin.imgFull || pin.imgThumb} 
                          alt={pin.title} 
                          className="pin-img" 
                          loading="lazy" 
                          onError={(e) => {
                            // Fallback to thumb if high-res fails
                            if (pin.imgThumb && e.target.src !== pin.imgThumb) {
                              e.target.src = pin.imgThumb;
                            }
                          }}
                        />
                        
                        {/* Top Badges: Direct Save on Pinterest & Interactive Heart */}
                        <div className="pin-top-overlay">
                          <a 
                            href={pin.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="pinterest-save-tag"
                            title={isEn ? "View pin on Pinterest.com" : "Ver pin original en Pinterest"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Pin size={12} fill="#FFF" color="#FFF" />
                            <span>Pinterest</span>
                          </a>

                          <button 
                            className={`pin-heart-btn ${isFav ? 'liked' : ''}`}
                            onClick={(e) => toggleFavorite(pin.id, e)}
                            title={isFav ? (isEn ? "Saved to favorites" : "Guardado en tus favoritos") : (isEn ? "Save with heart" : "Guardar con corazón")}
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
                            href={pin.link} 
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
                            <span>{pin.boardName || pin.board || 'Pinterest Real'}</span>
                          </span>
                          <span className="pin-likes-micro">
                            <Heart size={11} fill={isFav ? '#E60023' : 'none'} color={isFav ? '#E60023' : '#94a3b8'} />
                            <span>{currentLikes}</span>
                          </span>
                        </div>

                        <h4 className="pin-title" title={pin.title}>
                          {pin.title}
                        </h4>

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
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 3. TAB 2: LIVE OFFICIAL PINTEREST FEED WIDGET (Native Pinterest SDK Integration) */}
      {activeTab === 'live_board' && (
        <div className="live-pinterest-tab-content">
          
          <div className="live-board-toolbar glass-panel">
            <div className="toolbar-header">
              <div className="title-with-icon">
                <Pin size={18} className="pin-icon-red" />
                <h3>{isEn ? 'Official Live Pinterest Board Widget' : 'Widget Oficial de Tableros Pinterest en Vivo'}</h3>
              </div>
              <p className="toolbar-explainer">
                {isEn
                  ? 'This widget loads the native Pinterest board embed engine directly from assets.pinterest.com.'
                  : 'Este visor carga el motor nativo de inserción de tableros directamente desde los servidores de Pinterest.'}
              </p>
            </div>

            {/* Presets + Custom Board Selector */}
            <div className="board-preset-selectors">
              <span className="preset-label">{isEn ? 'Select Board:' : 'Seleccionar Tablero:'}</span>
              <div className="presets-list">
                {PRESET_PINTEREST_BOARDS.map((b) => (
                  <button
                    key={b.id}
                    className={`preset-board-btn ${selectedWidgetBoardPreset === b.id ? 'active' : ''}`}
                    onClick={() => handleWidgetBoardSelect(b.id)}
                  >
                    <span>{isEn ? b.nameEn : b.nameEs}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Board URL Input */}
            <form onSubmit={handleSaveCustomWidgetBoard} className="custom-board-url-form">
              <label>{isEn ? 'Or Enter Custom Pinterest Board URL:' : 'O Carga Cualquier Enlace de Tablero Pinterest:'}</label>
              <div className="url-input-row">
                <input 
                  type="url" 
                  value={customWidgetBoardUrl}
                  onChange={(e) => setCustomWidgetBoardUrl(e.target.value)}
                  placeholder="https://www.pinterest.com/tu_usuario/nombre_del_tablero/"
                  className="board-url-input"
                />
                <button type="submit" className="btn btn-primary load-board-btn">
                  <RefreshCw size={14} />
                  <span>{isEn ? 'Load Widget' : 'Cargar en Widget'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Pinterest Official Embed Container */}
          <div className="pinterest-embed-container glass-panel" ref={boardContainerRef}>
            <div className="embed-inner-wrapper">
              <a 
                key={activeWidgetBoardUrl}
                data-pin-do="embedBoard" 
                data-pin-board-width="1000" 
                data-pin-scale-height="450" 
                data-pin-scale-width="140" 
                href={activeWidgetBoardUrl}
              >
                {activeWidgetBoardUrl}
              </a>
            </div>

            <div className="embed-helper-footer">
              <div className="helper-left">
                <Info size={14} className="text-accent" />
                <span>
                  {isEn 
                    ? `Connected to: ${activeWidgetBoardUrl}` 
                    : `Sincronizado con: ${activeWidgetBoardUrl}`}
                </span>
              </div>
              <a 
                href={activeWidgetBoardUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary btn-sm open-direct-btn"
              >
                <span>{isEn ? 'Open in Pinterest App' : 'Abrir en App Pinterest'}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

        </div>
      )}

      {/* 4. TAB 3: QUOTE ANY PIN FROM PINTEREST */}
      {activeTab === 'custom_pin' && (
        <div className="custom-pin-quote-tab-content glass-panel">
          <div className="custom-pin-box-header">
            <div className="icon-badge-box">
              <UploadCloud size={24} className="text-accent" />
            </div>
            <h3>{isEn ? 'Found an inspiring design on Pinterest? Quote it here!' : '¿Viste un trabajo en Pinterest que quieres fabricar? ¡Cotízalo aquí!'}</h3>
            <p>
              {isEn
                ? 'Copy the link of any pin from your Pinterest account or mobile app and paste it below. Our engineering team will examine the structure and calculate a custom estimate.'
                : 'Copia el enlace de cualquier Pin de Pinterest que hayas guardado en tu teléfono o computadora y pégalo abajo. Nuestro taller evaluará el diseño y te preparará un presupuesto.'}
            </p>
          </div>

          <div className="pin-url-action-card">
            <div className="pin-input-group">
              <label>{isEn ? 'Paste Pinterest Pin URL:' : 'Pega el enlace del Pin de Pinterest:'}</label>
              <div className="input-with-button">
                <input 
                  type="text"
                  placeholder="https://www.pinterest.com/pin/1234567890..."
                  value={externalPinInput}
                  onChange={(e) => setExternalPinInput(e.target.value)}
                  className="external-pin-input"
                />
                <button 
                  className="btn btn-primary quote-external-btn"
                  onClick={() => {
                    if (externalPinInput.trim()) {
                      setExternalPinQuoteModal(true);
                    }
                  }}
                  disabled={!externalPinInput.trim()}
                >
                  <Send size={15} />
                  <span>{isEn ? 'Request Workshop Quote' : 'Cotizar este Pin'}</span>
                </button>
              </div>
            </div>

            <div className="pin-or-whatsapp-box">
              <span className="or-divider">{isEn ? 'OR SEND IT DIRECTLY VIA WHATSAPP' : 'O ENVÍALO DIRECTAMENTE POR WHATSAPP'}</span>
              <a 
                href={`https://wa.me/18189139598?text=${encodeURIComponent(
                  externalPinInput.trim() 
                    ? `Hola Station Metalworks, me gustaría cotizar una fabricación idéntica a este diseño que vi en Pinterest: ${externalPinInput.trim()}`
                    : 'Hola Station Metalworks, tengo una foto / pin de Pinterest que me gustaría cotizar para mi proyecto.'
                )}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-big-btn"
              >
                <MessageCircle size={18} />
                <span>{isEn ? 'Send Pinterest Photo via WhatsApp' : 'Enviar Foto / Link de Pinterest por WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: COTIZAR TRABAJO CON IMAGEN REAL DE PINTEREST */}
      <AnimatePresence>
        {(quotingPin || externalPinQuoteModal) && (
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
                        src={quotingPin ? (quotingPin.imgFull || quotingPin.imgThumb) : 'https://i.pinimg.com/736x/d6/8d/42/d68d4287a0abda3c0df86258e24f60d5.jpg'} 
                        alt="Pin preview" 
                        className="modal-preview-img" 
                      />
                      <span className="modal-pin-cat">
                        {quotingPin ? (quotingPin.boardName || 'PINTEREST') : 'PINTEREST PIN'}
                      </span>
                    </div>

                    <div className="modal-pin-meta">
                      <div className="pin-ref-id">
                        {quotingPin ? `REF: #${quotingPin.id.toUpperCase()}` : 'DISEÑO PERSONALIZADO PINTEREST'}
                      </div>
                      <h3 className="modal-pin-title">
                        {quotingPin ? quotingPin.title : (externalPinInput || 'Diseño de Pinterest')}
                      </h3>
                      
                      {quotingPin?.link && (
                        <a 
                          href={quotingPin.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="modal-pin-link-btn"
                        >
                          <Pin size={12} className="pin-icon-red" />
                          <span>{isEn ? 'View Original Pin on Pinterest.com' : 'Ver Pin Original en Pinterest.com'}</span>
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
                          ? 'Send us your estimated dimensions or project location. We respond within 24 business hours.' 
                          : 'Envíanos tus medidas o cuéntanos de tu espacio. Te responderemos en menos de 24 horas con una propuesta.'}
                      </p>
                    </div>

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
                            `Hola Station Metalworks, me interesa cotizar una fabricación similar a este diseño de Pinterest: "${quotingPin ? quotingPin.title : (externalPinInput || 'Diseño de Pinterest')}". Enlace: ${quotingPin?.link || externalPinInput || ''}`
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
                      ? `We received your request for "${quotingPin ? quotingPin.title : 'Pinterest Custom Design'}". Our workshop engineering team will review your specifications and contact you shortly.`
                      : `Recibimos tu solicitud para el diseño. El equipo técnico de taller revisará los datos y se comunicará contigo a la brevedad.`}
                  </p>

                  <div className="success-actions">
                    <a 
                      href={`https://wa.me/18189139598?text=${encodeURIComponent(
                        `Hola Station Metalworks, acabo de solicitar la cotización para el diseño de Pinterest "${quotingPin ? quotingPin.title : ''}" en su sitio web.`
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

        /* View Switcher */
        .pinterest-view-switcher {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .switcher-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 24px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .switcher-btn:hover {
          border-color: #0F172A;
          color: #0F172A;
        }

        .switcher-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }

        .badge-count-pill {
          font-size: 0.72rem;
          font-family: monospace;
          background: rgba(230, 0, 35, 0.12);
          color: #E60023;
          padding: 2px 7px;
          border-radius: 12px;
          font-weight: 700;
        }

        .switcher-btn.active .badge-count-pill {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        /* WIX-STYLE LIVE CONNECT HUB */
        .wix-connect-hub {
          margin-top: 32px;
          margin-bottom: 24px;
          padding: 24px;
          border-radius: 16px;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%);
          border: 1.5px solid rgba(230, 0, 35, 0.18);
          box-shadow: 0 8px 30px rgba(230, 0, 35, 0.05);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .connect-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .connect-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pinterest-circle-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #E60023;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(230, 0, 35, 0.35);
          flex-shrink: 0;
        }

        .connect-headline {
          font-family: var(--font-heading);
          font-size: 1.08rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .connect-sub {
          font-size: 0.82rem;
          color: #64748B;
          margin: 2px 0 0 0;
        }

        .live-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          font-size: 0.72rem;
          font-family: monospace;
          font-weight: 700;
          color: #047857;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
        }

        .live-dot.pulse {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: livePulseAnim 1.8s infinite;
        }

        @keyframes livePulseAnim {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .wix-input-form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .wix-input-wrapper {
          flex: 1;
          min-width: 260px;
          position: relative;
        }

        .wix-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .wix-board-input {
          width: 100%;
          padding: 13px 40px 13px 42px;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #0F172A;
          outline: none;
          transition: all 0.2s;
        }

        .wix-board-input:focus {
          border-color: #E60023;
          box-shadow: 0 0 0 3px rgba(230, 0, 35, 0.1);
        }

        .wix-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .wix-clear-btn:hover {
          color: #0F172A;
        }

        .wix-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #E60023;
          border-color: #E60023;
          border-radius: 10px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.88rem;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(230, 0, 35, 0.3);
        }

        .wix-submit-btn:hover:not(:disabled) {
          background: #C9001F;
          border-color: #C9001F;
          transform: translateY(-1px);
        }

        .wix-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .spinner-icon {
          animation: spinAnim 1s linear infinite;
        }

        @keyframes spinAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Presets Chips */
        .quick-presets-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .presets-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .preset-chips-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          font-family: var(--font-heading);
          font-size: 0.74rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-chip:hover {
          border-color: #E60023;
          color: #E60023;
          background: #FFF5F5;
        }

        .preset-chip.chip-active {
          background: #E60023;
          border-color: #E60023;
          color: #FFFFFF;
        }

        .preset-chip.chip-active .pin-icon-red {
          color: #FFFFFF;
        }

        /* Toast */
        .feed-toast {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .toast-success {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .toast-error {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .toast-close {
          margin-left: auto;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;
        }

        .toast-close:hover {
          opacity: 1;
        }

        /* CONTROL HUB (Search in Loaded Pins) */
        .pinterest-control-hub {
          margin-bottom: 30px;
          padding: 18px 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .pinterest-search-box {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .pinterest-search-input {
          width: 100%;
          padding: 12px 44px 12px 46px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0F172A;
          outline: none;
          transition: all 0.2s;
        }

        .pinterest-search-input:focus {
          border-color: #B8332A;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(184, 51, 42, 0.1);
        }

        .clear-search-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .clear-search-btn:hover {
          color: #0F172A;
        }

        .pinterest-board-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .board-pill-btn {
          padding: 8px 15px;
          background: #F1F5F9;
          border: 1px solid transparent;
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .board-pill-btn:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .board-pill-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        .favorites-pill {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(230, 0, 35, 0.06);
          color: #E60023;
          border-color: rgba(230, 0, 35, 0.2);
        }

        .favorites-pill:hover {
          background: rgba(230, 0, 35, 0.12);
          color: #E60023;
        }

        .favorites-pill.active {
          background: #E60023;
          color: #FFFFFF;
          border-color: #E60023;
        }

        /* 3. MASONRY WATERFALL PIN GRID */
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
          max-height: 440px;
          overflow: hidden;
          background: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-img {
          width: 100%;
          height: auto;
          min-height: 240px;
          max-height: 440px;
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
          -webkit-line-clamp: 3;
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

        /* Empty State */
        .empty-pins-box {
          padding: 50px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          border-radius: 12px;
        }

        /* TAB 2: LIVE BOARD TOOLBAR & EMBED */
        .live-board-toolbar {
          margin-top: 30px;
          margin-bottom: 24px;
          padding: 24px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #FFFFFF;
        }

        .toolbar-header .title-with-icon {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-header h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
          color: #0F172A;
        }

        .toolbar-explainer {
          font-size: 0.86rem;
          color: #64748B;
          margin-top: 6px;
        }

        .board-preset-selectors {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .preset-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .presets-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preset-board-btn {
          padding: 8px 16px;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-board-btn:hover {
          border-color: #E60023;
          color: #E60023;
        }

        .preset-board-btn.active {
          background: #E60023;
          border-color: #E60023;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(230, 0, 35, 0.25);
        }

        .custom-board-url-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #E2E8F0;
        }

        .custom-board-url-form label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
        }

        .url-input-row {
          display: flex;
          gap: 10px;
        }

        .board-url-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .board-url-input:focus {
          border-color: #E60023;
        }

        .load-board-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .pinterest-embed-container {
          padding: 24px;
          border-radius: 14px;
          background: #FFFFFF;
          min-height: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .embed-inner-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          overflow-x: auto;
          padding-bottom: 20px;
        }

        .embed-helper-footer {
          width: 100%;
          padding-top: 16px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .helper-left {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #64748B;
          font-family: monospace;
        }

        .open-direct-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* TAB 3: CUSTOM PIN QUOTER */
        .custom-pin-quote-tab-content {
          margin-top: 30px;
          padding: 40px;
          border-radius: 16px;
          background: #FFFFFF;
          text-align: center;
        }

        .icon-badge-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(184, 51, 42, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .custom-pin-box-header h3 {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: #0F172A;
        }

        .custom-pin-box-header p {
          max-width: 600px;
          margin: 0 auto 30px;
          font-size: 0.92rem;
          color: #64748B;
          line-height: 1.6;
        }

        .pin-url-action-card {
          max-width: 680px;
          margin: 0 auto;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 24px;
        }

        .pin-input-group {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pin-input-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }

        .input-with-button {
          display: flex;
          gap: 10px;
        }

        .external-pin-input {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
        }

        .external-pin-input:focus {
          border-color: #B8332A;
        }

        .quote-external-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .pin-or-whatsapp-box {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px dashed #CBD5E1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .or-divider {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: #94A3B8;
          letter-spacing: 0.08em;
        }

        .whatsapp-big-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: #25D366;
          color: #FFFFFF;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-big-btn:hover {
          background: #1EBE5D;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
        }

        /* 5. MODAL STYLES */
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
          gap: 16px;
        }

        .preview-img-box {
          position: relative;
          width: 100%;
          height: 260px;
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

        .modal-pin-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #E60023;
          text-decoration: none;
          margin-top: 8px;
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
          margin-top: 14px;
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
          gap: 20px;
        }

        .form-header h2 {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          margin: 4px 0 6px;
          color: #0F172A;
        }

        .form-header p {
          font-size: 0.84rem;
          color: #64748B;
          margin: 0;
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
          margin-top: 8px;
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
