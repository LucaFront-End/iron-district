import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ArrowRight, Filter, RotateCcw } from 'lucide-react';

export default function ShopPage() {
  const { t, language } = useLanguage();

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState('featured');

  // Hardcoded product database for the catalog
  const products = useMemo(() => [
    {
      id: 'horizon',
      nameEn: 'The Horizon Floating Staircase',
      nameEs: 'Escalera Flotante Horizon',
      descEn: 'Walnut treads with structural steel backing and heavy duty cable guardrails.',
      descEs: 'Peldaños de nogal con soporte estructural de acero y barandal de cable de alta resistencia.',
      category: 'stairs',
      material: 'timber',
      price: 5800,
      unit: 'unit',
      rating: 5.0,
      reviews: 18,
      badgeEn: 'Flagship Design',
      badgeEs: 'Diseño Insignia',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          <polygon points="40,90 55,90 125,35 110,35" fill={color} stroke="#111" strokeWidth="0.5" />
          <line x1="15" y1="40" x2="135" y2="40" stroke="#e00027" strokeWidth="3.5" strokeLinecap="round" />
          <g fill="#A1887F" stroke="#5D4037" strokeWidth="0.5">
            <polygon points="40,85 65,85 70,80 45,80" />
            <polygon points="70,65 95,65 100,60 75,60" />
            <polygon points="100,45 125,45 130,40 105,40" />
          </g>
        </svg>
      )
    },
    {
      id: 'brooklyn',
      nameEn: 'The Brooklyn Cable Railing Kit',
      nameEs: 'Sistema de Barandal de Cable Brooklyn',
      descEn: 'Pre-drilled carbon steel posts with industrial marine-grade AISI 316 cable runs.',
      descEs: 'Postes de acero pre-perforados con líneas de cable de acero grado marino AISI 316.',
      category: 'railings',
      material: 'steel',
      price: 895,
      unit: 'ft',
      rating: 4.9,
      reviews: 84,
      badgeEn: 'Best Seller',
      badgeEs: 'Más Vendido',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          <rect x="35" y="30" width="4" height="70" fill={color} stroke="#111" strokeWidth="0.5" />
          <rect x="115" y="30" width="4" height="70" fill={color} stroke="#111" strokeWidth="0.5" />
          <line x1="15" y1="30" x2="140" y2="30" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <g stroke="#90A4AE" strokeWidth="0.6" opacity="0.8">
            <line x1="37" y1="42" x2="115" y2="42" />
            <line x1="37" y1="54" x2="115" y2="54" />
            <line x1="37" y1="66" x2="115" y2="66" />
            <line x1="37" y1="78" x2="115" y2="78" />
            <line x1="37" y1="90" x2="115" y2="90" />
          </g>
        </svg>
      )
    },
    {
      id: 'manhattan',
      nameEn: 'The Manhattan Tempered Glass System',
      nameEs: 'Barandal de Vidrio Manhattan',
      descEn: 'Satin brushed stainless steel posts clamping thick 1/2" tempered safety glass.',
      descEs: 'Postes de acero inoxidable cepillado con abrazaderas para cristal templado de 12mm.',
      category: 'railings',
      material: 'stainless',
      price: 1295,
      unit: 'ft',
      rating: 4.8,
      reviews: 42,
      badgeEn: 'Architect Favorite',
      badgeEs: 'Favorito Arquitectos',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          <polygon points="45,35 105,35 105,95 45,95" fill="rgba(174, 219, 240, 0.25)" stroke="#0284C7" strokeWidth="0.5" />
          <rect x="40" y="30" width="4" height="70" fill="#B0BEC5" stroke="#37474F" strokeWidth="0.5" />
          <rect x="110" y="30" width="4" height="70" fill="#B0BEC5" stroke="#37474F" strokeWidth="0.5" />
          <line x1="20" y1="30" x2="135" y2="30" stroke="#B0BEC5" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'patriot',
      nameEn: 'The ADA Patriot Wall Handrail',
      nameEs: 'Pasamanos de Muro ADA Patriot',
      descEn: 'Heavy duty modular wall-mount handrail compliant with ADA accessibility guidelines.',
      descEs: 'Pasamanos modular de montaje a muro conforme a directivas de accesibilidad ADA.',
      category: 'handrails',
      material: 'steel',
      price: 450,
      unit: 'unit',
      rating: 4.9,
      reviews: 53,
      badgeEn: 'ADA Compliant',
      badgeEs: 'Normativa ADA',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <circle cx="50" cy="70" r="4" fill={color} stroke="#333" strokeWidth="0.5" />
          <path d="M 50,70 L 50,55 C 50,55 53,50 56,42" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="110" cy="70" r="4" fill={color} stroke="#333" strokeWidth="0.5" />
          <path d="M 110,70 L 110,55 C 110,55 113,50 116,42" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="40" x2="140" y2="40" stroke="url(#wood-accent)" strokeWidth="6" strokeLinecap="round" />
          <defs>
            <linearGradient id="wood-accent" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#A1887F" />
              <stop offset="100%" stopColor="#5D4037" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'citadel',
      nameEn: 'The Citadel Perimeter Fence',
      nameEs: 'Cerca Perimetral Citadel',
      descEn: 'Modern architectural privacy fence slats built with heavy-duty structural aluminum.',
      descEs: 'Cerca de privacidad arquitectónica moderna construida con aluminio estructural pesado.',
      category: 'fences',
      material: 'aluminum',
      price: 1850,
      unit: 'unit',
      rating: 4.7,
      reviews: 29,
      badgeEn: 'Rust Proof',
      badgeEs: 'Antioxidante',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          <rect x="25" y="20" width="6" height="80" fill={color} stroke="#333" strokeWidth="0.5" />
          <rect x="125" y="20" width="6" height="80" fill={color} stroke="#333" strokeWidth="0.5" />
          <g fill="#455A64" stroke="#263238" strokeWidth="0.5" opacity="0.9">
            <rect x="34" y="25" width="88" height="8" />
            <rect x="34" y="38" width="88" height="8" />
            <rect x="34" y="51" width="88" height="8" />
            <rect x="34" y="64" width="88" height="8" />
            <rect x="34" y="77" width="88" height="8" />
          </g>
        </svg>
      )
    },
    {
      id: 'sentinel',
      nameEn: 'The Sentinel Slide Gate',
      nameEs: 'Portón Deslizante Sentinel',
      descEn: 'Automatic structural sliding gate configured for maximum perimeter protection.',
      descEs: 'Portón deslizante estructural automático configurado para máxima protección.',
      category: 'gates',
      material: 'steel',
      price: 2400,
      unit: 'unit',
      rating: 4.9,
      reviews: 31,
      badgeEn: 'Heavy Structural',
      badgeEs: 'Estructural Pesado',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <polygon points="10,100 150,100 135,115 5,115" fill="rgba(0,0,0,0.015)" stroke="var(--color-border)" strokeWidth="0.5" />
          <rect x="30" y="25" width="100" height="70" fill="none" stroke={color} strokeWidth="3" />
          <line x1="30" y1="25" x2="130" y2="95" stroke={color} strokeWidth="1.5" />
          <line x1="130" y1="25" x2="30" y2="95" stroke={color} strokeWidth="1.5" />
          <g stroke={color} strokeWidth="0.75" opacity="0.6">
            <line x1="45" y1="25" x2="45" y2="95" />
            <line x1="65" y1="25" x2="65" y2="95" />
            <line x1="85" y1="25" x2="85" y2="95" />
            <line x1="105" y1="25" x2="105" y2="95" />
          </g>
        </svg>
      )
    },
    {
      id: 'flange',
      nameEn: 'Heavy Duty Post Mounting Flange',
      nameEs: 'Brida de Montaje Postes Reforzada',
      descEn: 'Heavy-gauge steel floor anchoring plate cover for 2"x2" structural posts.',
      descEs: 'Placa de anclaje a piso de acero reforzado para postes estructurales de 2"x2".',
      category: 'accessories',
      material: 'steel',
      price: 45,
      unit: 'unit',
      rating: 4.8,
      reviews: 112,
      badgeEn: 'In Stock',
      badgeEs: 'En Stock',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <polygon points="35,80 125,80 105,100 15,100" fill="url(#metal-flange)" stroke="#263238" strokeWidth="0.75" />
          <polygon points="35,80 125,80 125,83 35,83" fill="#212121" stroke="#263238" strokeWidth="0.5" />
          <rect x="67" y="45" width="26" height="35" fill="url(#metal-flange)" stroke="#37474F" strokeWidth="0.5" />
          <defs>
            <linearGradient id="metal-flange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78909C" />
              <stop offset="100%" stopColor="#37474F" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'tensioner',
      nameEn: 'Marine-Grade Cable Swage Tensioner',
      nameEs: 'Tensor de Cable Grado Marino',
      descEn: 'Type 316 stainless steel cable receiver body for tensioning wire ropes.',
      descEs: 'Receptor de cable de acero inoxidable Tipo 316 para tensado de líneas de cable.',
      category: 'accessories',
      material: 'stainless',
      price: 12,
      unit: 'unit',
      rating: 4.9,
      reviews: 245,
      badgeEn: 'Pack of 10 Available',
      badgeEs: 'Paquete de 10 Disponible',
      imageSvg: (color) => (
        <svg viewBox="0 0 160 120" className="shop-product-svg">
          <rect x="25" y="55" width="80" height="10" fill="url(#steel-tension)" stroke="#455A64" strokeWidth="0.5" rx="1.5" />
          <rect x="105" y="52" width="30" height="16" fill="url(#steel-tension)" stroke="#263238" strokeWidth="0.5" rx="1" />
          <circle cx="120" cy="60" r="3" fill="#1C2123" />
          <defs>
            <linearGradient id="steel-tension" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#ECEFF1" />
              <stop offset="100%" stopColor="#90A4AE" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ], []);

  // Filter categories list
  const categoriesList = [
    { id: 'all', label: t('shop.all') },
    { id: 'stairs', label: t('shop.stairs') },
    { id: 'railings', label: t('shop.railings') },
    { id: 'handrails', label: t('shop.handrails') },
    { id: 'gates', label: t('shop.gates') },
    { id: 'fences', label: t('shop.fences') },
    { id: 'accessories', label: t('shop.accessories') },
  ];

  // Materials list
  const materialsList = [
    { id: 'all', label: language === 'en' ? 'All Materials' : 'Todos los Materiales' },
    { id: 'steel', label: t('shop.steel') },
    { id: 'stainless', label: t('shop.stainless') },
    { id: 'aluminum', label: t('shop.aluminum') },
    { id: 'timber', label: t('shop.timber') },
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query filter
        const name = language === 'en' ? product.nameEn : product.nameEs;
        const desc = language === 'en' ? product.descEn : product.descEs;
        const query = searchQuery.toLowerCase();
        const matchesSearch = name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);

        // Category filter
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

        // Material filter
        const matchesMaterial = selectedMaterial === 'all' || product.material === selectedMaterial;

        // Price filter
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesMaterial && matchesPrice;
      })
      .sort((a, b) => {
        // Sort logic
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured/default
      });
  }, [products, searchQuery, selectedCategory, selectedMaterial, maxPrice, sortBy, language]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setMaxPrice(6000);
    setSortBy('featured');
  };

  return (
    <div className="shop-page-wrapper">
      <div className="blueprint-grid"></div>

      <header className="shop-header container">
        <div className="header-content">
          <span className="shop-badge">
            <Filter size={12} className="pulse-glow" style={{ marginRight: '6px' }} />
            {language === 'en' ? 'E-COMMERCE CATALOG' : 'CATÁLOGO E-COMMERCE'}
          </span>
          <h1 className="text-gradient">{t('shop.title')}</h1>
          <p>{t('shop.desc')}</p>
        </div>

        {/* Global Catalog Metrics */}
        <div className="shop-metrics-row glass-panel">
          <div className="metric-box">
            <span className="metric-lbl">{language === 'en' ? 'TOTAL SYSTEMS' : 'SISTEMAS TOTALES'}</span>
            <span className="metric-val">8 MODELS</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">{language === 'en' ? 'MADE IN USA' : 'HECHO EN EE.UU.'}</span>
            <span className="metric-val">100% IN-HOUSE</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">{language === 'en' ? 'SHIPPING NATIONWIDE' : 'ENVÍO NACIONAL'}</span>
            <span className="metric-val">3-5 DAYS TRANSIT</span>
          </div>
        </div>
      </header>

      <section className="shop-main-layout container">
        <div className="shop-layout-grid">
          
          {/* LEFT SIDE: Sidebar Filters */}
          <aside className="shop-sidebar-filters glass-panel">
            <div className="sidebar-header">
              <SlidersHorizontal size={14} className="text-accent" />
              <h3>{t('shop.filters')}</h3>
              {(searchQuery || selectedCategory !== 'all' || selectedMaterial !== 'all' || maxPrice !== 6000) && (
                <button onClick={handleResetFilters} className="reset-filters-btn" title="Reset Filters">
                  <RotateCcw size={12} />
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <label className="filter-title">{t('shop.priceRange')}</label>
              <div className="price-slider-wrapper">
                <div className="price-labels">
                  <span>$0</span>
                  <span>${maxPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="6000" 
                  step="10"
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="custom-range-slider"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-title">{t('shop.category')}</label>
              <div className="category-filters-pills">
                {categoriesList.map((cat) => (
                  <button 
                    key={cat.id}
                    className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div className="filter-group">
              <label className="filter-title">{t('shop.material')}</label>
              <div className="material-checkbox-list">
                {materialsList.map((mat) => (
                  <label key={mat.id} className="mat-checkbox-label">
                    <input 
                      type="radio" 
                      name="material-filter" 
                      checked={selectedMaterial === mat.id} 
                      onChange={() => setSelectedMaterial(mat.id)}
                      className="custom-radio-input"
                    />
                    <span>{mat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE: Products Grid and Search bar */}
          <div className="shop-catalog-area">
            
            {/* Search and Sort controls */}
            <div className="catalog-controls-row glass-panel">
              <div className="search-bar-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder={t('shop.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="sort-dropdown-wrapper">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">{language === 'en' ? 'Featured' : 'Destacados'}</option>
                  <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'Precio: Menor a Mayor'}</option>
                  <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'Precio: Mayor a Menor'}</option>
                  <option value="rating">{language === 'en' ? 'Customer Rating' : 'Calificación'}</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            <div className="catalog-products-wrapper">
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  <div className="products-grid">
                    {filteredProducts.map((product) => {
                      const name = language === 'en' ? product.nameEn : product.nameEs;
                      const desc = language === 'en' ? product.descEn : product.descEs;
                      const badge = language === 'en' ? product.badgeEn : product.badgeEs;
                      
                      return (
                        <motion.div 
                          layout
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="catalog-product-card glass-panel"
                        >
                          <div className="catalog-card-header">
                            <span className="category-label-tag">{product.category.toUpperCase()}</span>
                            {badge && (
                              <span className="live-status-dot">
                                <span className="ping-dot" style={{ backgroundColor: 'var(--color-accent)' }}></span>
                                <span className="status-text">{badge}</span>
                              </span>
                            )}
                          </div>

                          <div className="catalog-card-graphics">
                            {product.imageSvg('#1A1A1D')}
                          </div>

                          <div className="catalog-card-body">
                            <div className="title-price-row">
                              <h3>{name}</h3>
                              <div className="price-tag-badge">
                                <span className="price-val">${product.price.toLocaleString()}</span>
                                <span className="price-unit">{product.unit === 'ft' ? t('shop.perFt') : t('shop.unit')}</span>
                              </div>
                            </div>

                            <p className="product-card-desc">{desc}</p>

                            <div className="product-rating-row">
                              <Star size={11} fill="#FF9F0A" stroke="none" />
                              <span className="rating-val">{product.rating.toFixed(1)}</span>
                              <span className="rating-divider">•</span>
                              <span className="reviews-count">{product.reviews} {language === 'en' ? 'reviews' : 'opiniones'}</span>
                            </div>

                            <a 
                              href={`#/product/${product.id}`}
                              className="btn btn-primary catalog-btn w-full"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <span>{t('shop.viewProduct')}</span>
                              <ArrowRight size={12} />
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="no-products-found glass-panel"
                  >
                    <SlidersHorizontal size={36} className="text-steel" style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p>{t('shop.noProducts')}</p>
                    <button onClick={handleResetFilters} className="btn btn-secondary" style={{ marginTop: '14px', fontSize: '0.8rem', padding: '10px 18px' }}>
                      {language === 'en' ? 'Clear All Filters' : 'Limpiar Todos los Filtros'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        .shop-page-wrapper {
          padding-top: 110px;
          padding-bottom: 80px;
          position: relative;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 30px;
        }

        .header-content {
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shop-badge {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-accent);
          background: rgba(255, 90, 9, 0.08);
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: bold;
          align-self: flex-start;
          display: flex;
          align-items: center;
        }

        .shop-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .shop-header p {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .shop-metrics-row {
          display: flex;
          gap: 20px;
          padding: 16px 24px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 8px;
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-right: 20px;
          border-right: 1px solid var(--color-border);
        }

        .metric-box:last-child {
          padding-right: 0;
          border-right: none;
        }

        .metric-lbl {
          font-family: monospace;
          font-size: 0.58rem;
          color: var(--color-text-muted);
        }

        .metric-val {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        /* Layout Grid */
        .shop-layout-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Sidebar Filters */
        .shop-sidebar-filters {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          position: relative;
        }

        .sidebar-header h3 {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .reset-filters-btn {
          position: absolute;
          right: 0;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 4px;
        }

        .reset-filters-btn:hover {
          color: var(--color-accent);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-title {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: bold;
        }

        .price-slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .price-labels {
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .category-filters-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .cat-pill-btn {
          font-size: 0.72rem;
          padding: 6px 12px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--color-text-secondary);
        }

        .cat-pill-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .cat-pill-btn.active {
          background-color: var(--color-text-primary);
          color: var(--color-bg);
          border-color: var(--color-text-primary);
        }

        .material-checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mat-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          color: var(--color-text-secondary);
          cursor: pointer;
        }

        .custom-radio-input {
          accent-color: var(--color-accent);
          cursor: pointer;
        }

        /* Products Catalog Area */
        .shop-catalog-area {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .catalog-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: var(--color-surface-base);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          gap: 20px;
        }

        .search-bar-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 8px 14px;
          max-width: 450px;
        }

        .search-icon {
          color: var(--color-text-muted);
        }

        .search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.8rem;
          outline: none;
          color: var(--color-text-primary);
        }

        .sort-select {
          font-size: 0.8rem;
          padding: 8px 12px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          outline: none;
          color: var(--color-text-secondary);
          cursor: pointer;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .shop-product-svg {
          width: 100%;
          height: 100%;
          max-height: 100px;
        }

        .product-card-desc {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          min-height: 38px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .no-products-found {
          padding: 50px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px dashed var(--color-border);
          border-radius: 12px;
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          .shop-header {
            flex-direction: column;
            align-items: stretch;
          }
          .shop-layout-grid {
            grid-template-columns: 1fr;
          }
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
