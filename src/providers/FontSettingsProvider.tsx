'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSizes = {
  arabicText: string;
  englishText: string;
};

interface FontSettingsContextType {
  fontSizes: FontSizes;
  setArabicFontSize: (size: string) => void;
  setEnglishFontSize: (size: string) => void;
}

const defaultFontSizes: FontSizes = {
  arabicText: 'text-2xl md:text-3xl',
  englishText: 'text-base',
};

const FontSettingsContext = createContext<FontSettingsContextType | undefined>(undefined);

export function FontSettingsProvider({ children }: { children: ReactNode }) {
  // Always initialize with default values first to prevent hydration mismatch
  const [fontSizes, setFontSizes] = useState<FontSizes>(defaultFontSizes);
  const [isInitialized, setIsInitialized] = useState(false);

  // Then load from localStorage only after client-side hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('fontSettings');
      if (savedSettings) {
        setFontSizes(JSON.parse(savedSettings));
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when settings change, but only after initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('fontSettings', JSON.stringify(fontSizes));
    }
  }, [fontSizes, isInitialized]);

  const setArabicFontSize = (size: string) => {
    setFontSizes(prev => ({ ...prev, arabicText: size }));
  };

  const setEnglishFontSize = (size: string) => {
    setFontSizes(prev => ({ ...prev, englishText: size }));
  };

  return (
    <FontSettingsContext.Provider value={{ fontSizes, setArabicFontSize, setEnglishFontSize }}>
      {children}
    </FontSettingsContext.Provider>
  );
}

export function useFontSettings() {
  const context = useContext(FontSettingsContext);
  if (context === undefined) {
    throw new Error('useFontSettings must be used within a FontSettingsProvider');
  }
  return context;
}