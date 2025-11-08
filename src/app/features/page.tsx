'use client';

import Link from 'next/link';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import Icon, { type IconName } from '@/components/Icon';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

const detailedFeatures: Array<{
  title: string;
  description: string;
  details: string[];
  icon: IconName;
  color: string;
}> = [
  {
    title: 'Itinerary Generator',
    description: 'Creates personalized itineraries that adapt to your preferences, weather conditions, and real-time updates. Get intelligent recommendations that learn from your behavior.',
    details: [
      'Machine learning personalization',
      'Weather-aware activity suggestions',
      'Real-time itinerary updates',
      'Preference-based recommendations',
      'Share and collaborate on plans',
    ],
    icon: 'sparkles',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    title: 'AR View & Discovery',
    description: 'Revolutionary Augmented Reality technology lets you point your camera at landmarks to discover hidden gems, local information, and interactive 3D experiences throughout Aruba.',
    details: [
      'Point-and-discover AR functionality',
      'Interactive 3D landmark overlays',
      'Real-time local information',
      'Offline AR capabilities',
      'Social sharing of AR discoveries',
    ],
    icon: 'academic-cap',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    title: 'Complete Offline Experience',
    description: 'Download comprehensive offline maps, guides, and navigation tools. Explore Aruba without any internet connection while maintaining full functionality.',
    details: [
      'High-resolution offline maps',
      'Turn-by-turn offline navigation',
      'Offline points of interest',
      'Downloadable cultural guides',
      'Offline restaurant recommendations',
    ],
    icon: 'wifi',
    color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]',
  },
  {
    title: 'Authentic Local Experiences',
    description: 'Connect with local hosts and discover genuine Aruban culture through curated experiences, social meetups, and community-driven recommendations.',
    details: [
      'Local host experiences',
      'Cultural immersion activities',
      'Social meetups with travelers',
      'Community-driven recommendations',
      'Authentic cultural insights',
    ],
    icon: 'user-group',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
  {
    title: 'Cultural Events & Festivals',
    description: 'Comprehensive calendar of Aruban cultural events, festivals, and celebrations with detailed information, RSVP options, and local tips for each event.',
    details: [
      'Live cultural events calendar',
      'Festival and celebration details',
      'Local celebration insights',
      'Event reminders and RSVP',
      'Cultural context and tips',
    ],
    icon: 'calendar-days',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-tropical)]',
  },
  {
    title: 'Smart Restaurant Guide',
    description: 'Restaurant recommendations with real-time availability, local cuisine insights, and seamless reservation management.',
    details: [
      'Curated restaurant suggestions',
      'Real-time availability checking',
      'Local cuisine education',
      'Reservation management',
      'Dietary preference matching',
    ],
    icon: 'heart',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
  {
    title: 'Photo Challenges & Community',
    description: 'Join daily photo challenges, share your Aruba memories, and connect with fellow travelers through visual storytelling and community features.',
    details: [
      'Daily photo challenges',
      'Memory sharing platform',
      'Traveler community features',
      'Photo contest participation',
      'Social media integration',
    ],
    icon: 'trophy',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    title: 'Papiamento & Culture Learning',
    description: 'Interactive language learning for Papiamento, Aruba\'s native language, plus cultural etiquette, local customs, and immersive cultural education.',
    details: [
      'Interactive Papiamento lessons',
      'Cultural etiquette guide',
      'Local phrasebook',
      'Cultural immersion tips',
      'Pronunciation assistance',
    ],
    icon: 'language',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    title: 'Smart Transportation',
    description: 'Multi-modal transportation planning with real-time routing, car rental integration, public transport schedules, and traffic optimization.',
    details: [
      'Multi-modal route planning',
      'Car rental integration',
      'Public transport schedules',
      'Real-time traffic updates',
      'Cost comparison tools',
    ],
    icon: 'map-pin',
    color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]',
  },
  {
    title: 'Loyalty Rewards Program',
    description: 'Earn points and unlock exclusive benefits as you explore Aruba, with special rewards for supporting local businesses and community engagement.',
    details: [
      'Points-based reward system',
      'Exclusive local discounts',
      'Special experience access',
      'Community recognition',
      'Sustainable tourism rewards',
    ],
    icon: 'trophy',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    title: 'WhatsApp Travel Assistant',
    description: '24/7 intelligent travel assistance through WhatsApp chatbot, providing instant recommendations, booking support, and multi-language help.',
    details: [
      '24/7 travel assistance',
      'Instant recommendations',
      'Booking support',
      'Multi-language support',
      'Emergency assistance',
    ],
    icon: 'chat',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
  {
    title: 'Travel Insurance Integration',
    description: 'Integrated travel insurance options with emergency assistance, coverage recommendations, and seamless claims support for your Aruba adventure.',
    details: [
      'Integrated insurance options',
      'Emergency assistance',
      'Coverage recommendations',
      'Claims support',
      'Medical assistance',
    ],
    icon: 'shield-check',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            eyebrow="Comprehensive Travel Technology"
            title="Revolutionary Aruba Travel Experience"
            subtitle="Itinerary Generator planning, AR view, offline capabilities, local community, and authentic cultural immersion — all in one comprehensive app"
            center
          />
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {detailedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card group p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon name={feature.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display group-hover:text-[var(--brand-aruba)] transition-colors duration-200">{feature.title}</h2>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Icon name="check-circle" className="w-5 h-5 text-[var(--brand-aruba)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{detail}</span>
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
              Ready for Your Authentic Aruba Experience?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Download the app and discover Aruba like never before with Itinerary Generator planning, AR view, and authentic local experiences!
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
