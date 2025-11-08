'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { photoChallengesApi } from '@/lib/admin-api';

export default function PhotoChallengesPage() {
  return (
    <ContentManagementPage
      contentType="photo-challenges"
      contentTypeLabel="Photo Challenge"
      api={photoChallengesApi}
      getFields={(item) => ({
        title: item.title,
        description: item.description,
        images: item.images || [],
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        difficulty: item.difficulty,
        category: item.category,
        featured: item.featured || false,
        active: item.active !== false,
        start_date: item.start_date,
        end_date: item.end_date,
        display_order: item.display_order || 0,
      })}
      getEmptyItem={() => ({
        title: '',
        description: '',
        images: [],
        location: '',
        latitude: null,
        longitude: null,
        difficulty: 'medium',
        category: '',
        featured: false,
        active: true,
        start_date: '',
        end_date: '',
        display_order: 0,
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={item.difficulty || 'medium'}
                onChange={(e) => setItem({ ...item, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={item.category || ''}
                onChange={(e) => setItem({ ...item, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          </div>
        </>
      )}
    />
  );
}

