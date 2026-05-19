"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { publicToursApi } from "@/lib/public-api";
import { normalizeTours } from "@/lib/data-normalization";
import { sanitizeBookingUrl } from "@/lib/booking-url";
import SocialLinks from "@/components/SocialLinks";

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = React.useState<string | null>(null);
  const [tour, setTour] = React.useState<ReturnType<typeof normalizeTours>[0] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await params;
      const tourId = p.id;
      if (cancelled) return;
      setId(tourId);
      try {
        setLoading(true);
        const res = await publicToursApi.getById(tourId);
        if (cancelled) return;
        if (!res.success || !res.data) {
          setError(res.error || "Tour not found");
          setTour(null);
          return;
        }
        const row = res.data as any;
        const normalized = normalizeTours([row]);
        setTour(normalized[0] || null);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError("Could not load this tour");
          setTour(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const bookHref = tour?.booking_url ? sanitizeBookingUrl(tour.booking_url) : "";

  if (loading || !id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-white py-24">
        <Container>
          <p className="text-gray-700 mb-6">{error || "Not found"}</p>
          <Link href="/tours" className="text-[var(--brand-aruba)] font-semibold underline">
            Back to tours
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-white -mt-24 pt-0 ${bookHref ? "pb-[max(8rem,calc(5rem+env(safe-area-inset-bottom)))]" : "pb-24"}`}
    >
      <div className="relative h-[50vh] min-h-[260px] md:h-[28rem] w-full bg-gray-100">
        {tour.images?.[0] ? (
          <Image src={tour.images[0]} alt={tour.title} fill className="object-cover" priority sizes="100vw" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
            <Icon name="map-pin" className="w-20 h-20 text-white opacity-60" />
          </div>
        )}
        <div className="absolute top-24 left-4 z-10">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-900 text-sm font-semibold shadow"
          >
            ← Back
          </Link>
        </div>
      </div>

      <Container>
        <article className="py-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">{tour.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            {tour.price ? (
              <span className="font-semibold text-[var(--brand-aruba)]">{tour.price}</span>
            ) : null}
            {tour.duration ? (
              <span className="flex items-center gap-1">
                <Icon name="calendar-days" className="w-4 h-4" />
                {tour.duration}
              </span>
            ) : null}
            {tour.location ? (
              <span className="flex items-center gap-1">
                <Icon name="map-pin" className="w-4 h-4" />
                {tour.location}
              </span>
            ) : null}
            {tour.category ? (
              <span className="flex items-center gap-1">
                <Icon name="sparkles" className="w-4 h-4" />
                {tour.category}
              </span>
            ) : null}
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 whitespace-pre-wrap">{tour.description}</p>
          </div>

          <SocialLinks
            facebookUrl={tour.facebook_url}
            instagramUrl={tour.instagram_url}
            tiktokUrl={tour.tiktok_url}
          />
        </article>
      </Container>

      {bookHref ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              <div className="min-w-0">
                {tour.price ? (
                  <>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">From</p>
                    <p className="text-xl font-bold text-gray-900">{tour.price}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Ready to book?</p>
                )}
              </div>
              <a
                href={bookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center px-8 py-3.5 bg-[var(--brand-aruba)] text-white rounded-xl font-semibold hover:bg-[var(--brand-aruba-dark)] transition-colors"
              >
                Book Now
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
