"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicSupportLocalsApi } from "@/lib/public-api";
import { normalizeSupportLocals } from "@/lib/data-normalization";

interface SupportLocal {
  id: string;
  name: string;
  description: string;
  category?: string;
  location?: string;
  images: string[];
  featured: boolean;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  website?: string;
}

export default function SupportLocalsPage() {
  const [locals, setLocals] = React.useState<SupportLocal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadLocals();
  }, []);

  const loadLocals = async () => {
    try {
      setLoading(true);
      console.log('[Support Locals] Fetching locals...');
      const response = await publicSupportLocalsApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let localsData: SupportLocal[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          localsData = normalizeSupportLocals(data);
        } else if (data.items && Array.isArray(data.items)) {
          localsData = normalizeSupportLocals(data.items);
        } else if (data.supportLocals && Array.isArray(data.supportLocals)) {
          localsData = normalizeSupportLocals(data.supportLocals);
        } else if (data.data && Array.isArray(data.data)) {
          localsData = normalizeSupportLocals(data.data);
        }
        
        console.log('[Support Locals] Parsed locals:', localsData.length);
        setLocals(localsData);
      } else {
        console.error('[Support Locals] Failed to load locals:', response.error);
        setLocals([]);
      }
    } catch (error) {
      console.error('[Support Locals] Error loading locals:', error);
      setLocals([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocals = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return locals.filter((local) => {
      const title = local.name || '';
      return !q || [title, local.description, local.location, local.category].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [locals, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Support Locals"
            subtitle="Discover and support local Aruban businesses and initiatives"
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
              placeholder="Search local businesses..."
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
                <Icon name="heart" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading local businesses...</p>
            </div>
          ) : filteredLocals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="heart" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No local businesses found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Check back soon for local businesses to support!'}
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
              {filteredLocals.map((local, index) => {
                const title = local.name || 'Local Business';
                return (
                  <motion.div
                    key={local.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="card overflow-hidden h-full group">
                      <div className="relative h-56 overflow-hidden">
                        {local.images && local.images.length > 0 ? (
                          <Image 
                            src={local.images[0]} 
                            alt={title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                            <Icon name="heart" className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {local.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                              Featured
                            </span>
                          </div>
                        )}
                        {local.category && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                              {local.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                          {title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {local.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          {local.location && (
                            <div className="flex items-center gap-2">
                              <Icon name="map-pin" className="w-4 h-4" />
                              <span>{local.location}</span>
                            </div>
                          )}
                          {local.contact_info?.phone && (
                            <div className="flex items-center gap-2">
                              <Icon name="phone" className="w-4 h-4" />
                              <span>{local.contact_info.phone}</span>
                            </div>
                          )}
                          {(local.website || local.contact_info?.website) && (
                            <div className="flex items-center gap-2">
                              <Icon name="globe-alt" className="w-4 h-4" />
                              <a 
                                href={local.website || local.contact_info?.website || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[var(--brand-aruba)] hover:underline"
                              >
                                Visit Website
                              </a>
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

