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
  details?: any;
}

// Map Express API endpoints to Supabase Edge Functions
function mapEndpointToSupabaseFunction(endpoint: string): string {
  if (!USE_SUPABASE_EDGE_FUNCTIONS) {
    return endpoint;
  }

  // Auth endpoints
  if (endpoint === '/auth/login') {
    return '/admin-auth';
  }

  // Dashboard analytics
  if (endpoint.startsWith('/admin/analytics/website/overview')) {
    return '/admin-dashboard';
  }

  // Content management (tours, events, experiences, restaurants, etc.)
  const contentTypes = ['tours', 'cultural-events', 'local-experiences', 'restaurants', 'transportation', 'support-locals', 'photo-challenges'];
  for (const type of contentTypes) {
    if (endpoint.startsWith(`/admin/${type}`)) {
      // Extract the rest of the path (e.g., /123 or empty)
      const rest = endpoint.replace(`/admin/${type}`, '');
      // Pass content type in the path for the Edge Function
      return `/admin-content/${type}${rest}`;
    }
  }

  // Map locations
  if (endpoint.startsWith('/admin/map-locations')) {
    return endpoint.replace('/admin/map-locations', '/admin-map-locations');
  }

  // Client profiles
  if (endpoint.startsWith('/admin/clients')) {
    return endpoint.replace('/admin/clients', '/admin-clients');
  }

  // Default: return as-is (for endpoints not yet migrated)
  return endpoint;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('authToken');
  
  // Check if token exists
  if (!token || token === 'mock-token-for-demo') {
    return {
      success: false,
      error: 'Authentication required. Please log in.',
      details: { 
        type: 'AuthError',
        message: 'No valid authentication token found. Please log in to access admin features.'
      },
    };
  }
  
  // Map endpoint to Supabase function if using Edge Functions
  const mappedEndpoint = mapEndpointToSupabaseFunction(endpoint);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add Supabase API key for Edge Functions
  // Supabase Edge Functions require both apikey and Authorization headers
  if (USE_SUPABASE_EDGE_FUNCTIONS) {
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (supabaseAnonKey) {
      headers['apikey'] = supabaseAnonKey;
      // Also send as Authorization Bearer token (required by Supabase Edge Functions)
      // Only set if not already set by token above
      if (!headers['Authorization']) {
        headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
      }
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${mappedEndpoint}`, {
      ...options,
      headers,
    });

    // Read response as text first (we can only read the body once)
    const text = await response.text();
    
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    
    // Also check if the response looks like HTML (common when backend isn't running)
    const trimmedText = text.trim();
    const looksLikeHtml = trimmedText.startsWith('<!DOCTYPE') || 
                         trimmedText.startsWith('<html') || 
                         trimmedText.startsWith('<!') ||
                         trimmedText.toLowerCase().startsWith('<body');
    
    // Check for empty response
    const isEmpty = trimmedText.length === 0;
    
    // Try to detect if it might be JSON even without proper content-type
    const mightBeJson = !looksLikeHtml && !isEmpty && (
      trimmedText.startsWith('{') || 
      trimmedText.startsWith('[') ||
      trimmedText.startsWith('"')
    );

    // If it looks like JSON but content-type is wrong, try parsing it anyway
    if (mightBeJson && !isJson && !looksLikeHtml && !isEmpty) {
      console.warn('Response looks like JSON but Content-Type is not set correctly. Attempting to parse...');
      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          return {
            success: false,
            error: data.error || `Request failed: ${response.status} ${response.statusText}`,
            details: data.details,
          };
        }
        return data;
      } catch (parseError) {
        // Fall through to error handling below
        console.warn('Failed to parse as JSON despite looking like JSON:', parseError);
      }
    }
    
    if (!isJson || looksLikeHtml || isEmpty) {
      // Build error details with explicit values to avoid serialization issues
      const status = response.status;
      const statusText = response.statusText;
      const url = `${API_BASE_URL}${endpoint}`;
      const method = options.method || 'GET';
      const textLength = text.length;
      const preview = text.substring(0, 500);
      
      // Safely get headers
      let allHeaders: Record<string, string> = {};
      try {
        allHeaders = Object.fromEntries(response.headers.entries());
      } catch (e) {
        allHeaders = { error: 'Could not read headers' };
      }
      
      // Log each property individually for better debugging
      console.error('=== Non-JSON Response Error ===');
      console.error('Status:', status);
      console.error('Status Text:', statusText);
      console.error('Content-Type:', contentType || '(not set)');
      console.error('URL:', url);
      console.error('Method:', method);
      console.error('Response Length:', textLength);
      console.error('Is Empty:', isEmpty);
      console.error('Looks Like HTML:', looksLikeHtml);
      console.error('Is JSON:', isJson);
      console.error('Response Preview:', preview);
      console.error('All Headers:', JSON.stringify(allHeaders, null, 2));
      console.error('Full Response Text:', text);
      console.error('=============================');
      
      const errorDetails = {
        status,
        statusText,
        contentType: contentType || '(not set)',
        url,
        method,
        textLength,
        isEmpty,
        looksLikeHtml,
        isJson,
        preview,
        allHeaders,
      };
      
      let errorMessage: string;
      if (isEmpty) {
        errorMessage = `Backend server returned empty response (${status} ${statusText}). The endpoint may not be implemented or there's a server error. Check backend logs.`;
      } else if (looksLikeHtml) {
        errorMessage = `Backend server returned HTML instead of JSON (${status} ${statusText}). This usually means the backend server is not running or the endpoint doesn't exist. Make sure the backend server is running at ${API_BASE_URL}`;
      } else {
        errorMessage = `Backend server returned non-JSON response (${status} ${statusText}). Content-Type: ${contentType || '(not set)'}. Response preview: ${preview.substring(0, 100)}...`;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
      };
    }

    // Parse JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('JSON parse error:', {
        error: jsonError,
        status: response.status,
        statusText: response.statusText,
        contentType,
        url: `${API_BASE_URL}${endpoint}`,
        preview: text.substring(0, 200),
      });
      
      return {
        success: false,
        error: `Backend server returned invalid JSON. Make sure the backend server is running at ${API_BASE_URL}`,
        details: { 
          status: response.status, 
          contentType, 
          preview: text.substring(0, 200),
          parseError: jsonError instanceof Error ? jsonError.message : String(jsonError),
        },
      };
    }

    if (!response.ok) {
      // Handle 401/403 errors specifically
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        return {
          success: false,
          error: data.error || 'Authentication failed. Please log in again.',
          details: {
            ...data.details,
            type: 'AuthError',
            status: response.status,
            requiresLogin: true,
          },
        };
      }
      
      return {
        success: false,
        error: data.error || `Request failed: ${response.status} ${response.statusText}`,
        details: data.details,
      };
    }

    return data;
  } catch (error) {
    console.error('=== API Request Failed (Catch Block) ===');
    console.error('Error Type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error Message:', error instanceof Error ? error.message : String(error));
    console.error('Error Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('Endpoint:', `${API_BASE_URL}${endpoint}`);
    console.error('Options:', JSON.stringify(options, null, 2));
    console.error('========================================');
    
    // Check if it's a network error (backend not running)
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        return {
          success: false,
          error: `Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend server is running and accessible.`,
          details: { 
            originalError: error.message,
            endpoint: `${API_BASE_URL}${endpoint}`,
            type: 'NetworkError'
          },
        };
      }
    }
    
    // Check if it's a JSON parse error (shouldn't happen here, but just in case)
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return {
        success: false,
        error: `Backend server is not responding correctly. Make sure the backend server is running at ${API_BASE_URL}`,
        details: { 
          originalError: error.message,
          endpoint: `${API_BASE_URL}${endpoint}`,
          type: 'ParseError'
        },
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown network error',
      details: {
        originalError: String(error),
        endpoint: `${API_BASE_URL}${endpoint}`,
        type: 'UnknownError'
      },
    };
  }
}

// Client Profile API
export const clientProfileApi = {
  // Get all clients
  getClients: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    featured?: boolean;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiRequest(`/admin/clients${query ? `?${query}` : ''}`);
  },

  // Get client by ID
  getClient: async (id: string) => {
    return apiRequest(`/admin/clients/${id}`);
  },

  // Create client
  createClient: async (client: {
    name: string;
    description?: string;
    logo_url?: string;
    photos?: string[];
    category?: string;
    contact_info?: Record<string, any>;
    status?: 'active' | 'inactive' | 'pending';
    featured?: boolean;
    display_order?: number;
    metadata?: Record<string, any>;
  }) => {
    return apiRequest('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },

  // Update client
  updateClient: async (id: string, updates: Partial<{
    name: string;
    description: string;
    logo_url: string;
    photos: string[];
    category: string;
    contact_info: Record<string, any>;
    status: 'active' | 'inactive' | 'pending';
    featured: boolean;
    display_order: number;
    metadata: Record<string, any>;
  }>) => {
    return apiRequest(`/admin/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  },

  // Delete client
  deleteClient: async (id: string) => {
    return apiRequest(`/admin/clients/${id}`, {
      method: 'DELETE',
    });
  },

  // Get version history
  getVersions: async (id: string) => {
    return apiRequest(`/admin/clients/${id}/versions`);
  },
};

// Website Analytics API
export const websiteAnalyticsApi = {
  // Get overview
  getOverview: async (timeRange?: '7d' | '30d' | '90d') => {
    const query = timeRange ? `?timeRange=${timeRange}` : '';
    return apiRequest(`/admin/analytics/website/overview${query}`);
  },

  // Get traffic metrics
  getTrafficMetrics: async (params?: {
    timeRange?: '7d' | '30d' | '90d';
    groupBy?: 'hour' | 'day' | 'week';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    if (params?.groupBy) queryParams.append('groupBy', params.groupBy);
    const query = queryParams.toString();
    return apiRequest(`/admin/analytics/website/traffic${query ? `?${query}` : ''}`);
  },

  // Get popular pages
  getPopularPages: async (params?: {
    timeRange?: '7d' | '30d' | '90d';
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return apiRequest(`/admin/analytics/website/pages${query ? `?${query}` : ''}`);
  },

  // Get visitor analytics
  getVisitorAnalytics: async (timeRange?: '7d' | '30d' | '90d') => {
    const query = timeRange ? `?timeRange=${timeRange}` : '';
    return apiRequest(`/admin/analytics/website/visitors${query}`);
  },

  // Get conversion funnels
  getConversionFunnels: async (params?: {
    timeRange?: '7d' | '30d' | '90d';
    conversionGoal?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    if (params?.conversionGoal) queryParams.append('conversionGoal', params.conversionGoal);
    const query = queryParams.toString();
    return apiRequest(`/admin/analytics/website/conversions${query ? `?${query}` : ''}`);
  },

  // Export analytics
  exportAnalytics: async (params?: {
    format?: 'json' | 'csv';
    timeRange?: '7d' | '30d' | '90d';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.format) queryParams.append('format', params.format);
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    const query = queryParams.toString();
    return apiRequest(`/admin/analytics/website/export${query ? `?${query}` : ''}`);
  },

  // Track event
  trackEvent: async (event: {
    session_id: string;
    event_type: string;
    page_url: string;
    event_category?: string;
    event_action?: string;
    event_label?: string;
    event_value?: number;
    page_title?: string;
    referrer?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    country?: string;
    city?: string;
    custom_properties?: Record<string, any>;
    conversion_funnel_step?: string;
    conversion_goal?: string;
  }) => {
    return apiRequest('/admin/analytics/website/track', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },
};

// Content Sync API
export const contentSyncApi = {
  // Get latest version
  getLatestVersion: async () => {
    return apiRequest('/sync/content/version');
  },

  // Get changes since version
  getChangesSince: async (sinceVersion: string) => {
    return apiRequest(`/sync/content/changes?sinceVersion=${sinceVersion}`);
  },

  // Get clients (for mobile app)
  getClients: async () => {
    return apiRequest('/sync/clients');
  },

  // Acknowledge sync
  acknowledgeSync: async (version: string) => {
    return apiRequest('/sync/content/acknowledge', {
      method: 'POST',
      body: JSON.stringify({ version }),
    });
  },
};

// Helper function to create content API
function createContentApi(type: string) {
  return {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      category?: string;
      featured?: boolean;
      active?: boolean;
      search?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      if (params?.search) queryParams.append('search', params.search);

      const query = queryParams.toString();
      return apiRequest(`/admin/${type}${query ? `?${query}` : ''}`);
    },

    getById: async (id: string) => {
      return apiRequest(`/admin/${type}/${id}`);
    },

    create: async (data: any) => {
      return apiRequest(`/admin/${type}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, updates: any) => {
      return apiRequest(`/admin/${type}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ id, ...updates }),
      });
    },

    delete: async (id: string) => {
      return apiRequest(`/admin/${type}/${id}`, {
        method: 'DELETE',
      });
    },
  };
}

// Content Management APIs
export const toursApi = createContentApi('tours');
export const culturalEventsApi = createContentApi('cultural-events');
export const localExperiencesApi = createContentApi('local-experiences');
export const transportationApi = createContentApi('transportation');
export const supportLocalsApi = createContentApi('support-locals');
export const restaurantsApi = createContentApi('restaurants');
export const photoChallengesApi = createContentApi('photo-challenges');

// Map Locations API
export const mapLocationsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: 'beach' | 'cultural_spot' | 'natural_wonder' | 'restaurant' | 'local_shop' | 'club_bar' | 'hotel' | 'activity';
    featured?: boolean;
    active?: boolean;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiRequest(`/admin/map-locations${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/admin/map-locations/${id}`);
  },

  create: async (data: {
    name: string;
    description?: string;
    category: 'beach' | 'cultural_spot' | 'natural_wonder' | 'restaurant' | 'local_shop' | 'club_bar' | 'hotel' | 'activity';
    images?: string[];
    location?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    contact_info?: Record<string, any>;
    opening_hours?: Record<string, any>;
    featured?: boolean;
    active?: boolean;
    display_order?: number;
  }) => {
    return apiRequest('/admin/map-locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, updates: Partial<{
    name: string;
    description: string;
    category: 'beach' | 'cultural_spot' | 'natural_wonder' | 'restaurant' | 'local_shop' | 'club_bar' | 'hotel' | 'activity';
    images: string[];
    location: string;
    latitude: number;
    longitude: number;
    address: string;
    contact_info: Record<string, any>;
    opening_hours: Record<string, any>;
    featured: boolean;
    active: boolean;
    display_order: number;
  }>) => {
    return apiRequest(`/admin/map-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/admin/map-locations/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  clientProfileApi,
  websiteAnalyticsApi,
  contentSyncApi,
  toursApi,
  culturalEventsApi,
  localExperiencesApi,
  transportationApi,
  supportLocalsApi,
  restaurantsApi,
  photoChallengesApi,
  mapLocationsApi,
};

