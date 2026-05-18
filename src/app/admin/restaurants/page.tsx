'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { ContactInfoInput } from '@/components/admin/ContactInfoInput';
import { OperatingHoursInput } from '@/components/admin/OperatingHoursInput';
import { VendorCommissionFields } from '@/components/admin/VendorCommissionFields';
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
        category: item.category || '',
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
        code_snippet: item.code_snippet || '',
        booking_url: item.booking_url || '',
        facebook_url: item.facebook_url || '',
        instagram_url: item.instagram_url || '',
        tiktok_url: item.tiktok_url || '',
        commission_percent: item.commission_percent ?? null,
        commission_flat: item.commission_flat ?? null,
      })}
      getEmptyItem={() => ({
        name: '',
        description: '',
        category: '',
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
        code_snippet: '',
        booking_url: '',
        facebook_url: '',
        instagram_url: '',
        tiktok_url: '',
        commission_percent: null,
        commission_flat: null,
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
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={item.facebook_url || ''}
                  onChange={(e) => setItem({ ...item, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={item.instagram_url || ''}
                  onChange={(e) => setItem({ ...item, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                <input
                  type="url"
                  value={item.tiktok_url || ''}
                  onChange={(e) => setItem({ ...item, tiktok_url: e.target.value })}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <VendorCommissionFields
            bookingUrl={item.booking_url || ''}
            commissionPercent={item.commission_percent ?? null}
            commissionFlat={item.commission_flat ?? null}
            apiKey={item.vendor_api_key}
            vendorStats={item.vendor_stats}
            onChange={(fields) => setItem({ ...item, ...fields })}
          />
        </>
      )}
    />
  );
}

