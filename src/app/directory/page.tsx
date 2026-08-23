"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

const directoryItems = [
  {
    id: 1,
    name: "Aruba Adventure Tours",
    type: "Tour Operator",
    location: "Noord",
    description: "Experience the wild side of Aruba with our guided UTV and ATV tours through Arikok National Park.",
    featured: true,
    image: "/arikok-national-park-aruba.png",
    link: "#"
  },
  {
    id: 2,
    name: "Zeerover",
    type: "Restaurant",
    location: "Savaneta",
    description: "A local favorite serving the freshest catch of the day right on the water. Authentic Aruban seafood experience.",
    featured: true,
    image: "/zeerover-aruba.png",
    link: "#"
  },
  {
    id: 3,
    name: "Pelican Water Sports",
    type: "Water Activities",
    location: "Palm Beach",
    description: "Catamaran sailing, snorkeling, and sunset cruises departing daily from Palm Beach.",
    featured: false,
    image: "/palm-beach-aruba.jpg",
    link: "#"
  },
  {
    id: 4,
    name: "Local Art Studio",
    type: "Art & Culture",
    location: "San Nicolas",
    description: "Discover handmade Aruban crafts, paintings, and souvenirs made by local artists.",
    featured: false,
    image: "/san-nicolas-murals.jpg",
    link: "#"
  },
  {
    id: 5,
    name: "Eagle Beach Rentals",
    type: "Equipment Rental",
    location: "Eagle Beach",
    description: "Rent chairs, umbrellas, and snorkeling gear for a perfect day at one of the world's best beaches.",
    featured: false,
    image: "/eagle-beach-aruba.png",
    link: "#"
  },
  {
    id: 6,
    name: "Downtown Walking Tours",
    type: "Guided Tour",
    location: "Oranjestad",
    description: "Explore the historical architecture and hidden gems of Aruba's capital city.",
    featured: false,
    image: "/fort-zoutman-aruba.png",
    link: "#"
  }
];

export default function DirectoryPage() {
  const [filter, setFilter] = React.useState("All");

  const categories = ["All", "Tour Operator", "Restaurant", "Water Activities", "Art & Culture", "Equipment Rental", "Guided Tour"];

  const filteredItems = filter === "All" 
    ? directoryItems 
    : directoryItems.filter(item => item.type === filter);

  // Sort to put featured items first
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-[var(--brand-aruba)] py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">Local Partners Directory</h1>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto">
              Discover trusted local businesses, tour operators, and authentic Aruban experiences recommended by Aruba Travel Buddy.
            </p>
          </div>
        </Container>
      </section>

      <Container className="mt-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === cat
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border ${
                item.featured ? 'border-[var(--brand-amber)] ring-1 ring-[var(--brand-amber)]' : 'border-gray-100'
              }`}
            >
              {item.featured && (
                <div className="absolute top-4 right-4 z-10 bg-[var(--brand-amber)] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <Icon name="star" className="w-3.5 h-3.5" />
                  FEATURED
                </div>
              )}
              
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[var(--brand-aruba)] text-xs font-bold uppercase tracking-wider block mb-1">
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 font-display">{item.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Icon name="map-pin" className="w-4 h-4" />
                  {item.location}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <Link href={item.link} className="text-[var(--brand-aruba)] text-sm font-semibold hover:underline flex items-center gap-1">
                    View Details
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA for Partners */}
        <div className="mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 text-center border border-blue-100 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display">Own a business in Aruba?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Get your business listed in our directory to reach thousands of travelers. Basic listings are free, or upgrade to a featured placement for maximum visibility.
          </p>
          <Link
            href="/partner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-aruba)] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            Add Your Business
            <Icon name="arrow-right" className="w-5 h-5" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
