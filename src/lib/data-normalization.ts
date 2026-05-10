// Utility functions to normalize data from API responses
// Ensures consistent data structure across all content types

/** Keep only usable remote image URLs (Postgres text[] or JSON string). */
export function coerceImageUrls(raw: unknown): string[] {
  if (raw == null || raw === "") return [];
  let list: unknown[] = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    if (t.startsWith("[")) {
      try {
        const p = JSON.parse(t);
        if (Array.isArray(p)) list = p;
        else if (typeof p === "string") list = [p];
        else list = [];
      } catch {
        list = [t];
      }
    } else {
      list = [t];
    }
  } else {
    return [];
  }
  return list
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));
}

export function normalizeTours(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    duration: item.duration || '',
    price: item.price || '',
    location: item.location || '',
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    featured: item.featured || false,
    category: item.category || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    code_snippet: item.code_snippet || '',
    booking_url: item.code_snippet || '',
  }));
}

export function normalizeCulturalEvents(data: any[]): any[] {
  return data.map((item) => ({
    id: String(item.id), // Convert to string since cultural_events uses SERIAL (integer) IDs
    title: item.title || '',
    description: item.description || '',
    location: item.location || '',
    start_date: item.start_date || '',
    end_date: item.end_date || '',
    start_time: item.start_time || '',
    end_time: item.end_time || '',
    price: (() => {
      if (item.price == null || item.price === '') return null;
      const n = Number(item.price);
      return Number.isFinite(n) ? n : null;
    })(),
    images: coerceImageUrls(item.images),
    is_featured: item.is_featured || false,
    category_id: item.category_id || null,
    code_snippet: item.code_snippet || '',
    booking_url: (item.booking_url && String(item.booking_url).trim()) || '',
    cultural_significance: item.cultural_significance || '',
    event_type: item.event_type || '',
    currency: item.currency || 'USD',
  }));
}

export function normalizeLocalExperiences(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    duration: item.duration || '',
    price: item.price || '',
    location: item.location || '',
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    featured: item.featured || false,
    category: item.category || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    code_snippet: item.code_snippet || '',
    booking_url: item.code_snippet || '',
  }));
}

export function normalizeRestaurants(data: any[]): any[] {
  return data.map((item) => {
    let operating_hours = item.operating_hours;
    if (typeof operating_hours === 'string') {
      try {
        operating_hours = JSON.parse(operating_hours);
      } catch {
        operating_hours = {};
      }
    }
    if (!operating_hours || typeof operating_hours !== 'object') {
      operating_hours = {};
    }

    const baseContact =
      item.contact_info && typeof item.contact_info === 'object' ? { ...item.contact_info } : {};
    const contact_info = {
      phone: baseContact.phone || item.phone || '',
      website: baseContact.website || item.website || '',
      email: baseContact.email || item.email || '',
      address: baseContact.address || item.address || '',
    };

    const location_name = item.location_name || '';
    const address = item.address || contact_info.address || '';
    const location =
      item.location || location_name || address || contact_info.address || '';

    return {
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      cuisine_types: Array.isArray(item.cuisine_types)
        ? item.cuisine_types
        : item.cuisine_types
          ? [item.cuisine_types]
          : [],
      price_range: item.price_range || '',
      location,
      location_name,
      address,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      images: Array.isArray(item.images) ? item.images : item.images ? [item.images] : [],
      featured: item.featured || false,
      contact_info,
      operating_hours,
      average_rating: Number(item.average_rating ?? item.rating ?? 0) || 0,
      total_reviews: Number(item.total_reviews ?? 0) || 0,
      code_snippet: item.code_snippet || '',
      menu_url: (item.menu_url && String(item.menu_url).trim()) || '',
      menu_image_url: (item.menu_image_url && String(item.menu_image_url).trim()) || '',
    };
  });
}

export function normalizeTransportation(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    type: item.type || '',
    location: item.location || '',
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    featured: item.featured || false,
    contact_info: item.contact_info || {},
    pricing_info: item.pricing_info || {},
    code_snippet: item.code_snippet || '',
    booking_url: item.code_snippet || '',
  }));
}

export function normalizeSupportLocals(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    category: item.category || '',
    location: item.location || '',
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    featured: item.featured || false,
    contact_info: item.contact_info || {},
    website: item.website || '',
    code_snippet: item.code_snippet || '',
  }));
}

export function normalizePhotoChallenges(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    difficulty: item.difficulty || '',
    category: item.category || '',
    location: item.location || '',
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    featured: item.featured || false,
    points: item.points || 50,
    code_snippet: item.code_snippet || '',
  }));
}

const YMD = /^(\d{4})-(\d{2})-(\d{2})/;

/** Format Postgres `date` / ISO date prefix without UTC midnight shift. */
export function formatCulturalCalendarDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const m = YMD.exec(String(dateStr).trim());
  if (!m) {
    try {
      return new Date(String(dateStr)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  }
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatCulturalTime(timeStr?: string | null): string {
  if (!timeStr) return "";
  try {
    const [hours, minutes] = String(timeStr).split(":");
    const hour = parseInt(hours, 10);
    if (Number.isNaN(hour)) return String(timeStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const m = minutes?.slice(0, 2) ?? "00";
    return `${displayHour}:${m} ${ampm}`;
  } catch {
    return String(timeStr);
  }
}

