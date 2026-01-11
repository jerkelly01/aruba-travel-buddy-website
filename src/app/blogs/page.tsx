"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function BlogsPage() {
  const blogs = [
    {
      title: "10 Essential Cultural Tips for Visiting Aruba",
      excerpt: "Discover the local customs, traditions, and cultural etiquette that will help you connect authentically with Aruban culture during your visit.",
      image: "/fort zoutman aruba.png",
      category: "Cultural Tips",
      readTime: "5 min read",
      href: "/blogs/10-essential-cultural-tips",
    },
    {
      title: "Complete Guide to Aruba's ED Card Requirements",
      excerpt: "Everything you need to know about the ED Card, entry requirements, and how to complete the process smoothly before your trip.",
      image: "/hafenbild-oranjestad--aruba-%20copy.jpg",
      category: "Ed Card",
      readTime: "3 min read",
      href: "/blogs/complete-guide-aruba-ed-card",
    },
    {
      title: "Best Hidden Gems: Local Experiences You Can't Miss",
      excerpt: "Explore off-the-beaten-path destinations and authentic local experiences that will make your Aruba trip truly unforgettable.",
      image: "/alto vista chapel aruba.png",
      category: "Blogs",
      readTime: "7 min read",
      href: "/blogs/best-hidden-gems-local-experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Travel Blogs"
            subtitle="Read our latest travel stories, tips, and insights about Aruba"
            center
          />
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={blog.href} className="block h-full">
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={blog.image} 
                        alt={blog.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[var(--brand-aruba)]">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Icon name="calendar-days" className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

