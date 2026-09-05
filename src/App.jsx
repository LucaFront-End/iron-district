import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { WixProvider } from './context/WixContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Hero from './components/Hero';
import ProcessFlow from './components/ProcessFlow';
import ProductShowcase from './components/ProductShowcase';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import QuoteBuilder from './components/QuoteBuilder';
import Footer from './components/Footer';
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import AboutPage from './components/AboutPage';
import CommunityPage from './components/CommunityPage';
import ContactPage from './components/ContactPage';
import HomeServices from './components/HomeServices';
import HomeGallery from './components/HomeGallery';
import HomeReviews from './components/HomeReviews';
import CmsDashboard from './components/CmsDashboard';
import { updateMetaTags } from './services/seoConfig';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [activeProductId, setActiveProductId] = useState(null);

  // Sync SEO Title & Meta Description on every route transition
  useEffect(() => {
    if (currentView === 'service-detail' && activeProductId) {
      updateMetaTags(`services/${activeProductId}`);
    } else if (currentView === 'shop') {
      updateMetaTags('shop');
    } else if (currentView === 'services') {
      updateMetaTags('services');
    } else if (currentView === 'community') {
      updateMetaTags('community');
    } else if (currentView === 'about') {
      updateMetaTags('about');
    } else if (currentView === 'contact') {
      updateMetaTags('contact');
    } else if (currentView === 'cms') {
      updateMetaTags('cms');
    } else if (currentView === 'home') {
      updateMetaTags('home');
    }
  }, [currentView, activeProductId]);

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
      if (hash && hash.startsWith('#about')) {
        hash = hash.replace('#about', '#/about');
      }
      if (hash && hash.startsWith('#community')) {
        hash = hash.replace('#community', '#/community');
      }
      if (hash && hash.startsWith('#contact')) {
        hash = hash.replace('#contact', '#/contact');
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
        const id = decodeURIComponent(hash.replace('#/product/', ''));
        setCurrentView('product');
        setActiveProductId(id);
      } else if (hash === '#/about') {
        setCurrentView('about');
        setActiveProductId(null);
      } else if (hash === '#/community') {
        setCurrentView('community');
        setActiveProductId(null);
      } else if (hash === '#/contact') {
        setCurrentView('contact');
        setActiveProductId(null);
      } else if (hash === '#/cms' || hash === '#/admin') {
        setCurrentView('cms');
        setActiveProductId(null);
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

  if (currentView === 'cms') {
    return <CmsDashboard />;
  }

  return (
    <>
      <Navbar currentView={currentView} />
      <CartDrawer />
      {currentView === 'shop' ? (
        <ShopPage />
      ) : currentView === 'services' ? (
        <ServicesPage />
      ) : currentView === 'service-detail' ? (
        <ServiceDetailPage serviceId={activeProductId} />
      ) : currentView === 'product' ? (
        <ProductDetailPage productId={activeProductId} />
      ) : currentView === 'about' ? (
        <AboutPage />
      ) : currentView === 'community' ? (
        <CommunityPage />
      ) : currentView === 'contact' ? (
        <ContactPage />
      ) : (
        <main>
          <Hero />
          <HomeServices />
          <ProcessFlow />
          <HomeGallery />
          <ProductShowcase />
          <BeforeAfterSlider />
          <HomeReviews />
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
      <WixProvider>
        <AppContent />
      </WixProvider>
    </LanguageProvider>
  );
}

