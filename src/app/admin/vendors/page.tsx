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
  const [activeTab, setActiveTab] = useState<'vendors' | 'commissions'>('vendors');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Onboard form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_type: 'tour',
    vendor_id: '',
    commission_percent: '',
    commission_flat: '',
  });
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, commissionsRes] = await Promise.all([
        vendorPartnersApi.getAll(),
        vendorPartnersApi.getCommissions(timeRange),
      ]);

      if (vendorsRes.success && vendorsRes.data) {
        setVendors(vendorsRes.data as VendorKey[]);
      }

      if (commissionsRes.success && commissionsRes.data) {
        const data = commissionsRes.data as any;
        setCommissionSummary(data.summary);
        setCommissions(data.commissions || []);
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    } finally {
      setLoading(false);
    }
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
        setShowForm(false);
        setEditingId(null);
        setFormData({ vendor_name: '', vendor_type: 'tour', vendor_id: '', commission_percent: '', commission_flat: '' });
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
      commission_percent: vendor.commission_percent?.toString() || '',
      commission_flat: vendor.commission_flat?.toString() || '',
    });
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
                setFormData({ vendor_name: '', vendor_type: 'tour', vendor_id: '', commission_percent: '', commission_flat: '' });
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Onboard Vendor
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
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'vendors' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'commissions' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Commissions ({commissions.length})
          </button>
        </div>

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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-800'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor ID *
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
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Vendor' : 'Onboard & Generate API Key'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
