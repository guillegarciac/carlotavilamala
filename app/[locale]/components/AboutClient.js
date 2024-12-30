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
              <ul className="text-[13px] leading-[1.2] font-light flex flex-wrap gap-x-2 gap-y-2 md:max-w-[600px]">
                {Object.entries(t.raw('expertise.list'))
                  .sort((a, b) => {
                    const aLength = a[1].length;
                    const bLength = b[1].length;
                    
                    // Group items by length ranges
                    const getGroup = (length) => {
                      if (length <= 12) return 0;
                      if (length <= 16) return 1;
                      if (length <= 22) return 2;
                      if (length <= 28) return 3;
                      return 4;
                    };
                    
                    const aGroup = getGroup(aLength);
                    const bGroup = getGroup(bLength);
                    
                    if (aGroup !== bGroup) {
                      if (aGroup === 0) return -1;
                      if (bGroup === 0) return 1;
                      if (aGroup === 1) return -1;
                      if (bGroup === 1) return 1;
                      return aGroup - bGroup;
                    }
                    
                    return bLength - aLength;
                  })
                  .map(([key, value]) => (
                  <li 
                    key={key} 
                    className="px-4 py-[6px] rounded-full border dark:border-accent-dark border-accent-light 
                    transition-colors duration-200 ease-in-out whitespace-nowrap flex-shrink-0 w-fit
                    dark:hover:border-accent-dark/70 hover:border-accent-light/70"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 