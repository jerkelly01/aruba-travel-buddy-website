"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicLocalExperiencesApi } from "@/lib/public-api";
import { normalizeLocalExperiences } from "@/lib/data-normalization";

interface LocalExperience {
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

export default function LocalExperiencesPage() {
  const [experiences, setExperiences] = React.useState<LocalExperience[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      console.log('[Local Experiences] Fetching experiences...');
      const response = await publicLocalExperiencesApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let experiencesData: LocalExperience[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          experiencesData = normalizeLocalExperiences(data);
        } else if (data.items && Array.isArray(data.items)) {
          experiencesData = normalizeLocalExperiences(data.items);
        } else if (data.localExperiences && Array.isArray(data.localExperiences)) {
          experiencesData = normalizeLocalExperiences(data.localExperiences);
        } else if (data.data && Array.isArray(data.data)) {
          experiencesData = normalizeLocalExperiences(data.data);
        }
        
        console.log('[Local Experiences] Parsed experiences:', experiencesData.length);
        setExperiences(experiencesData);
      } else {
        console.error('[Local Experiences] Failed to load experiences:', response.error);
        setExperiences([]);
      }
    } catch (error) {
      console.error('[Local Experiences] Error loading experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return experiences.filter((exp) => {
      return !q || [exp.title, exp.description, exp.location, exp.category].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [experiences, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Local Experiences"
            subtitle="Immerse yourself in authentic Aruban culture with unique local experiences"
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
              placeholder="Search experiences..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Viator Widget Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div 
            data-vi-partner-id="P00276444" 
            data-vi-widget-ref="W-931e6709-1fe0-41fe-bf74-7daea45d8d5a"
          ></div>
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
              <p className="text-gray-600">Loading experiences...</p>
            </div>
          ) : filteredExperiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="heart" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Experiences Above</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Explore available experiences through our partner widget'}
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
              {filteredExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {exp.images && exp.images.length > 0 ? (
                        <Image 
                          src={exp.images[0]} 
                          alt={exp.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                          <Icon name="heart" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {exp.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                            Featured
                          </span>
                        </div>
                      )}
                      {exp.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            {exp.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {exp.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        {exp.location && (
                          <div className="flex items-center gap-2">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                        {exp.duration && (
                          <div className="flex items-center gap-2">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            <span>{exp.duration}</span>
                          </div>
                        )}
                        {exp.category && (
                          <div className="flex items-center gap-2">
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{exp.category}</span>
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

      {/* Viator Widget Script */}
      <Script
        src="https://www.viator.com/orion/partner/widget.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
