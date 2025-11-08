'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ImageUrlInput } from '@/components/admin/ImageUrlInput';
import { LocationInput } from '@/components/admin/LocationInput';
import { JsonbInput } from '@/components/admin/JsonbInput';

interface ContentManagementPageProps {
  contentType: string;
  contentTypeLabel: string;
  api: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, updates: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  getFields: (item: any) => any;
  getEmptyItem: () => any;
  renderCustomFields?: (item: any, setItem: (item: any) => void) => React.ReactNode;
}

export function ContentManagementPage({
  contentType,
  contentTypeLabel,
  api,
  getFields,
  getEmptyItem,
  renderCustomFields,
}: ContentManagementPageProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    active: '',
    featured: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated, filters]);

  // Debug logging for modal
  useEffect(() => {
    if (isModalOpen) {
      const currentItem = selectedItem || getEmptyItem() || {};
      console.log('Modal opened:', {
        isModalOpen,
        isEditing,
        selectedItem,
        currentItem,
        hasCustomFields: !!renderCustomFields,
        getEmptyItemResult: getEmptyItem()
      });
    }
  }, [isModalOpen, isEditing, selectedItem, renderCustomFields, getEmptyItem]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAll({
        search: filters.search || undefined,
        category: filters.category || undefined,
        active: filters.active === 'active' ? true : filters.active === 'inactive' ? false : undefined,
        featured: filters.featured === 'featured' ? true : undefined,
      });
      if (response.success && response.data) {
        setItems(response.data.items || response.data[contentType] || []);
      } else {
        setError(response.error || `Failed to fetch ${contentTypeLabel}`);
      }
    } catch (error) {
      console.error(`Failed to fetch ${contentType}:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${contentTypeLabel}`;
      setError(errorMessage);
      // Error is already handled by apiRequest, but we can show a user-friendly message
      if (errorMessage.includes('backend') || errorMessage.includes('Backend server')) {
        console.warn('Backend connection issue detected. Make sure the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null); // Set to null, modal will initialize with empty item
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem({ ...item });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    setSaving(true);
    try {
      const fields = getFields(selectedItem);
      let response;
      if (isEditing && selectedItem.id) {
        response = await api.update(selectedItem.id, fields);
      } else {
        response = await api.create(fields);
      }

      if (response.success) {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedItem(null);
        fetchItems();
      } else {
        const errorMsg = response.error || `Failed to save ${contentTypeLabel}`;
        console.error('Save error:', response);
        alert(errorMsg);
      }
    } catch (error) {
      console.error(`Failed to save ${contentTypeLabel}:`, error);
      const errorMsg = error instanceof Error ? error.message : `Failed to save ${contentTypeLabel}`;
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${contentTypeLabel}?`)) return;

    try {
      const response = await api.delete(id);
      if (response.success) {
        fetchItems();
      } else {
        const errorMsg = response.error || `Failed to delete ${contentTypeLabel}`;
        console.error('Delete error:', response);
        alert(errorMsg);
      }
    } catch (error) {
      console.error(`Failed to delete ${contentTypeLabel}:`, error);
      const errorMsg = error instanceof Error ? error.message : `Failed to delete ${contentTypeLabel}`;
      alert(errorMsg);
    }
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage {contentTypeLabel}</h1>
          <p className="text-gray-600">Create and edit {contentTypeLabel.toLowerCase()} shown in the app.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder={`Search ${contentTypeLabel.toLowerCase()}...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filters.featured}
            onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="featured">Featured Only</option>
          </select>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            + New {contentTypeLabel}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading {contentTypeLabel.toLowerCase()}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  {error.includes('backend') || error.includes('Backend server') ? (
                    <p className="mt-2">
                      <strong>Solution:</strong> Make sure your backend server is running on port 3000.
                      <br />
                      Run: <code className="bg-red-100 px-1 rounded">cd backend && npm run dev</code>
                    </p>
                  ) : null}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      fetchItems();
                    }}
                    className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : error ? null : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No {contentTypeLabel.toLowerCase()} found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {contentType === 'restaurants' || contentType === 'support-locals' || contentType === 'transportation' ? 'Name' : 'Title'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title || item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.active !== false ? 'Active' : 'Inactive'}
                        </span>
                        {item.featured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ContentModal
          item={selectedItem}
          contentType={contentType}
          contentTypeLabel={contentTypeLabel}
          getEmptyItem={getEmptyItem}
          getFields={getFields}
          renderCustomFields={renderCustomFields}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setSelectedItem(null);
          }}
          onSave={async (data: any) => {
            setSaving(true);
            try {
              console.log('Saving data:', { contentType, contentTypeLabel, data, fields: getFields(data) });
              let response;
              if (isEditing && selectedItem?.id) {
                response = await api.update(selectedItem.id, getFields(data));
              } else {
                response = await api.create(getFields(data));
              }

              console.log('Save response:', response);

              if (response.success) {
                setIsModalOpen(false);
                setIsEditing(false);
                setSelectedItem(null);
                fetchItems();
              } else {
                const errorMsg = response.error || `Failed to save ${contentTypeLabel || contentType}`;
                console.error('Save failed:', { response, contentType, contentTypeLabel });
                alert(errorMsg);
              }
            } catch (error) {
              console.error(`Failed to save ${contentTypeLabel || contentType}:`, error);
              const errorMsg = error instanceof Error ? error.message : `Failed to save ${contentTypeLabel || contentType}`;
              alert(errorMsg);
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

// Separate Modal Component (similar to ClientModal)
function ContentModal({
  item,
  contentType,
  contentTypeLabel,
  getEmptyItem,
  getFields,
  renderCustomFields,
  onClose,
  onSave,
  saving,
}: {
  item: any | null;
  contentType: string;
  contentTypeLabel: string;
  getEmptyItem: () => any;
  getFields: (item: any) => any;
  renderCustomFields?: (item: any, setItem: (item: any) => void) => React.ReactNode;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}) {
  // Initialize form data from item or empty item
  const [formData, setFormData] = useState(() => {
    return item || getEmptyItem() || {};
  });

  // Update form data when item changes
  useEffect(() => {
    setFormData(item || getEmptyItem() || {});
  }, [item, getEmptyItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {item?.id ? `Edit ${contentTypeLabel}` : `Create ${contentTypeLabel}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title/Name */}
            {(contentType === 'restaurants' || contentType === 'support-locals' || contentType === 'transportation') ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData?.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData?.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData?.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={formData?.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Images */}
            <ImageUrlInput
              images={formData?.images || []}
              onChange={(images) => setFormData({ ...formData, images })}
            />

                 {/* Location & Coordinates */}
                 <LocationInput
                   location={formData?.location || ''}
                   latitude={formData?.latitude}
                   longitude={formData?.longitude}
                   onChange={(location, lat, lng) => setFormData({ ...formData, location, latitude: lat, longitude: lng })}
                 />

            {/* Custom Fields */}
            {renderCustomFields && renderCustomFields(formData, setFormData)}

            {/* Tags */}
            {formData?.tags !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)
                  })}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Featured & Active */}
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData?.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData?.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={formData?.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Form Actions */}
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
                disabled={saving || !(formData?.title || formData?.name)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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

