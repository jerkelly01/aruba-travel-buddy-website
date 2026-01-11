"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function EdCardGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Complete Guide to Aruba's ED Card Requirements"
            subtitle="Everything you need to know about the ED Card, entry requirements, and how to complete the process smoothly before your trip"
            center
          />
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                If you're flying to Aruba, the ED Card (Embarkation–Disembarkation Card) is the online entry form you must complete before you board. Here's the simple, stress-free way to do it—plus what you need, what it costs, and common mistakes to avoid.
              </p>

              <div className="space-y-8">
                {/* What is the ED Card */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">What is the Aruba ED Card?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The ED Card is Aruba's required online immigration form. It's mandatory for every passenger traveling to Aruba, including infants and children.
                  </p>
                </div>

                {/* When to complete */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">When should you complete it?</h2>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    You can fill out the ED Card within 7 days before your trip.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-semibold">
                    Best practice: do it 3–5 days before you fly so you have time to fix any mistakes without stress.
                  </p>
                </div>

                {/* Cost */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">How much does it cost?</h2>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    The ED Card process includes a $20 Sustainability Fee charged through the ED Card platform for visitors arriving by air (with exemptions for residents/citizens).
                  </p>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                    <p className="text-gray-800 font-semibold mb-1">Heads up:</p>
                    <p className="text-gray-700">
                      There are third-party sites that charge much more to "help" you fill it out. Aruba's official travel pages warn that some services/companies charge extra, so always use the official platform.
                    </p>
                  </div>
                </div>

                {/* What you need */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">What you need before you start (quick checklist)</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed font-semibold">Have these ready:</p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• A valid passport (you'll enter passport details)</li>
                    <li>• Your travel details (flight dates/airline info)</li>
                    <li>• Where you're staying in Aruba (hotel/address)</li>
                    <li>• A credit card to pay the fee (Visa/Mastercard/Discover listed by the official ED site)</li>
                    <li>• An email address so you can receive your confirmation</li>
                  </ul>
                  <p className="text-gray-700 mb-2 leading-relaxed">Also, Aruba entry rules typically require:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• A return or onward ticket</li>
                    <li>• Proof of sufficient funds (commonly listed by official travel guidance)</li>
                  </ul>
                </div>

                {/* Step by step */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Step-by-step: how to complete the ED Card smoothly</h2>
                  <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                    <li>Go to the official ED Card website (don't use "helper" websites that charge extra).</li>
                    <li>Enter your personal + passport details.</li>
                    <li>Add your travel info and stay details.</li>
                    <li>Pay the Sustainability Fee in the ED Card flow.</li>
                    <li>Submit and save the approved confirmation (screenshot + PDF).</li>
                    <li>Airlines may ask to see it at check-in, and you may be asked again on arrival.</li>
                  </ol>
                </div>

                {/* Common mistakes */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Common mistakes (and how to avoid them)</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Using the wrong website</h3>
                      <p className="text-gray-700 leading-relaxed">
                        If you see big "service fees" or prices like $60–$100, you're probably on a third-party site. Use Aruba's official link guidance.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Typo in passport number or travel date</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Double-check every field before submitting. If you realize you made an error after paying, Aruba notes you may need to create a new ED Card, but you generally shouldn't be charged again if you keep your payment receipt/confirmation email.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Waiting until the last minute</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Because you can only do it within 7 days of travel, set a reminder for about 5 days before departure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final tip */}
                <div className="bg-gradient-to-r from-[var(--brand-aruba)]/10 to-[var(--brand-aruba-light)]/10 rounded-xl p-6 border-2 border-[var(--brand-aruba)]/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Final tip</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    After approval, keep your ED Card confirmation in two places:
                  </p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• saved to your phone (offline)</li>
                    <li>• emailed/printed backup</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    That way you're covered even if airport Wi-Fi is slow.
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
