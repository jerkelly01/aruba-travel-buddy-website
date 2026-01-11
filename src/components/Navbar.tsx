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
  const [isTravelTipsOpen, setIsTravelTipsOpen] = useState(false);
  const [isTransportationOpen, setIsTransportationOpen] = useState(false);
  const [isAttractionsMobileOpen, setIsAttractionsMobileOpen] = useState(false);
  const [isTravelTipsMobileOpen, setIsTravelTipsMobileOpen] = useState(false);
  const [isTransportationMobileOpen, setIsTransportationMobileOpen] = useState(false);
  const pathname = usePathname();
  
  const attractionsDropdownRef = useRef<HTMLDivElement>(null);
  const travelTipsDropdownRef = useRef<HTMLDivElement>(null);
  const transportationDropdownRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/';

  const attractionsSubLinks = [
    { name: 'Tours', href: '/tours' },
    { name: 'Cultural Events', href: '/cultural-events' },
    { name: 'Local Experiences', href: '/local-experiences' },
    { name: 'Restaurants', href: '/restaurants' },
  ];

  const travelTipsSubLinks = [
    { name: 'Travel Tips', href: '/blogs' },
    { name: 'Cultural Tips', href: '/cultural-tips' },
    { name: 'ED Card Info', href: '/ed-card' },
    { name: 'Photo Challenges', href: '/photo-challenges' },
  ];

  const transportationSubLinks = [
    { name: 'Car Rentals', href: '/car-rentals' },
    { name: 'Bus Tours', href: '/bus-tours' },
    { name: 'Private Transportation', href: '/private-transportation' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attractionsDropdownRef.current && !attractionsDropdownRef.current.contains(event.target as Node)) {
        setIsAttractionsOpen(false);
      }
      if (travelTipsDropdownRef.current && !travelTipsDropdownRef.current.contains(event.target as Node)) {
        setIsTravelTipsOpen(false);
      }
      if (transportationDropdownRef.current && !transportationDropdownRef.current.contains(event.target as Node)) {
        setIsTransportationOpen(false);
      }
    };

    if (isAttractionsOpen || isTravelTipsOpen || isTransportationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttractionsOpen, isTravelTipsOpen, isTransportationOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHomePage && !scrolled
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${isHomePage && !scrolled ? 'h-24' : 'h-24'}`}>
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-3 group ${isHomePage && !scrolled ? 'mt-4' : 'mt-0'}`}>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Aruba Travel Buddy"
                width={112}
                height={112}
                priority
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                isHomePage && !scrolled
                  ? pathname === '/'
                    ? 'text-white'
                    : 'text-white/90 hover:text-white'
                  : pathname === '/'
                    ? 'text-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)]'
              }`}
            >
              {pathname === '/' && (
                <motion.div
                  layoutId="activeTabHome"
                  className={`absolute inset-0 rounded-xl ${
                    isHomePage && !scrolled 
                      ? 'bg-white/20' 
                      : 'bg-[rgba(0,188,212,0.1)]'
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Home</span>
            </Link>

            <Link
              href="/about"
              className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                isHomePage && !scrolled
                  ? 'text-white/90 hover:text-white'
                  : pathname === '/about'
                    ? 'text-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)]'
              }`}
            >
              {pathname === '/about' && (
                <motion.div
                  layoutId="activeTabAbout"
                  className={`absolute inset-0 rounded-xl ${
                    isHomePage && !scrolled 
                      ? 'bg-white/20' 
                      : 'bg-[rgba(0,188,212,0.1)]'
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">About</span>
            </Link>

            {/* Explore Aruba Dropdown */}
            <div className="relative" ref={attractionsDropdownRef}>
              <button
                onMouseEnter={() => setIsAttractionsOpen(true)}
                onMouseLeave={() => setIsAttractionsOpen(false)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                  (() => {
                    const isExplorePage = pathname === '/explore-aruba' || pathname?.startsWith('/explore-aruba/') || pathname === '/map';
                    if (isHomePage && !scrolled) {
                      return isExplorePage ? 'text-white' : 'text-white/90 hover:text-white';
                    }
                    return isExplorePage ? 'text-[var(--brand-aruba)]' : 'text-gray-600 hover:text-[var(--brand-aruba)]';
                  })()
                }`}
              >
                {(pathname === '/explore-aruba' || pathname?.startsWith('/explore-aruba/') || pathname === '/map') && (
                  <motion.div
                    layoutId="activeTabExploreAruba"
                    className={`absolute inset-0 rounded-xl ${
                      isHomePage && !scrolled 
                        ? 'bg-white/20' 
                        : 'bg-[rgba(0,188,212,0.1)]'
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Explore Aruba
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
              <AnimatePresence>
                {isAttractionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={() => setIsAttractionsOpen(true)}
                    onMouseLeave={() => setIsAttractionsOpen(false)}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-64 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className="p-2">
                      <Link
                        href="/explore-aruba"
                        onClick={() => setIsAttractionsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--brand-aruba)]/5 hover:text-[var(--brand-aruba)]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🗺️</span>
                          <span>All Categories</span>
                        </div>
                      </Link>
                      <Link
                        href="/map"
                        onClick={() => setIsAttractionsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--brand-aruba)]/5 hover:text-[var(--brand-aruba)]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📍</span>
                          <span>Interactive Map</span>
                        </div>
                      </Link>
                      <div className="h-px bg-gray-200 my-2" />
                      <Link
                        href="/explore-aruba/beaches"
                        onClick={() => setIsAttractionsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--brand-aruba)]/5 hover:text-[var(--brand-aruba)]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🏖️</span>
                          <span>Beaches</span>
                        </div>
                      </Link>
                      <Link
                        href="/explore-aruba/cultural-spots"
                        onClick={() => setIsAttractionsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--brand-aruba)]/5 hover:text-[var(--brand-aruba)]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🏛️</span>
                          <span>Cultural Spots</span>
                        </div>
                      </Link>
                      <Link
                        href="/explore-aruba/natural-wonders"
                        onClick={() => setIsAttractionsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--brand-aruba)]/5 hover:text-[var(--brand-aruba)]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🌿</span>
                          <span>Natural Wonders</span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/features"
              className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                isHomePage && !scrolled
                  ? 'text-white/90 hover:text-white'
                  : pathname === '/features'
                    ? 'text-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)]'
              }`}
            >
              {pathname === '/features' && (
                <motion.div
                  layoutId="activeTabFeatures"
                  className={`absolute inset-0 rounded-xl ${
                    isHomePage && !scrolled 
                      ? 'bg-white/20' 
                      : 'bg-[rgba(0,188,212,0.1)]'
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Features</span>
            </Link>

            {/* Attractions Dropdown */}
            <div className="relative" ref={attractionsDropdownRef}>
              <button
                onMouseEnter={() => setIsAttractionsOpen(true)}
                onMouseLeave={() => setIsAttractionsOpen(false)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                  isHomePage && !scrolled
                    ? attractionsSubLinks.some(link => pathname === link.href)
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                    : attractionsSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                }`}
              >
                {attractionsSubLinks.some(link => pathname === link.href) && (
                  <motion.div
                    layoutId="activeTabAttractions"
                    className={`absolute inset-0 rounded-xl ${
                      isHomePage && !scrolled 
                        ? 'bg-white/20' 
                        : 'bg-[rgba(0,188,212,0.1)]'
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1 uppercase">
                  Attractions
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
                            <span className="uppercase">{subLink.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transportation Dropdown */}
            <div className="relative" ref={transportationDropdownRef}>
              <button
                onMouseEnter={() => setIsTransportationOpen(true)}
                onMouseLeave={() => setIsTransportationOpen(false)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                  isHomePage && !scrolled
                    ? transportationSubLinks.some(link => pathname === link.href)
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                    : transportationSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                }`}
              >
                {transportationSubLinks.some(link => pathname === link.href) && (
                  <motion.div
                    layoutId="activeTabTransportation"
                    className={`absolute inset-0 rounded-xl ${
                      isHomePage && !scrolled 
                        ? 'bg-white/20' 
                        : 'bg-[rgba(0,188,212,0.1)]'
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1 uppercase">
                  Transportation
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isTransportationOpen ? 'rotate-180' : ''}`}
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
              <AnimatePresence>
                {isTransportationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setIsTransportationOpen(true)}
                    onMouseLeave={() => setIsTransportationOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {transportationSubLinks.map((subLink) => {
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
                            <span className="uppercase">{subLink.name}</span>
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
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 uppercase ${
                  isHomePage && !scrolled
                    ? travelTipsSubLinks.some(link => pathname === link.href)
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                    : travelTipsSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)]'
                  }`}
                >
                {travelTipsSubLinks.some(link => pathname === link.href) && (
                    <motion.div
                    layoutId="activeTabTravelTips"
                    className={`absolute inset-0 rounded-xl ${
                      isHomePage && !scrolled 
                        ? 'bg-white/20' 
                        : 'bg-[rgba(0,188,212,0.1)]'
                    }`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                <span className="relative z-10 flex items-center gap-1 uppercase">
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
                            <span className="uppercase">{subLink.name}</span>
                </Link>
              );
            })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/download"
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isHomePage && !scrolled
                  ? 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30'
                  : 'bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white hover:from-[var(--brand-aruba-dark)] hover:to-[var(--brand-aruba)] shadow-[rgba(0,188,212,0.3)]'
              }`}
            >
              Download FREE
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isHomePage && !scrolled
                ? 'text-white hover:bg-white/20'
                : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-100'
            }`}
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
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
                  pathname === '/'
                    ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
                  pathname === '/about'
                    ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                }`}
              >
                About
              </Link>
              <Link
                href="/explore-aruba"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
                  pathname === '/explore-aruba' || pathname?.startsWith('/explore-aruba/')
                    ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                }`}
              >
                Explore Aruba
              </Link>
              <Link
                href="/features"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
                  pathname === '/features'
                    ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                    : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                }`}
              >
                Features
              </Link>

              {/* Mobile Attractions */}
              <div>
                <button
                  onClick={() => setIsAttractionsMobileOpen(!isAttractionsMobileOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
                    attractionsSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                  }`}
                >
                  <span>Attractions</span>
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
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 uppercase ${
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

              {/* Mobile Transportation */}
              <div>
                <button
                  onClick={() => setIsTransportationMobileOpen(!isTransportationMobileOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
                    transportationSubLinks.some(link => pathname === link.href)
                      ? 'text-[var(--brand-aruba)] bg-[rgba(0,188,212,0.1)] border-l-4 border-[var(--brand-aruba)]'
                      : 'text-gray-600 hover:text-[var(--brand-aruba)] hover:bg-gray-50'
                  }`}
                >
                  <span>Transportation</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isTransportationMobileOpen ? 'rotate-180' : ''}`}
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
                  {isTransportationMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {transportationSubLinks.map((subLink) => {
                          const isActive = pathname === subLink.href;
                          return (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              onClick={() => {
                                setIsOpen(false);
                                setIsTransportationMobileOpen(false);
                              }}
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 uppercase ${
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 uppercase ${
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
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 uppercase ${
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

              <div className="pt-4 mt-4 border-t border-gray-100">
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
