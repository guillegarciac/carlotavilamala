"use client";

import { Playfair_Display } from "next/font/google";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400'],
});

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const locale = useLocale();

  // Helper function to check if it's the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <nav className="md:relative fixed top-0 left-0 right-0 flex justify-center items-center py-8 px-8 bg-[#faf9f6] z-50">
      {/* Mobile Menu */}
      <MobileMenu currentPath={pathname} />

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8 text-xs absolute left-8 tracking-wider">
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

      {/* Logo */}
      <Link 
        href={`/${locale}`} 
        className={`text-base md:text-2xl tracking-[0.2em] ${playfair.className} ml-8 md:ml-0
          landscape:!mt-16 md:landscape:!mt-0`}
      >
        CARLOTA VILAMALA
      </Link>

      {/* Social Icons and Language Selector */}
      <div className="hidden md:flex items-center gap-6 absolute right-8">
        <LanguageSelector />
        <div className="flex gap-4">
          <a 
            href="https://instagram.com/bycharlott_" 
            className="hover:opacity-50 transition-opacity"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaInstagram size={24} />
          </a>
          <a 
            href="https://www.linkedin.com/in/carlota-vilamala-reig/" 
            className="hover:opacity-50 transition-opacity"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </nav>
  );
}