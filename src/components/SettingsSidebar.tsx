'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Settings } from 'lucide-react';
import { useFontSettings } from '@/providers/FontSettingsProvider';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { fontSizes, setArabicFontSize, setEnglishFontSize } = useFontSettings();

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent scrolling when sidebar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Theme options
  const themeOptions = [
    { label: 'Light Mode', value: 'light' },
    { label: 'Dark Mode', value: 'dark' },
    { label: 'System Default', value: 'system' }
  ];

  // Language options
  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Urdu', value: 'ur' }
  ];

  // Arabic size options
  const arabicSizeOptions = [
    { label: 'Small', value: 'text-xl md:text-2xl' },
    { label: 'Medium', value: 'text-2xl md:text-3xl' },
    { label: 'Large', value: 'text-3xl md:text-4xl' },
    { label: 'Extra Large', value: 'text-4xl md:text-5xl' }
  ];

  // English size options
  const englishSizeOptions = [
    { label: 'Small', value: 'text-sm' },
    { label: 'Medium', value: 'text-base' },
    { label: 'Large', value: 'text-lg' },
    { label: 'Extra Large', value: 'text-xl' }
  ];

  if (!isOpen) {
    return null; // Don't render anything if not open
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-80 max-w-full bg-gray-900 shadow-lg z-50 animate-slide-in-right"
      >
        <div className="p-5 h-full flex flex-col text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </h2>
            <button 
              onClick={onClose}
              className="rounded-full hover:bg-gray-700 transition-colors p-1"
              aria-label="Close settings"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Font Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Font Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  Arabic Text Size
                </label>
                <select 
                  value={fontSizes.arabicText}
                  onChange={(e) => setArabicFontSize(e.target.value)}
                  className="w-full rounded bg-gray-800 border-gray-700 text-white py-2 px-3 text-sm"
                >
                  {arabicSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  Translation Text Size
                </label>
                <select 
                  value={fontSizes.englishText}
                  onChange={(e) => setEnglishFontSize(e.target.value)}
                  className="w-full rounded bg-gray-800 border-gray-700 text-white py-2 px-3 text-sm"
                >
                  {englishSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Theme */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Theme</h3>
              <div className="space-y-2">
                {themeOptions.map((option) => (
                  <button 
                    key={option.value}
                    className="w-full text-center py-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Language */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Language</h3>
              <select className="w-full rounded bg-gray-800 border-gray-700 text-white py-2 px-3">
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Furqan © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}