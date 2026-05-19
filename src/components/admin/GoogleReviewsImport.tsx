'use client';

import React, { useState } from 'react';
import adminApi from '@/lib/admin-api';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    setSearchStatus(null);
    setImportResult(null);
    try {
      const response = await adminApi.googleReviewsApi.searchPlaces(searchTerm);
      console.log('[GoogleReviewsImport] Search response:', response);
      if (response && response.success && response.data) {
        const results = response.data.results || [];
        const debug = response.data.debug;
        setSearchResults(results);
        if (results.length === 0) {
          const debugMsg = debug ? ` (Find Place: ${debug.findPlaceStatus}${debug.findPlaceError ? ' - '+debug.findPlaceError : ''}, Text Search: ${debug.textSearchStatus}${debug.textSearchError ? ' - '+debug.textSearchError : ''})` : '';
          setSearchStatus(`No places found.${debugMsg} Try a different name, or this business may not be searchable via Google API.`);
        }
      } else {
        setSearchStatus(`Search failed: ${response?.error || 'Unknown error. Check the browser console for details.'}`);
      }
    } catch (error: any) {
      console.error('[GoogleReviewsImport] Search error:', error);
      setSearchStatus(`Error: ${error.message || 'Could not connect to search service.'}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (placeId: string) => {
    onPlaceIdChange(placeId);
    setSearchResults([]);
    setSearchTerm('');
  };

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
      <div className="flex flex-col gap-4">
        {/* Search Section */}
        <div className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Find Google Place
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Flying Fishbone Aruba"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-blue-300"
            type="button"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Status / No Results */}
        {searchStatus && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {searchStatus}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {searchResults.map((result, i) => (
              <div key={i} className="p-3 hover:bg-gray-50 flex justify-between items-center gap-4">
                <div>
                  <div className="font-medium text-gray-900">{result.name}</div>
                  <div className="text-xs text-gray-500">{result.address}</div>
                  {result.rating && (
                    <div className="text-xs text-amber-600 mt-1">⭐ {result.rating} ({result.user_ratings_total} reviews)</div>
                  )}
                </div>
                <button
                  onClick={() => handleSelectPlace(result.place_id)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded"
                  type="button"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Manual ID Input & Import */}
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
              Select from search above, or paste Place ID manually.
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
