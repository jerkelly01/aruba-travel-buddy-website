"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function CulturalTipsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Cultural Tips & Language"
            subtitle="Essential cultural insights and Papiamento language tips to help you navigate Aruba like a local"
            center
          />
        </Container>
      </section>

      {/* Cultural Tips Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="space-y-12">
            {/* Greeting Customs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Icon name="user-group" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Greeting Customs</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Arubans are warm and friendly people who value personal connections. Proper greetings are important and show respect for local customs.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Always greet people with "Bon bini" or appropriate time-based greeting</li>
                    <li>• Make eye contact when greeting</li>
                    <li>• Use titles like "Señor" or "Señora" for respect</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't skip greetings - it's considered rude</li>
                    <li>• Don't be too formal - Arubans are generally casual</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Dining Etiquette */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Icon name="bolt" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Dining Etiquette</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Food culture is central to Aruban life. Meals are social occasions meant for bonding and sharing experiences.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Try local dishes like keshi yena, pan bati, and funchi</li>
                    <li>• Compliment the food - "E ta sabroso!" (It's delicious!)</li>
                    <li>• Accept food offers - refusing can be considered rude</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't waste food - finish what's on your plate</li>
                    <li>• Don't criticize local cuisine</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Language Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Icon name="language" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Language Insights</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Aruba is a multilingual island where Papiamento, Dutch, Spanish, and English are commonly spoken. Papiamento is the local language and a source of cultural pride.
              </p>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-purple-800">Papiamento</h4>
                  <p className="text-sm text-gray-600">Official Language</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-purple-800">Dutch</h4>
                  <p className="text-sm text-gray-600">Official Language</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-purple-800">English</h4>
                  <p className="text-sm text-gray-600">Widely Spoken</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-purple-800">Spanish</h4>
                  <p className="text-sm text-gray-600">Widely Spoken</p>
                </div>
              </div>
            </motion.div>

            {/* Essential Papiamento Phrases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-500 rounded-xl">
                  <Icon name="chat" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Essential Papiamento Phrases</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { papiamento: "Bon bini", english: "Welcome", context: "Traditional Aruban welcome" },
                  { papiamento: "Bon dia", english: "Good morning", context: "Morning greeting until noon" },
                  { papiamento: "Bon tardi", english: "Good afternoon", context: "Afternoon greeting" },
                  { papiamento: "Bon nochi", english: "Good evening", context: "Evening greeting" },
                  { papiamento: "Kon ta bai?", english: "How are you?", context: "Common greeting showing care" },
                  { papiamento: "Danki", english: "Thank you", context: "Showing gratitude is important" },
                  { papiamento: "Di nada", english: "You're welcome", context: "Common response to thanks" },
                  { papiamento: "Hopi bon", english: "Very good/Excellent", context: "Expressing approval" },
                  { papiamento: "Bon apetit", english: "Enjoy your meal", context: "Before eating" },
                  { papiamento: "Salud!", english: "Cheers!", context: "Toast expression" },
                  { papiamento: "Ayo!", english: "See you later", context: "Casual goodbye" },
                  { papiamento: "Djeuki", english: "Rest/Relaxation", context: "Cultural concept of relaxation" }
                ].map((phrase, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-purple-600 mb-1">{phrase.papiamento}</h4>
                    <p className="text-sm font-medium text-gray-800 mb-1">{phrase.english}</p>
                    <p className="text-xs text-gray-600">{phrase.context}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Business Customs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-500 rounded-xl">
                  <Icon name="building-office" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Business Customs</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Aruban business culture blends Dutch efficiency with Caribbean warmth. Understanding local customs can help in professional settings.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Schedule meetings in advance and be punctual</li>
                    <li>• Use formal greetings initially, transitioning to first names when invited</li>
                    <li>• Expect business discussions to be friendly but professional</li>
                    <li>• Understand that relationships matter in business dealings</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't rush into business without small talk</li>
                    <li>• Don't be offended if meetings start slightly later than scheduled</li>
                    <li>• Don't expect strictly linear decision-making processes</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Social Interactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pink-500 rounded-xl">
                  <Icon name="heart" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Social Interactions</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Arubans value community and social connections. Social gatherings are important for building relationships and experiencing local culture.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Accept invitations to social gatherings when possible</li>
                    <li>• Bring a small gift when invited to someone's home</li>
                    <li>• Engage in friendly conversation about family, weather, and local events</li>
                    <li>• Respect personal space while understanding that Arubans may be more physically expressive</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't decline social invitations without a good reason</li>
                    <li>• Don't discuss sensitive topics like politics or religion initially</li>
                    <li>• Don't be surprised if conversations are interrupted and resumed later</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Communication Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500 rounded-xl">
                  <Icon name="chat" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Communication Style</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Arubans communicate with indirectness and politeness. Understanding these nuances helps in daily interactions and shows cultural awareness.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Listen for what is not being said directly</li>
                    <li>• Use indirect language when making requests or complaints</li>
                    <li>• Show appreciation for efforts, even small ones</li>
                    <li>• Be patient with conversational pauses and story-telling</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't be overly direct or blunt in your communication</li>
                    <li>• Don't rush conversations or appear impatient</li>
                    <li>• Don't take silence as agreement or disagreement</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Shopping Customs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <Icon name="currency-dollar" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Shopping Customs</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Shopping in Aruba involves bargaining in some places and understanding local business hours and customs.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Bargain at open markets and street vendors</li>
                    <li>• Expect shops to close for "djeuki" (afternoon rest) between 12 PM and 3 PM</li>
                    <li>• Be prepared for limited sizes in clothing stores</li>
                    <li>• Tip for services, especially in markets and from street vendors</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't expect to bargain at established stores or malls</li>
                    <li>• Don't be surprised if some shops close unexpectedly for local events</li>
                    <li>• Don't assume all products are available year-round</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Tipping Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <Icon name="currency-dollar" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Tipping Guidelines</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Tipping is customary in Aruba and shows appreciation for good service.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Tip 10-15% at restaurants for good service</li>
                    <li>• Tip taxi drivers 10% for good service</li>
                    <li>• Tip hotel staff for exceptional service</li>
                    <li>• Tip tour guides as a gesture of appreciation</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't over-tip - 15% is considered generous</li>
                    <li>• Don't tip for poor service</li>
                    <li>• Don't tip for self-service</li>
                    <li>• Don't tip at all-inclusive establishments where service is included</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Environmental Consciousness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Icon name="cloud" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Environmental Consciousness</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Arubans have a deep connection to their natural environment and take pride in conservation efforts.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Participate in beach cleanups if offered</li>
                    <li>• Respect wildlife and coral reefs when snorkeling or diving</li>
                    <li>• Conserve water, as it's a precious resource on the island</li>
                    <li>• Follow marked trails when hiking in natural areas</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't litter, especially on beaches and in natural areas</li>
                    <li>• Don't touch or step on coral reefs</li>
                    <li>• Don't remove shells, sand, or other natural items from beaches</li>
                    <li>• Don't feed wildlife, even if they approach</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Historical Heritage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-500 rounded-xl">
                  <Icon name="building-office" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Historical Heritage</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Aruba's history is rich with influences from indigenous peoples, Spanish colonization, Dutch rule, and African heritage.
              </p>

              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Indigenous Heritage</h4>
                  <p className="text-sm text-gray-600">
                    The Arawak Indians were the original inhabitants of Aruba. Their legacy lives on in archaeological sites and cultural traditions.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Colonial Past</h4>
                  <p className="text-sm text-gray-600">
                    Under Dutch rule since 1636, Aruba developed a unique Creole culture. The island's architecture reflects this colonial heritage.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Gold Rush Era</h4>
                  <p className="text-sm text-gray-600">
                    The gold rush of the late 19th century brought significant change to Aruba and influenced its economic development.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Religious Customs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-500 rounded-xl">
                  <Icon name="star" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-display">Religious Customs</h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                With a mix of Catholic, Protestant, and other religious traditions, Aruba celebrates various religious festivals throughout the year.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Do:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Respect religious processions and ceremonies</li>
                    <li>• Participate respectfully in local religious festivals</li>
                    <li>• Dress modestly when visiting religious sites</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <Icon name="check-circle" className="w-5 h-5" />
                    Don't:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Don't disrupt religious services or ceremonies</li>
                    <li>• Don't take photos during religious ceremonies without permission</li>
                    <li>• Don't make loud noises near religious sites</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white"
            >
              <h3 className="text-2xl font-bold mb-4 font-display">Experience Aruba Like a Local</h3>
              <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
                Understanding Aruban culture and learning basic Papiamento will enrich your travel experience and help you connect with locals on a deeper level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold shadow-lg"
                >
                  <Icon name="device-phone-mobile" className="w-5 h-5" />
                  Download Free App
                </Link>
                <Link
                  href="/explore-aruba"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold border-2 border-white"
                >
                  <Icon name="globe-alt" className="w-5 h-5" />
                  Explore Aruba
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

