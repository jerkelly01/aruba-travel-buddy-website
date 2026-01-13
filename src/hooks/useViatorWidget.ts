"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useViatorWidget(widgetRef: string) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = useState(() => Date.now());
  const lastPathnameRef = useRef<string | null>(null);

  const initializeWidget = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const viator = (window as any).viator;
    if (!viator || typeof viator.init !== 'function') {
      return false;
    }

    try {
      // Call viator.init() to scan and initialize all widgets
      viator.init();
      console.log('[Viator Widget] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[Viator Widget] Error during init:', error);
      return false;
    }
  }, []);

  // Handle pathname changes (navigation) - remount the widget container
  useEffect(() => {
    // Only remount if pathname actually changed (not on initial mount)
    if (lastPathnameRef.current !== null && lastPathnameRef.current !== pathname) {
      console.log('[Viator Widget] Pathname changed, remounting widget');
      setWidgetKey(Date.now());
    }
    lastPathnameRef.current = pathname;
  }, [pathname]);

  // Initialize widget after mount or remount
  useEffect(() => {
    if (typeof window === 'undefined' || !widgetContainerRef.current) {
      return;
    }

    console.log('[Viator Widget] Starting initialization for widgetKey:', widgetKey);

    let pollInterval: NodeJS.Timeout | null = null;

    // Wait a bit for the DOM to settle after remount
    const initDelay = setTimeout(() => {
      let pollCount = 0;
      const maxPolls = 50; // 10 seconds max
      
      pollInterval = setInterval(() => {
        pollCount++;
        
        if (initializeWidget()) {
          if (pollInterval) clearInterval(pollInterval);
          console.log('[Viator Widget] Polling complete, widget initialized');
        } else if (pollCount >= maxPolls) {
          if (pollInterval) clearInterval(pollInterval);
          console.error('[Viator Widget] Script not available after 10 seconds');
        }
      }, 200);
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(initDelay);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [widgetKey, initializeWidget]);

  return {
    widgetContainerRef,
    widgetKey,
  };
}
