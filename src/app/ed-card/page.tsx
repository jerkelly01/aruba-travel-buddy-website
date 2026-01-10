"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function EdCardPage() {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const handleVisitOfficialWebsite = () => {
    window.open('https://edcardaruba.aw/welcome', '_blank');
  };

  const steps = [
    {
      number: '1',
      title: 'Visit Website',
      description: 'Go to edcardaruba.aw',
      icon: 'globe-alt',
      color: '#007AFF'
    },
    {
      number: '2',
      title: 'Fill Form',
      description: 'Enter travel & passport details',
      icon: 'cog',
      color: '#34C759'
    },
    {
      number: '3',
      title: 'Pay $20 Fee',
      description: 'Sustainability fee per person',
      icon: 'credit-card',
      color: '#FF9500'
    },
    {
      number: '4',
      title: 'Get Confirmation',
      description: 'Save your ED Card QR code',
      icon: 'check-circle',
      color: '#AF52DE'
    },
  ];

  const checklist = [
    { text: 'Valid passport', icon: 'shield-check' },
    { text: 'Flight details', icon: 'globe-alt' },
    { text: 'Accommodation address', icon: 'building-office' },
    { text: 'Credit/debit card for payment', icon: 'credit-card' },
    { text: 'Email address for confirmation', icon: 'envelope' },
  ];

  const faqs = [
    {
      question: 'When should I complete the ED Card?',
      answer: 'Complete it within 7 days before your arrival date. We recommend doing it at least 3-4 days early to avoid last-minute issues.'
    },
    {
      question: 'Do children need an ED Card?',
      answer: 'Yes, ALL travelers including infants and children need their own ED Card and must pay the $20 fee.'
    },
    {
      question: 'What is the $20 fee for?',
      answer: 'The Sustainability Fee funds environmental conservation projects in Aruba, including beach preservation, coral reef protection, and sustainable tourism initiatives.'
    },
    {
      question: 'What if I forget my ED Card?',
      answer: 'You can access your ED Card confirmation via email. We recommend saving a screenshot or printing it before your trip.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="ED Card"
            subtitle="Aruba's mandatory digital travel form and sustainability fee"
            center
          />
        </Container>
      </section>

      {/* Quick Info Banner */}
      <section className="py-8 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-blue-600 mb-1">$20</div>
                <div className="text-sm text-gray-600 font-medium">Per Person</div>
              </div>
              <div className="border-r border-gray-200 last:border-r-0">
                <div className="text-3xl font-bold text-blue-600 mb-1">7 Days</div>
                <div className="text-sm text-gray-600 font-medium">Before Travel</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">All Ages</div>
                <div className="text-sm text-gray-600 font-medium">Required</div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Main CTA Button */}
      <section className="py-8 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={handleVisitOfficialWebsite}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-4 px-6 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon name="globe-alt" className="w-6 h-6" />
              Complete Your ED Card Now
              <Icon name="arrow-right" className="w-5 h-5" />
            </button>
          </motion.div>
        </Container>
      </section>

      {/* What is ED Card */}
      <section className="py-12 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-display text-center">What is the ED Card?</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                The <span className="font-bold text-blue-600">Embarkation-Disembarkation Card</span> is Aruba's mandatory digital travel form. It replaces the old paper immigration form and includes a <span className="font-bold text-green-600">$20 Sustainability Fee</span> that funds environmental conservation on the island.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Step by Step Guide */}
      <section className="py-12 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-display text-center">How It Works</h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-6">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon name={step.icon as any} className="w-6 h-6" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" style={{ marginLeft: '1.5rem' }} />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* What You'll Need */}
      <section className="py-12 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-display text-center">What You'll Need</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon name={item.icon as any} className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-900 font-medium flex-1">{item.text}</span>
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="check-circle" className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-amber-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="information-circle" className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold text-amber-800">Important</h3>
              </div>
              <p className="text-lg text-amber-800 leading-relaxed">
                Complete your ED Card <span className="font-bold">before arriving at the airport</span>.
                Without it, you may face delays or be denied boarding.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-display text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <Icon
                      name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                      className="w-5 h-5 text-blue-600 flex-shrink-0"
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-display">Ready to Travel to Aruba?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Complete your ED Card today and ensure a smooth arrival experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleVisitOfficialWebsite}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Icon name="globe-alt" className="w-5 h-5" />
                Go to Official ED Card Website
                <Icon name="arrow-right" className="w-4 h-4" />
              </button>
              <Link
                href="/download"
                className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Icon name="device-phone-mobile" className="w-5 h-5" />
                Download Free App
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Icon name="shield-check" className="w-4 h-4" />
            <span className="text-sm">Official website: edcardaruba.aw</span>
          </div>
        </Container>
      </section>
    </div>
  );
}

