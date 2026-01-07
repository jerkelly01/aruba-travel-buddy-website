'use client';

import Container from '@/components/Container';
import Icon, { type IconName } from '@/components/Icon';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';

const missionPoints = [
  {
    title: 'Authentic Cultural Immersion',
    description: 'Connecting travelers with real Aruba through genuine local experiences.',
    icon: 'user-group',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
  {
    title: 'Technology-Enhanced Discovery',
    description: 'AI and AR technology creating personalized, intelligent travel experiences.',
    icon: 'sparkles',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    title: 'Sustainable Tourism',
    description: 'Supporting local businesses and preserving Aruban cultural heritage.',
    icon: 'heart',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    title: 'Accessibility & Inclusion',
    description: 'Making Aruba accessible to all travelers through inclusive design.',
    icon: 'globe-alt',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]',
  },
];

const technologyFeatures = [
  {
    title: 'Itinerary Generator',
    description: 'AI-powered planning that learns your preferences.',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    features: ['Smart Recommendations', 'Weather-Aware Planning', 'Real-Time Updates'],
  },
  {
    title: 'AR Navigation',
    description: 'Discover hidden gems through augmented reality.',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    features: ['Point & Discover', '3D Landmarks', 'Offline AR'],
  },
  {
    title: 'Offline System',
    description: 'Complete functionality without internet connection.',
    image: '/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png',
    features: ['Offline Maps', 'Downloadable Content', 'Local Sync'],
  },
  {
    title: 'Community Platform',
    description: 'Connect with locals and fellow travelers.',
    image: '/hafenbild-oranjestad--aruba- copy.jpg',
    features: ['Local Hosts', 'Social Meetups', 'Cultural Exchange'],
  },
];

const galleryImages = [
  '/beaches page.png',
  '/cultural spots page .png',
  '/natural wonders page.png',
  '/restaurants page.png',
  '/local shops page.png',
  '/nightlife page.png',
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hafenbild-oranjestad--aruba- copy.jpg"
            alt="Beautiful Aruba landscape"
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
              <span className="text-sm text-white/90 font-medium">About Us</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 font-display leading-tight">
              Revolutionizing Travel
              <span className="block bg-gradient-to-r from-[var(--brand-aruba-light)] to-[var(--brand-sun)] bg-clip-text text-transparent">
                Through Technology
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Making your Aruba experience unforgettable with personalized recommendations and authentic local insights.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Mission Section with Images */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bridging technology and authentic travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={point.image}
                    alt={point.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 z-10">
                    <div className={`w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={point.icon as IconName} className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <h3 className="text-2xl font-bold text-white mb-2 font-display drop-shadow-lg">{point.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Technology Section with Images */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">Technology That Powers Your Trip</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge features designed to enhance your Aruba experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technologyFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={feat.image}
                    alt={feat.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)]/90 via-[var(--brand-aruba-light)]/80 to-[var(--brand-amber)]/90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <h3 className="text-3xl font-bold text-white mb-3 font-display drop-shadow-lg">{feat.title}</h3>
                    <p className="text-white/90 mb-6 text-lg drop-shadow-md">{feat.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {feat.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium"
                        >
                          {feature}
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

      {/* Image Gallery */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">Aruba Through Our Lens</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the beauty that inspires us every day
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  alt={`Aruba gallery image ${index + 1}`}
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
              Join Thousands of Happy Travelers
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Start your Aruba adventure today with Aruba Travel Buddy.
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
