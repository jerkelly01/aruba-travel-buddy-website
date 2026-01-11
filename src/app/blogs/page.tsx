"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Travel Blogs"
            subtitle="Read our latest travel stories, tips, and insights about Aruba"
            center
          />
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">Travel Blogs</h2>
              <p className="text-gray-600 mb-8">
                Explore our collection of travel tips, cultural insights, and stories about Aruba. Learn about local customs, discover hidden gems, and make the most of your visit to One Happy Island.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                    <Link href="/blogs/10-essential-cultural-tips" className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)]">
                      10 Essential Cultural Tips for Visiting Aruba
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Discover the local customs, traditions, and cultural etiquette that will help you connect authentically with Aruban culture during your visit.
                  </p>
                  <p className="text-sm text-gray-500">5 min read</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                    <Link href="/blogs/complete-guide-aruba-ed-card" className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)]">
                      Complete Guide to Aruba's ED Card Requirements
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Everything you need to know about the ED Card, entry requirements, and how to complete the process smoothly before your trip.
                  </p>
                  <p className="text-sm text-gray-500">3 min read</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                    <Link href="/blogs/best-hidden-gems-local-experiences" className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)]">
                      Best Hidden Gems: Local Experiences You Can't Miss in Aruba
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Explore off-the-beaten-path destinations and authentic local experiences that will make your Aruba trip truly unforgettable.
                  </p>
                  <p className="text-sm text-gray-500">7 min read</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

