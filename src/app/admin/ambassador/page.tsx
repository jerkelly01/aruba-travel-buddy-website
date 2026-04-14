'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { referralCampaignApi } from '@/lib/admin-api';
import { AmbassadorPayoutsPanel } from '@/components/admin/AmbassadorPayoutsPanel';

type Tab = 'overview' | 'installs' | 'payouts';

function monthNow(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

type DashboardStats = {
  month: string;
  referral_installs: number;
  unique_devices_referred: number;
  booking_clicks_month: number;
  clicks_pending: number;
  clicks_approved: number;
  clicks_paid: number;
  clicks_rejected: number;
  commission_sum_pending: number;
  commission_sum_approved: number;
  commission_sum_paid: number;
  clicks_attributed: number;
  clicks_unattributed: number;
  all_time_referrals: number;
  all_time_booking_clicks: number;
  all_time_commission_pending: number;
};

type LeaderRow = {
  referral_code: string;
  referral_count: number | string;
  username: string | null;
};

type ReferralEntry = {
  id: string;
  referrer_id: string | null;
  referred_user_id: string;
  referral_code: string;
  month: string;
  created_at: string;
};

function parseDashboard(raw: unknown): DashboardStats | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  return {
    month: String(o.month ?? ''),
    referral_installs: Number(o.referral_installs ?? 0),
    unique_devices_referred: Number(o.unique_devices_referred ?? 0),
    booking_clicks_month: Number(o.booking_clicks_month ?? 0),
    clicks_pending: Number(o.clicks_pending ?? 0),
    clicks_approved: Number(o.clicks_approved ?? 0),
    clicks_paid: Number(o.clicks_paid ?? 0),
    clicks_rejected: Number(o.clicks_rejected ?? 0),
    commission_sum_pending: Number(o.commission_sum_pending ?? 0),
    commission_sum_approved: Number(o.commission_sum_approved ?? 0),
    commission_sum_paid: Number(o.commission_sum_paid ?? 0),
    clicks_attributed: Number(o.clicks_attributed ?? 0),
    clicks_unattributed: Number(o.clicks_unattributed ?? 0),
    all_time_referrals: Number(o.all_time_referrals ?? 0),
    all_time_booking_clicks: Number(o.all_time_booking_clicks ?? 0),
    all_time_commission_pending: Number(o.all_time_commission_pending ?? 0),
  };
}

function AmbassadorAdminInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, isAuthenticated } = useAuth();

  const tabParam = (searchParams.get('tab') || 'overview').toLowerCase();
  const tab: Tab =
    tabParam === 'installs' || tabParam === 'payouts' ? (tabParam as Tab) : 'overview';

  const [month, setMonth] = useState(monthNow);
  const [dash, setDash] = useState<DashboardStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [entries, setEntries] = useState<ReferralEntry[]>([]);
  const [prizeName, setPrizeName] = useState('');
  const [prizeDesc, setPrizeDesc] = useState('');
  const [drawMessage, setDrawMessage] = useState<string | null>(null);
  const [loadingDash, setLoadingDash] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [savingPrize, setSavingPrize] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  const setTab = (t: Tab) => {
    const q = new URLSearchParams(searchParams.toString());
    q.set('tab', t);
    router.replace(`/admin/ambassador?${q.toString()}`);
  };

  const fetchOverview = useCallback(async () => {
    setLoadingDash(true);
    try {
      const [dRes, lRes] = await Promise.all([
        referralCampaignApi.getDashboard(month),
        referralCampaignApi.getLeaderboard(month, 20),
      ]);
      if (dRes.success && dRes.data != null) {
        let payload = dRes.data as unknown;
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch {
            payload = null;
          }
        }
        setDash(parseDashboard(payload));
      } else setDash(null);

      if (lRes.success && Array.isArray(lRes.data)) {
        setLeaderboard(lRes.data as LeaderRow[]);
      } else {
        setLeaderboard([]);
      }
    } catch (e) {
      console.error(e);
      setDash(null);
      setLeaderboard([]);
    } finally {
      setLoadingDash(false);
    }
  }, [month]);

  useEffect(() => {
    if (isAuthenticated) fetchOverview();
  }, [isAuthenticated, fetchOverview]);

  const fetchInstalls = useCallback(async () => {
    setLoadingEntries(true);
    setDrawMessage(null);
    try {
      const [eRes, pRes] = await Promise.all([
        referralCampaignApi.getEntries(month),
        referralCampaignApi.getPrize(month),
      ]);
      if (eRes.success && Array.isArray(eRes.data)) {
        setEntries(eRes.data as ReferralEntry[]);
      } else {
        setEntries([]);
      }
      if (pRes.success && pRes.data && typeof pRes.data === 'object') {
        const p = pRes.data as { prize_name?: string; prize_description?: string };
        setPrizeName(p.prize_name || '');
        setPrizeDesc(p.prize_description || '');
      } else {
        setPrizeName('');
        setPrizeDesc('');
      }
    } catch (e) {
      console.error(e);
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  }, [month]);

  useEffect(() => {
    if (isAuthenticated && tab === 'installs') fetchInstalls();
  }, [isAuthenticated, tab, fetchInstalls]);

  const savePrize = async () => {
    if (!prizeName.trim()) return;
    setSavingPrize(true);
    try {
      await referralCampaignApi.savePrize({
        month,
        prize_name: prizeName.trim(),
        prize_description: prizeDesc.trim() || undefined,
      });
      await fetchInstalls();
    } finally {
      setSavingPrize(false);
    }
  };

  const runDraw = async () => {
    if (!window.confirm(`Draw a random winner for ${month}? Only entries linked to user accounts are eligible.`)) return;
    setDrawing(true);
    setDrawMessage(null);
    try {
      const res = await referralCampaignApi.drawWinner(month);
      if (res.success && res.data) {
        const w = (res.data as { winner?: { first_name?: string; email?: string } }).winner;
        setDrawMessage(
          w ? `Winner: ${w.first_name || ''} (${w.email || 'no email'})` : 'Draw completed.',
        );
      } else {
        setDrawMessage(res.error || 'Draw failed');
      }
    } catch (e) {
      setDrawMessage(e instanceof Error ? e.message : 'Draw failed');
    } finally {
      setDrawing(false);
      await fetchInstalls();
    }
  };

  const tabs = useMemo(
    () =>
      [
        { id: 'overview' as Tab, label: 'Overview' },
        { id: 'installs' as Tab, label: 'App installs' },
        { id: 'payouts' as Tab, label: 'Booking payouts' },
      ] as const,
    [],
  );

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ambassador</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              One place for QR installs, device-level booking taps, and commission payouts. Use{' '}
              <strong>Attributed</strong> counts to see booking clicks that match a prior app install from the same
              device and ambassador code — your strongest signal before paying an ambassador.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href="https://www.viator.com/orion/partner/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Viator affiliate ↗
            </a>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Website analytics
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            Month
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
            />
          </label>
          <nav className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  tab === t.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {tab === 'overview' && (
          <div className="space-y-6">
            {loadingDash ? (
              <p className="text-gray-400">Loading stats…</p>
            ) : dash ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard label="QR installs (month)" value={dash.referral_installs} hint="ambassador_referrals" />
                  <StatCard
                    label="Unique devices (installs)"
                    value={dash.unique_devices_referred}
                    hint="Distinct devices"
                  />
                  <StatCard
                    label="Booking taps (month)"
                    value={dash.booking_clicks_month}
                    hint="Book Now recorded"
                  />
                  <StatCard
                    label="Attributed taps"
                    value={dash.clicks_attributed}
                    hint="Had prior install same device + code"
                    accent="text-emerald-700"
                  />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard
                    label="Unattributed taps"
                    value={dash.clicks_unattributed}
                    hint="No matching install row — review"
                    accent="text-amber-700"
                  />
                  <StatCard
                    label="Pending commission ($)"
                    value={`$${Number(dash.commission_sum_pending).toFixed(2)}`}
                    hint="This month, pending status"
                  />
                  <StatCard
                    label="Approved ($)"
                    value={`$${Number(dash.commission_sum_approved).toFixed(2)}`}
                    hint="Ready to mark paid"
                  />
                  <StatCard
                    label="Paid out ($)"
                    value={`$${Number(dash.commission_sum_paid).toFixed(2)}`}
                    hint="This month"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <StatCard label="All-time installs" value={dash.all_time_referrals} />
                  <StatCard label="All-time booking taps" value={dash.all_time_booking_clicks} />
                  <StatCard
                    label="All-time pending $ (all statuses pending)"
                    value={`$${Number(dash.all_time_commission_pending).toFixed(2)}`}
                  />
                </div>
              </>
            ) : (
              <p className="text-red-600 text-sm">Could not load dashboard. Run migration 040 and redeploy admin-referral.</p>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Payout readiness</h2>
              <ul className="text-sm text-gray-600 space-y-2 list-disc ml-5">
                <li>
                  <strong>Install</strong> = user opened the app from an ambassador QR; we store{' '}
                  <code className="bg-gray-100 px-1 rounded text-xs">device_id</code> +{' '}
                  <code className="bg-gray-100 px-1 rounded text-xs">referral_code</code>.
                </li>
                <li>
                  <strong>Booking tap</strong> = they tapped Book Now; we log the same identifiers plus tour/link.
                </li>
                <li>
                  <strong>Attributed</strong> means a booking tap occurred after we already had an install row for that
                  device and code — best evidence the traffic came through your ambassador funnel (still confirm amount
                  on Viator).
                </li>
                <li>
                  <strong>Unattributed</strong> taps can happen if the app never recorded the install (reinstall,
                  cleared storage, or edge timing). Treat cautiously before approving commission.
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Leaderboard — {month}</h2>
                <span className="text-xs text-gray-400">By install count</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left p-3 font-medium">#</th>
                      <th className="text-left p-3 font-medium">Ambassador</th>
                      <th className="text-left p-3 font-medium">Code</th>
                      <th className="text-right p-3 font-medium">Installs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400">
                          No installs for this month yet.
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((row, i) => (
                        <tr key={row.referral_code} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-400">{i + 1}</td>
                          <td className="p-3">{row.username || '—'}</td>
                          <td className="p-3 font-mono text-indigo-700">{row.referral_code}</td>
                          <td className="p-3 text-right font-semibold">{Number(row.referral_count)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'installs' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Monthly prize (optional)</h2>
              <p className="text-sm text-gray-500 mb-4">
                Legacy referral-campaign drawing: only entries tied to registered ambassador accounts are eligible for
                the random draw.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Prize name"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Prize description"
                  value={prizeDesc}
                  onChange={(e) => setPrizeDesc(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm sm:col-span-2"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={savePrize}
                  disabled={savingPrize || !prizeName.trim()}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                >
                  Save prize
                </button>
                <button
                  type="button"
                  onClick={runDraw}
                  disabled={drawing}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
                >
                  Draw winner
                </button>
              </div>
              {drawMessage && <p className="text-sm mt-2 text-gray-700">{drawMessage}</p>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Install log — {month}</h2>
                <p className="text-xs text-gray-500 mt-1">One row per device per ambassador code (first open in month).</p>
              </div>
              {loadingEntries ? (
                <div className="p-8 text-center text-gray-400">Loading…</div>
              ) : entries.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No installs this month.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="text-left p-3 font-medium">Ambassador code</th>
                        <th className="text-left p-3 font-medium">Referred device</th>
                        <th className="text-left p-3 font-medium">Ambassador user</th>
                        <th className="text-left p-3 font-medium">When</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {entries.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono text-indigo-700">{e.referral_code}</td>
                          <td className="p-3 font-mono text-xs text-gray-600 max-w-[200px] truncate" title={e.referred_user_id}>
                            {e.referred_user_id}
                          </td>
                          <td className="p-3 text-gray-600 text-xs">{e.referrer_id || '—'}</td>
                          <td className="p-3 text-gray-500 whitespace-nowrap">
                            {new Date(e.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'payouts' && <AmbassadorPayoutsPanel />}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold text-gray-900 ${accent || ''}`}>{value}</p>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AmbassadorAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading…</div>
      }
    >
      <AmbassadorAdminInner />
    </Suspense>
  );
}
