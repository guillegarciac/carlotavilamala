'use client';

import { createContext, useContext, useState } from 'react';

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState(null);

  return (
    <GalleryContext.Provider value={{ 
      isGalleryOpen, 
      setIsGalleryOpen,
      galleryTitle,
      setGalleryTitle
    }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  return useContext(GalleryContext);
} 