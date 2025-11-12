"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import Icon, { type IconName } from "@/components/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useExperiences } from "@/lib/experiences";
import { useState, useEffect } from "react";

export default function Home() {
  const allExperiences = useExperiences().filter((e) => e.active);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const getFeaturedExperiences = () => {
    const totalExperiences = allExperiences.length;
    const experiencesPerRotation = 3;
    const startIndex = currentRotation % totalExperiences;
    const endIndex = Math.min(startIndex + experiencesPerRotation, totalExperiences);
    let featured = allExperiences.slice(startIndex, endIndex);
    if (featured.length < experiencesPerRotation) {
      const remaining = experiencesPerRotation - featured.length;
      featured = [...featured, ...allExperiences.slice(0, remaining)];
    }
    return featured;
  };

  const featured = getFeaturedExperiences();

  useEffect(() => {
    if (isPaused || allExperiences.length === 0) return;
    const interval = setInterval(() => {
      setCurrentRotation((prev: number) => (prev + 1) % allExperiences.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [allExperiences.length, isPaused]);

  const features = [
    {
      icon: "sparkles",
      title: "Itinerary Generator & Smart",
      description: "Creates personalized itineraries and recommendations.",
      color: "from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]",
    },
    {
      icon: "academic-cap",
      title: "AR View",
      description: "Point your camera to discover hidden gems and local spots.",
      color: "from-[var(--brand-amber)] to-[var(--brand-sun)]",
    },
    {
      icon: "wifi",
      title: "Works Offline",
      description: "Complete offline maps and guides—no WiFi needed.",
      color: "from-[var(--brand-tropical)] to-[var(--brand-aruba)]",
    },
    {
      icon: "user-group",
      title: "Local Community",
      description: "Connect with locals and authentic Aruban experiences.",
      color: "from-[var(--brand-coral)] to-[var(--brand-peach)]",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[35vh] flex items-center overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hafenbild-oranjestad--aruba- copy.jpg"
            alt="Beautiful Oranjestad harbor, Aruba - Caribbean waterfront with colorful Dutch colonial buildings"
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/60 via-black/40 to-black/50" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Subtle animated background elements */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--brand-aruba)]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--brand-amber)]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <Container className="relative z-[2] pt-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl relative"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg"
            >
              <Icon name="sparkles" className="w-3.5 h-3.5 text-[var(--brand-sun)] animate-pulse" />
              <span className="text-xs text-white/90 font-medium">Your Personal Aruba Guide</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4 font-display drop-shadow-2xl"
            >
              <span className="block">Discover</span>
              <span className="block bg-gradient-to-r from-[var(--brand-aruba-light)] to-[var(--brand-sun)] bg-clip-text text-transparent drop-shadow-lg">
                Aruba
              </span>
              <span className="block">Like Never Before</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base sm:text-lg text-white/90 mb-6 leading-relaxed max-w-3xl"
            >
              Your comprehensive travel companion featuring Itinerary Generator trip planning, AR view, offline maps, local experiences, and authentic cultural immersion in One Happy Island.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                href="/download"
                size="lg"
                variant="secondary"
                className="bg-white text-[var(--brand-aruba)] hover:bg-gray-50 hover:text-[var(--brand-aruba-dark)] shadow-2xl hover:shadow-3xl border-0 font-bold"
                icon="device-phone-mobile"
              >
                Download Free App
              </Button>
              <Button 
                href="/features" 
                variant="outline" 
                size="lg"
                className="border-2 border-white/50 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/70"
              >
                Explore Features
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Features Highlights */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="card p-6 h-full hover:border-[var(--brand-aruba)]/30">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={feature.icon as IconName} className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Experiences */}
      {allExperiences.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3 font-display">Featured Experiences</h2>
                <p className="text-gray-600 text-lg">Discover authentic Aruban adventures</p>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm text-gray-600">{isPaused ? 'Paused' : 'Auto-rotating'}</span>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[var(--brand-aruba)] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300"
                  >
                    {isPaused ? '▶' : '⏸'}
                  </button>
                </div>
                <Link 
                  href="/experiences" 
                  className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)] font-semibold transition-colors duration-200 flex items-center gap-2 group"
                >
                  View all
                  <Icon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentRotation}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {featured.map((exp, index) => (
                  <motion.div
                    key={`${exp.slug}-${currentRotation}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
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
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Icon name="calendar-days" className="w-4 h-4" />
                              {exp.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Container>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Loved by Travelers Worldwide"
            subtitle="See what our users are saying about their Aruba adventures"
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The Itinerary Generator created the perfect itinerary for us! It even adjusted our plans based on weather conditions. The AR view helped us discover hidden spots we never would have found.",
                author: "Sarah M.",
                location: "New York, USA",
              },
              {
                quote: "The offline maps were a lifesaver! We could navigate everywhere without WiFi. The WhatsApp chatbot helped us book last-minute experiences. Incredible app!",
                author: "James T.",
                location: "London, UK",
              },
              {
                quote: "Learning Papiamento through the app made our trip so much more authentic! The local experiences and cultural events calendar were perfect. We felt like locals!",
                author: "Maria G.",
                location: "Barcelona, Spain",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" className="w-5 h-5 text-[var(--brand-amber)]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-[var(--brand-aruba)] text-sm">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] via-[var(--brand-aruba-light)] to-[var(--brand-amber)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              Ready for Your Authentic Aruba Experience?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of travelers using Itinerary Generator planning, AR view, and local insights to discover the real Aruba. Download now and start your adventure!
            </p>
            <Button 
              href="/download" 
              size="lg"
              className="bg-white text-[var(--brand-aruba)] hover:bg-gray-50 shadow-2xl hover:shadow-3xl"
              icon="device-phone-mobile"
            >
              Download Free App
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
