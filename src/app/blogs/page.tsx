"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

export default function BlogsPage() {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Icon name="academic-cap" className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Blogs Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              We're working on bringing you engaging travel content and stories. Check back soon!
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

