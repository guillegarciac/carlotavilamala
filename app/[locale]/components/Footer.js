"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="py-8 bg-[#faf9f6] mt-auto">
      <div className="text-xs relative">
        {/* Copyright and Rights */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
          <div className="text-center md:text-left md:absolute md:left-8">
            © {new Date().getFullYear()} Carlota Vilamala
          </div>
          <div className="text-center md:text-right md:absolute md:right-8">
            {t('rights')}
          </div>
        </div>
      </div>
    </footer>
  );
} 