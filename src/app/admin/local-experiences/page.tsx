'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { localExperiencesApi } from '@/lib/admin-api';

export default function LocalExperiencesPage() {
  return (
    <ContentManagementPage
      contentType="local-experiences"
      contentTypeLabel="Local Experience"
      api={localExperiencesApi}
      getFields={(item) => ({
        title: item.title,
        description: item.description,
        host_id: item.host_id || null,
        images: item.images || [],
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        price: item.price,
        duration: item.duration,
        category: item.category,
        tags: item.tags || [],
        featured: item.featured || false,
        active: item.active !== false,
        display_order: item.display_order || 0,
      })}
      getEmptyItem={() => ({
        title: '',
        description: '',
        host_id: null,
        images: [],
        location: '',
        latitude: null,
        longitude: null,
        price: '',
        duration: '',
        category: '',
        tags: [],
        featured: false,
        active: true,
        display_order: 0,
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                value={item.price || ''}
                onChange={(e) => setItem({ ...item, price: e.target.value })}
                placeholder="$89"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={item.duration || ''}
                onChange={(e) => setItem({ ...item, duration: e.target.value })}
                placeholder="2.5 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}
    />
  );
}

