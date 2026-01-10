"use client";

import * as React from "react";
import Script from "next/script";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import Link from "next/link";
import { useViatorWidget } from "@/hooks/useViatorWidget";

export default function CarRentalsPage() {
  const [query, setQuery] = React.useState("");
  const { containerRef, widgetRef, showFallback } = useViatorWidget("W-30795ed3-bd02-41b4-9f61-c1c69d3dbba1");

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
            title="Car Rentals"
            subtitle="Find the perfect vehicle for your Aruba adventure"
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
              placeholder="Search car rentals..."
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
                <Icon name="device-phone-mobile" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Car Rental Widget</h3>
              <p className="text-gray-600 mb-4">
                Browse and book car rentals directly through our partner platform
              </p>
              <a
                href="https://www.viator.com/en-CA/Aruba/d8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
              >
                <Icon name="arrow-right" className="w-4 h-4" />
                Browse Car Rentals on Viator
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

      {/* Empty State */}
      <section className="py-12 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Icon name="device-phone-mobile" className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Browse Car Rentals Above</h3>
            <p className="text-gray-600 mb-6">
              Explore available car rentals through our partner widget
            </p>
          </motion.div>
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
              Need Help Planning?
            </h2>
            <p className="text-gray-600 mb-8">
              Download the Aruba Travel Buddy app for personalized recommendations and itinerary planning
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
