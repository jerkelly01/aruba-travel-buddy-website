"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";
import Icon, { type IconName } from "@/components/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { publicToursApi, publicLocalExperiencesApi, publicRestaurantsApi, publicCulturalEventsApi } from "@/lib/public-api";
import { normalizeTours, normalizeLocalExperiences, normalizeRestaurants, normalizeCulturalEvents } from "@/lib/data-normalization";
import { SafeImage } from "@/components/SafeImage";

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  slug?: string;
  href?: string;
}


function FAQItem({ faq, index }: { faq: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none cursor-pointer"
      >
        <h4 className="text-lg font-bold text-gray-900 font-display pr-4">{faq.question}</h4>
        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          <Icon name="chevron-right" className="w-6 h-6 text-[var(--brand-aruba)]" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  const [allExperiences, setAllExperiences] = useState<FeaturedItem[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setLoadingExperiences(true);
      // Fetch diverse content to ensure enough unique cards
      const [toursResponse, experiencesResponse, restaurantsResponse, culturalResponse] = await Promise.all([
        publicToursApi.getAll({ active: true }),
        publicLocalExperiencesApi.getAll({ active: true }),
        publicRestaurantsApi.getAll({ active: true }),
        publicCulturalEventsApi.getAll({ active: true }),
      ]);

      let featuredItems: FeaturedItem[] = [];

      // Process tours
      if (toursResponse.success && toursResponse.data) {
        const data = toursResponse.data as any;
        let items = Array.isArray(data) ? data : data.items || data.tours || data.data || [];
        const normalized = normalizeTours(items);
        featuredItems.push(...normalized.map((item: any) => ({
          id: item.id, title: item.title, description: item.description, images: item.images || [], href: `/tours`
        })));
      }

      // Process local experiences
      if (experiencesResponse.success && experiencesResponse.data) {
        const data = experiencesResponse.data as any;
        let items = Array.isArray(data) ? data : data.items || data.localExperiences || data.data || [];
        const normalized = normalizeLocalExperiences(items);
        featuredItems.push(...normalized.map((item: any) => ({
          id: item.id, title: item.title, description: item.description, images: item.images || [], href: `/local-experiences`
        })));
      }

      // Process restaurants
      if (restaurantsResponse.success && restaurantsResponse.data) {
        const data = restaurantsResponse.data as any;
        let items = Array.isArray(data) ? data : data.items || data.restaurants || data.data || [];
        const normalized = normalizeRestaurants(items);
        featuredItems.push(...normalized.map((item: any) => ({
          id: item.id, title: item.name, description: item.description, images: item.images || [], href: `/restaurants`
        })));
        setAllRestaurants(normalized);
      }

      // Process cultural events
      if (culturalResponse.success && culturalResponse.data) {
        const data = culturalResponse.data as any;
        let items = Array.isArray(data) ? data : data.items || data.events || data.data || [];
        const normalized = normalizeCulturalEvents(items);
        featuredItems.push(...normalized.map((item: any) => ({
          id: item.id, title: item.title, description: item.description, images: item.images || [], href: `/explore-aruba/cultural-spots`
        })));
      }

      // Shuffle the array to make the mix feel organic
      featuredItems.sort(() => 0.5 - Math.random());

      setAllExperiences(featuredItems);
    } catch (error) {
      console.error('[Home] Error loading featured content:', error);
      setAllExperiences([]);
    } finally {
      setLoadingExperiences(false);
    }
  };

  const getFeaturedExperiences = () => {
    const totalExperiences = allExperiences.length;
    if (totalExperiences === 0) return [];
    
    // Prevent duplicate rendering if we have exactly 6 or fewer unique items
    if (totalExperiences <= 6) return allExperiences;

    const experiencesPerRotation = 6;
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
    }, 6000);
    return () => clearInterval(interval);
  }, [allExperiences.length, isPaused]);

  const features = [
    {
      icon: "sparkles",
      title: "Smart Itineraries",
      description: "AI-powered trip planning",
      color: "from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]",
      link: "/explore-aruba"
    },
    {
      icon: "map",
      title: "AR Navigation",
      description: "Discover hidden gems",
      color: "from-[var(--brand-amber)] to-[var(--brand-sun)]",
      link: "/map"
    },
    {
      icon: "user-group",
      title: "Local Community",
      description: "Connect with authentic Aruba",
      color: "from-[var(--brand-coral)] to-[var(--brand-peach)]",
      link: "/directory"
    },
    {
      icon: "device-phone-mobile",
      title: "Get The App",
      description: "Your pocket travel buddy",
      color: "from-gray-900 to-gray-700",
      link: "/download"
    },
  ];

  const faqs = [
    {
      question: 'How do I download the Aruba Travel Buddy app?',
      answer: 'You can download our app from the Apple App Store or Google Play Store. Visit our download page for direct links and more information.',
    },
    {
      question: 'Is the app available offline?',
      answer: 'Yes! Aruba Travel Buddy works with pre-loaded guides and maps so you can navigate without an internet connection.',
    },
    {
      question: 'How does the AR navigation work?',
      answer: 'Our Augmented Reality (AR) navigation uses your camera to overlay directions and points of interest right onto the real world around you, making it incredibly easy to find restaurants, beaches, and historical spots.',
    },
    {
      question: 'Is the app free to use?',
      answer: 'The core features of the Aruba Travel Buddy app are completely free! We also offer premium features for advanced itinerary generation and exclusive discounts.',
    },
    {
      question: 'Can I book tours and restaurants directly?',
      answer: 'Yes, you can discover and book top-rated local tours, experiences, and make restaurant reservations directly through the app or website.',
    },
    {
      question: 'Do you offer customer support in multiple languages?',
      answer: 'Currently, we provide support in English, Dutch, Papiamento, and Spanish to cater to a wide range of international travelers.',
    },
    {
      question: 'How often is the partner directory updated?',
      answer: 'We continuously update our directory of local businesses, tours, and restaurants to ensure you always have access to the latest open hours, reviews, and offerings.',
    },
    {
      question: 'Do I need internet for the WhatsApp chatbot?',
      answer: 'Yes, the WhatsApp AI concierge requires an active internet connection (Wi-Fi or cellular data) to provide real-time recommendations and booking assistance.',
    },
    {
      question: 'Are the local experiences vetted?',
      answer: 'Absolutely. We personally vet and review all local experiences and tours to ensure they meet our high standards for safety, authenticity, and quality.',
    },
    {
      question: 'Can I suggest a new location or business?',
      answer: 'We love community suggestions! You can submit new places, hidden gems, or local businesses directly through the "Feedback" section in the app.',
    },
    {
      question: 'Can I cancel my premium subscription anytime?',
      answer: 'Absolutely! You can cancel your premium subscription at any time through your Apple or Google account settings.',
    },
    {
      question: 'How do I become a featured partner?',
      answer: 'Local businesses can apply to be a featured partner through the "Become a Partner" page on our website. We offer various promotional packages to help you reach more tourists.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-gray-900 -mt-24 pt-24 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hafenbild-oranjestad--aruba- copy.jpg"
            alt="Beautiful Oranjestad harbor, Aruba"
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>

        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

        {/* Content */}
        <Container className="relative z-[2] w-full flex flex-col justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mt-12"
          >
            {/* Top Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="px-3 py-1 bg-[var(--brand-sun)] text-yellow-900 text-xs font-black uppercase tracking-widest rounded-md shadow-sm">
                Your Smart Travel Companion
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 font-display drop-shadow-2xl tracking-tight"
            >
              Experience the <span className="text-[var(--brand-sun)]">True</span> Aruba
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl sm:text-2xl text-gray-200 font-medium leading-relaxed max-w-3xl mb-10 drop-shadow-md"
            >
              Plan your perfect trip with smart itineraries, local secrets, and instant booking—all in one place.
            </motion.p>

            {/* Search Bar Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-full max-w-4xl"
            >
              {/* Search Box */}
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-2xl mb-5 w-full border border-white/20">
                <div className="flex items-center flex-1 w-full px-4 py-2">
                  <Icon name="magnifying-glass" className="w-6 h-6 text-white mr-3" />
                  <input 
                    type="text" 
                    placeholder="Find beaches, restaurants, or tours..."
                    className="w-full bg-transparent border-none text-white text-lg focus:ring-0 placeholder:text-gray-300 p-0 outline-none"
                  />
                </div>
                <button className="w-full sm:w-auto bg-[var(--brand-aruba)] hover:bg-[var(--brand-aruba-dark)] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-md">
                  Explore
                  <Icon name="arrow-right" className="w-5 h-5" />
                </button>
              </div>

              {/* Popular Tags */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-white/90 text-sm font-medium ml-2 mb-10">
                <span className="text-gray-400">Trending:</span>
                <Link href="/explore-aruba/beaches" className="hover:text-[var(--brand-sun)] transition-colors">Palm Beach</Link>
                <Link href="/directory" className="hover:text-[var(--brand-sun)] transition-colors">Local Seafood</Link>
                <Link href="/tours" className="hover:text-[var(--brand-sun)] transition-colors">UTV Tours</Link>
                <Link href="/tours" className="hover:text-[var(--brand-sun)] transition-colors">Sunset Cruises</Link>
              </div>

              {/* App Download CTA - Professional Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-white/10 w-full max-w-xl"
              >
                <div className="text-white/80 text-sm font-semibold mr-2 uppercase tracking-widest hidden md:block">
                  Get the free app
                </div>
                
                <Link
                  href="https://onelink.to/75vkw3"
                  className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white border border-gray-800 px-5 py-2.5 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  <svg viewBox="0 0 384 512" fill="currentColor" className="w-7 h-7 text-white">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold leading-tight">Download on the</div>
                    <div className="text-base font-bold leading-tight mt-0.5">App Store</div>
                  </div>
                </Link>

                <Link
                  href="https://onelink.to/75vkw3"
                  className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white border border-gray-800 px-5 py-2.5 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                >
                  <svg viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7 text-white">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold leading-tight">GET IT ON</div>
                    <div className="text-base font-bold leading-tight mt-0.5">Google Play</div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Featured Experiences */}
      {allExperiences.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="flex flex-col items-center text-center mb-12">
              <p className="text-[var(--brand-aruba)] font-bold uppercase tracking-widest text-sm mb-2">Curated just for you</p>
              <h2 className="text-5xl font-black text-gray-900 mb-6 font-display tracking-tight">Top Experiences</h2>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">{isPaused ? 'Paused' : 'Auto-rotating'}</span>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[var(--brand-aruba)] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 shadow-sm"
                  aria-label={isPaused ? "Play rotation" : "Pause rotation"}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentRotation}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                {featured.map((exp, index) => (
                  <motion.div
                    key={`${exp.id}-${currentRotation}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={exp.href || `/experiences`} className="block h-full">
                      <div className="card overflow-hidden h-full group">
                        <div className="relative h-64 overflow-hidden">
                          <SafeImage
                            src={exp.images}
                            alt={exp.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            fallbackIcon="sparkles"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black" />
                          <div className="absolute bottom-5 left-5 right-5">
                            <h3 className="text-2xl font-bold text-white font-display line-clamp-2 group-hover:text-[var(--brand-sun)] transition-colors duration-300">
                              {exp.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/90 text-sm font-semibold mt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                              <span>View details</span>
                              <Icon name="arrow-right" className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex justify-center"
            >
              <Button
                href="/experiences"
                variant="outline"
                size="lg"
                icon="arrow-right"
                iconPosition="right"
                className="border-2 border-[var(--brand-aruba)] text-[var(--brand-aruba)] hover:bg-[var(--brand-aruba)] hover:text-white px-8"
              >
                View All Experiences
              </Button>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Explore Aruba Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-12"
          >
            <p className="text-[var(--brand-aruba)] font-bold uppercase tracking-widest text-sm mb-2">Discover Paradise</p>
            <h2 className="text-5xl font-black text-gray-900 mb-6 font-display tracking-tight">Explore Aruba</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Beaches',
                emoji: '🏖️',
                href: '/explore-aruba/beaches',
                description: 'Discover Aruba\'s 16+ beautiful beaches from world-famous Eagle Beach to secluded snorkeling spots',
                image: '/beaches page.png',
                count: '16+',
              },
              {
                name: 'Cultural Spots',
                emoji: '🏛️',
                href: '/explore-aruba/cultural-spots',
                description: 'Explore 18+ cultural attractions including historic sites, museums, and architectural heritage',
                image: '/cultural spots page .png',
                count: '18+',
              },
              {
                name: 'Natural Wonders',
                emoji: '🌴',
                href: '/explore-aruba/natural-wonders',
                description: 'Experience 17+ natural wonders including caves, rock formations, and scenic viewpoints',
                image: '/natural wonders page.png',
                count: '17+',
              },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Link
                  href={category.href}
                  className="group block relative h-96 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Background Image */}
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/80 group-hover:via-black/50 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                    {/* Emoji Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {category.emoji}
                    </div>

                    {/* Count Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white mb-4 w-fit group-hover:bg-[var(--brand-aruba)] transition-colors duration-300">
                      <span className="text-sm font-bold">{category.count}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-3 font-display group-hover:text-[var(--brand-sun)] transition-colors duration-300">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="text-white/90 mb-6 leading-relaxed text-base">
                      {category.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                      <span className="text-sm uppercase tracking-wide">Explore</span>
                      <Icon name="arrow-right" className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Button
              href="/explore-aruba"
              variant="outline"
              size="lg"
              icon="arrow-right"
              iconPosition="right"
              className="border-2 border-[var(--brand-aruba)] text-[var(--brand-aruba)] hover:bg-[var(--brand-aruba)] hover:text-white"
            >
              View All Categories
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Become a Partner Section */}
      <section className="relative py-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/baby beach 1.png"
            alt="Beautiful Baby Beach, Aruba"
            fill
            className="object-cover object-center"
            quality={90}
            sizes="100vw"
            unoptimized
          />
        </div>
        {/* Dark Overlays */}
        <div className="absolute inset-0 z-[1] bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Pattern Overlay */}
        <div className="absolute inset-0 z-[1] opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container className="relative z-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto"
          >
            <div className="flex-1 text-center md:text-left text-white max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-sun)] animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--brand-sun)]">For Local Businesses</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 font-display tracking-tight text-white leading-tight">
                Grow with Aruba<br />Travel Buddy
              </h2>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed font-medium">
                Connect directly with thousands of travelers looking for authentic Aruban experiences, food, and stays.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
                {['Tour Operators', 'Restaurants', 'Accommodations', 'Rentals'].map((type) => (
                  <span key={type} className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-semibold border border-white/20 text-white shadow-sm">
                    {type}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-center md:justify-start">
                <Button
                  href="/become-a-partner"
                  size="lg"
                  className="bg-[var(--brand-sun)] text-gray-900 hover:bg-yellow-400 font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                  icon="arrow-right"
                  iconPosition="right"
                >
                  Partner With Us
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-aruba)] to-[var(--brand-sun)] rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="w-64 h-64 rounded-full bg-white/5 backdrop-blur-xl border border-white/30 flex flex-col items-center justify-center relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden group">
                <Image 
                  src="/activities page.png" 
                  alt="Travelers in Aruba" 
                  fill 
                  className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-500" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 z-10" />
                <div className="relative z-20 flex flex-col items-center text-center p-6">
                  <Icon name="globe-americas" className="w-12 h-12 text-[var(--brand-sun)] mb-3 drop-shadow-lg" />
                  <span className="text-white font-black font-display text-2xl tracking-tight drop-shadow-lg leading-tight">Reach More</span>
                  <span className="text-white/90 text-lg font-semibold drop-shadow-lg tracking-wide uppercase">Travelers</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

            {/* Restaurants Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-[var(--brand-aruba)] font-bold uppercase tracking-widest text-sm mb-2">Taste the Island</p>
            <h2 className="text-5xl font-black text-gray-900 mb-6 font-display tracking-tight">Top Dining</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allRestaurants.slice(0, 6).map((restaurant, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group card overflow-hidden flex flex-col h-full bg-white hover:shadow-2xl transition-all duration-300"
              >
                <Link href={`/restaurants`} className="block h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <SafeImage src={restaurant.images} alt={restaurant.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" fallbackIcon="sparkles" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Icon name="star" className="w-4 h-4 text-[var(--brand-amber)]" />
                      <span className="text-sm font-bold text-gray-900">{parseFloat(restaurant.rating || "4.5").toFixed(1)}</span>
                    </div>
                    {restaurant.cuisine_type && (
                      <div className="absolute top-4 left-4 bg-[var(--brand-aruba)]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-white text-xs font-bold uppercase tracking-wider">
                        {restaurant.cuisine_type}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display group-hover:text-[var(--brand-aruba)] transition-colors line-clamp-1">{restaurant.name}</h3>
                    <p className="text-gray-600 leading-relaxed flex-1 line-clamp-3">{restaurant.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <Button
              href="/restaurants"
              variant="outline"
              size="lg"
              icon="arrow-right"
              iconPosition="right"
              className="border-2 border-[var(--brand-aruba)] text-[var(--brand-aruba)] hover:bg-[var(--brand-aruba)] hover:text-white px-8"
            >
              View All Restaurants
            </Button>
          </motion.div>
        </Container>
      </section>

{/* Travel Tips Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="flex flex-col items-center text-center mb-12">
            <p className="text-[var(--brand-aruba)] font-bold uppercase tracking-widest text-sm mb-2">Essential Insights</p>
            <h2 className="text-5xl font-black text-gray-900 mb-6 font-display tracking-tight">Travel Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "10 Essential Cultural Tips for Visiting Aruba",
                excerpt: "Discover the local customs, traditions, and cultural etiquette that will help you connect authentically with Aruban culture during your visit.",
                image: "/fort-zoutman-aruba.png",
                category: "Travel Buddy Guide",
                readTime: "5 min read",
              },
              {
                title: "Complete Guide to Aruba's ED Card Requirements",
                excerpt: "Everything you need to know about the ED Card, entry requirements, and how to complete the process smoothly before your trip.",
                image: "/hafenbild-oranjestad--aruba-%20copy.jpg",
                category: "Ed Card",
                readTime: "3 min read",
              },
              {
                title: "Best Hidden Gems: Local Experiences You Can't Miss",
                excerpt: "Explore off-the-beaten-path destinations and authentic local experiences that will make your Aruba trip truly unforgettable.",
                image: "/alto-vista-chapel-aruba.png",
                category: "Blogs",
                readTime: "7 min read",
              },
            ].map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={
                  blog.title === "10 Essential Cultural Tips for Visiting Aruba"
                    ? "/blogs/10-essential-cultural-tips"
                    : blog.title === "Complete Guide to Aruba's ED Card Requirements"
                      ? "/blogs/complete-guide-aruba-ed-card"
                      : blog.title === "Best Hidden Gems: Local Experiences You Can't Miss"
                        ? "/blogs/best-hidden-gems-local-experiences"
                        : "/blogs"
                } className="block h-full">
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[var(--brand-aruba)]">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Icon name="calendar-days" className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <Button
              href="/blogs"
              variant="outline"
              size="lg"
              icon="arrow-right"
              iconPosition="right"
              className="border-2 border-[var(--brand-aruba)] text-[var(--brand-aruba)] hover:bg-[var(--brand-aruba)] hover:text-white px-8"
            >
              View All Travel Tips
            </Button>
          </motion.div>
        </Container>
      </section>



      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/natural wonders page.png"
            alt="Aruba natural wonders"
            fill
            className="object-cover object-center"
            quality={90}
            unoptimized
          />
        </div>
        {/* Dark Overlays */}
        <div className="absolute inset-0 z-[1] bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-sun)] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest text-[var(--brand-sun)]">Get The App</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 font-display tracking-tight leading-tight">
              Ready for Your Authentic<br />Aruba Experience?
            </h2>
            
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
              Join thousands of travelers using smart itineraries and local insights to discover the real Aruba.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://onelink.to/75vkw3"
                className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white border border-gray-800 px-5 py-2.5 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <svg viewBox="0 0 384 512" fill="currentColor" className="w-7 h-7 text-white">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold leading-tight">Download on the</div>
                  <div className="text-base font-bold leading-tight mt-0.5">App Store</div>
                </div>
              </Link>

              <Link
                href="https://onelink.to/75vkw3"
                className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white border border-gray-800 px-5 py-2.5 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <svg viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7 text-white">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold leading-tight">GET IT ON</div>
                  <div className="text-base font-bold leading-tight mt-0.5">Google Play</div>
                </div>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-[var(--brand-aruba)] font-bold uppercase tracking-widest text-sm mb-2">Got Questions?</p>
            <h2 className="text-5xl font-black text-gray-900 font-display tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
