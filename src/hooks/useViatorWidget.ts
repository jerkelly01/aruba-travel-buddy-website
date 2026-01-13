"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useViatorWidget(widgetRef: string) {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = useState(() => Date.now());
  const initAttemptedRef = useRef(false);

  const clearWidget = useCallback(() => {
    const container = widgetContainerRef.current;
    if (container) {
      // Clear all content
      container.innerHTML = '';
      // Remove and re-add data attributes to force Viator to re-detect
      const partnerId = container.getAttribute('data-vi-partner-id');
      const widgetRefAttr = container.getAttribute('data-vi-widget-ref');
      container.removeAttribute('data-vi-partner-id');
      container.removeAttribute('data-vi-widget-ref');
      
      // Force reflow
      void container.offsetHeight;
      
      // Restore attributes
      if (partnerId) container.setAttribute('data-vi-partner-id', partnerId);
      if (widgetRefAttr) container.setAttribute('data-vi-widget-ref', widgetRefAttr);
    }
  }, []);

  const initializeWidget = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const viator = (window as any).viator;
    if (!viator || typeof viator.init !== 'function') {
      return false;
    }

    try {
      // Call viator.init() to scan and initialize all widgets
      viator.init();
      return true;
    } catch (error) {
      console.error('[Viator Widget] Error during init:', error);
      return false;
    }
  }, []);

  const reinitializeWidget = useCallback(() => {
    // Clear the widget
    clearWidget();
    
    // Force remount by changing key
    setWidgetKey(Date.now());
    
    // Reset init attempt flag
    initAttemptedRef.current = false;
  }, [clearWidget]);

  // Handle pathname changes (navigation)
  useEffect(() => {
    reinitializeWidget();
  }, [pathname, reinitializeWidget]);

  // Initialize widget after mount or remount
  useEffect(() => {
    if (typeof window === 'undefined' || !widgetContainerRef.current || initAttemptedRef.current) {
      return;
    }

    let pollCount = 0;
    const maxPolls = 50; // 10 seconds max
    
    const pollForViator = setInterval(() => {
      pollCount++;
      
      if (initializeWidget()) {
        clearInterval(pollForViator);
        initAttemptedRef.current = true;
      } else if (pollCount >= maxPolls) {
        clearInterval(pollForViator);
        console.error('[Viator Widget] Script not available after 10 seconds');
      }
    }, 200);

    return () => {
      clearInterval(pollForViator);
    };
  }, [widgetKey, initializeWidget]);

  return {
    widgetContainerRef,
    widgetKey,
    reinitialize: reinitializeWidget
  };
}
