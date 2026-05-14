'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { conciergeHostsApi } from '@/lib/admin-api';

interface ConciergeHost {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  setup_code: string;
  created_at: string;
  concierge_rooms: { count: number }[];
}

export default function ConciergeAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [hosts, setHosts] = useState<ConciergeHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newHostName, setNewHostName] = useState('');
  const [newHostAddress, setNewHostAddress] = useState('');
  const [newHostPhone, setNewHostPhone] = useState('');
  const [newHostEmail, setNewHostEmail] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchHosts();
  }, [isAuthenticated]);

  const fetchHosts = async () => {
    setLoading(true);
    try {
      const res = await conciergeHostsApi.getHosts();
      if (res.success && res.data) {
        setHosts((res.data as any).data || []);
      }
    } catch (e) {
      console.error('Failed to fetch hosts', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newHostName.trim()) return;
    setCreating(true);
    try {
      const res = await conciergeHostsApi.createHost({
        name: newHostName.trim(),
        address: newHostAddress.trim() || undefined,
        phone: newHostPhone.trim() || undefined,
        email: newHostEmail.trim() || undefined,
      });
      if (res.success) {
        setShowCreate(false);
        setNewHostName('');
        setNewHostAddress('');
        setNewHostPhone('');
        setNewHostEmail('');
        await fetchHosts();
      }
    } catch (e) {
      console.error('Failed to create host', e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will remove all rooms, info, and integrations.`)) return;
    try {
      await conciergeHostsApi.deleteHost(id);
      await fetchHosts();
    } catch (e) {
      console.error('Failed to delete host', e);
    }
  };

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d3b4d] to-[#0891b2] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <Link href="/admin" className="text-teal-200 hover:text-white text-sm mb-1 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Concierge Host Management</h1>
            <p className="text-teal-100 text-sm mt-1">Create and manage hotel &amp; Airbnb host profiles for the Concierge tablets.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-white text-[#0d3b4d] px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow"
          >
            + New Host
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Host Modal */}
        {showCreate && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-teal-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Host</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                <input
                  type="text"
                  value={newHostName}
                  onChange={(e) => setNewHostName(e.target.value)}
                  placeholder="e.g. Jeremy Hotel, Palm Beach Villa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newHostAddress}
                  onChange={(e) => setNewHostAddress(e.target.value)}
                  placeholder="e.g. Palm Beach Blvd 12, Aruba"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newHostPhone}
                  onChange={(e) => setNewHostPhone(e.target.value)}
                  placeholder="e.g. +297 555 1234"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  value={newHostEmail}
                  onChange={(e) => setNewHostEmail(e.target.value)}
                  placeholder="e.g. info@jeremyhotel.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                disabled={creating || !newHostName.trim()}
                className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Host'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Hosts List */}
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading hosts...</div>
        ) : hosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Hosts Yet</h2>
            <p className="text-gray-600 mb-6">Create your first hotel or Airbnb host to get started with the Concierge system.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              + Create First Host
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hosts.map((host) => (
              <div key={host.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-[#0d3b4d] to-[#0891b2] p-4">
                  <h3 className="text-lg font-bold text-white">{host.name}</h3>
                  {host.address && <p className="text-teal-100 text-sm mt-1">{host.address}</p>}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${host.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm text-gray-600 capitalize">{host.status}</span>
                    <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                      Code: {host.setup_code}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                    {host.phone && <div>📞 {host.phone}</div>}
                    {host.email && <div>✉️ {host.email}</div>}
                    <div>🛏️ {host.concierge_rooms?.[0]?.count || 0} rooms</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/concierge/${host.id}`}
                      className="flex-1 bg-teal-600 text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Manage →
                    </Link>
                    <button
                      onClick={() => handleDelete(host.id, host.name)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
