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

import { useViatorWidget } from "@/hooks/useViatorWidget";

// Custom hook to reinitialize Viator widget when tab becomes visible or page navigates
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

export default function PrivateTransportationPage() {
  const [transportation, setTransportation] = React.useState<Transportation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const { widgetContainerRef: viatorWidgetRef, widgetKey: viatorWidgetKey } = useViatorWidget("W-4f182977-3126-4965-aeb4-7f38f620a29c");

  React.useEffect(() => {
    loadTransportation();
  }, []);

  const loadTransportation = async () => {
    try {
      setLoading(true);
      console.log('[Private Transportation] Fetching transportation...');
      const response = await publicTransportationApi.getAll({ active: true, type: 'private_transportation' });
      
          if (response.success && response.data) {
            let transportationData: Transportation[] = [];
            const data = response.data as any;
            if (Array.isArray(data)) {
              transportationData = normalizeTransportation(data);
            } else if (data.items && Array.isArray(data.items)) {
              transportationData = normalizeTransportation(data.items);
            } else if (data.data && Array.isArray(data.data)) {
              transportationData = normalizeTransportation(data.data);
            }
            
            console.log('[Private Transportation] Parsed transportation:', transportationData.length);
            setTransportation(transportationData);
      } else {
        console.error('[Private Transportation] Failed to load transportation:', response.error);
        setTransportation([]);
      }
    } catch (error) {
      console.error('[Private Transportation] Error loading transportation:', error);
      setTransportation([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransportation = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return transportation.filter((item) => {
      const title = item.name || '';
      return !q || [title, item.description, item.location].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [transportation, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Private Transportation"
            subtitle="Premium private transportation services for your Aruba journey"
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
              placeholder="Search private transportation..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Viator Widget Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div
            key={`viator-widget-${viatorWidgetKey}`}
            ref={viatorWidgetRef}
            data-vi-partner-id="P00276444"
            data-vi-widget-ref="W-4f182977-3126-4965-aeb4-7f38f620a29c"
            id="viator-widget-private-transportation"
          ></div>
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
              <p className="text-gray-600">Loading private transportation...</p>
            </div>
          ) : filteredTransportation.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Private Transportation Above</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Explore available private transportation through our partner widget'}
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
              {filteredTransportation.map((item, index) => {
                const title = item.name || 'Private Transportation';
                const price = item.pricing_info?.price 
                  || (item.pricing_info?.daily_rate ? `From $${item.pricing_info.daily_rate}/day` : '')
                  || (item.pricing_info?.hourly_rate ? `From $${item.pricing_info.hourly_rate}/hour` : '');
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="card overflow-hidden h-full group">
                      <div className="relative h-56 overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <Image 
                            src={item.images[0]} 
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
                        {item.featured && (
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
                          {item.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          {item.location && (
                            <div className="flex items-center gap-2">
                              <Icon name="map-pin" className="w-4 h-4" />
                              <span>{item.location}</span>
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
