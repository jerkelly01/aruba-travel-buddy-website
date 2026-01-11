"use client";

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Aruba Travel Buddy (&quot;the App&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;).",
      "If you do not agree to these Terms, please do not use the App.",
      "These Terms apply to all users of the App, including visitors, registered users, and premium subscribers.",
    ]
  },
  {
    title: "Description of Service",
    content: [
      "Aruba Travel Buddy is a mobile application that provides Itinerary Generator trip planning, AR view, and local experiences for travelers visiting Aruba.",
      "The App includes features such as itinerary planning, local recommendations, cultural information, and community features.",
      "Some features may require an active internet connection, while others are designed to work offline.",
    ]
  },
  {
    title: "User Accounts",
    content: [
      "You may need to create an account to access certain features of the App.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate and complete information when creating your account.",
      "You are responsible for all activities that occur under your account.",
      "You must notify us immediately of any unauthorized use of your account.",
    ]
  },
  {
    title: "Acceptable Use",
    content: [
      "You agree to use the App only for lawful purposes and in accordance with these Terms.",
      "You agree not to use the App to violate any applicable laws or regulations.",
      "You agree not to interfere with or disrupt the App or servers connected to the App.",
      "You agree not to attempt to gain unauthorized access to any part of the App.",
      "You agree not to use the App to transmit any harmful, offensive, or inappropriate content.",
    ]
  },
  {
    title: "Intellectual Property",
    content: [
      "The App and its content, features, and functionality are owned by Aruba Travel Buddy and are protected by copyright, trademark, and other intellectual property laws.",
      "You may not reproduce, distribute, modify, or create derivative works of the App without our express written consent.",
      "The Aruba Travel Buddy name, logo, and related trademarks are our property.",
      "User-generated content remains the property of the user, but you grant us a license to use such content in connection with the App.",
    ]
  },
  {
    title: "Subscription Services",
    content: [
      "Some features of the App may require a paid subscription.",
      "Subscription fees are charged in advance and are non-refundable except as required by law.",
      "You can cancel your subscription at any time through your account settings.",
      "We may change subscription prices with advance notice.",
      "All payments are processed securely through our payment partners.",
    ]
  },
  {
    title: "Third-Party Services",
    content: [
      "The App may integrate with third-party services, such as mapping services or social media platforms.",
      "Your use of third-party services is subject to their respective terms and conditions.",
      "We are not responsible for the availability or performance of third-party services.",
      "We are not responsible for any data collected by third-party services.",
    ]
  },
  {
    title: "Disclaimers and Limitations",
    content: [
      "The App is provided &quot;as is&quot; without warranties of any kind.",
      "We do not warrant that the App will be uninterrupted or error-free.",
      "We are not responsible for any damages arising from your use of the App.",
      "Information provided through the App is for general informational purposes only.",
      "Always verify information and use your best judgment when traveling.",
    ]
  },
  {
    title: "Indemnification",
    content: [
      "You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of the App.",
      "This includes claims arising from your violation of these Terms or applicable laws.",
      "You agree to cooperate with us in the defense of any such claims.",
    ]
  },
  {
    title: "Termination",
    content: [
      "We may terminate or suspend your account at any time for any reason.",
      "Upon termination, your right to use the App will cease immediately.",
      "We may delete your account and associated data upon termination.",
      "Provisions that by their nature should survive termination will remain in effect.",
    ]
  },
  {
    title: "Governing Law",
    content: [
      "These Terms are governed by the laws of Aruba, without regard to conflict of law principles.",
      "Any disputes arising from these Terms will be resolved in the courts of Aruba.",
      "You consent to the jurisdiction of the courts of Aruba for any disputes.",
    ]
  },
  {
    title: "Changes to Terms",
    content: [
      "We may modify these Terms at any time by posting the updated Terms in the App.",
      "Your continued use of the App after changes constitutes acceptance of the new Terms.",
      "It is your responsibility to review these Terms periodically.",
      "Material changes will be communicated through the App or email.",
    ]
  }
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[color-mix(in_oklab,var(--brand-aruba)_20%,white)] via-[#F5F9FF] to-[color-mix(in_oklab,var(--brand-aruba-light)_12%,white)]"
      >
        <Container>
          <div className="py-16">
            <SectionHeader
              title="Terms and Conditions"
              subtitle="Legal terms for using Aruba Travel Buddy"
            />
          </div>
        </Container>
      </motion.div>

      {/* Content */}
      <Container>
        <div className="py-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="prose prose-lg max-w-none"
          >
            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed mb-6">
                <strong>Effective Date:</strong> October 22, 2025
              </p>
              <p className="text-gray-600 leading-relaxed">
                These Terms and Conditions (&quot;Terms&quot;) govern your use of the Aruba Travel Buddy mobile application
                and related services (collectively, &quot;the App&quot;). By downloading, installing, or using the App,
                you agree to be bound by these Terms. Please read them carefully before using the App.
              </p>
            </div>

            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                  {index + 1}. {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                      <span className="flex-shrink-0 w-2 h-2 bg-[var(--brand-aruba)] rounded-full mt-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: sections.length * 0.1 }}
              className="bg-[var(--brand-aruba)]/5 rounded-lg p-6 mt-8"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@arubatravelbuddy.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-ARUBA</p>
                <p><strong>Address:</strong> 123 Caribbean Way, Oranjestad, Aruba</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9 }}
        className="bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-aruba-dark)] text-white"
      >
        <Container>
          <div className="py-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl font-bold mb-4"
            >
              Questions About Our Terms?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
            >
              If you have any questions about these terms or need clarification on any points, our legal team is here to help.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <a
                href="/contact-us"
                className="inline-flex items-center gap-3 bg-white text-[var(--brand-aruba)] font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Contact Legal Team
              </a>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </div>
  );
}
