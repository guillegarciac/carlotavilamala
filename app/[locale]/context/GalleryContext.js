'use client';

import { createContext, useContext, useState } from 'react';

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <GalleryContext.Provider value={{ isGalleryOpen, setIsGalleryOpen }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  return useContext(GalleryContext);
} 