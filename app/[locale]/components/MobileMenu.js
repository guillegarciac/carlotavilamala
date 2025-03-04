"use client";

import { useState, useEffect } from 'react';
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { LuSun, LuMoon } from "react-icons/lu";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useGallery } from '../context/GalleryContext';

export default function MobileMenu({ currentPath }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();
  const { isDarkMode, toggleTheme } = useTheme();
  const isHomePage = currentPath === `/${locale}` || currentPath === `/${locale}/`;
  const router = useRouter();
  const { setSelectedImage, setIsGalleryOpen, setGalleryTitle, isGalleryOpen, closeGallery } = useGallery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (e, path) => {
    e.preventDefault();
    router.push(path);
    setIsOpen(false);
  };

  const handleVisualsClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    
    router.push(`/${locale}/visuals`);
    
    setTimeout(() => {
      setIsGalleryOpen(true);
    }, 100);
  };

  const bgColor = isDarkMode ? 'bg-white' : 'bg-black';
  const textColor = isDarkMode ? 'text-black' : 'text-white';

  return (
    <div className="md:hidden absolute left-0">
      {/* Burger/X Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full px-8 z-50 relative -mt-2"
      >
        <div className="w-8 h-5 flex flex-col justify-center relative">
          <span className={`w-full h-[1px] absolute transition-all duration-300 -translate-y-1
            ${bgColor}`}
            style={{ transform: isOpen ? 'rotate(45deg) translate(0)' : '' }}
          />
          <span className={`w-full h-[1px] absolute transition-all duration-300 translate-y-1
            ${bgColor}`}
            style={{ transform: isOpen ? 'rotate(-45deg) translate(0)' : '' }}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-primary z-40 
          transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 pointer-events-none -translate-x-full'
          }`}
      >
        <div className={`p-8 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-8'}`}
        >
          <nav className="flex flex-col gap-8 mt-16 text-sm">
            <Link 
              href={`/${locale}`}
              className={isHomePage ? 'text-accent' : 'text-primary'}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                
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
              className={currentPath.includes('/visuals') ? 'text-accent' : 'text-primary'}
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
              className={currentPath.includes('/about') ? 'text-accent' : 'text-primary'}
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.setItem('isNavigating', 'true');
                handleNavigation(e, `/${locale}/about`);
              }}
            >
              {t('about')}
            </Link>
            <Link 
              href={`/${locale}/contact`}
              className={currentPath.includes('/contact') ? 'text-accent' : 'text-primary'}
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.setItem('isNavigating', 'true');
                handleNavigation(e, `/${locale}/contact`);
              }}
            >
              {t('contact')}
            </Link>
            <div className="flex flex-col gap-6">
              <LanguageSelector />
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/bycharlott_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/carlota-vilamala-reig/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors"
                >
                  <FaLinkedin size={20} />
                </a>
                <button
                  onClick={toggleTheme}
                  className="text-primary hover:text-accent transition-colors"
                >
                  {mounted && (isDarkMode ? <LuSun size={20} /> : <LuMoon size={20} />)}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}