"use client";

import { useEffect } from 'react';
import { useGallery } from '../context/GalleryContext';
import ImageGallery from '../components/ImageGallery';
import { useTranslations } from 'next-intl';
import Navigation from "../components/Navigation";
import { visuals as visualsData } from '../data/visuals.js';

export default function VisualsPage() {
  const { setSelectedImage, isGalleryOpen, setIsGalleryOpen } = useGallery();
  const t = useTranslations('visuals');

  // This effect will run on initial page load
  useEffect(() => {
    // If there are visuals, automatically select the first one
    if (visualsData && visualsData.length > 0) {
      // Use a small timeout to ensure the component is fully mounted
      setTimeout(() => {
        setSelectedImage(visualsData[0]);
        // If we came from a navigation click or if gallery should be open
        if (isGalleryOpen) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        }
      }, 100);
    }
    
    // Cleanup function
    return () => {
      // Reset body styles when component unmounts
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [setSelectedImage, isGalleryOpen, setIsGalleryOpen]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="px-8 pt-24 md:pt-20 transition-opacity duration-[800ms] delay-[400ms]
        opacity-0 animate-fadeIn"
      >
        <ImageGallery 
          items={visualsData} 
          type="visuals"
        />
      </main>
    </div>
  );
} 