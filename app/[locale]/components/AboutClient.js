"use client";

import Navigation from "./Navigation";
import { Playfair_Display } from "next/font/google";
import { useTranslations } from 'next-intl';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400'],
});

export default function AboutClient() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="px-8 pt-16 pb-8 md:pt-24 max-w-screen-lg mx-auto md:h-[calc(100vh-140px)]">
        <div className="flex flex-col md:grid md:grid-cols-[180px_1fr] md:gap-x-16">
          {/* Bio Section */}
          <div className="mb-4 md:mb-0">
            <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
              {t('title')}
            </h2>
          </div>
          <div className="mb-6 md:mb-8">
            <p className="text-xs leading-relaxed font-light">
              {t('bio')}
            </p>
            <p className="text-xs leading-relaxed font-light mt-4">
              {t('bio2')}
            </p>
          </div>

          {/* Clients Section */}
          <div className="mb-4 md:mb-0">
            <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
              {t('clients.title')}
            </h2>
          </div>
          <div className="mb-6 md:mb-8">
            <ul className="text-xs leading-relaxed font-light">
              {Object.entries(t.raw('clients.list')).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>

          {/* Expertise Section */}
          <div className="mb-4 md:mb-0">
            <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
              {t('expertise.title')}
            </h2>
          </div>
          <div className="mb-0">
            <ul className="text-xs leading-relaxed font-light">
              {Object.entries(t.raw('expertise.list')).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 