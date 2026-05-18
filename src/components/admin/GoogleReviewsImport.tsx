'use client';

import React, { useState } from 'react';
import { adminApi } from '@/lib/admin-api';

interface GoogleReviewsImportProps {
  entityType: string;
  entityId?: string;
  googlePlaceId?: string;
  onPlaceIdChange: (placeId: string) => void;
}

export function GoogleReviewsImport({ 
  entityType, 
  entityId, 
  googlePlaceId = '', 
  onPlaceIdChange 
}: GoogleReviewsImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{success: boolean, message: string} | null>(null);

  const handleImport = async () => {
    if (!entityId || !googlePlaceId) return;
    
    setIsImporting(true);
    setImportResult(null);
    
    try {
      const response = await adminApi.googleReviewsApi.import(entityType, entityId, googlePlaceId);
      if (response && response.success) {
        setImportResult({ success: true, message: response.data?.message || 'Reviews imported successfully!' });
      } else {
        setImportResult({ success: false, message: response?.error || 'Failed to import reviews.' });
      }
    } catch (error: any) {
      setImportResult({ success: false, message: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Google Reviews Integration</h3>
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Place ID
          </label>
          <input
            type="text"
            value={googlePlaceId}
            onChange={(e) => onPlaceIdChange(e.target.value)}
            placeholder="ChIJ..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Find Place ID using the Google Maps Platform Place ID Finder.
          </p>
        </div>
        <button
          onClick={handleImport}
          disabled={!entityId || !googlePlaceId || isImporting}
          className={`px-4 py-2 rounded-lg font-medium text-white ${
            !entityId || !googlePlaceId || isImporting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          type="button"
        >
          {isImporting ? 'Importing...' : 'Import Reviews'}
        </button>
      </div>
      
      {!entityId && googlePlaceId && (
        <p className="text-sm text-amber-600 mt-2">
          Save this item first before you can import reviews.
        </p>
      )}

      {importResult && (
        <div className={`mt-3 p-3 rounded-md text-sm ${importResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {importResult.message}
        </div>
      )}
    </div>
  );
}
