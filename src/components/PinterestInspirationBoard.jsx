import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Search, X, ExternalLink, Send, CheckCircle2, 
  Sparkles, Filter, MessageCircle, ArrowRight, Compass, 
  Ruler, Pin, ShieldCheck, Download, Layers
} from 'lucide-react';

import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import handrailsImg from '../assets/service_handrails.png';
import gatesImg from '../assets/service_gates.png';
import customImg from '../assets/service_custom.png';
import installImage from '../assets/railing_install.png';

// Extensive curated Pinterest Pins dataset
const INITIAL_PINS = [
  {
    id: 'pin-1',
    titleEn: 'Floating Cantilevered Mono-Stringer Staircase',
    titleEs: 'Escalera Voladiza Monoviga con Peldaños Flotantes',
    board: 'stairs',
    categoryEn: 'Modern Stairs',
    categoryEs: 'Escaleras Modernas',
    image: '/gallery/gallery_stairs_austin.jpg',
    aspect: 'tall', // tall, regular, wide
    likes: 142,
    tags: ['#EscalerasFlotantes', '#RobleBlanco', '#AceroNegro', '#Minimalismo'],
    descEn: 'Concealed structural spine in A36 steel with 3-inch solid white oak boxed treads and recessed under-tread LED channels.',
    descEs: 'Viga estructural oculta en acero A36 con peldaños de roble blanco macizo de 3 pulgadas y canales LED integrados.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=cantilevered%20mono%20stringer%20stairs'
  },
  {
    id: 'pin-2',
    titleEn: 'Minimalist Architectural Cable Railing Balustrade',
    titleEs: 'Barandal de Cable Marino AISI 316 Minimalista',
    board: 'railings',
    categoryEn: 'Cable & Glass Railings',
    categoryEs: 'Barandales de Cable y Vidrio',
    image: '/gallery/gallery_railing_cable.jpg',
    aspect: 'regular',
    likes: 98,
    tags: ['#CableRailing', '#AISI316', '#Terrazas', '#ArquitecturaModerna'],
    descEn: 'Marine-grade 316 stainless steel 1/8" hydraulic tensioned cables on 2x2 matte black posts with flat architectural top cap.',
    descEs: 'Cables tensores hidráulicos de 1/8" en acero inoxidable 316 marino sobre postes de 2x2" negro mate con pasamano plano.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=cable%20railing%20modern'
  },
  {
    id: 'pin-3',
    titleEn: 'Monolithic Heavy-Duty Pivot Entrance Gate',
    titleEs: 'Portón Pivotante Monolítico de 12 Pies',
    board: 'gates',
    categoryEn: 'Automated & Pivot Gates',
    categoryEs: 'Portones y Puertas de Entrada',
    image: '/gallery/gallery_gate_pivot.jpg',
    aspect: 'tall',
    likes: 215,
    tags: ['#PivotGate', '#PortonModerno', '#SeguridadResidencial', '#AceroCortado'],
    descEn: '12-foot architectural steel pivot gate with integrated commercial-grade concealed pivot hinge and magnetic smart lock.',
    descEs: 'Portón pivotante de 12 pies en acero estructural con bisagra de pivote oculta de alto tráfico y cerradura magnética inteligente.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=modern%20pivot%20gate%20metal'
  },
  {
    id: 'pin-4',
    titleEn: 'Continuous ADA Tubular Handrail Wall System',
    titleEs: 'Pasamanos Continuo ADA en Tubo Redondo 1.5"',
    board: 'handrails',
    categoryEn: 'ADA Handrails',
    categoryEs: 'Pasamanos ADA',
    image: '/gallery/gallery_handrail_ada.jpg',
    aspect: 'regular',
    likes: 76,
    tags: ['#ADARail', '#PasamanosPared', '#NormaIBC', '#AceroInoxidable'],
    descEn: '1.5-inch round code-compliant steel handrail with seamless radius bends and concealed heavy-duty wall flange mounting.',
    descEs: 'Pasamanos continuo de 1.5 pulgadas de diámetro conforme norma ADA con curvas en radio continuo y fijación invisible.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=ada%20metal%20handrail'
  },
  {
    id: 'pin-5',
    titleEn: 'CNC Precision Laser-Cut Architectural Screen',
    titleEs: 'Celosía de Corte Láser CNC & Pantalla Decorativa',
    board: 'custom',
    categoryEn: 'Pergolas & Custom Works',
    categoryEs: 'Pérgolas y Obras Especiales',
    image: '/gallery/gallery_custom_screen.jpg',
    aspect: 'wide',
    likes: 184,
    tags: ['#CorteLaser', '#CelosiaMetalica', '#Pergolas', '#DisenoArquitectonico'],
    descEn: 'Parametric geometric facade screen in 3/16" Corten-effect weathered steel for luxury patio privacy and light diffusion.',
    descEs: 'Panel geométrico paramétrico en acero de 3/16" cortado en láser de fibra óptica para privacidad y filtrado solar.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=laser%20cut%20metal%20screen'
  },
  {
    id: 'pin-6',
    titleEn: 'Base-Shoe Frameless Tempered Glass Balustrade',
    titleEs: 'Barandal de Vidrio Templado con Perfil Oculto Base-Shoe',
    board: 'railings',
    categoryEn: 'Cable & Glass Railings',
    categoryEs: 'Barandales de Cable y Vidrio',
    image: '/gallery/gallery_railing_glass.jpg',
    aspect: 'tall',
    likes: 167,
    tags: ['#GlassRailing', '#VidrioTemplado', '#BalconesDeLujo', '#VistaLimpia'],
    descEn: '1/2-inch structural laminated glass seated in a heavy-duty anodized aluminum channel with sleek stainless cladding.',
    descEs: 'Vidrio estructural templado de 1/2" embutido en perfil base de aluminio anodizado con tapa embellecedora de inox.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=frameless%20glass%20railing'
  },
  {
    id: 'pin-7',
    titleEn: 'Automated Cantilever Trackless Sliding Gate',
    titleEs: 'Portón Corredizo Voladizo sin Riel de Piso',
    board: 'gates',
    categoryEn: 'Automated & Pivot Gates',
    categoryEs: 'Portones y Puertas de Entrada',
    image: '/gallery/gallery_gate_sliding.jpg',
    aspect: 'regular',
    likes: 193,
    tags: ['#SlidingGate', '#PortonAutomatico', '#LiftMaster24V', '#Privacidad'],
    descEn: 'Cantilevered trackless gate system with 24V brushless motor, obstacle safety photo-eyes, and aluminum horizontal privacy slats.',
    descEs: 'Sistema corredero suspendido sin riel de piso, con motor brushless de 24V, fotocélulas de seguridad y lamas horizontales.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=modern%20sliding%20gate%20cantilever'
  },
  {
    id: 'pin-8',
    titleEn: 'Double Structural Steel Stringer Commercial Staircase',
    titleEs: 'Escalera Comercial de Doble Zanca de Acero',
    board: 'stairs',
    categoryEn: 'Modern Stairs',
    categoryEs: 'Escaleras Modernas',
    image: '/gallery/gallery_stairs_commercial.jpg',
    aspect: 'wide',
    likes: 128,
    tags: ['#DoubleStringer', '#EscalerasComerciales', '#SoldaduraTIG', '#AltoTransito'],
    descEn: 'Engineered commercial stair with dual laser-cut side stringers, diamond plate pan treads, and code-compliant guardrail.',
    descEs: 'Escalera comercial con zancas laterales cortadas en láser, charolas para colado de concreto y barandal normativo.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=double%20stringer%20metal%20stairs'
  },
  {
    id: 'pin-9',
    titleEn: 'Sculptural Floating Stair Tread Detail & Cable Infill',
    titleEs: 'Detalle Constructivo de Peldaños Flotantes & Cables',
    board: 'stairs',
    categoryEn: 'Modern Stairs',
    categoryEs: 'Escaleras Modernas',
    image: '/gallery/gallery_stairs_detail.jpg',
    aspect: 'tall',
    likes: 154,
    tags: ['#DetalleConstructivo', '#EscalerasDeAutor', '#AceroYMader', '#Ingenieria'],
    descEn: 'Architectural macro study of internal steel tread brackets securely locked into reinforced concrete shear walls.',
    descEs: 'Estudio de detalle de cartelas de acero interno ancladas rígidamente a muro de carga para cero flexión perceptible.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=floating%20stair%20detail%20metal'
  },
  {
    id: 'pin-10',
    titleEn: 'Rectangular 2x1" Steel Handrail with Matte Black L Brackets',
    titleEs: 'Pasamano Rectangular 2x1" con Soportes L en Negro Mate',
    board: 'handrails',
    categoryEn: 'ADA Handrails',
    categoryEs: 'Pasamanos ADA',
    image: handrailsImg,
    aspect: 'regular',
    likes: 112,
    tags: ['#RectangularHandrail', '#MatteBlack', '#DisenoIndustrial', '#HoustonTaller'],
    descEn: 'Sharp clean geometry rectangular tube handrail mounted with Circle L brackets, finished in architectural satin powder coat.',
    descEs: 'Tubo rectangular de bordes nítidos con soportes Circle L, acabado en pintura electrostática satinada de 10% de brillo.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=rectangle%20metal%20handrail'
  },
  {
    id: 'pin-11',
    titleEn: 'Modern Vertical Slat Steel Perimeter Fence & Gate Combo',
    titleEs: 'Cerca Perimetral y Portón de Lamas Verticales de Acero',
    board: 'gates',
    categoryEn: 'Automated & Pivot Gates',
    categoryEs: 'Portones y Puertas de Entrada',
    image: gatesImg,
    aspect: 'tall',
    likes: 177,
    tags: ['#VerticalSlats', '#CercasModernas', '#FachadasLujosas', '#AceroGalvanizado'],
    descEn: 'Continuous vertical bar rhythm fencing with matching integrated pedestrian and automated driveway gates.',
    descEs: 'Cierre perimetral con ritmo de perfiles verticales continuos con puerta peatonal y portón vehicular integrados.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=modern%20vertical%20slat%20gate'
  },
  {
    id: 'pin-12',
    titleEn: 'Custom Architectural Dining Table Base in Blackened Steel',
    titleEs: 'Mesa de Autor con Base Escultórica en Acero Pavonado',
    board: 'custom',
    categoryEn: 'Pergolas & Custom Works',
    categoryEs: 'Pérgolas y Obras Especiales',
    image: customImg,
    aspect: 'wide',
    likes: 204,
    tags: ['#MesaDeAcero', '#AceroPavonado', '#MobiliarioDeAutor', '#TallerHouston'],
    descEn: 'Geometric spider-base fabricated from heavy-gauge hot-rolled steel with beeswax hand-rubbed blackened patina.',
    descEs: 'Estructura geométrica de patas cruzadas fabricada en placa pesada con pátina pavonada y sellado con cera de abeja natural.',
    pinterestUrl: 'https://www.pinterest.com/search/pins/?q=blackened%20steel%20table%20base'
  }
];

export default function PinterestInspirationBoard() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Boards filter state: 'all' | 'stairs' | 'railings' | 'gates' | 'handrails' | 'custom' | 'favorites'
  const [activeBoard, setActiveBoard] = useState('all');
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

  // Quote Request Modal State for a specific pin
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
      const isFav = !!prev[pinId];
      const updated = { ...prev, [pinId]: !isFav };
      try {
        localStorage.setItem('smw_pinterest_favorites', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return updated;
    });
  };

  // Filtered pins based on board, search query, and favorites
  const filteredPins = useMemo(() => {
    return INITIAL_PINS.filter((pin) => {
      // Board filter
      if (activeBoard === 'favorites') {
        if (!favorites[pin.id]) return false;
      } else if (activeBoard !== 'all') {
        if (pin.board !== activeBoard) return false;
      }

      // Keyword search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (isEn ? pin.titleEn : pin.titleEs).toLowerCase();
        const desc = (isEn ? pin.descEn : pin.descEs).toLowerCase();
        const tags = pin.tags.join(' ').toLowerCase();
        const boardName = pin.board.toLowerCase();
        return title.includes(q) || desc.includes(q) || tags.includes(q) || boardName.includes(q);
      }

      return true;
    });
  }, [activeBoard, searchQuery, favorites, isEn]);

  // Handle quote modal submission
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone) return;

    setIsSubmitting(true);
    try {
      const payload = {
        _subject: `[INSPIRACIÓN PINTEREST] Cotización Solicitada: ${quotingPin?.titleEn}`,
        _template: 'blank',
        _language: 'es',
        _captcha: 'false',
        pin_id: quotingPin?.id,
        pin_titulo: isEn ? quotingPin?.titleEn : quotingPin?.titleEs,
        pin_tablero: quotingPin?.categoryEn,
        cliente_nombre: quoteForm.name,
        cliente_telefono: quoteForm.phone,
        cliente_email: quoteForm.email,
        cliente_ciudad: quoteForm.city || 'No especificada',
        detalles_proyecto: quoteForm.notes || 'Solicitud generada desde el tablero de inspiración Pinterest',
        origen: 'Pinterest Moodboard Gallery'
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
      // Fallback display
      setQuoteSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeQuoteModal = () => {
    setQuotingPin(null);
    setQuoteSent(false);
    setQuoteForm({ name: '', phone: '', email: '', city: '', notes: '' });
  };

  const favoritesCount = Object.values(favorites).filter(Boolean).length;

  return (
    <section className="pinterest-board-section container" id="lookbook">
      
      {/* 1. SECTION HEADER */}
      <div className="section-header">
        <div className="pinterest-badge-pill">
          <Pin size={13} className="pin-icon-red" />
          <span>{isEn ? 'PINTEREST INSPIRATION BOARDS' : 'TABLEROS DE INSPIRACIÓN PINTEREST'}</span>
        </div>
        <h2 className="text-gradient">
          {isEn ? 'Curated Architectural Moodboard & Work Gallery' : 'Galería de Estilos y Tablero de Inspiración'}
        </h2>
        <p>
          {isEn
            ? 'Discover real fabrication ideas, save your favorites with the heart, and directly request a quotation to craft any custom design for your project.'
            : 'Explora trabajos reales, guarda con el corazón tus diseños favoritos y pide cotización directa para fabricar exactamente ese modelo en tu obra.'}
        </p>

        {/* Pinterest Official Follow CTA */}
        <div className="pinterest-official-cta">
          <a 
            href="https://www.pinterest.com/search/pins/?q=station%20metalworks%20stairs%20railings" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pinterest-follow-btn"
          >
            <div className="p-badge">P</div>
            <span>{isEn ? 'Follow Station Metalworks on Pinterest' : 'Seguir Taller en Pinterest'}</span>
            <ExternalLink size={13} />
          </a>
          <span className="pinterest-meta-stat">
            <Sparkles size={13} className="text-accent" />
            <span>{isEn ? '+45 Curated Metalwork Boards • 2,000+ Architectural Pins' : '+45 Tableros de Metalistería • Más de 2,000 Pines'}</span>
          </span>
        </div>
      </div>

      {/* 2. SEARCH & BOARD FILTER BAR (Wix-Style Keywords) */}
      <div className="pinterest-control-hub glass-panel">
        
        {/* Search Input */}
        <div className="pinterest-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="pinterest-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isEn 
                ? "Filter by keyword (e.g., 'floating', 'matte black', 'cable', 'laser cut', 'pivot')..."
                : "Buscar por palabras (ej: 'voladizo', 'negro mate', 'cable', 'roble', 'corte láser')..."
            }
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Board Category Pills */}
        <div className="pinterest-board-pills">
          {[
            { id: 'all', labelEn: 'All Boards', labelEs: 'Todos los Tableros' },
            { id: 'stairs', labelEn: 'Floating Stairs', labelEs: 'Escaleras Voladizas' },
            { id: 'railings', labelEn: 'Cable & Glass Railings', labelEs: 'Barandales de Cable y Vidrio' },
            { id: 'gates', labelEn: 'Driveway & Pivot Gates', labelEs: 'Portones y Entradas' },
            { id: 'handrails', labelEn: 'ADA Handrails', labelEs: 'Pasamanos ADA' },
            { id: 'custom', labelEn: 'Laser Pergolas & Tables', labelEs: 'Pérgolas y Mesas CNC' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`board-pill-btn ${activeBoard === tab.id ? 'active' : ''}`}
              onClick={() => setActiveBoard(tab.id)}
            >
              <span>{isEn ? tab.labelEn : tab.labelEs}</span>
            </button>
          ))}

          {/* Favorites Filter Pill */}
          <button
            className={`board-pill-btn favorites-pill ${activeBoard === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveBoard(activeBoard === 'favorites' ? 'all' : 'favorites')}
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

      {/* 3. MASONRY WATERFALL PIN GRID */}
      {filteredPins.length === 0 ? (
        <div className="empty-pins-box glass-panel">
          <Compass size={32} className="text-accent" />
          <h3>{isEn ? 'No designs match your search' : 'No encontramos diseños con esas palabras'}</h3>
          <p>{isEn ? 'Try another keyword like "steel", "glass", "gate", or reset the filter.' : 'Prueba con otra palabra clave como "acero", "vidrio", "porton" o restablece el filtro.'}</p>
          <button className="btn btn-secondary" onClick={() => { setActiveBoard('all'); setSearchQuery(''); }}>
            {isEn ? 'Show All Inspiration Boards' : 'Ver Todos los Tableros'}
          </button>
        </div>
      ) : (
        <div className="pinterest-waterfall-grid">
          {filteredPins.map((pin) => {
            const isFav = !!favorites[pin.id];
            const currentLikes = pin.likes + (isFav ? 1 : 0);

            return (
              <div key={pin.id} className={`pin-card-wrapper pin-${pin.aspect}`}>
                <div className="pin-card glass-panel">
                  
                  {/* Pin Image Container */}
                  <div className="pin-media-box">
                    <img 
                      src={pin.image} 
                      alt={isEn ? pin.titleEn : pin.titleEs} 
                      className="pin-img" 
                      loading="lazy" 
                    />
                    
                    {/* Top Badges */}
                    <div className="pin-top-overlay">
                      {/* Pinterest Red Save Button */}
                      <a 
                        href={pin.pinterestUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="pinterest-save-tag"
                        title={isEn ? "Save to Pinterest" : "Guardar en Pinterest"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pin size={12} fill="#FFF" color="#FFF" />
                        <span>{isEn ? 'Save' : 'Guardar'}</span>
                      </a>

                      {/* Heart Like Button with Counter */}
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

                    {/* Hover Action Overlay */}
                    <div className="pin-hover-backdrop">
                      <button 
                        className="pin-quote-btn"
                        onClick={() => setQuotingPin(pin)}
                      >
                        <Sparkles size={14} />
                        <span>{isEn ? 'Quote this Design' : 'Cotizar este Trabajo'}</span>
                      </button>

                      <a 
                        href={pin.pinterestUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="pin-external-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{isEn ? 'View on Pinterest' : 'Ver en Pinterest'}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Pin Content Info */}
                  <div className="pin-body">
                    <div className="pin-category-row">
                      <span className="pin-cat-tag">{isEn ? pin.categoryEn : pin.categoryEs}</span>
                      <span className="pin-likes-micro">
                        <Heart size={11} fill={isFav ? '#E60023' : 'none'} color={isFav ? '#E60023' : '#94a3b8'} />
                        <span>{currentLikes}</span>
                      </span>
                    </div>

                    <h4 className="pin-title">
                      {isEn ? pin.titleEn : pin.titleEs}
                    </h4>

                    <p className="pin-desc">
                      {isEn ? pin.descEn : pin.descEs}
                    </p>

                    {/* Hashtags */}
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

                    {/* Action Footer Button */}
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

      {/* 4. MODAL: COTIZAR TRABAJO SELECCIONADO (Quick Quote Modal) */}
      <AnimatePresence>
        {quotingPin && (
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
                  
                  {/* Left: Selected Pin Preview */}
                  <div className="modal-pin-preview">
                    <div className="preview-img-box">
                      <img src={quotingPin.image} alt={quotingPin.titleEn} className="modal-preview-img" />
                      <span className="modal-pin-cat">{isEn ? quotingPin.categoryEn : quotingPin.categoryEs}</span>
                    </div>

                    <div className="modal-pin-meta">
                      <div className="pin-ref-id">REF: #{quotingPin.id.toUpperCase()}</div>
                      <h3>{isEn ? quotingPin.titleEn : quotingPin.titleEs}</h3>
                      <p className="modal-pin-spec-desc">{isEn ? quotingPin.descEn : quotingPin.descEs}</p>
                      
                      <div className="modal-guarantee-badge">
                        <ShieldCheck size={14} className="text-accent" />
                        <span>{isEn ? 'Custom Fabricated in Houston & N. Hollywood' : 'Fabricación 100% a Medida en Taller'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quote Request Form */}
                  <div className="modal-quote-form-col">
                    <div className="form-header">
                      <div className="badge-micro">
                        <Sparkles size={12} className="text-accent" />
                        <span>{isEn ? 'DIRECT WORKSHOP INQUIRY' : 'SOLICITUD DIRECTA DE TALLER'}</span>
                      </div>
                      <h2>{isEn ? 'Quote this Custom Design' : 'Cotizar este Trabajo a Medida'}</h2>
                      <p>{isEn ? 'Send us your dimensions or ask for advice. We will respond within 24 business hours.' : 'Envíanos tus medidas o cuéntanos de tu espacio. Te responderemos en menos de 24 horas con una propuesta.'}</p>
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
                        
                        {/* WhatsApp Quick Chat */}
                        <a 
                          href={`https://wa.me/18189139598?text=${encodeURIComponent(
                            `Hola Station Metalworks, me interesa cotizar una fabricación similar a este diseño de su tablero: "${quotingPin.titleEn}" (REF: #${quotingPin.id}). ¿Podrían darme más información?`
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
                      ? `We received your request for "${quotingPin?.titleEn}". José Almanza and the engineering team will review your specifications and contact you shortly.`
                      : `Recibimos tu solicitud para el diseño "${quotingPin?.titleEs}". El equipo técnico de taller revisará los datos y se comunicará contigo a la brevedad.`}
                  </p>

                  <div className="success-actions">
                    <a 
                      href={`https://wa.me/18189139598?text=${encodeURIComponent(
                        `Hola Station Metalworks, acabo de solicitar la cotización para el diseño "${quotingPin?.titleEn}" en su sitio web.`
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

        .pinterest-official-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .pinterest-follow-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: #E60023;
          color: #FFFFFF;
          border-radius: 24px;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(230, 0, 35, 0.25);
        }

        .pinterest-follow-btn:hover {
          background: #AD081B;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(230, 0, 35, 0.35);
        }

        .p-badge {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #E60023;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.75rem;
        }

        .pinterest-meta-stat {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        /* 2. CONTROL HUB (Search & Board Pills) */
        .pinterest-control-hub {
          margin-top: 36px;
          margin-bottom: 36px;
          padding: 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 16px;
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
          padding: 13px 44px 13px 46px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.92rem;
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
          padding: 8px 16px;
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
          border-color: rgba(184, 51, 42, 0.3);
        }

        .pin-media-box {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #111;
        }

        .pin-tall .pin-media-box {
          height: 380px;
        }

        .pin-regular .pin-media-box {
          height: 280px;
        }

        .pin-wide .pin-media-box {
          height: 220px;
        }

        .pin-img {
          width: 100%;
          height: 100%;
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

        /* Heart Button */
        .pin-heart-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px;
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.7);
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
          background: rgba(15, 23, 42, 0.9);
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

        /* Hover Backdrop */
        .pin-hover-backdrop {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
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

        /* Pin Body */
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

        .pin-cat-tag {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #B8332A;
          letter-spacing: 0.05em;
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
          font-size: 1.02rem;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.35;
          margin: 0;
        }

        .pin-desc {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        .pin-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }

        .pin-tag {
          font-family: monospace;
          font-size: 0.7rem;
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

        /* 4. MODAL: COTIZAR TRABAJO */
        .quote-pin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .quote-pin-modal-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
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
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #0F172A;
          color: #FFF;
        }

        .quote-modal-content-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
        }

        @media (max-width: 768px) {
          .quote-modal-content-grid {
            grid-template-columns: 1fr;
          }
        }

        .modal-pin-preview {
          background: #F8FAFC;
          border-right: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
        }

        .preview-img-box {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: #000;
        }

        .modal-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-pin-cat {
          position: absolute;
          bottom: 12px;
          left: 12px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          border-radius: 4px;
        }

        .modal-pin-meta {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pin-ref-id {
          font-family: monospace;
          font-size: 0.75rem;
          color: #B8332A;
          font-weight: 700;
        }

        .modal-pin-meta h3 {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }

        .modal-pin-spec-desc {
          font-size: 0.86rem;
          color: #475569;
          line-height: 1.55;
          margin: 0;
        }

        .modal-guarantee-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #1E293B;
          margin-top: 8px;
        }

        .modal-quote-form-col {
          padding: 36px 32px;
        }

        .badge-micro {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: #B8332A;
          background: rgba(184, 51, 42, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .form-header h2 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .form-header p {
          font-size: 0.86rem;
          color: #64748B;
          margin: 0 0 20px 0;
          line-height: 1.45;
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

        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
        }

        .form-group input,
        .form-group textarea {
          padding: 10px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          font-size: 0.88rem;
          color: #0F172A;
          outline: none;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #B8332A;
          background: #FFFFFF;
        }

        .form-actions-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .submit-quote-btn {
          flex: 1.4;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          border-radius: 8px;
        }

        .whatsapp-quick-btn {
          flex: 1;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #25D366;
          color: #FFFFFF;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .whatsapp-quick-btn:hover {
          background: #1EBE5B;
        }

        /* Success View */
        .quote-success-view {
          padding: 60px 30px;
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
          background: rgba(184, 51, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quote-success-view h3 {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .quote-success-view p {
          font-size: 0.92rem;
          color: #475569;
          max-width: 500px;
          line-height: 1.6;
          margin: 0;
        }

        .success-actions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
