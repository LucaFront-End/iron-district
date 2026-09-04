import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Play, BookOpen, Sparkles, MessageSquare, 
  CheckCircle2, ArrowRight, Share2, ThumbsUp, Filter, 
  Video, Eye, Download, Send, Clock, User, X, ShieldCheck
} from 'lucide-react';
import stairsImg from '../assets/service_stairs.png';
import railingsImg from '../assets/service_railings.png';
import handrailsImg from '../assets/service_handrails.png';
import gatesImg from '../assets/service_gates.png';
import customImg from '../assets/service_custom.png';
import installImage from '../assets/railing_install.png';

export default function CommunityPage() {
  const { language } = useLanguage();

  // Review category filter
  const [reviewFilter, setReviewFilter] = useState('all');
  const [lookbookFilter, setLookbookFilter] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Reviews dataset
  const reviewsData = [
    {
      id: 1,
      name: 'Arthur Sterling, AIA',
      role: 'Principal Architect at Sterling & Co.',
      location: 'Los Angeles, CA',
      category: 'architect',
      rating: 5,
      project: 'Bel Air Hillside Floating Staircase',
      date: 'August 2026',
      verified: true,
      textEn: 'Station Metalworks is in a league of their own. We submitted complex Revit models for a 22-foot cantilevered staircase. They caught two engineering clash points before fabrication and delivered with zero field modifications required. Absolute perfection.',
      textEs: 'Station Metalworks está en un nivel superior. Enviamos modelos complejos de Revit para una escalera voladiza de 22 pies. Detectaron dos interferencias de cálculo antes de fabricar y la entregaron lista sin necesidad de ajustes en obra.',
      image: stairsImg
    },
    {
      id: 2,
      name: 'Marcus Vance',
      role: 'General Contractor • Luxury Estate Builder',
      location: 'Austin, TX',
      category: 'contractor',
      rating: 5,
      project: 'Lake Austin 180-ft Coastal Cable Railing',
      date: 'July 2026',
      verified: true,
      textEn: 'We order all our railing posts and ADA handrails from their online store and custom shop. The packaging in custom timber crates ensured not a single scratch on 180 feet of powder-coated steel. The crew installed in record time.',
      textEs: 'Pedimos todos los postes y pasamanos ADA en su tienda online y taller a medida. El empaque en cajas de madera reforzadas garantizó cero rayones en 180 pies de acero. El equipo instaló todo en tiempo récord.',
      image: railingsImg
    },
    {
      id: 3,
      name: 'Dr. Julian & Clara Hayes',
      role: 'Homeowners & Modern Architecture Enthusiasts',
      location: 'Beverly Hills, CA',
      category: 'homeowner',
      rating: 5,
      project: 'Custom Automated Cantilever Driveway Gate',
      date: 'June 2026',
      verified: true,
      textEn: 'The gate glides so silently our neighbors didn’t even realize it was moving. The horizontal aluminum slats provide 100% privacy while looking like a sculptural art piece from the street. Exceptional client service.',
      textEs: 'El portón se desliza tan silenciosamente que los vecinos ni notaron el movimiento. Las lamas de aluminio brindan total privacidad con una presencia escultórica impecable desde la calle.',
      image: gatesImg
    },
    {
      id: 4,
      name: 'Danielle Moreau, LEED AP',
      role: 'Interior Architecture Director',
      location: 'Miami, FL',
      category: 'architect',
      rating: 5,
      project: 'Biscayne Bay Penthouse Glass Balustrade',
      date: 'May 2026',
      verified: true,
      textEn: 'Marine-grade AISI 316 stainless steel was non-negotiable for this oceanfront project. Station Metalworks provided certified metallurgical heat logs and hurricane wind load PE calculations that sailed through city plan check.',
      textEs: 'El acero inoxidable AISI 316 grado marino era imprescindible frente al mar. Station Metalworks proporcionó ensayos de colada y memorias de cálculo de viento que pasaron la revisión municipal sin observaciones.',
      image: railingsImg
    }
  ];

  // Video reels dataset
  const videoReels = [
    {
      id: 'v1',
      titleEn: 'Forging a 24-Foot Monostringer: Load & Deflection Test',
      titleEs: 'Fabricación y Ensayo de Carga de Mono-Viga de 24 Pies',
      duration: '8:42',
      category: 'STAIRCASE ENGINEERING',
      views: '24.5K views',
      descEn: 'Step inside our fabrication bay as we weld a massive A36 carbon steel spine and subject it to a 1,200 lb simulated tip load test.',
      descEs: 'Acompaña a nuestros soldadores mientras fabricamos una viga central A36 y la sometemos a un ensayo de carga de 1,200 lbs.',
      thumbnail: stairsImg,
      chapters: ['0:00 Raw Plate Setup', '2:15 6kW Laser Slicing', '5:10 AWS TIG Root Passes', '7:30 Hydraulic Ram Test']
    },
    {
      id: 'v2',
      titleEn: 'Cable Railing Tensioning & Invisible Swage Fitting',
      titleEs: 'Tensado de Cables y Mecanizado de Terminales Ocultos',
      duration: '11:15',
      category: 'INSTALLATION MASTERCLASS',
      views: '38.2K views',
      descEn: 'Master the art of 316 stainless cable tensioning, post drilling alignment, and hidden internal tensioner adjustments.',
      descEs: 'Aprende las técnicas profesionales de tensado de cables 316, alineación de perforaciones y calibración de tensores internos.',
      thumbnail: railingsImg,
      chapters: ['0:00 Post Spacing Layout', '3:40 Core Drilling', '7:15 Swaging Terminals', '9:50 Torque Calibration']
    },
    {
      id: 'v3',
      titleEn: 'Automated Cantilever Gate: Motor Integration & Balance',
      titleEs: 'Portón Voladizo Motorizado: Contrapeso e Integración',
      duration: '14:20',
      category: 'STRUCTURAL ACCESS',
      views: '19.8K views',
      descEn: 'How we engineer a zero-ground-track cantilever gate to float 22 feet across uneven driveways with whisper-quiet rollers.',
      descEs: 'Cómo calculamos un portón voladizo de 22 pies sin riel en el piso con rodamientos sellados y alineación perfecta.',
      thumbnail: gatesImg,
      chapters: ['0:00 Concrete Counterweight', '4:10 Carriage Track', '8:30 Safety Loops', '12:00 Live Driveway Demo']
    },
    {
      id: 'v4',
      titleEn: 'Real Salt Fog Corrosion Test: 304 vs 316 Stainless Steel',
      titleEs: 'Ensayo Real de Niebla Salina: Acero 304 vs 316',
      duration: '6:50',
      category: 'METALLURGY LAB',
      views: '42.1K views',
      descEn: 'We put two polished handrail samples in an ASTM B117 salt spray chamber for 1,500 continuous hours. The results will surprise you.',
      descEs: 'Sometimos dos muestras de pasamanos en una cámara salina ASTM B117 durante 1,500 horas continuas. Comprueba los resultados.',
      thumbnail: handrailsImg,
      chapters: ['0:00 Chamber Calibration', '2:00 500-Hr Checkpoint', '4:15 1000-Hr Microscopic Scan', '6:00 Final Verdict']
    }
  ];

  // Inspiration Lookbook dataset
  const lookbookData = [
    {
      id: 'lb1',
      titleEn: 'Minimalist Monolithic Black',
      titleEs: 'Negro Monolítico Minimalista',
      category: 'minimalist',
      palette: ['#1A1A1D', '#333333', '#8D6E63'],
      materials: 'Matte Black Steel • Solid Walnut • Recessed Lighting',
      image: stairsImg
    },
    {
      id: 'lb2',
      titleEn: 'Marine Coastal High-Transparency',
      titleEs: 'Costero Marino Alta Transparencia',
      category: 'marine',
      palette: ['#B0BEC5', '#0284C7', '#ECEFF1'],
      materials: 'AISI 316 Brushed Stainless • 1/2" Tempered Glass',
      image: railingsImg
    },
    {
      id: 'lb3',
      titleEn: 'Industrial Warehouse Exposed Hardware',
      titleEs: 'Industrial Loft Herrajes Vistos',
      category: 'industrial',
      palette: ['#263238', '#455A64', '#D4AF37'],
      materials: 'Hot-Rolled Carbon Steel • Wire Cable • Brass Detailing',
      image: customImg
    },
    {
      id: 'lb4',
      titleEn: 'Luxury Estate Privacy Slat Architecture',
      titleEs: 'Lujo Residencial Lamas de Privacidad',
      category: 'luxury',
      palette: ['#1E293B', '#64748B', '#0F172A'],
      materials: 'Anodized 6061 Aluminum • Smart Locks • Integrated LED',
      image: gatesImg
    }
  ];

  // Blog posts dataset
  const blogPosts = [
    {
      id: 'bp1',
      titleEn: 'Understanding IBC 2024 Guardrail Codes: A Guide for Architects',
      titleEs: 'Códigos de Barandales IBC 2024: Guía Clave para Arquitectos',
      readTime: '8 min read',
      tag: 'CODE COMPLIANCE',
      author: 'Marco Vance, PE',
      date: 'Aug 24, 2026',
      excerptEn: 'From the 4-inch sphere rule to 50 lbs/ft uniform load criteria, we break down essential structural railings requirements to prevent red-tag delays during city inspections.',
      excerptEs: 'Desde la regla de la esfera de 4 pulgadas hasta los 50 lbs/pie de carga continua, desglosamos las exigencias de barandales para evitar retrasos en inspección municipal.'
    },
    {
      id: 'bp2',
      titleEn: 'Galvanic Corrosion: How to Fasten Stainless Steel to Carbon Steel Safely',
      titleEs: 'Corrosión Galvánica: Cómo Unir Inoxidable y Acero al Carbono Sin Riesgos',
      readTime: '6 min read',
      tag: 'METALLURGY',
      author: 'Elena Rostova',
      date: 'Aug 12, 2026',
      excerptEn: 'When dissimilar metals touch in exterior environments, electrolytic corrosion can destroy brackets within months. Learn how our nylon isolation bushings eliminate the reaction.',
      excerptEs: 'El contacto de metales distintos en exteriores puede degradar soportes en pocos meses. Conoce cómo nuestros separadores de aislamiento eliminan la reacción galvánica.'
    },
    {
      id: 'bp3',
      titleEn: 'The Physics of Cantilever Floating Stairs: Moment Loads & Wall Backing',
      titleEs: 'La Física de las Escaleras Voladizas: Momentos Flectores y Anclaje a Muro',
      readTime: '10 min read',
      tag: 'STRUCTURAL DRAFTING',
      author: 'David Chen',
      date: 'Jul 28, 2026',
      excerptEn: 'Why standard 2x6 wood framing is never enough for cantilevered treads. An engineering deep-dive into internal steel torque tubes and deflection equations.',
      excerptEs: 'Por qué una estructura de madera convencional nunca es suficiente para peldaños flotantes. Análisis técnico de cajas de torsión metálicas y curvas de deflexión.'
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="community-page-wrapper">
      <div className="blueprint-grid"></div>

      {/* 1. COMMUNITY HUB HERO */}
      <section className="community-hero-section">
        <div className="radial-accent-overlay"></div>
        <div className="container">
          <div className="community-hero-header">
            <span className="community-badge">
              <Sparkles size={13} className="text-accent" />
              <span>{language === 'en' ? 'STATION METALWORKS GUILD & COMMUNITY' : 'COMUNIDAD Y GREMIO STATION METALWORKS'}</span>
            </span>
            <h1 className="text-gradient">
              {language === 'en' ? 'Where Visionary Architects Meet Master Steel.' : 'Donde la Arquitectura de Vanguardia Encuentra el Acero.'}
            </h1>
            <p className="community-lead">
              {language === 'en'
                ? 'Connect with over 80,000 architects, general contractors, and design enthusiasts. Explore verified client reviews, shop floor video walkthroughs, material lookbooks, and structural whitepapers.'
                : 'Conecta con más de 80,000 arquitectos, contratistas y constructores. Descubre reseñas de clientes verificadas, videos de taller, moodboards de inspiración y guías técnicas de ingeniería.'}
            </p>

            {/* Quick jump navigation pills */}
            <div className="hero-jump-links">
              <a href="#reviews" className="jump-pill">
                <Star size={13} className="text-accent" />
                <span>{language === 'en' ? 'Client Reviews' : 'Reseñas'}</span>
              </a>
              <a href="#videos" className="jump-pill">
                <Video size={13} className="text-accent" />
                <span>{language === 'en' ? 'Video Reels' : 'Videos de Taller'}</span>
              </a>
              <a href="#lookbook" className="jump-pill">
                <Eye size={13} className="text-accent" />
                <span>{language === 'en' ? 'Inspiration Lookbook' : 'Inspiración'}</span>
              </a>
              <a href="#blog" className="jump-pill">
                <BookOpen size={13} className="text-accent" />
                <span>{language === 'en' ? 'Technical Blog' : 'Blog Técnico'}</span>
              </a>
            </div>
          </div>

          {/* Live Guild Stats Counter */}
          <div className="community-metrics-bar glass-panel">
            <div className="metric-item">
              <span className="metric-val text-accent">250+</span>
              <span className="metric-title">{language === 'en' ? '5-Star Verified Reviews' : 'Reseñas 5 Estrellas'}</span>
            </div>
            <div className="metric-item">
              <span className="metric-val text-accent">45+</span>
              <span className="metric-title">{language === 'en' ? 'Video Case Studies' : 'Videos de Obra y Taller'}</span>
            </div>
            <div className="metric-item">
              <span className="metric-val text-accent">80,000+</span>
              <span className="metric-title">{language === 'en' ? 'Architects in Network' : 'Arquitectos en la Red'}</span>
            </div>
            <div className="metric-item">
              <span className="metric-val text-accent">180+</span>
              <span className="metric-title">{language === 'en' ? 'CAD Specs Released' : 'Planos CAD Descargados'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED CLIENT REVIEWS & CASE STUDIES */}
      <section className="reviews-section container" id="reviews">
        <div className="section-header-split">
          <div>
            <span className="tag-label">
              <Star size={13} fill="#FF9F0A" stroke="none" />
              {language === 'en' ? 'VERIFIED EXPERIENCES' : 'EXPERIENCIAS VERIFICADAS'}
            </span>
            <h2 className="text-gradient">
              {language === 'en' ? 'What Architects & Builders Say' : 'Lo Que Dicen Arquitectos y Constructores'}
            </h2>
          </div>
          <button 
            onClick={() => setReviewModalOpen(true)}
            className="btn btn-primary submit-review-btn"
          >
            <MessageSquare size={15} />
            <span>{language === 'en' ? 'Submit Project Review' : 'Enviar Reseña de Obra'}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="review-filters-bar">
          {[
            { id: 'all', labelEn: 'All Reviews', labelEs: 'Todas las Reseñas' },
            { id: 'architect', labelEn: 'Architects & Designers', labelEs: 'Arquitectos y Diseñadores' },
            { id: 'contractor', labelEn: 'General Contractors', labelEs: 'Contratistas Generales' },
            { id: 'homeowner', labelEn: 'Luxury Homeowners', labelEs: 'Propietarios Residenciales' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill ${reviewFilter === cat.id ? 'active' : ''}`}
              onClick={() => setReviewFilter(cat.id)}
            >
              <span>{language === 'en' ? cat.labelEn : cat.labelEs}</span>
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="reviews-grid">
          {reviewsData
            .filter((r) => reviewFilter === 'all' || r.category === reviewFilter)
            .map((review) => (
              <div key={review.id} className="review-card glass-panel">
                <div className="review-card-top">
                  <div className="stars-row">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#FF9F0A" stroke="none" />
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>

                <p className="review-text">
                  "{language === 'en' ? review.textEn : review.textEs}"
                </p>

                <div className="review-project-badge">
                  <strong>{language === 'en' ? 'Project:' : 'Proyecto:'}</strong> {review.project}
                </div>

                <div className="review-author-row">
                  <div className="author-info">
                    <h4 className="author-name">{review.name}</h4>
                    <span className="author-role">{review.role}</span>
                    <span className="author-loc">{review.location}</span>
                  </div>
                  {review.verified && (
                    <span className="verified-badge" title="Verified Project Client">
                      <CheckCircle2 size={13} className="text-green" />
                      <span>{language === 'en' ? 'Verified' : 'Verificado'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 3. WORKSHOP VIDEO REEL & INSTALLATION MASTERCLASSES */}
      <section className="video-reel-section container" id="videos">
        <div className="section-header">
          <span className="tag-label">
            <Video size={14} className="pulse-glow" />
            {language === 'en' ? 'LIVE FABRICATION REEL' : 'VIDEOS REALES DE TALLER'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Workshop Walkthroughs & Engineering Masterclasses' : 'Paso a Paso en Taller y Masterclasses de Montaje'}
          </h2>
          <p>
            {language === 'en'
              ? 'Watch our master fabricators in action: from CNC laser cutting to hydraulic load deflection tests and job-site installations.'
              : 'Mira a nuestros maestros artesanos en acción: desde el corte láser hasta pruebas hidráulicas de carga e instalación en obra.'}
          </p>
        </div>

        <div className="video-grid">
          {videoReels.map((vid) => (
            <div 
              key={vid.id} 
              className="video-card glass-panel"
              onClick={() => setActiveVideo(vid)}
            >
              <div className="video-thumbnail-box">
                <img src={vid.thumbnail} alt={vid.titleEn} className="video-thumb-img" />
                <div className="video-play-btn-circle">
                  <Play size={20} fill="#FFF" color="#FFF" style={{ marginLeft: '3px' }} />
                </div>
                <span className="video-duration-badge">{vid.duration}</span>
                <span className="video-cat-badge">{vid.category}</span>
              </div>

              <div className="video-card-body">
                <div className="video-views-row">
                  <span className="video-views">{vid.views}</span>
                  <span className="video-badge-live">HD 4K</span>
                </div>
                <h3 className="video-title">{language === 'en' ? vid.titleEn : vid.titleEs}</h3>
                <p className="video-desc">{language === 'en' ? vid.descEn : vid.descEs}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal Simulation */}
        <AnimatePresence>
          {activeVideo && (
            <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
              <motion.div 
                className="video-modal-card glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="video-close-btn" onClick={() => setActiveVideo(null)}>
                  <X size={20} />
                </button>

                <div className="video-player-viewport">
                  <img src={activeVideo.thumbnail} alt={activeVideo.titleEn} className="video-player-bg" />
                  <div className="video-playback-controls">
                    <div className="playback-pulse-ring">
                      <Play size={30} fill="#FFF" color="#FFF" style={{ marginLeft: '4px' }} />
                    </div>
                    <span className="playing-label">{language === 'en' ? 'Click to Stream Video Masterclass' : 'Reproducir Masterclass de Taller'}</span>
                  </div>
                </div>

                <div className="video-modal-info">
                  <span className="video-modal-tag">{activeVideo.category} • {activeVideo.duration}</span>
                  <h2>{language === 'en' ? activeVideo.titleEn : activeVideo.titleEs}</h2>
                  <p>{language === 'en' ? activeVideo.descEn : activeVideo.descEs}</p>

                  <div className="video-chapters-box">
                    <h4>{language === 'en' ? 'Video Chapters & Highlights:' : 'Capítulos y Momentos Clave:'}</h4>
                    <div className="chapters-list">
                      {activeVideo.chapters.map((ch, idx) => (
                        <span key={idx} className="chapter-pill">{ch}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. ARCHITECTURAL INSPIRATION LOOKBOOK */}
      <section className="lookbook-section container" id="lookbook">
        <div className="section-header">
          <span className="tag-label">
            <Sparkles size={14} />
            {language === 'en' ? 'STYLE MOODBOARD' : 'MOODBOARD DE ESTILO'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Architectural Inspiration Lookbook' : 'Lookbook de Inspiración Arquitectónica'}
          </h2>
          <p>
            {language === 'en'
              ? 'Explore curated design styles, finish palettes, and material compositions to inspire your next staircase, railing, or gate project.'
              : 'Explora estilos arquitectónicos curados, paletas de acabado y composiciones metálicas para inspirar tu próximo proyecto.'}
          </p>
        </div>

        {/* Lookbook Filters */}
        <div className="lookbook-filter-bar">
          {[
            { id: 'all', labelEn: 'All Aesthetic Profiles', labelEs: 'Todos los Perfiles' },
            { id: 'minimalist', labelEn: 'Minimalist Monolithic', labelEs: 'Minimalista Monolítico' },
            { id: 'marine', labelEn: 'Marine Coastal Transparent', labelEs: 'Costero Transparente' },
            { id: 'industrial', labelEn: 'Industrial Raw & Blackened', labelEs: 'Industrial y Acero Negro' },
            { id: 'luxury', labelEn: 'Luxury Estate Privacy', labelEs: 'Privacidad Lujo Residencial' },
          ].map((f) => (
            <button
              key={f.id}
              className={`lookbook-pill ${lookbookFilter === f.id ? 'active' : ''}`}
              onClick={() => setLookbookFilter(f.id)}
            >
              <span>{language === 'en' ? f.labelEn : f.labelEs}</span>
            </button>
          ))}
        </div>

        <div className="lookbook-grid">
          {lookbookData
            .filter((lb) => lookbookFilter === 'all' || lb.category === lookbookFilter)
            .map((lb) => (
              <div key={lb.id} className="lookbook-card glass-panel">
                <div className="lookbook-img-box">
                  <img src={lb.image} alt={lb.titleEn} className="lookbook-img" />
                  <div className="palette-swatches-overlay">
                    {lb.palette.map((color, i) => (
                      <span key={i} className="swatch-dot" style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>

                <div className="lookbook-body">
                  <h3 className="lookbook-title">{language === 'en' ? lb.titleEn : lb.titleEs}</h3>
                  <div className="lookbook-materials">
                    <strong>{language === 'en' ? 'Spec Materials:' : 'Materiales:'}</strong> {lb.materials}
                  </div>
                  <a href="#quote" className="lookbook-cta-link">
                    <span>{language === 'en' ? 'Configure in this Style' : 'Configurar en este Estilo'}</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 5. METALWORKING BLOG & TECHNICAL WHITEPAPERS */}
      <section className="blog-section container" id="blog">
        <div className="section-header">
          <span className="tag-label">
            <BookOpen size={14} />
            {language === 'en' ? 'METALLURGY & DRAFTING BLOG' : 'BLOG TÉCNICO Y GUÍAS DE METAL'}
          </span>
          <h2 className="text-gradient">
            {language === 'en' ? 'Engineering Insights for Architects' : 'Artículos de Ingeniería para Arquitectos'}
          </h2>
          <p>
            {language === 'en'
              ? 'In-depth metallurgical guides, building code compliance breakdowns, and design-to-fabrication blueprints.'
              : 'Guías metalúrgicas a fondo, análisis de códigos de construcción y planos de diseño para fabricación.'}
          </p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card glass-panel">
              <div className="blog-meta-top">
                <span className="blog-tag">{post.tag}</span>
                <span className="blog-readtime">
                  <Clock size={12} />
                  <span>{post.readTime}</span>
                </span>
              </div>

              <h3 className="blog-title">{language === 'en' ? post.titleEn : post.titleEs}</h3>
              <p className="blog-excerpt">{language === 'en' ? post.excerptEn : post.excerptEs}</p>

              <div className="blog-card-footer">
                <div className="author-box">
                  <User size={14} className="text-accent" />
                  <span>{post.author}</span>
                  <span className="date">• {post.date}</span>
                </div>
                <a href="#quote" className="read-more-link">
                  <span>{language === 'en' ? 'Read Guide' : 'Leer Guía'}</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Community Newsletter Subscription Box */}
        <div className="newsletter-cta-box glass-panel">
          <div className="newsletter-text">
            <span className="newsletter-badge">VIP ARCHITECTURAL BULLETIN</span>
            <h3>{language === 'en' ? 'Get Stamped CAD Templates & Fabrication Updates' : 'Recibe Plantillas CAD Certificadas y Novedades de Taller'}</h3>
            <p>
              {language === 'en'
                ? 'Join 80,000+ architects and structural engineers. Receive monthly IBC code cheat sheets and new Wix Stores product drops.'
                : 'Únete a más de 80,000 arquitectos e ingenieros. Recibe guías de códigos IBC mensuales y lanzamientos exclusivos de productos.'}
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input 
              type="email" 
              placeholder={language === 'en' ? 'Enter your engineering email...' : 'Ingresa tu correo profesional...'}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="btn btn-primary newsletter-btn">
              <Send size={15} />
              <span>{language === 'en' ? 'Subscribe' : 'Suscribirme'}</span>
            </button>
          </form>
          {subscribed && (
            <div className="subscribed-success">
              <CheckCircle2 size={16} className="text-green" />
              <span>{language === 'en' ? 'Welcome to the Guild! Look for our CAD library link in your inbox.' : '¡Bienvenido al gremio! Revisa tu bandeja de entrada.'}</span>
            </div>
          )}
        </div>
      </section>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="review-modal-overlay" onClick={() => setReviewModalOpen(false)}>
            <motion.div 
              className="review-submit-modal glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setReviewModalOpen(false)}>
                <X size={20} />
              </button>

              <div className="modal-header">
                <Star size={22} fill="#FF9F0A" stroke="none" />
                <h3>{language === 'en' ? 'Submit Your Project Review' : 'Enviar Reseña de tu Proyecto'}</h3>
                <p>
                  {language === 'en'
                    ? 'Share your finished installation photos and feedback with our architectural community.'
                    : 'Comparte las fotos de tu obra terminada y tu experiencia con nuestra comunidad.'}
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your project review has been submitted for verification.'); setReviewModalOpen(false); }} className="review-form">
                <div className="form-field">
                  <label>Full Name / Company Name</label>
                  <input type="text" required placeholder="e.g. John Doe, Studio Arc" />
                </div>
                <div className="form-field">
                  <label>Project Type & Location</label>
                  <input type="text" required placeholder="e.g. Cable Railing Deck, Malibu CA" />
                </div>
                <div className="form-field">
                  <label>Rating (1-5 Stars)</label>
                  <select defaultValue="5">
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Flawless Execution)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars - Great)</option>
                    <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Your Review & Experience</label>
                  <textarea rows="4" required placeholder="Tell us about the tolerances, delivery, and installation quality..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  {language === 'en' ? 'Post Verified Review' : 'Publicar Reseña Verificada'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .community-page-wrapper {
          padding-top: 100px;
          padding-bottom: 90px;
          position: relative;
        }

        /* 1. Hero */
        .community-hero-section {
          position: relative;
          padding: 40px 0 60px 0;
          overflow: hidden;
        }

        .community-hero-header {
          max-width: 840px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .community-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 12px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .community-hero-header h1 {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.15;
          color: var(--color-text-primary);
        }

        .community-lead {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .hero-jump-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .jump-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 30px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-primary);
          text-decoration: none;
          transition: all 0.2s;
        }

        .jump-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-2px);
        }

        .community-metrics-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 24px 32px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.04);
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-right: 1px solid var(--color-border);
          padding-right: 20px;
        }

        .metric-item:last-child {
          border-right: none;
          padding-right: 0;
        }

        .metric-item .metric-val {
          font-family: monospace;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .metric-title {
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        /* 2. Reviews Section */
        .reviews-section {
          padding: 60px 0;
        }

        .section-header-split {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
        }

        .submit-review-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 0.82rem;
        }

        .review-filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }

        .filter-pill {
          padding: 8px 16px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .filter-pill.active {
          background: var(--color-text-primary);
          color: #FFF;
          border-color: var(--color-text-primary);
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .review-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .review-card:hover {
          border-color: var(--color-accent);
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.05);
        }

        .review-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stars-row {
          display: flex;
          gap: 2px;
        }

        .review-date {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }

        .review-text {
          font-size: 0.88rem;
          color: var(--color-text-primary);
          line-height: 1.6;
          font-style: italic;
          margin: 0;
          flex: 1;
        }

        .review-project-badge {
          font-family: monospace;
          font-size: 0.72rem;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          padding: 6px 12px;
          border-radius: 6px;
          color: var(--color-text-secondary);
        }

        .review-author-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px dashed var(--color-border);
          padding-top: 14px;
        }

        .author-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .author-role {
          font-size: 0.75rem;
          color: var(--color-accent);
          display: block;
        }

        .author-loc {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          display: block;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.68rem;
          color: #10B981;
          font-weight: 700;
        }

        /* 3. Video Reel */
        .video-reel-section {
          padding: 60px 0;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 26px;
          margin-top: 30px;
        }

        .video-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }

        .video-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
          box-shadow: 0 12px 36px rgba(2, 0, 50, 0.08);
        }

        .video-thumbnail-box {
          position: relative;
          height: 220px;
          background: #020032;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          transition: transform 0.3s;
        }

        .video-card:hover .video-thumb-img {
          transform: scale(1.05);
        }

        .video-play-btn-circle {
          position: absolute;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(224, 0, 39, 0.6);
          transition: transform 0.2s;
        }

        .video-card:hover .video-play-btn-circle {
          transform: scale(1.15);
        }

        .video-duration-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.85);
          color: #FFF;
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .video-cat-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(2, 0, 50, 0.85);
          color: #FFF;
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .video-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .video-views-row {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
        }

        .video-badge-live {
          color: var(--color-accent);
          font-weight: 800;
        }

        .video-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
        }

        .video-desc {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        /* Video Modal */
        .video-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.8);
          backdrop-filter: blur(8px);
          z-index: 3500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .video-modal-card {
          width: 100%;
          max-width: 800px;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .video-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: #FFF;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }

        .video-player-viewport {
          position: relative;
          height: 380px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-player-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.65;
        }

        .video-playback-controls {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .playback-pulse-ring {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(224, 0, 39, 0.8);
        }

        .playing-label {
          color: #FFF;
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .video-modal-info {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .video-modal-tag {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
        }

        .video-modal-info h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0;
        }

        .video-modal-info p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .video-chapters-box h4 {
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .chapters-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chapter-pill {
          font-family: monospace;
          font-size: 0.68rem;
          background: #F1F5F9;
          padding: 4px 10px;
          border-radius: 4px;
          color: var(--color-text-primary);
        }

        /* 4. Lookbook */
        .lookbook-section {
          padding: 60px 0;
        }

        .lookbook-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
          margin-bottom: 30px;
        }

        .lookbook-pill {
          padding: 8px 16px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .lookbook-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .lookbook-pill.active {
          background: var(--color-text-primary);
          color: #FFF;
          border-color: var(--color-text-primary);
        }

        .lookbook-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 26px;
        }

        .lookbook-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s, border-color 0.25s;
        }

        .lookbook-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
          box-shadow: 0 10px 30px rgba(2, 0, 50, 0.06);
        }

        .lookbook-img-box {
          position: relative;
          height: 220px;
          background: #020032;
          overflow: hidden;
        }

        .lookbook-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .palette-swatches-overlay {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.9);
          padding: 4px 8px;
          border-radius: 20px;
        }

        .swatch-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .lookbook-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lookbook-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .lookbook-materials {
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
        }

        .lookbook-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-accent);
          text-decoration: none;
          margin-top: 6px;
        }

        .lookbook-cta-link:hover {
          text-decoration: underline;
        }

        /* 5. Blog & Newsletter */
        .blog-section {
          padding: 60px 0;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 30px;
        }

        .blog-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.25s, border-color 0.25s;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
          box-shadow: 0 10px 25px rgba(2, 0, 50, 0.05);
        }

        .blog-meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .blog-tag {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .blog-readtime {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
        }

        .blog-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
        }

        .blog-excerpt {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin: 0;
          flex: 1;
        }

        .blog-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px dashed var(--color-border);
          padding-top: 12px;
        }

        .author-box {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
          font-weight: 600;
        }

        .author-box .date {
          color: var(--color-text-muted);
          font-size: 0.68rem;
        }

        .read-more-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-accent);
          text-decoration: none;
        }

        /* Newsletter CTA */
        .newsletter-cta-box {
          margin-top: 50px;
          background: linear-gradient(135deg, #020032 0%, #080452 100%);
          color: #FFF;
          padding: 44px;
          border-radius: 14px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 30px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .newsletter-badge {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.2);
          padding: 4px 10px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .newsletter-text h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #FFF;
          margin: 0 0 8px 0;
          line-height: 1.25;
        }

        .newsletter-text p {
          font-size: 0.85rem;
          color: #CBD5E1;
          margin: 0;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          gap: 10px;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #FFF;
          font-size: 0.85rem;
          outline: none;
        }

        .newsletter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          font-size: 0.85rem;
        }

        .subscribed-success {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.8rem;
          color: #10B981;
          margin-top: -10px;
        }

        /* Review Modal */
        .review-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 0, 50, 0.7);
          backdrop-filter: blur(8px);
          z-index: 3500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .review-submit-modal {
          width: 100%;
          max-width: 500px;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 30px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .modal-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0;
        }

        .modal-header p {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .review-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-field label {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .form-field input, .form-field select, .form-field textarea {
          padding: 10px 12px;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 0.82rem;
          outline: none;
        }

        @media (max-width: 992px) {
          .community-metrics-bar, .reviews-grid, .video-grid, .lookbook-grid, .blog-grid, .newsletter-cta-box {
            grid-template-columns: 1fr;
          }
          .metric-item {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 12px;
          }
          .section-header-split {
            flex-direction: column;
            align-items: flex-start;
          }
          .newsletter-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
