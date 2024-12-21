"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from 'next-intl';

export default function ImageGallery({ projects }) {
  const t = useTranslations('projects');
  const [selectedImage, setSelectedImage] = useState(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateToNext();
    }
    if (isRightSwipe) {
      navigateToPrev();
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (!selectedImage) return;

    if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (e.key === 'ArrowRight') {
      navigateToNext();
    } else if (e.key === 'ArrowLeft') {
      navigateToPrev();
    }
  }, [selectedImage]);

  const navigateToNext = () => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    const nextIndex = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(projects[nextIndex]);
  };

  const navigateToPrev = () => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    setSelectedImage(projects[prevIndex]);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToNext();
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToPrev();
  };

  // Helper function to get next/prev project
  const getAdjacentProject = (direction) => {
    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    if (direction === 'next') {
      return projects[currentIndex === projects.length - 1 ? 0 : currentIndex + 1];
    } else {
      return projects[currentIndex === 0 ? projects.length - 1 : currentIndex - 1];
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 -mt-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(project)}
          >
            <div className="relative overflow-hidden aspect-[3/4]">
              <Image
                src={project.imageUrl}
                alt={t(`${project.id}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 
                       (max-width: 1024px) 33vw,
                       (max-width: 1280px) 25vw,
                       20vw"
                className="object-cover transition-all duration-700 group-hover:scale-[1.02]"
                priority={project.id <= 4}
                quality={95}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                  <h3 className="text-lg font-medium tracking-wider mb-2 transform group-hover:scale-100 scale-150 transition-transform duration-300">
                    {t(`${project.id}.title`)}
                  </h3>
                  <p className="text-sm font-light transform group-hover:scale-100 scale-150 transition-transform duration-300">
                    {t(`${project.id}.description`)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-[#faf9f6] z-50 flex items-center justify-center touch-pan-y"
          onClick={handleClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button 
            className="absolute top-8 right-8 z-50"
            onClick={handleClose}
          >
            <div className="w-8 h-5 flex flex-col justify-center relative">
              <span className="w-full h-[1px] bg-black absolute rotate-45" />
              <span className="w-full h-[1px] bg-black absolute -rotate-45" />
            </div>
          </button>

          {/* Previous Arrow + Title - Always show it now */}
          <div className="absolute left-[5%] top-0 bottom-0 hidden md:flex items-center group z-[60]">
            <div className="flex items-center gap-4 w-[15vw]">
              <button
                className="w-12 h-12 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors shrink-0"
                onClick={handlePrev}
              >
                <span className="text-3xl transform transition-transform hover:scale-150">←</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <h3 className="text-sm font-medium tracking-wider mb-1 line-clamp-1">
                  {t(`${getAdjacentProject('prev').id}.title`)}
                </h3>
                <p className="text-xs font-light line-clamp-2">
                  {t(`${getAdjacentProject('prev').id}.description`)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Next Arrow + Title - Always show it now */}
          <div className="absolute right-[5%] top-0 bottom-0 hidden md:flex items-center group z-[60]">
            <div className="flex items-center gap-4 w-[15vw]">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-right pointer-events-none">
                <h3 className="text-sm font-medium tracking-wider mb-1 line-clamp-1">
                  {t(`${getAdjacentProject('next').id}.title`)}
                </h3>
                <p className="text-xs font-light line-clamp-2">
                  {t(`${getAdjacentProject('next').id}.description`)}
                </p>
              </div>
              <button
                className="w-12 h-12 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors shrink-0"
                onClick={handleNext}
              >
                <span className="text-3xl transform transition-transform hover:scale-150">→</span>
              </button>
            </div>
          </div>

          <div 
            className="relative w-full h-full md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.imageUrl}
              alt={t(`${selectedImage.id}.title`)}
              fill
              sizes="100vw"
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </div>
      )}
    </>
  );
} 