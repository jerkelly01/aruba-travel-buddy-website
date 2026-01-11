"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Travel Blogs"
            subtitle="Read our latest travel stories, tips, and insights about Aruba"
            center
          />
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* 10 Essential Cultural Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[var(--brand-aruba)]/10 to-[var(--brand-aruba-light)]/10 rounded-2xl p-8 shadow-lg border-2 border-[var(--brand-aruba)]/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[var(--brand-aruba)] rounded-xl">
                  <Icon name="sparkles" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 font-display">10 Essential Cultural Tips for Visiting Aruba</h3>
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Aruba is easy to love: warm people, bright sun, and a mix of cultures that feels welcoming from the moment you arrive. But the best trips aren't just about beaches—they're about connecting. These cultural tips will help you feel comfortable, show respect, and enjoy Aruba the way locals do.
              </p>

              <div className="space-y-6">
                {/* Tip 1 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">1) Learn a few local words (it goes a long way)</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Aruba is multilingual. You'll hear Papiamento daily, plus Dutch, English, and Spanish. Even a small effort makes people smile.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">Try these:</p>
                    <ul className="space-y-1 text-blue-800">
                      <li>• <strong>Bon dia</strong> (Good morning)</li>
                      <li>• <strong>Bon tardi</strong> (Good afternoon)</li>
                      <li>• <strong>Bon nochi</strong> (Good evening / night)</li>
                      <li>• <strong>Danki</strong> (Thank you)</li>
                      <li>• <strong>Por fabor</strong> (Please)</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm italic">Locals will often switch to English quickly—but starting in Papiamento shows respect.</p>
                </div>

                {/* Tip 2 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">2) Don't rush the vibe—Aruba moves at a relaxed pace</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Customer service is friendly, but the pace can feel calmer than what you're used to. This isn't laziness—it's a cultural rhythm. Be patient, stay polite, and you'll get the best version of Aruba.
                  </p>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="font-semibold text-amber-900">Tip:</p>
                    <p className="text-amber-800">If you're in a hurry, communicate it kindly: "Sorry, I'm on a schedule—would it be possible to…?"</p>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">3) Greeting matters: say hello before you ask</h4>
                  <p className="text-gray-700 leading-relaxed">
                    In Aruba, walking up and immediately asking for something can feel abrupt. A simple "Bon dia" or "Hello, how are you?" first is the norm—especially in smaller shops, local restaurants, and neighborhoods.
                  </p>
                </div>

                {/* Tip 4 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">4) Respect the island's nature (it's part of the culture)</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Arubans take pride in the island's landscapes—especially the desert terrain, beaches, and wildlife. Being mindful isn't just "eco-friendly," it's culturally appreciated.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-900 mb-2">Do this:</p>
                    <ul className="space-y-1 text-green-800">
                      <li>• Don't take rocks, coral, or shells</li>
                      <li>• Don't feed wild animals</li>
                      <li>• Stay on paths in natural areas</li>
                      <li>• Avoid stepping on coral when swimming/snorkeling</li>
                    </ul>
                  </div>
                </div>

                {/* Tip 5 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">5) Dress smart: beachwear stays at the beach</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Aruba is casual, but there's still a line. Wearing a swimsuit in a restaurant, grocery store, or downtown is usually seen as disrespectful.
                  </p>
                  <p className="text-gray-700 font-semibold">Rule of thumb: Bring a cover-up or shirt and shorts when you leave the beach.</p>
                </div>

                {/* Tip 6 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">6) Be mindful on Sundays and during family time</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Sunday is a big family day for many locals. Some businesses operate shorter hours, and certain areas feel quieter. If you're driving or planning tours, check hours and plan accordingly.
                  </p>
                  <p className="text-gray-700">This is also a great day to slow down—take a long breakfast, visit a cultural spot, or enjoy a sunset dinner.</p>
                </div>

                {/* Tip 7 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">7) Tip like you mean it (but know what's already included)</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Tipping is common in Aruba, especially in tourism areas, but sometimes a service charge is already included.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-2">Quick guide:</p>
                    <ul className="space-y-1 text-purple-800">
                      <li>• <strong>Restaurants:</strong> check your bill for service charge first</li>
                      <li>• <strong>If included:</strong> locals often still leave a little extra for great service</li>
                      <li>• <strong>Tour guides/drivers:</strong> tipping is appreciated if they went above and beyond</li>
                    </ul>
                    <p className="text-purple-800 mt-3 text-sm italic">If you're unsure, ask politely: "Is service included?"</p>
                  </div>
                </div>

                {/* Tip 8 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">8) Driving culture: be calm, courteous, and alert</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Aruba driving is generally relaxed, but there are plenty of roundabouts and some areas with narrow roads.
                  </p>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="font-semibold text-indigo-900 mb-2">Local-style tips:</p>
                    <ul className="space-y-1 text-indigo-800">
                      <li>• Use roundabouts correctly (yield and signal)</li>
                      <li>• Let others merge when possible</li>
                      <li>• Don't honk aggressively—it's not the vibe</li>
                      <li>• Watch for pedestrians and cyclists</li>
                    </ul>
                  </div>
                </div>

                {/* Tip 9 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">9) Support local businesses—Aruba appreciates it</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Beyond the resorts, Aruba has small family-run restaurants, snack trucks, local artisans, and independent tour operators. Spending even a little outside big chains helps the community and often gives you the most memorable experiences.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold text-orange-900 mb-2">Try:</p>
                    <ul className="space-y-1 text-orange-800">
                      <li>• A local snack ("pastechi" in the morning is a classic)</li>
                      <li>• Handmade souvenirs and art markets</li>
                      <li>• Community tours that highlight history and nature</li>
                    </ul>
                  </div>
                </div>

                {/* Tip 10 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">10) Ask questions with curiosity, not judgment</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Aruba has a unique blend of cultures shaped by the Caribbean, Europe, Latin America, and centuries of movement and trade. People are proud of their island, but like anywhere, they don't love being stereotyped.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="font-semibold text-red-900 mb-2">Better than:</p>
                      <p className="text-red-800 text-sm mb-2">"Is it safe here?"</p>
                      <p className="font-semibold text-green-900">Try:</p>
                      <p className="text-green-800 text-sm">"Any areas you recommend I visit or avoid at night?"</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="font-semibold text-red-900 mb-2">Better than:</p>
                      <p className="text-red-800 text-sm mb-2">"Do locals live like this?"</p>
                      <p className="font-semibold text-green-900">Try:</p>
                      <p className="text-green-800 text-sm">"What do you recommend for a more local experience?"</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm italic">Curiosity opens doors.</p>
                </div>

                {/* Bonus Tip */}
                <div className="bg-gradient-to-r from-[var(--brand-amber)]/20 to-[var(--brand-sun)]/20 rounded-xl p-6 border-2 border-[var(--brand-amber)]/30">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display flex items-center gap-2">
                    <Icon name="trophy" className="w-6 h-6 text-[var(--brand-amber)]" />
                    Bonus tip: Small kindness wins big
                  </h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Aruba is known as "One Happy Island" for a reason—people are genuinely friendly. Match that energy:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Smile</li>
                    <li>• Say hello</li>
                    <li>• Be patient</li>
                    <li>• Leave places cleaner than you found them</li>
                  </ul>
                  <p className="text-gray-700 mt-4 font-semibold">You'll get the same warmth back.</p>
                </div>

                {/* Final Thought */}
                <div className="bg-gradient-to-r from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] rounded-xl p-8 text-white text-center">
                  <h4 className="text-2xl font-bold mb-4 font-display">Final thought</h4>
                  <p className="text-lg leading-relaxed text-white/95">
                    Aruba is more than a destination—it's a community. When you show respect for the language, pace, and everyday customs, you're not just visiting—you're connecting. And that's what turns a good trip into one you'll always remember.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

