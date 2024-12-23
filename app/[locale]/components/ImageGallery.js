"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGallery } from "../context/GalleryContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

export default function ImageGallery({ projects }) {
  const t = useTranslations("projects");
  const g = useTranslations("gallery");
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [focusedImage, setFocusedImage] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const { setIsGalleryOpen } = useGallery();
  const projectRefs = useRef(new Map());
  const swiperRef = useRef(null);

  // Track swipe start/end points for mobile swiping between images
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const [minSwipeDistance, setMinSwipeDistance] = useState(0);

  // Simplified close handler
  const closeGallery = useCallback(() => {
    try {
      // First reset states
      setSelectedImage(null);
      setIsGalleryOpen(false);
      setSwipeProgress(0);
      
      // Reset body styles
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      
      // Destroy Swiper instance if it exists
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
      
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        router.push('/');
      }, 0);
    } catch (error) {
      console.error('Error in closeGallery:', error);
      // Fallback close if something goes wrong
      setSelectedImage(null);
      setIsGalleryOpen(false);
    }
  }, [router, setIsGalleryOpen]);

  // Remove the selectedImage effect and handle body styles directly
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      setIsGalleryOpen(true);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      setIsGalleryOpen(false);
    };
  }, [selectedImage, setIsGalleryOpen]);

  // INTERSECTION OBSERVER (mobile only)
  useEffect(() => {
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
        threshold: 0.7,
        rootMargin: "-20% 0px",
      }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Set minimum swipe distance on mount
  useEffect(() => {
    setMinSwipeDistance(window.innerWidth * 0.15); // e.g., 15% of screen width
  }, []);

  // TOUCH SWIPE HANDLERS (we attach these to the image container, not the entire backdrop)
  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
    if (touchStart.current) {
      const progress = touchStart.current - e.targetTouches[0].clientX;
      setSwipeProgress(progress);
      
      // Show direction hint at boundaries with a minimum threshold
      const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
      if ((currentIndex === 0 && progress < -20) || 
          (currentIndex === projects.length - 1 && progress > 20)) {
        setShowDirectionHint(currentIndex === 0 ? 'right' : 'left');
      } else {
        setShowDirectionHint(null);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Reset progress first to prevent jump
    setSwipeProgress(0);

    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
    
    // Only navigate if we're not at the boundaries
    if (isLeftSwipe && currentIndex < projects.length - 1) {
      navigateToNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      navigateToPrev();
    }

    setShowDirectionHint(null); // Clear the hint
  };

  // NAVIGATION FUNCTIONS
  const navigateToNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedImage(projects[nextIndex]);
    swiperRef.current?.slideToLoop(nextIndex);
  }, [selectedImage, projects]);

  const navigateToPrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    setSelectedImage(projects[prevIndex]);
    swiperRef.current?.slideToLoop(prevIndex);
  }, [selectedImage, projects]);

  // HANDLE KEYBOARD EVENTS
  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedImage) return;
      switch (e.key) {
        case "ArrowRight":
          navigateToNext();
          break;
        case "ArrowLeft":
          navigateToPrev();
          break;
        case "Escape":
          closeGallery();
          break;
      }
    },
    [selectedImage, navigateToNext, navigateToPrev, closeGallery]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // GET ADJACENT PROJECT
  const getAdjacentProject = useCallback(
    (direction) => {
      const currentIndex = projects.findIndex((p) => p.id === selectedImage?.id);
      if (currentIndex === -1) return projects[0];
      if (direction === "next") {
        return projects[(currentIndex + 1) % projects.length];
      } else {
        return projects[currentIndex === 0 ? projects.length - 1 : currentIndex - 1];
      }
    },
    [selectedImage, projects]
  );

  // Swiper pagination bullet styles
  const swiperStyles = `
    .swiper-pagination-bullet {
      transition: all 0.3s ease;
      background: #8E8E8E;
      opacity: 0.4;
    }
    .swiper-pagination-bullet-active {
      background: #EF4444 !important;
      opacity: 1;
      width: 16px !important;
      height: 16px !important;
    }
    .swiper-pagination-bullet-active-prev,
    .swiper-pagination-bullet-active-next {
      width: 14px !important;
      height: 14px !important;
    }
    .swiper-pagination-bullet-active-prev-prev,
    .swiper-pagination-bullet-active-next-next {
      width: 12px !important;
      height: 12px !important;
    }
    .swiper-pagination-bullet-active-prev-prev-prev,
    .swiper-pagination-bullet-active-next-next-next {
      width: 10px !important;
      height: 10px !important;
    }
    .swiper-pagination-bullet {
      width: 8px !important;
      height: 8px !important;
    }
  `;

  // First add this new state near the other state declarations
  const [showDirectionHint, setShowDirectionHint] = useState(null); // 'left' or 'right'

  // First, calculate the hint opacity based on swipe progress
  const getHintOpacity = useCallback((progress) => {
    const maxProgress = window.innerWidth * 0.3; // 30% of screen width
    return Math.min(Math.abs(progress) / maxProgress, 1);
  }, []);

  return (
    <>
      {/* GALLERY GRID */}
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
                  ${focusedImage === project.id ? "bg-black/40" : "bg-black/0"}`}
              >
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center 
                    transition-opacity duration-300 text-white text-center p-4
                    md:opacity-0 md:group-hover:opacity-100
                    ${focusedImage === project.id ? "opacity-100" : "opacity-0"}`}
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

      {/* LIGHTBOX / MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 md:top-[80px] bg-[#faf9f6] z-[200] md:z-50">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 z-[201] block 
              md:bg-transparent md:shadow-none bg-white rounded-full shadow-md
              w-8 h-8 flex items-center justify-center"
            onClick={closeGallery}
          >
            <div className="w-4 h-4 flex flex-col justify-center relative">
              <span className="w-full h-[1.5px] bg-black absolute rotate-45" />
              <span className="w-full h-[1.5px] bg-black absolute -rotate-45" />
            </div>
          </button>

          {/* Prev Arrow + Title (Desktop only) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
            <div className="relative pl-6 cursor-pointer w-full" onClick={navigateToPrev}>
              <button
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 absolute top-1/2 -translate-y-1/2 group-hover:opacity-0"
              >
                <span className="text-3xl">←</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-[180px]">
                <h3 className="text-xs font-medium tracking-wider mb-1">
                  {t(`${getAdjacentProject("prev").id}.title`)}
                </h3>
                <p className="text-[11px] font-light">
                  {t(`${getAdjacentProject("prev").id}.description`)}
                </p>
                <span className="text-lg block mt-2">←</span>
              </div>
            </div>
          </div>

          {/* Next Arrow + Title (Desktop only) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
            <div className="relative pr-6 cursor-pointer w-full" onClick={navigateToNext}>
              <button
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 absolute top-1/2 -translate-y-1/2 right-6 group-hover:opacity-0"
              >
                <span className="text-3xl">→</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-right w-[180px]">
                <h3 className="text-xs font-medium tracking-wider mb-1">
                  {t(`${getAdjacentProject("next").id}.title`)}
                </h3>
                <p className="text-[11px] font-light">
                  {t(`${getAdjacentProject("next").id}.description`)}
                </p>
                <span className="text-lg block mt-2">→</span>
              </div>
            </div>
          </div>

          {/* MODAL CONTENT WRAPPER */}
          <div
            className="relative w-full h-full flex flex-col items-center"
            // Stop click propagation so clicking inside doesn't close the modal
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Info */}
            <div className="hidden md:block w-full text-center -mt-2">
              <div className="w-full text-center bg-[#faf9f6]/80 py-1.5">
                <h3 className="text-[11px] md:text-xs font-medium tracking-wider mb-0.5 whitespace-nowrap">
                  {t(`${selectedImage.id}.title`)}
                </h3>
                <p className="text-[10px] md:text-[11px] font-light whitespace-nowrap">
                  {t(`${selectedImage.id}.description`)}
                </p>
              </div>
            </div>

            {/* IMAGE (with swipe handlers) */}
            <div
              className="relative w-full md:w-[1000px] lg:w-[1200px] xl:w-[1400px] 2xl:w-[1600px]
                h-[calc(100vh-128px)] md:h-[calc(100vh-105px)]
                mx-auto overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={selectedImage.imageUrl}
                alt={t(`${selectedImage.id}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover md:object-contain mx-auto"
                style={{ transform: `translateX(${-swipeProgress}px)` }}
                priority
                quality={75}
                loading="eager"
              />
            </div>

            {/* Next/Prev Images for Swipe Transition */}
            {Math.abs(swipeProgress) > 0 && (
              <div className="absolute inset-0 h-[calc(100vh-128px)] md:h-[calc(100vh-80px)]">
                {/* Only show transition image if we're not at the boundaries */}
                {(() => {
                  const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
                  const isFirst = currentIndex === 0;
                  const isLast = currentIndex === projects.length - 1;
                  
                  // Don't show prev image if we're at first
                  if (swipeProgress < 0 && isFirst) return null;
                  // Don't show next image if we're at last
                  if (swipeProgress > 0 && isLast) return null;

                  return (
                    <Image
                      src={getAdjacentProject(swipeProgress > 0 ? "next" : "prev").imageUrl}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover md:object-contain mx-auto"
                      style={{
                        transform: `translateX(${
                          swipeProgress > 0
                            ? window.innerWidth - swipeProgress
                            : -window.innerWidth - swipeProgress
                        }px)`,
                        opacity: 1,
                      }}
                      priority
                      quality={75}
                    />
                  );
                })()}
              </div>
            )}

            {/* Direction Hint Arrow */}
            {showDirectionHint && (
              <div 
                className="absolute inset-y-0 pointer-events-none flex items-center"
                style={{
                  ...(showDirectionHint === 'left' 
                    ? { right: '20px' }  // Show on right when swiping from last
                    : { left: '20px' })  // Show on left when swiping from first
                }}
              >
                <span className={`text-5xl text-black/80 ${
                  showDirectionHint === 'left' ? 'rotate-180' : ''
                }`}
                style={{
                  opacity: Math.min(Math.abs(swipeProgress) / 50, 1)
                }}>
                  →
                </span>
              </div>
            )}

            {/* MOBILE CONTROLS + INFO */}
            <div className="fixed left-0 right-0 bottom-0 h-36 bg-[#faf9f6] flex flex-col justify-center items-center md:hidden">
              <style>{swiperStyles}</style>
              <Swiper
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  type: "bullets",
                  dynamicBullets: true,
                  dynamicMainBullets: 1,
                }}
                preventClicksPropagation={true}
                preventClicks={true}
                allowTouchMove={false}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setTimeout(() => {
                    const currentIndex = projects.findIndex((p) => p.id === selectedImage.id);
                    swiper.slideTo(currentIndex, 0);
                  }, 0);
                }}
                onSlideChange={(swiper) => {
                  const newIndex = swiper.activeIndex;
                  setSelectedImage(projects[newIndex]);
                }}
                spaceBetween={50}
                slidesPerView={1}
                loop={false}
                initialSlide={projects.findIndex((p) => p.id === selectedImage.id)}
                className="h-8 mb-4 w-full"
              >
                {projects.map((project, index) => (
                  <SwiperSlide key={project.id}>
                    <div className="text-center opacity-0 h-full">{index + 1}</div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="px-4 text-center">
                <h3 className="text-sm font-medium tracking-wider mb-1">
                  {t(`${selectedImage.id}.title`)}
                </h3>
                <p className="text-xs font-light">{t(`${selectedImage.id}.description`)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRELOAD NEXT AND PREVIOUS IMAGES */}
      {selectedImage && (
        <>
          <link rel="preload" as="image" href={getAdjacentProject("next").imageUrl} />
          <link rel="preload" as="image" href={getAdjacentProject("prev").imageUrl} />
        </>
      )}
    </>
  );
}
