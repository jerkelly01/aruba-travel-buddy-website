"use client";

import Script from "next/script";

export function ViatorScript() {
  return (
    <Script
      src="https://www.viator.com/orion/partner/widget.js"
      strategy="beforeInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined') {
          (window as any).viatorScriptLoaded = true;
          (window as any).viatorScriptReady = true;
          window.dispatchEvent(new CustomEvent('viatorScriptLoaded'));
        }
      }}
      onError={(e) => {
        console.error('[Viator] Script failed to load:', e);
      }}
    />
  );
}
