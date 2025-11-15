'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { toursApi } from '@/lib/admin-api';

export default function ToursPage() {
  return (
    <ContentManagementPage
      contentType="tours"
      contentTypeLabel="Tour"
      api={toursApi}
      getFields={(item) => ({
        title: item.title,
        description: item.description,
        duration: item.duration,
        price: item.price,
        images: item.images || [],
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        category: item.category,
        tags: item.tags || [],
        featured: item.featured || false,
        active: item.active !== false,
        display_order: item.display_order || 0,
        code_snippet: item.code_snippet || '',
      })}
      getEmptyItem={() => ({
        title: '',
        description: '',
        duration: '',
        price: '',
        images: [],
        location: '',
        latitude: null,
        longitude: null,
        category: '',
        tags: [],
        featured: false,
        active: true,
        display_order: 0,
        code_snippet: '',
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={item.duration || ''}
                onChange={(e) => setItem({ ...item, duration: e.target.value })}
                placeholder="3.5 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                value={item.price || ''}
                onChange={(e) => setItem({ ...item, price: e.target.value })}
                placeholder="$129"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}
    />
  );
}

