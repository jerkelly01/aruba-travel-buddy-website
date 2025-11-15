"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicPhotoChallengesApi } from "@/lib/public-api";
import { normalizePhotoChallenges } from "@/lib/data-normalization";

interface PhotoChallenge {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  category?: string;
  location?: string;
  images: string[];
  featured: boolean;
  points?: number;
}

export default function PhotoChallengesPage() {
  const [challenges, setChallenges] = React.useState<PhotoChallenge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      console.log('[Photo Challenges] Fetching challenges...');
      const response = await publicPhotoChallengesApi.getAll({ active: true });
      
      if (response.success && response.data) {
        let challengesData: PhotoChallenge[] = [];
        const data = response.data as any;
        if (Array.isArray(data)) {
          challengesData = normalizePhotoChallenges(data);
        } else if (data.items && Array.isArray(data.items)) {
          challengesData = normalizePhotoChallenges(data.items);
        } else if (data.photoChallenges && Array.isArray(data.photoChallenges)) {
          challengesData = normalizePhotoChallenges(data.photoChallenges);
        } else if (data.data && Array.isArray(data.data)) {
          challengesData = normalizePhotoChallenges(data.data);
        }
        
        console.log('[Photo Challenges] Parsed challenges:', challengesData.length);
        setChallenges(challengesData);
      } else {
        console.error('[Photo Challenges] Failed to load challenges:', response.error);
        setChallenges([]);
      }
    } catch (error) {
      console.error('[Photo Challenges] Error loading challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return challenges.filter((challenge) => {
      const title = challenge.title || '';
      return !q || [title, challenge.description, challenge.location, challenge.category, challenge.difficulty].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [challenges, query]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/90';
      case 'medium':
        return 'bg-yellow-500/90';
      case 'hard':
        return 'bg-red-500/90';
      default:
        return 'bg-gray-500/90';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Photo Challenges"
            subtitle="Capture Aruba's beauty through fun and engaging photo challenges"
            center
          />
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-y border-gray-100">
        <Container>
          <div className="relative max-w-md mx-auto">
            <Icon name="sparkles" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search photo challenges..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-aruba)] focus:border-[var(--brand-aruba)] text-base placeholder-gray-500 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <Container>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Icon name="sparkles" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading photo challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="sparkles" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No photo challenges found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Check back soon for new photo challenges!'}
              </p>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="px-6 py-3 bg-[var(--brand-aruba)] text-white rounded-xl hover:bg-[var(--brand-aruba-dark)] transition-colors font-semibold"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredChallenges.map((challenge, index) => {
                const title = challenge.title || 'Photo Challenge';
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="card overflow-hidden h-full group">
                      <div className="relative h-56 overflow-hidden">
                        {challenge.images && challenge.images.length > 0 ? (
                          <Image 
                            src={challenge.images[0]} 
                            alt={title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                            <Icon name="sparkles" className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {challenge.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                              Featured
                            </span>
                          </div>
                        )}
                        {challenge.difficulty && (
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full backdrop-blur-sm text-sm font-semibold text-white ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                        )}
                        {challenge.points && (
                          <div className="absolute bottom-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                              {challenge.points} pts
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                          {title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {challenge.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          {challenge.location && (
                            <div className="flex items-center gap-2">
                              <Icon name="map-pin" className="w-4 h-4" />
                              <span>{challenge.location}</span>
                            </div>
                          )}
                          {challenge.category && (
                            <div className="flex items-center gap-2">
                              <Icon name="sparkles" className="w-4 h-4" />
                              <span>{challenge.category}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

