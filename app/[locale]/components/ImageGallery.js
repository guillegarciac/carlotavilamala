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
import Link from 'next/link';

// Define different layout patterns
const layoutPatterns = [
  // Single pattern for consistent grid layout
  {
    0: { type: 'standard', position: 'left' },
    1: { type: 'standard', position: 'center' },
    2: { type: 'standard', position: 'right' },
    3: { type: 'standard', position: 'left' },
    4: { type: 'standard', position: 'center' },
    5: { type: 'standard', position: 'right' }
  }
];

// Function to get a consistent random pattern based on project ID
const getLayoutPattern = (projectId) => {
  // Use project ID to get a consistent but random pattern
  const patternIndex = projectId % layoutPatterns.length;
  return layoutPatterns[patternIndex];
};

// Create a separate ProjectItem component to handle individual projects
const ProjectItem = ({ project, onSelect, t, preloadProjectImages, projectRefs, focusedImage, setFocusedImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hasMounted = useRef(false);
  
  // Use intersection observer to detect when project is in viewport on mobile
  const [ref, inView] = useInView({
    threshold: 0.8,
    triggerOnce: false
  });

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current) return;
    
    if (inView) {
      preloadProjectImages(project);
    }
  }, [inView, project, preloadProjectImages, focusedImage]);

  // Update isVisible when focusedImage changes
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (focusedImage === project.id || (isMobile && inView)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [focusedImage, project.id, inView]);

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
      ref={ref}
      data-project-id={project.id}
      className="group cursor-pointer"
      onClick={() => onSelect(project)}
      onMouseEnter={() => setFocusedImage(project.id)}
      onMouseLeave={() => setFocusedImage(null)}
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
            bg-black/0
            ${(focusedImage === project.id || isVisible) ? "bg-black/40" : "bg-black/0"}`}
        >
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center 
              transition-opacity duration-300 text-white text-center p-4
              opacity-0
              ${(focusedImage === project.id || isVisible) ? "opacity-100" : "opacity-0"}`}
          >
            <div className="transition-all duration-300">
              <h3 className="text-xs font-medium tracking-wider mb-1">
                {t(`${project.id}.title`)}
              </h3>
              <p className="text-[11px] font-light">
                {t(`${project.id}.description`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new component for desktop navigation with background
const DesktopNavigation = ({ direction, projectTitle }) => {
  return (
    <div 
      className={`hidden md:flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full
        ${direction === 'prev' ? 'hover:translate-x-[-4px]' : 'hover:translate-x-[4px]'}
        transition-transform duration-200`}
    >
      {direction === 'prev' && (
        <span className="text-lg transform rotate-180">→</span>
      )}
      <span className="text-sm tracking-wider text-primary">
        {projectTitle}
      </span>
      {direction === 'next' && (
        <span className="text-lg">→</span>
      )}
    </div>
  );
};

export default function ImageGallery({ items, type = 'projects', selectedItem, handleItemClick }) {
  const t = useTranslations(type);
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

  // Add this state near other state declarations
  const [showNextProject, setShowNextProject] = useState(false);

  // Modify the handleScroll function to detect when user reaches bottom
  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clientHeight = e.target.clientHeight;
    
    // Check if we're near the bottom (within 20px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 20;
    setShowNextProject(isNearBottom);
    
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
      const currentIndex = items.findIndex(p => p.id === selectedImage.id);
      if ((currentIndex === 0 && progress < -20) || 
          (currentIndex === items.length - 1 && progress > 20)) {
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

    const currentIndex = items.findIndex(p => p.id === selectedImage.id);
    
    // Only navigate if we're not at the boundaries
    if (isLeftSwipe && currentIndex < items.length - 1) {
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
    const currentIndex = items.findIndex((p) => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedImage(items[nextIndex]);
    
    // Scroll to top smoothly
    if (modalRef.current) {
      modalRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Check current scroll position directly
    const isScrolled = modalRef.current?.scrollTop > 100;
    if (window.innerWidth >= 768 && isScrolled) {
      setGalleryTitle(t(`${items[nextIndex].id}.title`));
    }
    swiperRef.current?.slideToLoop(nextIndex);
  }, [selectedImage, items, t, setGalleryTitle]);

  const navigateToPrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = items.findIndex((p) => p.id === selectedImage.id);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setSelectedImage(items[prevIndex]);
    
    // Scroll to top smoothly
    if (modalRef.current) {
      modalRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Check current scroll position directly
    const isScrolled = modalRef.current?.scrollTop > 100;
    if (window.innerWidth >= 768 && isScrolled) {
      setGalleryTitle(t(`${items[prevIndex].id}.title`));
    }
    swiperRef.current?.slideToLoop(prevIndex);
  }, [selectedImage, items, t, setGalleryTitle]);

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
      const currentIndex = items.findIndex((p) => p.id === selectedImage?.id);
      if (currentIndex === -1) return items[0];
      if (direction === "next") {
        return items[(currentIndex + 1) % items.length];
      } else {
        return items[currentIndex === 0 ? items.length - 1 : currentIndex - 1];
      }
    },
    [selectedImage, items]
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

  // PRELOAD IMAGES
  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      // Use link preload instead of Image constructor
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.onload = resolve;
      link.onerror = () => {
        // Silently resolve on error to prevent console warnings
        resolve();
      };
      document.head.appendChild(link);
    });
  }, []);

  // Add this near other state declarations
  const [loadedProjects, setLoadedProjects] = useState(new Set());

  // Add this function to handle preloading of detail images
  const preloadItemImages = useCallback((item) => {
    if (!item || loadedProjects.has(item.id)) return;

    // Add to loaded projects set
    setLoadedProjects(prev => new Set([...prev, item.id]));

    // Create an array of all images to preload
    const imagesToPreload = [
      item.imageUrl,
      ...(item.detailImages || [])
    ];

    // Preload images in sequence
    // Use Promise.all but ignore errors
    Promise.all(
      imagesToPreload.map(src => 
        preloadImage(src).catch(() => {
          // Silently ignore preload failures
        })
      )
    );
  }, [preloadImage, loadedProjects]);

  // Add this effect near other useEffects
  useEffect(() => {
    if (selectedImage) {
      // Preload current project's detail images
      preloadItemImages(selectedImage);
      
      // Preload next project's detail images
      const nextProject = getAdjacentProject("next");
      preloadItemImages(nextProject);
      
      // Preload previous project's detail images
      const prevProject = getAdjacentProject("prev");
      preloadItemImages(prevProject);
    }
  }, [selectedImage, getAdjacentProject, preloadItemImages]);

  // Add these state declarations near the other states
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const modalRef = useRef(null);

  const { isDarkMode } = useTheme();

  // Add this function to check if we're in visuals section
  const isVisualsSection = type === 'visuals';

  // Modify the renderMobileControls function
  const renderMobileControls = () => {
    if (!isClient || !isMobileRef.current) return null;
    
    return (
      <div className="w-screen bg-primary flex flex-col md:hidden relative z-[500] mt-4">
        <div className="flex flex-col h-full pt-4">
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
                  const currentIndex = items.findIndex((p) => p.id === selectedImage.id);
                  swiper.slideTo(currentIndex, 0);
                }, 0);
              }}
              onSlideChange={(swiper) => {
                const newIndex = swiper.activeIndex;
                setSelectedImage(items[newIndex]);
              }}
              spaceBetween={50}
              slidesPerView={1}
              loop={false}
              initialSlide={items.findIndex((p) => p.id === selectedImage.id)}
              className="h-6 w-full"
            >
              {items.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <div className="text-center opacity-0 h-full">{index + 1}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mt-1">
            <div className="px-4 text-center">
              <h3 className="text-sm font-medium tracking-wider mb-1">
                {t(`${selectedImage.id}.title`)}
              </h3>
              <p className="text-xs font-light mb-2">{t(`${selectedImage.id}.description`)}</p>
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

  // Add this near the other scroll indicator effect
  useEffect(() => {
    if (selectedImage?.detailImages?.length > 0) {
      setShowScrollIndicator(true);
    } else {
      setShowScrollIndicator(false);
    }
  }, [selectedImage]);

  // Update the renderNextProjectSection function
  const renderNextProjectSection = () => {
    if (!isClient || !isMobileRef.current) return null;
    
    return (
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-primary md:hidden z-[500] py-2 px-4 
          border-t border-primary/10 transition-transform duration-300
          ${showNextProject ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <button 
          onClick={navigateToNext}
          className="w-full text-left group"
        >
          <span className="text-[10px] uppercase tracking-wider text-primary/60 block mb-2">
            {t('next_project')}
          </span>
          <div className="flex justify-between items-center">
            <span className="text-sm tracking-wider">
              {t(`${getAdjacentProject("next").id}.title`)}
            </span>
            <span className="text-lg transform transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </button>
      </div>
    );
  };

  const getImageLayoutStyle = (index, projectId) => {
    const layouts = {
      // Standard size for all images
      standard: {
        container: 'w-[calc(100%-48px)] md:w-[30%] mb-8 md:mb-16 relative',
        image: 'w-full h-auto object-contain'
      }
    };

    const pattern = getLayoutPattern(projectId);
    const layout = pattern[index % 6];

    // Mobile layout stays consistent
    const mobileLayout = `w-[calc(100%-48px)] mx-auto mb-8 relative`;

    // Desktop layout with consistent spacing
    let desktopLayout = '';
    if (layout.position === 'left') {
      desktopLayout = `md:w-[30%] md:ml-[3%]`;
    } else if (layout.position === 'right') {
      desktopLayout = `md:w-[30%] md:mr-[3%]`;
    } else {
      desktopLayout = `md:w-[30%] md:mx-auto`;
    }

    return {
      ...layouts[layout.type],
      container: `${mobileLayout} ${desktopLayout} inline-block`
    };
  };

  // Function to calculate grid columns based on screen width
  const getGridColumns = () => {
    if (typeof window === 'undefined') return 5; // Default for SSR
    const width = window.innerWidth;
    if (width >= 1280) return 5;      // xl breakpoint
    if (width >= 1024) return 4;      // lg breakpoint
    if (width >= 768) return 3;       // md breakpoint
    return 1;                         // mobile
  };

  // Calculate number of placeholder items needed to maintain grid
  const calculatePlaceholders = (imagesLength, rowSize) => {
    const totalRows = Math.ceil(imagesLength / rowSize);
    const idealCount = totalRows * rowSize;
    return Array(idealCount - imagesLength).fill(null);
  };

  // Update placeholders when screen size changes
  useEffect(() => {
    const updatePlaceholders = () => {
      const columns = getGridColumns();
      const newPlaceholders = calculatePlaceholders(items.length, columns);
      setPlaceholders(newPlaceholders);
    };

    // Initial calculation
    updatePlaceholders();

    // Add event listener for resize
    window.addEventListener('resize', updatePlaceholders);

    // Cleanup
    return () => window.removeEventListener('resize', updatePlaceholders);
  }, [items.length]);

  const [placeholders, setPlaceholders] = useState([]);

  const PlaceholderItem = () => (
    <div 
      className="group relative aspect-[3/4] bg-black/5 dark:bg-white/5 cursor-pointer overflow-hidden"
      onClick={handlePlaceholderClick}
    >
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
        transition-opacity duration-500 z-10"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 
        group-hover:opacity-100 transition-opacity duration-500 z-10 text-center"
      >
        <h3 className="text-sm font-light tracking-[0.2em] text-white uppercase">
          {t('placeholder.title')}
        </h3>
        <p className="text-xs font-light mt-1 text-white/60 tracking-wider">
          {t('placeholder.description')}
        </p>
      </div>
    </div>
  );

  // Add this function to handle placeholder clicks
  const handlePlaceholderClick = () => {
    router.push('/contact');
  };

  return (
    <>
      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
        {items.map((item) => (
          <ProjectItem
            key={item.id}
            project={item}
            onSelect={setSelectedImage}
            t={t}
            preloadProjectImages={preloadItemImages}
            projectRefs={projectRefs}
            focusedImage={focusedImage}
            setFocusedImage={setFocusedImage}
          />
        ))}
        {placeholders.map((_, index) => (
          <PlaceholderItem key={`placeholder-${index}`} />
        ))}
      </div>

      {/* LIGHTBOX / MODAL */}
      {selectedImage && (
        <>
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className={`fixed top-4 right-4 z-[100] w-8 h-8 flex items-center justify-center 
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

          {/* Navigation Arrows with Background */}
          <div className="fixed z-[100] left-6 top-6 hidden md:block">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-lg transform rotate-180 mr-2">←</span>
              <span className="text-sm tracking-wider">
                {type === 'visuals' 
                  ? t(`visual${typeof selectedImage.id === 'string' && selectedImage.id.includes('visual') 
                      ? selectedImage.id.split('visual')[1] 
                      : selectedImage.id}.title`) 
                  : t(`${selectedImage.id}.title`)}
              </span>
            </div>
          </div>

          <div
            ref={modalRef}
            className={`fixed inset-0 z-50 bg-primary 
              ${isVisualsSection ? 'overflow-hidden' : 'overflow-y-auto overscroll-none'}
              ${isScrolled ? 'md:pt-[105px]' : 'md:pt-6'}
              ${isVisualsSection ? 'md:pb-6' : ''}`}
            onScroll={handleScroll}
          >
            {/* Main container - increase height for visuals */}
            <div className={`relative w-full flex flex-col 
              ${isVisualsSection ? 'h-[calc(100vh-20px)]' : 'min-h-screen'}`}
            >
              {/* Desktop Info */}
              <div className="hidden md:block w-full text-center -mt-2">
                <div className="w-full text-center bg-primary/80 py-1.5">
                  <h3 className="text-[11px] md:text-xs font-medium tracking-wider mb-0.5 whitespace-nowrap text-primary">
                    {type === 'visuals' 
                      ? t(`visual${typeof selectedImage.id === 'string' && selectedImage.id.includes('visual') 
                          ? selectedImage.id.split('visual')[1] 
                          : selectedImage.id}.title`) 
                      : t(`${selectedImage.id}.title`)}
                  </h3>
                  <p className="text-[10px] md:text-[11px] font-light whitespace-nowrap text-primary">
                    {type === 'visuals' 
                      ? t(`visual${typeof selectedImage.id === 'string' && selectedImage.id.includes('visual') 
                          ? selectedImage.id.split('visual')[1] 
                          : selectedImage.id}.description`) 
                      : t(`${selectedImage.id}.description`)}
                  </p>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative w-full md:w-[800px] lg:w-[1000px] xl:w-[1200px] 
                px-24 md:px-[120px] lg:px-[160px] mx-auto
                flex flex-col items-center"
              >
                {/* Prev Arrow + Title (Desktop only) */}
                <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden md:flex items-center group z-[60] max-w-[250px]">
                  <div className="relative pl-6 cursor-pointer w-full" onClick={navigateToPrev}>
                    <button
                      className="w-10 h-10 flex items-center justify-center transition-all duration-300 absolute top-1/2 -translate-y-1/2 group-hover:opacity-0"
                    >
                      <span className="text-3xl">←</span>
                    </button>
                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 inline-flex flex-col items-start 
                      ${isDarkMode ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-sm rounded px-4 py-2 
                      ${isDarkMode ? 'text-white' : 'text-primary'}`}
                    >
                      <h3 className="text-xs font-medium tracking-wider mb-1">
                        {type === 'visuals' 
                          ? t(`visual${typeof getAdjacentProject("prev").id === 'string' && getAdjacentProject("prev").id.includes('visual') 
                              ? getAdjacentProject("prev").id.split('visual')[1] 
                              : getAdjacentProject("prev").id}.title`) 
                          : t(`${getAdjacentProject("prev").id}.title`)}
                      </h3>
                      <p className="text-[11px] font-light">
                        {type === 'visuals' 
                          ? t(`visual${typeof getAdjacentProject("prev").id === 'string' && getAdjacentProject("prev").id.includes('visual') 
                              ? getAdjacentProject("prev").id.split('visual')[1] 
                              : getAdjacentProject("prev").id}.description`) 
                          : t(`${getAdjacentProject("prev").id}.description`)}
                      </p>
                      <span className="text-lg mt-1">←</span>
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
                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 text-right inline-flex flex-col items-end 
                      ${isDarkMode ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-sm rounded px-4 py-2 
                      ${isDarkMode ? 'text-white' : 'text-primary'}`}
                    >
                      <h3 className="text-xs font-medium tracking-wider mb-1">
                        {type === 'visuals' 
                          ? t(`visual${typeof getAdjacentProject("next").id === 'string' && getAdjacentProject("next").id.includes('visual') 
                              ? getAdjacentProject("next").id.split('visual')[1] 
                              : getAdjacentProject("next").id}.title`) 
                          : t(`${getAdjacentProject("next").id}.title`)}
                      </h3>
                      <p className="text-[11px] font-light">
                        {type === 'visuals' 
                          ? t(`visual${typeof getAdjacentProject("next").id === 'string' && getAdjacentProject("next").id.includes('visual') 
                              ? getAdjacentProject("next").id.split('visual')[1] 
                              : getAdjacentProject("next").id}.description`) 
                          : t(`${getAdjacentProject("next").id}.description`)}
                      </p>
                      <span className="text-lg mt-1">→</span>
                    </div>
                  </div>
                </div>

                {/* Main Image */}
                <div 
                  className={`${isVisualsSection 
                    ? 'h-[calc(100vh-200px)] md:h-[calc(100vh-165px)] mx-auto overflow-hidden touch-none md:touch-auto relative flex items-center justify-center' 
                    : 'h-[calc(100vh-200px)] md:h-[calc(100vh-165px)] mx-auto overflow-hidden touch-none md:touch-auto relative'}`}
                  style={{ 
                    width: isMobileRef.current ? '100vw' : '100%',
                    left: isMobileRef.current ? '50%' : '0',
                    transform: isMobileRef.current ? 'translateX(-50%)' : 'none',
                    padding: '0 24px',
                  }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <Image
                    src={selectedImage.imageUrl}
                    alt={type === 'visuals' 
                      ? t(`visual${typeof selectedImage.id === 'string' && selectedImage.id.includes('visual') 
                          ? selectedImage.id.split('visual')[1] 
                          : selectedImage.id}.title`) 
                      : t(`${selectedImage.id}.title`)}
                    fill={!isVisualsSection}
                    width={isVisualsSection ? 1200 : undefined}
                    height={isVisualsSection ? 800 : undefined}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className={`${isVisualsSection 
                      ? 'w-auto h-auto max-h-full max-w-full object-contain pointer-events-none md:pointer-events-auto' 
                      : 'object-cover md:object-contain mx-auto pointer-events-none md:pointer-events-auto'}`}
                    style={{ 
                      transform: `translateX(${-swipeProgress}px)`,
                      touchAction: 'none',
                    }}
                    priority
                    quality={75}
                  />
                </div>

                {/* Mobile Controls - Centered below image */}
                {isMobileRef.current && (
                  <div className="w-full flex flex-col items-center mt-8 md:hidden">
                    <div className="w-[200px]"> {/* Fixed width container for swiper */}
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
                            const currentIndex = items.findIndex((p) => p.id === selectedImage.id);
                            swiper.slideTo(currentIndex, 0);
                          }, 0);
                        }}
                        onSlideChange={(swiper) => {
                          const newIndex = swiper.activeIndex;
                          setSelectedImage(items[newIndex]);
                        }}
                        spaceBetween={50}
                        slidesPerView={1}
                        loop={false}
                        initialSlide={items.findIndex((p) => p.id === selectedImage.id)}
                        className="h-6 w-full"
                      >
                        {items.map((item, index) => (
                          <SwiperSlide key={item.id}>
                            <div className="text-center opacity-0 h-full">{index + 1}</div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    <div className="text-center mt-4">
                      <h3 className="text-sm font-medium tracking-wider mb-2 px-8 whitespace-nowrap">
                        {t(`${selectedImage.id}.title`)}
                      </h3>
                      <p className="text-xs font-light mb-12">
                        {t(`${selectedImage.id}.description`)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer for visuals */}
              {isVisualsSection && (
                <div className="hidden md:block w-full px-8 mt-auto mb-4">
                  <Footer variant="simple" />
                </div>
              )}

              {/* Detail Images Gallery - only for projects */}
              {!isVisualsSection && selectedImage.detailImages && selectedImage.detailImages.length > 0 && (
                <div 
                  ref={detailImagesRef}
                  className="w-full overflow-y-auto mt-0 md:mt-[80px] bg-primary pb-24 md:pb-12 px-6 md:px-0"
                >
                  <div className="relative w-full max-w-[2400px] mx-auto">
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-8">
                      {selectedImage.detailImages.map((imagePath, index) => {
                        const layoutStyles = getImageLayoutStyle(index, selectedImage.id);
                        return (
                          <div 
                            key={index} 
                            className="relative w-full aspect-[3/4]"
                          >
                            <div className="relative w-full h-full overflow-hidden">
                              <Image
                                src={imagePath}
                                alt={`${t(`${selectedImage.id}.title`)} - Detail ${index + 1}`}
                                width={2400}
                                height={1800}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                                className="w-full h-full object-cover"
                                style={{
                                  objectPosition: 'center center'
                                }}
                                priority={index < 4}
                                quality={95}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer for projects */}
              {!isVisualsSection && (
                <div className="hidden md:block w-full px-8">
                  <Footer variant="simple" />
                </div>
              )}

              {/* Next/Prev Images for Swipe Transition */}
              {Math.abs(swipeProgress) > 0 && (
                <div className="fixed inset-0 top-0 md:top-[80px] z-[-1]">
                  {(() => {
                    const currentIndex = items.findIndex(p => p.id === selectedImage.id);
                    const isFirst = currentIndex === 0;
                    const isLast = currentIndex === items.length - 1;
                    
                    if (swipeProgress < 0 && isFirst) return null;
                    if (swipeProgress > 0 && isLast) return null;

                    return (
                      <div 
                        className={`${isVisualsSection 
                          ? 'h-[calc(100vh-200px)] md:h-[calc(100vh-165px)] mx-auto overflow-hidden relative flex items-center justify-center' 
                          : 'h-[calc(100vh-200px)] md:h-[calc(100vh-165px)] mx-auto overflow-hidden relative'}`}
                        style={{ 
                          width: isMobileRef.current ? '100vw' : '100%',
                          left: isMobileRef.current ? '50%' : '0',
                          transform: isMobileRef.current ? 'translateX(-50%)' : 'none',
                          padding: '0 24px',
                        }}
                      >
                        <Image
                          src={getAdjacentProject(swipeProgress > 0 ? "next" : "prev").imageUrl}
                          alt=""
                          fill={!isVisualsSection}
                          width={isVisualsSection ? 1200 : undefined}
                          height={isVisualsSection ? 800 : undefined}
                          sizes="100vw"
                          className={`${isVisualsSection 
                            ? 'w-auto h-auto max-h-full max-w-full object-contain mx-auto' 
                            : 'object-cover md:object-contain mx-auto'}`}
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
                      </div>
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

              {/* Add the Next Project section to the modal content */}
              {renderNextProjectSection()}
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
