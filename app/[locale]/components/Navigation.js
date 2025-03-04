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
  weight: ['400', '500'],
  display: 'swap',
});

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const { isGalleryOpen, galleryTitle, closeGallery, setSelectedImage, setIsGalleryOpen, setGalleryTitle } = useGallery();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // Add this function to handle navigation and clear gallery state
  const handleNavigation = (e, path) => {
    // Clear gallery state
    setSelectedImage(null);
    setIsGalleryOpen(false);
    setGalleryTitle(null);
    
    // Reset body styles
    document.body.style.overflow = 'unset';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';

    // Navigate to the new path
    router.push(path);
  };

  // Add this function to handle direct opening of visuals carousel
  const handleVisualsClick = (e) => {
    e.preventDefault();
    
    // First navigate to the visuals page
    router.push(`/${locale}/visuals`);
    
    // Then use a small timeout to ensure the page loads before opening the carousel
    setTimeout(() => {
      // Instead of trying to import the JSON file directly, we'll rely on the
      // visuals page to handle the data loading and carousel opening
      // This avoids path resolution issues
      setIsGalleryOpen(true);
    }, 100);
  };

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Loading Overlay with Centered Title */}
      <div 
        className={`fixed inset-0 bg-primary z-[60] pointer-events-none flex flex-col items-center 
          justify-center md:justify-center px-8 -mt-12 md:mt-0
          transition-opacity duration-700 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className={`flex flex-col items-center transition-all duration-700
          ${!showTitle ? '-translate-y-12 opacity-0 scale-[1.1]' : ''}
          ${showTitle && isLoading ? 'translate-y-0 opacity-100 scale-100' : ''}
          ${showTitle && !isLoading ? '-translate-y-24 opacity-0 scale-[0.6]' : ''}`}
        >
          <span className={`${playfair.className} text-2xl md:text-4xl tracking-[0.2em] text-center`}>
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
        <div className="md:hidden absolute left-0">
          {mounted && <MobileMenu currentPath={pathname} />}
        </div>

        {/* Logo/Project Title Container */}
        <div className="flex-1 md:flex-initial flex justify-center">
          <Link 
            href={`/${locale}`} 
            className={`${playfair.className} tracking-[0.2em] transition-colors whitespace-nowrap
              text-sm md:text-lg lg:text-xl text-primary
              ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onClick={closeGallery}
          >
            <span className="transition-opacity duration-300">
              {galleryTitle || 'CARLOTA VILAMALA'}
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex gap-8 text-xs absolute left-8 tracking-wider
          ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Link 
            href={`/${locale}`}
            className={`nav-link ${isHomePage ? 'text-accent' : 'text-primary'}`}
            onClick={(e) => {
              e.preventDefault();
              
              // Always close the gallery when navigating to projects
              if (isGalleryOpen) {
                // Force immediate reset of all gallery state
                document.body.style.overflow = 'unset';
                document.body.style.position = 'static';
                document.body.style.width = 'auto';
                
                // Set navigation flag to prevent splash screen
                try {
                  sessionStorage.setItem('isNavigating', 'true');
                } catch (error) {
                  console.error('Error setting session storage:', error);
                }
                
                // Force immediate navigation
                window.location.href = `/${locale}`;
              } else {
                // Set navigation flag to prevent splash screen
                sessionStorage.setItem('isNavigating', 'true');
                handleNavigation(e, `/${locale}`);
              }
            }}
          >
            {t('projects')}
          </Link>
          <Link 
            href={`/${locale}/visuals`}
            className={`nav-link ${pathname.includes('/visuals') ? 'text-accent' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              
              // Set navigation flag to prevent splash screen
              sessionStorage.setItem('isNavigating', 'true');
              
              // Then handle visuals click
              handleVisualsClick(e);
            }}
          >
            {t('visuals')}
          </Link>
          <Link 
            href={`/${locale}/about`}
            className={`nav-link ${pathname.includes('/about') ? 'text-accent' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem('isNavigating', 'true');
              router.push(`/${locale}/about`);
            }}
          >
            {t('about')}
          </Link>
          <Link 
            href={`/${locale}/contact`}
            className={`nav-link ${pathname.includes('/contact') ? 'text-accent' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem('isNavigating', 'true');
              router.push(`/${locale}/contact`);
            }}
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
            className="text-primary hover:text-accent transition-colors"
          >
            {mounted && (isDarkMode ? <LuSun size={20} /> : <LuMoon size={20} />)}
          </button>
        </div>
      </nav>
    </>
  );
}