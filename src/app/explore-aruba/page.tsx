'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';

interface ExploreCategory {
  id: string;
  name: string;
  emoji: string;
  coverImage: string;
  description: string;
  href: string;
}

const EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: 'beaches',
    name: 'Beaches',
    emoji: '🏖️',
    coverImage: '/beaches page.png',
    description: 'Discover Aruba\'s 16+ beautiful beaches from world-famous Eagle Beach to secluded snorkeling spots and surf beaches.',
    href: '/explore-aruba/beaches',
  },
  {
    id: 'cultural_spots',
    name: 'Cultural Spots',
    emoji: '🏛️',
    coverImage: '/cultural spots page .png',
    description: 'Discover Aruba\'s 18+ cultural attractions including historic sites, museums, monuments, and architectural heritage.',
    href: '/explore-aruba/cultural-spots',
  },
  {
    id: 'natural_wonders',
    name: 'Natural Wonders',
    emoji: '🌴',
    coverImage: '/natural wonders page.png',
    description: 'Explore Aruba\'s 17+ natural wonders including caves, rock formations, sand dunes, natural bridges, and scenic viewpoints.',
    href: '/explore-aruba/natural-wonders',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    emoji: '🍽️',
    coverImage: '/restaurants page.png',
    description: 'Experience authentic Aruban cuisine and international dining options across the island.',
    href: '/explore-aruba/restaurants',
  },
  {
    id: 'local_shops',
    name: 'Local Shops',
    emoji: '🛍️',
    coverImage: '/local shops page.png',
    description: 'Find unique souvenirs, local crafts, and authentic Aruban products from local vendors.',
    href: '/explore-aruba/local-shops',
  },
  {
    id: 'clubs_bars',
    name: 'Clubs & Bars',
    emoji: '🍹',
    coverImage: '/nightlife page.png',
    description: 'Enjoy Aruba\'s vibrant nightlife with beach bars, clubs, and entertainment venues.',
    href: '/explore-aruba/nightlife',
  },
  {
    id: 'hotels',
    name: 'Hotels',
    emoji: '🏨',
    coverImage: '/hotels page.png',
    description: 'Browse accommodation options from luxury resorts to cozy boutique hotels.',
    href: '/explore-aruba/hotels',
  },
  {
    id: 'activities',
    name: 'Activities',
    emoji: '🎯',
    coverImage: '/activities page.png',
    description: 'Find exciting activities and adventures including water sports, tours, and experiences.',
    href: '/explore-aruba/activities',
  },
];

export default function ExploreArubaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Explore Aruba"
            subtitle="Discover the best of Aruba through curated categories of beaches, culture, nature, dining, and more"
            center
          />
        </Container>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPLORE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <Image
                      src={category.coverImage}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl flex-shrink-0">
                          {category.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2 font-display group-hover:text-[var(--brand-sun)] transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-white/90 text-sm leading-relaxed mb-4">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-300">
                            <span className="text-sm font-semibold uppercase tracking-wide">Explore</span>
                            <Icon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/beaches page.png"
            alt="Aruba landscape"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)]/90 via-[var(--brand-aruba-light)]/85 to-[var(--brand-amber)]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              Ready to Explore Aruba?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Download the app for interactive maps, AR navigation, and offline access to all these amazing places!
            </p>
            <Link
              href="/download"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--brand-aruba)] rounded-xl hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold text-lg"
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

