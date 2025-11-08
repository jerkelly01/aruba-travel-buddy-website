'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { websiteAnalyticsApi } from '@/lib/admin-api';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await websiteAnalyticsApi.getOverview(timeRange);
      if (response.success && response.data) {
        setOverview(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Website Analytics</h1>
              <p className="text-gray-600">Track website performance and visitor behavior</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading analytics...</div>
          </div>
        ) : overview ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Total Visitors</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {overview.totalVisitors?.toLocaleString() || 0}
                </div>
                <div className="text-green-600 text-sm mt-2">
                  {timeRange} period
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Page Views</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {overview.totalPageViews?.toLocaleString() || 0}
                </div>
                <div className="text-gray-600 text-sm mt-2">
                  {overview.totalVisitors > 0
                    ? Math.round(overview.totalPageViews / overview.totalVisitors)
                    : 0}{' '}
                  pages per visitor
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Bounce Rate</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {overview.bounceRate?.toFixed(1) || 0}%
                </div>
                <div className="text-gray-600 text-sm mt-2">
                  {overview.bounceRate < 40 ? 'Excellent' : overview.bounceRate < 60 ? 'Good' : 'Needs improvement'}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-medium">Avg Session Duration</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {overview.avgSessionDuration
                    ? Math.round(overview.avgSessionDuration / 60)
                    : 0}
                  m
                </div>
                <div className="text-gray-600 text-sm mt-2">
                  {overview.avgSessionDuration
                    ? `${overview.avgSessionDuration % 60}s`
                    : '0s'}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">New Visitors</h3>
                <div className="text-2xl font-bold text-[var(--brand-aruba)]">
                  {overview.newVisitors?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {overview.totalVisitors > 0
                    ? Math.round((overview.newVisitors / overview.totalVisitors) * 100)
                    : 0}% of total visitors
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Returning Visitors</h3>
                <div className="text-2xl font-bold text-[var(--brand-amber)]">
                  {(overview.totalVisitors - overview.newVisitors)?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {overview.totalVisitors > 0
                    ? Math.round(
                        ((overview.totalVisitors - overview.newVisitors) /
                          overview.totalVisitors) *
                          100
                      )
                    : 0}% of total visitors
                </div>
              </div>
            </div>

            {/* Placeholder for charts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Over Time</h3>
              <p className="text-gray-600 text-sm">
                Charts will be implemented with Chart.js or Recharts library
              </p>
              <div className="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Chart visualization coming soon</span>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

