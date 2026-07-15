import React from 'react';
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

function AppContent() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WorkshopShowroom />
        <ProductConfigurator />
        <ProcessFlow />
        <ProductShowcase />
        <BeforeAfterSlider />
        <QuoteBuilder />
      </main>
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
