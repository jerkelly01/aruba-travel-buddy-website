'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { websiteAnalyticsApi } from '@/lib/admin-api';
import { TrafficOverTimeChart } from '@/components/admin/TrafficOverTimeChart';
import {
  buildTrafficSeries,
  daysForTimeRange,
  formatAvgSessionSeconds,
  normalizeOverview,
} from '@/lib/analytics-admin';

type OverviewPayload = Record<string, unknown> & {
  trafficByDay?: { date: string; page_views: number; visitors: number }[];
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [overview, setOverview] = useState<OverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchingRef = useRef(false);

  const fetchAnalytics = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setLoadError(null);
    try {
      const response = await websiteAnalyticsApi.getOverview(timeRange);
      if (response.success && response.data) {
        setOverview(response.data as OverviewPayload);
        setLastUpdated(new Date());
      } else {
        setOverview(null);
        setLoadError(response.error || 'Could not load analytics');
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setOverview(null);
      setLoadError(error instanceof Error ? error.message : 'Could not load analytics');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [timeRange]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchAnalytics();
  }, [isAuthenticated, timeRange, fetchAnalytics]);

  // Refetch when user switches back to this tab
  useEffect(() => {
    if (!isAuthenticated) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchAnalytics();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [isAuthenticated, fetchAnalytics]);

  const m = useMemo(() => (overview ? normalizeOverview(overview) : null), [overview]);

  const chartSeries = useMemo(() => {
    if (!overview?.trafficByDay || !Array.isArray(overview.trafficByDay)) {
      return buildTrafficSeries([], daysForTimeRange(timeRange));
    }
    return buildTrafficSeries(overview.trafficByDay, daysForTimeRange(timeRange));
  }, [overview, timeRange]);

  const avgFmt = m ? formatAvgSessionSeconds(m.avgSessionDuration) : { minutes: 0, seconds: 0 };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Website Analytics</h1>
              <p className="text-gray-500 text-sm">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : 'Track website performance and visitor behavior'}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/admin" className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm">
                ← Dashboard
              </Link>
              <button
                type="button"
                onClick={fetchAnalytics}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading…' : '↺ Refresh'}
              </button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)] text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Loading analytics…</div>
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-lg shadow p-10">
            <p className="text-red-600 font-semibold mb-2">Failed to load analytics</p>
            <pre className="text-xs text-gray-500 whitespace-pre-wrap bg-gray-50 rounded p-3 mb-4">
              {loadError}
            </pre>
            <p className="text-gray-500 text-sm">
              Make sure migration <code>033_analytics_definitive_fix.sql</code> has been applied in
              Supabase → SQL Editor. Then click <strong>Refresh</strong>.
            </p>
            <button
              type="button"
              onClick={fetchAnalytics}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : overview && m ? (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <MetricCard
                label="Total Visitors"
                value={m.totalVisitors.toLocaleString()}
                sub={`${timeRange} period`}
                subColor="text-green-600"
              />
              <MetricCard
                label="Page Views"
                value={m.totalPageViews.toLocaleString()}
                sub={`${m.pagesPerVisitor.toFixed(1)} pages / visitor`}
              />
              <MetricCard
                label="Bounce Rate"
                value={`${m.bounceRate.toFixed(1)}%`}
                sub={m.bounceRate < 40 ? 'Excellent' : m.bounceRate < 60 ? 'Good' : 'Needs improvement'}
              />
              <MetricCard
                label="Avg Session"
                value={`${avgFmt.minutes}m ${avgFmt.seconds}s`}
                sub="avg length"
              />
            </div>

            {/* Visitor split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500 mb-1">New Visitors</div>
                <div className="text-3xl font-bold text-[var(--brand-aruba)]">
                  {m.newVisitors.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {m.totalVisitors > 0
                    ? Math.round((m.newVisitors / m.totalVisitors) * 100)
                    : 0}
                  % of total
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Returning Visitors</div>
                <div className="text-3xl font-bold text-[var(--brand-amber)]">
                  {m.returningVisitors.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {m.totalVisitors > 0
                    ? Math.round((m.returningVisitors / m.totalVisitors) * 100)
                    : 0}
                  % of total
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900">Traffic Over Time</h3>
                <span className="text-xs text-gray-400">UTC dates</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Page views (area) and unique visitors (line) per day.
              </p>
              <TrafficOverTimeChart data={chartSeries} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No analytics data yet</p>
            <p className="text-gray-400 text-sm">
              Visit <strong>arubatravelbuddy.com</strong> in a browser and then click{' '}
              <strong>Refresh</strong> above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  subColor = 'text-gray-500',
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
      {sub && <div className={`text-sm mt-1 ${subColor}`}>{sub}</div>}
    </div>
  );
}
