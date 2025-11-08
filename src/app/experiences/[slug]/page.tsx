"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { use } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    slug: "utv-adventure",
    title: "UTV Off-Road Adventure",
    duration: "3.5 hours",
    price: "$129",
    image: "/experiences/utv.svg",
    highlights: [
      "Explore Arikok National Park",
      "Off-road dunes and coastline",
      "Small group experience",
    ],
    overview:
      "Kick up sand and discover Aruba's rugged beauty on an unforgettable UTV off-road adventure. Perfect for thrill seekers who want to explore beyond the resort areas.",
  },
  {
    slug: "snorkel-cruise",
    title: "Snorkel Cruise",
    duration: "2.5 hours",
    price: "$89",
    image: "/experiences/snorkel.svg",
    highlights: [
      "Swim in crystal-clear waters",
      "All gear included",
      "Family friendly",
    ],
    overview:
      "Sail the blue and dive into vibrant reefs teeming with marine life. A relaxing, family-friendly cruise with stunning coastal views.",
  },
  {
    slug: "catamaran-sail",
    title: "Catamaran Sail",
    duration: "2 hours",
    price: "$99",
    image: "/experiences/catamaran.svg",
    highlights: [
      "Smooth sailing along the coast",
      "Golden-hour views",
      "Chill vibes and great music",
    ],
    overview:
      "Catch the breeze and soak in Aruba's coastline aboard a spacious catamaran. Ideal for couples, friends, and sunset seekers.",
  },
  {
    slug: "airport-transfer",
    title: "Airport Transfer",
    duration: "One-way",
    price: "$25",
    image: "/experiences/transfer.svg",
    highlights: [
      "Comfortable vehicles",
      "Friendly local drivers",
      "Door-to-door convenience",
    ],
    overview:
      "Skip the taxi line and start your trip stress-free. Reliable, comfortable transfers from the airport to your stay.",
  },
];

export default function ExperienceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const exp = EXPERIENCES.find((e) => e.slug === slug);

  if (!exp) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Container>
          <div className="text-center py-24">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">Experience not found</h1>
            <p className="text-gray-600 mb-8">Please browse all experiences.</p>
            <Link href="/experiences">
              <Button variant="primary">Back to Experiences</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/experiences" className="hover:text-[var(--brand-aruba)] transition-colors">
              Experiences
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{exp.title}</span>
          </nav>
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">{exp.title}</h1>
            <div className="flex items-center gap-4 text-lg text-gray-600">
              <span className="flex items-center gap-2">
                <Icon name="calendar-days" className="w-5 h-5" />
                {exp.duration}
              </span>
              <span className="text-2xl font-bold text-[var(--brand-aruba)]">{exp.price}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8 mb-8"
              >
                <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100 mb-8">
                  <Image src={exp.image} alt={exp.title} fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Overview</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{exp.overview}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Highlights</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <Icon name="check-circle" className="w-5 h-5 text-[var(--brand-aruba)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Sidebar CTA */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 sticky top-24"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-3xl font-bold text-gray-900">{exp.price}</span>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                <Button
                  href="/download"
                  className="w-full"
                  size="lg"
                >
                  Book Now
                </Button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  No payment processed here—demo only.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/experiences" className="inline-flex items-center gap-2 text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)] font-semibold transition-colors">
              <Icon name="arrow-right" className="w-4 h-4 rotate-180" />
              Back to all experiences
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
