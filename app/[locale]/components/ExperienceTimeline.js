"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ExperienceTimeline() {
  const t = useTranslations('about.experience');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const renderTimelineItem = (item, isNested = false) => (
    <div className={`${isNested ? 'ml-4' : ''}`}>
      {/* Role & Period */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-2">
        <div>
          <div className="text-sm font-normal flex items-center text-primary">
            {item.role}
            {item.current && (
              <span className="text-accent text-sm ml-2">· {t('current')}</span>
            )}
          </div>
          <div className="text-sm text-secondary leading-none mt-0.5">
            {item.company ? (
              <>
                {item.company}
                {item.location && <span> - {item.location}</span>}
              </>
            ) : (
              item.location
            )}
          </div>
        </div>
        <div className="text-sm text-secondary sm:text-right">
          <div>{item.period}</div>
          {item.duration && (
            <div className="hidden sm:block text-xs leading-none sm:mt-0.5">
              {item.duration}
            </div>
          )}
        </div>
      </div>

    </div>
  );

  const renderNestedItems = (items) => (
    <div className="mt-2 space-y-2">
      {items.map((item, index) => (
        <div key={index}>
          {renderTimelineItem(item, true)}
          {item.nestedItems && renderNestedItems(item.nestedItems)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <div className="space-y-4">
        {t.raw('timeline').map((experience, index) => (
          <motion.div
            key={`${experience.company || experience.role}-${index}`}
            className="relative pl-8"
            {...fadeInUp}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-[7px] z-10">
              <div className="w-[6px] h-[6px] rounded-full bg-black dark:bg-white" />
            </div>

            {/* Timeline line */}
            <div className="absolute left-[2.5px] top-[20px] w-[1px] h-[calc(100%_-_20px)] bg-black dark:bg-white" />

            {/* Content */}
            <div>
              {renderTimelineItem(experience)}
              {experience.nestedItems && renderNestedItems(experience.nestedItems)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 