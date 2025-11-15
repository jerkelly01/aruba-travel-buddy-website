'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { clientProfileApi } from '@/lib/admin-api';

interface ClientProfile {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  photos?: string[];
  category?: string;
  contact_info?: Record<string, any>;
  status: 'active' | 'inactive' | 'pending';
  featured: boolean;
  display_order: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
    }
  }, [isAuthenticated, filters]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientProfileApi.getClients({
        ...filters,
        featured: filters.status === 'featured' ? true : undefined,
      });
      if (response.success && response.data) {
        // Handle both array response and object with clients property
        const clientsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data as any)?.clients || [];
        setClients(clientsData);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEdit = (client: ClientProfile) => {
    setSelectedClient(client);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
      const response = await clientProfileApi.deleteClient(id);
      if (response.success) {
        fetchClients();
      } else {
        alert(response.error || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Failed to delete client:', error);
      alert('Failed to delete client');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
              <p className="text-gray-600">Manage client profiles</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <button
                onClick={handleCreate}
                className="bg-[var(--brand-aruba)] text-white px-4 py-2 rounded-lg hover:bg-[var(--brand-aruba-dark)] transition-colors"
              >
                + Add Client
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search clients..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                placeholder="Filter by category..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              />
            </div>
          </div>
        </div>

        {/* Clients List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading clients...</div>
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No clients found</p>
            <button
              onClick={handleCreate}
              className="bg-[var(--brand-aruba)] text-white px-6 py-2 rounded-lg hover:bg-[var(--brand-aruba-dark)]"
            >
              Create First Client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {client.logo_url && (
                    <img
                      src={client.logo_url}
                      alt={client.name}
                      className="w-16 h-16 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                    {client.featured && (
                      <span className="bg-[var(--brand-sun)] text-white text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {client.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : client.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {client.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <ClientModal
          client={selectedClient}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setSelectedClient(null);
          }}
          onSave={fetchClients}
        />
      )}
    </div>
  );
}

// Client Modal Component
function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: ClientProfile | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    description: client?.description || '',
    logo_url: client?.logo_url || '',
    category: client?.category || '',
    status: client?.status || 'active',
    featured: client?.featured || false,
    display_order: client?.display_order || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = client
        ? await clientProfileApi.updateClient(client.id, formData)
        : await clientProfileApi.createClient(formData);

      if (response.success) {
        onSave();
        onClose();
      } else {
        alert(response.error || 'Failed to save client');
      }
    } catch (error) {
      console.error('Failed to save client:', error);
      alert('Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {client ? 'Edit Client' : 'Create Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-aruba)]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[var(--brand-aruba)] text-white px-6 py-2 rounded-lg hover:bg-[var(--brand-aruba-dark)] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

