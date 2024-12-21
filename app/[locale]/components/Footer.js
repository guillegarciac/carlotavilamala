"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="py-8 bg-[#faf9f6] mt-auto">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center text-xs px-8">
        <div className="absolute left-8">
          © {new Date().getFullYear()} Carlota Vilamala
        </div>
        <div className="absolute right-8">
          {t('rights')}
        </div>
      </div>
    </footer>
  );
} 