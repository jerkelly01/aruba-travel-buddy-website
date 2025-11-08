'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mapLocationsApi } from '@/lib/admin-api';
import { ImageUrlInput } from '@/components/admin/ImageUrlInput';
import { LocationInput } from '@/components/admin/LocationInput';
import { ContactInfoInput } from '@/components/admin/ContactInfoInput';
import { OperatingHoursInput } from '@/components/admin/OperatingHoursInput';

type MapLocationCategory = 'beach' | 'cultural_spot' | 'natural_wonder' | 'restaurant' | 'local_shop' | 'club_bar' | 'hotel' | 'activity';

const CATEGORIES: { value: MapLocationCategory; label: string }[] = [
  { value: 'beach', label: 'Beaches' },
  { value: 'cultural_spot', label: 'Cultural Spots' },
  { value: 'natural_wonder', label: 'Natural Wonders' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'local_shop', label: 'Local Shops' },
  { value: 'club_bar', label: 'Clubs & Bars' },
  { value: 'hotel', label: 'Hotels' },
  { value: 'activity', label: 'Activities' },
];

interface MapLocation {
  id: string;
  name: string;
  description?: string;
  category: MapLocationCategory;
  images?: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  contact_info?: Record<string, any>;
  opening_hours?: Record<string, any>;
  featured: boolean;
  active: boolean;
  display_order: number;
}

export default function MapLocationsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MapLocationCategory>('beach');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    active: '',
    featured: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLocations();
    }
  }, [isAuthenticated, selectedCategory, filters]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await mapLocationsApi.getAll({
        category: selectedCategory,
        search: filters.search || undefined,
        active: filters.active === 'active' ? true : filters.active === 'inactive' ? false : undefined,
        featured: filters.featured === 'featured' ? true : undefined,
      });
      if (response.success && response.data) {
        // Handle both array response and object with locations property
        const locationsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data as any)?.locations || [];
        setLocations(locationsData);
      }
    } catch (error) {
      console.error('Failed to fetch map locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedLocation(null); // Set to null, modal will initialize with empty item
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEdit = (location: MapLocation) => {
    setSelectedLocation({ ...location });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this map location?')) return;

    try {
      const response = await mapLocationsApi.delete(id);
      if (response.success) {
        fetchLocations();
      } else {
        alert(response.error || 'Failed to delete map location');
      }
    } catch (error) {
      console.error('Failed to delete map location:', error);
      alert('Failed to delete map location');
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Map Locations</h1>
          <p className="text-gray-600">Create and edit locations shown on the explore map.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedCategory === cat.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search locations..."
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
            + New Location
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No locations found for this category.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
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
                  {locations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                        {location.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {location.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {location.address || location.location || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          location.active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.active !== false ? 'Active' : 'Inactive'}
                        </span>
                        {location.featured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(location)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
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
        <MapLocationModal
          location={selectedLocation}
          selectedCategory={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setSelectedLocation(null);
          }}
          onSave={fetchLocations}
        />
      )}
    </div>
  );
}

// Map Location Modal Component (similar to ClientModal)
function MapLocationModal({
  location,
  selectedCategory,
  onClose,
  onSave,
}: {
  location: MapLocation | null;
  selectedCategory: MapLocationCategory;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
    category: location?.category || selectedCategory,
    images: location?.images || [],
    location: location?.location || '',
    latitude: location?.latitude || null,
    longitude: location?.longitude || null,
    address: location?.address || '',
    contact_info: location?.contact_info || {},
    opening_hours: location?.opening_hours || {},
    featured: location?.featured || false,
    active: location?.active !== false,
    display_order: location?.display_order || 0,
  });
  const [saving, setSaving] = useState(false);

  // Update form data when location changes
  useEffect(() => {
    setFormData({
      name: location?.name || '',
      description: location?.description || '',
      category: location?.category || selectedCategory,
      images: location?.images || [],
      location: location?.location || '',
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      address: location?.address || '',
      contact_info: location?.contact_info || {},
      opening_hours: location?.opening_hours || {},
      featured: location?.featured || false,
      active: location?.active !== false,
      display_order: location?.display_order || 0,
    });
  }, [location, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        images: formData.images || [],
        location: formData.location,
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
        address: formData.address,
        contact_info: formData.contact_info || {},
        opening_hours: formData.opening_hours || {},
        featured: formData.featured || false,
        active: formData.active !== false,
        display_order: formData.display_order || 0,
      };

      const response = location
        ? await mapLocationsApi.update(location.id, data)
        : await mapLocationsApi.create(data);

      if (response.success) {
        onSave();
        onClose();
      } else {
        alert(response.error || 'Failed to save map location');
      }
    } catch (error) {
      console.error('Failed to save map location:', error);
      alert('Failed to save map location');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {location ? 'Edit Map Location' : 'Create Map Location'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
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
                placeholder="Enter location name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MapLocationCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <ImageUrlInput
              images={formData.images || []}
              onChange={(images) => setFormData({ ...formData, images })}
            />

            <LocationInput
              location={formData.location}
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={(location, lat, lng) => setFormData({ ...formData, location, latitude: lat, longitude: lng })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                placeholder="Enter full address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <ContactInfoInput
              value={formData.contact_info || {}}
              onChange={(value) => setFormData({ ...formData, contact_info: value })}
            />

            <OperatingHoursInput
              value={formData.opening_hours || {}}
              onChange={(value) => setFormData({ ...formData, opening_hours: value })}
              label="Opening Hours"
            />

            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
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
                disabled={saving || !formData.name}
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

