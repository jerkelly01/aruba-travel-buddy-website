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
      color: 'bg-blue-500'
    },
    {
      number: '2',
      title: 'Fill Form',
      description: 'Enter travel & passport details',
      icon: 'document-text',
      color: 'bg-green-500'
    },
    {
      number: '3',
      title: 'Pay $20 Fee',
      description: 'Sustainability fee per person',
      icon: 'credit-card',
      color: 'bg-orange-500'
    },
    {
      number: '4',
      title: 'Get Confirmation',
      description: 'Save your ED Card QR code',
      icon: 'check-circle',
      color: 'bg-purple-500'
    },
  ];

  const checklist = [
    { text: 'Valid passport', icon: 'identification' },
    { text: 'Flight details', icon: 'paper-airplane' },
    { text: 'Accommodation address', icon: 'home' },
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
      <section className="relative py-12 bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <SectionHeader
            title="ED Card"
            subtitle="Aruba's mandatory digital travel form for all visitors"
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
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="border-r border-gray-200 md:border-r-0 md:border-b md:pb-4 md:mb-4">
                <div className="text-3xl font-bold text-blue-600">$20</div>
                <div className="text-sm text-gray-600 font-medium">Per Person</div>
              </div>
              <div className="border-r border-gray-200 md:border-r-0 md:border-b md:pb-4 md:mb-4">
                <div className="text-3xl font-bold text-blue-600">7 Days</div>
                <div className="text-sm text-gray-600 font-medium">Before Travel</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">All Ages</div>
                <div className="text-sm text-gray-600 font-medium">Required</div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Main CTA Button */}
      <section className="py-8 bg-gray-50">
        <Container>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVisitOfficialWebsite}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-6 px-8 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Icon name="globe-alt" className="w-6 h-6" />
            Complete Your ED Card Now
            <Icon name="arrow-right" className="w-5 h-5" />
          </motion.button>
        </Container>
      </section>

      {/* Content Sections */}
      <section className="py-12 bg-white">
        <Container>
          <div className="space-y-12">
            {/* What is ED Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">What is the ED Card?</h2>
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                <p className="text-gray-700 text-lg leading-relaxed">
                  The <span className="font-bold text-blue-800">Embarkation-Disembarkation Card</span> is Aruba's mandatory digital travel form. It replaces the old paper immigration form and includes a <span className="font-bold text-blue-800">$20 Sustainability Fee</span> that funds environmental conservation on the island.
                </p>
              </div>
            </motion.div>

            {/* Step by Step Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">How It Works</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon name={step.icon as any} className="w-6 h-6 text-white" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 ml-6 mt-14"></div>
                      )}
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* What You'll Need */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">What You'll Need</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {checklist.map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-6 ${index !== checklist.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon name={item.icon as any} className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-800 font-medium flex-1">{item.text}</span>
                    <Icon name="check-circle" className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-orange-50 border border-orange-200 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon name="information-circle" className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-orange-800">Important</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Complete your ED Card <span className="font-bold text-orange-800">before arriving at the airport</span>.
                Without it, you may face delays or be denied boarding.
              </p>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <Icon
                        name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                        className="w-5 h-5 text-blue-600 flex-shrink-0"
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <p className="text-gray-700 pt-4 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-8"
            >
              <button
                onClick={handleVisitOfficialWebsite}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 px-8 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                Go to Official ED Card Website
                <Icon name="arrow-right" className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-gray-500">
                <Icon name="shield-check" className="w-4 h-4" />
                <span className="text-sm">Official website: edcardaruba.aw</span>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

