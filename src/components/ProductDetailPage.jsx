import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWix } from '../context/WixContext';
import { deriveProductCategory } from '../services/wixClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Ruler, ShieldCheck, Star, 
  ChevronRight, ChevronDown, Check, ShoppingBag, Lock, Truck,
  Plus, Minus, ArrowRight, Loader2, Share2, Layers,
  Paintbrush, Scissors, Sparkles, Sliders
} from 'lucide-react';

// Architectural Metal Finishing Metadata & Colors
const FINISH_METADATA = {
  'matte black': {
    color: '#161618',
    gradient: 'linear-gradient(135deg, #232328 0%, #101012 100%)',
    border: 'rgba(255, 255, 255, 0.2)',
    nameEn: 'Matte Black',
    nameEs: 'Negro Mate',
    sheenEn: 'Architectural satin powder coat (10% sheen)',
    sheenEs: 'Pintura electrostática satinada de alta resistencia'
  },
  'semi gloss black': {
    color: '#0a0a0c',
    gradient: 'linear-gradient(135deg, #2b2e35 0%, #08090a 100%)',
    border: 'rgba(255, 255, 255, 0.25)',
    nameEn: 'Semi Gloss Black',
    nameEs: 'Negro Semi-Brillante',
    sheenEn: 'Smooth gloss powder coat (40% sheen)',
    sheenEs: 'Pintura electrostática brillante y suave'
  },
  'grey primer': {
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)',
    border: 'rgba(0, 0, 0, 0.15)',
    nameEn: 'Grey Primer',
    nameEs: 'Fondo Imprimante Gris',
    sheenEn: 'Epoxy anti-corrosion barrier primer ready for field paint',
    sheenEs: 'Fondo anticorrosivo listo para pintar en obra'
  },
  'raw unfinished': {
    color: '#a8a29e',
    gradient: 'linear-gradient(135deg, #d6d3d1 0%, #78716c 100%)',
    border: 'rgba(0, 0, 0, 0.18)',
    nameEn: 'Raw Unfinished',
    nameEs: 'Acero Natural (Sin Tratamiento)',
    sheenEn: 'Bare deburred steel with industrial mill grain',
    sheenEs: 'Acero desbastado limpio con textura industrial'
  },
  'aged bronze': {
    color: '#5a3d28',
    gradient: 'linear-gradient(135deg, #7c5839 0%, #3e2617 100%)',
    border: 'rgba(255, 255, 255, 0.15)',
    nameEn: 'Aged Bronze',
    nameEs: 'Bronce Envejecido',
    sheenEn: 'Warm hand-rubbed metallic bronze patina',
    sheenEs: 'Pátina metálica bronce aplicada a mano'
  },
  'aged silver': {
    color: '#cbd5e1',
    gradient: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
    border: 'rgba(0, 0, 0, 0.15)',
    nameEn: 'Aged Silver / Stainless',
    nameEs: 'Plata Envejecida / Inox',
    sheenEn: 'Directional brushed AISI 304/316 marine sheen',
    sheenEs: 'Acabado satinado cepillado inoxidable grado marino'
  },
  'classic copper': {
    color: '#b87333',
    gradient: 'linear-gradient(135deg, #d98844 0%, #87491b 100%)',
    border: 'rgba(255, 255, 255, 0.2)',
    nameEn: 'Classic Copper',
    nameEs: 'Cobre Clásico',
    sheenEn: 'Rich copper metallic with protective clearcoat',
    sheenEs: 'Tono cobre brillante con barniz protector'
  },
  'vintage gold': {
    color: '#d4af37',
    gradient: 'linear-gradient(135deg, #f3d768 0%, #a6841c 100%)',
    border: 'rgba(255, 255, 255, 0.2)',
    nameEn: 'Vintage Gold',
    nameEs: 'Oro Vintage',
    sheenEn: 'Brushed warm brass/gold architectural luster',
    sheenEs: 'Brillo arquitectónico latón/oro cepillado'
  }
};

/**
 * Normalizes length strings (feet numbers, fractions, range brackets, tubes) into structured feet & inches
 */
function parseFeetAndInches(val) {
  if (!val) return { isOther: true, raw: '' };
  const str = String(val).trim();

  // Range bracket: e.g. "1'-6'Length", "7\"-12' Length", "13'-18\" Length", "19'-22\" Length"
  const rangeMatch = str.match(/(\d+)\s*['"]?\s*-\s*(\d+)\s*['"]?/);
  if (rangeMatch) {
    const minFt = parseInt(rangeMatch[1], 10);
    const maxFt = parseInt(rangeMatch[2], 10);
    return {
      isRange: true,
      minFt,
      maxFt,
      labelFt: `${minFt}' - ${maxFt}' ft`,
      labelIn: `${minFt * 12}" - ${maxFt * 12}" in`,
      fullLabel: `${minFt}' - ${maxFt}' ft (${minFt * 12}" - ${maxFt * 12}")`,
      shortLabel: `${minFt}' - ${maxFt}' ft`
    };
  }

  // Tube length: "36\" inches= 3\" ft (1 part)" or "12\" inches = 1'ft"
  const tubeMatch = str.match(/(\d+)\s*\\?"?\s*in[a-z]*\s*=\s*(\d+)/i);
  if (tubeMatch) {
    const inches = parseInt(tubeMatch[1], 10);
    const feet = parseInt(tubeMatch[2], 10);
    return {
      isTube: true,
      feet,
      inches,
      fullLabel: `${inches}" in = ${feet}' ft`,
      shortLabel: `${feet} ft (${inches}")`
    };
  }

  // Fractions: "1 1⁄2", "1 1/2", "2 1⁄2", etc.
  const fracMatch = str.match(/^(\d+)\s*(?:1⁄2|1\/2|½)$/);
  if (fracMatch) {
    const whole = parseInt(fracMatch[1], 10);
    const feet = whole + 0.5;
    const inches = feet * 12;
    return {
      isSequentialFoot: true,
      feet,
      inches,
      feetDisplay: `${whole}½' ft`,
      inchesDisplay: `${inches}" in`,
      fullLabel: `${inches}" in = ${whole}½' ft`,
      shortLabel: `${whole}½ ft (${inches}")`
    };
  }

  // Whole number: "1", "2", "3", "24"
  const numMatch = str.match(/^(\d+)$/);
  if (numMatch) {
    const feet = parseInt(numMatch[1], 10);
    const inches = feet * 12;
    return {
      isSequentialFoot: true,
      feet,
      inches,
      feetDisplay: `${feet}' ft`,
      inchesDisplay: `${inches}" in`,
      fullLabel: `${inches}" in = ${feet}' ft`,
      shortLabel: `${feet} ft (${inches}")`
    };
  }

  return { isOther: true, raw: str };
}

/**
 * Dropdown Selector for Colors & Finishes (Optimum Rails style custom select)
 */
function FinishDropdown({ opt, currentVal, onSelect, language }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMeta = (val) => {
    const key = (val || '').toLowerCase().trim();
    return FINISH_METADATA[key] || {
      color: '#475569',
      gradient: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      border: 'rgba(255, 255, 255, 0.15)',
      nameEn: val,
      nameEs: val,
      sheenEn: 'Architectural surface finish',
      sheenEs: 'Acabado arquitectónico de fábrica'
    };
  };

  const selectedMeta = getMeta(currentVal);

  return (
    <div className="finish-dropdown-container" ref={dropdownRef}>
      <div className="option-label-row">
        <label className="option-title">
          <Paintbrush size={13} className="option-icon" />
          <span>{language === 'en' ? 'Finish' : 'Color y Acabado'}</span>
        </label>
        <span className="option-selected-val">
          <span 
            className="swatch-mini" 
            style={{ background: selectedMeta.gradient, borderColor: selectedMeta.border }} 
          />
          {language === 'en' ? selectedMeta.nameEn : selectedMeta.nameEs}
        </span>
      </div>

      <div className="custom-finish-dropdown">
        <button
          type="button"
          className={`finish-dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <div className="trigger-left">
            <span 
              className="finish-swatch-circle" 
              style={{ background: selectedMeta.gradient, borderColor: selectedMeta.border }} 
            />
            <div className="trigger-text">
              <span className="trigger-title">
                {language === 'en' ? selectedMeta.nameEn : selectedMeta.nameEs}
              </span>
              <span className="trigger-sheen">
                {language === 'en' ? selectedMeta.sheenEn : selectedMeta.sheenEs}
              </span>
            </div>
          </div>
          <ChevronDown size={18} className={`chevron-indicator ${isOpen ? 'rotate' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="finish-dropdown-menu"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              {opt.choices?.map((choice) => {
                const isSelected = choice.description === currentVal;
                const meta = getMeta(choice.description);

                return (
                  <button
                    key={choice.value || choice.description}
                    type="button"
                    className={`finish-menu-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      onSelect(opt.name, choice.description);
                      setIsOpen(false);
                    }}
                  >
                    <span 
                      className="menu-swatch-circle" 
                      style={{ background: meta.gradient, borderColor: meta.border }} 
                    />
                    <div className="menu-item-info">
                      <div className="menu-item-title-row">
                        <span className="menu-item-title">
                          {language === 'en' ? meta.nameEn : meta.nameEs}
                        </span>
                        {isSelected && (
                          <span className="active-badge">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <span className="menu-item-sub">
                        {language === 'en' ? meta.sheenEn : meta.sheenEs}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Handrail Length Selector in Feet and Inches (Optimum Rails style with slider, quick pills & custom cut)
 */
function HandrailLengthSelector({ opt, currentVal, onSelect, language }) {
  const [showCustomCut, setShowCustomCut] = useState(false);
  const [customInches, setCustomInches] = useState('');
  const [savedCut, setSavedCut] = useState(null);

  const parsedChoices = useMemo(() => {
    return (opt.choices || []).map((c, idx) => ({
      ...c,
      index: idx,
      parsed: parseFeetAndInches(c.description)
    }));
  }, [opt.choices]);

  const currentIndex = parsedChoices.findIndex((c) => c.description === currentVal);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentChoice = parsedChoices[safeIndex] || parsedChoices[0];

  const isSequentialFeet = parsedChoices.filter(c => c.parsed.isSequentialFoot).length >= 5;

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    const targetChoice = parsedChoices[idx];
    if (targetChoice) {
      onSelect(opt.name, targetChoice.description);
    }
  };

  // Standard popular runs for quick 1-click select
  const popularFootTargets = ['3', '4', '5', '6', '8', '10', '12'];
  const popularPills = useMemo(() => {
    return parsedChoices.filter(c => popularFootTargets.includes(c.description.trim()));
  }, [parsedChoices]);

  // Derive cleaner title if it was raw "AMOUNT"
  const isAmountLabel = opt.name.toLowerCase().includes('amount');
  const titleText = isAmountLabel
    ? (language === 'en' ? 'Handrail Length Coverage' : 'Cobertura de Longitud (Pies)')
    : (language === 'en' ? 'Handrail Length' : 'Longitud del Pasamanos');

  // Slider progress percentage for CSS track fill
  const sliderPercent = parsedChoices.length > 1 
    ? (safeIndex / (parsedChoices.length - 1)) * 100 
    : 0;

  return (
    <div className="handrail-length-selector-container">
      <div className="option-label-row">
        <label className="option-title">
          <Ruler size={13} className="option-icon" />
          <span>{titleText}</span>
        </label>
        
        {/* Prominent Feet & Inches Header Display (Optimum Rails style) */}
        <div className="length-badge-display">
          {currentChoice?.parsed?.fullLabel ? (
            <span className="badge-highlight">
              {currentChoice.parsed.fullLabel}
            </span>
          ) : (
            <span className="badge-highlight">
              {currentVal} {currentVal?.includes('ft') || currentVal?.includes("'") ? '' : 'ft'}
            </span>
          )}
        </div>
      </div>

      {isSequentialFeet ? (
        <div className="sequential-length-controls">
          {/* Optimum Rails Range Slider */}
          <div className="slider-wrapper">
            <input
              type="range"
              min={0}
              max={parsedChoices.length - 1}
              step={1}
              value={safeIndex}
              onChange={handleSliderChange}
              className="optimum-range-slider"
              style={{
                background: `linear-gradient(to right, #020032 0%, #020032 ${sliderPercent}%, #E2E8F0 ${sliderPercent}%, #E2E8F0 100%)`
              }}
              aria-label="Select Handrail Length in Feet"
            />
            <div className="slider-endpoints">
              <span className="endpoint-text">
                {parsedChoices[0]?.parsed?.feetDisplay || '1 ft'} (12")
              </span>
              <span className="endpoint-current">
                {currentChoice?.parsed?.feetDisplay || `${currentVal} ft`}
              </span>
              <span className="endpoint-text">
                {parsedChoices[parsedChoices.length - 1]?.parsed?.feetDisplay || '24 ft'} (288")
              </span>
            </div>
          </div>

          {/* Quick Popular Lengths Pills */}
          {popularPills.length > 0 && (
            <div className="quick-lengths-section">
              <span className="quick-label">
                {language === 'en' ? 'Standard Runs:' : 'Medidas Estándar:'}
              </span>
              <div className="quick-pills-row">
                {popularPills.map((pill) => {
                  const isSelected = pill.description === currentVal;
                  return (
                    <button
                      key={pill.value || pill.description}
                      type="button"
                      className={`length-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => onSelect(opt.name, pill.description)}
                    >
                      <span className="pill-feet">{pill.parsed.feet} ft</span>
                      <span className="pill-inches">({pill.parsed.inches}")</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper / Dropdown for fine-tuning */}
          <div className="fine-tuning-row">
            <span className="fine-label">
              {language === 'en' ? 'Fine increment:' : 'Incremento fino:'}
            </span>
            <select
              value={currentVal}
              onChange={(e) => onSelect(opt.name, e.target.value)}
              className="fine-step-select"
            >
              {parsedChoices.map((c) => (
                <option key={c.value || c.description} value={c.description}>
                  {c.parsed.fullLabel || `${c.description} ft`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        /* Length ranges like Rust-Resistance Add-on (1'-6', 7'-12', etc.) or Tube Lengths */
        <div className="range-pills-grid">
          {parsedChoices.map((choice) => {
            const isSelected = choice.description === currentVal;
            const parsed = choice.parsed;

            return (
              <button
                key={choice.value || choice.description}
                type="button"
                className={`range-card-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelect(opt.name, choice.description)}
              >
                <div className="range-card-header">
                  <span className="range-feet">
                    {parsed.isRange 
                      ? parsed.labelFt 
                      : parsed.isTube 
                        ? parsed.shortLabel 
                        : choice.description}
                  </span>
                  {isSelected && <Check size={14} className="check-dot" />}
                </div>
                {parsed.isRange && (
                  <span className="range-inches">{parsed.labelIn} coverage</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Optimum Rails Style: "Need a custom length?" button */}
      <div className="custom-length-drawer-box">
        <button
          type="button"
          className="need-custom-btn"
          onClick={() => setShowCustomCut((prev) => !prev)}
        >
          <Scissors size={14} />
          <span>
            {language === 'en' ? 'Need a custom length?' : '¿Necesitas una medida exacta?'}
          </span>
          <ChevronRight size={14} className={`btn-chevron ${showCustomCut ? 'rotate' : ''}`} />
        </button>

        <AnimatePresence>
          {showCustomCut && (
            <motion.div
              className="custom-cut-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="custom-cut-explainer">
                {language === 'en'
                  ? 'We cut all metal handrails in our workshop down to your exact 1/16" fraction at no extra charge. Select the closest standard length above, then enter your exact inch cut below:'
                  : 'Cortamos todos los pasamanos a la fracción exacta de 1/16" sin costo adicional. Selecciona la medida en pies superior más cercana y escribe tu corte exacto:'}
              </p>
              <div className="custom-cut-input-row">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'e.g. 45 3/8" or 115.5 cm' : 'ej. 45 3/8" o 115.5 cm'}
                  value={customInches}
                  onChange={(e) => setCustomInches(e.target.value)}
                  className="custom-inches-input"
                />
                <button
                  type="button"
                  className="btn btn-secondary save-cut-btn"
                  onClick={() => {
                    if (customInches.trim()) {
                      setSavedCut(customInches.trim());
                    }
                  }}
                >
                  {language === 'en' ? 'Save Cut' : 'Guardar'}
                </button>
              </div>
              {savedCut && (
                <div className="saved-cut-notice">
                  <Check size={14} className="text-accent" />
                  <span>
                    {language === 'en' 
                      ? `Custom cut saved: ${savedCut} (Will be applied during crate fabrication)`
                      : `Medida exacta guardada: ${savedCut} (Se aplicará en la fabricación)`}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

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
                  const optNameLower = opt.name.toLowerCase();

                  // 1. Is this a Finish / Color option? -> Render Color Dropdown
                  const isFinish = /finish|color|acabado|pintura/i.test(optNameLower);

                  // 2. Is this a Length / Feet option? -> Render Feet & Inches Length Selector
                  const isLength = /length|longitud|amount|pies|feet|medida|tube/i.test(optNameLower) ||
                    (opt.choices && opt.choices.some(c => /ft|'|"|length|inches/i.test(c.description) || !isNaN(parseFloat(c.description))));

                  if (isFinish) {
                    return (
                      <FinishDropdown
                        key={opt.name}
                        opt={opt}
                        currentVal={currentVal}
                        onSelect={handleOptionChange}
                        language={language}
                      />
                    );
                  }

                  if (isLength) {
                    return (
                      <HandrailLengthSelector
                        key={opt.name}
                        opt={opt}
                        currentVal={currentVal}
                        onSelect={handleOptionChange}
                        language={language}
                      />
                    );
                  }

                  // Standard pills for other options (e.g. Plate Cover Size)
                  return (
                    <div key={opt.name} className="option-field-group">
                      <div className="option-label-row">
                        <label className="option-title">{opt.name.replace(/:+$/, '')}</label>
                        <span className="option-selected-val">{currentVal}</span>
                      </div>
                      <div className="option-pills-row">
                        {opt.choices?.map((choice) => {
                          const isSelected = currentVal === choice.description;
                          return (
                            <button
                              key={choice.value || choice.description}
                              type="button"
                              className={`option-pill ${isSelected ? 'active' : ''}`}
                              onClick={() => handleOptionChange(opt.name, choice.description)}
                            >
                              <span>{choice.description}</span>
                            </button>
                          );
                        })}
                      </div>
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

            {/* Optimum Rails Style: "Need to customize this product?" Order Card */}
            <div className="need-custom-order-box glass-panel">
              <div className="custom-order-content">
                <div className="custom-order-icon-box">
                  <Sparkles size={18} className="text-accent" />
                </div>
                <div className="custom-order-text">
                  <h4 className="custom-order-title">
                    {language === 'en' ? 'Need to customize this product?' : '¿Necesitas personalizar este producto?'}
                  </h4>
                  <p className="custom-order-desc">
                    {language === 'en'
                      ? 'We fabricate custom rake angles, stair wall returns, core-drill posts, and custom powder coat colors.'
                      : 'Fabricamos ángulos especiales, retornos a pared, postes para anclaje químico y colores de pintura a medida.'}
                  </p>
                </div>
              </div>
              <a href="#quote" className="btn btn-secondary custom-order-action-btn">
                <span>{language === 'en' ? 'Request Custom Order' : 'Solicitar Cotización a Medida'}</span>
                <ArrowRight size={14} />
              </a>
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
          gap: 20px;
          padding: 18px 0;
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
          gap: 12px;
          margin-bottom: 6px;
        }

        .option-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--color-text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .option-icon {
          color: var(--color-accent);
        }

        .option-selected-val {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.76rem;
          color: var(--color-text-primary);
          font-weight: 700;
        }

        .swatch-mini {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.2);
          display: inline-block;
        }

        /* 1. FINISH DROPDOWN (Desplegable de Colores) */
        .finish-dropdown-container {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .custom-finish-dropdown {
          position: relative;
          width: 100%;
        }

        .finish-dropdown-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .finish-dropdown-trigger:hover,
        .finish-dropdown-trigger.open {
          border-color: var(--color-text-primary);
          box-shadow: 0 4px 12px rgba(2, 0, 50, 0.06);
        }

        .trigger-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .finish-swatch-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 5px rgba(0,0,0,0.15);
        }

        .trigger-text {
          display: flex;
          flex-direction: column;
        }

        .trigger-title {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .trigger-sheen {
          font-size: 0.72rem;
          color: var(--color-text-secondary);
        }

        .chevron-indicator {
          color: var(--color-text-secondary);
          transition: transform 0.2s ease;
        }

        .chevron-indicator.rotate {
          transform: rotate(180deg);
        }

        .finish-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(2, 0, 50, 0.14);
          z-index: 100;
          overflow: hidden;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .finish-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
        }

        .finish-menu-item:hover {
          background: #F1F5F9;
        }

        .finish-menu-item.active {
          background: #EEF2F6;
        }

        .menu-swatch-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15);
        }

        .menu-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .menu-item-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .menu-item-title {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .menu-item-sub {
          font-size: 0.7rem;
          color: var(--color-text-secondary);
        }

        .active-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: var(--color-text-primary);
          color: #FFF;
          border-radius: 50%;
        }

        /* 2. HANDRAIL LENGTH SELECTOR (Feet & Inches) */
        .handrail-length-selector-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .length-badge-display .badge-highlight {
          font-family: monospace;
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--color-accent);
          background: rgba(224, 0, 39, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(224, 0, 39, 0.2);
        }

        .sequential-length-controls {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Optimum Rails Style Slider */
        .slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px 4px 4px 4px;
        }

        .optimum-range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
        }

        .optimum-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #020032;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .optimum-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          background: var(--color-accent);
        }

        .optimum-range-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #020032;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          cursor: pointer;
        }

        .slider-endpoints {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace;
          font-size: 0.72rem;
          color: var(--color-text-secondary);
        }

        .endpoint-current {
          font-weight: 800;
          color: var(--color-text-primary);
        }

        /* Quick popular lengths pills */
        .quick-lengths-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quick-label {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
        }

        .quick-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .length-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font-heading);
          font-size: 0.78rem;
        }

        .length-pill:hover {
          border-color: var(--color-text-primary);
        }

        .length-pill.active {
          background: #020032;
          border-color: #020032;
          color: #FFFFFF;
        }

        .length-pill .pill-feet {
          font-weight: 700;
        }

        .length-pill .pill-inches {
          font-size: 0.7rem;
          opacity: 0.8;
          font-family: monospace;
        }

        .fine-tuning-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fine-label {
          font-family: monospace;
          font-size: 0.7rem;
          color: var(--color-text-secondary);
          white-space: nowrap;
        }

        .fine-step-select {
          flex: 1;
          padding: 6px 10px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-family: var(--font-heading);
          font-size: 0.78rem;
          color: var(--color-text-primary);
          outline: none;
          cursor: pointer;
        }

        /* Range Cards (For Rust Resistance Add-on etc) */
        .range-pills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .range-card-btn {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 12px;
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .range-card-btn:hover {
          border-color: var(--color-accent);
        }

        .range-card-btn.active {
          background: #020032;
          border-color: #020032;
          color: #FFFFFF;
        }

        .range-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .range-feet {
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .range-inches {
          font-family: monospace;
          font-size: 0.68rem;
          opacity: 0.75;
        }

        /* "Need a custom length?" drawer */
        .custom-length-drawer-box {
          margin-top: 4px;
        }

        .need-custom-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #F8FAFC;
          border: 1px dashed var(--color-border);
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .need-custom-btn:hover {
          color: var(--color-text-primary);
          border-color: var(--color-text-primary);
        }

        .btn-chevron {
          transition: transform 0.2s ease;
        }

        .btn-chevron.rotate {
          transform: rotate(90deg);
        }

        .custom-cut-panel {
          margin-top: 8px;
          padding: 12px;
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 8px;
        }

        .custom-cut-explainer {
          font-size: 0.74rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .custom-cut-input-row {
          display: flex;
          gap: 8px;
        }

        .custom-inches-input {
          flex: 1;
          padding: 7px 10px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 0.8rem;
          outline: none;
        }

        .custom-inches-input:focus {
          border-color: var(--color-accent);
        }

        .save-cut-btn {
          padding: 6px 12px;
          font-size: 0.76rem;
          border-radius: 6px;
        }

        .saved-cut-notice {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 0.72rem;
          color: var(--color-text-primary);
          font-weight: 600;
        }

        /* 3. "NEED TO CUSTOMIZE THIS PRODUCT?" CARD (Optimum Rails style) */
        .need-custom-order-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          background: rgba(2, 0, 50, 0.02);
          margin-top: 4px;
        }

        .custom-order-content {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .custom-order-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(224, 0, 39, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .custom-order-title {
          font-family: var(--font-heading);
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 2px;
        }

        .custom-order-desc {
          font-size: 0.74rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        .custom-order-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px 14px;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
        }

        /* General option pills */
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
