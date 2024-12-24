'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const closeGallery = useCallback(() => {
    try {
      // Reset all states
      setSelectedImage(null);
      setIsGalleryOpen(false);
      setGalleryTitle(null);
      
      // Reset body styles
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
      
      // Navigate back to projects page
      setTimeout(() => {
        router.push('/');
      }, 0);
    } catch (error) {
      console.error('Error in closeGallery:', error);
      // Fallback close
      setSelectedImage(null);
      setIsGalleryOpen(false);
      setGalleryTitle(null);
    }
  }, [router]);

  return (
    <GalleryContext.Provider value={{ 
      isGalleryOpen, 
      setIsGalleryOpen,
      galleryTitle,
      setGalleryTitle,
      selectedImage,
      setSelectedImage,
      closeGallery
    }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  return useContext(GalleryContext);
} 