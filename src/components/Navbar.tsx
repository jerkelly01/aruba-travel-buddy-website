'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAttractionsOpen, setIsAttractionsOpen] = useState(false);
  const [isAttractionsMobileOpen, setIsAttractionsMobileOpen] = useState(false);
  const [isTravelTipsOpen, setIsTravelTipsOpen] = useState(false);
  const [isTravelTipsMobileOpen, setIsTravelTipsMobileOpen] = useState(false);
  const [isRentalsOpen, setIsRentalsOpen] = useState(false);
  const [isRentalsMobileOpen, setIsRentalsMobileOpen] = useState(false);
  const pathname = usePathname();
  const attractionsDropdownRef = useRef<HTMLDivElement>(null);
  const travelTipsDropdownRef = useRef<HTMLDivElement>(null);
  const rentalsDropdownRef = useRef<HTMLDivElement>(null);
  
  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
  ];

  const attractionsSubLinks = [
    { name: 'Tours', href: '/tours' },
    { name: 'Cultural Events', href: '/cultural-events' },
    { name: 'Local Experiences', href: '/local-experiences' },
    { name: 'Restaurants', href: '/restaurants' },
  ];

  const travelTipsSubLinks = [
    { name: 'Cultural Tips', href: '/cultural-tips' },
    { name: 'Ed Card', href: '/ed-card' },
    { name: 'Blogs', href: '/blogs' },
  ];

  const rentalsSubLinks = [
    { name: 'Car Rentals', href: '/car-rentals' },
    { name: 'Gear Rentals', href: '/gear-rentals' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attractionsDropdownRef.current && !attractionsDropdownRef.current.contains(event.target as Node)) {
        setIsAttractionsOpen(false);
      }
      if (travelTipsDropdownRef.current && !travelTipsDropdownRef.current.contains(event.target as Node)) {
        setIsTravelTipsOpen(false);
      }
      if (rentalsDropdownRef.current && !rentalsDropdownRef.current.contains(event.target as Node)) {
        setIsRentalsOpen(false);
      }
    };

    if (isAttractionsOpen || isTravelTipsOpen || isRentalsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttractionsOpen, isTravelTipsOpen, isRentalsOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
        : 'bg-white/80 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Aruba Travel Buddy"
                width={48}
                height={48}
                priority
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold font-display">
                <span className="text-[var(--brand-aruba)]">Aruba</span>{' '}
                <span className="text-[var(--brand-amber)]">Travel Buddy</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[rgba(0,188,212,0.1)] rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
            
            {/* Explore Attractions Dropdown */}
            <div className="relative" ref={attractionsDropdownRef}>
              <button
                onMouseEnter={() => setIsAttractionsOpen(true)}
                onMouseLeave={() => setIsAttractionsOpen(false)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  attractionsSubLinks.some(link => pathname === link.href)
                    ? 'text-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                }`}
              >
                {attractionsSubLinks.some(link => pathname === link.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[rgba(0,188,212,0.1)] rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Explore Attractions
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isAttractionsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAttractionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsAttractionsOpen(true)}
                    onMouseLeave={() => setIsAttractionsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {attractionsSubLinks.map((subLink) => {
                        const isActive = pathname === subLink.href;
                        return (
                          <Link
                            key={subLink.name}
                            href={subLink.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                                : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Travel Tips Dropdown */}
            <div className="relative" ref={travelTipsDropdownRef}>
              <button
                onMouseEnter={() => setIsTravelTipsOpen(true)}
                onMouseLeave={() => setIsTravelTipsOpen(false)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  travelTipsSubLinks.some(link => pathname === link.href)
                    ? 'text-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                }`}
              >
                {travelTipsSubLinks.some(link => pathname === link.href) && (
                  <motion.div
                    layoutId="activeTabTips"
                    className="absolute inset-0 bg-[rgba(0,188,212,0.1)] rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Travel Tips
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isTravelTipsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isTravelTipsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsTravelTipsOpen(true)}
                    onMouseLeave={() => setIsTravelTipsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {travelTipsSubLinks.map((subLink) => {
                        const isActive = pathname === subLink.href;
                        return (
                          <Link
                            key={subLink.name}
                            href={subLink.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                                : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rentals Dropdown */}
            <div className="relative" ref={rentalsDropdownRef}>
              <button
                onMouseEnter={() => setIsRentalsOpen(true)}
                onMouseLeave={() => setIsRentalsOpen(false)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  rentalsSubLinks.some(link => pathname === link.href)
                    ? 'text-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                }`}
              >
                {rentalsSubLinks.some(link => pathname === link.href) && (
                  <motion.div
                    layoutId="activeTabRentals"
                    className="absolute inset-0 bg-[rgba(0,188,212,0.1)] rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Rentals
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isRentalsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isRentalsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsRentalsOpen(true)}
                    onMouseLeave={() => setIsRentalsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {rentalsSubLinks.map((subLink) => {
                        const isActive = pathname === subLink.href;
                        return (
                          <Link
                            key={subLink.name}
                            href={subLink.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                                : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                            }`}
                          >
                            {subLink.name}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/download"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white hover:from-[var(--brand-aruba-dark)] hover:to-[var(--brand-aruba)] shadow-lg shadow-[rgba(0,188,212,0.3)] hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Download FREE
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                        : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {/* Mobile Explore Attractions */}
              <div>
                <button
                  onClick={() => setIsAttractionsMobileOpen(!isAttractionsMobileOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    attractionsSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                  }`}
                >
                  <span>Explore Attractions</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isAttractionsMobileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {isAttractionsMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {attractionsSubLinks.map((subLink) => {
                          const isActive = pathname === subLink.href;
                          return (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              onClick={() => {
                                setIsOpen(false);
                                setIsAttractionsMobileOpen(false);
                              }}
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)]'
                                  : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Travel Tips */}
              <div>
                <button
                  onClick={() => setIsTravelTipsMobileOpen(!isTravelTipsMobileOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    travelTipsSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                  }`}
                >
                  <span>Travel Tips</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isTravelTipsMobileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {isTravelTipsMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {travelTipsSubLinks.map((subLink) => {
                          const isActive = pathname === subLink.href;
                          return (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              onClick={() => {
                                setIsOpen(false);
                                setIsTravelTipsMobileOpen(false);
                              }}
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)]'
                                  : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Rentals */}
              <div>
                <button
                  onClick={() => setIsRentalsMobileOpen(!isRentalsMobileOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    rentalsSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                  }`}
                >
                  <span>Rentals</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isRentalsMobileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {isRentalsMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {rentalsSubLinks.map((subLink) => {
                          const isActive = pathname === subLink.href;
                          return (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              onClick={() => {
                                setIsOpen(false);
                                setIsRentalsMobileOpen(false);
                              }}
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)]'
                                  : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                <Link
                  href="/download"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Download FREE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
