'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Get theme from localStorage or system preference
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    
    // First check temporary theme (during language change)
    const tempTheme = sessionStorage.getItem('tempTheme');
    if (tempTheme) {
      // Store it in localStorage to persist
      localStorage.setItem('theme', tempTheme);
      // Clear temporary theme
      sessionStorage.removeItem('tempTheme');
      // Apply theme class
      document.documentElement.classList.toggle('dark', tempTheme === 'dark');
      return tempTheme === 'dark';
    }
    
    // Then check localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // Apply theme class
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      return savedTheme === 'dark';
    }
    
    // Finally, check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', systemPrefersDark);
    return systemPrefersDark;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Ensure theme is applied on mount
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 