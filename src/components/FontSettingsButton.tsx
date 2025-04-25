'use client';
import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useFontSettings } from '@/providers/FontSettingsProvider';

interface FontSettingsButtonProps {
  showLabel?: boolean;
}

export default function FontSettingsButton({ showLabel = false }: FontSettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSizes, setArabicFontSize, setEnglishFontSize } = useFontSettings();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const arabicSizeOptions = [
    { label: 'Small', value: 'text-xl md:text-2xl' },
    { label: 'Medium', value: 'text-2xl md:text-3xl' },
    { label: 'Large', value: 'text-3xl md:text-4xl' },
    { label: 'Extra Large', value: 'text-4xl md:text-5xl' }
  ];

  const englishSizeOptions = [
    { label: 'Small', value: 'text-sm' },
    { label: 'Medium', value: 'text-base' },
    { label: 'Large', value: 'text-lg' },
    { label: 'Extra Large', value: 'text-xl' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {showLabel ? (
        <div className="w-full">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arabic Text Size
            </label>
            <select 
              value={fontSizes.arabicText}
              onChange={(e) => setArabicFontSize(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-3 text-sm"
            >
              {arabicSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Translation Text Size
            </label>
            <select 
              value={fontSizes.englishText}
              onChange={(e) => setEnglishFontSize(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-3 text-sm"
            >
              {englishSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1"
            aria-label="Font Settings"
          >
            <Settings className="h-5 w-5" />
            <span className="hidden md:inline">Settings</span>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Font Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arabic Text Size
                </label>
                <select 
                  value={fontSizes.arabicText}
                  onChange={(e) => setArabicFontSize(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-3 text-sm"
                >
                  {arabicSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Translation Text Size
                </label>
                <select 
                  value={fontSizes.englishText}
                  onChange={(e) => setEnglishFontSize(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-3 text-sm"
                >
                  {englishSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}