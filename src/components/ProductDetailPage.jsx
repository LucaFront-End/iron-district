import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWix } from '../context/WixContext';
import { deriveProductCategory } from '../services/wixClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Ruler, ShieldCheck, Star, 
  ChevronRight, Check, ShoppingBag, Lock, Truck,
  Plus, Minus, ArrowRight, Loader2, Share2, Layers
} from 'lucide-react';

export default function ProductDetailPage({ productId }) {
  const { language } = useLanguage();
  const { products, loading, addToCart, checkout, getProduct, formatWixImage } = useWix();

  // Find product in catalog
  const product = useMemo(() => {
    return getProduct(productId);
  }, [productId, getProduct, products]);

  // Gallery state
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Selected options state: { [optionName]: choiceValue }
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'shipping' | 'warranty'

  // Initialize options when product changes
  useEffect(() => {
    if (product?.productOptions) {
      const initial = {};
      product.productOptions.forEach((opt) => {
        if (opt.choices && opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0].description;
        }
      });
      setSelectedOptions(initial);
      setActiveMediaIndex(0);
      setQuantity(1);
    }
  }, [product]);

  // Find matching variant based on selected options
  const matchingVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => {
      return Object.entries(selectedOptions).every(([optName, optVal]) => {
        return v.choices?.[optName] === optVal;
      });
    }) || product.variants[0];
  }, [product, selectedOptions]);

  // Active price (from variant or base product)
  const currentPrice = useMemo(() => {
    if (matchingVariant?.variant?.priceData?.formatted?.price) {
      return matchingVariant.variant.priceData.formatted.price;
    }
    if (product?.priceData?.formatted?.price) {
      return product.priceData.formatted.price;
    }
    return `$${product?.priceData?.price?.toFixed(2) || '0.00'}`;
  }, [matchingVariant, product]);

  // Media items list
  const mediaItems = useMemo(() => {
    if (!product) return [];
    if (product.media?.items && product.media.items.length > 0) {
      return product.media.items.map((m) => formatWixImage(m.image?.url || m));
    }
    if (product.media?.mainMedia?.image?.url) {
      return [formatWixImage(product.media.mainMedia.image.url)];
    }
    return ['/logo.png'];
  }, [product, formatWixImage]);

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!product || !products.length) return [];
    const currentCategory = deriveProductCategory(product);
    return products
      .filter((p) => p._id !== product._id && deriveProductCategory(p) === currentCategory)
      .slice(0, 4);
  }, [product, products]);

  // Actions
  const handleOptionChange = (optionName, choiceValue) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: choiceValue,
    }));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    await addToCart(product, selectedOptions, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setIsBuyingNow(true);
    const res = await addToCart(product, selectedOptions, quantity);
    if (res?.success) {
      await checkout();
    }
    setIsBuyingNow(false);
  };

  if (loading) {
    return (
      <div className="product-loading-container container">
        <Loader2 size={40} className="spin-icon text-accent" />
        <h3>{language === 'en' ? 'Loading Product Specifications...' : 'Cargando Especificaciones del Producto...'}</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found container">
        <h2>{language === 'en' ? 'Product Not Found' : 'Producto No Encontrado'}</h2>
        <p>
          {language === 'en'
            ? 'The requested architectural component was not found or has been moved.'
            : 'El componente arquitectónico solicitado no fue encontrado o ha sido trasladado.'}
        </p>
        <a href="#/shop" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>{language === 'en' ? 'Return to Catalog' : 'Volver al Catálogo'}</span>
        </a>
      </div>
    );
  }

  const category = deriveProductCategory(product);
  const sku = matchingVariant?.variant?.sku || product.sku || 'SMW-ARCH';
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
    : (language === 'en'
      ? 'Custom architectural metal fabrication engineered with industrial precision and premium surface finishes.'
      : 'Fabricación arquitectónica de metal diseñada con precisión industrial y acabados de alta durabilidad.');

  return (
    <div className="product-page-wrapper">
      <div className="blueprint-grid"></div>

      {/* Breadcrumb trail */}
      <div className="product-breadcrumb container">
        <a href="#/shop" className="back-link">
          <ArrowLeft size={14} />
          <span>{language === 'en' ? 'Back to Catalog' : 'Volver al Catálogo'}</span>
        </a>
        <div className="breadcrumb-trail">
          <a href="#/shop" className="crumb-link">{language === 'en' ? 'Shop' : 'Tienda'}</a>
          <ChevronRight size={12} />
          <span className="crumb-cat">{category.toUpperCase()}</span>
          <ChevronRight size={12} />
          <span className="crumb-active">{product.name}</span>
        </div>
      </div>

      <section className="product-hero-section container">
        <div className="product-main-grid">
          
          {/* LEFT: Product Media Gallery */}
          <div className="product-gallery-panel">
            <div className="main-viewport-card glass-panel">
              <div className="cad-corner tl"></div>
              <div className="cad-corner tr"></div>
              <div className="cad-corner bl"></div>
              <div className="cad-corner br"></div>

              <div className="main-image-box">
                <img 
                  src={mediaItems[activeMediaIndex] || mediaItems[0]} 
                  alt={product.name} 
                  className="main-preview-img"
                />
              </div>

              <div className="gallery-status-overlay">
                <span className="status-spec">
                  <ShieldCheck size={14} className="text-accent" />
                  <span>{language === 'en' ? '100% Stainless AISI 304 / 316' : '100% Acero Inoxidable AISI 304 / 316'}</span>
                </span>
                <span className="sku-spec">SKU: {sku}</span>
              </div>
            </div>

            {/* Thumbnails strip */}
            {mediaItems.length > 1 && (
              <div className="thumbnail-strip">
                {mediaItems.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activeMediaIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveMediaIndex(idx)}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Buy Box and Options Selector */}
          <div className="product-info-panel glass-panel">
            <div className="product-badge-row">
              <span className="product-category-tag">{category.toUpperCase()}</span>
              <span className="verified-tag">
                <Check size={12} />
                <span>{language === 'en' ? 'Factory Direct' : 'Directo de Fábrica'}</span>
              </span>
            </div>

            <h1 className="product-main-title">{product.name}</h1>

            <div className="product-rating-row">
              <div className="stars-group">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#FF9F0A" stroke="none" />
                ))}
              </div>
              <span className="rating-score">4.9</span>
              <span className="rating-divider">•</span>
              <span className="rating-count">
                {language === 'en' ? 'Verified Architectural Purchase' : 'Compra Arquitectónica Verificada'}
              </span>
            </div>

            {/* Price section */}
            <div className="product-price-box">
              <div className="price-tag-large">
                <span className="price-number">{currentPrice}</span>
                <span className="price-currency">USD</span>
              </div>
              <span className="price-meta">
                {language === 'en' ? 'Includes all mounting hardware brackets & hardware' : 'Incluye soportes y tornillería de instalación'}
              </span>
            </div>

            {/* DYNAMIC WIX PRODUCT OPTIONS */}
            {product.productOptions && product.productOptions.length > 0 && (
              <div className="product-options-form">
                {product.productOptions.map((opt) => {
                  const currentVal = selectedOptions[opt.name] || (opt.choices?.[0]?.description);
                  const isLongList = opt.choices?.length > 6;

                  return (
                    <div key={opt.name} className="option-field-group">
                      <div className="option-label-row">
                        <label className="option-title">{opt.name.replace(/:+$/, '')}</label>
                        <span className="option-selected-val">{currentVal}</span>
                      </div>

                      {isLongList ? (
                        /* Select Dropdown for lengths (e.g. 1 ft to 24 ft) */
                        <div className="custom-select-wrapper">
                          <select
                            value={currentVal}
                            onChange={(e) => handleOptionChange(opt.name, e.target.value)}
                            className="wix-option-select"
                          >
                            {opt.choices?.map((choice) => (
                              <option key={choice.value} value={choice.description}>
                                {choice.description} {choice.description.includes('ft') || choice.description.includes("'") ? '' : 'ft'}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        /* Pills / Swatches for finishes and shorter lists */
                        <div className="option-pills-row">
                          {opt.choices?.map((choice) => {
                            const isSelected = currentVal === choice.description;
                            const isColor = choice.description.toLowerCase().includes('black') || 
                                            choice.description.toLowerCase().includes('primer') || 
                                            choice.description.toLowerCase().includes('stainless');

                            return (
                              <button
                                key={choice.value}
                                className={`option-pill ${isSelected ? 'active' : ''}`}
                                onClick={() => handleOptionChange(opt.name, choice.description)}
                              >
                                {isColor && (
                                  <span 
                                    className="pill-swatch"
                                    style={{
                                      backgroundColor: choice.description.toLowerCase().includes('black') 
                                        ? '#1E1E24' 
                                        : choice.description.toLowerCase().includes('primer') 
                                          ? '#94A3B8' 
                                          : '#CBD5E1'
                                    }}
                                  />
                                )}
                                <span>{choice.description}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="purchase-controls-row">
              <div className="quantity-box">
                <button 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  onClick={() => setQuantity((q) => q + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn btn-secondary add-cart-btn"
              >
                {isAdding ? (
                  <Loader2 size={16} className="spin-icon" />
                ) : (
                  <ShoppingBag size={16} />
                )}
                <span>{language === 'en' ? 'Add to Cart' : 'Añadir al Carrito'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="btn btn-primary buy-now-btn"
              >
                {isBuyingNow ? (
                  <Loader2 size={16} className="spin-icon" />
                ) : (
                  <Lock size={16} />
                )}
                <span>{language === 'en' ? 'Buy Now' : 'Comprar Ahora'}</span>
              </button>
            </div>

            {/* Value Props */}
            <div className="value-props-list">
              <div className="prop-item">
                <Truck size={16} className="text-accent" />
                <span>{language === 'en' ? 'Fast nationwide freight with protective crate packaging' : 'Envío protegido a todo el país en embalaje reforzado'}</span>
              </div>
              <div className="prop-item">
                <ShieldCheck size={16} className="text-accent" />
                <span>{language === 'en' ? 'Lifetime structural warranty & corrosion guarantee' : 'Garantía estructural y anticorrosión de por vida'}</span>
              </div>
              <div className="prop-item">
                <Ruler size={16} className="text-accent" />
                <span>{language === 'en' ? 'Custom cut-to-size precision available upon request' : 'Cortes a medida exacta disponibles'}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Tabs description and technical details */}
      <section className="product-details-tabs-section container">
        <div className="details-tabs-nav glass-panel">
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <Layers size={15} />
            <span>{language === 'en' ? 'Product Overview & Description' : 'Descripción y Características'}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <Truck size={15} />
            <span>{language === 'en' ? 'Shipping & Packaging' : 'Envío y Empaque'}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
            onClick={() => setActiveTab('warranty')}
          >
            <ShieldCheck size={15} />
            <span>{language === 'en' ? 'Architectural Standards' : 'Normas Arquitectónicas'}</span>
          </button>
        </div>

        <div className="details-tabs-content glass-panel">
          {activeTab === 'specs' && (
            <div className="tab-pane">
              <h3 className="tab-pane-title">{language === 'en' ? 'Product Specifications' : 'Especificaciones del Producto'}</h3>
              <p className="tab-pane-text">{cleanDescription}</p>

              <div className="specs-table-grid">
                <div className="spec-table-row">
                  <span className="spec-name">{language === 'en' ? 'Material Grade' : 'Grado de Acero'}</span>
                  <span className="spec-value">AISI 304 / 316 Marine-Grade Stainless Steel</span>
                </div>
                <div className="spec-table-row">
                  <span className="spec-name">{language === 'en' ? 'Model SKU' : 'SKU del Modelo'}</span>
                  <span className="spec-value">{sku}</span>
                </div>
                <div className="spec-table-row">
                  <span className="spec-name">{language === 'en' ? 'Available Lengths' : 'Longitudes Disponibles'}</span>
                  <span className="spec-value">1 ft to 24 ft modular continuous runs</span>
                </div>
                <div className="spec-table-row">
                  <span className="spec-name">{language === 'en' ? 'Mounting Type' : 'Tipo de Montaje'}</span>
                  <span className="spec-value">{language === 'en' ? 'Heavy-Duty Wall Flange / Floor Post' : 'Brida de Pared Reforzada / Poste a Piso'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-pane">
              <h3 className="tab-pane-title">{language === 'en' ? 'Shipping & Packaging' : 'Envío y Empaque'}</h3>
              <p className="tab-pane-text">
                {language === 'en'
                  ? 'All architectural handrails and metal systems are bubble-wrapped in double-wall cardboard sleeves or custom timber crates to guarantee zero transit damage.'
                  : 'Todos los pasamanos arquitectónicos y sistemas de metal están embalados con plástico de burbuja en mangas de cartón de doble pared o cajas de madera a medida.'}
              </p>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="tab-pane">
              <h3 className="tab-pane-title">{language === 'en' ? 'Architectural Quality & Compliance' : 'Calidad y Normativa Arquitectónica'}</h3>
              <p className="tab-pane-text">
                {language === 'en'
                  ? 'Engineered to comply with IBC (International Building Code) and ADA commercial requirements. Verified for maximum tensile load and safety clearances.'
                  : 'Diseñado para cumplir con las normativas internacionales IBC y requerimientos comerciales de accesibilidad ADA.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS CAROUSEL */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section container">
          <div className="section-header-compact">
            <span className="tag-label">{language === 'en' ? 'RECOMMENDED PAIRINGS' : 'COMBINACIONES RECOMENDADAS'}</span>
            <h2>{language === 'en' ? 'Related Architectural Hardware' : 'Herrajes Arquitectónicos Relacionados'}</h2>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((rel) => {
              const relImg = formatWixImage(rel.media?.mainMedia?.image?.url || rel.media?.items?.[0]?.image?.url);
              const relPrice = rel.priceData?.formatted?.price || `$${rel.priceData?.price?.toFixed(2) || '0.00'}`;
              const relUrl = `#/product/${rel.slug || rel._id}`;

              return (
                <a key={rel._id} href={relUrl} className="related-card glass-panel">
                  <div className="related-img-box">
                    <img src={relImg} alt={rel.name} className="related-img" />
                  </div>
                  <div className="related-body">
                    <h4>{rel.name}</h4>
                    <span className="related-price">{relPrice}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <style>{`
        .product-page-wrapper {
          padding-top: 100px;
          padding-bottom: 90px;
          position: relative;
        }

        .product-breadcrumb {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--color-accent);
        }

        .breadcrumb-trail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .crumb-link {
          color: var(--color-text-secondary);
          text-decoration: none;
        }

        .crumb-link:hover {
          color: var(--color-accent);
        }

        .crumb-active {
          color: var(--color-text-primary);
          font-weight: 700;
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Main Grid */
        .product-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: 36px;
          align-items: start;
        }

        /* Gallery Panel */
        .product-gallery-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .main-viewport-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 480px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }

        .main-image-box {
          width: 100%;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .main-viewport-card:hover .main-preview-img {
          transform: scale(1.03);
        }

        .gallery-status-overlay {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 14px;
          border-top: 1px solid var(--color-border);
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
        }

        .status-spec {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sku-spec {
          color: var(--color-text-muted);
        }

        /* Technical Corners */
        .cad-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 1.5px solid var(--color-accent);
          pointer-events: none;
        }
        .cad-corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
        .cad-corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
        .cad-corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; }
        .cad-corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; }

        .thumbnail-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .thumb-btn {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          cursor: pointer;
          padding: 4px;
          flex-shrink: 0;
          transition: border-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumb-btn:hover {
          border-color: #94A3B8;
        }

        .thumb-btn.active {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 1px var(--color-accent);
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Info Panel */
        .product-info-panel {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 34px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }

        .product-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .product-category-tag {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .verified-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
          font-size: 0.68rem;
          color: #10B981;
        }

        .product-main-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.25;
          margin: 0;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
        }

        .stars-group {
          display: flex;
          gap: 2px;
        }

        .rating-score {
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .rating-divider {
          color: var(--color-text-muted);
        }

        .rating-count {
          color: var(--color-text-muted);
        }

        .product-price-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 20px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 10px;
        }

        .price-tag-large {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .price-number {
          font-family: monospace;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .price-currency {
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .price-meta {
          font-size: 0.76rem;
          color: var(--color-text-secondary);
        }

        /* Option Field Groups */
        .product-options-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px 0;
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }

        .option-field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .option-title {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-primary);
          text-transform: uppercase;
        }

        .option-selected-val {
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-accent);
          font-weight: 600;
        }

        .custom-select-wrapper select {
          width: 100%;
          padding: 10px 14px;
          background: #F8FAFC;
          border: 1.5px solid var(--color-border);
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          color: var(--color-text-primary);
          outline: none;
          cursor: pointer;
        }

        .custom-select-wrapper select:focus {
          border-color: var(--color-accent);
        }

        .option-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .option-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .option-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
        }

        .option-pill.active {
          background-color: var(--color-text-primary);
          color: #FFF;
          border-color: var(--color-text-primary);
        }

        .pill-swatch {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }

        /* Purchase Controls */
        .purchase-controls-row {
          display: flex;
          gap: 10px;
          align-items: center;
          width: 100%;
        }

        .quantity-box {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          height: 48px;
          flex-shrink: 0;
        }

        .quantity-box .qty-btn {
          background: transparent;
          border: none;
          padding: 0 10px;
          height: 100%;
          cursor: pointer;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-box .qty-btn:hover {
          color: var(--color-text-primary);
        }

        .qty-number {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0 6px;
          color: var(--color-text-primary);
        }

        .add-cart-btn {
          flex: 1;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: 8px;
          white-space: nowrap;
          min-width: 110px;
        }

        .buy-now-btn {
          flex: 1.1;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 8px;
          white-space: nowrap;
          min-width: 110px;
        }

        /* Value Props */
        .value-props-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 10px;
        }

        .prop-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
          color: var(--color-text-secondary);
        }

        /* Details Tabs Section */
        .product-details-tabs-section {
          margin-top: 40px;
        }

        .details-tabs-nav {
          display: flex;
          gap: 8px;
          padding: 6px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--color-text-primary);
        }

        .tab-btn.active {
          background: #F1F5F9;
          color: var(--color-accent);
        }

        .details-tabs-content {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 30px;
        }

        .tab-pane-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }

        .tab-pane-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .specs-table-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .spec-table-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 16px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 6px;
        }

        .spec-name {
          font-family: monospace;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .spec-value {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        /* Related products */
        .related-products-section {
          margin-top: 60px;
        }

        .section-header-compact {
          margin-bottom: 24px;
        }

        .section-header-compact h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-top: 6px;
        }

        .related-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .related-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 14px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.25s, border-color 0.25s;
        }

        .related-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
        }

        .related-img-box {
          height: 150px;
          background: #F8FAFC;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .related-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .related-body h4 {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0 0 4px 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-price {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-accent);
        }

        .product-loading-container, .product-not-found {
          padding-top: 160px;
          padding-bottom: 120px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        @media (max-width: 992px) {
          .product-main-grid {
            grid-template-columns: 1fr;
          }
          .related-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .purchase-controls-row {
            flex-direction: column;
          }
          .quantity-box, .add-cart-btn, .buy-now-btn {
            width: 100%;
          }
          .specs-table-grid {
            grid-template-columns: 1fr;
          }
          .related-products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
