'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { vendorPartnersApi } from '@/lib/admin-api';

interface VendorKey {
  id: string;
  vendor_type: string;
  vendor_id: string;
  vendor_name: string;
  api_key: string;
  commission_percent: number | null;
  commission_flat: number | null;
  is_active: boolean;
  created_at: string;
}

interface CommissionSummary {
  total_conversions: number;
  total_booking_value: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
}

interface CommissionEvent {
  id: string;
  click_id: string;
  vendor_type: string;
  vendor_name: string;
  booking_reference: string;
  booking_amount: number;
  currency: string;
  commission_amount: number;
  status: string;
  confirmed_at: string;
  created_at: string;
}

interface VendorAccount {
  id: string;
  auth_user_id: string | null;
  email: string;
  business_name: string;
  entity_type: string;
  entity_id: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

interface AccountFormData {
  email: string;
  business_name: string;
  entity_type: string;
  entity_id: string;
  notes: string;
  open_time: string;
  close_time: string;
  interval_minutes: string;
  max_guests_per_slot: string;
  slot_padding: string;
}

interface AccountCredentials {
  email: string;
  temp_password?: string;
  new_password?: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const ENTITY_TYPES = [
  { value: 'restaurant',     label: 'Restaurant',         emoji: '🍽️' },
  { value: 'tour',           label: 'Tour',               emoji: '🌊' },
  { value: 'experience',     label: 'Local Experience',   emoji: '🎯' },
  { value: 'transportation', label: 'Transportation',     emoji: '🚗' },
];

const INTERVAL_OPTIONS = [
  { value: '15',  label: '15 minutes' },
  { value: '30',  label: '30 minutes' },
  { value: '45',  label: '45 minutes' },
  { value: '60',  label: '60 minutes' },
  { value: '90',  label: '90 minutes' },
  { value: '120', label: '2 hours' },
];

const VENDOR_TYPES = [
  { value: 'tour', label: 'Tour' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'transportation', label: 'Transportation / Car Rental' },
  { value: 'experience', label: 'Local Experience' },
  { value: 'event', label: 'Cultural Event' },
  { value: 'support_local', label: 'Support Local' },
  { value: 'location', label: 'Location / Attraction' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  disputed: 'bg-orange-100 text-orange-800',
};

export default function VendorPartnersPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  const [vendors, setVendors] = useState<VendorKey[]>([]);
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary | null>(null);
  const [commissions, setCommissions] = useState<CommissionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'accounts' | 'vendors' | 'commissions'>('accounts');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Onboard form state (API key vendors)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_type: 'tour',
    vendor_id: '',
    vendor_email: '',
    commission_percent: '',
    commission_flat: '',
  });
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  // Vendor Accounts state
  const [accounts, setAccounts] = useState<VendorAccount[]>([]);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountFormData, setAccountFormData] = useState<AccountFormData>({
    email: '',
    business_name: '',
    entity_type: 'restaurant',
    entity_id: '',
    notes: '',
    open_time: '09:00',
    close_time: '21:00',
    interval_minutes: '60',
    max_guests_per_slot: '20',
    slot_padding: '0',
  });
  const [savingAccount, setSavingAccount] = useState(false);
  const [newAccountCredentials, setNewAccountCredentials] = useState<AccountCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);
  const [resetCredentials, setResetCredentials] = useState<AccountCredentials | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, timeRange]);

  const adminHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, commissionsRes, accountsRes] = await Promise.all([
        vendorPartnersApi.getAll(),
        vendorPartnersApi.getCommissions(timeRange),
        fetch(`${SUPABASE_URL}/functions/v1/vendor-accounts/list`, { headers: adminHeaders() }),
      ]);

      if (vendorsRes.success && vendorsRes.data) {
        setVendors(vendorsRes.data as VendorKey[]);
      }
      if (commissionsRes.success && commissionsRes.data) {
        const data = commissionsRes.data as any;
        setCommissionSummary(data.summary);
        setCommissions(data.commissions || []);
      }
      if (accountsRes.ok) {
        const raw = await accountsRes.json();
        const data = raw?.data ?? raw;
        setAccounts(data?.accounts ?? []);
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    setNewAccountCredentials(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/vendor-accounts/create`, {
        method: 'POST',
        headers: adminHeaders(),
        body: JSON.stringify({
          email:              accountFormData.email,
          business_name:      accountFormData.business_name,
          entity_type:        accountFormData.entity_type,
          entity_id:          accountFormData.entity_id.trim(),
          notes:              accountFormData.notes || undefined,
          open_time:          accountFormData.open_time,
          close_time:         accountFormData.close_time,
          interval_minutes:   parseInt(accountFormData.interval_minutes),
          max_guests_per_slot: parseInt(accountFormData.max_guests_per_slot),
          slot_padding:       parseInt(accountFormData.slot_padding),
        }),
      });
      const raw = await res.json();
      const data = raw?.data ?? raw;
      if (!res.ok) {
        alert(data?.error || 'Failed to create account');
        return;
      }
      setNewAccountCredentials({ email: data.email, temp_password: data.temp_password });
      await loadData();
    } catch {
      alert('Network error — check your connection');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleToggleAccount = async (id: string) => {
    await fetch(`${SUPABASE_URL}/functions/v1/vendor-accounts/${id}/toggle`, {
      method: 'PATCH',
      headers: adminHeaders(),
    });
    await loadData();
  };

  const handleResetPassword = async (id: string) => {
    if (!confirm('Reset this vendor\'s password? A new temporary password will be generated.')) return;
    setResettingPasswordId(id);
    setResetCredentials(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/vendor-accounts/${id}/reset-password`, {
        method: 'POST',
        headers: adminHeaders(),
      });
      const raw = await res.json();
      const data = raw?.data ?? raw;
      if (res.ok) setResetCredentials({ email: data.email, new_password: data.new_password });
      else alert(data?.error || 'Failed to reset password');
    } finally {
      setResettingPasswordId(null);
    }
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    if (!confirm(`Permanently delete account for "${name}"? This cannot be undone.`)) return;
    await fetch(`${SUPABASE_URL}/functions/v1/vendor-accounts/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
    await loadData();
  };

  const copyText = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        vendor_name: formData.vendor_name,
        vendor_type: formData.vendor_type,
        vendor_id: formData.vendor_id,
      };
      if (formData.commission_percent) {
        payload.commission_percent = parseFloat(formData.commission_percent);
      }
      if (formData.commission_flat) {
        payload.commission_flat = parseFloat(formData.commission_flat);
      }

      let res;
      if (editingId) {
        res = await vendorPartnersApi.update(editingId, payload);
      } else {
        res = await vendorPartnersApi.create(payload);
      }

      if (res.success) {
        // If it was a new vendor being onboarded, simulate account generation
        if (!editingId && formData.vendor_email) {
          const randomPass = Math.random().toString(36).slice(-8);
          setGeneratedPassword(randomPass);
        } else {
          setShowForm(false);
          setEditingId(null);
          setFormData({ vendor_name: '', vendor_type: 'tour', vendor_id: '', vendor_email: '', commission_percent: '', commission_flat: '' });
        }
        await loadData();
      } else {
        alert(res.error || 'Failed to save vendor');
      }
    } catch (error) {
      alert('Failed to save vendor');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vendor: VendorKey) => {
    setEditingId(vendor.id);
    setFormData({
      vendor_name: vendor.vendor_name,
      vendor_type: vendor.vendor_type,
      vendor_id: vendor.vendor_id,
      vendor_email: '', // Not editable via this surface currently
      commission_percent: vendor.commission_percent?.toString() || '',
      commission_flat: vendor.commission_flat?.toString() || '',
    });
    setGeneratedPassword(null);
    setShowForm(true);
  };

  const handleToggleActive = async (vendor: VendorKey) => {
    if (vendor.is_active) {
      if (!confirm(`Deactivate ${vendor.vendor_name}? Their webhook will stop working.`)) return;
      await vendorPartnersApi.deactivate(vendor.id);
    } else {
      await vendorPartnersApi.update(vendor.id, { is_active: true });
    }
    await loadData();
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">
                  ← Dashboard
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Vendor Partners</h1>
              <p className="text-gray-600 text-sm">Onboard vendors, manage API keys, and track commissions</p>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setGeneratedPassword(null);
                setFormData({ vendor_name: '', vendor_type: 'tour', vendor_id: '', vendor_email: '', commission_percent: '', commission_flat: '' });
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Generate New Vendor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Commission Summary Cards */}
        {commissionSummary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Conversions</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{commissionSummary.total_conversions}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Booking Value</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">${commissionSummary.total_booking_value.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Total Commission</div>
              <div className="text-2xl font-bold text-green-600 mt-1">${commissionSummary.total_commission.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Paid</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">${commissionSummary.paid_commission.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-xs font-medium">Pending</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">${commissionSummary.pending_commission.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg shadow p-1 w-fit">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'accounts' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            🔑 Accounts ({accounts.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'vendors' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            API Keys ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'commissions' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Commissions ({commissions.length})
          </button>
        </div>

        {/* ══ ACCOUNTS TAB ══ */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            {/* Create Account button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Vendor Dashboard Accounts</h2>
                <p className="text-sm text-gray-500">Create login accounts for businesses. Each account comes pre-configured and ready to use.</p>
              </div>
              <button
                onClick={() => { setShowAccountForm(true); setNewAccountCredentials(null); setResetCredentials(null); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow flex items-center gap-2 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Create Account
              </button>
            </div>

            {/* Reset credential toast */}
            {resetCredentials && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-blue-900">Password reset — share these new credentials:</p>
                    <div className="mt-2 font-mono text-sm space-y-1">
                      <div>Email: <span className="font-bold">{resetCredentials.email}</span></div>
                      <div>New password: <span className="font-bold">{resetCredentials.new_password}</span></div>
                    </div>
                  </div>
                  <button onClick={() => setResetCredentials(null)} className="text-blue-400 hover:text-blue-600 ml-4">✕</button>
                </div>
              </div>
            )}

            {/* Accounts table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading accounts…</div>
              ) : accounts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">🔑</div>
                  <p className="text-gray-500 font-medium">No vendor accounts yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Create one to get started.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Login email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accounts.map(acc => (
                      <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{acc.business_name}</div>
                          {acc.notes && <div className="text-xs text-gray-400 mt-0.5">{acc.notes}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">{acc.email}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm capitalize bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                            {ENTITY_TYPES.find(e => e.value === acc.entity_type)?.emoji} {acc.entity_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-mono max-w-[120px] truncate">{acc.entity_id}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${acc.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {acc.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(acc.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleResetPassword(acc.id)}
                              disabled={resettingPasswordId === acc.id}
                              title="Reset password"
                              className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-lg hover:bg-yellow-100 font-semibold disabled:opacity-50 transition-colors"
                            >
                              {resettingPasswordId === acc.id ? '…' : '🔄 Reset PW'}
                            </button>
                            <button
                              onClick={() => handleToggleAccount(acc.id)}
                              title={acc.is_active ? 'Deactivate' : 'Activate'}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${acc.is_active ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                            >
                              {acc.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(acc.id, acc.business_name)}
                              title="Delete account"
                              className="text-xs text-gray-400 hover:text-red-600 transition-colors px-1.5"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ══ CREATE ACCOUNT MODAL ══ */}
        {showAccountForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create Vendor Account</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Everything is pre-configured — the vendor just logs in.</p>
                </div>
                <button onClick={() => { setShowAccountForm(false); setNewAccountCredentials(null); }} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">✕</button>
              </div>

              {newAccountCredentials ? (
                /* ── Success: show credentials ── */
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">✓</div>
                    <div>
                      <div className="font-bold text-green-900">Account created!</div>
                      <div className="text-sm text-green-700">The dashboard is pre-configured and ready. Share these credentials with the vendor.</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Login credentials</p>
                    {[
                      { label: 'Login URL', value: 'https://arubatravelbuddy.com/vendor/login', field: 'url' },
                      { label: 'Email', value: newAccountCredentials.email, field: 'email' },
                      { label: 'Temporary password', value: newAccountCredentials.temp_password || '', field: 'password' },
                    ].map(item => (
                      <div key={item.field} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                        <div>
                          <div className="text-xs text-gray-500 font-medium">{item.label}</div>
                          <div className="text-sm font-mono font-semibold text-gray-900">{item.value}</div>
                        </div>
                        <button
                          onClick={() => copyText(item.value, item.field)}
                          className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors ${copiedField === item.field ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                        >
                          {copiedField === item.field ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const msg = `Aruba Travel Buddy — Vendor Dashboard\n\nLogin URL: https://arubatravelbuddy.com/vendor/login\nEmail: ${newAccountCredentials.email}\nPassword: ${newAccountCredentials.temp_password}\n\nPlease change your password after first login.`;
                        copyText(msg, 'all');
                      }}
                      className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {copiedField === 'all' ? '✓ Copied all' : 'Copy all as message'}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setNewAccountCredentials(null); setAccountFormData({ email: '', business_name: '', entity_type: 'restaurant', entity_id: '', notes: '', open_time: '09:00', close_time: '21:00', interval_minutes: '60', max_guests_per_slot: '20', slot_padding: '0' }); }}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Create another
                    </button>
                    <button
                      onClick={() => { setShowAccountForm(false); setNewAccountCredentials(null); }}
                      className="flex-1 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4a7f] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleCreateAccount} className="p-6 space-y-6">
                  {/* Section 1: Business info */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">Business info</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Business name <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="e.g. Screaming Eagle Beach Bar" value={accountFormData.business_name} onChange={e => setAccountFormData({ ...accountFormData, business_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Business type <span className="text-red-500">*</span></label>
                        <select required value={accountFormData.entity_type} onChange={e => setAccountFormData({ ...accountFormData, entity_type: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50">
                          {ENTITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Entity ID <span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-xs">(UUID from admin listing)</span></label>
                        <input required type="text" placeholder="3f2c1a90-…" value={accountFormData.entity_id} onChange={e => setAccountFormData({ ...accountFormData, entity_id: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Internal notes <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input type="text" placeholder="e.g. Contact: Maria +297 555 1234" value={accountFormData.notes} onChange={e => setAccountFormData({ ...accountFormData, notes: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Login credentials */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">Login credentials</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor email <span className="text-red-500">*</span></label>
                      <input required type="email" placeholder="vendor@business.com" value={accountFormData.email} onChange={e => setAccountFormData({ ...accountFormData, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      <p className="text-xs text-gray-400 mt-1.5">A temporary password will be generated automatically.</p>
                    </div>
                  </div>

                  {/* Section 3: Pre-configure schedule */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1 pb-2 border-b border-gray-100">Pre-configure schedule</h3>
                    <p className="text-xs text-gray-500 mb-3">These become the vendor's default settings. They can change them anytime after logging in.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Opening time</label>
                        <input type="time" value={accountFormData.open_time} onChange={e => setAccountFormData({ ...accountFormData, open_time: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Closing time</label>
                        <input type="time" value={accountFormData.close_time} onChange={e => setAccountFormData({ ...accountFormData, close_time: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Booking interval</label>
                        <select value={accountFormData.interval_minutes} onChange={e => setAccountFormData({ ...accountFormData, interval_minutes: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50">
                          {INTERVAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Max guests per slot</label>
                        <input type="number" min="1" max="500" value={accountFormData.max_guests_per_slot} onChange={e => setAccountFormData({ ...accountFormData, max_guests_per_slot: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => setShowAccountForm(false)} className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
                    <button type="submit" disabled={savingAccount} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow">
                      {savingAccount ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating…</>) : '🔑 Create account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading vendors...</div>
            ) : vendors.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No vendor partners yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Onboard your first vendor
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className={!vendor.is_active ? 'bg-gray-50 opacity-60' : ''}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{vendor.vendor_name}</div>
                        <div className="text-xs text-gray-500">ID: {vendor.vendor_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {vendor.vendor_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {vendor.commission_percent
                          ? `${vendor.commission_percent}%`
                          : vendor.commission_flat
                            ? `$${vendor.commission_flat} flat`
                            : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {vendor.api_key.substring(0, 16)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(vendor.api_key, vendor.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            {copiedKey === vendor.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {vendor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(vendor)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(vendor)}
                            className={`text-sm ${vendor.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {vendor.is_active ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <div>
            {/* Time Range Filter */}
            <div className="flex gap-2 mb-4">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                    }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading commissions...</div>
              ) : commissions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No commission events yet.</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Commissions appear here when vendors confirm bookings via the webhook.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Ref</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {commissions.map((c) => (
                      <tr key={c.id}>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{c.vendor_name}</div>
                          <div className="text-xs text-gray-500">{c.vendor_type}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-700">
                          {c.booking_reference || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {c.booking_amount ? `${c.currency} ${c.booking_amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-700">
                          {c.commission_amount ? `$${c.commission_amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-800'
                            }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Webhook Info Card */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Webhook Integration Info</h3>
          <p className="text-gray-600 text-sm mb-4">
            Share this information with your vendor partners so they can confirm bookings:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Confirm Booking Endpoint</div>
              <code className="text-sm bg-gray-100 px-3 py-1.5 rounded block font-mono text-gray-800">
                POST {typeof window !== 'undefined' ? window.location.origin : ''}/functions/v1/vendor-webhook/booking-confirmed
              </code>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Cancel Booking Endpoint</div>
              <code className="text-sm bg-gray-100 px-3 py-1.5 rounded block font-mono text-gray-800">
                POST {typeof window !== 'undefined' ? window.location.origin : ''}/functions/v1/vendor-webhook/booking-cancelled
              </code>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Required Header</div>
              <code className="text-sm bg-gray-100 px-3 py-1.5 rounded block font-mono text-gray-800">
                x-vendor-api-key: {'<their API key from above>'}
              </code>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">Example Payload</div>
              <pre className="text-sm bg-gray-100 px-3 py-2 rounded font-mono text-gray-800 overflow-x-auto">
                {`{
  "click_id": "atb_...",
  "booking_reference": "ORD-12345",
  "booking_amount": 150.00,
  "currency": "USD"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Onboard / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'Edit Vendor' : 'Onboard New Vendor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vendor_name}
                    onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cool Aruba Tours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Type *</label>
                  <select
                    required
                    value={formData.vendor_type}
                    onChange={(e) => setFormData({ ...formData, vendor_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {VENDOR_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Email Login</label>
                  <input
                    type="email"
                    value={formData.vendor_email}
                    onChange={(e) => setFormData({ ...formData, vendor_email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="info@vendor.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if the vendor does not need access to the Extranet.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Component ID *
                    <span className="text-gray-400 font-normal ml-1">(their record ID in your database)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vendor_id}
                    onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="abc-123 or database UUID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission %</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.commission_percent}
                      onChange={(e) => setFormData({ ...formData, commission_percent: e.target.value, commission_flat: '' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OR Flat Fee ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.commission_flat}
                      onChange={(e) => setFormData({ ...formData, commission_flat: e.target.value, commission_percent: '' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5.00"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null); setGeneratedPassword(null); }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Processing...' : editingId ? 'Update Vendor Settings' : 'Generate Vendor Account'}
                  </button>
                </div>
              </form>

              {/* Account Generation Success Result */}
              {generatedPassword && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-green-800 font-bold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Vendor Login Generated Successfully!
                  </h3>
                  <p className="text-sm text-green-700 mb-3">Please share these credentials securely with the vendor so they can access the Extranet dashboard.</p>
                  <div className="bg-white p-3 rounded border border-green-100 text-sm font-mono space-y-2">
                    <div><span className="text-gray-500 font-sans">Login URL:</span> https://arubatravelbuddy.com/vendor/login</div>
                    <div><span className="text-gray-500 font-sans">Email:</span> {formData.vendor_email}</div>
                    <div><span className="text-gray-500 font-sans">Temporary Password:</span> <span className="font-bold">{generatedPassword}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
