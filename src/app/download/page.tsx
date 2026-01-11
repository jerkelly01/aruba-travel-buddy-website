"use client";

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import Icon, { type IconName } from '@/components/Icon';
import Image from 'next/image';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[var(--brand-aruba)]/5 via-white to-[var(--brand-amber)]/5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200 mb-8 shadow-lg"
            >
              <span className="text-xl mr-2">🎁</span>
              <span>COMPLETELY FREE TO DOWNLOAD</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-display"
            >
              Download Aruba Travel Buddy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed"
            >
              🎉 <strong>FREE</strong> to download on iOS and Android — Itinerary Generator planning, AR view, and authentic local experiences
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Download Options */}
      <section className="py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
                    option.id === 'ios' 
                      ? 'from-gray-900 to-gray-700' 
                      : 'from-green-600 to-emerald-500'
                  }`} />
                  
                  <div className="p-10">
                    {/* App Icon and Header */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="flex-shrink-0 relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-aruba-dark)] rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <Image 
                            src="/logo.png" 
                            alt="App icon" 
                            width={56} 
                            height={56} 
                            className="w-full h-full object-contain p-3" 
                            unoptimized
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-2">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900 font-display">{option.title}</h3>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200 shadow-sm">
                            FREE
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex text-[var(--brand-amber)]">
                            {[...Array(5)].map((_, i) => (
                              <Icon key={i} name="star" className="w-5 h-5" />
                            ))}
                          </div>
                          <span className="text-base font-bold text-gray-900">{option.rating}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600 font-medium">{option.downloads} downloads</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-8 text-base leading-relaxed font-medium">
                      {option.description}
                    </p>

                    {/* App Details Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1 font-medium">Version</div>
                        <div className="text-sm font-bold text-gray-900">{option.version}</div>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <div className="text-xs text-gray-500 mb-1 font-medium">Size</div>
                        <div className="text-sm font-bold text-gray-900">{option.size}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1 font-medium">OS</div>
                        <div className="text-sm font-bold text-gray-900">
                          {option.id === 'ios' ? 'iOS 14+' : 'Android 8+'}
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <a
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/btn w-full inline-flex items-center justify-between gap-4 px-8 py-5 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl ${
                        option.id === 'ios'
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl transform group-hover/btn:scale-110 transition-transform duration-300">
                          {option.id === 'ios' ? '📱' : '🤖'}
                        </span>
                        <div className="text-left">
                          <div className="text-xs opacity-90 mb-1">
                            <span className="font-bold">FREE</span> • {option.store}
                          </div>
                          <div className="text-lg font-bold">
                            {option.id === 'ios' ? 'App Store' : 'Google Play'}
                          </div>
                        </div>
                      </div>
                      <Icon 
                        name="arrow-right" 
                        className="h-6 w-6 transform group-hover/btn:translate-x-2 transition-transform duration-300" 
                      />
                    </a>

                    {/* Badge */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 mr-2">
                          FREE DOWNLOAD
                        </span>
                        {option.badge}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--brand-aruba)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">
              What You Get
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for an unforgettable Aruba adventure
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${benefit.color} rounded-t-3xl`} />
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon name={benefit.icon} className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display text-center">{benefit.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{benefit.description}</p>
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] via-[var(--brand-aruba-light)] to-[var(--brand-amber)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display">
              Ready to Explore Aruba?
            </h2>
            <p className="text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed">
              🎁 <strong>Completely FREE to download!</strong> Start planning your perfect Caribbean vacation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-2xl mx-auto">
              {downloadOptions.map((option, index) => (
                <motion.a
                  key={option.id}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`group/cta flex-1 inline-flex items-center justify-center gap-4 px-8 py-5 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl ${
                    option.id === 'ios'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <span className="text-3xl transform group-hover/cta:scale-110 transition-transform duration-300">
                    {option.id === 'ios' ? '📱' : '🤖'}
                  </span>
                  <div className="text-left">
                    <div className="text-xs opacity-90 mb-1">
                      <span className="font-bold">FREE</span> • {option.store}
                    </div>
                    <div className="text-base font-bold">
                      {option.id === 'ios' ? 'App Store' : 'Google Play'}
                    </div>
                  </div>
                  <Icon 
                    name="arrow-right" 
                    className="h-6 w-6 ml-auto transform group-hover/cta:translate-x-2 transition-transform duration-300" 
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
