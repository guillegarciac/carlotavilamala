"use client";

import { useTranslations } from 'next-intl';

export default function Footer({ variant = 'default', className = '' }) {
  const t = useTranslations('footer');

  if (variant === 'simple') {
    return (
      <footer className="flex justify-between items-center py-4 text-[12px] text-primary transition-colors duration-300">
        <span>© 2025 Carlota Vilamala - {t('rights')}</span>
        <span>
          <a 
            href="https://guillegarciac.github.io/mycv/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            {t('designed')}
          </a>
        </span>
      </footer>
    );
  }

  return (
    <footer className={`py-8 mb-4 bg-primary mt-auto text-primary transition-colors duration-300 ${className}`}>
      <div className="text-[12px] relative">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
          <div className="text-center md:text-left md:absolute md:left-8">
            © 2025 Carlota Vilamala - {t('rights')}
          </div>
          <div className="text-center md:text-right md:absolute md:right-8">
            <a 
              href="https://guillegarciac.github.io/mycv/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {t('designed')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 