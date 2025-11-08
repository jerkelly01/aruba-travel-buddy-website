'use client';

interface OperatingHoursInputProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  label?: string;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export function OperatingHoursInput({ value, onChange, label = 'Operating Hours' }: OperatingHoursInputProps) {
  const hours = value || {};

  const updateDay = (day: string, field: 'open' | 'close' | 'closed', val: string) => {
    const dayHours = hours[day] || {};
    if (field === 'closed') {
      onChange({
        ...hours,
        [day]: { closed: val === 'true' },
      });
    } else {
      onChange({
        ...hours,
        [day]: {
          ...dayHours,
          closed: false,
          [field]: val || undefined,
        },
      });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {DAYS.map((day) => {
          const dayHours = hours[day.key] || {};
          const isClosed = dayHours.closed === true;

          return (
            <div key={day.key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-24 text-sm font-medium text-gray-700">{day.label}</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isClosed}
                  onChange={(e) => updateDay(day.key, 'closed', e.target.checked.toString())}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">Closed</span>
              </label>
              {!isClosed && (
                <>
                  <input
                    type="time"
                    value={dayHours.open || ''}
                    onChange={(e) => updateDay(day.key, 'open', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Open"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="time"
                    value={dayHours.close || ''}
                    onChange={(e) => updateDay(day.key, 'close', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Close"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

