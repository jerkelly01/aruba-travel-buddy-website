'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 border-t border-gray-800 overflow-hidden mt-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/beaches page.png"
          alt="Aruba beach at sunset"
          fill
          className="object-cover object-bottom"
          quality={80}
          unoptimized
        />
      </div>
      {/* Dark Overlays for legibility */}
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-black/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-aruba)] rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--brand-sun)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left flex-1">
            <h3 className="text-3xl font-black text-white font-display tracking-tight mb-3">Get Travel Buddy Secrets</h3>
            <p className="text-white/70 text-lg">Join our newsletter for exclusive local tips, hidden gems, and travel discounts delivered directly to your inbox.</p>
          </div>
          
          <div className="relative z-10 w-full md:w-auto flex-shrink-0 flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/10 border border-white/20 text-white placeholder-white/50 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-sun)] focus:border-transparent w-full md:w-72 shadow-inner"
            />
            <button className="bg-[var(--brand-sun)] hover:bg-yellow-400 text-gray-900 font-bold px-6 py-4 rounded-xl transition-colors duration-300 shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <Link href="/" className="inline-flex items-center gap-4 mb-6 group">
              <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-md p-2">
                <Image
                  src="/logo.png"
                  alt="Aruba Travel Buddy"
                  width={64}
                  height={64}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-display tracking-tight text-white leading-none">
                  Aruba Travel Buddy
                </span>
                <span className="text-sm font-semibold text-[var(--brand-sun)] mt-1 uppercase tracking-widest">
                  One Happy Island
                </span>
              </div>
            </Link>
            <p className="text-white/60 mb-8 leading-relaxed text-base max-w-md">
              Your ultimate travel companion for discovering the best of Aruba. From hidden beaches to local cuisine, we've got you covered with smart itineraries and authentic local insights.
            </p>
            <div className="flex gap-4">
              <a
                href="/contact-us"
                aria-label="Contact us via live chat"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--brand-aruba)] hover:border-[var(--brand-aruba)] text-white/80 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Icon name="chat" className="w-5 h-5" />
              </a>
              <a
                href="/contact-us"
                aria-label="Contact us via email"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--brand-sun)] hover:border-[var(--brand-sun)] hover:text-gray-900 text-white/80 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Icon name="envelope" className="w-5 h-5" />
              </a>
              <a
                href="/contact-us"
                aria-label="Contact us via phone"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--brand-amber)] hover:border-[var(--brand-amber)] hover:text-white text-white/80 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Icon name="phone" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-widest">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Tours & Excursions', href: '/tours' },
                { name: 'Local Experiences', href: '/local-experiences' },
                { name: 'Top Dining', href: '/restaurants' },
                { name: 'Cultural Events', href: '/cultural-events' },
                { name: 'Travel Tips', href: '/blogs' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[var(--brand-sun)] transition-colors duration-200 text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact Us', href: '/contact-us' },
                { name: 'Partner With Us', href: '/become-a-partner' },
                { name: 'Partner Directory', href: '/directory' },
                { name: 'Get The App', href: '/download' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[var(--brand-sun)] transition-colors duration-200 text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Aruba Travel Buddy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
