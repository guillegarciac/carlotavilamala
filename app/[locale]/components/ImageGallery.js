"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from 'next-intl';
import { useGallery } from '../context/GalleryContext';

export default function ImageGallery({ projects }) {
  const t = useTranslations('projects');
  const [selectedImage, setSelectedImage] = useState(null);
  const [focusedImage, setFocusedImage] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const { setIsGalleryOpen } = useGallery();

  useEffect(() => {
    setIsGalleryOpen(!!selectedImage);
    return () => setIsGalleryOpen(false);
  }, [selectedImage, setIsGalleryOpen]);

  // Create refs for each project
  const projectRefs = useRef(new Map());

  useEffect(() => {
    // Only run on mobile devices
    if (window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFocusedImage(Number(entry.target.dataset.projectId));
          }
        });
      },
      {
        threshold: 0.7, // 70% of the item must be visible
        rootMargin: '-20% 0px' // Adds a margin to trigger slightly before/after the item is fully visible
      }
    );

    // Observe all project elements
    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
    if (touchStart.current) {
      const progress = (touchStart.current - e.targetTouches[0].clientX) / window.innerWidth;
      setSwipeProgress(Math.max(-1, Math.min(1, progress)));
    }
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
    setSwipeProgress(0);
  };

  const handleKeyDown = useCallback((e) => {
    if (!selectedImage) return;
    
    switch (e.key) {
      case 'ArrowRight':
        navigateToNext();
        break;
      case 'ArrowLeft':
        navigateToPrev();
        break;
      case 'Escape':
        setSelectedImage(null);
        break;
    }
  }, [selectedImage]);

  const navigateToNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedImage(projects[nextIndex]);
  }, [selectedImage, projects]);

  const navigateToPrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    setSelectedImage(projects[prevIndex]);
  }, [selectedImage, projects]);

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
  const getAdjacentProject = useCallback((direction) => {
    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    if (currentIndex === -1) return projects[0];
    if (direction === 'next') {
      return projects[(currentIndex + 1) % projects.length];
    } else {
      return projects[currentIndex === 0 ? projects.length - 1 : currentIndex - 1];
    }
  }, [selectedImage, projects]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [selectedImage]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 -mt-4">
        {projects.map((project) => (
          <div
            key={project.id}
            ref={(el) => projectRefs.current.set(project.id, el)}
            data-project-id={project.id}
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
                priority={project.id <= 8}
                quality={75}
                loading={project.id <= 8 ? "eager" : "lazy"}
              />
              <div 
                className={`absolute inset-0 transition-colors duration-300
                  md:bg-black/0 md:group-hover:bg-black/40
                  ${focusedImage === project.id ? 'bg-black/40' : 'bg-black/0'}`}
              >
                <div 
                  className={`absolute inset-0 flex flex-col items-center justify-center 
                    transition-opacity duration-300 text-white text-center p-4
                    md:opacity-0 md:group-hover:opacity-100
                    ${focusedImage === project.id ? 'opacity-100' : 'opacity-0'}`}
                >
                  <h3 className="text-lg font-medium tracking-wider mb-2 transform transition-transform duration-300">
                    {t(`${project.id}.title`)}
                  </h3>
                  <p className="text-sm font-light transform transition-transform duration-300">
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
          className={`fixed bg-[#faf9f6] flex items-center justify-center touch-pan-y
            inset-0
            ${window.innerWidth >= 768 ? 'md:top-[80px]' : 'top-0'}
            z-[200] md:z-50`}
          onClick={handleClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Mobile close button */}
          <button 
            className={`absolute top-6 right-6 z-[201] block 
              ${window.innerWidth < 768 ? 'bg-white rounded-full shadow-md' : ''} 
              w-8 h-8 flex items-center justify-center`}
            onClick={handleClose}
          >
            <div className="w-4 h-4 flex flex-col justify-center relative">
              <span className="w-full h-[1.5px] bg-black absolute rotate-45" />
              <span className="w-full h-[1.5px] bg-black absolute -rotate-45" />
            </div>
          </button>

          {/* Previous Arrow + Title - Desktop Only */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
            <div 
              className="relative pl-6 cursor-pointer w-full"
              onClick={handlePrev}
            >
              <button
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 absolute top-1/2 -translate-y-1/2 group-hover:opacity-0"
              >
                <span className="text-3xl">←</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-[180px]">
                <h3 className="text-xs font-medium tracking-wider mb-1">
                  {t(`${getAdjacentProject('prev').id}.title`)}
                </h3>
                <p className="text-[11px] font-light">
                  {t(`${getAdjacentProject('prev').id}.description`)}
                </p>
                <span className="text-lg block mt-2">←</span>
              </div>
            </div>
          </div>
          
          {/* Next Arrow + Title - Desktop Only */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
            <div 
              className="relative pr-6 cursor-pointer w-full"
              onClick={handleNext}
            >
              <button
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 absolute top-1/2 -translate-y-1/2 right-6 group-hover:opacity-0"
              >
                <span className="text-3xl">→</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-right w-[180px]">
                <h3 className="text-xs font-medium tracking-wider mb-1">
                  {t(`${getAdjacentProject('next').id}.title`)}
                </h3>
                <p className="text-[11px] font-light">
                  {t(`${getAdjacentProject('next').id}.description`)}
                </p>
                <span className="text-lg block mt-2">→</span>
              </div>
            </div>
          </div>

          <div 
            className="relative w-full h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Project Info - Desktop Only */}
            <div className="hidden md:block w-full text-center -mt-2">
              <div className="w-full text-center bg-[#faf9f6]/80 py-1.5">
                <h3 className="text-sm font-medium tracking-wider mb-0.5
                  whitespace-nowrap
                  text-[11px] md:text-xs
                ">
                  {t(`${selectedImage.id}.title`)}
                </h3>
                <p className="text-xs font-light 
                  whitespace-nowrap
                  text-[10px] md:text-[11px]
                ">
                  {t(`${selectedImage.id}.description`)}
                </p>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative w-full md:w-[1000px] lg:w-[1200px] xl:w-[1400px] 2xl:w-[1600px]
              h-[calc(100vh-128px)] md:h-[calc(100vh-105px)]
              mx-auto"
            >
              <Image
                src={selectedImage.imageUrl}
                alt={t(`${selectedImage.id}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover md:object-contain mx-auto transition-transform duration-300"
                style={{
                  transform: `translateX(${-swipeProgress * 100}px)`,
                }}
                priority
                quality={75}
                loading="eager"
              />
            </div>

            {/* Next/Prev Images for Transition */}
            {swipeProgress !== 0 && (
              <div className="absolute inset-0 md:w-[1000px] lg:w-[1200px] xl:w-[1400px] 2xl:w-[1600px]
                h-[calc(100vh-128px)] md:h-[calc(100vh-80px)]
                mx-auto"
              >
                <Image
                  src={getAdjacentProject(swipeProgress > 0 ? 'next' : 'prev').imageUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover md:object-contain mx-auto transition-transform duration-300"
                  style={{
                    transform: `translateX(${swipeProgress > 0 ? 100 - (swipeProgress * 100) : -100 - (swipeProgress * 100)}px)`,
                    opacity: Math.abs(swipeProgress)
                  }}
                  priority
                  quality={75}
                />
              </div>
            )}

            {/* Mobile Info Container */}
            <div className="fixed left-0 right-0 bottom-0 h-36 bg-[#faf9f6] flex flex-col justify-center items-center md:hidden">
              {/* Swipe Indicator Dots */}
              <div className="flex justify-center items-center overflow-visible h-8 mb-4">
                {(() => {
                  const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
                  const totalDots = projects.length;
                  const dotsToShow = 5;
                  return Array.from({ length: dotsToShow }, (_, i) => {
                    // Calculate index with circular wrapping
                    const centerOffset = i - Math.floor(dotsToShow / 2);
                    let dotIndex = (currentIndex + centerOffset + totalDots) % totalDots;
                    
                    // Calculate relative position considering circular navigation
                    const positionOffset = centerOffset - swipeProgress;
                    
                    const baseSize = 'h-2 w-2 mx-2';
                    
                    // Calculate scale with smoother transitions
                    const maxScale = 1.4; // Slightly smaller max scale
                    const minScale = 0.6; // Smaller edge dots
                    const scaleRange = maxScale - minScale;
                    
                    // More dramatic scale reduction towards edges
                    const scale = maxScale - (Math.abs(positionOffset) * 0.5);
                    
                    // Smooth color transition
                    const isActive = Math.abs(positionOffset) < 0.5;
                    const color = isActive ? '#ff3040' : '#d1d1d1';
                    
                    // Smooth opacity transition for edge dots
                    const opacity = Math.max(0.3, 1 - (Math.abs(positionOffset) * 0.4));
                    
                    // Calculate horizontal movement
                    const baseMove = -swipeProgress * 16; // Reversed direction
                    const edgeMove = -Math.sign(positionOffset) * Math.max(0, (Math.abs(positionOffset) - 1) * 8);
                    const moveX = baseMove + edgeMove; // Combined movement
                    
                    return (
                      <div
                        key={dotIndex}
                        className={`rounded-full transition-none ${baseSize}
                          transform-gpu will-change-transform`}
                        style={{
                          transform: `translateX(${moveX}px) scale(${scale})`,
                          backgroundColor: color,
                          opacity: opacity,
                          transition: swipeProgress === 0 ? 'transform 0.2s linear, opacity 0.2s linear, background-color 0.2s linear' : 'none'
                        }}
                      />
                    );
                  });
                })()}
              </div>

              {/* Project Info - Mobile */}
              <div className="px-4 text-center">
                <h3 className="text-sm font-medium tracking-wider mb-1">
                  {t(`${selectedImage.id}.title`)}
                </h3>
                <p className="text-xs font-light">
                  {t(`${selectedImage.id}.description`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preload next and previous images */}
      {selectedImage && (
        <>
          <link
            rel="preload"
            as="image"
            href={getAdjacentProject('next').imageUrl}
          />
          <link
            rel="preload"
            as="image"
            href={getAdjacentProject('prev').imageUrl}
          />
        </>
      )}
    </>
  );
} 