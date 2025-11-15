'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { culturalEventsApi } from '@/lib/admin-api';

export default function CulturalEventsPage() {
  return (
    <ContentManagementPage
      contentType="cultural-events"
      contentTypeLabel="Cultural Event"
      api={culturalEventsApi}
      getFields={(item) => ({
        title: item.title,
        description: item.description,
        location: item.location,
        start_date: item.start_date,
        end_date: item.end_date,
        start_time: item.start_time,
        end_time: item.end_time,
        price: item.price,
        category: item.category,
        images: item.images || [],
        featured: item.is_featured || false,
        admin_managed: true,
        code_snippet: item.code_snippet || '',
      })}
      getEmptyItem={() => ({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        price: '',
        category: '',
        images: [],
        is_featured: false,
        admin_managed: true,
        code_snippet: '',
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={item.start_date || ''}
                onChange={(e) => setItem({ ...item, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={item.end_date || ''}
                onChange={(e) => setItem({ ...item, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={item.start_time || ''}
                onChange={(e) => setItem({ ...item, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={item.end_time || ''}
                onChange={(e) => setItem({ ...item, end_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={item.price || ''}
                onChange={(e) => setItem({ ...item, price: parseFloat(e.target.value) || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}
    />
  );
}

