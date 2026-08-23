'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import InteractiveMap from '@/components/InteractiveMap';


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
    href: '/restaurants',
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
      {/* Unified Header & Map Section */}
      <section className="py-12 bg-white">
        
        <InteractiveMap />
      </section>

      
    </div>
  );
}

