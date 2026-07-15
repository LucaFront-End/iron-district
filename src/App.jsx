import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkshopShowroom from './components/WorkshopShowroom';
import ProductConfigurator from './components/ProductConfigurator';
import ProcessFlow from './components/ProcessFlow';
import ProductShowcase from './components/ProductShowcase';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import QuoteBuilder from './components/QuoteBuilder';
import Footer from './components/Footer';
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetailPage from './components/ServiceDetailPage';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [activeProductId, setActiveProductId] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash;
      if (!hash && window.location.pathname && window.location.pathname !== '/') {
        hash = '#' + window.location.pathname;
      }
      
      // Normalize hashes that might omit the leading slash
      if (hash && hash.startsWith('#services')) {
        hash = hash.replace('#services', '#/services');
      }
      if (hash && hash.startsWith('#product')) {
        hash = hash.replace('#product', '#/product');
      }
      if (hash && hash.startsWith('#shop')) {
        hash = hash.replace('#shop', '#/shop');
      }
      // Deduplicate double slashes if any (e.g. #//services -> #/services)
      if (hash) {
        hash = hash.replace('#//', '#/');
      }
      
      if (hash === '#/shop') {
        setCurrentView('shop');
        setActiveProductId(null);
      } else if (hash === '#/services') {
        setCurrentView('services');
        setActiveProductId(null);
      } else if (hash.startsWith('#/services/')) {
        const parts = hash.split('/');
        const id = parts[parts.length - 1];
        setCurrentView('service-detail');
        setActiveProductId(id);
      } else if (hash.startsWith('#/product/')) {
        const parts = hash.split('/');
        const id = parts[parts.length - 1];
        setCurrentView('product');
        setActiveProductId(id);
      } else {
        setCurrentView('home');
        setActiveProductId(null);
      }
      window.scrollTo(0, 0);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Navbar currentView={currentView} />
      {currentView === 'shop' ? (
        <ShopPage />
      ) : currentView === 'services' ? (
        <ServicesPage />
      ) : currentView === 'service-detail' ? (
        <ServiceDetailPage serviceId={activeProductId} />
      ) : currentView === 'product' ? (
        <ProductDetailPage productId={activeProductId} />
      ) : (
        <main>
          <Hero />
          <WorkshopShowroom />
          <ProductConfigurator />
          <ProcessFlow />
          <ProductShowcase />
          <BeforeAfterSlider />
          <QuoteBuilder />
        </main>
      )}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
