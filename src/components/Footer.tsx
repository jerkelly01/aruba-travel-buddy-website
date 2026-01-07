'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-white via-gray-50 to-white border-t border-gray-100">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand-aruba)] via-[var(--brand-amber)] to-[var(--brand-aruba)] opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Aruba Travel Buddy"
                  width={128}
                  height={128}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <span className="text-xl font-bold font-display block">
                  <span className="text-[var(--brand-aruba)]">Aruba</span>{' '}
                  <span className="text-[var(--brand-amber)]">Travel Buddy</span>
                </span>
                <span className="text-xs text-gray-500">One Happy Island</span>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              Your ultimate travel companion for discovering the best of Aruba. From hidden beaches to local cuisine, we&apos;ve got you covered.
            </p>
            <div className="flex gap-3">
              <a 
                href="/contact-us" 
                aria-label="Contact us via live chat" 
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[var(--brand-aruba)] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Icon name="chat" className="w-5 h-5" />
              </a>
              <a 
                href="/contact-us" 
                aria-label="Contact us via email" 
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[var(--brand-aruba-light)] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Icon name="envelope" className="w-5 h-5" />
              </a>
              <a 
                href="/contact-us" 
                aria-label="Contact us via phone" 
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-[var(--brand-aruba-dark)] hover:text-white text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Icon name="phone" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-gray-900 uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Features', href: '/features' },
                { name: 'Tours', href: '/tours' },
                { name: 'Cultural Events', href: '/cultural-events' },
                { name: 'Local Experiences', href: '/local-experiences' },
                { name: 'Support Locals', href: '/support-locals' },
                { name: 'Travel Tips', href: '/blogs' },
                { name: 'Car Rentals', href: '/car-rentals' },
                { name: 'Bus Tours', href: '/bus-tours' },
                { name: 'Private Transportation', href: '/private-transportation' },
                { name: 'Download FREE', href: '/download' },
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-600 hover:text-[var(--brand-aruba)] transition-all duration-200 hover:translate-x-1 inline-block text-sm group"
                >
                  <span className="flex items-center gap-2">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-gray-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '/contact-us' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-and-conditions' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[var(--brand-peach)] transition-all duration-200 hover:translate-x-1 inline-block text-sm group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Aruba Travel Buddy. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with <span className="text-[var(--brand-aruba)] font-semibold">♥</span> for travelers in{' '}
              <span className="text-[var(--brand-aruba)] font-semibold">One Happy Island</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
