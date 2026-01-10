"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicTransportationApi } from "@/lib/public-api";
import { normalizeTransportation } from "@/lib/data-normalization";

// Custom hook to reinitialize Viator widget when tab becomes visible or page navigates
function useViatorWidgetReinit(widgetRef: string) {
  const widgetContainerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = React.useState(() => Date.now());
  const isVisibleRef = React.useRef(true);
  const lastPathnameRef = React.useRef<string | null>(null);
  const [showFallback, setShowFallback] = React.useState(false);

  const forceRemount = React.useCallback(() => {
    // Force React to remount the widget container by changing key
    setWidgetKey(Date.now());
  }, []);

  const initializeWidget = React.useCallback(() => {
    if (typeof window === 'undefined' || !widgetContainerRef.current) return;
    
    const container = widgetContainerRef.current;
    if (!container) return;

    // Check if script is loaded
    const scriptExists = document.querySelector('script[src*="viator.com/orion/partner/widget.js"]');
    if (!scriptExists) {
      return;
    }

    // Wait for script to be ready and DOM to be updated
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
    }, 800);
  }, []);

  const reinitializeWidget = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Clear any existing widget content first to ensure clean state
    const currentContainer = widgetContainerRef.current;
    if (currentContainer) {
      currentContainer.innerHTML = '';
      // Remove data attributes temporarily to force Viator to re-detect
      currentContainer.removeAttribute('data-vi-partner-id');
      currentContainer.removeAttribute('data-vi-widget-ref');
    }
    
    // Force remount to get a fresh container
    forceRemount();
    
    // Wait for React to remount, then restore attributes and initialize
    setTimeout(() => {
      const newContainer = widgetContainerRef.current;
      if (newContainer) {
        // Ensure attributes are set
        newContainer.setAttribute('data-vi-partner-id', 'P00276444');
        newContainer.setAttribute('data-vi-widget-ref', widgetRef);
        
        // Wait a bit more for DOM to settle, then initialize
        setTimeout(() => {
          initializeWidget();
        }, 300);
      } else {
        // Container not ready, retry
        setTimeout(() => {
          const retryContainer = widgetContainerRef.current;
          if (retryContainer) {
            retryContainer.setAttribute('data-vi-partner-id', 'P00276444');
            retryContainer.setAttribute('data-vi-widget-ref', widgetRef);
            setTimeout(() => {
              initializeWidget();
            }, 300);
          }
        }, 500);
      }
    }, 600);
  }, [forceRemount, initializeWidget, widgetRef]);

  // Force remount and reinitialize when pathname changes (navigation)
  React.useEffect(() => {
    if (lastPathnameRef.current !== null && lastPathnameRef.current !== pathname) {
      // Pathname changed, force reinitialize
      reinitializeWidget();
    }
    lastPathnameRef.current = pathname;
  }, [pathname, reinitializeWidget]);

  // Initialize when widget container ref is set (after remount)
  React.useEffect(() => {
    if (widgetContainerRef.current) {
      // Container is mounted, initialize after a short delay
      const initTimer = setTimeout(() => {
        initializeWidget();
      }, 1000);
      return () => clearTimeout(initTimer);
    }
  }, [widgetKey, initializeWidget]);

  React.useEffect(() => {
    // On mount, force remount and initialize
    forceRemount();
    
    // Wait for script and initialize
    const checkInterval = setInterval(() => {
      initializeWidget();
    }, 500);

    // Timeout after 10 seconds - show fallback if widget didn't load
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      const container = widgetContainerRef.current;
      const hasWidgetContent = container && (container.children.length > 0 || container.innerHTML.trim().length > 0);
      if (!hasWidgetContent) {
        setShowFallback(true);
      }
    }, 10000);

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      
      // Only reinitialize when tab becomes visible (not when it becomes hidden)
      if (isVisible && !isVisibleRef.current) {
        // Tab just became visible, reinitialize widget
        reinitializeWidget();
      }
      
      isVisibleRef.current = isVisible;
    };

    // Listen for window focus as backup
    const handleFocus = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        reinitializeWidget();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [forceRemount, initializeWidget, reinitializeWidget]);

  return { ref: widgetContainerRef, key: widgetKey };
}

interface Transportation {
  id: string;
  name: string;
  description: string;
  type: string;
  location?: string;
  images: string[];
  featured: boolean;
  pricing_info?: {
    daily_rate?: number;
    hourly_rate?: number;
    price?: string;
  };
  contact_info?: any;
}

export default function BusToursPage() {
  const [tours, setTours] = React.useState<Transportation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const { ref: viatorWidgetRef, key: viatorWidgetKey } = useViatorWidgetReinit("W-b22b5a1c-f1f0-4250-a286-b83572c5e664");

  React.useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      console.log('[Bus Tours] Fetching tours...');
      const response = await publicTransportationApi.getAll({ active: true, type: 'bus_tour' });
      
          if (response.success && response.data) {
            let toursData: Transportation[] = [];
            const data = response.data as any;
            if (Array.isArray(data)) {
              toursData = normalizeTransportation(data);
            } else if (data.items && Array.isArray(data.items)) {
              toursData = normalizeTransportation(data.items);
            } else if (data.data && Array.isArray(data.data)) {
              toursData = normalizeTransportation(data.data);
            }
            
            console.log('[Bus Tours] Parsed tours:', toursData.length);
            setTours(toursData);
      } else {
        console.error('[Bus Tours] Failed to load tours:', response.error);
        setTours([]);
      }
    } catch (error) {
      console.error('[Bus Tours] Error loading tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      const title = tour.name || '';
      return !q || [title, tour.description, tour.location].some((v) => 
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
            title="Bus Tours"
            subtitle="Explore Aruba with guided bus tours and sightseeing experiences"
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
              placeholder="Search bus tours..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Viator Widget Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          {showFallback ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="bus" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Bus Tour Widget</h3>
              <p className="text-gray-600 mb-4">
                Discover and book guided bus tours through our partner platform
              </p>
              <a
                href="https://www.viator.com/en-CA/Aruba/d8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
              >
                <Icon name="external-link" className="w-4 h-4" />
                Browse Bus Tours on Viator
              </a>
            </motion.div>
          ) : (
            <div
              key={viatorWidgetKey === 0 ? 'bus-tours-widget-initial' : `viator-widget-${viatorWidgetKey}`}
              ref={viatorWidgetRef}
              data-vi-partner-id="P00276444"
              data-vi-widget-ref="W-b22b5a1c-f1f0-4250-a286-b83572c5e664"
              id="viator-widget-bus-tours"
            ></div>
          )}
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
              <p className="text-gray-600">Loading bus tours...</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Bus Tours Above</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Explore available bus tours through our partner widget'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredTours.map((tour, index) => {
                const title = tour.name || 'Bus Tour';
                const price = tour.pricing_info?.price 
                  || (tour.pricing_info?.daily_rate ? `From $${tour.pricing_info.daily_rate}/day` : '')
                  || (tour.pricing_info?.hourly_rate ? `From $${tour.pricing_info.hourly_rate}/hour` : '');
                return (
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
                            alt={title} 
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
                        {price && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                              {price}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                          {title}
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
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* Viator Widget Script */}
      <Script
        src="https://www.viator.com/orion/partner/widget.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
