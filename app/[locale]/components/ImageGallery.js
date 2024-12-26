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
import { useInView } from 'react-intersection-observer';
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Footer from "./Footer";
import { useTheme } from '../context/ThemeContext';
import dynamic from 'next/dynamic';

// Create a separate ProjectItem component to handle individual projects
const ProjectItem = ({ project, onSelect, t, preloadProjectImages, projectRefs, focusedImage }) => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      preloadProjectImages(project);
    }
  }, [inView, project, preloadProjectImages]);

  const setRefs = useCallback(
    (element) => {
      ref(element);
      projectRefs.current.set(project.id, element);
    },
    [ref, project.id, projectRefs]
  );

  return (
    <div
      key={project.id}
      ref={setRefs}
      data-project-id={project.id}
      className="group cursor-pointer"
      onClick={() => onSelect(project)}
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
  );
};

export default function ImageGallery({ projects }) {
  const t = useTranslations("projects");
  const g = useTranslations("gallery");
  const router = useRouter();
  const { selectedImage, setSelectedImage, setIsGalleryOpen, setGalleryTitle } = useGallery();
  const [focusedImage, setFocusedImage] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const projectRefs = useRef(new Map());
  const swiperRef = useRef(null);

  // Track swipe start/end points for mobile swiping between images
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const [minSwipeDistance, setMinSwipeDistance] = useState(0);

  // Add this near other state declarations
  const [isScrolled, setIsScrolled] = useState(false);

  // Add this with other refs
  const detailImagesRef = useRef(null);

  // Replace the direct state with a ref for initial render
  const isMobileRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Add this ref to track scroll state
  const isScrolledRef = useRef(false);

  // Move all window-dependent code into useEffect
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add this state to track if we've already auto-scrolled
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  // Reset hasAutoScrolled when selected image changes
  useEffect(() => {
    setHasAutoScrolled(false);
  }, [selectedImage]);

  // Modify the handleScroll function
  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    
    // Only update title on desktop
    if (window.innerWidth >= 768) {
      isScrolledRef.current = scrollTop > 100;
      if (isScrolledRef.current) {
        // Only update if the title needs to change
        const newTitle = t(`${selectedImage.id}.title`);
        setGalleryTitle(prev => prev !== newTitle ? newTitle : prev);
      } else if (!isScrolledRef.current && scrollTop <= 100) {
        setGalleryTitle(null);
      }
    }

    // Reset hasAutoScrolled when user scrolls back to top
    if (scrollTop < 20) {
      setShowScrollIndicator(true);
      setHasAutoScrolled(false);  // Reset when at top
    } else {
      setShowScrollIndicator(false);
      
      // Only auto-scroll if we haven't done it yet and we're on client-side
      if (isClient && 
          isMobileRef.current && 
          !hasAutoScrolled &&
          scrollTop > 50 && 
          selectedImage?.detailImages?.length > 0 && 
          detailImagesRef.current) {
        detailImagesRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        setHasAutoScrolled(true);
      }
    }
  }, [selectedImage, t, setGalleryTitle, hasAutoScrolled, isClient]);

  // Instead, just reset the scroll indicator when image changes
  useEffect(() => {
    setShowScrollIndicator(true);
  }, [selectedImage]);

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
      // Initialize gallery title based on scroll position
      setGalleryTitle(null);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      setIsGalleryOpen(false);
      setGalleryTitle(null);
    };
  }, [selectedImage, setIsGalleryOpen, setGalleryTitle]);

  // Modify the intersection observer effect
  useEffect(() => {
    if (!isClient || !isMobileRef.current) return;

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
  }, [isClient]);

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
    // Check current scroll position directly
    const isScrolled = modalRef.current?.scrollTop > 100;
    if (window.innerWidth >= 768 && isScrolled) {
      setGalleryTitle(t(`${projects[nextIndex].id}.title`));
    }
    swiperRef.current?.slideToLoop(nextIndex);
  }, [selectedImage, projects, t, setGalleryTitle]);

  const navigateToPrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    setSelectedImage(projects[prevIndex]);
    // Check current scroll position directly
    const isScrolled = modalRef.current?.scrollTop > 100;
    if (window.innerWidth >= 768 && isScrolled) {
      setGalleryTitle(t(`${projects[prevIndex].id}.title`));
    }
    swiperRef.current?.slideToLoop(prevIndex);
  }, [selectedImage, projects, t, setGalleryTitle]);

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
      background: var(--text-primary);
      opacity: 0.2;
    }
    .swiper-pagination-bullet-active {
      background: var(--accent-color);
      opacity: 1;
    }
  `;

  // First add this new state near the other state declarations
  const [showDirectionHint, setShowDirectionHint] = useState(null); // 'left' or 'right'

  // First, calculate the hint opacity based on swipe progress
  const getHintOpacity = useCallback((progress) => {
    const maxProgress = window.innerWidth * 0.3; // 30% of screen width
    return Math.min(Math.abs(progress) / maxProgress, 1);
  }, []);

  // Add this function inside ImageGallery component
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  };

  // Add this near other state declarations
  const [loadedProjects, setLoadedProjects] = useState(new Set());

  // Add this function to handle preloading of detail images
  const preloadProjectImages = useCallback(async (project) => {
    if (!project || loadedProjects.has(project.id)) return;

    try {
      // Check if project has detail images
      if (project.detailImages && project.detailImages.length > 0) {
        await Promise.all(
          project.detailImages.map(imagePath => 
            preloadImage(imagePath).catch(err => 
              console.warn(`Failed to preload image ${imagePath}:`, err)
            )
          )
        );
        setLoadedProjects(prev => new Set([...prev, project.id]));
      }
    } catch (error) {
      console.error(`Error preloading images for project ${project.id}:`, error);
    }
  }, [loadedProjects]);

  // Add this effect near other useEffects
  useEffect(() => {
    if (selectedImage) {
      // Preload current project's detail images
      preloadProjectImages(selectedImage);
      
      // Preload next project's detail images
      const nextProject = getAdjacentProject("next");
      preloadProjectImages(nextProject);
      
      // Preload previous project's detail images
      const prevProject = getAdjacentProject("prev");
      preloadProjectImages(prevProject);
    }
  }, [selectedImage, getAdjacentProject, preloadProjectImages]);

  // Add these state declarations near the other states
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const modalRef = useRef(null);

  const { isDarkMode } = useTheme();

  // Conditionally render mobile-specific elements
  const renderMobileControls = () => {
    if (!isClient || !isMobileRef.current) return null;
    
    return (
      <div className="w-screen bg-primary flex flex-col md:hidden relative z-[500] h-52 -mt-36 touch-auto">
        {/* Dots and Title in one container */}
        <div className="flex flex-col h-full pt-2">
          {/* Dots at the top */}
          <div>
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
              className="h-6 w-full"
            >
              {projects.map((project, index) => (
                <SwiperSlide key={project.id}>
                  <div className="text-center opacity-0 h-full">{index + 1}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Title closer to dots */}
          <div className="mt-1">
            <div className="px-4 text-center">
              <h3 className="text-sm font-medium tracking-wider mb-1">
                {t(`${selectedImage.id}.title`)}
              </h3>
              <p className="text-xs font-light mb-2">{t(`${selectedImage.id}.description`)}</p>
              
              {/* Scroll indicator centered below year */}
              {showScrollIndicator && selectedImage.detailImages?.length > 0 && (
                <div className="flex justify-center items-center mt-2">
                  <IoIosArrowDown 
                    size={14} 
                    className={`animate-bounce ${isDarkMode ? 'text-white' : 'text-black'}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add an effect to reset the gallery title when the modal is closed
  useEffect(() => {
    if (!selectedImage) {
      isScrolledRef.current = false;
      setGalleryTitle(null);
    }
  }, [selectedImage, setGalleryTitle]);

  // Add this effect to maintain scroll state and title when image changes
  useEffect(() => {
    if (selectedImage && modalRef.current) {
      const isScrolled = modalRef.current.scrollTop > 100;
      isScrolledRef.current = isScrolled;
      
      if (isScrolled && window.innerWidth >= 768) {
        setGalleryTitle(t(`${selectedImage.id}.title`));
      }
    }
  }, [selectedImage, t, setGalleryTitle]);

  return (
    <>
      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 -mt-4">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onSelect={setSelectedImage}
            t={t}
            preloadProjectImages={preloadProjectImages}
            projectRefs={projectRefs}
            focusedImage={focusedImage}
          />
        ))}
      </div>

      {/* LIGHTBOX / MODAL */}
      {selectedImage && (
        <>
          {/* Close Button */}
          <button 
            onClick={closeGallery}
            className={`fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center 
              ${isDarkMode 
                ? 'bg-black hover:bg-black/80' 
                : 'bg-white hover:bg-white/80'} 
              rounded-full transition-colors shadow-md`}
            aria-label="Close gallery"
          >
            <IoClose 
              size={20} 
              className={isDarkMode ? 'text-white' : 'text-black'} 
            />
          </button>

          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="fixed inset-0 md:top-[85px] bg-primary md:z-40 overflow-y-auto overscroll-none"
            onScroll={handleScroll}
            style={{ 
              overscrollBehavior: 'none',
              touchAction: 'pan-y pinch-zoom'
            }}
          >
            <div className="relative w-full min-h-screen flex flex-col items-center">
              {/* Desktop Info */}
              <div className="hidden md:block w-full text-center -mt-2">
                <div className="w-full text-center bg-primary/80 py-1.5">
                  <h3 className="text-[11px] md:text-xs font-medium tracking-wider mb-0.5 whitespace-nowrap text-primary">
                    {t(`${selectedImage.id}.title`)}
                  </h3>
                  <p className="text-[10px] md:text-[11px] font-light whitespace-nowrap text-primary">
                    {t(`${selectedImage.id}.description`)}
                  </p>
                </div>
              </div>

              {/* Main Image Container with Navigation Arrows */}
              <div className="relative w-full md:w-[800px] lg:w-[1000px] xl:w-[1200px] 2xl:w-[1400px] px-24 md:px-[120px] lg:px-[160px] mx-auto">
                {/* Prev Arrow + Title (Desktop only) */}
                <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
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
                <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
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

                {/* Main Project Image */}
                <div 
                  className="h-[calc(100vh-80px)] md:h-[calc(100vh-105px)] mx-auto overflow-hidden touch-none md:touch-auto relative"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{ 
                    width: isMobileRef.current ? '100vw' : '100%',
                    left: isMobileRef.current ? '50%' : '0',
                    transform: isMobileRef.current ? 'translateX(-50%)' : 'none',
                    padding: '0 24px',
                  }}
                >
                  <Image
                    src={selectedImage.imageUrl}
                    alt={t(`${selectedImage.id}.title`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-cover md:object-contain mx-auto pointer-events-none md:pointer-events-auto"
                    style={{ 
                      transform: `translateX(${-swipeProgress}px)`,
                      touchAction: 'none',
                    }}
                    priority
                    quality={75}
                  />
                </div>
              </div>

              {renderMobileControls()}

              {/* Next/Prev Images for Swipe Transition */}
              {Math.abs(swipeProgress) > 0 && (
                <div className="fixed inset-0 top-0 md:top-[80px] z-[-1]">
                  {(() => {
                    const currentIndex = projects.findIndex(p => p.id === selectedImage.id);
                    const isFirst = currentIndex === 0;
                    const isLast = currentIndex === projects.length - 1;
                    
                    if (swipeProgress < 0 && isFirst) return null;
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
                  className="fixed inset-y-0 top-0 md:top-[80px] pointer-events-none flex items-center z-[201]"
                  style={{
                    ...(showDirectionHint === 'left' 
                      ? { right: '20px' }
                      : { left: '20px' })
                  }}
                >
                  <span 
                    className={`text-5xl text-black/80 ${showDirectionHint === 'left' ? 'rotate-180' : ''}`}
                    style={{
                      opacity: Math.min(Math.abs(swipeProgress) / 50, 1)
                    }}
                  >
                    →
                  </span>
                </div>
              )}

              {/* Detail Images Gallery */}
              {selectedImage.detailImages && selectedImage.detailImages.length > 0 && (
                <div 
                  ref={detailImagesRef}
                  className={`w-full overflow-y-auto mt-0 md:mt-[80px] bg-primary`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 
                    w-[80%] md:w-[800px] lg:w-[1000px] xl:w-[1200px] 2xl:w-[1400px] 
                    mx-auto px-0 md:px-[120px] lg:px-[160px]
                    pb-8 md:pb-12"
                  >
                    {selectedImage.detailImages.map((imagePath, index) => (
                      <div key={index} className="relative aspect-[3/4]">
                        <Image
                          src={imagePath}
                          alt={`${t(`${selectedImage.id}.title`)} - Detail ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          quality={75}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="hidden md:block w-full px-8">
                <Footer variant="simple" />
              </div>
            </div>
          </div>
        </>
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
