"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex gap-2 text-xs">
      <button 
        onClick={() => handleLanguageChange('ca')}
        className={`hover:opacity-50 transition-opacity ${locale === 'ca' ? 'text-red-500' : ''}`}
      >
        CA
      </button>
      <span className="opacity-50">|</span>
      <button 
        onClick={() => handleLanguageChange('es')}
        className={`hover:opacity-50 transition-opacity ${locale === 'es' ? 'text-red-500' : ''}`}
      >
        ES
      </button>
      <span className="opacity-50">|</span>
      <button 
        onClick={() => handleLanguageChange('en')}
        className={`hover:opacity-50 transition-opacity ${locale === 'en' ? 'text-red-500' : ''}`}
      >
        EN
      </button>
    </div>
  );
}