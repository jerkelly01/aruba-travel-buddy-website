'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import analytics from '@/lib/analytics';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView();
  }, [pathname]);

  return null;
}

