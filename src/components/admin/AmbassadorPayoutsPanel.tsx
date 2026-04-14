'use client';

import { useCallback, useEffect, useState } from 'react';
import { ambassadorCommissionsApi } from '@/lib/admin-api';

export interface CommissionClick {
  id: string;
  referral_code: string;
  device_id: string;
  entity_type: string;
  entity_name: string | null;
  booking_url: string | null;
  estimated_amount: number | null;
  commission_amount: number | null;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  notes: string | null;
  created_at: string;
  paid_at: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const ENTITY_LABELS: Record<string, string> = {
  tour: '🧭 Tour',
  transportation: '🚗 Car Rental',
  experience: '🌊 Experience',
  restaurant: '🍽️ Restaurant',
  cultural_event: '🎉 Event',
};

const LIMIT = 50;

export function AmbassadorPayoutsPanel() {
  const [clicks, setClicks] = useState<CommissionClick[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [bulkNote, setBulkNote] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ambassadorCommissionsApi.getCommissions({
        status: statusFilter,
        limit: LIMIT,
        offset,
        search: search || undefined,
      });
      if (res.success && res.data) {
        setClicks((res.data as { clicks: CommissionClick[] }).clicks || []);
        setTotal((res.data as { total: number }).total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, offset, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setSaving(true);
    try {
      await ambassadorCommissionsApi.updateStatus(id, newStatus);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAction = async (newStatus: string) => {
    if (!selected.size) return;
    setSaving(true);
    try {
      await ambassadorCommissionsApi.bulkUpdateStatus(
        Array.from(selected),
        newStatus,
        bulkNote || undefined,
      );
      setSelected(new Set());
      setBulkNote('');
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === clicks.length) setSelected(new Set());
    else setSelected(new Set(clicks.map((c) => c.id)));
  };

  const totalPendingCommission = clicks
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + (c.commission_amount ?? 0), 0);

  const selectedCommission = clicks
    .filter((c) => selected.has(c.id))
    .reduce((sum, c) => sum + (c.commission_amount ?? 0), 0);

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <strong>Verification:</strong> Each row is a &quot;Book Now&quot; tap from a device carrying an
        ambassador code. Match <span className="font-mono bg-amber-100 px-1 rounded">device id</span> +{' '}
        <span className="font-mono bg-amber-100 px-1 rounded">code</span> to your Viator reports (
        <code className="bg-amber-100 px-1 rounded">campaign=amb-…</code>), then approve and mark paid after you
        pay the ambassador.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rows (this filter)</p>
          <p className="text-2xl font-bold text-yellow-600">{total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pending $ (this page)</p>
          <p className="text-2xl font-bold text-gray-800">${totalPendingCommission.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Selected $</p>
          <p className="text-2xl font-bold text-indigo-600">${selectedCommission.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {['pending', 'approved', 'paid', 'rejected', 'all'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setOffset(0);
                setSelected(new Set());
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by referral code..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="ml-auto border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-56"
        />
      </div>

      {selected.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-indigo-700">{selected.size} selected</span>
          <input
            type="text"
            placeholder="Optional note..."
            value={bulkNote}
            onChange={(e) => setBulkNote(e.target.value)}
            className="border border-indigo-300 rounded-lg px-3 py-1 text-sm flex-1 min-w-40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleBulkAction('approved')}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Approve All
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('paid')}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Mark Paid
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('rejected')}
            disabled={saving}
            className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
          >
            Reject All
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : clicks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-gray-500 font-medium">No {statusFilter} commissions</p>
            <p className="text-sm text-gray-400 mt-1">Booking taps from referred devices will show here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selected.size === clicks.length && clicks.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left text-gray-500 font-medium">Code</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Device</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Type</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Item</th>
                  <th className="p-3 text-right text-gray-500 font-medium">Value</th>
                  <th className="p-3 text-right text-gray-500 font-medium">3%</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Date</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Status</th>
                  <th className="p-3 text-left text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clicks.map((c) => (
                  <tr key={c.id} className={`hover:bg-gray-50 ${selected.has(c.id) ? 'bg-indigo-50' : ''}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-700 whitespace-nowrap">{c.referral_code}</td>
                    <td className="p-3 font-mono text-xs text-gray-600 max-w-[140px] truncate" title={c.device_id}>
                      {c.device_id.slice(0, 12)}…
                    </td>
                    <td className="p-3 whitespace-nowrap">{ENTITY_LABELS[c.entity_type] ?? c.entity_type}</td>
                    <td className="p-3 max-w-xs">
                      <span className="truncate block" title={c.entity_name ?? ''}>
                        {c.entity_name || '—'}
                      </span>
                      {c.booking_url && (
                        <a
                          href={c.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-500 hover:underline truncate block max-w-xs"
                          title={c.booking_url}
                        >
                          Open link ↗
                        </a>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {c.estimated_amount != null ? `$${c.estimated_amount.toFixed(2)}` : '—'}
                    </td>
                    <td className="p-3 text-right font-semibold text-green-700">
                      {c.commission_amount != null ? `$${c.commission_amount.toFixed(2)}` : '—'}
                    </td>
                    <td className="p-3 text-gray-500 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                        {c.status}
                      </span>
                      {c.notes && <p className="text-xs text-gray-400 mt-0.5">{c.notes}</p>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {c.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(c.id, 'approved')}
                              disabled={saving}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(c.id, 'rejected')}
                              disabled={saving}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {c.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(c.id, 'paid')}
                            disabled={saving}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                          >
                            Mark Paid
                          </button>
                        )}
                        {(c.status === 'approved' || c.status === 'rejected') && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(c.id, 'pending')}
                            disabled={saving}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > LIMIT && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>
            Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setOffset(offset + LIMIT)}
              disabled={offset + LIMIT >= total}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
