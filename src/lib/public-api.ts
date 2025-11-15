// Public API for fetching content (no authentication required)
// Use Supabase Edge Functions if SUPABASE_URL is set, otherwise fall back to Express API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
const EXPRESS_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Determine which API to use
const USE_SUPABASE_EDGE_FUNCTIONS = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_BASE_URL = USE_SUPABASE_EDGE_FUNCTIONS 
  ? `${SUPABASE_URL}/functions/v1` 
  : EXPRESS_API_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Public API request (no authentication required)
async function publicApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Map endpoint to Supabase function if using Edge Functions
  // e.g., /api/tours -> /admin-content/tours
  let mappedEndpoint = endpoint;
  if (USE_SUPABASE_EDGE_FUNCTIONS) {
    const contentTypes = ['tours', 'cultural-events', 'local-experiences', 'restaurants', 'car-rentals', 'gear-rentals', 'transportation', 'support-locals', 'photo-challenges'];
    for (const type of contentTypes) {
      if (endpoint.startsWith(`/api/${type}`)) {
        mappedEndpoint = endpoint.replace(`/api/${type}`, `/admin-content/${type}`);
        break;
      }
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add Supabase API key for Edge Functions (anon key for public access)
  // Supabase Edge Functions require both apikey and Authorization headers for public access
  if (USE_SUPABASE_EDGE_FUNCTIONS) {
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (supabaseAnonKey) {
      headers['apikey'] = supabaseAnonKey;
      // Also add Authorization header with anon key for public access (Supabase requirement)
      headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
    } else {
      console.warn('[Public API] NEXT_PUBLIC_SUPABASE_ANON_KEY not set - requests may fail');
    }
  }

  try {
    const fullUrl = `${API_BASE_URL}${mappedEndpoint}`;
    console.log('[Public API] Request:', { endpoint, mappedEndpoint, fullUrl, useEdgeFunctions: USE_SUPABASE_EDGE_FUNCTIONS });
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log('[Public API] Response status:', response.status, response.statusText);
    
    const text = await response.text();
    console.log('[Public API] Response text (first 500 chars):', text.substring(0, 500));
    
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!isJson && text.trim()) {
      console.error('[Public API] Non-JSON response:', text);
      return {
        success: false,
        error: `Server returned non-JSON response: ${response.status} ${response.statusText}`,
      };
    }

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (jsonError) {
      console.error('[Public API] JSON parse error:', jsonError, 'Text:', text);
      return {
        success: false,
        error: 'Invalid JSON response from server',
      };
    }

    console.log('[Public API] Parsed data:', { success: data.success, hasData: !!data.data, dataType: typeof data.data });

    if (!response.ok) {
      console.error('[Public API] Request failed:', { status: response.status, data });
      return {
        success: false,
        error: data.error || `Request failed: ${response.status} ${response.statusText}`,
      };
    }

    // Edge Functions return { success: true, data: [...] }
    // Extract the data from the response
    const responseData = data.success && data.data ? data.data : data;
    
    console.log('[Public API] Final response data:', { 
      isArray: Array.isArray(responseData), 
      length: Array.isArray(responseData) ? responseData.length : 'N/A',
      firstItem: Array.isArray(responseData) && responseData.length > 0 ? responseData[0] : null
    });
    
    return { success: true, data: responseData };
  } catch (error) {
    console.error('[Public API] Request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Public content APIs (for public-facing pages)
export const publicToursApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/tours${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/tours/${id}`);
  },
};

export const publicCulturalEventsApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/cultural-events${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/cultural-events/${id}`);
  },
};

export const publicLocalExperiencesApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/local-experiences${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/local-experiences/${id}`);
  },
};

export const publicRestaurantsApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/restaurants${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/restaurants/${id}`);
  },
};

export const publicCarRentalsApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/car-rentals${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/car-rentals/${id}`);
  },
};

export const publicGearRentalsApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/gear-rentals${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/gear-rentals/${id}`);
  },
};

export const publicTransportationApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean; type?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.type) queryParams.append('type', params.type);
    const query = queryParams.toString();
    return publicApiRequest(`/api/transportation${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/transportation/${id}`);
  },
};

export const publicSupportLocalsApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/support-locals${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/support-locals/${id}`);
  },
};

export const publicPhotoChallengesApi = {
  getAll: async (params?: { active?: boolean; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    const query = queryParams.toString();
    return publicApiRequest(`/api/photo-challenges${query ? `?${query}` : ''}`);
  },
  getById: async (id: string) => {
    return publicApiRequest(`/api/photo-challenges/${id}`);
  },
};

