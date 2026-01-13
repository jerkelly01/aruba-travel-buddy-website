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
    
    // Check if script has loaded
    const scriptLoaded = (window as any).viatorScriptLoaded;
    const viator = (window as any).viator;
    
    console.log('[Viator Widget] Checking:', { 
      scriptLoaded, 
      hasViator: !!viator, 
      hasInit: viator && typeof viator.init === 'function'
    });
    
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
    let initDelay: NodeJS.Timeout | null = null;

    // Function to start polling
    const startPolling = () => {
      let pollCount = 0;
      const maxPolls = 100; // 20 seconds max
      
      pollInterval = setInterval(() => {
        pollCount++;
        
        if (initializeWidget()) {
          if (pollInterval) clearInterval(pollInterval);
          console.log('[Viator Widget] Polling complete, widget initialized');
        } else if (pollCount >= maxPolls) {
          if (pollInterval) clearInterval(pollInterval);
          console.error('[Viator Widget] Script not available after 20 seconds');
          console.error('[Viator Widget] Check if script is blocked or failed to load');
        }
      }, 200);
    };

    // Check if script is already loaded
    if ((window as any).viatorScriptLoaded) {
      console.log('[Viator Widget] Script already loaded, starting polling immediately');
      startPolling();
    } else {
      console.log('[Viator Widget] Waiting for script to load...');
      
      // Listen for script load event
      const handleScriptLoad = () => {
        console.log('[Viator Widget] Received script load event');
        startPolling();
      };
      
      window.addEventListener('viatorScriptLoaded', handleScriptLoad);
      
      // Also start polling after a delay as backup
      initDelay = setTimeout(() => {
        console.log('[Viator Widget] Starting backup polling');
        startPolling();
      }, 1000);

      return () => {
        window.removeEventListener('viatorScriptLoaded', handleScriptLoad);
        if (initDelay) clearTimeout(initDelay);
        if (pollInterval) clearInterval(pollInterval);
      };
    }

    return () => {
      if (initDelay) clearTimeout(initDelay);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [widgetKey, initializeWidget]);

  return {
    widgetContainerRef,
    widgetKey,
  };
}
