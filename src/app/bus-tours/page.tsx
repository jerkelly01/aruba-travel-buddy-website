"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicTransportationApi } from "@/lib/public-api";
import { normalizeTransportation } from "@/lib/data-normalization";

interface Transportation {
  id: string;
  name: string;
  description: string;
  type: string;
  location?: string;
  images: string[];
  featured: boolean;
  pricing_info?: {
    daily_rate?: number;
    hourly_rate?: number;
    price?: string;
  };
  contact_info?: any;
}

export default function BusToursPage() {
  const [tours, setTours] = React.useState<Transportation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      console.log('[Bus Tours] Fetching tours...');
      const response = await publicTransportationApi.getAll({ active: true, type: 'bus_tour' });
      
          if (response.success && response.data) {
            let toursData: Transportation[] = [];
            const data = response.data as any;
            if (Array.isArray(data)) {
              toursData = normalizeTransportation(data);
            } else if (data.items && Array.isArray(data.items)) {
              toursData = normalizeTransportation(data.items);
            } else if (data.data && Array.isArray(data.data)) {
              toursData = normalizeTransportation(data.data);
            }
            
            console.log('[Bus Tours] Parsed tours:', toursData.length);
            setTours(toursData);
      } else {
        console.error('[Bus Tours] Failed to load tours:', response.error);
        setTours([]);
      }
    } catch (error) {
      console.error('[Bus Tours] Error loading tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      const title = tour.name || '';
      return !q || [title, tour.description, tour.location].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [tours, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Bus Tours"
            subtitle="Explore Aruba with guided bus tours and sightseeing experiences"
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
              placeholder="Search bus tours..."
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
              <p className="text-gray-600">Loading bus tours...</p>
            </div>
          ) : filteredTours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No bus tours found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Check back soon for available bus tours!'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredTours.map((tour, index) => {
                const title = tour.name || 'Bus Tour';
                const price = tour.pricing_info?.price 
                  || (tour.pricing_info?.daily_rate ? `From $${tour.pricing_info.daily_rate}/day` : '')
                  || (tour.pricing_info?.hourly_rate ? `From $${tour.pricing_info.hourly_rate}/hour` : '');
                return (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="card overflow-hidden h-full group">
                      <div className="relative h-56 overflow-hidden">
                        {tour.images && tour.images.length > 0 ? (
                          <Image 
                            src={tour.images[0]} 
                            alt={title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                            <Icon name="map-pin" className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {tour.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                              Featured
                            </span>
                          </div>
                        )}
                        {price && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                              {price}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                          {title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {tour.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          {tour.location && (
                            <div className="flex items-center gap-2">
                              <Icon name="map-pin" className="w-4 h-4" />
                              <span>{tour.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
