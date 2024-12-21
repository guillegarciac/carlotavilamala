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

      <main className="px-8 mt-8 md:mt-8 pt-20 md:pt-0">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] md:gap-x-24">
            {/* Bio Section */}
            <div className="mb-4 md:mb-0">
              <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
                {t('title')}
              </h2>
            </div>
            <div className="mb-12 md:mb-20">
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
            <div className="mb-12 md:mb-20">
              <ul className="text-xs leading-relaxed font-light">
                <li>{t('clients.list.zara')}</li>
                <li>{t('clients.list.mango')}</li>
                <li>{t('clients.list.massimo')}</li>
                <li>{t('clients.list.pullbear')}</li>
                <li>{t('clients.list.desigual')}</li>
                <li>{t('clients.list.tous')}</li>
                <li>{t('clients.list.santaeulalia')}</li>
                <li>{t('clients.list.bcnfashion')}</li>
              </ul>
            </div>

            {/* Expertise Section */}
            <div className="mb-4 md:mb-0">
              <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
                {t('expertise.title')}
              </h2>
            </div>
            <div className="mb-12 md:mb-20">
              <ul className="text-xs leading-relaxed font-light">
                <li>{t('expertise.list.events')}</li>
                <li>{t('expertise.list.protocol')}</li>
                <li>{t('expertise.list.communication')}</li>
                <li>{t('expertise.list.marketing')}</li>
                <li>{t('expertise.list.styling')}</li>
                <li>{t('expertise.list.storytelling')}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 