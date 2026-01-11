"use client";

import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";

export default function EssentialCulturalTipsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="10 Essential Cultural Tips for Visiting Aruba"
            subtitle="Learn how to connect authentically with Aruban culture and make the most of your visit"
            center
          />
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Aruba is easy to love: warm people, bright sun, and a mix of cultures that feels welcoming from the moment you arrive. But the best trips aren't just about beaches—they're about connecting. These cultural tips will help you feel comfortable, show respect, and enjoy Aruba the way locals do.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1) Learn a few local words (it goes a long way)</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Aruba is multilingual. You'll hear Papiamento daily, plus Dutch, English, and Spanish. Even a small effort makes people smile.
                </p>
                <p className="text-gray-700 mb-2 font-semibold">Try these:</p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• <strong>Bon dia</strong> (Good morning)</li>
                  <li>• <strong>Bon tardi</strong> (Good afternoon)</li>
                  <li>• <strong>Bon nochi</strong> (Good evening / night)</li>
                  <li>• <strong>Danki</strong> (Thank you)</li>
                  <li>• <strong>Por fabor</strong> (Please)</li>
                </ul>
                <p className="text-gray-600 italic">Locals will often switch to English quickly—but starting in Papiamento shows respect.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2) Don't rush the vibe—Aruba moves at a relaxed pace</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Customer service is friendly, but the pace can feel calmer than what you're used to. This isn't laziness—it's a cultural rhythm. Be patient, stay polite, and you'll get the best version of Aruba.
                </p>
                <p className="text-gray-700 font-semibold">Tip: If you're in a hurry, communicate it kindly: "Sorry, I'm on a schedule—would it be possible to…?"</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3) Greeting matters: say hello before you ask</h2>
                <p className="text-gray-700 leading-relaxed">
                  In Aruba, walking up and immediately asking for something can feel abrupt. A simple "Bon dia" or "Hello, how are you?" first is the norm—especially in smaller shops, local restaurants, and neighborhoods.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4) Respect the island's nature (it's part of the culture)</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Arubans take pride in the island's landscapes—especially the desert terrain, beaches, and wildlife. Being mindful isn't just "eco-friendly," it's culturally appreciated.
                </p>
                <p className="text-gray-700 mb-2 font-semibold">Do this:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Don't take rocks, coral, or shells</li>
                  <li>• Don't feed wild animals</li>
                  <li>• Stay on paths in natural areas</li>
                  <li>• Avoid stepping on coral when swimming/snorkeling</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5) Dress smart: beachwear stays at the beach</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Aruba is casual, but there's still a line. Wearing a swimsuit in a restaurant, grocery store, or downtown is usually seen as disrespectful.
                </p>
                <p className="text-gray-700 font-semibold">Rule of thumb: Bring a cover-up or shirt and shorts when you leave the beach.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6) Be mindful on Sundays and during family time</h2>
                <p className="text-gray-700 leading-relaxed">
                  Sunday is a big family day for many locals. Some businesses operate shorter hours, and certain areas feel quieter. If you're driving or planning tours, check hours and plan accordingly. This is also a great day to slow down—take a long breakfast, visit a cultural spot, or enjoy a sunset dinner.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7) Tip like you mean it (but know what's already included)</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Tipping is common in Aruba, especially in tourism areas, but sometimes a service charge is already included.
                </p>
                <p className="text-gray-700 mb-2 font-semibold">Quick guide:</p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• <strong>Restaurants:</strong> check your bill for service charge first</li>
                  <li>• <strong>If included:</strong> locals often still leave a little extra for great service</li>
                  <li>• <strong>Tour guides/drivers:</strong> tipping is appreciated if they went above and beyond</li>
                </ul>
                <p className="text-gray-600 italic">If you're unsure, ask politely: "Is service included?"</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8) Driving culture: be calm, courteous, and alert</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Aruba driving is generally relaxed, but there are plenty of roundabouts and some areas with narrow roads.
                </p>
                <p className="text-gray-700 mb-2 font-semibold">Local-style tips:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Use roundabouts correctly (yield and signal)</li>
                  <li>• Let others merge when possible</li>
                  <li>• Don't honk aggressively—it's not the vibe</li>
                  <li>• Watch for pedestrians and cyclists</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9) Support local businesses—Aruba appreciates it</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Beyond the resorts, Aruba has small family-run restaurants, snack trucks, local artisans, and independent tour operators. Spending even a little outside big chains helps the community and often gives you the most memorable experiences.
                </p>
                <p className="text-gray-700 mb-2 font-semibold">Try:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• A local snack ("pastechi" in the morning is a classic)</li>
                  <li>• Handmade souvenirs and art markets</li>
                  <li>• Community tours that highlight history and nature</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10) Ask questions with curiosity, not judgment</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Aruba has a unique blend of cultures shaped by the Caribbean, Europe, Latin America, and centuries of movement and trade. People are proud of their island, but like anywhere, they don't love being stereotyped.
                </p>
                <p className="text-gray-700 mb-2 font-semibold">Better than: "Is it safe here?"</p>
                <p className="text-gray-700 mb-4">Try: "Any areas you recommend I visit or avoid at night?"</p>
                <p className="text-gray-700 mb-2 font-semibold">Better than: "Do locals live like this?"</p>
                <p className="text-gray-700 mb-4">Try: "What do you recommend for a more local experience?"</p>
                <p className="text-gray-600 italic">Curiosity opens doors.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bonus tip: Small kindness wins big</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Aruba is known as "One Happy Island" for a reason—people are genuinely friendly. Match that energy:
                </p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• Smile</li>
                  <li>• Say hello</li>
                  <li>• Be patient</li>
                  <li>• Leave places cleaner than you found them</li>
                </ul>
                <p className="text-gray-700 font-semibold">You'll get the same warmth back.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Final thought</h2>
                <p className="text-gray-700 leading-relaxed">
                  Aruba is more than a destination—it's a community. When you show respect for the language, pace, and everyday customs, you're not just visiting—you're connecting. And that's what turns a good trip into one you'll always remember.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
