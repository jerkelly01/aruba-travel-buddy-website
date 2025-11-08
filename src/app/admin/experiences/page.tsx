'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// Types
interface Experience {
  id: string;
  slug: string;
  title: string;
  duration: string;
  price: string;
  image: string; // path under /public
  tags: string[];
  active: boolean;
}

const LS_KEY = 'experiences';

function emptyExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    duration: '',
    price: '',
    image: '/experiences/utv.svg',
    tags: [],
    active: true,
  };
}

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'e1',
    slug: 'utv-adventure',
    title: 'UTV Off-Road Adventure',
    duration: '3.5 hours',
    price: '$129',
    image: '/experiences/utv.svg',
    tags: ['Thrill', 'Off-road'],
    active: true,
  },
  {
    id: 'e2',
    slug: 'snorkel-cruise',
    title: 'Snorkel Cruise',
    duration: '2.5 hours',
    price: '$89',
    image: '/experiences/snorkel.svg',
    tags: ['Family', 'Water'],
    active: true,
  },
  {
    id: 'e3',
    slug: 'catamaran-sail',
    title: 'Catamaran Sail',
    duration: '2 hours',
    price: '$99',
    image: '/experiences/catamaran.svg',
    tags: ['Sunset', 'Relax'],
    active: true,
  },
  {
    id: 'e4',
    slug: 'airport-transfer',
    title: 'Airport Transfer',
    duration: 'One-way',
    price: '$25',
    image: '/experiences/transfer.svg',
    tags: ['Easy', 'Comfort'],
    active: true,
  },
];

export default function AdminExperiencesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<Experience[]>([]);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState<Experience | null>(null);
  // Note: isSaving state is kept for future async operations
  const [isSaving] = useState(false);

  // Auth guard (page-level)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load from localStorage (or seed defaults)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems(DEFAULT_EXPERIENCES);
        localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_EXPERIENCES));
      }
    } catch (e) {
      console.error('Failed to load experiences:', e);
      setItems(DEFAULT_EXPERIENCES);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      [i.title, i.slug, i.duration, i.price, i.tags.join(' ')].some((v) => v.toLowerCase().includes(q))
    );
  }, [items, filter]);

  const saveAll = (next: Experience[]) => {
    setItems(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save experiences:', e);
    }
  };

  const upsert = (exp: Experience) => {
    const idx = items.findIndex((i) => i.id === exp.id);
    const next = [...items];
    if (idx >= 0) next[idx] = exp; else next.unshift(exp);
    saveAll(next);
    setEditing(null);
  };

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    saveAll(next);
  };

  if (isLoading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600">Loading...</div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Experiences</h1>
          <p className="text-gray-600">Create and edit experiences shown on the website.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search experiences..."
              className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-wave)]"
            />
            <button
              onClick={() => setEditing(emptyExperience())}
              className="px-4 py-2 rounded-lg bg-[var(--brand-wave)] text-white font-semibold hover:bg-[var(--brand-ocean)]"
            >
              + New Experience
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { saveAll(DEFAULT_EXPERIENCES); }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              title="Replace current list with starter data"
            >
              Reset to defaults
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Slug</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tags</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Active</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{exp.title}</div>
                      <div className="text-gray-500">{exp.image}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{exp.slug}</td>
                    <td className="px-4 py-3 text-gray-700">{exp.duration}</td>
                    <td className="px-4 py-3 text-gray-700">{exp.price}</td>
                    <td className="px-4 py-3 text-gray-700">{exp.tags.join(', ')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${exp.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {exp.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditing(exp)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(exp.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Editor Drawer (simple modal) */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{items.find(i => i.id === editing.id) ? 'Edit Experience' : 'New Experience'}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="utv-adventure"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    value={editing.duration}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    placeholder="3.5 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    placeholder="$129"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image path</label>
                  <input
                    value={editing.image}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="/experiences/utv.svg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Place files under <code>/public/experiences</code> and reference with <code>/experiences/...</code>.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    value={editing.tags.join(', ')}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Thrill, Off-road"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={editing.active}
                      onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Active (show on site)
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSaving || !editing.title || !editing.slug}
                  onClick={() => upsert(editing)}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
