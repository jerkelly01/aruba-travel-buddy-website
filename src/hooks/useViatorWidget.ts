/**
 * Custom hook to manage Viator widget lifecycle
 * Handles initialization, tab visibility changes, and navigation
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function useViatorWidget(widgetRef: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const initAttemptedRef = useRef(false);
  const lastPathnameRef = useRef<string | null>(null);

  // Initialize widget once script is loaded
  const initializeWidget = () => {
    if (typeof window === 'undefined' || initAttemptedRef.current) return;

    // Check if Viator script is available
    if ((window as any).viator && typeof (window as any).viator.init === 'function') {
      try {
        (window as any).viator.init();
        initAttemptedRef.current = true;
        setIsLoaded(true);
        console.log('[Viator Widget] Initialized successfully');
      } catch (error) {
        console.error('[Viator Widget] Initialization error:', error);
        setShowFallback(true);
      }
    }
  };

  // Handle script load
  useEffect(() => {
    // Wait for script to be available
    const checkScript = setInterval(() => {
      if ((window as any).viator) {
        clearInterval(checkScript);
        initializeWidget();
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkScript);
      if (!isLoaded && containerRef.current) {
        const hasContent = containerRef.current.querySelector('iframe') !== null;
        if (!hasContent) {
          console.warn('[Viator Widget] Load timeout - showing fallback');
          setShowFallback(true);
        }
      }
    }, 10000);

    return () => {
      clearInterval(checkScript);
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  // Handle pathname changes (navigation)
  useEffect(() => {
    if (lastPathnameRef.current !== null && lastPathnameRef.current !== pathname) {
      // Page navigated - reset initialization flag
      initAttemptedRef.current = false;
      setIsLoaded(false);
      setShowFallback(false);
      
      // Re-initialize after a brief delay
      setTimeout(() => {
        initializeWidget();
      }, 500);
    }
    lastPathnameRef.current = pathname;
  }, [pathname]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isLoaded && containerRef.current) {
        // Tab became visible - check if widget is still present
        const iframe = containerRef.current.querySelector('iframe');
        if (!iframe && !initAttemptedRef.current) {
          // Widget disappeared, try to reinitialize
          console.log('[Viator Widget] Widget missing after tab switch, reinitializing');
          initAttemptedRef.current = false;
          initializeWidget();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoaded]);

  return {
    containerRef,
    widgetRef,
    showFallback,
  };
}
