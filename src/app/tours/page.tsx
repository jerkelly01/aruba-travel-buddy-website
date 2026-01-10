"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicToursApi } from "@/lib/public-api";
import { normalizeTours } from "@/lib/data-normalization";
import { CodeSnippet } from "@/components/CodeSnippet";
import { useViatorWidget } from "@/hooks/useViatorWidget";

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
  code_snippet?: string;
}

export default function ToursPage() {
  const [tours, setTours] = React.useState<Tour[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const { containerRef, widgetRef, showFallback } = useViatorWidget("W-44ff9515-9337-48ed-ad52-88b94d11c81d");

  React.useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const response = await publicToursApi.getAll({ featured: true });
      if (response.success && response.data && Array.isArray(response.data)) {
        const normalized = normalizeTours(response.data);
        setTours(normalized);
      }
    } catch (error) {
      console.error("Error loading tours:", error);
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
      {/* Load Viator Script */}
      <Script
        src="https://www.viator.com/orion/partner/widget.js"
        strategy="afterInteractive"
        async
      />

      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
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

      {/* Viator Widget Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          {showFallback ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Tour Booking Widget</h3>
              <p className="text-gray-600 mb-4">
                Explore and book tours directly through our partner platform
              </p>
              <a
                href="https://www.viator.com/en-CA/Aruba/d8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
              >
                <Icon name="arrow-right" className="w-4 h-4" />
                Browse Tours on Viator
              </a>
            </motion.div>
          ) : (
            <div
              ref={containerRef}
              data-vi-partner-id="P00276444"
              data-vi-widget-ref={widgetRef}
              className="min-h-[400px]"
            ></div>
          )}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Tours Above</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Explore available tours through our partner widget'}
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  Featured Tours
                </h2>
                <p className="text-gray-600 mt-2">
                  {filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'} found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {tour.images && tour.images.length > 0 ? (
                        <Image
                          src={tour.images[0]}
                          alt={tour.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-sun)] flex items-center justify-center">
                          <Icon name="map-pin" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 font-display line-clamp-2 group-hover:text-[var(--brand-aruba)] transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {tour.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        {tour.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Icon name="map-pin" className="w-4 h-4" />
                            <span>{tour.location}</span>
                          </div>
                        )}
                        {tour.duration && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            <span>{tour.duration}</span>
                          </div>
                        )}
                        {tour.category && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Icon name="sparkles" className="w-4 h-4" />
                            <span>{tour.category}</span>
                          </div>
                        )}
                      </div>

                      {tour.code_snippet && (
                        <div className="mt-4">
                          <CodeSnippet code={tour.code_snippet} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Ready to Explore?
            </h2>
            <p className="text-gray-600 mb-8">
              Download the Aruba Travel Buddy app to discover even more tours and create your perfect itinerary
            </p>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <Icon name="device-phone-mobile" className="w-6 h-6" />
              Download Free App
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
