'use client';

import { ContentManagementPage } from '@/components/admin/ContentManagementPage';
import { VendorCommissionFields } from '@/components/admin/VendorCommissionFields';
import { GoogleReviewsImport } from '@/components/admin/GoogleReviewsImport';
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
        booking_url: item.booking_url || '',
        facebook_url: item.facebook_url || '',
        instagram_url: item.instagram_url || '',
        tiktok_url: item.tiktok_url || '',
        commission_percent: item.commission_percent ?? null,
        commission_flat: item.commission_flat ?? null,
        whatsapp_number: item.whatsapp_number || '',
        promo_code: item.promo_code || '',
        partner_type: item.partner_type || 'commission',
        monthly_ad_fee: item.monthly_ad_fee ?? null,
        billing_email: item.billing_email || '',
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
        booking_url: '',
        facebook_url: '',
        instagram_url: '',
        tiktok_url: '',
        commission_percent: null,
        commission_flat: null,
        whatsapp_number: '',
        promo_code: '',
        partner_type: 'commission',
        monthly_ad_fee: null,
        billing_email: '',
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
          <GoogleReviewsImport
            entityType="tour"
            entityId={item.id}
            googlePlaceId={item.google_place_id}
            onPlaceIdChange={(placeId) => setItem({ ...item, google_place_id: placeId })}
          />
          <VendorCommissionFields
            bookingUrl={item.booking_url || ''}
            commissionPercent={item.commission_percent ?? null}
            commissionFlat={item.commission_flat ?? null}
            whatsappNumber={item.whatsapp_number || ''}
            promoCode={item.promo_code || ''}
            partnerType={item.partner_type || 'commission'}
            monthlyAdFee={item.monthly_ad_fee ?? null}
            billingEmail={item.billing_email || ''}
            apiKey={item.vendor_api_key}
            vendorStats={item.vendor_stats}
            onChange={(fields) => setItem({ ...item, ...fields })}
          />
        </>
      )}
    />
  );
}

