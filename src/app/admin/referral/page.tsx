'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { referralCampaignApi } from '@/lib/admin-api';

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function ReferralCampaignPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [prizes, setPrizes] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [prizeName, setPrizeName] = useState('');
  const [prizeDescription, setPrizeDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prizesRes, entriesRes] = await Promise.all([
        referralCampaignApi.getPrizes(),
        referralCampaignApi.getEntries(selectedMonth),
      ]);
      if (prizesRes.success && prizesRes.data) setPrizes(Array.isArray(prizesRes.data) ? prizesRes.data : []);
      if (entriesRes.success && entriesRes.data) setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);

      const currentPrize = (prizesRes.success && Array.isArray(prizesRes.data))
        ? (prizesRes.data as any[]).find((p: any) => p.month === selectedMonth)
        : null;
      if (currentPrize) {
        setPrizeName(currentPrize.prize_name || '');
        setPrizeDescription(currentPrize.prize_description || '');
      } else {
        setPrizeName('');
        setPrizeDescription('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrize = async () => {
    if (!prizeName.trim()) {
      alert('Prize name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await referralCampaignApi.savePrize({
        month: selectedMonth,
        prize_name: prizeName.trim(),
        prize_description: prizeDescription.trim() || undefined,
      });
      if (res.success) {
        fetchData();
      } else {
        alert(res.error || 'Failed to save');
      }
    } catch (e) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDrawWinner = async () => {
    if (!confirm(`Draw a random winner from ${entries.length} entries for ${selectedMonth}?`)) return;
    setDrawing(true);
    try {
      const res = await referralCampaignApi.drawWinner(selectedMonth);
      if (res.success && res.data) {
        const d = res.data as any;
        alert(`Winner: ${d.winner?.first_name || ''} ${d.winner?.last_name || ''} (${d.winner?.email || d.winner_user_id})`);
        fetchData();
      } else {
        alert((res as any).error || 'Failed to draw');
      }
    } catch (e) {
      alert('Failed to draw winner');
    } finally {
      setDrawing(false);
    }
  };

  const currentPrize = prizes.find((p: any) => p.month === selectedMonth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">← Admin</Link>
            <h1 className="text-2xl font-bold text-gray-900">Referral Campaign</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 mb-6">
          Users refer friends to download the app. Each friend who signs up with their code = 1 entry to win the monthly prize.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prize for {selectedMonth}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prize Name</label>
              <input
                type="text"
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                placeholder="e.g. $100 Aruba Gift Card"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={prizeDescription}
                onChange={(e) => setPrizeDescription(e.target.value)}
                placeholder="Details about the prize"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleSavePrize}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Prize'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Entries for {selectedMonth}</h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                <strong>{entries.length}</strong> entries
                {currentPrize?.winner_user_id && (
                  <span className="ml-2 text-green-600">• Winner drawn</span>
                )}
              </p>
              {entries.length > 0 && !currentPrize?.winner_user_id && (
                <button
                  onClick={handleDrawWinner}
                  disabled={drawing}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 mb-4"
                >
                  {drawing ? 'Drawing...' : 'Draw Winner'}
                </button>
              )}
              {entries.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Referrer ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Code</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.slice(0, 50).map((e: any) => (
                        <tr key={e.id}>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {new Date(e.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm font-mono">{e.referrer_id?.slice(0, 8)}...</td>
                          <td className="px-4 py-2 text-sm font-mono">{e.referral_code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {entries.length > 50 && (
                    <p className="text-sm text-gray-500 mt-2">Showing first 50 of {entries.length}</p>
                  )}
                </div>
              )}
              {entries.length === 0 && !loading && (
                <p className="text-gray-500">No entries yet for this month.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
