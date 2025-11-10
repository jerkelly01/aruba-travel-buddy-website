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
    if (endpoint.startsWith('/api/tours')) {
      mappedEndpoint = endpoint.replace('/api/tours', '/admin-content/tours');
    } else if (endpoint.startsWith('/api/cultural-events')) {
      mappedEndpoint = endpoint.replace('/api/cultural-events', '/admin-content/cultural-events');
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add Supabase API key for Edge Functions (anon key for public access)
  if (USE_SUPABASE_EDGE_FUNCTIONS) {
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (supabaseAnonKey) {
      headers['apikey'] = supabaseAnonKey;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${mappedEndpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!isJson && text.trim()) {
      return {
        success: false,
        error: `Server returned non-JSON response: ${response.status} ${response.statusText}`,
      };
    }

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (jsonError) {
      return {
        success: false,
        error: 'Invalid JSON response from server',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed: ${response.status} ${response.statusText}`,
      };
    }

    // Edge Functions return { success: true, data: [...] }
    // Extract the data from the response
    const responseData = data.success && data.data ? data.data : data;
    
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Public API request failed:', error);
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

