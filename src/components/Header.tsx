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
                <Link 
                  href="/features" 
                  className={classNames(
                    "nav-link",
                    pathname === "/features" ? "active" : ""
                  )}
                >
                  Features
                </Link>
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
                <Link 
                  href="/features" 
                  className={classNames(
                    "mobile-nav-link",
                    pathname === "/features" ? "active" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                
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