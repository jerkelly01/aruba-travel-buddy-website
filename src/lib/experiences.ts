"use client";

import * as React from "react";

export interface Experience {
  id: string;
  slug: string;
  title: string;
  duration: string;
  price: string;
  image: string; // public path
  tags: string[];
  active: boolean;
}

export const LS_KEY = "experiences";

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: "e1",
    slug: "natural-pool-adventure",
    title: "Natural Pool Adventure",
    duration: "4 hours",
    price: "$89",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Adventure", "Nature"],
    active: true,
  },
  {
    id: "e2",
    slug: "baby-beach-snorkeling",
    title: "Baby Beach Snorkeling",
    duration: "3 hours",
    price: "$65",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Family", "Snorkeling"],
    active: true,
  },
  {
    id: "e3",
    slug: "sunset-catamaran",
    title: "Sunset Catamaran Cruise",
    duration: "2.5 hours",
    price: "$95",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Sunset", "Romantic"],
    active: true,
  },
  {
    id: "e4",
    slug: "aruba-culture-tour",
    title: "Authentic Aruban Culture Tour",
    duration: "3 hours",
    price: "$75",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Culture", "Local"],
    active: true,
  },
  {
    id: "e5",
    slug: "divi-divi-tree-photography",
    title: "Divi Divi Tree Photography Tour",
    duration: "2 hours",
    price: "$45",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Photography", "Nature"],
    active: true,
  },
  {
    id: "e6",
    slug: "local-cooking-class",
    title: "Traditional Aruban Cooking Class",
    duration: "3.5 hours",
    price: "$85",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Cooking", "Cultural"],
    active: true,
  },
  {
    id: "e7",
    slug: "aruba-heritage-walk",
    title: "Oranjestad Heritage Walking Tour",
    duration: "2 hours",
    price: "$35",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["History", "Walking"],
    active: true,
  },
  {
    id: "e8",
    slug: "butterfly-farm-visit",
    title: "Butterfly Farm Experience",
    duration: "1.5 hours",
    price: "$25",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Family", "Nature"],
    active: true,
  },
  {
    id: "e9",
    slug: "aruba-wine-tasting",
    title: "Aruba Wine & Sunset Tasting",
    duration: "2.5 hours",
    price: "$120",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Wine", "Sunset", "Luxury"],
    active: true,
  },
  {
    id: "e10",
    slug: "jeep-safari-adventure",
    title: "Aruba Jeep Safari Adventure",
    duration: "5 hours",
    price: "$110",
    image: "/ChatGPT Image Oct 16, 2025 at 09_43_31 PM copy.png",
    tags: ["Adventure", "Off-road", "Exploration"],
    active: true,
  },
];

export function getExperiencesFromStorage(): Experience[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Experience[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useExperiences(): Experience[] {
  const [data, setData] = React.useState<Experience[]>(DEFAULT_EXPERIENCES);

  React.useEffect(() => {
    const stored = getExperiencesFromStorage();
    if (stored) setData(stored);
  }, []);

  return data;
}
