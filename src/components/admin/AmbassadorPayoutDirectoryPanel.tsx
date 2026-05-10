'use client';

import { useCallback, useEffect, useState } from 'react';
import { referralCampaignApi } from '@/lib/admin-api';

export type PayoutDirectoryRow = {
  referral_code: string;
  user_id: string | null;
  user_first_name: string | null;
  user_last_name: string | null;
  user_email: string | null;
  legal_name_for_payout: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  payout_method: string | null;
  paypal_email: string | null;
  bank_country: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  iban: string | null;
  bank_routing_aba: string | null;
  bank_swift_bic: string | null;
  bank_account_number: string | null;
  notes_internal: string | null;
  profile_updated_at: string | null;
};

const PAYOUT_METHODS = [
  { value: 'unspecified', label: 'Not set' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'cash', label: 'Cash / in person' },
  { value: 'other', label: 'Other' },
] as const;

function hasBankDetails(r: PayoutDirectoryRow) {
  return !!(r.iban || r.bank_routing_aba || r.bank_account_number || r.bank_swift_bic || r.bank_name);
}

export function AmbassadorPayoutDirectoryPanel() {
  const [rows, setRows] = useState<PayoutDirectoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<PayoutDirectoryRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await referralCampaignApi.getPayoutDirectory();
      if (res.success && Array.isArray(res.data)) {
        setRows(res.data as PayoutDirectoryRow[]);
      } else {
        setRows([]);
        setError(
          res.error ||
            'Could not load directory. Run Supabase migration 041 and redeploy the admin-referral function.',
        );
      }
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (r: PayoutDirectoryRow) => {
    setEditing(r);
    setForm({
      legal_name_for_payout: r.legal_name_for_payout ?? '',
      contact_email: r.contact_email ?? '',
      contact_phone: r.contact_phone ?? '',
      payout_method: r.payout_method ?? 'unspecified',
      paypal_email: r.paypal_email ?? '',
      bank_country: r.bank_country ?? '',
      bank_name: r.bank_name ?? '',
      account_holder_name: r.account_holder_name ?? '',
      iban: r.iban ?? '',
      bank_routing_aba: r.bank_routing_aba ?? '',
      bank_swift_bic: r.bank_swift_bic ?? '',
      bank_account_number: r.bank_account_number ?? '',
      notes_internal: r.notes_internal ?? '',
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setForm({});
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await referralCampaignApi.upsertPayoutProfile(editing.referral_code, {
        legal_name_for_payout: form.legal_name_for_payout,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        payout_method: form.payout_method,
        paypal_email: form.paypal_email,
        bank_country: form.bank_country,
        bank_name: form.bank_name,
        account_holder_name: form.account_holder_name,
        iban: form.iban,
        bank_routing_aba: form.bank_routing_aba,
        bank_swift_bic: form.bank_swift_bic,
        bank_account_number: form.bank_account_number,
        notes_internal: form.notes_internal,
      });
      if (res.success) {
        closeEdit();
        await load();
      } else {
        setError(res.error || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-sm text-rose-900">
        <strong>Privacy:</strong> Bank and payout details are stored in your Supabase database and are only loaded
        through this admin session. Limit who has project access; treat exports like financial data. For stronger
        protection later, use field-level encryption or a payouts provider (Wise, Stripe Connect, etc.).
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Codes from installs, booking taps, or registered referral codes. Edit to add how you pay each ambassador.
        </p>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-40"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading directory…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="text-left p-3 font-medium">Code</th>
                  <th className="text-left p-3 font-medium">App account</th>
                  <th className="text-left p-3 font-medium">Legal / payout name</th>
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-left p-3 font-medium">Method</th>
                  <th className="text-center p-3 font-medium">Bank on file</th>
                  <th className="text-left p-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => {
                  const appName = [r.user_first_name, r.user_last_name].filter(Boolean).join(' ') || '—';
                  const contact = [r.contact_email, r.contact_phone].filter(Boolean).join(' · ') || '—';
                  return (
                    <tr key={r.referral_code} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-semibold text-indigo-700">{r.referral_code}</td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{appName}</div>
                        <div className="text-xs text-gray-500">{r.user_email || '—'}</div>
                      </td>
                      <td className="p-3 text-gray-800">{r.legal_name_for_payout || '—'}</td>
                      <td className="p-3 max-w-[200px]">
                        <div className="truncate text-gray-800" title={contact}>
                          {contact}
                        </div>
                      </td>
                      <td className="p-3 capitalize text-gray-600">{r.payout_method?.replace(/_/g, ' ') || '—'}</td>
                      <td className="p-3 text-center">{hasBankDetails(r) ? '✓' : '—'}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="text-indigo-600 font-medium hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={closeEdit}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">Payout profile</h3>
            <p className="text-xs text-gray-500 mb-4 font-mono">{editing.referral_code}</p>

            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-gray-600 text-xs font-medium uppercase">Legal name (for bank / 1099)</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.legal_name_for_payout}
                  onChange={(e) => setForm((f) => ({ ...f, legal_name_for_payout: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs font-medium uppercase">Contact email</span>
                <input
                  type="email"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.contact_email}
                  onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs font-medium uppercase">Phone / WhatsApp</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.contact_phone}
                  onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs font-medium uppercase">Payout method</span>
                <select
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.payout_method}
                  onChange={(e) => setForm((f) => ({ ...f, payout_method: e.target.value }))}
                >
                  {PAYOUT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs font-medium uppercase">PayPal email</span>
                <input
                  type="email"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.paypal_email}
                  onChange={(e) => setForm((f) => ({ ...f, paypal_email: e.target.value }))}
                />
              </label>
              <hr className="border-gray-200" />
              <p className="text-xs text-gray-500 font-medium uppercase">Bank transfer (optional)</p>
              <label className="block">
                <span className="text-gray-600 text-xs">Country</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. AW, US"
                  value={form.bank_country}
                  onChange={(e) => setForm((f) => ({ ...f, bank_country: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">Bank name</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.bank_name}
                  onChange={(e) => setForm((f) => ({ ...f, bank_name: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">Account holder (if different)</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  value={form.account_holder_name}
                  onChange={(e) => setForm((f) => ({ ...f, account_holder_name: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">IBAN</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 font-mono text-xs"
                  value={form.iban}
                  onChange={(e) => setForm((f) => ({ ...f, iban: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">Routing (ABA) / local routing</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 font-mono text-xs"
                  value={form.bank_routing_aba}
                  onChange={(e) => setForm((f) => ({ ...f, bank_routing_aba: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">SWIFT / BIC</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 font-mono text-xs"
                  value={form.bank_swift_bic}
                  onChange={(e) => setForm((f) => ({ ...f, bank_swift_bic: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">Account number</span>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 font-mono text-xs"
                  value={form.bank_account_number}
                  onChange={(e) => setForm((f) => ({ ...f, bank_account_number: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-gray-600 text-xs">Internal notes (not shown to ambassador)</span>
                <textarea
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-xs"
                  rows={2}
                  value={form.notes_internal}
                  onChange={(e) => setForm((f) => ({ ...f, notes_internal: e.target.value }))}
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => save()}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
