'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import AppIcon from '@/components/Icon';
import { publicMapLocationsApi } from '@/lib/public-api';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-aruba)]"></div></div> }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Import Leaflet CSS only on client side - use useEffect to avoid SSR issues

interface MapLocation {
  id: string;
  name: string;
  description?: string;
  category: string;
  images?: string[];
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  beach: '#00BFFF',
  cultural_spot: '#8B5CF6',
  natural_wonder: '#059669',
  restaurant: '#FF6B35',
  local_shop: '#F59E0B',
  club_bar: '#EF4444',
  hotel: '#EF4444',
  activity: '#3B82F6',
};

const CATEGORY_ICONS: Record<string, string> = {
  beach: '🏖️',
  cultural_spot: '🏛️',
  natural_wonder: '🌿',
  restaurant: '🍽️',
  local_shop: '🛍️',
  club_bar: '🍹',
  hotel: '🏨',
  activity: '📸',
};

const CATEGORY_NAMES: Record<string, string> = {
  beach: 'Beaches',
  cultural_spot: 'Cultural Spots',
  natural_wonder: 'Natural Wonders',
  restaurant: 'Restaurants',
  local_shop: 'Local Shops',
  club_bar: 'Clubs & Bars',
  hotel: 'Hotels',
  activity: 'Activities',
};

// Custom marker icon component - matches the app's EnhancedMapMarker design
function createCustomIcon(category: string) {
  if (typeof window === 'undefined') return null;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    const color = CATEGORY_COLORS[category] || '#6B7280';
    const emoji = CATEGORY_ICONS[category] || '📍';
    const size = 44; // Medium size from app
    
    // Create a circular marker with emoji, matching the app design
    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Drop shadow -->
        <defs>
          <filter id="shadow-${category}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Main circle with border -->
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" 
                fill="${color}" 
                stroke="white" 
                stroke-width="3" 
                filter="url(#shadow-${category})"/>
        
        <!-- Emoji text -->
        <text x="${size/2}" y="${size/2 + 2}" 
              font-size="${Math.round(size * 0.55)}" 
              text-anchor="middle" 
              dominant-baseline="middle"
              style="pointer-events: none;">
          ${emoji}
        </text>
      </svg>
    `;
    
    // Use btoa with proper encoding for SVG
    const encodedSvg = btoa(unescape(encodeURIComponent(svgIcon)));
    
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -(size/2)],
      className: 'custom-marker-icon'
    });
  } catch (error) {
    console.error('Error creating custom icon:', error);
    return null;
  }
}

// Component to handle map view updates
function MapViewUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const [MapUpdaterComponent, setMapUpdaterComponent] = useState<React.ComponentType<{ center: [number, number]; zoom: number }> | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-leaflet').then((mod) => {
        const { useMap } = mod;
        const Component = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
          const map = useMap();
          useEffect(() => {
            map.setView(center, zoom);
          }, [map, center, zoom]);
          return null;
        };
        setMapUpdaterComponent(() => Component);
      });
    }
  }, []);
  
  if (!MapUpdaterComponent) return null;
  
  return <MapUpdaterComponent center={center} zoom={zoom} />;
}

export default function MapPage() {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.5211, -69.9683]); // Aruba center
  const [mapZoom, setMapZoom] = useState(11);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Aruba bounds - STRICT restriction to only show Aruba
  // Using exact Aruba boundaries to prevent panning outside
  const arubaBounds: [[number, number], [number, number]] = [
    [12.41, -70.06], // Southwest - exact Aruba boundary
    [12.63, -69.87], // Northeast - exact Aruba boundary
  ];

  // Initialize Leaflet CSS and fix icons only on client side
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Load Leaflet CSS dynamically
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      
      // Fix for default marker icons in Next.js
      import('leaflet').then((L) => {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [selectedCategory]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await publicMapLocationsApi.getAll({
        category: selectedCategory as any,
        active: true,
      });

      if (response.success && response.data) {
        let locationsData: MapLocation[] = [];
        const data = response.data as any;

        if (Array.isArray(data)) {
          locationsData = data;
        } else if (data.items && Array.isArray(data.items)) {
          locationsData = data.items;
        } else if (data.locations && Array.isArray(data.locations)) {
          locationsData = data.locations;
        } else if (data.data && Array.isArray(data.data)) {
          locationsData = data.data;
        }

        // Filter locations with valid coordinates
        const validLocations = locationsData.filter(
          (loc) => loc.latitude && loc.longitude && 
          loc.latitude >= 12.4 && loc.latitude <= 12.65 &&
          loc.longitude >= -70.1 && loc.longitude <= -69.85
        );

        setLocations(validLocations);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(locations.map((loc) => loc.category));
    return Array.from(cats).sort();
  }, [locations]);

  const filteredLocations = useMemo(() => {
    if (!selectedCategory) return locations;
    return locations.filter((loc) => loc.category === selectedCategory);
  }, [locations, selectedCategory]);

  // Get carousel locations (featured or random 5)
  const carouselLocations = useMemo(() => {
    const featured = locations.filter((loc) => loc.featured);
    if (featured.length >= 5) {
      return featured.slice(0, 5);
    }
    // If not enough featured, get random locations
    const shuffled = [...locations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [locations]);

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselLocations.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselLocations.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [carouselLocations.length]);

  const handleMarkerClick = (location: MapLocation) => {
    setSelectedLocation(location);
    if (location.latitude && location.longitude) {
      setMapCenter([location.latitude, location.longitude]);
      setMapZoom(14);
    }
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[var(--brand-aruba)]/10 via-white to-[var(--brand-amber)]/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300BCD4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-6"
            >
              🗺️
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 font-display">
              Explore Aruba on the Map
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover {locations.length} amazing places across the island with interactive maps and location pins
            </p>
            {selectedLocation && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setSelectedLocation(null);
                  setMapCenter([12.5211, -69.9683]);
                  setMapZoom(11);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--brand-aruba)] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-[var(--brand-aruba)]"
              >
                <AppIcon name="map-pin" className="w-5 h-5" />
                <span>View All Locations</span>
              </motion.button>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Map Section */}
      <section className="relative py-12">
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Filter Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] flex items-center justify-center">
                    <AppIcon name="map-pin" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-display">Categories</h3>
                    <p className="text-xs text-gray-500">{locations.length} locations</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategoryFilter(null)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      !selectedCategory
                        ? 'bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌴</span>
                      <div className="flex-1">
                        <span className="font-semibold block">All Locations</span>
                        <span className="text-xs opacity-75">View everything</span>
                      </div>
                      <span className="text-sm font-bold opacity-90 bg-white/20 px-2 py-1 rounded-lg">{locations.length}</span>
                    </div>
                  </motion.button>
                  {categories.map((category) => {
                    const count = locations.filter((loc) => loc.category === category).length;
                    return (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCategoryFilter(category)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white shadow-lg scale-105'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CATEGORY_ICONS[category] || '📍'}</span>
                          <div className="flex-1">
                            <span className="font-semibold block">{CATEGORY_NAMES[category] || category}</span>
                            <span className="text-xs opacity-75">{count} {count === 1 ? 'place' : 'places'}</span>
                          </div>
                          {selectedCategory === category && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Map Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100" style={{ height: '80vh', minHeight: '600px' }}>
                {/* Map Info Badge */}
                <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-xs text-gray-500">Showing</div>
                      <div className="text-sm font-bold text-gray-900">
                        {filteredLocations.length} {filteredLocations.length === 1 ? 'Location' : 'Locations'}
                      </div>
                    </div>
                  </div>
                </div>

                {!mounted || loading ? (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-white">
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-[var(--brand-aruba)] border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading map locations...</p>
                      <p className="text-sm text-gray-400 mt-2">Preparing your Aruba adventure</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    minZoom={10}
                    maxZoom={16}
                    style={{ height: '100%', width: '100%' }}
                    bounds={arubaBounds}
                    maxBounds={arubaBounds}
                    maxBoundsViscosity={1.0}
                    scrollWheelZoom={true}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapViewUpdater center={mapCenter} zoom={mapZoom} />
                    {filteredLocations.map((location) => {
                      if (!location.latitude || !location.longitude) return null;
                      return (
                        <Marker
                          key={location.id}
                          position={[location.latitude, location.longitude] as LatLngExpression}
                          icon={createCustomIcon(location.category)}
                          eventHandlers={{
                            click: () => handleMarkerClick(location),
                          }}
                        >
                          <Popup>
                            <div className="p-2 min-w-[200px]">
                              <h3 className="font-bold text-gray-900 mb-1">{location.name}</h3>
                              {location.description && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{location.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{CATEGORY_ICONS[location.category]}</span>
                                <span>{CATEGORY_NAMES[location.category] || location.category}</span>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Selected Location Details */}
      {selectedLocation && (
        <section className="py-12 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-full min-h-[300px]">
                    {selectedLocation.images && selectedLocation.images.length > 0 ? (
                      <Image
                        src={selectedLocation.images[0]}
                        alt={selectedLocation.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-amber)] flex items-center justify-center">
                        <span className="text-6xl">{CATEGORY_ICONS[selectedLocation.category] || '📍'}</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{CATEGORY_ICONS[selectedLocation.category] || '📍'}</span>
                          <span className="text-sm font-semibold text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                            {CATEGORY_NAMES[selectedLocation.category] || selectedLocation.category}
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display">{selectedLocation.name}</h2>
                      </div>
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold leading-none"
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>

                    {selectedLocation.description && (
                      <p className="text-gray-600 mb-6 leading-relaxed">{selectedLocation.description}</p>
                    )}

                    <div className="space-y-4">
                      {selectedLocation.location && (
                        <div className="flex items-start gap-3">
                          <AppIcon name="map-pin" className="w-5 h-5 text-[var(--brand-aruba)] mt-0.5" />
                          <div>
                            <div className="font-semibold text-gray-900">Location</div>
                            <div className="text-gray-600">{selectedLocation.location}</div>
                          </div>
                        </div>
                      )}

                      {selectedLocation.address && (
                        <div className="flex items-start gap-3">
                          <AppIcon name="map-pin" className="w-5 h-5 text-[var(--brand-aruba)] mt-0.5" />
                          <div>
                            <div className="font-semibold text-gray-900">Address</div>
                            <div className="text-gray-600">{selectedLocation.address}</div>
                          </div>
                        </div>
                      )}

                      {selectedLocation.contact_info?.phone && (
                        <div className="flex items-start gap-3">
                          <AppIcon name="phone" className="w-5 h-5 text-[var(--brand-aruba)] mt-0.5" />
                          <div>
                            <div className="font-semibold text-gray-900">Phone</div>
                            <a
                              href={`tel:${selectedLocation.contact_info.phone}`}
                              className="text-[var(--brand-aruba)] hover:underline"
                            >
                              {selectedLocation.contact_info.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedLocation.contact_info?.website && (
                        <div className="flex items-start gap-3">
                          <AppIcon name="globe-alt" className="w-5 h-5 text-[var(--brand-aruba)] mt-0.5" />
                          <div>
                            <div className="font-semibold text-gray-900">Website</div>
                            <a
                              href={selectedLocation.contact_info.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--brand-aruba)] hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedLocation.latitude && selectedLocation.longitude && (
                        <div className="pt-4 border-t border-gray-200">
                          <a
                            href={`https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <AppIcon name="map-pin" className="w-5 h-5" />
                            <span>Get Directions</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Locations List */}
      {!selectedLocation && (
        <section className="py-12 bg-gray-50">
          <Container>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">
                {selectedCategory ? CATEGORY_NAMES[selectedCategory] : 'All Locations'}
              </h2>
              <p className="text-gray-600">
                {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'} found
              </p>
            </div>

            {filteredLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleMarkerClick(location)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {location.images && location.images.length > 0 ? (
                      <div className="relative h-48">
                        <Image
                          src={location.images[0]}
                          alt={location.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-amber)] flex items-center justify-center">
                        <span className="text-5xl">{CATEGORY_ICONS[location.category] || '📍'}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{CATEGORY_ICONS[location.category] || '📍'}</span>
                        <span className="text-xs font-semibold text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                          {CATEGORY_NAMES[location.category] || location.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{location.name}</h3>
                      {location.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{location.description}</p>
                      )}
                      {location.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <AppIcon name="map-pin" className="w-4 h-4" />
                          <span className="truncate">{location.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No locations found for this category.</p>
              </div>
            )}
          </Container>
        </section>
      )}
    </div>
  );
}
