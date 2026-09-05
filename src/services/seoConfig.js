/**
 * SEO DE STATION METALWORKS
 * Creado según la especificación del especialista de SEO.
 */

export const SEO_CONFIG = {
  // 1. Home
  home: {
    title: 'Iron Works & Metal Fabrication | Station Metalworks',
    description: 'Station Metalworks specializes in iron works, metal fabrication, steel fabrication, wrought iron, railings, staircases, gates and custom metalwork.'
  },

  // 2. Shop
  shop: {
    title: 'Shop Handrails & Metal Railings | Station Metalworks',
    description: 'Shop premium metal handrails, railing systems and wrought iron products by Station Metalworks. Custom sizes and quality metal fabrication available.'
  },

  // 3. Projects / Community
  community: {
    title: 'Metal Fabrication Projects | Station Metalworks',
    description: 'Explore Station Metalworks projects featuring custom metal fabrication, iron works, steel railings, staircases, gates, fences and wrought iron.'
  },

  // 4. About Us
  about: {
    title: 'About Our Iron Works Company | Station Metalworks',
    description: 'Meet Station Metalworks, specialists in iron works, steel fabrication and custom metal fabrication focused on quality craftsmanship and modern design.'
  },

  // 5. Contact
  contact: {
    title: 'Welder Near Me & Metal Fabrication | Station Metalworks',
    description: 'Looking for a welder near me or custom metal fabrication? Contact Station Metalworks for iron works, steel fabrication, railings and custom projects.'
  },

  // 6. Staircase Systems
  'services/stairs': {
    title: 'Custom Metal Staircase Systems | Station Metalworks',
    description: 'Custom metal staircase systems by Station Metalworks. Expert steel fabrication and iron works for modern residential and commercial staircases.'
  },

  // 7. Railing Systems
  'services/railings': {
    title: 'Custom Metal Railing Systems | Station Metalworks',
    description: 'Custom metal railing systems built with expert steel fabrication and iron works. Station Metalworks creates railings for residential and commercial spaces.'
  },

  // 8. ADA Handrails
  'services/handrails': {
    title: 'ADA Handrails & Metal Railings | Station Metalworks',
    description: 'Explore ADA handrails by Station Metalworks, combining durable steel fabrication, custom metalwork and functional railing solutions for your project.'
  },

  // 9. Gates & Fences
  'services/gates': {
    title: 'Wrought Iron Gates & Fences | Station Metalworks',
    description: 'Custom wrought iron gates and metal fences by Station Metalworks. Durable iron works and steel fabrication for residential and commercial properties.'
  },

  // 10. Custom Fabrication
  'services/custom': {
    title: 'Custom Metal & Steel Fabrication | Station Metalworks',
    description: 'Custom metal fabrication and steel fabrication by Station Metalworks. From wrought iron to one-of-a-kind metalwork, we build solutions for your project.'
  },

  // Hub General de Servicios
  services: {
    title: 'Custom Metal & Steel Fabrication | Station Metalworks',
    description: 'Custom metal fabrication and steel fabrication by Station Metalworks. From wrought iron to one-of-a-kind metalwork, we build solutions for your project.'
  },

  // Panel CMS
  cms: {
    title: 'Workshop CMS // Leads & Pipeline | Station Metalworks',
    description: 'Station Metalworks internal management pipeline.'
  }
};

/**
 * Helper to update page metadata dynamically in document head
 */
export function updateMetaTags(pageKey, customData = null) {
  const seo = customData || SEO_CONFIG[pageKey] || SEO_CONFIG.home;

  // 1. Update title
  document.title = seo.title;

  // 2. Helper to set or create meta tag
  const setMeta = (nameAttr, nameVal, contentVal) => {
    let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, nameVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', contentVal);
  };

  // 3. Set standard description
  setMeta('name', 'description', seo.description);

  // 4. Set OpenGraph tags
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', window.location.href);

  // 5. Set Twitter tags
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);

  // 6. Set or update canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', window.location.href);
}
