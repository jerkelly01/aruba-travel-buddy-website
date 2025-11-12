"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicRestaurantsApi } from "@/lib/public-api";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_types?: string[];
  price_range?: string;
  location?: string;
  images: string[];
  featured: boolean;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operating_hours?: Record<string, string>;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      console.log('[Restaurants] Fetching restaurants...');
      const response = await publicRestaurantsApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let restaurantsData: Restaurant[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          restaurantsData = data;
        } else if (data.items && Array.isArray(data.items)) {
          restaurantsData = data.items;
        } else if (data.restaurants && Array.isArray(data.restaurants)) {
          restaurantsData = data.restaurants;
        } else if (data.data && Array.isArray(data.data)) {
          restaurantsData = data.data;
        }
        
        console.log('[Restaurants] Parsed restaurants:', restaurantsData.length);
        setRestaurants(restaurantsData);
      } else {
        console.error('[Restaurants] Failed to load restaurants:', response.error);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('[Restaurants] Error loading restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((rest) => {
      return !q || [
        rest.name, 
        rest.description, 
        rest.location,
        ...(rest.cuisine_types || [])
      ].some((v) => v?.toLowerCase().includes(q));
    });
  }, [restaurants, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Restaurants & Dining"
            subtitle="Discover the best restaurants and dining experiences in Aruba"
            center
          />
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
              placeholder="Search restaurants..."
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
                <Icon name="star" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading restaurants...</p>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="star" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No restaurants found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Check back soon for available restaurants!'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((rest, index) => (
                <motion.div
                  key={rest.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {rest.images && rest.images.length > 0 ? (
                        <Image 
                          src={rest.images[0]} 
                          alt={rest.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                          <Icon name="star" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {rest.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                            Featured
                          </span>
                        </div>
                      )}
                      {rest.price_range && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            {rest.price_range}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {rest.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {rest.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        {rest.location && (
                          <div className="flex items-center gap-2">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span>{rest.location}</span>
                          </div>
                        )}
                        {rest.cuisine_types && rest.cuisine_types.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{rest.cuisine_types.join(', ')}</span>
                          </div>
                        )}
                        {rest.contact_info?.phone && (
                          <div className="flex items-center gap-2">
                            <Icon name="phone" className="w-4 h-4" />
                            <span>{rest.contact_info.phone}</span>
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
