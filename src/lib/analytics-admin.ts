import type { TrafficDayPoint } from '@/components/admin/TrafficOverTimeChart';

const DAY_MS = 86400000;

export type OverviewMetrics = {
  totalVisitors: number;
  totalPageViews: number;
  newVisitors: number;
  returningVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerVisitor: number;
};

/** Coerce API / JSON numbers (strings, bigint) for UI. */
function pickNum(...vals: unknown[]): number {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'bigint') return Number(v);
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

export function normalizeOverview(raw: Record<string, unknown>): OverviewMetrics {
  const totalVisitors = pickNum(raw.totalVisitors, raw.total_visitors);
  const totalPageViews = pickNum(raw.totalPageViews, raw.total_page_views);
  const newVisitors = pickNum(raw.newVisitors, raw.new_visitors);
  const br = raw.bounceRate ?? raw.bounce_rate;
  const bounceRate = typeof br === 'number' && !Number.isNaN(br) ? br : parseFloat(String(br)) || 0;
  const avgSessionDuration = pickNum(raw.avgSessionDuration, raw.avg_session_duration);
  const returningVisitors = Math.max(0, totalVisitors - newVisitors);
  const pagesPerVisitor =
    totalVisitors > 0 ? Math.round((totalPageViews / totalVisitors) * 10) / 10 : 0;

  return {
    totalVisitors,
    totalPageViews,
    newVisitors,
    returningVisitors,
    bounceRate,
    avgSessionDuration,
    pagesPerVisitor,
  };
}

export function formatAvgSessionSeconds(totalSeconds: number): { minutes: number; seconds: number } {
  const s = Math.max(0, Math.round(totalSeconds));
  return { minutes: Math.floor(s / 60), seconds: s % 60 };
}

/** Fill missing calendar days (UTC) for chart continuity. */
export function buildTrafficSeries(
  trafficByDay: { date: string; page_views: number; visitors: number }[],
  dayCount: number,
): TrafficDayPoint[] {
  const endUtc = new Date();
  endUtc.setUTCHours(12, 0, 0, 0);
  const startUtc = new Date(endUtc);
  startUtc.setUTCDate(startUtc.getUTCDate() - (dayCount - 1));
  startUtc.setUTCHours(0, 0, 0, 0);

  const map = new Map(trafficByDay.map((d) => [d.date, d]));
  const out: TrafficDayPoint[] = [];
  for (let t = startUtc.getTime(); t <= endUtc.getTime(); t += DAY_MS) {
    const d = new Date(t);
    const key = d.toISOString().slice(0, 10);
    const row = map.get(key);
    out.push({
      date: key,
      label: `${d.getUTCMonth() + 1}/${d.getUTCDate()}`,
      page_views: row?.page_views ?? 0,
      visitors: row?.visitors ?? 0,
    });
  }
  return out;
}

export function daysForTimeRange(tr: '7d' | '30d' | '90d'): number {
  if (tr === '7d') return 7;
  if (tr === '90d') return 90;
  return 30;
}
