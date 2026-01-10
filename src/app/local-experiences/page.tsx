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
import { publicLocalExperiencesApi } from "@/lib/public-api";
import { normalizeLocalExperiences } from "@/lib/data-normalization";

// Custom hook to reinitialize Viator widget when tab becomes visible or page navigates
function useViatorWidgetReinit(widgetRef: string) {
  const widgetContainerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = React.useState(() => Date.now());
  const isVisibleRef = React.useRef(true);
  const lastPathnameRef = React.useRef<string | null>(null);

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

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
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

interface LocalExperience {
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
}

export default function LocalExperiencesPage() {
  const [experiences, setExperiences] = React.useState<LocalExperience[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const { ref: viatorWidgetRef, key: viatorWidgetKey } = useViatorWidgetReinit("W-931e6709-1fe0-41fe-bf74-7daea45d8d5a");

  React.useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      console.log('[Local Experiences] Fetching experiences...');
      const response = await publicLocalExperiencesApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let experiencesData: LocalExperience[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          experiencesData = normalizeLocalExperiences(data);
        } else if (data.items && Array.isArray(data.items)) {
          experiencesData = normalizeLocalExperiences(data.items);
        } else if (data.localExperiences && Array.isArray(data.localExperiences)) {
          experiencesData = normalizeLocalExperiences(data.localExperiences);
        } else if (data.data && Array.isArray(data.data)) {
          experiencesData = normalizeLocalExperiences(data.data);
        }
        
        console.log('[Local Experiences] Parsed experiences:', experiencesData.length);
        setExperiences(experiencesData);
      } else {
        console.error('[Local Experiences] Failed to load experiences:', response.error);
        setExperiences([]);
      }
    } catch (error) {
      console.error('[Local Experiences] Error loading experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return experiences.filter((exp) => {
      return !q || [exp.title, exp.description, exp.location, exp.category].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [experiences, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Local Experiences"
            subtitle="Immerse yourself in authentic Aruban culture with unique local experiences"
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
              placeholder="Search experiences..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Viator Widget Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div 
            key={viatorWidgetKey === 0 ? 'experiences-widget-initial' : `viator-widget-${viatorWidgetKey}`}
            ref={viatorWidgetRef}
            data-vi-partner-id="P00276444" 
            data-vi-widget-ref="W-931e6709-1fe0-41fe-bf74-7daea45d8d5a"
            id="viator-widget-experiences"
          ></div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <Container>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Icon name="heart" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading experiences...</p>
            </div>
          ) : filteredExperiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="heart" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Experiences Above</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Explore available Experiences through our partner widget'}
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
              {filteredExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {exp.images && exp.images.length > 0 ? (
                        <Image 
                          src={exp.images[0]} 
                          alt={exp.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                          <Icon name="heart" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {exp.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                            Featured
                          </span>
                        </div>
                      )}
                      {exp.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            {exp.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {exp.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        {exp.location && (
                          <div className="flex items-center gap-2">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                        {exp.duration && (
                          <div className="flex items-center gap-2">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            <span>{exp.duration}</span>
                          </div>
                        )}
                        {exp.category && (
                          <div className="flex items-center gap-2">
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{exp.category}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
