"use client";

import { useState } from 'react';
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from '../context/ThemeContext';

export default function MobileMenu({ currentPath }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();
  const { isDarkMode } = useTheme();
  const isHomePage = currentPath === `/${locale}` || currentPath === `/${locale}/`;

  return (
    <div className="md:hidden absolute left-0">
      {/* Burger/X Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full px-8 z-50 relative -mt-2"
      >
        <div className="w-8 h-5 flex flex-col justify-center relative">
          <span className={`w-full h-[1px] absolute transition-all duration-300 -translate-y-1
            ${isDarkMode ? 'bg-white' : 'bg-black'}`}
            style={{ transform: isOpen ? 'rotate(45deg) translate(0)' : '' }}
          />
          <span className={`w-full h-[1px] absolute transition-all duration-300 translate-y-1
            ${isDarkMode ? 'bg-white' : 'bg-black'}`}
            style={{ transform: isOpen ? 'rotate(-45deg) translate(0)' : '' }}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-primary z-40">
          <div className="p-8">
            <nav className="flex flex-col gap-8 mt-16 text-sm">
              <Link 
                href={`/${locale}`}
                className={isHomePage ? 'text-accent' : 'text-primary'}
                onClick={() => setIsOpen(false)}
              >
                {t('projects')}
              </Link>
              <Link 
                href={`/${locale}/about`}
                className={currentPath.includes('/about') ? 'text-accent' : 'text-primary'}
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href={`/${locale}/contact`}
                className={currentPath.includes('/contact') ? 'text-accent' : 'text-primary'}
                onClick={() => setIsOpen(false)}
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
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}