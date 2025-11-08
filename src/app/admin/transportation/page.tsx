'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { ContactInfoInput } from '@/components/admin/ContactInfoInput';
import { PricingInfoInput } from '@/components/admin/PricingInfoInput';
import { transportationApi } from '@/lib/admin-api';

export default function TransportationPage() {
  return (
    <ContentManagementPage
      contentType="transportation"
      contentTypeLabel="Transportation"
      api={transportationApi}
      getFields={(item) => ({
        name: item.name,
        description: item.description,
        type: item.type,
        images: item.images || [],
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        contact_info: item.contact_info || {},
        pricing_info: item.pricing_info || {},
        featured: item.featured || false,
        active: item.active !== false,
        display_order: item.display_order || 0,
      })}
      getEmptyItem={() => ({
        name: '',
        description: '',
        type: 'car_rental',
        images: [],
        location: '',
        latitude: null,
        longitude: null,
        contact_info: {},
        pricing_info: {},
        featured: false,
        active: true,
        display_order: 0,
      })}
      renderCustomFields={(item, setItem) => (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={item.type || 'car_rental'}
              onChange={(e) => setItem({ ...item, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="car_rental">Car Rental</option>
              <option value="taxi">Taxi</option>
              <option value="bus">Bus</option>
              <option value="shuttle">Shuttle</option>
              <option value="bike_rental">Bike Rental</option>
              <option value="scooter">Scooter</option>
            </select>
          </div>
          <ContactInfoInput
            value={item.contact_info || {}}
            onChange={(value) => setItem({ ...item, contact_info: value })}
          />
          <PricingInfoInput
            value={item.pricing_info || {}}
            onChange={(value) => setItem({ ...item, pricing_info: value })}
          />
        </>
      )}
    />
  );
}

