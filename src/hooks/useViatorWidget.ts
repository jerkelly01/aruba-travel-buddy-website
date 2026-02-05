"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Optimized hook for managing Viator widgets across client-side navigation.
 * 
 * The Viator script is preloaded globally in layout.tsx, so we just need to
 * trigger widget reinitialization when the DOM changes, not reload the script.
 */
export function useViatorWidget(widgetRef: string) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = useState(() => `viator-${Date.now()}`);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeWidget = () => {
      if (!widgetContainerRef.current) return;

      const container = widgetContainerRef.current;
      
      // Ensure the container has the correct attributes
      container.setAttribute('data-vi-partner-id', 'P00276444');
      container.setAttribute('data-vi-widget-ref', widgetRef);

      // Check if script is already loaded
      const scriptLoaded = (window as any).viatorScriptLoaded || 
                          (window as any).viatorScriptReady ||
                          document.querySelector('script[src*="viator.com"]');

      if (scriptLoaded) {
        // Script is loaded, trigger widget initialization
        // Viator script should auto-detect new widgets, but we can help it along
        const checkWidget = () => {
          if (container.querySelector('iframe')) {
            initializedRef.current = true;
            return;
          }

          // Try to trigger Viator's widget initialization
          // Some Viator implementations expose a global function
          if ((window as any).viator && typeof (window as any).viator.init === 'function') {
            (window as any).viator.init();
          }

          // Dispatch a custom event that might trigger Viator to rescan
          window.dispatchEvent(new CustomEvent('viatorWidgetReady', {
            detail: { widgetRef }
          }));
        };

        // Check immediately
        checkWidget();

        // Also check after a short delay (Viator might need time to process)
        const checkInterval = setInterval(() => {
          if (container.querySelector('iframe')) {
            clearInterval(checkInterval);
            initializedRef.current = true;
          }
        }, 100);

        // Stop checking after 2 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
        }, 2000);
      } else {
        // Script not loaded yet, wait for it
        const onScriptLoad = () => {
          setTimeout(initializeWidget, 100);
        };

        if ((window as any).viatorScriptLoaded) {
          onScriptLoad();
        } else {
          window.addEventListener('viatorScriptLoaded', onScriptLoad, { once: true });
          return () => {
            window.removeEventListener('viatorScriptLoaded', onScriptLoad);
          };
        }
      }
    };

    // Reset initialization state on pathname change
    initializedRef.current = false;
    setWidgetKey(`viator-${pathname}-${Date.now()}`);

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(initializeWidget, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname, widgetRef]);

  return {
    widgetContainerRef,
    widgetKey
  };
}
