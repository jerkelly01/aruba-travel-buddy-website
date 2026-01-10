'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { publicMapLocationsApi } from '@/lib/public-api';

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

// Map category IDs to API category values
const CATEGORY_MAP: Record<string, 'beach' | 'cultural_spot' | 'natural_wonder' | 'restaurant' | 'local_shop' | 'club_bar' | 'hotel' | 'activity'> = {
  'beaches': 'beach',
  'cultural-spots': 'cultural_spot',
  'natural-wonders': 'natural_wonder',
  'restaurants': 'restaurant',
  'local-shops': 'local_shop',
  'nightlife': 'club_bar',
  'hotels': 'hotel',
  'activities': 'activity',
};

const CATEGORY_INFO: Record<string, { title: string; emoji: string; description: string }> = {
  'beaches': {
    title: 'Beaches',
    emoji: '🏖️',
    description: 'Discover Aruba\'s 16+ beautiful beaches from world-famous Eagle Beach to secluded snorkeling spots and surf beaches.',
  },
  'cultural-spots': {
    title: 'Cultural Spots',
    emoji: '🏛️',
    description: 'Discover Aruba\'s 18+ cultural attractions including historic sites, museums, monuments, and architectural heritage.',
  },
  'natural-wonders': {
    title: 'Natural Wonders',
    emoji: '🌴',
    description: 'Explore Aruba\'s 17+ natural wonders including caves, rock formations, sand dunes, natural bridges, and scenic viewpoints.',
  },
  'restaurants': {
    title: 'Restaurants',
    emoji: '🍽️',
    description: 'Experience authentic Aruban cuisine and international dining options across the island.',
  },
  'local-shops': {
    title: 'Local Shops',
    emoji: '🛍️',
    description: 'Find unique souvenirs, local crafts, and authentic Aruban products from local vendors.',
  },
  'nightlife': {
    title: 'Clubs & Bars',
    emoji: '🍹',
    description: 'Enjoy Aruba\'s vibrant nightlife with beach bars, clubs, and entertainment venues.',
  },
  'hotels': {
    title: 'Hotels',
    emoji: '🏨',
    description: 'Browse accommodation options from luxury resorts to cozy boutique hotels.',
  },
  'activities': {
    title: 'Activities',
    emoji: '🎯',
    description: 'Find exciting activities and adventures including water sports, tours, and experiences.',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.category as string;
  const [locations, setLocations] = React.useState<MapLocation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');

  const categoryInfo = CATEGORY_INFO[categoryId] || {
    title: 'Explore',
    emoji: '📍',
    description: 'Discover amazing places in Aruba.',
  };
  const apiCategory = CATEGORY_MAP[categoryId];

  React.useEffect(() => {
    if (apiCategory) {
      loadLocations();
    }
  }, [apiCategory]);

  const loadLocations = async () => {
    if (!apiCategory) return;
    
    try {
      setLoading(true);
      console.log(`[${categoryInfo.title}] Fetching locations...`);
      const response = await publicMapLocationsApi.getAll({ 
        category: apiCategory,
        active: true 
      });
      
      if (response.success && response.data) {
        let locationsData: MapLocation[] = [];
        const data = response.data as any;
        
        console.log(`[${categoryInfo.title}] Raw response data:`, data);
        console.log(`[${categoryInfo.title}] Data type:`, typeof data, 'Is array:', Array.isArray(data));
        
        if (Array.isArray(data)) {
          locationsData = data;
        } else if (data.items && Array.isArray(data.items)) {
          locationsData = data.items;
        } else if (data.locations && Array.isArray(data.locations)) {
          locationsData = data.locations;
        } else if (data.data && Array.isArray(data.data)) {
          locationsData = data.data;
        } else {
          console.warn(`[${categoryInfo.title}] Unexpected data structure:`, data);
        }
        
        console.log(`[${categoryInfo.title}] Parsed locations:`, locationsData.length);
        console.log(`[${categoryInfo.title}] Location names:`, locationsData.map(l => l.name));
        setLocations(locationsData);
      } else {
        console.error(`[${categoryInfo.title}] Failed to load locations:`, response.error);
        console.error(`[${categoryInfo.title}] Full response:`, response);
        setLocations([]);
      }
    } catch (error) {
      console.error(`[${categoryInfo.title}] Error loading locations:`, error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((location) => {
      return !q || [location.name, location.description, location.location, location.address].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [locations, query]);

  if (!apiCategory) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/explore-aruba" className="text-[var(--brand-aruba)] hover:underline">
              ← Back to Explore Aruba
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{categoryInfo.emoji}</div>
            <SectionHeader
              title={categoryInfo.title}
              subtitle={categoryInfo.description}
              center
            />
          </div>
          <div className="text-center">
            <Link 
              href="/explore-aruba"
              className="inline-flex items-center gap-2 text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)] transition-colors"
            >
              <Icon name="arrow-right" className="w-4 h-4 rotate-180" />
              <span>Back to Explore Aruba</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-y border-gray-100">
        <Container>
          <div className="relative max-w-md mx-auto">
            <Icon name="map-pin" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${categoryInfo.title.toLowerCase()}...`}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <Container>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading locations...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No locations found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : `Check back soon for ${categoryInfo.title.toLowerCase()}!`}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {location.images && location.images.length > 0 ? (
                        <Image 
                          src={location.images[0]} 
                          alt={location.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                          <Icon name="map-pin" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {location.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {location.name}
                      </h3>
                      {location.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {location.description}
                        </p>
                      )}
                      <div className="space-y-2 text-sm text-gray-600">
                        {location.location && (
                          <div className="flex items-center gap-2">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span>{location.location}</span>
                          </div>
                        )}
                        {location.address && (
                          <div className="flex items-center gap-2">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span className="line-clamp-1">{location.address}</span>
                          </div>
                        )}
                        {location.contact_info?.phone && (
                          <div className="flex items-center gap-2">
                            <Icon name="phone" className="w-4 h-4" />
                            <span>{location.contact_info.phone}</span>
                          </div>
                        )}
                        {location.contact_info?.website && (
                          <div className="flex items-center gap-2">
                            <Icon name="globe-alt" className="w-4 h-4" />
                            <a 
                              href={location.contact_info.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[var(--brand-aruba)] hover:underline line-clamp-1"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

