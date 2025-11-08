"use client";

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Personal Information: When you create an account or use our services, we may collect information such as your name, email address, phone number, and travel preferences.",
      "Location Data: With your permission, we collect location data to provide AR view, local recommendations, and personalized experiences.",
      "Device Information: We collect information about your device, including device type, operating system, app version, and unique device identifiers.",
      "Usage Data: We collect information about how you use the app, including features accessed, time spent, and interaction patterns.",
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "To provide and improve our services, including Itinerary Generator trip planning and AR view.",
      "To personalize your experience and provide relevant recommendations based on your preferences and location.",
      "To communicate with you about updates, features, and important service information.",
      "To ensure security and prevent fraud or unauthorized access to our services.",
      "To comply with legal obligations and enforce our terms of service.",
    ]
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share information with trusted service providers who help us operate our app and provide services to you.",
      "We may share information when required by law or to protect our rights and safety.",
      "With your consent, we may share information with local partners for enhanced experiences.",
    ]
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your information.",
      "All data transmission is encrypted using SSL/TLS protocols.",
      "We regularly update our security practices and conduct security assessments.",
      "Access to personal information is restricted to authorized personnel only.",
    ]
  },
  {
    title: "Your Rights and Choices",
    content: [
      "You can access, update, or delete your personal information through your account settings.",
      "You can opt out of location tracking and personalized recommendations at any time.",
      "You can request a copy of the personal information we hold about you.",
      "You can unsubscribe from marketing communications using the unsubscribe link in our emails.",
    ]
  },
  {
    title: "Children's Privacy",
    content: [
      "Our services are not intended for children under 13 years of age.",
      "We do not knowingly collect personal information from children under 13.",
      "If we become aware of such collection, we will take steps to delete the information.",
    ]
  },
  {
    title: "International Data Transfers",
    content: [
      "Your information may be transferred to and processed in countries other than your own.",
      "We ensure appropriate safeguards are in place for international data transfers.",
      "All transfers comply with applicable data protection laws.",
    ]
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time.",
      "We will notify you of any material changes through the app or email.",
      "Your continued use of our services constitutes acceptance of the updated policy.",
    ]
  }
];

export default function PrivacyPolicy() {
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
              title="Privacy Policy"
              subtitle="How we protect and handle your personal information"
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
                Aruba Travel Buddy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application
                and related services. By using Aruba Travel Buddy, you agree to the collection and use of information in accordance with this policy.
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
                  {section.title}
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
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Us About Privacy</h4>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@arubatravelbuddy.com</p>
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
              Questions About Your Privacy?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
            >
              Our privacy team is here to help you understand how we protect your personal information.
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
                Contact Privacy Team
              </a>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </div>
  );
}
