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
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// Import Leaflet CSS
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
  
  // Fix for default marker icons in Next.js
  const L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

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
  beach: '#00BCD4',
  cultural_spot: '#FF6B8A',
  natural_wonder: '#48A23F',
  restaurant: '#FF8C42',
  local_shop: '#FFC233',
  club_bar: '#9C27B0',
  hotel: '#2196F3',
  activity: '#E91E63',
};

const CATEGORY_ICONS: Record<string, string> = {
  beach: '🏖️',
  cultural_spot: '🏛️',
  natural_wonder: '🌴',
  restaurant: '🍽️',
  local_shop: '🛍️',
  club_bar: '🍹',
  hotel: '🏨',
  activity: '🎯',
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

// Custom marker icon component
function createCustomIcon(category: string) {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  const color = CATEGORY_COLORS[category] || '#00BCD4';
  const icon = CATEGORY_ICONS[category] || '📍';
  
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <text x="16" y="20" font-size="14" text-anchor="middle" fill="${color}">${icon}</text>
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.5211, -69.9683]); // Aruba center
  const [mapZoom, setMapZoom] = useState(11);

  // Aruba bounds
  const arubaBounds: [[number, number], [number, number]] = [
    [12.4, -70.1], // Southwest
    [12.65, -69.85], // Northeast
  ];

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🗺️</div>
            <SectionHeader
              title="Explore Aruba on the Map"
              subtitle="Discover all the amazing places across the island with interactive maps and location pins"
              center
            />
          </div>
        </Container>
      </section>

      {/* Map Section */}
      <section className="relative py-8 bg-gray-50">
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">Filter by Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      !selectedCategory
                        ? 'bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📍</span>
                      <span className="font-semibold">All Locations</span>
                      <span className="ml-auto text-sm opacity-75">({locations.length})</span>
                    </div>
                  </button>
                  {categories.map((category) => {
                    const count = locations.filter((loc) => loc.category === category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{CATEGORY_ICONS[category] || '📍'}</span>
                          <span className="font-semibold">{CATEGORY_NAMES[category] || category}</span>
                          <span className="ml-auto text-sm opacity-75">({count})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '80vh', minHeight: '600px' }}>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-aruba)] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map locations...</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                    bounds={arubaBounds}
                    maxBounds={arubaBounds}
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
            </div>
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
