'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { websiteAnalyticsApi, toursApi, culturalEventsApi, localExperiencesApi, transportationApi, supportLocalsApi, restaurantsApi, photoChallengesApi, mapLocationsApi, clientProfileApi } from '@/lib/admin-api';

interface DashboardStats {
  totalVisitors: number;
  totalPageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  totalTours: number;
  totalEvents: number;
  totalExperiences: number;
  totalRestaurants: number;
  totalLocations: number;
  totalClients: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch analytics overview
      const analyticsResponse = await websiteAnalyticsApi.getOverview('30d');
      
      // Fetch counts for each content type
      const [toursRes, eventsRes, experiencesRes, restaurantsRes, locationsRes, clientsRes] = await Promise.all([
        toursApi.getAll({ limit: 1 }),
        culturalEventsApi.getAll({ limit: 1 }),
        localExperiencesApi.getAll({ limit: 1 }),
        restaurantsApi.getAll({ limit: 1 }),
        mapLocationsApi.getAll({ limit: 1 }),
        clientProfileApi.getClients({ limit: 1 }),
      ]);

      const analytics = analyticsResponse.success ? (analyticsResponse.data as any) : null;

      // Helper to extract count from response
      const getCount = (res: any) => {
        if (!res.success || !res.data) return 0;
        // Check for pagination.total
        if (res.data.pagination?.total !== undefined) return res.data.pagination.total;
        // Check if data is an array
        if (Array.isArray(res.data)) return res.data.length;
        // Check for items array
        if (Array.isArray(res.data.items)) return res.data.items.length;
        return 0;
      };

      setStats({
        totalVisitors: analytics?.totalVisitors || 0,
        totalPageViews: analytics?.totalPageViews || 0,
        bounceRate: analytics?.bounceRate || 0,
        avgSessionDuration: analytics?.avgSessionDuration || 0,
        totalTours: getCount(toursRes),
        totalEvents: getCount(eventsRes),
        totalExperiences: getCount(experiencesRes),
        totalRestaurants: getCount(restaurantsRes),
        totalLocations: getCount(locationsRes),
        totalClients: getCount(clientsRes),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set defaults if fetch fails
      setStats({
        totalVisitors: 0,
        totalPageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        totalTours: 0,
        totalEvents: 0,
        totalExperiences: 0,
        totalRestaurants: 0,
        totalLocations: 0,
        totalClients: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          <Link
            href="/admin/clients"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Client Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create and manage client profiles displayed in the app
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Clients →</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Website Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              Track website performance, visitors, and conversions
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">View Analytics →</span>
          </Link>
          <Link
            href="/admin/tours"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tours</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage tour packages and activities
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Tours →</span>
          </Link>
          <Link
            href="/admin/cultural-events"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Events</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage cultural events and festivals
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Events →</span>
          </Link>
          <Link
            href="/admin/local-experiences"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Local Experiences</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage local experiences and activities
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Experiences →</span>
          </Link>
          <Link
            href="/admin/transportation"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transportation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage car rentals and transportation options
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Transportation →</span>
          </Link>
          <Link
            href="/admin/support-locals"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Support Locals</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage local businesses and initiatives
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Locals →</span>
          </Link>
          <Link
            href="/admin/restaurants"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Restaurants</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage restaurant listings and information
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Restaurants →</span>
          </Link>
          <Link
            href="/admin/photo-challenges"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Photo Challenges</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage user photo challenge prompts
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Challenges →</span>
          </Link>
          <Link
            href="/admin/map-locations"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Map Locations</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage locations for the explore map (beaches, spots, etc.)
            </p>
            <span className="text-[var(--brand-aruba)] font-semibold">Manage Map Locations →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Stats Cards - Real Data */}
          {loading ? (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Loading...</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">-</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Loading...</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">-</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Loading...</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">-</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Loading...</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">-</div>
              </div>
            </>
          ) : stats ? (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Website Visitors</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalVisitors.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm mt-2">Last 30 days</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Page Views</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalPageViews.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm mt-2">Last 30 days</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Bounce Rate</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.bounceRate.toFixed(1)}%
                </div>
                <div className="text-gray-600 text-sm mt-2">
                  {stats.bounceRate < 40 ? 'Excellent' : stats.bounceRate < 60 ? 'Good' : 'Needs improvement'}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Avg Session</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round(stats.avgSessionDuration / 60)}m
                </div>
                <div className="text-gray-600 text-sm mt-2">
                  {stats.avgSessionDuration % 60}s average
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Content Counts */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Tours</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTours}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Events</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Experiences</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalExperiences}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Restaurants</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRestaurants}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Map Locations</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLocations}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Clients</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClients}</div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
