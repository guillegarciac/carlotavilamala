"use client";

import Navigation from "./Navigation";
import { Playfair_Display } from "next/font/google";
import { useTranslations } from 'next-intl';
import ExperienceTimeline from "./ExperienceTimeline";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400'],
});

export default function AboutClient() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow px-8 mt-12 pt-20 md:pt-16">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] md:gap-x-24">
            {/* Bio Section */}
            <div className="mb-4 md:mb-0">
              <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
                {t('title')}
              </h2>
            </div>
            <div className="mb-12 md:mb-24">
              <p className="text-xs leading-relaxed font-light">
                {t('bio')}
              </p>
              <p className="text-xs leading-relaxed font-light mt-4">
                {t('bio2')}
              </p>
            </div>

            {/* Experience Timeline */}
            <div className="mb-4 md:mb-0">
              <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
                {t('experience.title')}
              </h2>
            </div>
            <div className="mb-12 md:mb-24">
              <ExperienceTimeline />
            </div>

            {/* Expertise Section */}
            <div className="mb-4 md:mb-0">
              <h2 className={`text-base tracking-wider font-light italic ${playfair.className}`}>
                {t('expertise.title')}
              </h2>
            </div>
            <div className="mb-12">
              <ul className="text-xs leading-relaxed font-light">
                {Object.entries(t.raw('expertise.list')).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 