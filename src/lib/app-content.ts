import type { IconName } from "@/components/Icon";
import { ICON_NAMES } from "@/components/Icon";

export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  highlights: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
};

export type AppContent = {
  title: string;
  description: string;
  downloadUrl: string;
  features: FeatureItem[];
  gallery: GalleryItem[];
};

export const defaultAppContent: AppContent = {
  title: "Aruba Travel Buddy",
  description: "Your comprehensive travel companion for discovering authentic Aruba experiences, from hidden beaches to local culture and everything in between.",
  downloadUrl: "https://apps.apple.com",
  features: [
    {
      id: "ai-planner",
      title: "Itinerary Generator",
      description: "Get personalized itineraries that learn your preferences and adapt to weather conditions.",
      icon: "sparkles",
      highlights: [
        "Personalized day-by-day planning",
        "Weather-aware activity suggestions",
        "Real-time itinerary updates",
        "Share with friends instantly",
      ],
    },
    {
      id: "ar-navigation",
      title: "AR View & Discovery",
      description: "Explore Aruba with cutting-edge Augmented Reality navigation that shows you hidden gems and local spots in real-time.",
      icon: "academic-cap",
      highlights: [
        "Point your camera to discover places",
        "AR overlays with local information",
        "Interactive 3D landmarks",
        "Offline AR functionality",
      ],
    },
    {
      id: "offline-maps",
      title: "Offline Maps & Navigation",
      description: "Navigate Aruba without WiFi — complete offline maps with turn-by-turn directions and saved points of interest.",
      icon: "map-pin",
      highlights: [
        "Downloadable offline maps",
        "Turn-by-turn navigation",
        "Saved points of interest",
        "Traffic and route optimization",
      ],
    },
    {
      id: "local-experiences",
      title: "Authentic Local Experiences",
      description: "Connect with local hosts and discover authentic Aruban culture through curated experiences and meetups.",
      icon: "user-group",
      highlights: [
        "Local host experiences",
        "Cultural immersion activities",
        "Social meetups with travelers",
        "Community-driven recommendations",
      ],
    },
    {
      id: "cultural-events",
      title: "Cultural Events & Festivals",
      description: "Never miss local celebrations, concerts, and cultural events with our comprehensive event calendar.",
      icon: "calendar-days",
      highlights: [
        "Live event calendar",
        "Cultural festival information",
        "Local celebration details",
        "Event reminders and RSVP",
      ],
    },
    {
      id: "restaurant-recommendations",
      title: "Local Restaurant Guide",
      description: "Discover authentic Aruban cuisine with restaurant recommendations and real-time availability.",
      icon: "star",
      highlights: [
        "AI-curated restaurant suggestions",
        "Real-time availability checking",
        "Local cuisine insights",
        "Reservation management",
      ],
    },
    {
      id: "photo-challenges",
      title: "Photo Challenges & Memories",
      description: "Join photo challenges, share your Aruba memories, and connect with other travelers through visual storytelling.",
      icon: "trophy",
      highlights: [
        "Daily photo challenges",
        "Memory sharing platform",
        "Traveler community features",
        "Photo contest participation",
      ],
    },
    {
      id: "language-learning",
      title: "Papiamento & Culture Learning",
      description: "Learn the local language and immerse yourself in Aruban culture with interactive lessons and cultural insights.",
      icon: "academic-cap",
      highlights: [
        "Papiamento language lessons",
        "Cultural etiquette guide",
        "Local phrasebook",
        "Cultural immersion tips",
      ],
    },
    {
      id: "transportation",
      title: "Smart Transportation",
      description: "Navigate Aruba's transportation options with real-time routing, car rentals, and public transport information.",
      icon: "map-pin",
      highlights: [
        "Multi-modal route planning",
        "Car rental integration",
        "Public transport schedules",
        "Real-time traffic updates",
      ],
    },
    {
      id: "loyalty-rewards",
      title: "Loyalty Rewards Program",
      description: "Earn points and unlock exclusive benefits as you explore Aruba, with special rewards for supporting local businesses.",
      icon: "trophy",
      highlights: [
        "Points-based reward system",
        "Exclusive local discounts",
        "Special experience access",
        "Community recognition",
      ],
    },
    {
      id: "whatsapp-chatbot",
      title: "WhatsApp Travel Assistant",
      description: "Get instant help and recommendations through our intelligent WhatsApp chatbot, available 24/7.",
      icon: "chat",
      highlights: [
        "24/7 travel assistance",
        "Instant recommendations",
        "Booking support",
        "Multi-language support",
      ],
    },
    {
      id: "travel-insurance",
      title: "Travel Insurance Integration",
      description: "Secure your Aruba adventure with integrated travel insurance options and emergency assistance.",
      icon: "shield-check",
      highlights: [
        "Integrated insurance options",
        "Emergency assistance",
        "Coverage recommendations",
        "Claims support",
      ],
    },
  ],
  gallery: [
    {
      id: "eagle-beach",
      title: "Eagle Beach",
      location: "Eagle Beach",
      imageUrl: "https://images.unsplash.com/photo-1470219556762-1771e7f9427d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "palm-beach",
      title: "Palm Beach",
      location: "Palm Beach",
      imageUrl: "https://images.unsplash.com/photo-1526485797145-8bc2a4d14d07?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "natural-pool",
      title: "Natural Pool",
      location: "Conchi Natural Pool",
      imageUrl: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "oranjestad",
      title: "Oranjestad",
      location: "Oranjestad",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop",
    },
  ],
};

const ICON_NAME_SET = new Set<IconName>(ICON_NAMES);

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const isIconName = (value: unknown): value is IconName =>
  typeof value === "string" && ICON_NAME_SET.has(value as IconName);

const parseHighlights = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeHighlights = (value: unknown, fallback: string[]): string[] => {
  const parsed = parseHighlights(value);
  return parsed.length > 0 ? parsed : fallback;
};

const normalizeFeatures = (value: unknown): FeatureItem[] => {
  if (!Array.isArray(value)) {
    return defaultAppContent.features;
  }

  return value
    .map((item, index) => {
      const fallback = defaultAppContent.features[index] ?? defaultAppContent.features[0];

      if (typeof item === "string") {
        return {
          ...fallback,
          title: item,
        } satisfies FeatureItem;
      }

      if (!item || typeof item !== "object") {
        return fallback;
      }

      const candidate = item as Partial<FeatureItem> & { highlights?: unknown };

      return {
        id: isNonEmptyString(candidate.id) ? candidate.id : fallback.id,
        title: isNonEmptyString(candidate.title) ? candidate.title : fallback.title,
        description: isNonEmptyString(candidate.description)
          ? candidate.description
          : fallback.description,
        icon: isIconName(candidate.icon) ? candidate.icon : fallback.icon,
        highlights: normalizeHighlights(candidate.highlights ?? fallback.highlights, fallback.highlights),
      } satisfies FeatureItem;
    });
};

const normalizeGallery = (value: unknown): GalleryItem[] => {
  if (!Array.isArray(value)) {
    return defaultAppContent.gallery;
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return defaultAppContent.gallery[index] ?? null;
      }

      const candidate = item as Partial<GalleryItem>;
      const fallback = defaultAppContent.gallery[index] ?? defaultAppContent.gallery[0];

      return {
        id: isNonEmptyString(candidate.id) ? candidate.id : fallback.id,
        title: isNonEmptyString(candidate.title) ? candidate.title : fallback.title,
        location: isNonEmptyString(candidate.location) ? candidate.location : fallback.location,
        imageUrl: isNonEmptyString(candidate.imageUrl) ? candidate.imageUrl : fallback.imageUrl,
      } satisfies GalleryItem;
    })
    .filter((item): item is GalleryItem => item !== null);
};

export const normalizeAppContent = (value: unknown): AppContent => {
  if (!value || typeof value !== "object") {
    return defaultAppContent;
  }

  const candidate = value as Partial<AppContent>;

  return {
    title: isNonEmptyString(candidate.title) ? candidate.title : defaultAppContent.title,
    description: isNonEmptyString(candidate.description) ? candidate.description : defaultAppContent.description,
    downloadUrl: isNonEmptyString(candidate.downloadUrl) ? candidate.downloadUrl : defaultAppContent.downloadUrl,
    features: normalizeFeatures(candidate.features),
    gallery: normalizeGallery(candidate.gallery),
  } satisfies AppContent;
};

export const loadAppContent = (): AppContent => {
  if (typeof window === "undefined") {
    return defaultAppContent;
  }

  try {
    const stored = window.localStorage.getItem("appContent");
    if (!stored) {
      return defaultAppContent;
    }
    const parsed = JSON.parse(stored);
    return normalizeAppContent(parsed);
  } catch (error) {
    console.warn("Failed to load app content from storage", error);
    return defaultAppContent;
  }
};

export const saveAppContent = (content: AppContent) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem("appContent", JSON.stringify(content));
  } catch (error) {
    console.warn("Failed to persist app content", error);
  }
};
