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
import { publicToursApi } from "@/lib/public-api";
import { normalizeTours } from "@/lib/data-normalization";
import { CodeSnippet } from "@/components/CodeSnippet";

// Custom hook to reinitialize Viator widget when tab becomes visible or page navigates
function useViatorWidgetReinit(widgetRef: string) {
  const widgetContainerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = React.useState(() => Date.now());
  const isVisibleRef = React.useRef(true);
  const lastPathnameRef = React.useRef<string | null>(null);
  const mutationObserverRef = React.useRef<MutationObserver | null>(null);
  const [widgetLoaded, setWidgetLoaded] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);

  const forceRemount = React.useCallback(() => {
    // Force React to remount the widget container by changing key
    const newKey = Date.now();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:forceRemount',message:'Force remount called',data:{newKey,oldKey:widgetKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setWidgetKey(newKey);
  }, [widgetKey]);

  const initializeWidget = React.useCallback(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'Initialize widget called',data:{hasWindow:typeof window !== 'undefined',hasRef:!!widgetContainerRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (typeof window === 'undefined' || !widgetContainerRef.current) return;
    
    const container = widgetContainerRef.current;
    if (!container) return;

    // Check if script tag exists
    const scriptTag = document.querySelector('script[src*="viator.com/orion/partner/widget.js"]') as HTMLScriptElement;
    const scriptExists = !!scriptTag;
    const scriptReady = scriptTag?.getAttribute('data-ready') === 'true';
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'Script check',data:{scriptExists,scriptReady,hasViator:!!(window as any).viator,containerVisible:container.offsetParent !== null,containerDisplay:window.getComputedStyle(container).display},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // Poll for script to be ready (up to 10 seconds)
    let attempts = 0;
    const maxAttempts = 50; // 50 * 200ms = 10 seconds
    const pollInterval = setInterval(() => {
      attempts++;
      const hasViator = !!(window as any).viator;
      const hasInit = hasViator && typeof (window as any).viator.init === 'function';
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'Polling for viator',data:{attempt:attempts,hasViator,hasInit},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'I'})}).catch(()=>{});
      // #endregion
      
      if (hasViator && hasInit) {
        clearInterval(pollInterval);
        const container = widgetContainerRef.current;
        if (!container) return;
        
        const containerBefore = {
          children: container.children.length,
          innerHTML: container.innerHTML.length,
          height: container.offsetHeight,
          width: container.offsetWidth,
          hasIframe: !!container.querySelector('iframe'),
          computedDisplay: window.getComputedStyle(container).display,
          computedVisibility: window.getComputedStyle(container).visibility
        };
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'Viator ready, calling init',data:{containerBefore},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'I'})}).catch(()=>{});
        // #endregion
        
        try {
          (window as any).viator.init();
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'viator.init called',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          
          // Check container state after init
          setTimeout(() => {
            const containerAfter = container ? {
              children: container.children.length,
              innerHTML: container.innerHTML.length,
              height: container.offsetHeight,
              width: container.offsetWidth,
              hasIframe: !!container.querySelector('iframe'),
              computedDisplay: window.getComputedStyle(container).display,
              computedVisibility: window.getComputedStyle(container).visibility
            } : null;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'After viator.init call',data:{containerAfter,hasContent:containerAfter && containerAfter.children > 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
          }, 1500);
        } catch (error) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'viator.init error',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          console.error('[Viator Widget] Error during init:', error);
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:initializeWidget',message:'Polling timeout - viator not available',data:{attempts},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'I'})}).catch(()=>{});
        // #endregion
        console.error('[Viator Widget] Script not available after polling');
      }
    }, 200);
  }, []);

  const reinitializeWidget = React.useCallback(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:reinitializeWidget',message:'Reinitialize widget called',data:{hasWindow:typeof window !== 'undefined',hasRef:!!widgetContainerRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'J'})}).catch(()=>{});
    // #endregion
    if (typeof window === 'undefined') return;
    
    // Clear any existing widget content first to ensure clean state
    const currentContainer = widgetContainerRef.current;
    if (currentContainer) {
      currentContainer.innerHTML = '';
      // Remove data attributes temporarily to force Viator to re-detect
      currentContainer.removeAttribute('data-vi-partner-id');
      currentContainer.removeAttribute('data-vi-widget-ref');
    }
    
    // Remove and re-add the script to force a fresh scan
    const existingScript = document.querySelector('script[src*="viator.com/orion/partner/widget.js"]');
    if (existingScript) {
      existingScript.remove();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:reinitializeWidget',message:'Removed existing script',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'J'})}).catch(()=>{});
      // #endregion
    }
    
    // Force remount to get a fresh container
    forceRemount();
    
    // Wait for React to remount, then restore attributes and reload script
    setTimeout(() => {
      const newContainer = widgetContainerRef.current;
      if (newContainer) {
        // Ensure attributes are set
        newContainer.setAttribute('data-vi-partner-id', 'P00276444');
        newContainer.setAttribute('data-vi-widget-ref', widgetRef);
        
        // Re-add the script to trigger fresh scan
        const script = document.createElement('script');
        script.src = 'https://www.viator.com/orion/partner/widget.js';
        script.async = true;
        script.onload = () => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:reinitializeWidget',message:'Script reloaded in reinitialize',data:{hasViator:!!(window as any).viator},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'J'})}).catch(()=>{});
          // #endregion
          // Wait for script to initialize, then try manual init if available
          setTimeout(() => {
            if ((window as any).viator && typeof (window as any).viator.init === 'function') {
              (window as any).viator.init();
            }
            initializeWidget();
          }, 500);
        };
        document.body.appendChild(script);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:reinitializeWidget',message:'Re-adding script tag',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'J'})}).catch(()=>{});
        // #endregion
      } else {
        // Container not ready, retry
        setTimeout(() => {
          const retryContainer = widgetContainerRef.current;
          if (retryContainer) {
            retryContainer.setAttribute('data-vi-partner-id', 'P00276444');
            retryContainer.setAttribute('data-vi-widget-ref', widgetRef);
            const script = document.createElement('script');
            script.src = 'https://www.viator.com/orion/partner/widget.js';
            script.async = true;
            script.onload = () => {
              setTimeout(() => {
                if ((window as any).viator && typeof (window as any).viator.init === 'function') {
                  (window as any).viator.init();
                }
                initializeWidget();
              }, 500);
            };
            document.body.appendChild(script);
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
      const container = widgetContainerRef.current;
      const containerState = {
        children: container.children.length,
        height: container.offsetHeight,
        hasIframe: !!container.querySelector('iframe'),
        key: widgetKey
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:useEffect-widgetKey',message:'Widget key changed, container mounted',data:{containerState},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      // Container is mounted, initialize after a short delay
      const initTimer = setTimeout(() => {
        initializeWidget();
      }, 1000);
      return () => clearTimeout(initTimer);
    }
  }, [widgetKey, initializeWidget]);

  React.useEffect(() => {
    // On mount, force remount and initialize
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:useEffect',message:'Component mount effect',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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
      const container = widgetContainerRef.current;
      const containerState = container ? {
        children: container.children.length,
        height: container.offsetHeight,
        hasIframe: !!container.querySelector('iframe'),
        innerHTML: container.innerHTML.substring(0, 100),
        iframeSrc: container.querySelector('iframe')?.src || null
      } : null;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:handleVisibilityChange',message:'Visibility change detected',data:{isVisible,wasVisible:isVisibleRef.current,willReinit:isVisible && !isVisibleRef.current,containerExists:!!container,containerState},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'K'})}).catch(()=>{});
      // #endregion
      // Only reinitialize when tab becomes visible (not when it becomes hidden)
      if (isVisible && !isVisibleRef.current) {
        // Tab just became visible - check if widget content exists
        const iframe = container?.querySelector('iframe');
        const hasContent = container && (container.children.length > 0 || container.innerHTML.trim().length > 0);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:handleVisibilityChange',message:'Tab visible - checking widget state',data:{hasContent,hasIframe:!!iframe,iframeVisible:iframe ? window.getComputedStyle(iframe).display !== 'none' : false},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'K'})}).catch(()=>{});
        // #endregion
        
        if (!hasContent || !iframe) {
          // Widget content missing, force reinitialize
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:handleVisibilityChange',message:'Widget content missing, calling reinitializeWidget',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'K'})}).catch(()=>{});
          // #endregion
          reinitializeWidget();
        } else {
          // Widget exists but might be hidden - try to refresh iframe
          if (iframe) {
            const iframeSrc = iframe.src;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:handleVisibilityChange',message:'Widget exists, refreshing iframe',data:{iframeSrc},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'K'})}).catch(()=>{});
            // #endregion
            // Force iframe reload by setting src to empty then back
            iframe.src = '';
            setTimeout(() => {
              if (iframe && iframeSrc) {
                iframe.src = iframeSrc;
              }
            }, 100);
          }
        }
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

  return { ref: widgetContainerRef, key: widgetKey, showFallback };
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
  const { ref: viatorWidgetRef, key: viatorWidgetKey, showFallback } = useViatorWidgetReinit("W-44ff9515-9337-48ed-ad52-88b94d11c81d");

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
          {showFallback ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Tour Booking Widget</h3>
              <p className="text-gray-600 mb-4">
                Explore and book tours directly through our partner platform
              </p>
              <a
                href="https://www.viator.com/en-CA/Aruba/d8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
              >
                <Icon name="external-link" className="w-4 h-4" />
                Browse Tours on Viator
              </a>
            </motion.div>
          ) : (
            <div
              key={`viator-widget-${viatorWidgetKey}`}
              ref={viatorWidgetRef}
              data-vi-partner-id="P00276444"
              data-vi-widget-ref="W-44ff9515-9337-48ed-ad52-88b94d11c81d"
              id="viator-widget-tours"
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

      {/* Viator Widget Script */}
      <Script
        src="https://www.viator.com/orion/partner/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:Script-onLoad',message:'Viator script loaded',data:{hasViator:!!(window as any).viator,hasInit:!!((window as any).viator && typeof (window as any).viator.init === 'function')},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'I'})}).catch(()=>{});
          // #endregion
          // Wait a bit for viator object to be available
          setTimeout(() => {
            // Try to initialize widget regardless of window.viator availability
            // Viator may use event-driven initialization
            const container = document.querySelector('[data-vi-partner-id]');
            if (container) {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:Script-onLoad',message:'Dispatching init events to container',data:{containerFound:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'I'})}).catch(()=>{});
              // #endregion
              container.dispatchEvent(new CustomEvent('viator:init', { bubbles: true }));
              container.dispatchEvent(new CustomEvent('widget:init', { bubbles: true }));
              document.dispatchEvent(new CustomEvent('viator:ready', { bubbles: true }));
            }

            // Also try the old viator.init approach if available
            if ((window as any).viator && typeof (window as any).viator.init === 'function') {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:Script-onLoad',message:'Calling viator.init from onLoad',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'I'})}).catch(()=>{});
              // #endregion
              (window as any).viator.init();
            }
          }, 500);
        }}
        onError={(e) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/3d77dc41-cab3-4871-9dea-bcb920c8d331',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'tours/page.tsx:Script-onError',message:'Viator script load error',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run6',hypothesisId:'I'})}).catch(()=>{});
          // #endregion
          console.error('[Viator Widget] Script load error:', e);
        }}
      />
    </div>
  );
}
