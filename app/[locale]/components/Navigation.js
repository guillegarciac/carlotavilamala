"use client";

import { Playfair_Display } from "next/font/google";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { LuSun, LuMoon } from "react-icons/lu";
import MobileMenu from "./MobileMenu";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useGallery } from '../context/GalleryContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400'],
});

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const { isGalleryOpen, galleryTitle, closeGallery } = useGallery();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show animation on page refresh but not on navigation or language change
  useEffect(() => {
    const isNavigating = sessionStorage.getItem('isNavigating');
    const isLanguageChange = sessionStorage.getItem('isLanguageChange');
    
    if (isNavigating || isLanguageChange) {
      setIsLoading(false);
      setShowTitle(false);
      // Clear language change flag after using it
      sessionStorage.removeItem('isLanguageChange');
      return;
    }
    
    setTimeout(() => {
      setShowTitle(true);
    }, 300);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('isNavigating', 'true');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Reset navigation flag on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('isNavigating');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to check if it's the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Add this handler for the Projects link
  const handleProjectsClick = (e) => {
    if (isGalleryOpen) {
      e.preventDefault();
      closeGallery();
    }
  };

  // Add this function to handle language changes
  const handleLanguageChange = (newLocale) => {
    sessionStorage.setItem('isLanguageChange', 'true');
    router.push(pathname.replace(`/${locale}`, `/${newLocale}`));
  };

  return (
    <>
      {/* Loading Overlay with Centered Title */}
      <div 
        className={`fixed inset-0 bg-primary z-[60] pointer-events-none flex flex-col items-center 
          justify-center md:justify-center px-8 -mt-12 md:mt-0
          ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className={`flex flex-col items-center
          ${!showTitle ? '-translate-y-12 opacity-0 scale-[1.1]' : ''}
          ${showTitle && isLoading ? 'translate-y-0 opacity-100 scale-100' : ''}
          ${showTitle && !isLoading ? '-translate-y-24 opacity-0 scale-[0.6]' : ''}`}
        >
          <span className={`text-2xl md:text-4xl tracking-[0.2em] ${playfair.className} text-center`}>
            CARLOTA VILAMALA
          </span>
          <span className="hidden md:block text-sm mt-4 tracking-wider font-light text-center">
            {t('subtitle')}
          </span>
        </div>
      </div>

      <nav className={`fixed top-0 left-0 right-0 flex justify-center items-center px-8 bg-primary z-50
        ${isGalleryOpen ? 'md:flex hidden' : 'flex'}
        py-4 md:py-6 pt-8 md:pt-4`}>
        {/* Mobile Menu */}
        <div className="w-16">
          <MobileMenu currentPath={pathname} />
        </div>

        {/* Logo/Project Title */}
        <Link 
          href={`/${locale}`} 
          className={`${playfair.className} tracking-[0.2em] transition-colors
            text-sm md:text-lg lg:text-xl text-primary`}
          onClick={closeGallery}
        >
          CARLOTA VILAMALA
        </Link>

        {/* Desktop Menu */}
        <div className={`hidden md:flex gap-8 text-xs absolute left-8 tracking-wider
          ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Link 
            href={`/${locale}`}
            className={`nav-link ${isHomePage ? 'text-accent' : 'text-primary'}`}
            onClick={handleProjectsClick}
          >
            {t('projects')}
          </Link>
          <Link 
            href={`/${locale}/about`}
            className={`nav-link ${pathname.includes('/about') ? 'text-accent' : ''}`}
          >
            {t('about')}
          </Link>
          <Link 
            href={`/${locale}/contact`}
            className={`nav-link ${pathname.includes('/contact') ? 'text-accent' : ''}`}
          >
            {t('contact')}
          </Link>
        </div>

        {/* Social Icons and Language Selector */}
        <div className={`hidden md:flex items-center gap-6 absolute right-8
          ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <LanguageSelector />
          <div className="flex gap-4">
            <a 
              href="https://instagram.com/bycharlott_" 
              className="hover:opacity-50 transition-opacity"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} className="hidden md:block text-primary" />
            </a>
            <a 
              href="https://www.linkedin.com/in/carlota-vilamala-reig/" 
              className="hover:opacity-50 transition-opacity"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaLinkedin size={20} className="hidden md:block text-primary" />
            </a>
          </div>
          <button
            onClick={toggleTheme}
            className="hover:opacity-50 transition-opacity ml-4"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <LuSun size={20} /> : <LuMoon size={20} />}
          </button>
        </div>
      </nav>
    </>
  );
}