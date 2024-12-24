"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale) => {
    // Store current theme state before navigation
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set flags for language change
    sessionStorage.setItem('isLanguageChange', 'true');
    sessionStorage.setItem('tempTheme', currentTheme);
    
    // Ensure theme class is set before navigation
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    
    // Navigate to new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex gap-2 text-xs">
      <button 
        className={`hover:opacity-50 ${locale === 'ca' ? 'text-accent' : 'text-primary'}`}
        onClick={() => handleLanguageChange('ca')}
      >
        CA
      </button>
      <span className="opacity-50 text-primary">|</span>
      <button 
        onClick={() => handleLanguageChange('es')}
        className={`hover:opacity-50 ${locale === 'es' ? 'text-accent' : 'text-primary'}`}
      >
        ES
      </button>
      <span className="opacity-50 text-primary">|</span>
      <button 
        onClick={() => handleLanguageChange('en')}
        className={`hover:opacity-50 ${locale === 'en' ? 'text-accent' : 'text-primary'}`}
      >
        EN
      </button>
    </div>
  );
}