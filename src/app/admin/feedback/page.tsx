'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { feedbackApi } from '@/lib/admin-api';

interface Feedback {
  id: string;
  user_id: string | null;
  feedback_type: 'general' | 'bug' | 'feature' | 'compliment' | 'taxi';
  rating: number | null;
  title: string | null;
  message: string;
  contact_info: string | null;
  metadata: Record<string, any>;
  status: 'new' | 'read' | 'in_progress' | 'resolved' | 'closed';
  admin_notes: string | null;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface FeedbackStats {
  total: number;
  byType: {
    general: number;
    bug: number;
    feature: number;
    compliment: number;
    taxi: number;
  };
  byStatus: {
    new: number;
    read: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  recent: number;
}

export default function FeedbackPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [adminNotes, setAdminNotes] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedback();
      fetchStats();
    }
  }, [isAuthenticated, filters, pagination.page]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await feedbackApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type as any,
        status: filters.status as any,
        search: filters.search || undefined,
      });
      if (response.success && response.data) {
        const data = response.data as any;
        setFeedback(data.feedback || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await feedbackApi.getStats();
      if (response.success && response.data) {
        setStats(response.data as FeedbackStats);
      }
    } catch (error) {
      console.error('Failed to fetch feedback stats:', error);
    }
  };

  const handleView = async (feedbackItem: Feedback) => {
    try {
      const response = await feedbackApi.getById(feedbackItem.id);
      if (response.success && response.data) {
        const data = response.data as any;
        setSelectedFeedback(data.feedback);
        setAdminNotes(data.feedback?.admin_notes || '');
        setStatusUpdate(data.feedback?.status || 'new');
        setIsModalOpen(true);
        
        // Mark as read if status is new
        if (data.feedback?.status === 'new') {
          await feedbackApi.update(data.feedback.id, { status: 'read' });
          fetchFeedback();
          fetchStats();
        }
      }
    } catch (error) {
      console.error('Failed to fetch feedback details:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFeedback) return;

    try {
      const updates: any = {};
      if (statusUpdate !== selectedFeedback.status) {
        updates.status = statusUpdate;
      }
      if (adminNotes !== (selectedFeedback.admin_notes || '')) {
        updates.admin_notes = adminNotes;
      }

      if (Object.keys(updates).length > 0) {
        const response = await feedbackApi.update(selectedFeedback.id, updates);
        if (response.success) {
          setIsModalOpen(false);
          fetchFeedback();
          fetchStats();
        } else {
          alert(response.error || 'Failed to update feedback');
        }
      } else {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update feedback:', error);
      alert('Failed to update feedback');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-purple-100 text-purple-800';
      case 'compliment':
        return 'bg-green-100 text-green-800';
      case 'taxi':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/admin" className="text-[var(--brand-aruba)] hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
            <p className="text-gray-600">View and manage user feedback</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total Feedback</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">New Feedback</div>
              <div className="text-2xl font-bold text-blue-600">{stats.byStatus.new}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">This Week</div>
              <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Resolved</div>
              <div className="text-2xl font-bold text-purple-600">{stats.byStatus.resolved}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters({ ...filters, type: e.target.value });
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="compliment">Compliment</option>
                <option value="taxi">Taxi Review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPagination({ ...pagination, page: 1 });
                }}
                placeholder="Search feedback..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ type: '', status: '', search: '' });
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading feedback...</div>
          </div>
        ) : feedback.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-600">No feedback found</div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title / Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedback.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.feedback_type)}`}>
                          {item.feedback_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title || 'No Title'}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.users ? (
                          <div className="text-sm text-gray-900">
                            {item.users.first_name} {item.users.last_name}
                            <div className="text-xs text-gray-500">{item.users.email}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Anonymous</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.rating ? (
                          <div className="text-sm text-gray-900">
                            {item.rating}/5 ⭐
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleView(item)}
                          className="text-[var(--brand-aruba)] hover:text-[var(--brand-aruba-dark)]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Feedback Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedFeedback.feedback_type)}`}>
                    {selectedFeedback.feedback_type}
                  </span>
                </div>

                {selectedFeedback.title && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <div className="text-gray-900">{selectedFeedback.title}</div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedFeedback.message}
                  </div>
                </div>

                {selectedFeedback.users && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <div className="text-gray-900">
                      {selectedFeedback.users.first_name} {selectedFeedback.users.last_name}
                      <div className="text-sm text-gray-500">{selectedFeedback.users.email}</div>
                    </div>
                  </div>
                )}

                {selectedFeedback.rating && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="text-gray-900">{selectedFeedback.rating}/5 ⭐</div>
                  </div>
                )}

                {selectedFeedback.contact_info && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                    <div className="text-gray-900">{selectedFeedback.contact_info}</div>
                  </div>
                )}

                {selectedFeedback.feedback_type === 'taxi' && selectedFeedback.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxi Review Details</label>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <pre className="whitespace-pre-wrap text-gray-900">
                        {JSON.stringify(selectedFeedback.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Add notes about this feedback..."
                  />
                </div>

                <div className="text-sm text-gray-500">
                  Submitted: {new Date(selectedFeedback.created_at).toLocaleString()}
                  {selectedFeedback.updated_at !== selectedFeedback.created_at && (
                    <div>Updated: {new Date(selectedFeedback.updated_at).toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[var(--brand-aruba)] text-white rounded-lg hover:bg-[var(--brand-aruba-dark)]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









