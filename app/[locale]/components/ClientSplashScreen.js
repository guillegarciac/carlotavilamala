'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';

export default function ClientSplashScreen() {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();
  
  // Check if this is the home page (just the locale path)
  const pathParts = pathname.split('/').filter(Boolean);
  const isHomePage = pathParts.length === 1; // Only the locale segment
  
  useEffect(() => {
    // Only consider showing splash on home page
    if (!isHomePage) return;
    
    // Check if we're navigating from another page
    const isNavigating = sessionStorage.getItem('isNavigating') === 'true';
    
    // Check if this is a direct browser load (not navigation)
    const isDirectLoad = !isNavigating && !document.referrer.includes(window.location.host);
    
    // Check if this is the first visit ever
    const isFirstVisit = localStorage.getItem('hasVisitedSite') !== 'true';
    
    // Only show splash on direct browser load AND first visit
    if (isDirectLoad && isFirstVisit) {
      setShouldShow(true);
      
      // Mark as visited for future
      localStorage.setItem('hasVisitedSite', 'true');
    }
    
    // Always clear navigation flag after checking
    sessionStorage.removeItem('isNavigating');
  }, [isHomePage]);
  
  // Don't render anything if we shouldn't show the splash screen
  if (!shouldShow) return null;
  
  return <SplashScreen />;
} 