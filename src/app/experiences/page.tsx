"use client";

import Image from "next/image";
import Link from "next/link";
import { useExperiences } from "@/lib/experiences";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function ExperiencesPage() {
  const all = useExperiences().filter((e) => e.active);
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState<string | null>(null);

  const tags = React.useMemo(() => {
    const s = new Set<string>();
    all.forEach((e) => e.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [all]);

  const experiences = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((e) => {
      const matchesQ = !q || [e.title, e.slug, e.duration, e.price, e.tags.join(" ")]
        .some((v) => v.toLowerCase().includes(q));
      const matchesTag = !tag || e.tags.includes(tag);
      return matchesQ && matchesTag;
    });
  }, [all, query, tag]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Discover Authentic Aruban Experiences"
            subtitle="From thrilling adventures to cultural immersions, find the perfect experiences for your Aruba trip"
            center
          />
        </Container>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-y border-gray-100">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Icon name="map-pin" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiences..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTag(null)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  !tag 
                    ? 'bg-[var(--brand-aruba)] text-white shadow-lg shadow-[rgba(0,188,212,0.3)]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t === tag ? null : t)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    t === tag 
                      ? 'bg-[var(--brand-aruba)] text-white shadow-lg shadow-[rgba(0,188,212,0.3)]' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <Container>
          {experiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="map-pin" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No experiences found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setQuery('');
                  setTag(null);
                }}
                className="px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/experiences/${exp.slug}`} className="block h-full">
                    <div className="card overflow-hidden h-full group">
                      <div className="relative h-56 overflow-hidden">
                        <Image 
                          src={exp.image} 
                          alt={exp.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            {exp.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            {exp.duration}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.tags.map((t) => (
                            <span 
                              key={t} 
                              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
