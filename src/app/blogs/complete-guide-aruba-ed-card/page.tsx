"use client";

import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";

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
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8 leading-relaxed">
              If you're flying to Aruba, the ED Card (Embarkation–Disembarkation Card) is the online entry form you must complete before you board. Here's the simple, stress-free way to do it—plus what you need, what it costs, and common mistakes to avoid.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the Aruba ED Card?</h2>
                <p className="text-gray-700 leading-relaxed">
                  The ED Card is Aruba's required online immigration form. It's mandatory for every passenger traveling to Aruba, including infants and children.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">When should you complete it?</h2>
                <p className="text-gray-700 mb-2 leading-relaxed">
                  You can fill out the ED Card within 7 days before your trip.
                </p>
                <p className="text-gray-700 leading-relaxed font-semibold">
                  Best practice: do it 3–5 days before you fly so you have time to fix any mistakes without stress.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How much does it cost?</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The ED Card process includes a $20 Sustainability Fee charged through the ED Card platform for visitors arriving by air (with exemptions for residents/citizens).
                </p>
                <p className="text-gray-700 font-semibold mb-2">Heads up:</p>
                <p className="text-gray-700 leading-relaxed">
                  There are third-party sites that charge much more to "help" you fill it out. Aruba's official travel pages warn that some services/companies charge extra, so always use the official platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What you need before you start (quick checklist)</h2>
                <p className="text-gray-700 mb-4 leading-relaxed font-semibold">Have these ready:</p>
                <ul className="text-gray-700 space-y-2 mb-4">
                  <li>• A valid passport (you'll enter passport details)</li>
                  <li>• Your travel details (flight dates/airline info)</li>
                  <li>• Where you're staying in Aruba (hotel/address)</li>
                  <li>• A credit card to pay the fee (Visa/Mastercard/Discover listed by the official ED site)</li>
                  <li>• An email address so you can receive your confirmation</li>
                </ul>
                <p className="text-gray-700 mb-2 leading-relaxed">Also, Aruba entry rules typically require:</p>
                <ul className="text-gray-700 space-y-2">
                  <li>• A return or onward ticket</li>
                  <li>• Proof of sufficient funds (commonly listed by official travel guidance)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step-by-step: how to complete the ED Card smoothly</h2>
                <ol className="text-gray-700 space-y-3 list-decimal list-inside">
                  <li>Go to the official ED Card website (don't use "helper" websites that charge extra).</li>
                  <li>Enter your personal + passport details.</li>
                  <li>Add your travel info and stay details.</li>
                  <li>Pay the Sustainability Fee in the ED Card flow.</li>
                  <li>Submit and save the approved confirmation (screenshot + PDF).</li>
                  <li>Airlines may ask to see it at check-in, and you may be asked again on arrival.</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common mistakes (and how to avoid them)</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Using the wrong website</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you see big "service fees" or prices like $60–$100, you're probably on a third-party site. Use Aruba's official link guidance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Typo in passport number or travel date</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Double-check every field before submitting. If you realize you made an error after paying, Aruba notes you may need to create a new ED Card, but you generally shouldn't be charged again if you keep your payment receipt/confirmation email.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Waiting until the last minute</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Because you can only do it within 7 days of travel, set a reminder for about 5 days before departure.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Final tip</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  After approval, keep your ED Card confirmation in two places:
                </p>
                <ul className="text-gray-700 space-y-2 mb-4">
                  <li>• saved to your phone (offline)</li>
                  <li>• emailed/printed backup</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  That way you're covered even if airport Wi-Fi is slow.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
