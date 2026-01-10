'use client';

import Link from 'next/link';
import Container from '@/components/Container';
import Icon, { type IconName } from '@/components/Icon';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';

const mainFeatures = [
  {
    title: 'Itinerary Generator',
    description: 'AI-powered planning that learns your preferences.',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    icon: 'sparkles',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
    features: ['Smart Recommendations', 'Weather-Aware Planning', 'Real-Time Updates'],
  },
  {
    title: 'AR View & Discovery',
    description: 'Discover hidden gems through augmented reality.',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    icon: 'academic-cap',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
    features: ['Point & Discover', '3D Landmarks', 'Offline AR'],
  },
  {
    title: 'Complete Offline Experience',
    description: 'Full functionality without internet connection.',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    icon: 'wifi',
    color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]',
    features: ['Offline Maps', 'Downloadable Guides', 'Local Sync'],
  },
  {
    title: 'Authentic Local Experiences',
    description: 'Connect with locals and discover genuine Aruban culture.',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    icon: 'user-group',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
    features: ['Local Hosts', 'Cultural Activities', 'Community Events'],
  },
  {
    title: 'Cultural Events & Festivals',
    description: 'Never miss a celebration with our comprehensive calendar.',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    icon: 'calendar-days',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-tropical)]',
    features: ['Event Calendar', 'Festival Details', 'RSVP Options'],
  },
  {
    title: 'Smart Restaurant Guide',
    description: 'Discover the best local cuisine with real-time availability.',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    icon: 'heart',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
    features: ['Curated Suggestions', 'Real-Time Availability', 'Reservation Management'],
  },
];

const additionalFeatures = [
  { title: 'Photo Challenges', icon: 'trophy', color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]' },
  { title: 'Papiamento Learning', icon: 'language', color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]' },
  { title: 'Smart Transportation', icon: 'map-pin', color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]' },
  { title: 'Loyalty Rewards', icon: 'trophy', color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]' },
  { title: 'Tours & Activities', icon: 'bolt', color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]' },
  { title: 'Explore Aruba', icon: 'globe-alt', color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]' },
];

const stats = [
  { number: '12+', label: 'Core Features', icon: 'sparkles' },
  { number: '100%', label: 'Offline Capable', icon: 'wifi' },
  { number: '24/7', label: 'AI Assistant', icon: 'chat' },
  { number: '50K+', label: 'Happy Users', icon: 'user-group' },
];

const galleryImages = [
  '/san nicolas art murals 2.png',
  '/Alto Vista Chapel 1.png',
  '/baby beach 1.png',
  '/fontein cave 2.png',
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/beaches page.png"
            alt="Aruba Travel Buddy Features"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Icon name="sparkles" className="w-4 h-4 text-[var(--brand-sun)]" />
              <span className="text-sm text-white/90 font-medium">Comprehensive Travel Technology</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 font-display leading-tight">
              Revolutionary Aruba
              <span className="block bg-gradient-to-r from-[var(--brand-aruba-light)] to-[var(--brand-sun)] bg-clip-text text-transparent">
                Travel Experience
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Itinerary Generator, AR view, offline capabilities, and authentic cultural immersion — all in one app.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] mb-4 shadow-lg">
                  <Icon name={stat.icon as IconName} className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 font-display">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Features with Images */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">Core Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for an unforgettable Aruba adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-85 group-hover:opacity-75 transition-opacity duration-300`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute top-6 left-6 z-10">
                    <div className={`w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={feature.icon as IconName} className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <h3 className="text-2xl font-bold text-white mb-2 font-display drop-shadow-lg">{feature.title}</h3>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed drop-shadow-md">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">Even More Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Additional tools to enhance your Aruba experience
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature.icon as IconName} className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 font-display group-hover:text-[var(--brand-aruba)] transition-colors duration-200">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">Experience Aruba</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our features help you discover
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={image}
                  alt={`Aruba feature showcase ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hafenbild-oranjestad--aruba- copy.jpg"
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
              Ready for Your Authentic Aruba Experience?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Download the app and discover Aruba like never before!
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
