'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { ContactInfoInput } from '@/components/admin/ContactInfoInput';
import { supportLocalsApi } from '@/lib/admin-api';

export default function SupportLocalsPage() {
  return (
    <ContentManagementPage
      contentType="support-locals"
      contentTypeLabel="Support Local"
      api={supportLocalsApi}
      getFields={(item) => ({
        name: item.name,
        description: item.description,
        category: item.category,
        images: item.images || [],
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        contact_info: item.contact_info || {},
        website: item.website,
        featured: item.featured || false,
        active: item.active !== false,
        display_order: item.display_order || 0,
      })}
      getEmptyItem={() => ({
        name: '',
        description: '',
        category: '',
        images: [],
        location: '',
        latitude: null,
        longitude: null,
        contact_info: {},
        website: '',
        featured: false,
        active: true,
        display_order: 0,
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              value={item.website || ''}
              onChange={(e) => setItem({ ...item, website: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ContactInfoInput
            value={item.contact_info || {}}
            onChange={(value) => setItem({ ...item, contact_info: value })}
          />
        </>
      )}
    />
  );
}

