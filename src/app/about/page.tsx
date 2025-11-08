'use client';

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import Icon, { type IconName } from '@/components/Icon';
import Link from 'next/link';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

const missionPoints = [
  {
    title: 'Authentic Cultural Immersion',
    description: 'We believe in connecting travelers with the real Aruba through genuine local experiences, cultural education, and community engagement.',
    icon: 'user-group',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
  {
    title: 'Technology-Enhanced Discovery',
    description: 'Leveraging cutting-edge AI, AR, and mobile technology to create personalized, intelligent travel experiences that adapt to your preferences.',
    icon: 'sparkles',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    title: 'Sustainable Tourism',
    description: 'Supporting local businesses, preserving cultural heritage, and promoting responsible tourism that benefits the Aruban community.',
    icon: 'heart',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    title: 'Accessibility & Inclusion',
    description: 'Making Aruba accessible to all travelers through multi-language support, offline capabilities, and inclusive design principles.',
    icon: 'globe-alt',
    color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]',
  },
];

const technologyFeatures = [
  {
    title: 'Itinerary Generator Engine',
    description: 'Machine learning algorithms that understand your preferences and create personalized recommendations that improve over time.',
    details: [
      'Preference learning and adaptation',
      'Weather-aware planning',
      'Real-time optimization',
      'Behavioral pattern recognition',
      'Predictive recommendations',
    ],
  },
  {
    title: 'Augmented Reality Navigation',
    description: 'Revolutionary AR technology that overlays digital information on the real world, helping you discover hidden gems and local insights.',
    details: [
      'Point-and-discover functionality',
      'Interactive 3D landmarks',
      'Real-time local information',
      'Offline AR capabilities',
      'Social sharing features',
    ],
  },
  {
    title: 'Comprehensive Offline System',
    description: 'Complete offline functionality ensuring you can explore Aruba without any internet connection while maintaining full app capabilities.',
    details: [
      'High-resolution offline maps',
      'Offline navigation system',
      'Downloadable content library',
      'Offline search functionality',
      'Local data synchronization',
    ],
  },
  {
    title: 'Community-Driven Platform',
    description: 'A platform that connects travelers with locals, fostering authentic cultural exchange and community-driven recommendations.',
    details: [
      'Local host marketplace',
      'Community recommendation system',
      'Social meetup features',
      'Cultural exchange programs',
      'User-generated content',
    ],
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            eyebrow="About Aruba Travel Buddy"
            title="Revolutionizing Travel Through Technology"
            subtitle="We're dedicated to making your Aruba experience unforgettable by providing personalized recommendations, seamless booking services, and authentic local insights that help you discover the true beauty of One Happy Island."
            center
          />
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              To bridge the gap between technology and authentic travel experiences, creating meaningful connections between travelers and the local Aruban community.
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
                className="card group p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 bg-gradient-to-br ${point.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={point.icon as IconName} className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">{point.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader title="Technology That Powers Your Trip" center />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technologyFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display group-hover:text-[var(--brand-aruba)] transition-colors duration-200">{feat.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feat.description}</p>
                <ul className="space-y-3">
                  {feat.details.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-gray-700">
                      <Icon name="check-circle" className="w-5 h-5 text-[var(--brand-aruba)] flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] via-[var(--brand-aruba-light)] to-[var(--brand-amber)]" />
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
