import React, { useMemo } from 'react';
import { 
  CheckCircle2, Package, Wrench, ShieldCheck, AlertCircle, 
  Building2, Home, Palette, Ruler, FileCheck, Sparkles, 
  Layers, ChevronRight, Info, Check, HelpCircle, HardHat, Compass
} from 'lucide-react';

/**
 * Decodes standard HTML entities commonly found in Wix rich text
 */
function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®');
}

/**
 * Strips HTML tags and normalizes whitespace
 */
function stripHtmlTags(str) {
  if (!str) return '';
  return decodeHtmlEntities(str)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses raw Wix product description into structured, high-end sections
 */
function parseProductDescription(rawHtml) {
  if (!rawHtml) return { type: 'empty' };

  // Check if standard <h2> tags exist
  const hasH2 = /<h2>/i.test(rawHtml);
  if (!hasH2) {
    return { type: 'simple_html', rawHtml: decodeHtmlEntities(rawHtml) };
  }

  const parts = rawHtml.split(/<h2>(.*?)<\/h2>/i);
  const introRaw = parts[0] ? parts[0].trim() : '';

  // Extract intro paragraphs
  const introParagraphs = [...introRaw.matchAll(/<p>([\s\S]*?)<\/p>/gi)]
    .map(m => stripHtmlTags(m[1]))
    .filter(Boolean);

  const sections = [];
  for (let i = 1; i < parts.length; i += 2) {
    const rawTitle = parts[i] || '';
    const titleClean = stripHtmlTags(rawTitle);
    const contentHtml = parts[i + 1] || '';

    // Extract bullet list items
    const listMatches = [...contentHtml.matchAll(/<li>([\s\S]*?)<\/li>/gi)];
    const listItems = listMatches.map(m => stripHtmlTags(m[1])).filter(Boolean);

    // Extract standalone paragraphs and key-value pairs (excluding content inside lists)
    const contentWithoutLists = contentHtml
      .replace(/<ul[\s\S]*?<\/ul>/gi, ' ')
      .replace(/<ol[\s\S]*?<\/ol>/gi, ' ');
    const pMatches = [...contentWithoutLists.matchAll(/<p>([\s\S]*?)<\/p>/gi)];
    const kvPairs = [];
    const paragraphs = [];

    for (const p of pMatches) {
      const text = stripHtmlTags(p[1]);
      if (!text) continue;

      const colonIdx = text.indexOf(':');
      if (colonIdx > 0 && colonIdx < 40 && !text.includes('http') && !text.includes('www')) {
        const val = text.slice(colonIdx + 1).trim();
        if (val) {
          kvPairs.push({
            label: text.slice(0, colonIdx).trim(),
            value: val
          });
          continue;
        }
      }
      paragraphs.push(text);
    }

    // Determine category based on title (bracket MUST be evaluated before included)
    const tLower = titleClean.toLowerCase();
    let category = 'general';
    if (tLower.includes('bracket') || tLower.includes('soporte')) category = 'brackets';
    else if (tLower.includes('feature') || tLower.includes('característica')) category = 'features';
    else if (tLower.includes('included') || tLower.includes('incluye') || tLower.includes('what')) category = 'included';
    else if (tLower.includes('specification') || tLower.includes('especificaci')) category = 'specs';
    else if (tLower.includes('finish') || tLower.includes('acabado') || tLower.includes('matte black')) category = 'finish';
    else if (tLower.includes('application') || tLower.includes('aplicaci')) category = 'applications';
    else if (tLower.includes('compliance') || tLower.includes('installation') || tLower.includes('instalaci')) category = 'compliance';
    else if (tLower.includes('custom length') || tLower.includes('medida')) category = 'custom_lengths';
    else if (tLower.includes('why choose') || tLower.includes('por qué')) category = 'why_choose';

    sections.push({
      title: titleClean,
      category,
      listItems,
      kvPairs,
      paragraphs,
      rawContent: decodeHtmlEntities(contentHtml)
    });
  }

  return {
    type: 'structured',
    introParagraphs,
    sections
  };
}

export default function ProductRichDescription({ product, sku, language = 'es' }) {
  const isEn = language === 'en';

  const parsed = useMemo(() => {
    return parseProductDescription(product?.description);
  }, [product?.description]);

  // If empty or plain simple HTML
  if (parsed.type === 'empty') {
    return (
      <div className="empty-desc-box">
        <p>{isEn ? 'No extended description available for this item.' : 'No hay descripción extendida disponible para este artículo.'}</p>
      </div>
    );
  }

  if (parsed.type === 'simple_html') {
    return (
      <div className="simple-rich-content glass-card">
        <div 
          className="rich-html-flow"
          dangerouslySetInnerHTML={{ __html: parsed.rawHtml }} 
        />
      </div>
    );
  }

  // Find specific section categories
  const { introParagraphs, sections } = parsed;
  const featuresSection = sections.find(s => s.category === 'features');
  const includedSection = sections.find(s => s.category === 'included');
  const specsSection = sections.find(s => s.category === 'specs');
  const bracketsSection = sections.find(s => s.category === 'brackets');
  const finishSection = sections.find(s => s.category === 'finish');
  const applicationsSection = sections.find(s => s.category === 'applications');
  const complianceSection = sections.find(s => s.category === 'compliance');
  const whyChooseSection = sections.find(s => s.category === 'why_choose');
  const customLengthsSection = sections.find(s => s.category === 'custom_lengths');

  // Any other uncategorized sections
  const otherSections = sections.filter(s => 
    !['features', 'included', 'specs', 'brackets', 'finish', 'applications', 'compliance', 'why_choose', 'custom_lengths'].includes(s.category)
  );

  return (
    <div className="product-rich-description-wrapper">
      
      {/* 1. INTRO ARCHITECTURAL OVERVIEW */}
      {introParagraphs && introParagraphs.length > 0 && (
        <div className="desc-card intro-blueprint-card glass-panel">
          <div className="blueprint-tag">
            <Compass size={13} className="text-accent" />
            <span>{isEn ? 'ARCHITECTURAL PROFILE DOSSIER' : 'EXPEDIENTE TÉCNICO ARQUITECTÓNICO'}</span>
          </div>

          {/* Subtitle / headline if first paragraph is short and punchy */}
          {introParagraphs[0] && (
            <h4 className="intro-main-title">
              {introParagraphs[0]}
            </h4>
          )}

          <div className="intro-body-text">
            {introParagraphs.slice(1).map((para, idx) => (
              <p key={idx} className="intro-para">{para}</p>
            ))}
          </div>

          {/* Quick Pillar Badges */}
          <div className="quick-pill-strip">
            <span className="quick-pill">
              <ShieldCheck size={14} className="text-accent" />
              <span>{isEn ? '16-Gauge Structural Steel' : 'Acero Estructural Cal. 16'}</span>
            </span>
            <span className="quick-pill">
              <Package size={14} className="text-accent" />
              <span>{isEn ? 'Mounting Hardware Included' : 'Herrajes de Fijación Incluidos'}</span>
            </span>
            <span className="quick-pill">
              <FileCheck size={14} className="text-accent" />
              <span>{isEn ? 'ADA & IBC Code Compliant' : 'Conforme Normativa ADA e IBC'}</span>
            </span>
            <span className="quick-pill">
              <Sparkles size={14} className="text-accent" />
              <span>{isEn ? 'Electrostatic Matte Black' : 'Negro Mate Electrostático'}</span>
            </span>
          </div>
        </div>
      )}

      {/* 2. SPECIFICATIONS TECHNICAL BLUEPRINT GRID */}
      {specsSection && specsSection.kvPairs.length > 0 && (
        <div className="desc-card specs-blueprint-card glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <Layers size={17} className="text-accent" />
              <h3>{isEn ? 'Engineered Product Specifications' : 'Especificaciones Técnicas del Producto'}</h3>
            </div>
            <span className="spec-sku-badge">SKU: {sku || 'SMW-501'}</span>
          </div>

          <div className="technical-specs-grid">
            {specsSection.kvPairs.map((pair, idx) => (
              <div key={idx} className="tech-spec-item">
                <span className="tech-spec-label">{pair.label}</span>
                <span className="tech-spec-value">{pair.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TWO-COLUMN SPLIT: WHAT'S INCLUDED & BRACKET ALLOCATION GUIDE */}
      <div className="desc-split-grid">
        
        {/* WHAT'S INCLUDED IN THE BOX */}
        {includedSection && (
          <div className="desc-card included-hardware-card glass-panel">
            <div className="section-title-strip">
              <div className="title-with-icon">
                <Package size={17} className="text-accent" />
                <h3>{isEn ? "What's Included in the Box" : 'Contenido del Kit de Instalación'}</h3>
              </div>
            </div>

            {includedSection.paragraphs.length > 0 && (
              <p className="card-sub-lead">{includedSection.paragraphs[0]}</p>
            )}

            {includedSection.listItems.length > 0 && (
              <ul className="included-checklist">
                {includedSection.listItems.map((item, idx) => (
                  <li key={idx} className="included-item">
                    <div className="check-bullet">
                      <Check size={13} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Masonry / Concrete Warning Note */}
            {includedSection.paragraphs.slice(1).map((note, idx) => (
              <div key={idx} className="masonry-notice-box">
                <AlertCircle size={16} className="notice-icon" />
                <p>{note}</p>
              </div>
            ))}
          </div>
        )}

        {/* BRACKET DISTRIBUTION GUIDE */}
        {bracketsSection && (
          <div className="desc-card brackets-allocation-card glass-panel">
            <div className="section-title-strip">
              <div className="title-with-icon">
                <Ruler size={17} className="text-accent" />
                <h3>{isEn ? 'Bracket Spacing & Allocation Guide' : 'Distribución de Soportes por Medida'}</h3>
              </div>
            </div>

            {bracketsSection.paragraphs.length > 0 && (
              <p className="card-sub-lead">{bracketsSection.paragraphs[0]}</p>
            )}

            {bracketsSection.kvPairs.length > 0 && (
              <div className="brackets-table-strip">
                <div className="bracket-table-header">
                  <span>{isEn ? 'Handrail Span / Length' : 'Longitud del Pasamano'}</span>
                  <span>{isEn ? 'Mounting Brackets' : 'Soportes Incluidos'}</span>
                </div>
                {bracketsSection.kvPairs.map((pair, idx) => (
                  <div key={idx} className="bracket-table-row">
                    <span className="bracket-range">{pair.label}</span>
                    <span className="bracket-count-badge">{pair.value}</span>
                  </div>
                ))}
              </div>
            )}

            {bracketsSection.paragraphs.length > 1 && (
              <div className="bracket-delivery-note">
                <Info size={14} className="text-accent" />
                <span>{bracketsSection.paragraphs[bracketsSection.paragraphs.length - 1]}</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 4. KEY ENGINEERED FEATURES */}
      {featuresSection && featuresSection.listItems.length > 0 && (
        <div className="desc-card features-showcase-card glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <CheckCircle2 size={17} className="text-accent" />
              <h3>{isEn ? 'Engineered Features & Build Standards' : 'Características Clave de Fabricación'}</h3>
            </div>
            <span className="badge-counter">{featuresSection.listItems.length} {isEn ? 'Specifications' : 'Puntos Clave'}</span>
          </div>

          <div className="features-smart-grid">
            {featuresSection.listItems.map((feat, idx) => (
              <div key={idx} className="feature-smart-cell">
                <div className="feature-icon-wrapper">
                  <Check size={14} className="text-accent" />
                </div>
                <span className="feature-text">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FINISH & ARCHITECTURAL PAIRINGS */}
      {finishSection && (
        <div className="desc-card finish-architectural-card glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <Palette size={17} className="text-accent" />
              <h3>{isEn ? 'Architectural Surface Finish & Aesthetic Pairing' : 'Acabado Superficial y Armonía Material'}</h3>
            </div>
          </div>

          <div className="finish-content-layout">
            <div className="finish-swatch-box">
              <div className="swatch-sample"></div>
              <span className="swatch-tag">{isEn ? 'Matte Black 10% Sheen' : 'Negro Mate Satinado 10%'}</span>
            </div>
            <div className="finish-text-body">
              {finishSection.paragraphs.map((para, idx) => (
                <p key={idx} className="finish-para">{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. IDEAL ARCHITECTURAL APPLICATIONS */}
      {applicationsSection && (
        <div className="desc-card applications-card glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <Building2 size={17} className="text-accent" />
              <h3>{isEn ? 'Recommended Architectural Applications' : 'Aplicaciones y Entornos Recomendados'}</h3>
            </div>
          </div>

          {applicationsSection.paragraphs.length > 0 && (
            <p className="card-sub-lead">{applicationsSection.paragraphs[0]}</p>
          )}

          {applicationsSection.listItems.length > 0 && (
            <div className="applications-tag-cloud">
              {applicationsSection.listItems.map((app, idx) => (
                <div key={idx} className="application-chip">
                  <Building2 size={13} className="text-accent" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. INSTALLATION & CODE COMPLIANCE (ADA / IBC) */}
      {complianceSection && (
        <div className="desc-card compliance-advisory-card glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <ShieldCheck size={18} className="text-accent" />
              <h3>{isEn ? 'Installation & ADA / IBC Code Compliance' : 'Instalación y Cumplimiento Normativo (ADA / IBC)'}</h3>
            </div>
            <span className="compliance-stamp">{isEn ? 'CODE COMPLIANT' : 'CONFORME A NORMA'}</span>
          </div>

          <div className="compliance-body-grid">
            <div className="compliance-text-col">
              {complianceSection.paragraphs.map((p, idx) => (
                <p key={idx} className="compliance-para">{p}</p>
              ))}
            </div>
            <div className="compliance-clearance-box">
              <div className="clearance-stat">
                <span className="stat-num">1.5"</span>
                <span className="stat-desc">{isEn ? 'Wall Clearance Space' : 'Espacio Libre a Muro'}</span>
              </div>
              <div className="clearance-stat">
                <span className="stat-num">3.5"</span>
                <span className="stat-desc">{isEn ? 'Total Wall Projection' : 'Proyección Total a Muro'}</span>
              </div>
              <div className="clearance-note">
                <FileCheck size={14} className="text-accent" />
                <span>{isEn ? 'Meets International Building Code (IBC) guidelines' : 'Cumple requerimientos del Código Internacional de Edificación (IBC)'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CUSTOM LENGTHS NOTICE */}
      {customLengthsSection && (
        <div className="desc-card custom-lengths-card glass-panel">
          <div className="custom-lengths-content">
            <div className="lengths-icon-box">
              <Ruler size={24} className="text-accent" />
            </div>
            <div className="lengths-text-box">
              <h4>{isEn ? 'Custom Sizing & Precision Cuts' : 'Cortes de Precisión y Longitudes Especiales'}</h4>
              {customLengthsSection.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. WHY CHOOSE STATION METALWORKS (TRUST PILLARS) */}
      {whyChooseSection && (
        <div className="desc-card why-choose-card glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <Sparkles size={17} className="text-accent" />
              <h3>{isEn ? 'Why Choose Station Metalworks?' : 'Por Qué Elegir Station Metalworks'}</h3>
            </div>
          </div>

          {whyChooseSection.paragraphs.length > 0 && (
            <p className="card-sub-lead">{whyChooseSection.paragraphs[0]}</p>
          )}

          {whyChooseSection.listItems.length > 0 && (
            <div className="why-choose-pillars-grid">
              {whyChooseSection.listItems.map((item, idx) => (
                <div key={idx} className="pillar-cell">
                  <span className="pillar-text">{item}</span>
                </div>
              ))}
            </div>
          )}

          {whyChooseSection.paragraphs.length > 1 && (
            <div className="taller-nationwide-footer">
              <ShieldCheck size={16} className="text-accent" />
              <span>{whyChooseSection.paragraphs[whyChooseSection.paragraphs.length - 1]}</span>
            </div>
          )}
        </div>
      )}

      {/* 10. ANY OTHER SECTIONS (FALLBACK) */}
      {otherSections.map((sec, sIdx) => (
        <div key={sIdx} className="desc-card generic-section-card glass-panel">
          <div className="section-title-strip">
            <h3>{sec.title}</h3>
          </div>
          {sec.paragraphs.map((p, pIdx) => (
            <p key={pIdx} className="generic-para">{p}</p>
          ))}
          {sec.listItems.length > 0 && (
            <ul className="generic-list">
              {sec.listItems.map((li, lIdx) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* 11. WIX ADDITIONAL INFO SECTIONS (Installation Split Heights & Returns) */}
      {product?.additionalInfoSections && product.additionalInfoSections.length > 0 && (
        <div className="desc-card additional-wix-sections glass-panel">
          <div className="section-title-strip">
            <div className="title-with-icon">
              <Info size={17} className="text-accent" />
              <h3>{isEn ? 'Additional Technical Rules & Factory Policies' : 'Reglas Constructivas y Políticas de Fábrica'}</h3>
            </div>
          </div>

          <div className="additional-sections-accordion">
            {product.additionalInfoSections.map((info, idx) => (
              <div key={idx} className="info-accordion-item">
                <h4 className="info-accordion-title">
                  <ChevronRight size={14} className="text-accent" />
                  <span>{info.title}</span>
                </h4>
                <div 
                  className="info-accordion-body"
                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(info.description) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .product-rich-description-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 12px;
          color: var(--color-text-primary);
        }

        .desc-card {
          padding: 28px 32px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }

        .section-title-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .title-with-icon h3 {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .badge-counter {
          font-family: monospace;
          font-size: 0.75rem;
          padding: 3px 8px;
          background: rgba(184, 51, 42, 0.08);
          color: #B8332A;
          border-radius: 4px;
          font-weight: 600;
        }

        .card-sub-lead {
          font-size: 0.95rem;
          color: #475569;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        /* 1. INTRO BLUEPRINT CARD */
        .intro-blueprint-card {
          border-left: 4px solid #B8332A;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
        }

        .blueprint-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #B8332A;
          background: rgba(184, 51, 42, 0.06);
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 14px;
        }

        .intro-main-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 14px 0;
          line-height: 1.35;
        }

        .intro-body-text {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .intro-para {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #334155;
          margin: 0;
        }

        .quick-pill-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px dashed rgba(0, 0, 0, 0.1);
        }

        .quick-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 6px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 0.8rem;
          font-weight: 600;
          color: #1E293B;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        /* 2. SPECIFICATIONS GRID */
        .spec-sku-badge {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          background: #F1F5F9;
          color: #334155;
          border-radius: 4px;
          border: 1px solid #E2E8F0;
        }

        .technical-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }

        .tech-spec-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 16px;
          background: #F8FAFC;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.2s;
        }

        .tech-spec-item:hover {
          background: #FFFFFF;
          border-color: rgba(184, 51, 42, 0.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .tech-spec-label {
          font-family: monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
          font-weight: 600;
        }

        .tech-spec-value {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0F172A;
        }

        /* 3. SPLIT GRID */
        .desc-split-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
        }

        /* INCLUDED HARDWARE */
        .included-checklist {
          list-style: none;
          padding: 0;
          margin: 0 0 18px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .included-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.9rem;
          color: #1E293B;
          font-weight: 500;
        }

        .check-bullet {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .masonry-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: 8px;
          font-size: 0.82rem;
          color: #92400E;
          line-height: 1.5;
        }

        .notice-icon {
          color: #D97706;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* BRACKET TABLE */
        .brackets-table-strip {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .bracket-table-header {
          display: flex;
          justify-content: space-between;
          padding: 10px 16px;
          background: #F1F5F9;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #475569;
          border-bottom: 1px solid #E2E8F0;
        }

        .bracket-table-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          border-bottom: 1px solid #F1F5F9;
          font-size: 0.88rem;
        }

        .bracket-table-row:last-child {
          border-bottom: none;
        }

        .bracket-range {
          font-weight: 600;
          color: #1E293B;
        }

        .bracket-count-badge {
          font-family: monospace;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 2px 10px;
          background: rgba(184, 51, 42, 0.08);
          color: #B8332A;
          border-radius: 4px;
        }

        .bracket-delivery-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #64748B;
          padding-top: 6px;
        }

        /* 4. FEATURES SMART GRID */
        .features-smart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        .feature-smart-cell {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          background: #F8FAFC;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .feature-icon-wrapper {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .feature-text {
          font-size: 0.88rem;
          color: #1E293B;
          line-height: 1.45;
        }

        /* 5. FINISH CARD */
        .finish-content-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .finish-swatch-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .swatch-sample {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          background: #161618;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .swatch-tag {
          font-family: monospace;
          font-size: 0.7rem;
          color: #475569;
          font-weight: 600;
        }

        .finish-text-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .finish-para {
          font-size: 0.92rem;
          line-height: 1.65;
          color: #334155;
          margin: 0;
        }

        /* 6. APPLICATIONS TAG CLOUD */
        .applications-tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .application-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          transition: all 0.2s;
        }

        .application-chip:hover {
          border-color: #B8332A;
          color: #B8332A;
          background: #FFFFFF;
        }

        /* 7. COMPLIANCE ADVISORY */
        .compliance-stamp {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 4px;
        }

        .compliance-body-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 24px;
          align-items: center;
        }

        .compliance-para {
          font-size: 0.92rem;
          line-height: 1.65;
          color: #334155;
          margin-bottom: 12px;
        }

        .compliance-clearance-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px 20px;
          background: #F8FAFC;
          border: 1px dashed rgba(0, 0, 0, 0.12);
          border-radius: 8px;
        }

        .clearance-stat {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .stat-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: #B8332A;
          line-height: 1;
        }

        .stat-desc {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }

        .clearance-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #64748B;
          border-top: 1px solid rgba(0,0,0,0.06);
          padding-top: 10px;
        }

        /* 8. CUSTOM LENGTHS */
        .custom-lengths-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .lengths-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 10px;
          background: rgba(184, 51, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lengths-text-box h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .lengths-text-box p {
          font-size: 0.9rem;
          color: #475569;
          margin: 0;
          line-height: 1.55;
        }

        /* 9. WHY CHOOSE PILLARS */
        .why-choose-pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .pillar-cell {
          padding: 12px 16px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1E293B;
          display: flex;
          align-items: center;
        }

        .taller-nationwide-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(184, 51, 42, 0.05);
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #B8332A;
        }

        /* 11. WIX ADDITIONAL SECTIONS ACCORDION */
        .additional-sections-accordion {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .info-accordion-item {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
        }

        .info-accordion-title {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #F8FAFC;
          margin: 0;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: #0F172A;
          border-bottom: 1px solid #E2E8F0;
        }

        .info-accordion-body {
          padding: 16px 20px;
          font-size: 0.9rem;
          line-height: 1.65;
          color: #334155;
        }

        .info-accordion-body ul {
          padding-left: 20px;
          margin: 10px 0;
        }

        .info-accordion-body li {
          margin-bottom: 6px;
        }

        .info-accordion-body a {
          color: #B8332A;
          text-decoration: underline;
        }

        /* SIMPLE RICH CONTENT FALLBACK */
        .simple-rich-content {
          padding: 28px;
        }

        .rich-html-flow {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #334155;
        }

        .rich-html-flow h2, 
        .rich-html-flow h3 {
          font-family: var(--font-heading);
          color: #0F172A;
          margin: 24px 0 12px 0;
          font-weight: 700;
        }

        .rich-html-flow p {
          margin-bottom: 14px;
        }

        .rich-html-flow ul {
          padding-left: 24px;
          margin-bottom: 16px;
        }

        .rich-html-flow li {
          margin-bottom: 8px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .desc-card {
            padding: 20px 18px;
          }

          .desc-split-grid {
            grid-template-columns: 1fr;
          }

          .compliance-body-grid {
            grid-template-columns: 1fr;
          }

          .finish-content-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
