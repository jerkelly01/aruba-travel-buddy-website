"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function ArubaGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gray-900 overflow-hidden shadow-xl rounded-b-[3rem]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/beaches page.png"
            alt="Aruba Travel Guide"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <Container className="relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[var(--brand-sun)] text-gray-900 text-sm font-bold tracking-widest uppercase mb-6">
              The Ultimate Visual Guide
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-display tracking-tight">
              Travel Buddy Guide
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about Aruba, packed into beautifully simple visuals. Scroll down to become an island expert before you even pack your bags.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Quick Facts Grid */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { emoji: '☀️', label: 'Weather', value: '82°F (28°C)' },
              { emoji: '💵', label: 'Currency', value: 'AWG / USD' },
              { emoji: '🗣️', label: 'Language', value: 'Papiamento' },
              { emoji: '🔌', label: 'Plugs', value: '110V (US)' },
              { emoji: '⏰', label: 'Timezone', value: 'AST (No DST)' },
              { emoji: '🚗', label: 'Driving', value: 'Right Side' },
              { emoji: '💧', label: 'Water', value: '100% Safe' },
              { emoji: '🛡️', label: 'Safety', value: 'Very High' },
            ].map((fact, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-default"
              >
                <div className="text-3xl mb-2">
                  {fact.emoji}
                </div>
                <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{fact.label}</h4>
                <p className="text-gray-900 font-black text-sm">{fact.value}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fun Facts / Did You Know? */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-0">
              <Image src="/cultural spots page .png" alt="Aruba Culture" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/65" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-8 font-display flex items-center gap-4">
                ✨ Did You Know?
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-bold text-[var(--brand-sun)] mb-2">No Rivers</h4>
                  <p className="text-sm text-white/90 leading-relaxed">Aruba has absolutely no rivers. The landscape is entirely arid, which is why the water is so crystal clear!</p>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--brand-sun)] mb-2">Aloe Capital</h4>
                  <p className="text-sm text-white/90 leading-relaxed">In the 1920s, two-thirds of the island was covered in Aloe Vera. It was the world's largest exporter.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--brand-sun)] mb-2">Divi Trees</h4>
                  <p className="text-sm text-white/90 leading-relaxed">The iconic Watapana (Divi-divi) trees all bend to the southwest, shaped entirely by the constant trade winds.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--brand-sun)] mb-2">Melting Pot</h4>
                  <p className="text-sm text-white/90 leading-relaxed">Aruba is home to over 90 different nationalities living together in harmony on just 69 square miles.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* A Brief History Timeline */}
      <section className="py-20 bg-white">
        <Container>
          <SectionHeader
            eyebrow="HERITAGE"
            title="A Brief History"
            subtitle="The rich history of Aruba is shaped by indigenous roots and European influence."
            center
          />
          <div className="max-w-4xl mx-auto mt-12 relative border-l-4 border-[var(--brand-aruba)] pl-8 space-y-12 py-8">
            <div className="relative">
              <div className="absolute -left-11 top-0 w-6 h-6 bg-[var(--brand-sun)] rounded-full border-4 border-white shadow"></div>
              <h3 className="text-xl font-black text-gray-900">1000 AD - Caquetío Indians</h3>
              <p className="text-gray-600 mt-2 text-sm">The Arawak tribe sailed from Venezuela to settle the island. Their ancient cave drawings can still be seen in Arikok National Park today.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-11 top-0 w-6 h-6 bg-[var(--brand-sun)] rounded-full border-4 border-white shadow"></div>
              <h3 className="text-xl font-black text-gray-900">1499 - Spanish Discovery</h3>
              <p className="text-gray-600 mt-2 text-sm">Spanish explorer Alonso de Ojeda claims Aruba for Spain. They dubbed it an "Isla Inutil" (Useless Island) due to lack of rainfall and gold.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-11 top-0 w-6 h-6 bg-[var(--brand-sun)] rounded-full border-4 border-white shadow"></div>
              <h3 className="text-xl font-black text-gray-900">1636 - Dutch Acquisition</h3>
              <p className="text-gray-600 mt-2 text-sm">The Dutch take control near the end of the Eighty Years' War. It becomes a major hub for protecting Dutch salt supplies from South America.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-11 top-0 w-6 h-6 bg-[var(--brand-sun)] rounded-full border-4 border-white shadow"></div>
              <h3 className="text-xl font-black text-gray-900">1986 - Status Aparte</h3>
              <p className="text-gray-600 mt-2 text-sm">Aruba secedes from the Netherlands Antilles, becoming an autonomous country within the Kingdom of the Netherlands.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* When to Visit (Seasonality) */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <Container>
          <SectionHeader
            eyebrow="TIMING IS EVERYTHING"
            title="When To Visit Aruba"
            subtitle="Aruba is outside the hurricane belt, meaning perfect weather year-round. But here's how the seasons compare."
            center
          />
          <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
            <div className="bg-white shadow-xl shadow-blue-100 p-8 rounded-[2rem] border-t-8 border-t-blue-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Icon name="sun" className="w-32 h-32 text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 font-display">High Season</h3>
              <p className="text-blue-600 font-bold mb-6">Mid-December to Mid-April</p>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Icon name="arrow-trending-up" className="w-4 h-4" /></div>
                  Busiest time of year. Escape the winter cold!
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Icon name="banknotes" className="w-4 h-4" /></div>
                  Highest hotel and flight prices. Book early.
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Icon name="ticket" className="w-4 h-4" /></div>
                  Carnival Season! (January - February)
                </li>
              </ul>
            </div>

            <div className="bg-white shadow-xl shadow-orange-100 p-8 rounded-[2rem] border-t-8 border-t-[var(--brand-amber)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Icon name="tag" className="w-32 h-32 text-orange-500" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 font-display">Low Season</h3>
              <p className="text-orange-600 font-bold mb-6">Mid-April to Mid-December</p>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Icon name="arrow-trending-down" className="w-4 h-4" /></div>
                  Less crowded beaches and restaurants.
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Icon name="banknotes" className="w-4 h-4" /></div>
                  Significant discounts on hotels and tours.
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Icon name="wind" className="w-4 h-4" /></div>
                  Stronger trade winds in the summer months (Perfect for kite surfing).
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Where To Stay (The Zones) */}
      <section className="py-20 bg-white border-t border-gray-200">
        <Container>
          <SectionHeader
            eyebrow="ACCOMMODATION"
            title="Where To Stay"
            subtitle="Aruba's hotels are split into two distinct zones, plus a growing Airbnb market."
            center
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "High-Rise Area",
                location: "Palm Beach",
                desc: "The action center. Massive resorts (Marriott, Hyatt, Hilton), packed beaches, casinos, and high-energy nightlife. Everything is walkable.",
                emoji: "🏨",
                color: "text-purple-600",
                bg: "bg-purple-100"
              },
              {
                title: "Low-Rise Area",
                location: "Eagle Beach",
                desc: "Quieter, more relaxed. Smaller boutique hotels (Bucuti & Tara, Manchebo) right on the world's best beach. Perfect for couples.",
                emoji: "🏖️",
                color: "text-blue-600",
                bg: "bg-blue-100"
              },
              {
                title: "Villas & Airbnbs",
                location: "Noord / Malmok",
                desc: "Inland and northern coast. Private pools, affordable luxury, and total independence. A rental car is required to stay here.",
                emoji: "🏡",
                color: "text-green-600",
                bg: "bg-green-100"
              }
            ].map((zone, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform cursor-default">
                <div className="text-5xl mb-6">
                  {zone.emoji}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{zone.title}</h3>
                <p className="text-[var(--brand-aruba)] font-bold text-sm mb-4 uppercase tracking-widest">{zone.location}</p>
                <p className="text-gray-600 leading-relaxed text-sm">{zone.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Top 5 Ultimate Experiences */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <Container>
          <SectionHeader
            eyebrow="MUST DO"
            title="The Aruba Bucket List"
            subtitle="If you only do 5 things on the island, make sure it's these."
            center
          />
          
          <div className="grid md:grid-cols-5 gap-4 mt-12 h-[500px]">
            {[
              { title: "Arikok Park", desc: "Rent a 4x4 and explore the rugged desert outback covering 20% of the island.", img: "/natural wonders page.png" },
              { title: "Natural Pool", desc: "Swim in 'Conchi', a hidden pool protected from the rough sea by massive rocks.", img: "/activities page.png" },
              { title: "Eagle Beach", desc: "Consistently voted one of the top beaches in the world. Famous for Divi trees.", img: "/beaches page.png" },
              { title: "Flamingo Beach", desc: "Visit Renaissance Island to feed and take photos with the iconic pink flamingos.", img: "/cultural spots page .png" },
              { title: "Zeerovers", desc: "Eat fresh, caught-that-morning fish and shrimp right on the dock in Savaneta.", img: "/restaurants page.png" },
            ].map((exp, idx) => (
              <div key={idx} className="group relative rounded-3xl overflow-hidden cursor-pointer hover:flex-[2] transition-all duration-500 ease-in-out flex-1 shadow-lg">
                <Image src={exp.img} alt={exp.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="w-8 h-8 bg-[var(--brand-sun)] text-gray-900 font-black rounded-full flex items-center justify-center mb-3">
                    #{idx + 1}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 font-display">{exp.title}</h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:block">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Water Sports & Adventure */}
      <section className="relative py-24 text-white overflow-hidden shadow-inner">
        <div className="absolute inset-0 z-0">
          <Image src="/activities page.png" alt="Watersports" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>
        <Container className="relative z-10">
          <SectionHeader
            eyebrow="ADRENALINE"
            title="World-Class Watersports"
            subtitle="The constant trade winds and crystal waters make Aruba a playground for adventure."
            center
            titleClassName="text-white"
            subtitleClassName="text-gray-300"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { title: "Kitesurfing", location: "Fisherman's Huts", emoji: "🪁" },
              { title: "Windsurfing", location: "Hadicurari", emoji: "🏄‍♂️" },
              { title: "Scuba Diving", location: "SS Antilla Wreck", emoji: "🤿" },
              { title: "Snorkeling", location: "Boca Catalina", emoji: "🐠" },
            ].map((sport, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 text-center border border-white/20 hover:bg-white/20 transition-colors shadow-xl">
                <div className="text-5xl mb-4">
                  {sport.emoji}
                </div>
                <h3 className="text-xl font-black mb-1">{sport.title}</h3>
                <p className="text-xs font-bold text-[var(--brand-sun)] uppercase tracking-wider">📍 {sport.location}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Entertainment & Nightlife (LIGHTENED) */}
      <section className="py-20 bg-white">
        <Container>
          <SectionHeader
            eyebrow="AFTER DARK"
            title="Nightlife & Entertainment"
            subtitle="When the sun goes down, the island comes alive."
            center
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-md hover:-translate-y-2 transition-transform cursor-default">
              <div className="text-4xl mb-4">🎰</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Casinos</h3>
              <p className="text-gray-600 text-sm">Aruba is the birthplace of Caribbean Stud Poker! Casinos are attached to most large resorts in Palm Beach and are open until the early hours.</p>
            </div>
            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-md hover:-translate-y-2 transition-transform cursor-default">
              <div className="text-4xl mb-4">🚌</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Kukoo Kunuku</h3>
              <p className="text-gray-600 text-sm">The famous brightly colored, open-air party buses. Shake maracas, drink rum punches, and bar-hop across the island.</p>
            </div>
            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-md hover:-translate-y-2 transition-transform cursor-default">
              <div className="text-4xl mb-4">🍹</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Beach Bars</h3>
              <p className="text-gray-600 text-sm">Hit up Bugaloe, Moomba, or Pelican Pier for sunset happy hours, live bands, and toes-in-the-sand dancing.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* The Beach Finder */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <Container>
          <SectionHeader
            eyebrow="BEACH FINDER"
            title="Find Your Perfect Sand"
            subtitle="Aruba has over 40 beaches. Here are the absolute best based on your vibe."
            center
          />
          <div className="grid md:grid-cols-4 gap-4 mt-12">
            {[
              { name: "Eagle Beach", tag: "Couples & Relaxation", emoji: "❤️", color: "text-pink-500", bg: "bg-pink-50" },
              { name: "Baby Beach", tag: "Families & Kids", emoji: "👨‍👩‍👧", color: "text-blue-500", bg: "bg-blue-50" },
              { name: "Boca Catalina", tag: "Snorkeling", emoji: "🤿", color: "text-teal-500", bg: "bg-teal-50" },
              { name: "Hadicurari", tag: "Windsurfing", emoji: "🏄", color: "text-orange-500", bg: "bg-orange-50" },
              { name: "Palm Beach", tag: "Nightlife & Action", emoji: "🍸", color: "text-purple-500", bg: "bg-purple-50" },
              { name: "Arashi Beach", tag: "Locals Favorite", emoji: "🌴", color: "text-red-500", bg: "bg-red-50" },
              { name: "Mangel Halto", tag: "Hidden Gem", emoji: "🤫", color: "text-indigo-500", bg: "bg-indigo-50" },
              { name: "Surfside Beach", tag: "Near Airport", emoji: "✈️", color: "text-gray-500", bg: "bg-gray-100" }
            ].map((beach, idx) => (
              <div key={idx} className="bg-white shadow-md rounded-3xl p-6 border border-gray-100 hover:border-[var(--brand-aruba)] transition-colors text-center group cursor-pointer">
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">
                  {beach.emoji}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{beach.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${beach.bg} ${beach.color} uppercase tracking-wider mt-2`}>
                  {beach.tag}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Wildlife Guide */}
      <section className="py-20 bg-white border-t border-gray-200">
        <Container>
          <SectionHeader
            eyebrow="NATURE"
            title="Aruban Wildlife Guide"
            subtitle="Keep an eye out for these local residents roaming the island."
            center
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
            {[
              { name: "Shoco Owl", desc: "Burrowing owls native to Aruba.", emoji: "🦉" },
              { name: "Sea Turtles", desc: "Nesting on Eagle/Baby beach.", emoji: "🐢" },
              { name: "Wild Donkeys", desc: "Roaming free in Arikok Park.", emoji: "🫏" },
              { name: "Kododo Blauw", desc: "Bright blue whiptail lizards.", emoji: "🦎" },
            ].map((animal, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">
                  {animal.emoji}
                </div>
                <h4 className="font-black text-gray-900 mb-2">{animal.name}</h4>
                <p className="text-xs text-gray-600">{animal.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Family Travel & Shopping (2 columns) */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Family */}
            <div className="bg-pink-50 rounded-[3rem] p-10 border border-pink-100 shadow-md">
              <div className="text-5xl mb-6">👨‍👩‍👧‍👦</div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-pink-900 mb-2 font-display">Family Travel</h3>
                <p className="text-pink-800 font-medium mb-8">Aruba is incredibly safe and perfect for kids.</p>
                <ul className="space-y-6">
                  <li>
                    <h4 className="font-bold text-pink-900 text-lg">Butterfly Farm</h4>
                    <p className="text-sm text-pink-700">Walk through a tropical garden packed with thousands of free-flying exotic butterflies.</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-pink-900 text-lg">Ostrich Farm</h4>
                    <p className="text-sm text-pink-700">Hand-feed giant ostriches and emus on a rugged desert tour.</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-pink-900 text-lg">Baby Beach</h4>
                    <p className="text-sm text-pink-700">A man-made lagoon with zero waves and waist-deep water. Perfect for toddlers.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Shopping */}
            <div className="bg-indigo-50 rounded-[3rem] p-10 border border-indigo-100 shadow-md">
              <div className="text-5xl mb-6">🛍️</div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-indigo-900 mb-2 font-display">Shopping Guide</h3>
                <p className="text-indigo-800 font-medium mb-8">From luxury brands to local crafts.</p>
                <ul className="space-y-6">
                  <li>
                    <h4 className="font-bold text-indigo-900 text-lg">Renaissance Mall</h4>
                    <p className="text-sm text-indigo-700">High-end luxury shopping in Oranjestad (Louis Vuitton, Gucci, Prada).</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-indigo-900 text-lg">Super Food Plaza</h4>
                    <p className="text-sm text-indigo-700">The massive Dutch supermarket. Stock up on Gouda cheese and Stroopwafels!</p>
                  </li>
                  <li>
                    <h4 className="font-bold text-indigo-900 text-lg">Local Markets</h4>
                    <p className="text-sm text-indigo-700">Buy fresh Aloe products and local crafts near the cruise terminal.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Local Cuisine Visuals */}
      <section className="py-20 bg-orange-50 border-y border-orange-100">
        <Container>
          <SectionHeader
            eyebrow="EAT LIKE A LOCAL"
            title="Aruban Cuisine Guide"
            subtitle="With over 90 nationalities, Aruba's food is a melting pot. Don't leave without trying these staples."
            center
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { name: "Keshi Yena", desc: "A large ball of Edam or Gouda cheese stuffed with spiced meat (usually chicken) and baked to perfection.", emoji: "🧀" },
              { name: "Pastechi", desc: "The ultimate Aruban breakfast! A crescent-shaped, deep-fried pastry filled with cheese, meat, or fish.", emoji: "🥟" },
              { name: "Funchi", desc: "A thick cornmeal mush (similar to polenta) often served fried with cheese on top. A staple side dish.", emoji: "🌽" }
            ].map((food, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-100/50 relative">
                <div className="text-5xl mb-4 absolute top-6 right-6">
                  {food.emoji}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 font-display pr-12">{food.name}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{food.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive Language Flashcards (LIGHTENED) */}
      <section className="py-20 bg-white">
        <Container>
          <SectionHeader
            eyebrow="SPEAK LIKE A LOCAL"
            title="Papiamento Flashcards"
            subtitle="Hover over the cards to reveal the English translation. It's that easy!"
            center
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { papiamento: "Bon Bini", english: "Welcome", color: "bg-blue-500" },
              { papiamento: "Bon Dia", english: "Good Morning", color: "bg-orange-500" },
              { papiamento: "Danki", english: "Thank You", color: "bg-green-500" },
              { papiamento: "Dushi", english: "Sweet / Darling", color: "bg-pink-500" },
              { papiamento: "Por Fabor", english: "Please", color: "bg-purple-500" },
              { papiamento: "Hopi Bon", english: "Very Good", color: "bg-teal-500" },
              { papiamento: "Con Ta Bai?", english: "How are you?", color: "bg-indigo-500" },
              { papiamento: "Ayo", english: "Goodbye", color: "bg-red-500" }
            ].map((card, idx) => (
              <div key={idx} className="group relative h-32 md:h-40 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                {/* Front (Papiamento) */}
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-full">
                  <span className="text-xl md:text-2xl font-black text-gray-900">{card.papiamento}</span>
                </div>
                {/* Back (English) */}
                <div className={`absolute inset-0 flex items-center justify-center ${card.color} translate-y-full transition-transform duration-500 group-hover:translate-y-0`}>
                  <span className="text-xl md:text-2xl font-black text-white">{card.english}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The Ultimate Packing List */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <Container>
          <SectionHeader
            eyebrow="PREPARATION"
            title="What To Pack"
            subtitle="Aruba is extremely casual. Leave the formal wear at home and pack light!"
            center
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-[2rem] p-8 border border-green-100 shadow-md">
                <h3 className="text-2xl font-black text-green-900 mb-6 font-display flex items-center gap-3">
                  ✅ Must Haves
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 font-bold text-green-800">🧴 Reef-Safe Sunscreen (Law)</li>
                  <li className="flex items-center gap-3 font-bold text-green-800">🕶️ Sunglasses & Hat</li>
                  <li className="flex items-center gap-3 font-bold text-green-800">🥿 Water Shoes (For rocky beaches)</li>
                  <li className="flex items-center gap-3 font-bold text-green-800">🧥 Light Jacket (Evenings get breezy)</li>
                  <li className="flex items-center gap-3 font-bold text-green-800">📱 Passport & ED Card QR Code</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 shadow-md">
                <h3 className="text-2xl font-black text-red-900 mb-6 font-display flex items-center gap-3">
                  ❌ Leave At Home
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 font-bold text-red-800">🔌 Plug Adapters (If from US/Canada)</li>
                  <li className="flex items-center gap-3 font-bold text-red-800">💵 Traveler's Checks (Rarely accepted)</li>
                  <li className="flex items-center gap-3 font-bold text-red-800">🧴 Non-Reef Safe Sunscreen (Banned)</li>
                  <li className="flex items-center gap-3 font-bold text-red-800">👔 Formal Suits/Dresses (Too hot!)</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Travel Logistics - Asymmetrical Visual Grid */}
      <section className="py-20 bg-white border-t border-gray-200">
        <Container>
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Sticky Text) */}
            <div className="md:col-span-4 md:sticky top-32">
              <SectionHeader
                eyebrow="LOGISTICS"
                title="The Need to Knows"
                subtitle="The critical information you need to navigate your stay without a hitch."
                center={false}
              />
            </div>

            {/* Right Column (Offset Visual Cards) */}
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-6">
              
              <div className="space-y-6 sm:mt-12">
                <div className="bg-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:border-[var(--brand-aruba)] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">🛂</div>
                    <h3 className="text-xl font-bold text-gray-900">ED Card & Entry</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Mandatory for all visitors. Fill out the online Embarkation/Disembarkation card within 7 days of arrival. No visa required for US/CA/EU.
                  </p>
                  <div className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-2 rounded-lg inline-block">Pro tip: Save the QR code to your Apple Wallet</div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:border-pink-500 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">✈️</div>
                    <h3 className="text-xl font-bold text-gray-900">US Pre-Clearance</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Aruba has US Customs pre-clearance. You clear US immigration in Aruba *before* flying home. This means you land in the US as a domestic flight!
                  </p>
                  <div className="bg-pink-50 text-pink-800 text-xs font-bold px-3 py-2 rounded-lg inline-block">Arrive 3 hours early for US flights</div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:border-[var(--brand-amber)] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">💵</div>
                    <h3 className="text-xl font-bold text-gray-900">Money & Tipping</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">✅ USD is accepted everywhere</li>
                    <li className="flex items-center gap-2">✅ Credit cards work at 99% of places</li>
                    <li className="flex items-center gap-2">✅ 15-20% tipping is standard</li>
                    <li className="flex items-center gap-2">⚠️ Always check if service charge was added</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:border-purple-500 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">🚕</div>
                    <h3 className="text-xl font-bold text-gray-900">Getting Around</h3>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded">TAXIS</span>
                      <p className="text-xs text-gray-600">Government fixed rates. No meters. Highly reliable.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded">ARUBUS</span>
                      <p className="text-xs text-gray-600">Cheap and clean. Connects beaches to downtown.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded">RENTALS</span>
                      <p className="text-xs text-gray-600">Drive on the right. Rent a Jeep for the rugged North Coast!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:border-red-500 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">🏥</div>
                    <h3 className="text-xl font-bold text-gray-900">Health & Safety</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Aruba is one of the safest islands in the Caribbean. However, the sun is brutal due to being so close to the equator.
                  </p>
                  <div className="bg-red-50 text-red-800 text-xs font-bold px-3 py-2 rounded-lg inline-block">Reef-safe sunscreen is legally required</div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:border-teal-500 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">📱</div>
                    <h3 className="text-xl font-bold text-gray-900">Connectivity</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Wi-Fi is widely available at resorts and restaurants. For cellular data, Setar and Digicel offer cheap tourist SIM cards at the airport.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
