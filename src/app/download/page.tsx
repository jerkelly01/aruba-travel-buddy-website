"use client";

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import Icon, { type IconName } from '@/components/Icon';
import Image from 'next/image';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

const downloadOptions: {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  href: string;
  badge: string;
  store: string;
  storeIcon: string;
  version: string;
  size: string;
  rating: string;
  downloads: string;
}[] = [
  {
    id: 'ios',
    title: 'Aruba Travel Buddy',
    description: 'Itinerary Generator trip planning, AR view, and authentic local experiences for iOS devices.',
    icon: 'device-phone-mobile',
    href: 'https://apps.apple.com/app/aruba-travel-buddy/id1234567890',
    badge: '★★★★★ 4.8 • Free • In-App Purchases',
    store: 'Download on the',
    storeIcon: '📱',
    version: 'v2.1.0',
    size: '45.2 MB',
    rating: '4.8',
    downloads: '50K+',
  },
  {
    id: 'android',
    title: 'Aruba Travel Buddy',
    description: 'Your ultimate Caribbean companion with local insights and personalized recommendations.',
    icon: 'cpu-chip',
    href: 'https://play.google.com/store/apps/details?id=com.arubatravelbuddy.app',
    badge: '★★★★★ 4.7 • Free • In-App Purchases',
    store: 'GET IT ON',
    storeIcon: '🤖',
    version: 'v2.1.0',
    size: '52.8 MB',
    rating: '4.7',
    downloads: '100K+',
  },
];

const benefits: {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
}[] = [
  {
    id: 'performance',
    title: 'Fast & Reliable',
    description: 'Lightning-fast performance with reliable access to all features and content.',
    icon: 'bolt',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    id: 'security',
    title: 'Secure & Private',
    description: 'Enterprise-grade encryption keeps every itinerary and saved spot safe.',
    icon: 'shield-check',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    id: 'personalized',
    title: 'Personalized Guidance',
    description: 'Itinerary Generator recommendations curated for your travel style and preferences.',
    icon: 'sparkles',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
];

export default function Download() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200 mb-6"
            >
              🎁 COMPLETELY FREE TO DOWNLOAD
            </motion.div>
            <SectionHeader
              title="Download Aruba Travel Buddy"
              subtitle="🎉 FREE to download on iOS and Android — Itinerary Generator planning, AR view, and authentic local experiences"
              center
            />
          </div>
        </Container>
      </section>

      {/* Download Options */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8"
              >
                {/* App Icon and Basic Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-aruba-dark)] rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                    <Image src="/logo.png" alt="App icon" width={48} height={48} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 font-display">{option.title}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        FREE
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[var(--brand-amber)]">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} name="star" className="w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{option.rating}</span>
                      <span className="text-sm text-gray-500">• {option.downloads} downloads</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{option.description}</p>

                {/* App Details */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Version</span>
                    <span className="font-semibold text-gray-900">{option.version}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Size</span>
                    <span className="font-semibold text-gray-900">{option.size}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Compatibility</span>
                    <span className="font-semibold text-gray-900">
                      {option.id === 'ios' ? 'iOS 14.0+' : 'Android 8.0+'}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <a
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl ${
                    option.id === 'ios'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <span className="text-2xl">{option.id === 'ios' ? '📱' : '🤖'}</span>
                  <div className="text-left">
                    <div className="text-xs opacity-90">
                      <span className="font-bold">FREE</span> • {option.store}
                    </div>
                    <div className="text-sm font-bold">
                      {option.id === 'ios' ? 'App Store' : 'Google Play'}
                    </div>
                  </div>
                  <Icon name="arrow-right" className="h-5 w-5 ml-auto" />
                </a>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 mr-2">
                      FREE DOWNLOAD
                    </span>
                    {option.badge}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader title="What You Get" center />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon name={benefit.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
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
              Ready to Explore Aruba?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              🎁 <strong>Completely FREE to download!</strong> Start planning your perfect Caribbean vacation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {downloadOptions.map((option) => (
                <a
                  key={option.id}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-2xl hover:shadow-3xl ${
                    option.id === 'ios'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <span className="text-2xl">{option.id === 'ios' ? '📱' : '🤖'}</span>
                  <div className="text-left">
                    <div className="text-xs opacity-90">
                      <span className="font-bold">FREE</span> • {option.store}
                    </div>
                    <div className="text-sm font-bold">
                      {option.id === 'ios' ? 'App Store' : 'Google Play'}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
