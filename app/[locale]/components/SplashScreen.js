'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  
  useEffect(() => {
    let isNavigating = false;
    let hasVisited = false;
    
    // Use try-catch to handle potential storage errors
    try {
      // Check sessionStorage first
      isNavigating = sessionStorage.getItem('isNavigating') === 'true';
      hasVisited = sessionStorage.getItem('hasVisited') === 'true';
      
      // If not found in sessionStorage, check localStorage as backup
      if (!hasVisited) {
        hasVisited = localStorage.getItem('hasVisited') === 'true';
      }
      
      // Set the flag for future navigations
      if (!isNavigating && !hasVisited) {
        sessionStorage.setItem('hasVisited', 'true');
        localStorage.setItem('hasVisited', 'true');
      }
      
      // Clear the navigation flag if it exists
      if (isNavigating) {
        sessionStorage.removeItem('isNavigating');
      }
    } catch (error) {
      console.error('Error accessing storage:', error);
    }
    
    // Skip splash screen if navigating between pages or returning visitor
    if (isNavigating || hasVisited) {
      setIsLoading(false);
      setShowTitle(false);
    } else {
      // Show splash screen for initial load
      const timer1 = setTimeout(() => {
        setShowTitle(true);
      }, 300);
      
      const timer2 = setTimeout(() => {
        setIsLoading(false);
      }, 1800);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className={`transition-opacity duration-500 ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl text-primary">CARLOTA VILAMALA</h1>
      </div>
    </div>
  );
} 