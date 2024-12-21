"use client";

import { useState } from 'react';
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useTranslations, useLocale } from 'next-intl';

export default function MobileMenu({ currentPath }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();

  // Helper function to check if it's the home page
  const isHomePage = currentPath === `/${locale}` || currentPath === `/${locale}/`;

  return (
    <div className="md:hidden absolute left-0">
      {/* Burger/X Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full px-8 z-50 relative"
      >
        <div className="w-8 h-5 flex flex-col justify-center relative">
          <span className={`w-full h-[1px] bg-black absolute transition-all duration-300 ${
            isOpen ? 'rotate-45' : '-translate-y-1'
          }`} />
          <span className={`w-full h-[1px] bg-black absolute transition-all duration-300 ${
            isOpen ? '-rotate-45' : 'translate-y-1'
          }`} />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#faf9f6] z-40">
          <div className="p-8">
            <nav className="flex flex-col gap-8 mt-16 text-sm">
              <Link 
                href={`/${locale}`}
                className={isHomePage ? 'text-red-500' : ''}
                onClick={() => setIsOpen(false)}
              >
                {t('overview')}
              </Link>
              <Link 
                href={`/${locale}/about`}
                className={currentPath.includes('/about') ? 'text-red-500' : ''}
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href={`/${locale}/contact`}
                className={currentPath.includes('/contact') ? 'text-red-500' : ''}
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
                    className="flex items-center"
                  >
                    <FaInstagram size={24} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/carlota-vilamala-reig/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <FaLinkedin size={24} />
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