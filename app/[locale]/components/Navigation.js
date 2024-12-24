"use client";

import { Playfair_Display } from "next/font/google";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useGallery } from '../context/GalleryContext';

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
  const { isGalleryOpen, galleryTitle } = useGallery();

  // Show animation on page refresh but not on navigation
  useEffect(() => {
    const isNavigating = sessionStorage.getItem('isNavigating');
    
    if (isNavigating) {
      setIsLoading(false);
      setShowTitle(false);
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

  return (
    <>
      {/* Loading Overlay with Centered Title */}
      <div 
        className={`fixed inset-0 bg-[#faf9f6] z-[60] transition-all duration-[1200ms] pointer-events-none flex flex-col items-center 
          justify-center md:justify-center px-8 -mt-12 md:mt-0
          ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className={`flex flex-col items-center transition-all duration-[1200ms]
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

      <nav className={`fixed top-0 left-0 right-0 flex justify-center items-center px-8 bg-[#faf9f6] z-50 transition-all duration-[1200ms]
        ${isGalleryOpen ? 'md:flex hidden' : 'flex'}
        py-4 md:${isScrolled ? 'py-3' : 'py-6'}
      `}>
        {/* Mobile Menu */}
        <MobileMenu currentPath={pathname} />

        {/* Desktop Menu */}
        <div className={`hidden md:flex gap-8 text-xs absolute left-8 tracking-wider transition-opacity duration-[1200ms] delay-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Link 
            href={`/${locale}`}
            className={`nav-link ${isHomePage ? 'text-red-500' : ''}`}
          >
            {t('projects')}
          </Link>
          <Link 
            href={`/${locale}/about`}
            className={`nav-link ${pathname.includes('/about') ? 'text-red-500' : ''}`}
          >
            {t('about')}
          </Link>
          <Link 
            href={`/${locale}/contact`}
            className={`nav-link ${pathname.includes('/contact') ? 'text-red-500' : ''}`}
          >
            {t('contact')}
          </Link>
        </div>

        {/* Logo/Project Title */}
        <Link 
          href={`/${locale}`} 
          className={`text-base tracking-[0.2em] ${playfair.className} ml-8 md:ml-0 transition-all duration-[1200ms]
            text-base md:${isScrolled ? 'text-lg' : 'text-xl'}
            ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
        >
          {isGalleryOpen && galleryTitle ? (
            <span className="transition-opacity duration-300">
              {galleryTitle}
            </span>
          ) : (
            <span className="transition-opacity duration-300">
              CARLOTA VILAMALA
            </span>
          )}
        </Link>

        {/* Social Icons and Language Selector */}
        <div className={`hidden md:flex items-center gap-6 absolute right-8 transition-all duration-[1200ms] delay-300
          ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <LanguageSelector />
          <div className="flex gap-4">
            <a 
              href="https://instagram.com/bycharlott_" 
              className="hover:opacity-50 transition-opacity"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaInstagram size={isScrolled ? 18 : 20} className="transition-all duration-300 hidden md:block" />
            </a>
            <a 
              href="https://www.linkedin.com/in/carlota-vilamala-reig/" 
              className="hover:opacity-50 transition-opacity"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaLinkedin size={isScrolled ? 18 : 20} className="transition-all duration-300 hidden md:block" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}