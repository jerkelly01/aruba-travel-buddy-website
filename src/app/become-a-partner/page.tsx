'use client';

import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import Icon, { type IconName } from '@/components/Icon';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

const benefits = [
  {
    title: 'Increased Visibility',
    description: 'Reach thousands of travelers actively planning their Aruba adventure through our platform.',
    icon: 'globe-alt',
    color: 'from-[var(--brand-aruba)] to-[var(--brand-aruba-light)]',
  },
  {
    title: 'Direct Bookings',
    description: 'Get direct bookings from engaged travelers who are ready to experience what you offer.',
    icon: 'currency-dollar',
    color: 'from-[var(--brand-amber)] to-[var(--brand-sun)]',
  },
  {
    title: 'Marketing Support',
    description: 'We promote your business through our app, website, and social media channels.',
    icon: 'sparkles',
    color: 'from-[var(--brand-tropical)] to-[var(--brand-aruba)]',
  },
  {
    title: 'Analytics & Insights',
    description: 'Access detailed analytics about how travelers discover and interact with your listings.',
    icon: 'cpu-chip',
    color: 'from-[var(--brand-coral)] to-[var(--brand-peach)]',
  },
];

const partnerTypes = [
  {
    title: 'Tour Operators',
    description: 'List your tours and activities to reach travelers looking for authentic Aruban experiences.',
    features: [
      'Featured tour listings',
      'Real-time availability management',
      'Direct booking integration',
      'Customer reviews and ratings',
    ],
  },
  {
    title: 'Restaurants & Cafes',
    description: 'Showcase your culinary offerings to food-loving travelers exploring Aruba.',
    features: [
      'Menu and photo galleries',
      'Reservation system integration',
      'Special offers and promotions',
      'Location-based discovery',
    ],
  },
  {
    title: 'Accommodations',
    description: 'Connect with travelers seeking unique stays and local hospitality experiences.',
    features: [
      'Property listings with photos',
      'Availability calendar',
      'Booking management',
      'Guest communication tools',
    ],
  },
  {
    title: 'Local Experiences',
    description: 'Share your unique local experiences, workshops, and cultural activities.',
    features: [
      'Experience listings',
      'Workshop scheduling',
      'Group booking options',
      'Cultural event promotion',
    ],
  },
  {
    title: 'Rental Services',
    description: 'List your car rentals, gear rentals, and equipment for travelers.',
    features: [
      'Rental inventory management',
      'Pricing and availability',
      'Booking system integration',
      'Pickup/dropoff coordination',
    ],
  },
  {
    title: 'Event Organizers',
    description: 'Promote your cultural events, festivals, and special happenings.',
    features: [
      'Event calendar listings',
      'Ticket sales integration',
      'Event promotion',
      'Attendee management',
    ],
  },
];

export default function BecomeAPartner() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            eyebrow="Partner With Us"
            title="Grow Your Business with Aruba Travel Buddy"
            subtitle="Join our network of trusted partners and connect with thousands of travelers discovering Aruba. Whether you're a tour operator, restaurant, accommodation, or local business, we help you reach the right audience."
            center
          />
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">Why Partner With Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to helping local businesses thrive by connecting them with travelers who value authentic experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={benefit.icon as IconName} className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Partner Types Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader 
            title="Perfect For All Types of Businesses" 
            subtitle="We welcome partners from all sectors of Aruba's tourism and hospitality industry"
            center 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {partnerTypes.map((type, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">{type.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <Icon name="check-circle" className="w-4 h-4 text-[var(--brand-aruba)] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <Container>
          <SectionHeader title="How It Works" center />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Apply to Become a Partner',
                  description: 'Fill out our simple partner application form with details about your business.',
                },
                {
                  step: '2',
                  title: 'Get Verified',
                  description: 'Our team reviews your application and verifies your business credentials.',
                },
                {
                  step: '3',
                  title: 'Set Up Your Profile',
                  description: 'Create your business profile with photos, descriptions, and availability.',
                },
                {
                  step: '4',
                  title: 'Start Receiving Bookings',
                  description: 'Begin connecting with travelers and growing your business through our platform.',
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-aruba-light)] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-display">
                Ready to Grow Your Business?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className="card p-8 md:p-12">
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
                      autoComplete="given-name"
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
                      autoComplete="family-name"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all bg-white"
                  >
                    <option value="">Select your business type</option>
                    <option value="tour-operator">Tour Operator</option>
                    <option value="restaurant">Restaurant & Cafe</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="local-experience">Local Experience Provider</option>
                    <option value="car-rental">Car Rental Service</option>
                    <option value="gear-rental">Gear Rental Service</option>
                    <option value="event-organizer">Event Organizer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                      placeholder="+297 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website (if applicable)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    autoComplete="url"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all"
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell Us About Your Business *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] transition-all resize-none"
                    placeholder="Please share details about your business, what services you offer, and why you'd like to partner with Aruba Travel Buddy..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  icon="envelope"
                >
                  Submit Partnership Inquiry
                </Button>
              </form>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

