"use client";

import * as React from "react";
import Image from "next/image";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function PartnerPage() {
  const [downloadFormState, setDownloadFormState] = React.useState({ email: "", submitted: false });
  const [contactFormState, setContactFormState] = React.useState({ name: "", email: "", message: "", submitted: false });

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setDownloadFormState({ ...downloadFormState, submitted: true });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setContactFormState({ ...contactFormState, submitted: true });
  };

  const benefits = [
    {
      title: "Reach High-Intent Travelers",
      description: "Our users are actively planning or currently enjoying their trip to Aruba. Put your business exactly where they are looking.",
      icon: "users"
    },
    {
      title: "Featured App Placements",
      description: "Get highlighted in our Itinerary Generator, AR View, and local directories within the Aruba Travel Buddy app.",
      icon: "device-phone-mobile"
    },
    {
      title: "Targeted Advertising",
      description: "Sponsor specific sections like 'Family Travel', 'Oranjestad', or 'Seafood Restaurants' to reach your ideal customer.",
      icon: "sparkles"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/fort-zoutman-aruba.png"
            alt="Aruba background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-[var(--brand-aruba)] font-bold tracking-wider uppercase text-sm mb-4 block">Partner With Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-display">
              Connect Your Business with Aruba Travelers
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Join Aruba Travel Buddy as a partner, advertiser, or featured operator and reach thousands of highly engaged visitors looking for authentic experiences.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <SectionHeader
            title="Why Partner With Us?"
            subtitle="We offer unique digital exposure that traditional advertising can't match."
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--brand-aruba)]">
                  <Icon name={benefit.icon as any} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Lead Capture & Contact Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Download Media Kit */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 border border-blue-100"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">Download Our Media Kit</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Get immediate access to our audience demographics, app usage statistics, advertising rates, and available premium placements.
              </p>

              {downloadFormState.submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <Icon name="check-circle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">Check Your Inbox!</h3>
                  <p className="text-green-800">We've sent the media kit to {downloadFormState.email}.</p>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="mediaEmail" className="block text-sm font-semibold text-gray-900 mb-2">Business Email Address</label>
                    <input
                      type="email"
                      id="mediaEmail"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 shadow-sm focus:border-[var(--brand-aruba)] focus:ring-[var(--brand-aruba)] bg-white text-gray-900"
                      placeholder="you@company.com"
                      value={downloadFormState.email}
                      onChange={(e) => setDownloadFormState({ ...downloadFormState, email: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[var(--brand-aruba)] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                  >
                    <Icon name="document-arrow-down" className="w-5 h-5" />
                    Download Media Kit
                  </button>
                </form>
              )}
            </motion.div>

            {/* Direct Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Interested in a custom sponsorship, a featured listing in our directory, or just want to chat about partnership opportunities? Drop us a line.
              </p>

              {contactFormState.submitted ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <Icon name="paper-airplane" className="w-12 h-12 text-[var(--brand-aruba)] mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Message Sent!</h3>
                  <p className="text-blue-800">Our partnership team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-semibold text-gray-900 mb-2">Your Name / Company</label>
                    <input
                      type="text"
                      id="contactName"
                      required
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:border-[var(--brand-aruba)] focus:ring-[var(--brand-aruba)] bg-gray-50"
                      value={contactFormState.name}
                      onChange={(e) => setContactFormState({ ...contactFormState, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="contactEmail"
                      required
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:border-[var(--brand-aruba)] focus:ring-[var(--brand-aruba)] bg-gray-50"
                      value={contactFormState.email}
                      onChange={(e) => setContactFormState({ ...contactFormState, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="contactMessage" className="block text-sm font-semibold text-gray-900 mb-2">How would you like to partner?</label>
                    <textarea
                      id="contactMessage"
                      required
                      rows={4}
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:border-[var(--brand-aruba)] focus:ring-[var(--brand-aruba)] bg-gray-50 resize-none text-gray-900"
                      value={contactFormState.message}
                      onChange={(e) => setContactFormState({ ...contactFormState, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </Container>
      </section>

    </div>
  );
}
