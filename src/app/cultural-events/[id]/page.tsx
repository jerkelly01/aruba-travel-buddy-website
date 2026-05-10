"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CodeSnippet } from "@/components/CodeSnippet";
import { publicCulturalEventsApi } from "@/lib/public-api";
import {
  formatCulturalCalendarDate,
  formatCulturalTime,
  normalizeCulturalEvents,
} from "@/lib/data-normalization";
import { sanitizeBookingUrl } from "@/lib/booking-url";

type CulturalEventRow = ReturnType<typeof normalizeCulturalEvents>[0];

export default function CulturalEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = React.useState<CulturalEventRow | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await params;
      const eventId = p.id;
      try {
        setLoading(true);
        const res = await publicCulturalEventsApi.getById(eventId);
        if (cancelled) return;
        if (!res.success || !res.data) {
          setError(res.error || "Event not found");
          setEvent(null);
          return;
        }
        const normalized = normalizeCulturalEvents([res.data as any]);
        setEvent(normalized[0] || null);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("Could not load this event");
          setEvent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const bookHref = event?.booking_url
    ? sanitizeBookingUrl(event.booking_url)
    : event?.code_snippet
      ? sanitizeBookingUrl(event.code_snippet)
      : "";

  const snippet = (event?.code_snippet && String(event.code_snippet).trim()) || "";
  const showSnippet = Boolean(snippet && (snippet.includes("<") || snippet.includes("script")));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white py-24">
        <Container>
          <p className="text-gray-700 mb-6">{error || "Not found"}</p>
          <Link href="/cultural-events" className="text-[var(--brand-aruba)] font-semibold underline">
            Back to cultural events
          </Link>
        </Container>
      </div>
    );
  }

  const dateLine = [
    formatCulturalCalendarDate(event.start_date),
    event.end_date && event.end_date !== event.start_date ? formatCulturalCalendarDate(event.end_date) : null,
  ]
    .filter(Boolean)
    .join(" – ");

  const timeLine = [
    event.start_time ? formatCulturalTime(event.start_time) : null,
    event.end_time ? formatCulturalTime(event.end_time) : null,
  ].filter(Boolean);

  const priceLabel =
    event.price != null && Number.isFinite(Number(event.price)) && Number(event.price) > 0
      ? `${event.currency || "USD"} ${Number(event.price).toFixed(0)}`
      : null;

  return (
    <div
      className={`min-h-screen bg-white -mt-24 pt-0 ${bookHref ? "pb-[max(8rem,calc(5rem+env(safe-area-inset-bottom)))]" : "pb-24"}`}
    >
      <div className="relative h-[50vh] min-h-[260px] md:h-[28rem] w-full bg-gray-100">
        {event.images?.[0] ? (
          <Image
            src={event.images[0]}
            alt={event.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
            <Icon name="calendar-days" className="w-20 h-20 text-white opacity-60" />
          </div>
        )}
        <div className="absolute top-24 left-4 z-10">
          <Link
            href="/cultural-events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-900 text-sm font-semibold shadow"
          >
            ← Back
          </Link>
        </div>
        {event.is_featured ? (
          <div className="absolute top-24 right-4 z-10">
            <span className="px-3 py-1 rounded-full bg-yellow-400/95 text-sm font-semibold text-gray-900 shadow">
              Featured
            </span>
          </div>
        ) : null}
      </div>

      <Container>
        <article className="py-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            {dateLine ? (
              <span className="flex items-center gap-1">
                <Icon name="calendar-days" className="w-4 h-4 shrink-0" />
                {dateLine}
              </span>
            ) : null}
            {timeLine.length > 0 ? (
              <span className="flex items-center gap-1">
                <Icon name="sparkles" className="w-4 h-4 shrink-0" />
                {timeLine.join(" – ")}
              </span>
            ) : null}
            {event.location ? (
              <span className="flex items-center gap-1 min-w-0">
                <Icon name="map-pin" className="w-4 h-4 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            ) : null}
            {event.event_type ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                {event.event_type}
              </span>
            ) : null}
            {priceLabel ? (
              <span className="font-semibold text-[var(--brand-aruba)]">{priceLabel}</span>
            ) : (
              <span className="text-sm font-medium text-emerald-700">Free</span>
            )}
          </div>

          <p className="text-lg text-gray-700 whitespace-pre-wrap mb-8">{event.description}</p>

          {event.cultural_significance ? (
            <section className="mb-10 rounded-2xl border border-amber-100 bg-amber-50/80 p-6">
              <h2 className="text-lg font-bold text-gray-900 font-display mb-2 flex items-center gap-2">
                <Icon name="sparkles" className="w-5 h-5 text-amber-600" />
                Cultural significance
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap">{event.cultural_significance}</p>
            </section>
          ) : null}

          {event.images && event.images.length > 1 ? (
            <section className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 font-display mb-4">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.images.slice(1).map((src: string, i: number) => (
                  <div key={`${src}-${i}`} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={src}
                      alt={`${event.title} photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px)50vw,33vw"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {showSnippet ? (
            <section className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 font-display mb-3">More</h2>
              <CodeSnippet code={snippet} className="rounded-xl border border-gray-200 overflow-hidden" />
            </section>
          ) : null}
        </article>
      </Container>

      {bookHref ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              <div className="min-w-0">
                {priceLabel ? (
                  <>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Tickets</p>
                    <p className="text-xl font-bold text-gray-900">{priceLabel}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Get tickets or more info</p>
                )}
              </div>
              <a
                href={bookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center px-8 py-3.5 bg-[var(--brand-aruba)] text-white rounded-xl font-semibold hover:bg-[var(--brand-aruba-dark)] transition-colors"
              >
                {priceLabel ? "Book tickets" : "Learn more"}
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
