"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { publicCulturalEventsApi } from "@/lib/public-api";
import { normalizeCulturalEvents } from "@/lib/data-normalization";

interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
  images: string[];
  is_featured: boolean;
}

export default function CulturalEventsPage() {
  const [events, setEvents] = React.useState<CulturalEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('[Cultural Events] Fetching events...');
      console.log('[Cultural Events] API URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      // cultural_events doesn't have an active column, so don't filter by active
      const response = await publicCulturalEventsApi.getAll();
      
      console.log('[Cultural Events] Full Response:', JSON.stringify(response, null, 2));
      console.log('[Cultural Events] Response Summary:', {
        success: response.success,
        hasData: !!response.data,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        error: response.error,
        dataPreview: Array.isArray(response.data) ? response.data.slice(0, 2) : response.data
      });
      
      if (response.success) {
        // Handle array response
        let eventsData: CulturalEvent[] = [];
        const data = response.data as any;
        
        console.log('[Cultural Events] Processing data:', { 
          dataType: typeof data, 
          isArray: Array.isArray(data),
          hasItems: !!(data?.items),
          hasCulturalEvents: !!(data?.culturalEvents),
          hasData: !!(data?.data),
          dataKeys: data && typeof data === 'object' ? Object.keys(data) : []
        });
        
        if (Array.isArray(data)) {
          eventsData = normalizeCulturalEvents(data);
        } else if (data && data.items && Array.isArray(data.items)) {
          eventsData = normalizeCulturalEvents(data.items);
        } else if (data && data.culturalEvents && Array.isArray(data.culturalEvents)) {
          eventsData = normalizeCulturalEvents(data.culturalEvents);
        } else if (data && data.data && Array.isArray(data.data)) {
          eventsData = normalizeCulturalEvents(data.data);
        } else if (data && typeof data === 'object') {
          // Try to find any array property
          const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
          if (arrayKeys.length > 0) {
            console.log('[Cultural Events] Found array keys:', arrayKeys);
            eventsData = normalizeCulturalEvents(data[arrayKeys[0]]);
          } else {
            // If data is an object but not an array, try to convert single item to array
            console.log('[Cultural Events] Data is object, converting to array');
            eventsData = normalizeCulturalEvents([data]);
          }
        }
        
        console.log('[Cultural Events] Final parsed events:', eventsData.length, eventsData);
        setEvents(eventsData);
      } else {
        console.error('[Cultural Events] Failed to load events:', response.error);
        setEvents([]);
      }
    } catch (error) {
      console.error('[Cultural Events] Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      return !q || [e.title, e.description, e.location].some((v) => 
        v?.toLowerCase().includes(q)
      );
    });
  }, [events, query]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <SectionHeader
            title="Cultural Events & Festivals"
            subtitle="Never miss local celebrations, concerts, and cultural events with our comprehensive event calendar"
            center
          />
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-y border-gray-100">
        <Container>
          <div className="relative max-w-md mx-auto">
            <Icon name="map-pin" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events..."
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
                <Icon name="calendar-days" className="w-16 h-16 mx-auto animate-pulse" />
              </div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Icon name="calendar-days" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">No events found</h3>
              <p className="text-gray-600 mb-6">
                {query ? 'Try adjusting your search criteria' : 'Check back soon for upcoming events!'}
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
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      {event.images && event.images.length > 0 ? (
                        <Image 
                          src={event.images[0]} 
                          alt={event.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
                          <Icon name="calendar-days" className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {event.is_featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-yellow-400/90 backdrop-blur-sm text-sm font-semibold text-gray-900">
                            Featured
                          </span>
                        </div>
                      )}
                      {event.price && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-[var(--brand-aruba)]">
                            ${event.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--brand-aruba)] transition-colors duration-200 font-display">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Icon name="map-pin" className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="calendar-days" className="w-4 h-4" />
                          <span>
                            {formatDate(event.start_date)}
                            {event.end_date && event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                          </span>
                        </div>
                        {event.start_time && (
                          <div className="flex items-center gap-2">
                            <Icon name="calendar-days" className="w-4 h-4" />
                            <span>
                              {formatTime(event.start_time)}
                              {event.end_time && ` - ${formatTime(event.end_time)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

