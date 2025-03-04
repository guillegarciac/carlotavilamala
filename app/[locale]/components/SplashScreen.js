'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  
  useEffect(() => {
    // Show splash screen animation
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
  }, []);

  // If not loading, don't render anything
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className={`transition-opacity duration-500 ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl text-primary">CARLOTA VILAMALA</h1>
      </div>
    </div>
  );
} 