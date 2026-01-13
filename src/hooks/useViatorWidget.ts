"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook for managing Viator widgets across client-side navigation.
 * 
 * Problem: Viator's script only scans the DOM once when it loads. On Next.js
 * client-side navigation, new widget containers aren't detected.
 * 
 * Solution: Completely reload the Viator script on every navigation to force
 * it to re-scan the DOM and initialize widgets.
 */
export function useViatorWidget(widgetRef: string) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = useState(() => `viator-${Date.now()}`);
  const scriptElementRef = useRef<HTMLScriptElement | null>(null);

  // Reload Viator script on navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log(`[Viator Widget] Pathname changed to: ${pathname}, reloading script`);
    
    // Remove old script if it exists
    if (scriptElementRef.current && scriptElementRef.current.parentNode) {
      console.log('[Viator Widget] Removing old script');
      scriptElementRef.current.parentNode.removeChild(scriptElementRef.current);
      scriptElementRef.current = null;
    }

    // Also remove any scripts with the Viator URL that might exist
    const existingScripts = document.querySelectorAll('script[src*="viator.com"]');
    existingScripts.forEach(script => {
      if (script.parentNode) {
        console.log('[Viator Widget] Removing existing Viator script');
        script.parentNode.removeChild(script);
      }
    });

    // Wait a moment to ensure DOM is ready and old script is cleaned up
    const loadTimeout = setTimeout(() => {
      console.log('[Viator Widget] Loading fresh Viator script');
      
      // Create and inject new script
      const script = document.createElement('script');
      script.src = 'https://www.viator.com/orion/partner/widget.js';
      script.async = true;
      
      script.onload = () => {
        console.log('[Viator Widget] Script loaded successfully');
        
        // Check what was created on window
        const viatorKeys = Object.keys(window).filter(k => k.toLowerCase().includes('viator'));
        console.log('[Viator Widget] Viator-related window keys:', viatorKeys);
        
        // Check if __VIATOR_WIDGET_SCR exists and what it contains
        const viatorWidgetScr = (window as any).__VIATOR_WIDGET_SCR;
        if (viatorWidgetScr) {
          console.log('[Viator Widget] __VIATOR_WIDGET_SCR type:', typeof viatorWidgetScr);
          console.log('[Viator Widget] __VIATOR_WIDGET_SCR methods:', Object.keys(viatorWidgetScr));
          
          // Try to call any init/load/render methods if they exist
          if (typeof viatorWidgetScr.init === 'function') {
            console.log('[Viator Widget] Calling __VIATOR_WIDGET_SCR.init()');
            viatorWidgetScr.init();
          } else if (typeof viatorWidgetScr.load === 'function') {
            console.log('[Viator Widget] Calling __VIATOR_WIDGET_SCR.load()');
            viatorWidgetScr.load();
          } else if (typeof viatorWidgetScr.render === 'function') {
            console.log('[Viator Widget] Calling __VIATOR_WIDGET_SCR.render()');
            viatorWidgetScr.render();
          } else if (typeof viatorWidgetScr.scan === 'function') {
            console.log('[Viator Widget] Calling __VIATOR_WIDGET_SCR.scan()');
            viatorWidgetScr.scan();
          }
        }
        
        // Give Viator time to scan the DOM and initialize
        setTimeout(() => {
          if (widgetContainerRef.current) {
            const iframe = widgetContainerRef.current.querySelector('iframe');
            if (iframe) {
              console.log('[Viator Widget] ✓ Widget initialized successfully');
            } else {
              console.warn('[Viator Widget] ⚠ No iframe found after script load');
              console.log('[Viator Widget] Container:', widgetContainerRef.current.outerHTML);
              
              // Try one more time with __VIATOR_WIDGET_SCR if it exists
              if (viatorWidgetScr) {
                console.log('[Viator Widget] Attempting manual trigger via __VIATOR_WIDGET_SCR');
                // Try different possible methods
                ['init', 'load', 'render', 'scan', 'process', 'execute'].forEach(method => {
                  if (typeof viatorWidgetScr[method] === 'function') {
                    console.log(`[Viator Widget] Trying __VIATOR_WIDGET_SCR.${method}()`);
                    try {
                      viatorWidgetScr[method]();
                    } catch (e) {
                      console.error(`[Viator Widget] Error calling ${method}:`, e);
                    }
                  }
                });
                
                // Check again after attempting manual trigger
                setTimeout(() => {
                  const iframe2 = widgetContainerRef.current?.querySelector('iframe');
                  if (iframe2) {
                    console.log('[Viator Widget] ✓ Widget initialized after manual trigger!');
                  } else {
                    console.error('[Viator Widget] ✗ Still no iframe after manual trigger attempts');
                  }
                }, 1000);
              }
            }
          }
        }, 2000);
      };
      
      script.onerror = (error) => {
        console.error('[Viator Widget] Script load error:', error);
      };
      
      document.body.appendChild(script);
      scriptElementRef.current = script;
    }, 100);

    // Update widget key to force remount
    setWidgetKey(`viator-${Date.now()}`);

    return () => {
      clearTimeout(loadTimeout);
    };
  }, [pathname]);

  return {
    widgetContainerRef,
    widgetKey
  };
}
