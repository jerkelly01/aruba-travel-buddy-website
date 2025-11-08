'use client';

import { useState } from 'react';

interface JsonbInputProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  label: string;
}

export function JsonbInput({ value, onChange, label }: JsonbInputProps) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newText: string) => {
    setText(newText);
    try {
      const parsed = JSON.parse(newText);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  const prettify = () => {
    try {
      const parsed = JSON.parse(text);
      const prettified = JSON.stringify(parsed, null, 2);
      setText(prettified);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Cannot prettify invalid JSON');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={prettify}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Prettify JSON
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">Enter valid JSON format</p>
    </div>
  );
}

