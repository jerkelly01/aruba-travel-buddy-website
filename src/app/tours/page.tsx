"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicToursApi } from "@/lib/public-api";

interface Tour {
  id: string;
  title: string;
  description: string;
  duration?: string;
  price?: string;
  location?: string;
  images: string[];
  featured: boolean;
  category?: string;
  tags?: string[];
}

export default function ToursPage() {
  const [tours, setTours] = React.useState<Tour[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      console.log('[Tours] Fetching tours...');
      const response = await publicToursApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let toursData: Tour[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          toursData = data;
        } else if (data.items && Array.isArray(data.items)) {
          toursData = data.items;
        } else if (data.tours && Array.isArray(data.tours)) {
          toursData = data.tours;
        } else if (data.data && Array.isArray(data.data)) {
          toursData = data.data;
        }
        
        console.log('[Tours] Parsed tours:', toursData.length);
        setTours(toursData);
      } else {
        console.error('[Tours] Failed to load tours:', response.error);
        setTours([]);
      }
    } catch (error) {
      console.error('[Tours] Error loading tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      return !q || [tour.title, tour.description, tour.location, tour.category].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [tours, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Tours & Excursions"
            subtitle="Discover the best guided tours and excursions Aruba has to offer"
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
              placeholder="Search tours..."
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
              <p className="text-gray-600">Loading tours...</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No tours found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Check back soon for available tours!'}
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
              {filteredTours.map((tour, index) => (
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
                          alt={tour.title} 
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
                      {tour.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            {tour.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {tour.title}
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
                        {tour.duration && (
                          <div className="flex items-center gap-2">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            <span>{tour.duration}</span>
                          </div>
                        )}
                        {tour.category && (
                          <div className="flex items-center gap-2">
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{tour.category}</span>
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
