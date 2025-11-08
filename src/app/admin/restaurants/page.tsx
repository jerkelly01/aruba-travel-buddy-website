'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { ContactInfoInput } from '@/components/admin/ContactInfoInput';
import { OperatingHoursInput } from '@/components/admin/OperatingHoursInput';
import { restaurantsApi } from '@/lib/admin-api';

export default function RestaurantsPage() {
  return (
    <ContentManagementPage
      contentType="restaurants"
      contentTypeLabel="Restaurant"
      api={restaurantsApi}
      getFields={(item) => ({
        name: item.name,
        description: item.description,
        cuisine_types: item.cuisine_types || [],
        price_range: item.price_range,
        images: item.images || [],
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        contact_info: item.contact_info || {},
        operating_hours: item.operating_hours || {},
        featured: item.featured || false,
        active: item.active !== false,
        display_order: item.display_order || 0,
      })}
      getEmptyItem={() => ({
        name: '',
        description: '',
        cuisine_types: [],
        price_range: '$$',
        images: [],
        location: '',
        latitude: null,
        longitude: null,
        contact_info: {},
        operating_hours: {},
        featured: false,
        active: true,
        display_order: 0,
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select
              value={item.price_range || '$$'}
              onChange={(e) => setItem({ ...item, price_range: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Expensive</option>
              <option value="$$$$">$$$$ - Very Expensive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Types (comma separated)</label>
            <input
              type="text"
              value={Array.isArray(item.cuisine_types) ? item.cuisine_types.join(', ') : ''}
              onChange={(e) => setItem({
                ...item,
                cuisine_types: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              placeholder="Italian, Seafood, Local"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ContactInfoInput
            value={item.contact_info || {}}
            onChange={(value) => setItem({ ...item, contact_info: value })}
          />
          <OperatingHoursInput
            value={item.operating_hours || {}}
            onChange={(value) => setItem({ ...item, operating_hours: value })}
          />
        </>
      )}
    />
  );
}

