"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicToursApi } from "@/lib/public-api";
import { normalizeTours } from "@/lib/data-normalization";
import { CodeSnippet } from "@/components/CodeSnippet";

// Custom hook to reinitialize Viator widget when tab becomes visible or page navigates
function useViatorWidgetReinit(widgetRef: string) {
  const widgetContainerRef = React.useRef<HTMLDivElement>(null);
  const [widgetKey, setWidgetKey] = React.useState(() => Date.now()); // Use timestamp for unique key on mount
  const isVisibleRef = React.useRef(true);
  const mountCountRef = React.useRef(0);

  const forceReinitialize = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Force React to remount the widget container by changing key
    setWidgetKey(Date.now());
    
    // Wait for DOM update, then try to initialize
    setTimeout(() => {
      const container = widgetContainerRef.current;
      if (!container) return;

      // Check if script is loaded
      const scriptExists = document.querySelector('script[src*="viator.com/orion/partner/widget.js"]');
      if (!scriptExists) {
        // Script not loaded yet, wait for it
        return;
      }

      // Wait a bit more for script to be ready
      setTimeout(() => {
        if ((window as any).viator) {
          try {
            // Try to trigger initialization
            if (typeof (window as any).viator.init === 'function') {
              (window as any).viator.init();
            }
          } catch (error) {
            console.error('[Viator Widget] Error during init:', error);
          }
        }
      }, 200);
    }, 100);
  }, []);

  React.useEffect(() => {
    mountCountRef.current += 1;
    const currentMount = mountCountRef.current;

    // On mount (including navigation), force reinitialize
    const mountTimer = setTimeout(() => {
      if (currentMount === mountCountRef.current) {
        forceReinitialize();
      }
    }, 300);

    // Also poll for script availability
    const checkInterval = setInterval(() => {
      if (currentMount !== mountCountRef.current) {
        clearInterval(checkInterval);
        return;
      }

      const scriptExists = document.querySelector('script[src*="viator.com/orion/partner/widget.js"]');
      if (scriptExists && widgetContainerRef.current) {
        // Script is loaded, ensure widget is initialized
        setTimeout(() => {
          if ((window as any).viator && typeof (window as any).viator.init === 'function') {
            try {
              (window as any).viator.init();
            } catch (error) {
              // Silent fail, will retry
            }
          }
        }, 100);
      }
    }, 500);

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
    }, 5000);

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      
      // Only reinitialize when tab becomes visible (not when it becomes hidden)
      if (isVisible && !isVisibleRef.current) {
        // Tab just became visible, reinitialize widget
        forceReinitialize();
      }
      
      isVisibleRef.current = isVisible;
    };

    // Listen for window focus as backup
    const handleFocus = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        forceReinitialize();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(checkInterval);
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [forceReinitialize]);

  return { ref: widgetContainerRef, key: widgetKey };
}

interface Tour {
  id: string;
  title: string;
  description: string;
  duration?: string;
  price?: string;
  location?: string;
  images: string[];
  featured: boolean;
  category?: string;
  tags?: string[];
  code_snippet?: string;
}

export default function ToursPage() {
  const [tours, setTours] = React.useState<Tour[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const { ref: viatorWidgetRef, key: viatorWidgetKey } = useViatorWidgetReinit("W-44ff9515-9337-48ed-ad52-88b94d11c81d");

  React.useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      console.log('[Tours] Fetching tours...');
      const response = await publicToursApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let toursData: Tour[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          toursData = normalizeTours(data);
        } else if (data.items && Array.isArray(data.items)) {
          toursData = normalizeTours(data.items);
        } else if (data.tours && Array.isArray(data.tours)) {
          toursData = normalizeTours(data.tours);
        } else if (data.data && Array.isArray(data.data)) {
          toursData = normalizeTours(data.data);
        }
        
        console.log('[Tours] Parsed tours:', toursData.length);
        setTours(toursData);
      } else {
        console.error('[Tours] Failed to load tours:', response.error);
        setTours([]);
      }
    } catch (error) {
      console.error('[Tours] Error loading tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      return !q || [tour.title, tour.description, tour.location, tour.category].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [tours, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Tours & Excursions"
            subtitle="Discover the best guided tours and excursions Aruba has to offer"
            center
          />
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-y border-gray-100">
        <Container>
          <div className="relative max-w-md mx-auto">
            <Icon name="map-pin" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tours..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Viator Widget Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div 
            key={`viator-widget-${viatorWidgetKey}`}
            ref={viatorWidgetRef}
            data-vi-partner-id="P00276444" 
            data-vi-widget-ref="W-44ff9515-9337-48ed-ad52-88b94d11c81d"
            id="viator-widget-container"
          ></div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <Container>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading tours...</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Tours Above</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Explore available tours through our partner widget'}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {tour.images && tour.images.length > 0 ? (
                        <Image 
                          src={tour.images[0]} 
                          alt={tour.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                          <Icon name="map-pin" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {tour.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                            Featured
                          </span>
                        </div>
                      )}
                      {tour.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            {tour.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {tour.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        {tour.location && (
                          <div className="flex items-center gap-2">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span>{tour.location}</span>
                          </div>
                        )}
                        {tour.duration && (
                          <div className="flex items-center gap-2">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            <span>{tour.duration}</span>
                          </div>
                        )}
                        {tour.category && (
                          <div className="flex items-center gap-2">
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{tour.category}</span>
                          </div>
                        )}
                      </div>
                      {/* Render code snippet if available */}
                      {tour.code_snippet && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <CodeSnippet code={tour.code_snippet} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Legacy Viator Widget Script (for backward compatibility) */}
      <Script
        src="https://www.viator.com/orion/partner/widget.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
