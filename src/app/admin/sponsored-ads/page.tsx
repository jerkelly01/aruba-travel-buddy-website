'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { sponsoredAdsApi } from '@/lib/admin-api';
import Link from 'next/link';

interface SponsoredAd {
  id: string;
  ad_slot: number;
  title: string;
  description: string | null;
  cover_image: string;
  destination_url: string;
  sponsor_name: string | null;
  sponsor_logo: string | null;
  duration_months: number;
  start_date: string;
  end_date: string;
  price_per_month: number | null;
  active: boolean;
  display_order: number;
  click_count: number;
  impression_count: number;
  created_at: string;
  updated_at: string;
}

const EMPTY_AD: Omit<SponsoredAd, 'id' | 'end_date' | 'click_count' | 'impression_count' | 'created_at' | 'updated_at'> = {
  ad_slot: 1,
  title: '',
  description: '',
  cover_image: '',
  destination_url: '',
  sponsor_name: '',
  sponsor_logo: '',
  duration_months: 1,
  start_date: new Date().toISOString().split('T')[0],
  price_per_month: null,
  active: true,
  display_order: 0,
};

const SLOT_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800 border-blue-300',
  2: 'bg-purple-100 text-purple-800 border-purple-300',
  3: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  4: 'bg-amber-100 text-amber-800 border-amber-300',
  5: 'bg-rose-100 text-rose-800 border-rose-300',
};

export default function SponsoredAdsPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [ads, setAds] = useState<SponsoredAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({ ...EMPTY_AD });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterSlot, setFilterSlot] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchAds();
  }, [isAuthenticated, filterSlot, filterActive]);

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filterSlot) params.slot = parseInt(filterSlot);
      if (filterActive === 'true') params.active = true;
      if (filterActive === 'false') params.active = false;
      if (searchQuery) params.search = searchQuery;

      const res = await sponsoredAdsApi.getAll(params);
      if (res.success && res.data) {
        setAds(Array.isArray(res.data) ? res.data : (res.data as any)?.items || []);
      } else {
        setError(res.error || 'Failed to fetch ads');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({ ...EMPTY_AD, start_date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ad: SponsoredAd) => {
    setFormData({
      ...ad,
      start_date: ad.start_date ? new Date(ad.start_date).toISOString().split('T')[0] : '',
    });
    setEditingId(ad.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.cover_image || !formData.destination_url) {
      alert('Please fill in Title, Cover Image URL, and Destination URL');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        ad_slot: parseInt(formData.ad_slot) || 1,
        duration_months: parseInt(formData.duration_months) || 1,
        price_per_month: formData.price_per_month ? parseFloat(formData.price_per_month) : null,
        display_order: parseInt(formData.display_order) || 0,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : new Date().toISOString(),
      };
      let res;
      if (editingId) {
        res = await sponsoredAdsApi.update(editingId, payload);
      } else {
        res = await sponsoredAdsApi.create(payload);
      }
      if (res.success) {
        setIsModalOpen(false);
        fetchAds();
      } else {
        alert(res.error || 'Failed to save ad');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsored ad?')) return;
    try {
      const res = await sponsoredAdsApi.delete(id);
      if (res.success) fetchAds();
      else alert(res.error || 'Failed to delete');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const isExpired = (ad: SponsoredAd) => {
    if (!ad.end_date) return false;
    return new Date(ad.end_date) < new Date();
  };

  const daysRemaining = (ad: SponsoredAd) => {
    if (!ad.end_date) return null;
    const diff = new Date(ad.end_date).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="text-gray-400 hover:text-gray-600">
                  ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Sponsored Ads</h1>
              </div>
              <p className="text-gray-600 mt-1">Manage ad placements across 5 slots with custom links, images, and duration</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-200 transition-all"
            >
              + New Ad
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Slot Overview Cards */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((slot) => {
            const slotAds = ads.filter((a) => a.ad_slot === slot && a.active);
            return (
              <div
                key={slot}
                className={`rounded-xl border-2 p-4 text-center transition-all ${
                  slotAds.length > 0
                    ? SLOT_COLORS[slot]
                    : 'bg-gray-50 text-gray-400 border-dashed border-gray-300'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-wider mb-1">Slot {slot}</div>
                <div className="text-2xl font-bold">{slotAds.length}</div>
                <div className="text-xs mt-1">{slotAds.length > 0 ? 'Active' : 'Empty'}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAds()}
            placeholder="Search ads..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterSlot}
            onChange={(e) => setFilterSlot(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Slots</option>
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>Slot {s}</option>
            ))}
          </select>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => { setError(null); fetchAds(); }} className="text-red-800 underline text-sm mt-2">
              Try again
            </button>
          </div>
        )}

        {/* Ad Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading ads...</div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No sponsored ads yet</h3>
            <p className="text-gray-500 mb-6">Create your first ad placement to get started</p>
            <button onClick={handleCreate} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              + Create First Ad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => {
              const expired = isExpired(ad);
              const days = daysRemaining(ad);
              return (
                <div
                  key={ad.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border transition-all hover:shadow-lg ${
                    !ad.active ? 'opacity-60 border-gray-200' : expired ? 'border-red-200' : 'border-gray-100'
                  }`}
                >
                  {/* Cover Image */}
                  <div className="relative h-44 bg-gray-100">
                    {ad.cover_image ? (
                      <img
                        src={ad.cover_image}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="%23e5e7eb" width="400" height="200"/><text fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🖼️</span>
                      </div>
                    )}
                    {/* Slot Badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold border ${SLOT_COLORS[ad.ad_slot] || 'bg-gray-100 text-gray-800'}`}>
                      Slot {ad.ad_slot}
                    </div>
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
                      !ad.active ? 'bg-gray-800 text-gray-200' : expired ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {!ad.active ? 'Inactive' : expired ? 'Expired' : 'Live'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{ad.title}</h3>
                    {ad.sponsor_name && (
                      <p className="text-sm text-gray-500 mb-2">by {ad.sponsor_name}</p>
                    )}
                    {ad.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                    )}

                    {/* Link Preview */}
                    <a
                      href={ad.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 truncate block mb-3"
                    >
                      🔗 {ad.destination_url}
                    </a>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 border-t border-gray-100 pt-3">
                      <span>📅 {ad.duration_months} mo</span>
                      {days !== null && (
                        <span className={days <= 7 ? 'text-red-600 font-semibold' : ''}>
                          {days > 0 ? `${days}d left` : 'Expired'}
                        </span>
                      )}
                      {ad.price_per_month && (
                        <span className="font-semibold text-green-700">${ad.price_per_month}/mo</span>
                      )}
                    </div>

                    {/* Tracking Stats */}
                    <div className="flex gap-4 text-xs text-gray-500 mb-4">
                      <span>👁 {ad.impression_count || 0} views</span>
                      <span>👆 {ad.click_count || 0} clicks</span>
                      {ad.click_count > 0 && ad.impression_count > 0 && (
                        <span className="font-semibold text-indigo-600">
                          {((ad.click_count / ad.impression_count) * 100).toFixed(1)}% CTR
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="flex-1 px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Ad' : 'Create New Ad'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>

              <div className="space-y-5">
                {/* Ad Slot Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Slot Position *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, ad_slot: slot })}
                        className={`py-3 rounded-xl text-center font-bold text-lg transition-all border-2 ${
                          formData.ad_slot === slot
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-105'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select which ad space (1–5) this ad will appear in</p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer Snorkeling Deal"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Brief description of the ad..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.cover_image || ''}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://example.com/ad-banner.jpg"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.cover_image && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-36">
                      <img
                        src={formData.cover_image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Destination URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Destination Link *</label>
                  <input
                    type="url"
                    required
                    value={formData.destination_url || ''}
                    onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                    placeholder="https://partner-site.com/promo"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Where users will go when they click the ad</p>
                </div>

                {/* Sponsor Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sponsor Name</label>
                    <input
                      type="text"
                      value={formData.sponsor_name || ''}
                      onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
                      placeholder="Advertiser name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sponsor Logo URL</label>
                    <input
                      type="url"
                      value={formData.sponsor_logo || ''}
                      onChange={(e) => setFormData({ ...formData, sponsor_logo: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Duration & Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (months) *</label>
                    <select
                      value={formData.duration_months || 1}
                      onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {[1, 2, 3, 6, 12].map((m) => (
                        <option key={m} value={m}>{m} {m === 1 ? 'month' : 'months'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price / Month ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price_per_month || ''}
                      onChange={(e) => setFormData({ ...formData, price_per_month: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Active & Display Order */}
                <div className="flex items-center gap-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2 w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.title || !formData.cover_image || !formData.destination_url}
                    className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-semibold shadow-lg"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Ad' : 'Create Ad'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
