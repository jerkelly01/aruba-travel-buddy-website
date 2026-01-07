'use client';

import * as React from 'react';
import { use } from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import LocationCard from '@/components/LocationCard';
import { publicMapLocationsApi } from '@/lib/public-api';

// Category mapping from URL to API category (matching admin categories)
const CATEGORY_MAP: Record<string, string[]> = {
  beaches: ['beach'],
  'cultural-spots': ['cultural_spot'],
  'natural-wonders': ['natural_wonder'],
  restaurants: ['restaurant'],
  'local-shops': ['local_shop'],
  nightlife: ['club_bar'],
  hotels: ['hotel'],
  activities: ['activity'],
};

const CATEGORY_INFO: Record<string, { name: string; emoji: string; description: string }> = {
  beaches: {
    name: 'Beaches',
    emoji: '🏖️',
    description: 'Discover Aruba\'s beautiful beaches from world-famous Eagle Beach to secluded snorkeling spots.',
  },
  'cultural-spots': {
    name: 'Cultural Spots',
    emoji: '🏛️',
    description: 'Discover Aruba\'s cultural attractions including historic sites, museums, monuments, and architectural heritage.',
  },
  'natural-wonders': {
    name: 'Natural Wonders',
    emoji: '🌴',
    description: 'Explore Aruba\'s natural wonders including caves, rock formations, sand dunes, natural bridges, and scenic viewpoints.',
  },
  restaurants: {
    name: 'Restaurants',
    emoji: '🍽️',
    description: 'Experience authentic Aruban cuisine and international dining options across the island.',
  },
  'local-shops': {
    name: 'Local Shops',
    emoji: '🛍️',
    description: 'Find unique souvenirs, local crafts, and authentic Aruban products from local vendors.',
  },
  nightlife: {
    name: 'Clubs & Bars',
    emoji: '🍹',
    description: 'Enjoy Aruba\'s vibrant nightlife with beach bars, clubs, and entertainment venues.',
  },
  hotels: {
    name: 'Hotels',
    emoji: '🏨',
    description: 'Browse accommodation options from luxury resorts to cozy boutique hotels.',
  },
  activities: {
    name: 'Activities',
    emoji: '🎯',
    description: 'Find exciting activities and adventures including water sports, tours, and experiences.',
  },
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = use(params);
  const [locations, setLocations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');

  const categoryInfo = CATEGORY_INFO[category] || {
    name: category,
    emoji: '📍',
    description: `Explore ${category} in Aruba`,
  };

  const categoryTypes = CATEGORY_MAP[category] || [];

  React.useEffect(() => {
    loadLocations();
  }, [category]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      // Fetch locations for each category type and combine
      const allLocations: any[] = [];
      
      for (const categoryType of categoryTypes) {
        const response = await publicMapLocationsApi.getAll({ 
          category: categoryType,
          active: true 
        });
        
        if (response.success && response.data) {
          const data = Array.isArray(response.data) ? response.data : [];
          allLocations.push(...data);
        }
      }
      
      // Remove duplicates by ID
      const uniqueLocations = Array.from(
        new Map(allLocations.map(loc => [loc.id, loc])).values()
      );
      
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('[Category] Error loading locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((loc) => {
      return !q || 
        loc.name?.toLowerCase().includes(q) ||
        loc.description?.toLowerCase().includes(q) ||
        loc.address?.toLowerCase().includes(q) ||
        loc.location?.toLowerCase().includes(q);
    });
  }, [locations, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center">
            <div className="text-6xl mb-4">{categoryInfo.emoji}</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">
              {categoryInfo.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
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
              placeholder={`Search ${categoryInfo.name.toLowerCase()}...`}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                {query ? 'No locations found' : `No ${categoryInfo.name.toLowerCase()} found`}
              </h3>
              <p className="text-gray-600 mb-6">
                {query 
                  ? 'Try adjusting your search criteria' 
                  : `Check back soon for ${categoryInfo.name.toLowerCase()}!`}
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
            <>
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'} found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <LocationCard location={location} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </div>
  );
}

