"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { publicRestaurantsApi } from "@/lib/public-api";
import { normalizeRestaurants } from "@/lib/data-normalization";
import { sanitizeBookingUrl } from "@/lib/booking-url";
import SocialLinks from "@/components/SocialLinks";

type RestaurantRow = ReturnType<typeof normalizeRestaurants>[0];

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_LABELS: Record<(typeof DAY_ORDER)[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function formatTime24(time24: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  if (Number.isNaN(h)) return time24;
  const ampm = h >= 12 ? "PM" : "AM";
  const hours12 = h % 12 || 12;
  const minutes = Number.isNaN(m) ? 0 : m;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function normalizeHoursKeys(hours: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(hours)) {
    out[k.toLowerCase()] = v;
  }
  return out;
}

function dayHoursDisplay(dayData: unknown): string {
  if (dayData == null) return "Closed";
  if (typeof dayData === "string") {
    const t = dayData.trim();
    return t || "Closed";
  }
  if (typeof dayData !== "object") return "Closed";
  const d = dayData as { closed?: boolean; open?: string; close?: string };
  if (d.closed) return "Closed";
  if (d.open && d.close) {
    return `${formatTime24(d.open)} – ${formatTime24(d.close)}`;
  }
  return "Closed";
}

function hasOperatingHours(hours: unknown): hours is Record<string, unknown> {
  return Boolean(hours && typeof hours === "object" && Object.keys(hours as object).length > 0);
}

/** Matches app: generic Aruba default coords are not used for precise directions. */
const DEFAULT_LAT = 12.5211;
const DEFAULT_LNG = -69.9683;

function directionsHref(r: RestaurantRow): string {
  const lat = r.latitude != null ? Number(r.latitude) : NaN;
  const lng = r.longitude != null ? Number(r.longitude) : NaN;
  const hasRealCoords =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === DEFAULT_LAT && lng === DEFAULT_LNG);
  const dest = hasRealCoords
    ? `${lat},${lng}`
    : encodeURIComponent(r.address || r.location_name || r.location || `${r.name}, Aruba`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = React.useState<string | null>(null);
  const [restaurant, setRestaurant] = React.useState<RestaurantRow | null>(null);
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

  const websiteRaw = restaurant?.contact_info?.website?.trim() || "";
  const websiteHref = websiteRaw ? sanitizeBookingUrl(websiteRaw) : "";

  const menuUrlRaw = (restaurant?.menu_url && String(restaurant.menu_url).trim()) || "";
  const menuImageRaw = (restaurant?.menu_image_url && String(restaurant.menu_image_url).trim()) || "";
  const menuLinkHref = menuUrlRaw ? sanitizeBookingUrl(menuUrlRaw) : "";
  const menuImageHref = menuImageRaw ? sanitizeBookingUrl(menuImageRaw) : "";
  const hasMenuBlock = Boolean(menuLinkHref || menuImageHref);
  const showStickyLinks = Boolean(websiteHref || menuLinkHref || menuImageHref);

  const hoursRecord = restaurant?.operating_hours;
  const hoursNormalized = hasOperatingHours(hoursRecord) ? normalizeHoursKeys(hoursRecord) : null;

  const locationLines = React.useMemo(() => {
    if (!restaurant) return [];
    const parts: string[] = [];
    if (restaurant.location_name) parts.push(restaurant.location_name);
    if (restaurant.address && restaurant.address !== restaurant.location_name) {
      parts.push(restaurant.address);
    }
    if (parts.length === 0 && restaurant.location) {
      parts.push(restaurant.location);
    }
    return parts;
  }, [restaurant]);

  const hasContactFields = Boolean(
    restaurant &&
      (restaurant.contact_info?.phone ||
        restaurant.contact_info?.email ||
        websiteHref ||
        websiteRaw),
  );

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
      className={`min-h-screen bg-white pt-0 md:pt-0 ${showStickyLinks ? "pb-[max(8rem,calc(5rem+env(safe-area-inset-bottom)))]" : "pb-24"}`}
    >
      <div className="relative h-[38vh] min-h-[220px] md:h-[22rem] w-full bg-gray-100">
        {restaurant.images?.[0] ? (
          <Image
            src={restaurant.images[0]}
            alt={restaurant.name}
            fill
            className="object-cover object-center"
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

          <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
            {restaurant.price_range ? (
              <span className="font-semibold text-[var(--brand-aruba)]">{restaurant.price_range}</span>
            ) : null}
            {restaurant.cuisine_types?.length ? (
              <span className="text-gray-500">{restaurant.cuisine_types.join(" • ")}</span>
            ) : null}
          </div>

          {restaurant.total_reviews > 0 ? (
            <p className="text-gray-700 mb-6">
              <span className="font-semibold text-gray-900">{Number(restaurant.average_rating).toFixed(1)}</span>
              <span className="text-gray-500"> / 5 </span>
              <span className="text-gray-500">({restaurant.total_reviews} reviews)</span>
            </p>
          ) : null}

          <div className="prose prose-gray max-w-none mb-10">
            <p className="text-lg text-gray-700 whitespace-pre-wrap">{restaurant.description}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 space-y-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Location</h2>
              {locationLines.length > 0 ? (
                <div className="space-y-1 text-gray-800">
                  {locationLines.map((line, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <Icon name="map-pin" className="w-5 h-5 shrink-0 mt-0.5 text-[var(--brand-aruba)]" />
                      <span>{line}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Address not on file.</p>
              )}
              <a
                href={directionsHref(restaurant)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-[var(--brand-aruba)] hover:bg-gray-100 transition-colors"
              >
                <Icon name="map-pin" className="w-4 h-4" />
                Directions
              </a>
            </div>

            {hasContactFields ? (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Contact</h2>
                <ul className="space-y-3 text-gray-800">
                  {restaurant.contact_info?.phone ? (
                    <li>
                      <a
                        href={`tel:${String(restaurant.contact_info.phone).replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 hover:text-[var(--brand-aruba)]"
                      >
                        <Icon name="phone" className="w-5 h-5 shrink-0 text-[var(--brand-aruba)]" />
                        {restaurant.contact_info.phone}
                      </a>
                    </li>
                  ) : null}
                  {restaurant.contact_info?.email ? (
                    <li>
                      <a
                        href={`mailto:${restaurant.contact_info.email}`}
                        className="inline-flex items-center gap-2 hover:text-[var(--brand-aruba)] break-all"
                      >
                        <Icon name="envelope" className="w-5 h-5 shrink-0 text-[var(--brand-aruba)]" />
                        {restaurant.contact_info.email}
                      </a>
                    </li>
                  ) : null}
                  {websiteHref ? (
                    <li>
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-[var(--brand-aruba)] break-all"
                      >
                        <Icon name="globe-alt" className="w-5 h-5 shrink-0 text-[var(--brand-aruba)]" />
                        {websiteHref}
                      </a>
                    </li>
                  ) : websiteRaw ? (
                    <li className="text-gray-500 text-sm">Website on file could not be opened as a link.</li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {hasMenuBlock ? (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Menu</h2>
                <ul className="space-y-3 text-gray-800">
                  {menuLinkHref ? (
                    <li>
                      <a
                        href={menuLinkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-[var(--brand-aruba)] break-all font-medium"
                      >
                        <Icon name="document-text" className="w-5 h-5 shrink-0 text-[var(--brand-aruba)]" />
                        View menu (web or PDF)
                      </a>
                    </li>
                  ) : menuUrlRaw ? (
                    <li className="text-gray-500 text-sm">Menu link on file could not be opened as a URL.</li>
                  ) : null}
                  {menuImageHref ? (
                    <li>
                      <a
                        href={menuImageHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-col gap-2 hover:opacity-90 max-w-full"
                      >
                        <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                          <Icon name="document-text" className="w-5 h-5 shrink-0 text-[var(--brand-aruba)]" />
                          Menu photo — open full size
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={menuImageHref}
                          alt={`Menu for ${restaurant.name}`}
                          className="max-h-72 w-full max-w-md rounded-xl border border-gray-200 bg-white object-contain"
                        />
                      </a>
                    </li>
                  ) : menuImageRaw ? (
                    <li className="text-gray-500 text-sm">Menu image URL could not be opened as a link.</li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {hoursNormalized ? (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Operating hours</h2>
                <ul className="space-y-2">
                  {DAY_ORDER.map((dayKey) => {
                    const display = dayHoursDisplay(hoursNormalized[dayKey]);
                    return (
                      <li key={dayKey} className="flex justify-between gap-4 text-sm">
                        <span className="font-medium text-gray-800">{DAY_LABELS[dayKey]}</span>
                        <span className={display === "Closed" ? "text-red-600" : "text-gray-600"}>{display}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <SocialLinks
              facebookUrl={restaurant.facebook_url}
              instagramUrl={restaurant.instagram_url}
              tiktokUrl={restaurant.tiktok_url}
            />
          </div>
        </article>
      </Container>

      {showStickyLinks ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              <p className="text-sm text-gray-600 min-w-[10rem] flex-1">Quick links open in a new tab.</p>
              <div className="flex flex-wrap justify-end gap-2 shrink-0">
                {menuLinkHref ? (
                  <a
                    href={menuLinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 bg-[var(--brand-aruba)] text-white rounded-xl font-semibold hover:bg-[var(--brand-aruba-dark)] transition-colors"
                  >
                    Menu
                  </a>
                ) : null}
                {menuImageHref ? (
                  <a
                    href={menuImageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold border-2 border-[var(--brand-aruba)] text-[var(--brand-aruba)] hover:bg-gray-50 transition-colors"
                  >
                    Menu photo
                  </a>
                ) : null}
                {websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Website
                  </a>
                ) : null}
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
