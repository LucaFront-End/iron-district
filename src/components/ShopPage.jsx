import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWix } from '../context/WixContext';
import { deriveProductCategory } from '../services/wixClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowRight, Filter, RotateCcw, ShoppingBag, Layers, Loader2, ExternalLink } from 'lucide-react';

export default function ShopPage() {
  const { t, language } = useLanguage();
  const { products, loading, error, addToCart, formatWixImage } = useWix();

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('featured');
  const [addingId, setAddingId] = useState(null);

  // Dynamic Categories list with count
  const categoriesList = useMemo(() => {
    const counts = {
      all: products.length,
      handrails: 0,
      brackets: 0,
      posts: 0,
      tubes: 0,
      accessories: 0,
    };

    products.forEach((p) => {
      const cat = deriveProductCategory(p);
      if (counts[cat] !== undefined) counts[cat]++;
      else counts.accessories++;
    });

    return [
      { id: 'all', label: language === 'en' ? 'All Products' : 'Todos los Productos', count: counts.all },
      { id: 'handrails', label: language === 'en' ? 'Handrails & Railings' : 'Pasamanos y Barandales', count: counts.handrails },
      { id: 'brackets', label: language === 'en' ? 'Wall Mount Brackets' : 'Soportes de Muro', count: counts.brackets },
      { id: 'posts', label: language === 'en' ? 'Posts & Flanges' : 'Postes y Bridas', count: counts.posts },
      { id: 'tubes', label: language === 'en' ? 'Tubes & Samples' : 'Tubos y Muestras', count: counts.tubes },
      { id: 'accessories', label: language === 'en' ? 'Hardware & Parts' : 'Herrajes y Accesorios', count: counts.accessories },
    ];
  }, [products, language]);

  // Materials / Finish list
  const materialsList = [
    { id: 'all', label: language === 'en' ? 'All Finishes' : 'Todos los Acabados' },
    { id: 'stainless', label: language === 'en' ? 'Stainless Steel (304/316)' : 'Acero Inoxidable' },
    { id: 'black', label: language === 'en' ? 'Matte Black' : 'Negro Mate' },
    { id: 'primer', label: language === 'en' ? 'Grey Primer / Raw' : 'Imprimación Gris' },
  ];

  // Filtering and sorting logic over live Wix products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const name = (product.name || '').toLowerCase();
        const desc = (product.description || '').toLowerCase();
        const query = searchQuery.toLowerCase().trim();

        // Search query filter
        const matchesSearch = !query || name.includes(query) || desc.includes(query);

        // Category filter
        const category = deriveProductCategory(product);
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

        // Material filter
        let matchesMaterial = true;
        if (selectedMaterial !== 'all') {
          if (selectedMaterial === 'stainless') {
            matchesMaterial = name.includes('stainless') || desc.includes('stainless') || name.includes('inoxidable');
          } else if (selectedMaterial === 'black') {
            matchesMaterial = name.includes('black') || desc.includes('black') || name.includes('negro');
          } else if (selectedMaterial === 'primer') {
            matchesMaterial = name.includes('primer') || desc.includes('primer') || name.includes('raw');
          }
        }

        // Price filter
        const price = product.priceData?.price ?? 0;
        const matchesPrice = price <= maxPrice;

        return matchesSearch && matchesCategory && matchesMaterial && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = a.priceData?.price ?? 0;
        const priceB = b.priceData?.price ?? 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0; // featured/default
      });
  }, [products, searchQuery, selectedCategory, selectedMaterial, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setMaxPrice(300);
    setSortBy('featured');
  };

  const handleQuickAdd = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product._id);
    await addToCart(product, {}, 1);
    setAddingId(null);
  };

  return (
    <div className="shop-page-wrapper">
      <div className="blueprint-grid"></div>

      <header className="shop-header container">
        <div className="header-content">
          <span className="shop-badge">
            <Filter size={12} className="pulse-glow" style={{ marginRight: '6px' }} />
            {language === 'en' ? 'OFFICIAL WIX STORES CATALOG' : 'CATÁLOGO OFICIAL WIX STORES'}
          </span>
          <h1 className="text-gradient">{t('shop.title')}</h1>
          <p>
            {language === 'en'
              ? 'Explore our precision-crafted architectural handrails, heavy-duty mounting hardware, and custom fabrication components with direct-from-factory pricing.'
              : 'Explora nuestros pasamanos arquitectónicos de alta precisión, herrajes de montaje y componentes estructurales con precios directos de fábrica.'}
          </p>
        </div>

        {/* Global Catalog Metrics */}
        <div className="shop-metrics-row glass-panel">
          <div className="metric-box">
            <span className="metric-lbl">{language === 'en' ? 'LIVE PRODUCTS' : 'PRODUCTOS ACTIVOS'}</span>
            <span className="metric-val">{products.length} {language === 'en' ? 'MODELS' : 'MODELOS'}</span>
          </div>
          <div className="metric-box">
            <span className="metric-lbl">{language === 'en' ? 'STAINLESS GRADE' : 'GRADO DE ACERO'}</span>
            <span className="metric-val">AISI 304 / 316</span>
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
              {(searchQuery || selectedCategory !== 'all' || selectedMaterial !== 'all' || maxPrice !== 300) && (
                <button onClick={handleResetFilters} className="reset-filters-btn" title="Reset Filters">
                  <RotateCcw size={12} />
                </button>
              )}
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
                    <span>{cat.label}</span>
                    <span className="cat-count">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <label className="filter-title">{t('shop.priceRange')}</label>
              <div className="price-slider-wrapper">
                <div className="price-labels">
                  <span>$0</span>
                  <span>${maxPrice} USD</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="350" 
                  step="5"
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="custom-range-slider"
                />
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
                  placeholder={language === 'en' ? 'Search handrails, brackets, tubes, posts...' : 'Buscar pasamanos, soportes, tubos, postes...'}
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
                  <option value="featured">{language === 'en' ? 'Featured Products' : 'Productos Destacados'}</option>
                  <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'Precio: Menor a Mayor'}</option>
                  <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'Precio: Mayor a Menor'}</option>
                  <option value="name">{language === 'en' ? 'Product Name (A-Z)' : 'Nombre (A-Z)'}</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            <div className="catalog-products-wrapper">
              {loading ? (
                <div className="loading-state glass-panel">
                  <Loader2 size={36} className="spin-icon text-accent" />
                  <p>{language === 'en' ? 'Loading live catalog from Wix Stores...' : 'Cargando catálogo en tiempo real desde Wix Stores...'}</p>
                </div>
              ) : error ? (
                <div className="error-state glass-panel">
                  <p className="text-accent">{error}</p>
                  <button onClick={handleResetFilters} className="btn btn-secondary">
                    {language === 'en' ? 'Retry' : 'Reintentar'}
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProducts.length > 0 ? (
                    <div className="products-grid">
                      {filteredProducts.map((product) => {
                        const imgUrl = formatWixImage(product.media?.mainMedia?.image?.url || product.media?.items?.[0]?.image?.url);
                        const category = deriveProductCategory(product);
                        const price = product.priceData?.formatted?.price || `$${product.priceData?.price?.toFixed(2) || '0.00'}`;
                        const optionsCount = product.productOptions?.length || 0;
                        const targetUrl = `#/product/${product.slug || product._id}`;

                        return (
                          <motion.div 
                            layout
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25 }}
                            className="catalog-product-card glass-panel"
                          >
                            <div className="catalog-card-header">
                              <span className="category-label-tag">{category.toUpperCase()}</span>
                              {optionsCount > 0 ? (
                                <span className="variants-badge">
                                  <Layers size={11} />
                                  <span>{optionsCount} {optionsCount === 1 ? 'Option' : 'Options'}</span>
                                </span>
                              ) : (
                                <span className="in-stock-badge">
                                  <span className="ping-dot"></span>
                                  <span>In Stock</span>
                                </span>
                              )}
                            </div>

                            {/* Real Wix Product Image */}
                            <a href={targetUrl} className="catalog-card-img-link">
                              <div className="catalog-card-graphics">
                                <img 
                                  src={imgUrl} 
                                  alt={product.name} 
                                  className="wix-product-thumb"
                                  loading="lazy" 
                                />
                              </div>
                            </a>

                            <div className="catalog-card-body">
                              <div className="title-price-row">
                                <a href={targetUrl} className="product-card-title-link">
                                  <h3>{product.name}</h3>
                                </a>
                                <div className="price-tag-badge">
                                  <span className="price-val">{price}</span>
                                </div>
                              </div>

                              <p className="product-card-desc">
                                {product.description 
                                  ? product.description.replace(/<[^>]*>?/gm, '').slice(0, 95) + '...'
                                  : (language === 'en' ? 'Architectural metal fabrication with premium finish and mounting hardware.' : 'Componente arquitectónico con acabado de alta resistencia y herrajes.')}
                              </p>

                              <div className="catalog-card-actions">
                                <a 
                                  href={targetUrl}
                                  className="btn btn-secondary catalog-btn-details"
                                >
                                  <span>{language === 'en' ? 'Configure' : 'Configurar'}</span>
                                  <ExternalLink size={12} />
                                </a>

                                <button 
                                  onClick={(e) => handleQuickAdd(product, e)}
                                  disabled={addingId === product._id}
                                  className="btn btn-primary catalog-btn-buy"
                                  title={language === 'en' ? 'Add to cart' : 'Añadir al carrito'}
                                >
                                  {addingId === product._id ? (
                                    <Loader2 size={13} className="spin-icon" />
                                  ) : (
                                    <ShoppingBag size={13} />
                                  )}
                                  <span>{language === 'en' ? 'Buy' : 'Comprar'}</span>
                                </button>
                              </div>
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
              )}
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
          max-width: 620px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shop-badge {
          font-family: monospace;
          font-size: 0.65rem;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: bold;
          align-self: flex-start;
          display: flex;
          align-items: center;
        }

        .shop-header h1 {
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.15;
          color: var(--color-text-primary);
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
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Sidebar Filters */
        .shop-sidebar-filters {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: #FFFFFF;
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
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
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
          color: var(--color-text-primary);
        }

        .custom-range-slider {
          accent-color: var(--color-accent);
          cursor: pointer;
        }

        .category-filters-pills {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cat-pill-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.76rem;
          padding: 8px 12px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--color-text-secondary);
          text-align: left;
        }

        .cat-pill-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
          background: #FFF;
        }

        .cat-pill-btn.active {
          background-color: var(--color-text-primary);
          color: #FFF;
          border-color: var(--color-text-primary);
        }

        .cat-count {
          font-family: monospace;
          font-size: 0.68rem;
          opacity: 0.8;
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
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          gap: 20px;
        }

        .search-bar-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 8px 14px;
          max-width: 480px;
        }

        .search-icon {
          color: var(--color-text-muted);
        }

        .search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.82rem;
          outline: none;
          color: var(--color-text-primary);
        }

        .sort-select {
          font-size: 0.8rem;
          padding: 8px 12px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          outline: none;
          color: var(--color-text-primary);
          cursor: pointer;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .catalog-product-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }

        .catalog-product-card:hover {
          border-color: var(--color-accent);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          transform: translateY(-3px);
        }

        .catalog-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-label-tag {
          font-family: monospace;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }

        .variants-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.65rem;
          color: #2563EB;
          background: rgba(37, 99, 235, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .in-stock-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: monospace;
          font-size: 0.65rem;
          color: #10B981;
        }

        .ping-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
        }

        .catalog-card-img-link {
          text-decoration: none;
          display: block;
        }

        .catalog-card-graphics {
          background: #F8FAFC;
          border-radius: 8px;
          overflow: hidden;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
        }

        .wix-product-thumb {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .catalog-product-card:hover .wix-product-thumb {
          transform: scale(1.04);
        }

        .catalog-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .product-card-title-link {
          text-decoration: none;
          color: inherit;
        }

        .title-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .title-price-row h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.35;
          margin: 0;
          transition: color 0.2s;
        }

        .title-price-row h3:hover {
          color: var(--color-accent);
        }

        .price-tag-badge {
          background: #F1F5F9;
          padding: 3px 8px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .price-val {
          font-family: monospace;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .product-card-desc {
          font-size: 0.74rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
          margin: 0;
          min-height: 38px;
        }

        .catalog-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .catalog-btn-details {
          flex: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 0.76rem;
          border-radius: 6px;
          text-decoration: none;
        }

        .catalog-btn-buy {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 0.76rem;
          border-radius: 6px;
        }

        .loading-state, .error-state, .no-products-found {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: #FFF;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 992px) {
          .shop-layout-grid {
            grid-template-columns: 1fr;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .shop-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .shop-metrics-row {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
