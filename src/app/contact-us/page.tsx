"use client";

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import Icon, { type IconName } from '@/components/Icon';
import { motion } from 'framer-motion';
import Button from '@/components/Button';

const contactInfo: Array<{
  id: string;
  title: string;
  description: string;
  contact: string;
  icon: IconName;
  action: string;
  color: string;
}> = [
  {
    id: 'email',
    title: 'Email Us',
    description: 'Get in touch via email for support and inquiries',
    contact: 'hello@arubatravelbuddy.com',
    icon: 'envelope',
    action: 'Send Email',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    id: 'phone',
    title: 'Call Us',
    description: 'Speak directly with our customer support team',
    contact: '+1 (555) 123-ARUBA',
    icon: 'phone',
    action: 'Call Now',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    id: 'hours',
    title: 'Support Hours',
    description: 'Our team is available during business hours',
    contact: 'Mon-Fri: 9AM-6PM EST\nSat-Sun: 10AM-4PM EST',
    icon: 'calendar-days',
    action: 'View Hours',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
];

const faqs = [
  {
    question: 'How do I download the Aruba Travel Buddy app?',
    answer: 'You can download our app from the Apple App Store or Google Play Store. Visit our download page for direct links and more information.',
  },
  {
    question: 'Is the app available offline?',
    answer: 'Yes! Aruba Travel Buddy works completely offline with pre-loaded maps, guides, and information about Aruba.',
  },
  {
    question: 'Do you offer customer support in multiple languages?',
    answer: 'Currently, we provide support in English, Dutch, and Spanish. We\'re working to add more languages soon.',
  },
  {
    question: 'Can I cancel my premium subscription anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time through your account settings or by contacting our support team.',
  },
];

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Contact Us"
            subtitle="Get in touch with the Aruba Travel Buddy team"
            center
          />
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon name={info.icon} className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{info.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{info.description}</p>
                <div className="text-[var(--brand-aruba)] font-semibold text-sm mb-4 whitespace-pre-line">
                  {info.contact}
                </div>
                <button className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)] font-medium text-sm transition-colors">
                  {info.action}
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center font-display">Send us a Message</h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Subscriptions</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <SectionHeader
              title="Frequently Asked Questions"
              subtitle="Quick answers to common questions"
              center
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-3 font-display">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] via-[var(--brand-aruba-light)] to-[var(--brand-amber)]" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you make the most of your Aruba Travel Buddy experience.
            </p>
            <a
              href="mailto:hello@arubatravelbuddy.com"
            >
              <Button
                size="lg"
                className="bg-white text-[var(--brand-aruba)] hover:bg-gray-50 shadow-2xl hover:shadow-3xl"
                icon="envelope"
              >
                Email Support Team
              </Button>
            </a>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
