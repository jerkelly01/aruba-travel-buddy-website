// Simple in-memory cache for API data
// This provides instant loading for tours, experiences, and other content

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${endpoint}${paramStr}`;
  }

  get<T>(endpoint: string, params?: Record<string, any>): T | null {
    const key = this.getCacheKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(endpoint: string, data: T, params?: Record<string, any>, ttl?: number): void {
    const key = this.getCacheKey(endpoint, params);
    const now = Date.now();
    const expiresAt = now + (ttl || this.DEFAULT_TTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  clear(endpoint?: string): void {
    if (endpoint) {
      // Clear all entries matching this endpoint
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(endpoint)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  // Prefetch data (non-blocking)
  async prefetch<T>(
    endpoint: string,
    fetcher: () => Promise<T>,
    params?: Record<string, any>
  ): Promise<void> {
    const key = this.getCacheKey(endpoint, params);
    
    // Don't prefetch if already cached and not expired
    const existing = this.cache.get(key);
    if (existing && Date.now() < existing.expiresAt) {
      return;
    }

    // Fetch in background
    fetcher().then((data) => {
      this.set(endpoint, data, params);
    }).catch((error) => {
      console.error(`[DataCache] Prefetch failed for ${endpoint}:`, error);
    });
  }
}

// Singleton instance
export const dataCache = new DataCache();
