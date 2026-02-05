"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataCache } from '@/lib/data-cache';
import { publicToursApi, publicLocalExperiencesApi, publicTransportationApi } from '@/lib/public-api';

/**
 * Hook to prefetch data when user hovers over navigation links
 */
export function usePrefetch() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch tours data on mount
    publicToursApi.getAll({ active: true }).catch(() => {});
    
    // Prefetch local experiences
    publicLocalExperiencesApi.getAll({ active: true }).catch(() => {});
    
    // Prefetch bus tours
    publicTransportationApi.getAll({ active: true, type: 'bus_tour' }).catch(() => {});
  }, []);
}

/**
 * Prefetch data for a specific route
 */
export function prefetchRouteData(route: string) {
  switch (route) {
    case '/tours':
      publicToursApi.getAll({ active: true }).catch(() => {});
      break;
    case '/local-experiences':
      publicLocalExperiencesApi.getAll({ active: true }).catch(() => {});
      break;
    case '/bus-tours':
      publicTransportationApi.getAll({ active: true, type: 'bus_tour' }).catch(() => {});
      break;
    case '/private-transportation':
      publicTransportationApi.getAll({ active: true, type: 'private_transportation' }).catch(() => {});
      break;
    case '/car-rentals':
      publicTransportationApi.getAll({ active: true, type: 'car_rental' }).catch(() => {});
      break;
  }
}
