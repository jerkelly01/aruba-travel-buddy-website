'use client';

import { useState } from 'react';

interface VendorCommissionFieldsProps {
  bookingUrl: string;
  commissionPercent: number | null;
  commissionFlat: number | null;
  whatsappNumber?: string;
  promoCode?: string;
  partnerType?: 'commission' | 'advertisement' | 'hybrid';
  monthlyAdFee?: number | null;
  billingEmail?: string;
  apiKey?: string;
  vendorStats?: {
    total_clicks: number;
    total_conversions: number;
    total_commission_earned: number;
  } | null;
  onChange: (fields: {
    booking_url: string;
    commission_percent: number | null;
    commission_flat: number | null;
    whatsapp_number?: string;
    promo_code?: string;
    partner_type?: 'commission' | 'advertisement' | 'hybrid';
    monthly_ad_fee?: number | null;
    billing_email?: string;
  }) => void;
}

export function VendorCommissionFields({
  bookingUrl,
  commissionPercent,
  commissionFlat,
  whatsappNumber,
  promoCode,
  partnerType = 'commission',
  monthlyAdFee,
  billingEmail,
  apiKey,
  vendorStats,
  onChange,
}: VendorCommissionFieldsProps) {
  const [isExpanded, setIsExpanded] = useState(
    !!bookingUrl || !!commissionPercent || !!commissionFlat || !!whatsappNumber || !!promoCode || !!monthlyAdFee
  );
  const [commissionType, setCommissionType] = useState<'percent' | 'flat'>(
    commissionFlat ? 'flat' : 'percent'
  );

  const webhookUrl = typeof window !== 'undefined'
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydycncbqobpljrtknpqd.supabase.co'}/functions/v1/vendor-webhook`
    : '';

  return (
    <div className="border border-blue-200 rounded-xl bg-blue-50/50 my-4 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          <span className="text-sm font-bold text-blue-900">Partner Onboarding, Ads & Commission Setup</span>
          {(bookingUrl || whatsappNumber || monthlyAdFee) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
              Active Partner
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-blue-200">
          <p className="text-xs text-gray-600 mt-3">
            Onboard this vendor listing as a <strong>Commission</strong>, <strong>Advertisement</strong>, or <strong>Hybrid</strong> partner. Set up website redirects, WhatsApp 1-tap booking inquiries, and promo codes.
          </p>

          {/* Partner Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner Agreement Model</label>
            <select
              value={partnerType}
              onChange={(e: any) => onChange({
                booking_url: bookingUrl,
                commission_percent: commissionPercent,
                commission_flat: commissionFlat,
                whatsapp_number: whatsappNumber,
                promo_code: promoCode,
                partner_type: e.target.value,
                monthly_ad_fee: monthlyAdFee,
                billing_email: billingEmail,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-sm"
            >
              <option value="commission">Commission Only (% or Flat Fee per Booking/Lead)</option>
              <option value="advertisement">Advertisement Partner (Fixed Monthly Ad Subscription Fee)</option>
              <option value="hybrid">Hybrid (Both Monthly Ad Fee + Referral Commission)</option>
            </select>
          </div>

          {/* Booking URL & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Website URL</label>
              <input
                type="url"
                value={bookingUrl || ''}
                onChange={(e) => onChange({
                  booking_url: e.target.value,
                  commission_percent: commissionPercent,
                  commission_flat: commissionFlat,
                  whatsapp_number: whatsappNumber,
                  promo_code: promoCode,
                  partner_type: partnerType,
                  monthly_ad_fee: monthlyAdFee,
                  billing_email: billingEmail,
                })}
                placeholder="https://vendor-website.com/book"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Phone Number</label>
              <input
                type="text"
                value={whatsappNumber || ''}
                onChange={(e) => onChange({
                  booking_url: bookingUrl,
                  commission_percent: commissionPercent,
                  commission_flat: commissionFlat,
                  whatsapp_number: e.target.value,
                  promo_code: promoCode,
                  partner_type: partnerType,
                  monthly_ad_fee: monthlyAdFee,
                  billing_email: billingEmail,
                })}
                placeholder="+297 594 1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Promo Code & Billing Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo / Voucher Code</label>
              <input
                type="text"
                value={promoCode || ''}
                onChange={(e) => onChange({
                  booking_url: bookingUrl,
                  commission_percent: commissionPercent,
                  commission_flat: commissionFlat,
                  whatsapp_number: whatsappNumber,
                  promo_code: e.target.value.toUpperCase(),
                  partner_type: partnerType,
                  monthly_ad_fee: monthlyAdFee,
                  billing_email: billingEmail,
                })}
                placeholder="ARUBABUDDY10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono uppercase text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email (For 30-Day Invoices)</label>
              <input
                type="email"
                value={billingEmail || ''}
                onChange={(e) => onChange({
                  booking_url: bookingUrl,
                  commission_percent: commissionPercent,
                  commission_flat: commissionFlat,
                  whatsapp_number: whatsappNumber,
                  promo_code: promoCode,
                  partner_type: partnerType,
                  monthly_ad_fee: monthlyAdFee,
                  billing_email: e.target.value,
                })}
                placeholder="billing@partner.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Monthly Ad Fee (if Advertisement or Hybrid) */}
          {(partnerType === 'advertisement' || partnerType === 'hybrid') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Advertisement Fee ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monthlyAdFee ?? ''}
                onChange={(e) => onChange({
                  booking_url: bookingUrl,
                  commission_percent: commissionPercent,
                  commission_flat: commissionFlat,
                  whatsapp_number: whatsappNumber,
                  promo_code: promoCode,
                  partner_type: partnerType,
                  monthly_ad_fee: e.target.value ? parseFloat(e.target.value) : null,
                  billing_email: billingEmail,
                })}
                placeholder="e.g. 150.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}

          {/* Commission Rate (if Commission or Hybrid) */}
          {(partnerType === 'commission' || partnerType === 'hybrid') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate</label>
              <div className="flex items-center gap-3">
                <select
                  value={commissionType}
                  onChange={(e) => {
                    const type = e.target.value as 'percent' | 'flat';
                    setCommissionType(type);
                    onChange({
                      booking_url: bookingUrl,
                      commission_percent: type === 'percent' ? (commissionPercent || null) : null,
                      commission_flat: type === 'flat' ? (commissionFlat || null) : null,
                      whatsapp_number: whatsappNumber,
                      promo_code: promoCode,
                      partner_type: partnerType,
                      monthly_ad_fee: monthlyAdFee,
                      billing_email: billingEmail,
                    });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Fee ($)</option>
                </select>

                {commissionType === 'percent' ? (
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={commissionPercent ?? ''}
                      onChange={(e) => onChange({
                        booking_url: bookingUrl,
                        commission_percent: e.target.value ? parseFloat(e.target.value) : null,
                        commission_flat: null,
                        whatsapp_number: whatsappNumber,
                        promo_code: promoCode,
                        partner_type: partnerType,
                        monthly_ad_fee: monthlyAdFee,
                        billing_email: billingEmail,
                      })}
                      placeholder="e.g. 10"
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                ) : (
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={commissionFlat ?? ''}
                      onChange={(e) => onChange({
                        booking_url: bookingUrl,
                        commission_percent: null,
                        commission_flat: e.target.value ? parseFloat(e.target.value) : null,
                        whatsapp_number: whatsappNumber,
                        promo_code: promoCode,
                        partner_type: partnerType,
                        monthly_ad_fee: monthlyAdFee,
                        billing_email: billingEmail,
                      })}
                      placeholder="e.g. 25.00"
                      className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Webhook & API Key Info */}
          {apiKey && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Webhook Integration</h4>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 px-3 py-1.5 rounded text-xs font-mono text-gray-700 border">
                    {apiKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    className="px-2 py-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Webhook URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 px-3 py-1.5 rounded text-xs font-mono text-gray-700 border break-all">
                    {webhookUrl}/booking-confirmed
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(`${webhookUrl}/booking-confirmed`)}
                    className="px-2 py-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

