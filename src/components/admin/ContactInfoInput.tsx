'use client';

interface ContactInfoInputProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

export function ContactInfoInput({ value, onChange }: ContactInfoInputProps) {
  const contactInfo = value || {};

  const updateField = (field: string, val: string) => {
    onChange({
      ...contactInfo,
      [field]: val || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Contact Information
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input
            type="tel"
            id="contact-phone"
            name="contact-phone"
            autoComplete="tel"
            value={contactInfo.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+297 123-4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            id="contact-email"
            name="contact-email"
            autoComplete="email"
            value={contactInfo.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="info@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
          <input
            type="url"
            id="contact-website"
            name="contact-website"
            autoComplete="url"
            value={contactInfo.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
          <input
            type="text"
            id="contact-address"
            name="contact-address"
            autoComplete="street-address"
            value={contactInfo.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Street address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

