'use client';

interface PricingInfoInputProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

export function PricingInfoInput({ value, onChange }: PricingInfoInputProps) {
  const pricing = value || {};

  const updateField = (field: string, val: string) => {
    onChange({
      ...pricing,
      [field]: val || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pricing Information
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Price Range</label>
          <input
            type="text"
            value={pricing.price_range || ''}
            onChange={(e) => updateField('price_range', e.target.value)}
            placeholder="$50-$100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Daily Rate</label>
          <input
            type="text"
            value={pricing.daily_rate || ''}
            onChange={(e) => updateField('daily_rate', e.target.value)}
            placeholder="$75/day"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hourly Rate</label>
          <input
            type="text"
            value={pricing.hourly_rate || ''}
            onChange={(e) => updateField('hourly_rate', e.target.value)}
            placeholder="$25/hour"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
          <input
            type="text"
            value={pricing.currency || ''}
            onChange={(e) => updateField('currency', e.target.value)}
            placeholder="USD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
        <textarea
          value={pricing.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional pricing information..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

