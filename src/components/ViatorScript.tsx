"use client";

import Script from "next/script";

export function ViatorScript() {
  return (
    <Script
      src="https://www.viator.com/orion/partner/widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('[Viator] Script loaded successfully');
        if (typeof window !== 'undefined') {
          // Log all Viator-related properties on window
          const viatorProps = Object.keys(window).filter(key => 
            key.toLowerCase().includes('viator')
          );
          console.log('[Viator] Properties on window:', viatorProps);
          
          // Check specifically for viator object and its properties
          if ((window as any).viator) {
            console.log('[Viator] window.viator exists:', (window as any).viator);
            console.log('[Viator] window.viator methods:', Object.keys((window as any).viator));
          } else {
            console.log('[Viator] window.viator does NOT exist');
          }
          
          // Check for Viator Widget object
          if ((window as any).ViatorWidget) {
            console.log('[Viator] window.ViatorWidget exists');
          }
          
          // Check for any other potential Viator globals
          if ((window as any).VIATOR) {
            console.log('[Viator] window.VIATOR exists');
          }
          
          (window as any).viatorScriptLoaded = true;
          window.dispatchEvent(new CustomEvent('viatorScriptLoaded'));
        }
      }}
      onError={(e) => {
        console.error('[Viator] Script failed to load:', e);
      }}
    />
  );
}
