'use client';

import { useState, useEffect } from 'react';

interface CoordinateInputProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (latitude: number | null, longitude: number | null) => void;
}

export function CoordinateInput({ latitude, longitude, onChange }: CoordinateInputProps) {
  const [lat, setLat] = useState(latitude?.toString() || '');
  const [lng, setLng] = useState(longitude?.toString() || '');

  useEffect(() => {
    setLat(latitude?.toString() || '');
    setLng(longitude?.toString() || '');
  }, [latitude, longitude]);

  const handleLatChange = (value: string) => {
    setLat(value);
    const num = value === '' ? null : parseFloat(value);
    onChange(num, longitude !== null && longitude !== undefined ? longitude : null);
  };

  const handleLngChange = (value: string) => {
    setLng(value);
    const num = value === '' ? null : parseFloat(value);
    onChange(latitude !== null && latitude !== undefined ? latitude : null, num);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
        <input
          type="number"
          step="any"
          value={lat}
          onChange={(e) => handleLatChange(e.target.value)}
          placeholder="12.5211"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">Range: -90 to 90</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
        <input
          type="number"
          step="any"
          value={lng}
          onChange={(e) => handleLngChange(e.target.value)}
          placeholder="-69.9683"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">Range: -180 to 180</p>
      </div>
      {(latitude !== null && latitude !== undefined) && (longitude !== null && longitude !== undefined) && (
        <div className="col-span-2">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View on Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}

