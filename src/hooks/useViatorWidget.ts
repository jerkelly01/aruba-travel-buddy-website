"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook for managing Viator widgets across client-side navigation.
 * 
 * Viator widgets work by:
 * 1. The script scans the DOM for elements with data-vi-* attributes
 * 2. It injects iframes into those elements to display the widget
 * 3. This happens automatically when the script loads or when new elements are added
 * 
 * The challenge with Next.js client-side navigation is that the script has
 * already run, so it doesn't automatically detect new widget elements.
 * 
 * Solution: Force remount the widget container on navigation by changing its key.
 * This causes React to destroy and recreate the DOM element, potentially
 * triggering Viator's mutation observers to detect and initialize it.
 */
export function useViatorWidget(widgetRef: string) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = useState(() => `viator-${Date.now()}`);
  const iframeCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Force widget remount on navigation
  useEffect(() => {
    console.log(`[Viator Widget] Pathname changed to: ${pathname}, remounting widget`);
    setWidgetKey(`viator-${Date.now()}`);
  }, [pathname]);

  // Monitor widget initialization
  useEffect(() => {
    if (typeof window === 'undefined' || !widgetContainerRef.current) {
      return;
    }

    console.log(`[Viator Widget] Container mounted with key: ${widgetKey}`);
    console.log(`[Viator Widget] Script loaded: ${(window as any).viatorScriptLoaded}`);
    console.log(`[Viator Widget] Widget ref: ${widgetRef}`);
    console.log(`[Viator Widget] Container attributes:`, {
      'data-vi-partner-id': widgetContainerRef.current.getAttribute('data-vi-partner-id'),
      'data-vi-widget-ref': widgetContainerRef.current.getAttribute('data-vi-widget-ref'),
    });

    // Viator widgets inject iframes when they initialize
    // Let's monitor for iframe creation to confirm initialization
    const checkForIframe = () => {
      if (widgetContainerRef.current) {
        const iframe = widgetContainerRef.current.querySelector('iframe');
        const hasContent = widgetContainerRef.current.innerHTML.trim().length > 0;
        
        if (iframe) {
          console.log('[Viator Widget] ✓ Widget iframe detected, initialization successful');
          if (iframeCheckIntervalRef.current) {
            clearInterval(iframeCheckIntervalRef.current);
            iframeCheckIntervalRef.current = null;
          }
          return true;
        } else if (hasContent) {
          console.log('[Viator Widget] ⚠ Content detected but no iframe:', widgetContainerRef.current.innerHTML.substring(0, 100));
        }
      }
      return false;
    };

    // Give the Viator script time to detect and initialize the widget
    const timeoutId = setTimeout(() => {
      console.log('[Viator Widget] Checking for widget initialization...');
      
      if (!checkForIframe()) {
        // Start periodic checking
        let checks = 0;
        iframeCheckIntervalRef.current = setInterval(() => {
          checks++;
          
          if (checkForIframe()) {
            // Success - iframe found
            return;
          }
          
          if (checks >= 20) { // 4 seconds total (20 * 200ms)
            if (iframeCheckIntervalRef.current) {
              clearInterval(iframeCheckIntervalRef.current);
              iframeCheckIntervalRef.current = null;
            }
            
            console.warn('[Viator Widget] ✗ Widget did not initialize after 4 seconds');
            console.log('[Viator Widget] Debugging info:', {
              scriptLoaded: (window as any).viatorScriptLoaded,
              hasContainer: !!widgetContainerRef.current,
              containerHTML: widgetContainerRef.current?.innerHTML || 'N/A',
              windowViator: typeof (window as any).viator,
              windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('viator'))
            });
          }
        }, 200);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (iframeCheckIntervalRef.current) {
        clearInterval(iframeCheckIntervalRef.current);
        iframeCheckIntervalRef.current = null;
      }
    };
  }, [widgetKey, widgetRef]);

  return {
    widgetContainerRef,
    widgetKey
  };
}
