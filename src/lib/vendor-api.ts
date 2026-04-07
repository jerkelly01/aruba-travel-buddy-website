'use client';

/**
 * Client-side helpers for vendor ↔ Supabase communication.
 *
 * All calls route through the vendor-availability Edge Function.
 * Falls back gracefully (returns nulls / empty arrays) when Supabase is
 * unreachable or the vendor hasn't connected a business profile yet.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BASE = `${SUPABASE_URL}/functions/v1/vendor-availability`;

export interface VendorSlot {
  time: string;
  available: boolean;
  remaining_slots: number;
  max_capacity: number;
  used_capacity: number;
}

export interface SlotsResponse {
  is_available: boolean;
  reason?: string;
  slots: VendorSlot[];
  settings?: VendorSchedule;
}

export interface VendorSchedule {
  open_time: string;
  close_time: string;
  interval_minutes: number;
  max_guests_per_slot: number;
  slot_padding: number;
}

export interface EntityProfile {
  entity_type: string; // 'restaurant' | 'tour' | 'experience' | 'transportation'
  entity_id: string;   // UUID
  entity_name: string; // Display name
}

// ── Auth headers ──────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
  };
}

// ── Safe fetch wrapper ────────────────────────────────────────────────────────

async function safeFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.warn('[vendor-api] HTTP', res.status, url);
      return null;
    }
    const json = await res.json();
    // Edge Functions wrap responses in { success, data }
    return (json?.data ?? json) as T;
  } catch (e) {
    console.warn('[vendor-api] fetch error', e);
    return null;
  }
}

// ── Public: fetch available slots for an entity on a given date ───────────────
// Called by the customer-facing app booking screen.

export async function fetchSlots(
  entity_type: string,
  entity_id: string,
  date: string
): Promise<SlotsResponse | null> {
  return safeFetch<SlotsResponse>(
    `${BASE}?entity_type=${entity_type}&entity_id=${encodeURIComponent(entity_id)}&date=${date}`,
    { headers: authHeaders() }
  );
}

// ── Vendor: save schedule settings ───────────────────────────────────────────

export async function saveVendorSettings(
  entity_type: string,
  entity_id: string,
  schedule: VendorSchedule
): Promise<boolean> {
  const result = await safeFetch<{ message: string }>(
    `${BASE}/settings`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ entity_type, entity_id, ...schedule }),
    }
  );
  return result !== null;
}

// ── Vendor: blocked dates ────────────────────────────────────────────────────

export async function fetchBlockedDates(
  entity_type: string,
  entity_id: string
): Promise<string[]> {
  const result = await safeFetch<{ blocked_dates: string[] }>(
    `${BASE}/blocked-dates?entity_type=${entity_type}&entity_id=${encodeURIComponent(entity_id)}`,
    { headers: authHeaders() }
  );
  return result?.blocked_dates ?? [];
}

export async function setBlockedDate(
  entity_type: string,
  entity_id: string,
  date: string,
  is_blocked: boolean
): Promise<void> {
  await safeFetch(
    `${BASE}/blocked-dates`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ entity_type, entity_id, date, is_blocked }),
    }
  );
}

// ── Vendor: bookings ─────────────────────────────────────────────────────────

export async function fetchVendorBookings(
  entity_type: string,
  entity_id: string
): Promise<any[]> {
  const result = await safeFetch<{ bookings: any[] }>(
    `${BASE}/bookings?entity_type=${entity_type}&entity_id=${encodeURIComponent(entity_id)}`,
    { headers: authHeaders() }
  );
  return result?.bookings ?? [];
}

export async function createWalkinBooking(data: {
  entity_type: string;
  entity_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  date: string;
  time?: string;
  party_size: number;
  notes?: string;
}): Promise<{ id: string; confirmation_code: string } | null> {
  const result = await safeFetch<{ booking: { id: string; confirmation_code: string } }>(
    `${BASE}/bookings`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }
  );
  return result?.booking ?? null;
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  await safeFetch(
    `${BASE}/bookings/${id}`,
    {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    }
  );
}
