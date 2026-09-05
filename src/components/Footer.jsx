import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Hammer } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img 
              src="/logo.png" 
              alt="Station Metalworks" 
              className="footer-brand-logo" 
            />
          </div>
          <p className="footer-slogan">{t('footer.slogan')}</p>
        </div>

        <div className="footer-mid">
          <div className="footer-contact-details">
            <p className="footer-address">{t('footer.address')}</p>
            <div className="footer-phone-links">
              <a href="tel:+13462349640" className="footer-contact-link">
                📞 (346) 234 96 40
              </a>
              <span className="footer-link-divider">•</span>
              <a href="https://wa.me/13462349640" target="_blank" rel="noreferrer" className="footer-contact-link wa">
                💬 WhatsApp (+1 346 234 9640)
              </a>
            </div>
          </div>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Station Metalworks. {t('footer.rights')}
          </p>
          <a href="#/cms" className="footer-cms-admin-link">
            <span>🔒 {language === 'en' ? 'Workshop CMS // Leads' : 'Panel CMS // Leads de Taller'}</span>
          </a>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: var(--color-bg);
          border-top: 1px solid var(--color-border);
          padding: 60px 0 30px;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
        }

        .footer-brand-logo {
          height: 42px;
          width: auto;
          max-width: 220px;
          object-fit: contain;
        }

        .footer-contact-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-phone-links {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: monospace;
          font-size: 0.8rem;
          flex-wrap: wrap;
        }

        .footer-contact-link {
          color: var(--color-accent);
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .footer-contact-link:hover {
          color: var(--color-accent-hover);
          text-decoration: underline;
        }

        .footer-link-divider {
          color: var(--color-text-muted);
        }

        .footer-slogan {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          max-width: 320px;
          line-height: 1.5;
        }

        .footer-mid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: 24px 0;
        }

        .footer-address {
          font-family: monospace;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-socials a {
          color: var(--color-text-secondary);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
        }

        .footer-socials a:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          background: rgba(255, 90, 9, 0.05);
          transform: translateY(-2px);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .footer-cms-admin-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-family: monospace;
          font-size: 0.72rem;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          transition: all 0.2s;
        }

        .footer-cms-admin-link:hover {
          color: var(--color-accent, #e00027);
          border-color: var(--color-accent, #e00027);
        }

        @media (max-width: 768px) {
          .footer-mid {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
