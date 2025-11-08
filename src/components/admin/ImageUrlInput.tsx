'use client';

import { useState } from 'react';

interface ImageUrlInputProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export function ImageUrlInput({ images, onChange, label = 'Images' }: ImageUrlInputProps) {
  const [newUrl, setNewUrl] = useState('');

  const addImage = () => {
    if (newUrl.trim() && isValidUrl(newUrl.trim())) {
      onChange([...images, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {images.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 p-2 border border-gray-300 rounded bg-gray-50">
              {isValidUrl(url) && (
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="flex-1 text-sm text-gray-700 truncate">{url}</span>
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <button
            type="button"
            onClick={addImage}
            disabled={!newUrl.trim() || !isValidUrl(newUrl.trim())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

