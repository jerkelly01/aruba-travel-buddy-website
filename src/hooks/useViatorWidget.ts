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

    // Delete the Viator flag so the script thinks it's a fresh page
    if ((window as any).__VIATOR_WIDGET_SCR !== undefined) {
      console.log('[Viator Widget] Clearing __VIATOR_WIDGET_SCR flag');
      delete (window as any).__VIATOR_WIDGET_SCR;
    }

    // Wait a moment to ensure DOM is ready and old script is cleaned up
    const loadTimeout = setTimeout(() => {
      console.log('[Viator Widget] Loading fresh Viator script');
      
      // Create and inject new script
      const script = document.createElement('script');
      script.src = 'https://www.viator.com/orion/partner/widget.js';
      script.async = true;
      
      script.onload = () => {
        console.log('[Viator Widget] Script loaded and should auto-initialize');
        
        // Give Viator time to scan the DOM and initialize widgets
        setTimeout(() => {
          if (widgetContainerRef.current) {
            const iframe = widgetContainerRef.current.querySelector('iframe');
            if (iframe) {
              console.log('[Viator Widget] ✓ Widget initialized successfully');
            } else {
              console.warn('[Viator Widget] ⚠ Widget did not initialize');
              console.log('[Viator Widget] Container HTML:', widgetContainerRef.current.outerHTML);
            }
          }
        }, 1500);
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
