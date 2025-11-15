// Utility functions to normalize data from API responses
// Ensures consistent data structure across all content types

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
    price: item.price || null,
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    is_featured: item.is_featured || false,
    category_id: item.category_id || null,
    code_snippet: item.code_snippet || '',
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
  }));
}

export function normalizeRestaurants(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    cuisine_types: Array.isArray(item.cuisine_types) ? item.cuisine_types : (item.cuisine_types ? [item.cuisine_types] : []),
    price_range: item.price_range || '',
    location: item.location || '',
    images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []),
    featured: item.featured || false,
    contact_info: item.contact_info || {},
    operating_hours: item.operating_hours || {},
    code_snippet: item.code_snippet || '',
  }));
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

