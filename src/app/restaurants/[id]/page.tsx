"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { publicRestaurantsApi } from "@/lib/public-api";
import { normalizeRestaurants } from "@/lib/data-normalization";
import { sanitizeBookingUrl } from "@/lib/booking-url";

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = React.useState<string | null>(null);
  const [restaurant, setRestaurant] = React.useState<ReturnType<typeof normalizeRestaurants>[0] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await params;
      const restaurantId = p.id;
      if (cancelled) return;
      setId(restaurantId);
      try {
        setLoading(true);
        const res = await publicRestaurantsApi.getById(restaurantId);
        if (cancelled) return;
        if (!res.success || !res.data) {
          setError(res.error || "Restaurant not found");
          setRestaurant(null);
          return;
        }
        const row = res.data as any;
        const normalized = normalizeRestaurants([row]);
        setRestaurant(normalized[0] || null);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("Could not load this restaurant");
          setRestaurant(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const websiteHref = restaurant?.contact_info?.website
    ? sanitizeBookingUrl(restaurant.contact_info.website)
    : "";

  if (loading || !id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-white py-24">
        <Container>
          <p className="text-gray-700 mb-6">{error || "Not found"}</p>
          <Link href="/restaurants" className="text-[var(--brand-aruba)] font-semibold underline">
            Back to restaurants
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-white -mt-24 pt-0 ${websiteHref ? "pb-[max(8rem,calc(5rem+env(safe-area-inset-bottom)))]" : "pb-24"}`}
    >
      <div className="relative h-[50vh] min-h-[260px] md:h-[28rem] w-full bg-gray-100">
        {restaurant.images?.[0] ? (
          <Image
            src={restaurant.images[0]}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-aruba)] to-[var(--brand-tropical)] flex items-center justify-center">
            <Icon name="star" className="w-20 h-20 text-white opacity-60" />
          </div>
        )}
        <div className="absolute top-24 left-4 z-10">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-900 text-sm font-semibold shadow"
          >
            ← Back
          </Link>
        </div>
      </div>

      <Container>
        <article className="py-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">{restaurant.name}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            {restaurant.price_range ? (
              <span className="font-semibold text-[var(--brand-aruba)]">{restaurant.price_range}</span>
            ) : null}
            {restaurant.location ? (
              <span className="flex items-center gap-1">
                <Icon name="map-pin" className="w-4 h-4" />
                {restaurant.location}
              </span>
            ) : null}
            {restaurant.cuisine_types?.length ? (
              <span className="flex items-center gap-1">
                <Icon name="sparkles" className="w-4 h-4" />
                {restaurant.cuisine_types.join(", ")}
              </span>
            ) : null}
          </div>
          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-lg text-gray-700 whitespace-pre-wrap">{restaurant.description}</p>
          </div>
          {(restaurant.contact_info?.phone || restaurant.contact_info?.email) && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-3 text-gray-700">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Contact</h2>
              {restaurant.contact_info?.phone ? (
                <a href={`tel:${restaurant.contact_info.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-[var(--brand-aruba)]">
                  <Icon name="phone" className="w-4 h-4 shrink-0" />
                  {restaurant.contact_info.phone}
                </a>
              ) : null}
              {restaurant.contact_info?.email ? (
                <a href={`mailto:${restaurant.contact_info.email}`} className="flex items-center gap-2 hover:text-[var(--brand-aruba)] break-all">
                  <Icon name="envelope" className="w-4 h-4 shrink-0" />
                  {restaurant.contact_info.email}
                </a>
              ) : null}
            </div>
          )}
        </article>
      </Container>

      {websiteHref ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              <p className="text-sm text-gray-600">Reserve or view the menu on their site.</p>
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center px-8 py-3.5 bg-[var(--brand-aruba)] text-white rounded-xl font-semibold hover:bg-[var(--brand-aruba-dark)] transition-colors"
              >
                Visit website
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
