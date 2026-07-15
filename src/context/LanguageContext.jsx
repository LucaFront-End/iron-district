import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    nav: {
      showroom: 'Showroom',
      configurator: 'Configurator',
      process: 'Our Process',
      projects: 'Projects',
      quoteBtn: 'Get a Quote'
    },
    hero: {
      badge: 'Premium Metal Fabrication',
      title1: 'From Custom Fabrication',
      title2: 'To Ready-to-Install Products.',
      subtitle: 'Built with precision. Designed to last. We transform raw architectural concepts into flawless metal masterpieces for residential and commercial spaces.',
      ctaPrimary: 'Configure Railing',
      ctaSecondary: 'Watch Workshop',
      statUSA: 'Made in USA',
      statUSASub: 'In-house manufacturing',
      statPrecision: '0.01mm Precision',
      statPrecisionSub: 'CNC & laser cutting',
      statWarranty: 'Lifetime Warranty',
      statWarrantySub: 'Powder-coated durability'
    },
    showroom: {
      tag: 'Inside the District',
      title: 'Our Production Hub',
      desc: 'We don’t outsource. From laser cutting to powder coating, every stage of fabrication happens under our roof in Los Angeles, California.',
      laser: 'Laser Cutting',
      laserDesc: 'Ultra-precise fiber optic lasers cutting through heavy steel, aluminum, and stainless plates with clean-cut edges.',
      welding: 'Robotic Welding',
      weldingDesc: 'High-strength structural welding combining automated robot precision with master artisan hand-finishes.',
      coating: 'Powder Coating',
      coatingDesc: 'Electrostatic powder application cured at 400°F, creating a rock-solid, weather-resistant barrier.',
      assembly: 'Final Assembly',
      assemblyDesc: 'Meticulous alignment checks, hardware integration, and quality control inspection before shipping.'
    },
    configurator: {
      tag: 'Interactive Builder',
      title: 'Configure Your Railing',
      desc: 'Design your railing system in real-time. Choose your material, finish, and dimensions for an instant estimate.',
      material: '1. Select Material',
      steel: 'Steel (Heavy Duty)',
      aluminum: 'Aluminum (Rust Proof)',
      stainless: 'Stainless Steel (Premium)',
      finish: '2. Select Finish',
      matteBlack: 'Industrial Matte Black',
      brushedSteel: 'Brushed Satin',
      bronze: 'Oil-Rubbed Bronze',
      mounting: '3. Mounting Style',
      wall: 'Wall Mounted',
      floor: 'Floor / Post Mounted',
      cable: 'Cable Railing System',
      length: '4. System Length',
      priceEst: 'Estimated Price',
      customRequest: 'Request Custom Specs',
      addToCart: 'Order Configured System',
      contactExpert: 'Talk to an Engineer',
      ft: 'ft'
    },
    process: {
      tag: 'Workflow',
      title: 'How We Deliver Excellence',
      desc: 'A seamless 5-step process from initial blueprint to final installation, built to eliminate friction.',
      step1Title: 'Design & Render',
      step1Desc: 'We take your dimensions, run engineering checks, and send a high-fidelity 3D render for approval.',
      step2Title: 'Laser & CNC Cut',
      step2Desc: 'Raw plates are laser-cut and tubes are bent using high-precision CNC machinery.',
      step3Title: 'Artisanal Welds',
      step3Desc: 'TIG and MIG welders join connections seamlessly, grinding joints to an invisible finish.',
      step4Title: 'Powder Coat Protect',
      step4Desc: 'Components are baked in our ovens for ultimate rust-protection and sleek aesthetics.',
      step5Title: 'Deliver & Install',
      step5Desc: 'We ship ready-to-install kits nationwide, or dispatch our crew for professional installation.'
    },
    showcase: {
      tag: 'Signature Catalog',
      title: 'Active Fabrication Batches',
      desc: 'Pre-engineered custom designs currently in fabrication. Select a system to load details or queue slots.',
      loadBtn: 'Configure Model',
      slotsLeft: 'Slots Left in Laser Queue',
      leadTime: 'Est. Lead Time',
      status: 'Batch Status',
      transit: 'Days Transit',
      priority: 'Priority',
      activeQueue: 'LASER QUEUE ACTIVE',
      batchesCount: 'ACTIVE BATCHES: 14',
      avgTime: 'AVG LEAD TIME: 5.2 DAYS',
      queueLoad: 'QUEUE LOAD: 84%'
    },
    beforeAfter: {
      tag: 'Transformations',
      title: 'Before & After',
      desc: 'Drag the slider to see how custom architectural metal transforms raw structures into premium spaces.',
      before: 'BEFORE',
      after: 'AFTER'
    },
    quote: {
      tag: 'Start Your Project',
      title: 'Request a Custom Quote',
      desc: 'Have blueprints, sketches, or custom dimensions? Upload them here and our engineering team will get back to you within 24 hours.',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      projectType: 'Project Type',
      residential: 'Residential',
      commercial: 'Commercial',
      message: 'Project Details & Dimensions',
      messagePlaceholder: 'E.g., I need a custom L-shaped handrail for a outdoor concrete stair. Length is approximately 12ft...',
      upload: 'Drag & drop blueprints, sketches or inspiration photos here, or click to browse',
      uploadSub: 'Supports PDF, DXF, DWG, PNG, JPG (Max 25MB)',
      submit: 'Submit Quote Request',
      sending: 'Submitting Details...',
      success: 'Thank you! Our engineering team is reviewing your blueprints.',
      whatsapp: 'Chat on WhatsApp',
      callUs: 'Call Now: +1 (800) 555-IRON'
    },
    footer: {
      slogan: 'Precision in every detail. Built for modern living.',
      address: '1420 Iron District Way, Los Angeles, CA 90021',
      rights: 'All rights reserved.'
    }
  },
  es: {
    nav: {
      showroom: 'Showroom',
      configurator: 'Configurador',
      process: 'Nuestro Proceso',
      projects: 'Proyectos',
      quoteBtn: 'Cotizar Proyecto'
    },
    hero: {
      badge: 'Fabricación Metálica Premium',
      title1: 'De Fabricación a Medida',
      title2: 'A Productos Listos para Instalar.',
      subtitle: 'Construido con precisión. Diseñado para durar. Transformamos conceptos arquitectónicos en piezas metálicas impecables para espacios residenciales y comerciales.',
      ctaPrimary: 'Configurar Barandal',
      ctaSecondary: 'Ver Taller',
      statUSA: 'Hecho en EE. UU.',
      statUSASub: 'Fabricación en taller propio',
      statPrecision: 'Precisión de 0.01mm',
      statPrecisionSub: 'Corte CNC y láser',
      statWarranty: 'Garantía de por Vida',
      statWarrantySub: 'Acabado en polvo horneado'
    },
    showroom: {
      tag: 'Dentro del Distrito',
      title: 'Nuestro Centro de Producción',
      desc: 'No subcontratamos. Desde el corte láser hasta el recubrimiento en polvo, cada etapa de la fabricación ocurre bajo nuestro techo en Los Ángeles, California.',
      laser: 'Corte Láser',
      laserDesc: 'Láseres de fibra óptica ultra precisos que cortan placas gruesas de acero, aluminio y acero inoxidable con bordes limpios.',
      welding: 'Soldadura Robótica',
      weldingDesc: 'Soldadura estructural de alta resistencia que combina la precisión de robots automatizados con acabados artesanales a mano.',
      coating: 'Pintura en Polvo',
      coatingDesc: 'Aplicación electrostática de pintura en polvo curada a 200°C (400°F), creando una barrera sólida y resistente al clima.',
      assembly: 'Ensamble Final',
      assemblyDesc: 'Meticulosas pruebas de alineación, integración de herrajes y control de calidad antes del envío.'
    },
    configurator: {
      tag: 'Constructor Interactivo',
      title: 'Configura tu Barandal',
      desc: 'Diseña tu sistema de barandal en tiempo real. Selecciona materiales, acabados y medidas para obtener un presupuesto instantáneo.',
      material: '1. Selecciona Material',
      steel: 'Acero (Máxima Resistencia)',
      aluminum: 'Aluminio (Antioxidante)',
      stainless: 'Acero Inoxidable (Premium)',
      finish: '2. Selecciona Acabado',
      matteBlack: 'Negro Mate Industrial',
      brushedSteel: 'Satín Cepillado',
      bronze: 'Bronce Pulido con Aceite',
      mounting: '3. Tipo de Montaje',
      wall: 'Montado a Muro',
      floor: 'Montado a Piso (Postes)',
      cable: 'Sistema de Barandal de Cable',
      length: '4. Longitud del Sistema',
      priceEst: 'Precio Estimado',
      customRequest: 'Solicitar Especificaciones Especiales',
      addToCart: 'Comprar Sistema Configurado',
      contactExpert: 'Hablar con un Ingeniero',
      ft: 'pies'
    },
    process: {
      tag: 'Flujo de Trabajo',
      title: 'Cómo Entregamos la Excelencia',
      desc: 'Un proceso continuo de 5 pasos desde el plano inicial hasta la instalación final, diseñado para eliminar fricciones.',
      step1Title: 'Diseño y Render',
      step1Desc: 'Tomamos tus medidas, realizamos análisis de ingeniería y te enviamos un render 3D de alta fidelidad para aprobación.',
      step2Title: 'Corte Láser y CNC',
      step2Desc: 'Las placas se cortan con láser y los tubos se doblan en maquinaria CNC de alta precisión.',
      step3Title: 'Soldaduras Artesanales',
      step3Desc: 'Soldadores TIG y MIG unen las conexiones limpiamente, puliendo las juntas para un acabado invisible.',
      step4Title: 'Pintura y Horno',
      step4Desc: 'Las piezas se hornean para ofrecer la máxima protección contra la corrosión y una estética impecable.',
      step5Title: 'Envío e Instalación',
      step5Desc: 'Enviamos kits listos para instalar a todo el país o enviamos a nuestro equipo para instalación profesional.'
    },
    showcase: {
      tag: 'Catálogo de Firma',
      title: 'Lotes de Fabricación Activos',
      desc: 'Diseños de barandal insignia actualmente en fabricación en nuestro taller. Selecciona un modelo para cargar en el configurador o apartar cupos.',
      loadBtn: 'Configurar Modelo',
      slotsLeft: 'Cupos libres en Cola de Corte',
      leadTime: 'Tiempo estimado',
      status: 'Estado del lote',
      transit: 'Días de envío',
      priority: 'Prioridad',
      activeQueue: 'COLA LÁSER ACTIVA',
      batchesCount: 'LOTES ACTIVOS: 14',
      avgTime: 'TIEMPO PROM: 5.2 DÍAS',
      queueLoad: 'CARGA DE COLA: 84%'
    },
    beforeAfter: {
      tag: 'Transformaciones',
      title: 'Antes y Después',
      desc: 'Arrastra el control deslizante para ver cómo el metal arquitectónico personalizado transforma estructuras básicas en espacios de lujo.',
      before: 'ANTES',
      after: 'DESPUÉS'
    },
    quote: {
      tag: 'Inicia tu Proyecto',
      title: 'Solicita una Cotización Especial',
      desc: '¿Tienes planos, bocetos o medidas personalizadas? Súbelos aquí y nuestro equipo de ingeniería te responderá en menos de 24 horas.',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      projectType: 'Tipo de Proyecto',
      residential: 'Residencial',
      commercial: 'Comercial',
      message: 'Detalles del Proyecto y Dimensiones',
      messagePlaceholder: 'Ej. Necesito un barandal a medida en forma de L para una escalera exterior de concreto. La longitud aproximada es de 12 pies...',
      upload: 'Arrastra y suelta tus planos, bocetos o fotos aquí, o haz clic para buscar',
      uploadSub: 'Formatos soportados: PDF, DXF, DWG, PNG, JPG (Máx 25MB)',
      submit: 'Enviar Solicitud de Cotización',
      sending: 'Enviando detalles...',
      success: '¡Gracias! Nuestro equipo de ingeniería está revisando tus planos.',
      whatsapp: 'Chatear por WhatsApp',
      callUs: 'Llámanos: +1 (800) 555-IRON'
    },
    footer: {
      slogan: 'Precisión en cada detalle. Construido para la vida moderna.',
      address: '1420 Iron District Way, Los Ángeles, CA 90021',
      rights: 'Todos los derechos reservados.'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[language];
    for (const key of keys) {
      if (!value || !value[key]) return path;
      value = value[key];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
