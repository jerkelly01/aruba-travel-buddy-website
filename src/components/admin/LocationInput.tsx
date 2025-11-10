'use client';

import { useState } from 'react';

interface LocationInputProps {
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  onChange: (location: string, latitude: number | null, longitude: number | null) => void;
}

export function LocationInput({ location, latitude, longitude, onChange }: LocationInputProps) {
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [lat, setLat] = useState(latitude?.toString() || '');
  const [lng, setLng] = useState(longitude?.toString() || '');

  const handleLocationChange = (value: string) => {
    onChange(value, latitude ?? null, longitude ?? null);
  };

  const handleCoordinateChange = () => {
    const latNum = lat === '' ? null : parseFloat(lat);
    const lngNum = lng === '' ? null : parseFloat(lng);
    onChange(location || '', latNum, lngNum);
  };

  const openGoogleMaps = () => {
    if (location) {
      const query = encodeURIComponent(location + ', Aruba');
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else {
      window.open('https://www.google.com/maps/@12.5211,-69.9683,12z', '_blank');
    }
  };

  const getCoordinatesFromMaps = () => {
    openGoogleMaps();
    alert('1. Search for your location in Google Maps\n2. Right-click on the location\n3. Click the coordinates to copy them\n4. Paste them below');
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Name / Address
        </label>
        <input
          type="text"
          id="location-name"
          name="location-name"
          autoComplete="address-line1"
          value={location || ''}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder="e.g., Eagle Beach, Aruba or Palm Beach, Oranjestad"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter a location name or address. Coordinates are optional but recommended for map display.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCoordinates(!showCoordinates)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showCoordinates ? 'Hide' : 'Add'} Coordinates (Optional)
        </button>
        {location && (
          <>
            <span className="text-gray-400">•</span>
            <button
              type="button"
              onClick={getCoordinatesFromMaps}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Get from Google Maps
            </button>
          </>
        )}
      </div>

      {showCoordinates && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude (Optional)
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                step="any"
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value);
                  const num = e.target.value === '' ? null : parseFloat(e.target.value);
                  onChange(location || '', num, longitude ?? null);
                }}
                onBlur={handleCoordinateChange}
                placeholder="12.5211"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Longitude (Optional)
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                step="any"
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value);
                  const num = e.target.value === '' ? null : parseFloat(e.target.value);
                  onChange(location || '', latitude ?? null, num);
                }}
                onBlur={handleCoordinateChange}
                placeholder="-69.9683"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          {latitude && longitude && (
            <div>
              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                ✓ View on Google Maps →
              </a>
            </div>
          )}
          <p className="text-xs text-gray-500">
            Tip: Right-click on Google Maps to get coordinates, or leave blank to use location name only.
          </p>
        </div>
      )}
    </div>
  );
}

