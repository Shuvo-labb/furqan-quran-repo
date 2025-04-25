'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SettingsSidebar from './SettingsSidebar';
import { Menu, X, BookOpen, Settings, Search } from 'lucide-react';
import Image from 'next/image';

// Helper function to conditionally join classNames
function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Track scrolling to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <div className="logo-container">
              <Link href="/" className="site-logo">
                <BookOpen className="logo-icon" />
                <span className="font-bold text-xl">Furqan</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="site-nav">
              <div className="nav-links">
                <Link 
                  href="/" 
                  className={classNames(
                    "nav-link",
                    pathname === "/" ? "active" : ""
                  )}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={classNames(
                    "nav-link",
                    pathname === "/about" ? "active" : ""
                  )}
                >
                  About
                </Link>
                <a 
                  href="https://github.com/Shuvo-labb/furqan-quran-repo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <input 
                    type="text"
                    placeholder="Search surah..." 
                    className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all w-40 focus:w-56"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                <button
                  onClick={toggleSidebar}
                  className="btn btn-outline flex items-center gap-1"
                  aria-label="Open Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">Settings</span>
                </button>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="mobile-menu-button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="menu-icon" />
              ) : (
                <Menu className="menu-icon" />
              )}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="relative mb-4">
                <input 
                  type="text"
                  placeholder="Search surah..." 
                  className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 pl-10 text-sm w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="mobile-nav-links">
                <Link 
                  href="/" 
                  className={classNames(
                    "mobile-nav-link",
                    pathname === "/" ? "active" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={classNames(
                    "mobile-nav-link",
                    pathname === "/about" ? "active" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <a 
                  href="https://github.com/Shuvo-labb/furqan-quran-repo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-nav-link flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                
                <div className="mobile-auth-container mt-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSidebarOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-3 rounded-md hover:from-teal-600 hover:to-teal-700 transition-colors font-medium"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Settings Sidebar */}
      <SettingsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}