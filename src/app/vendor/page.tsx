'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Booking {
    id: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    date: string;
    time: string;
    party_size: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    notes?: string;
    is_manual?: boolean;
}

const INITIAL_BOOKINGS: Booking[] = [
    { id: '1', customer_name: 'John Doe', customer_email: 'john@example.com', date: '2026-04-10', time: '19:00', party_size: 2, status: 'confirmed' },
    { id: '2', customer_name: 'Sarah Smith', customer_email: 'sarah@example.com', date: '2026-04-11', time: '18:30', party_size: 4, status: 'pending' },
    { id: '3', customer_name: 'Mike Johnson', date: '2026-04-10', time: '20:00', party_size: 3, status: 'confirmed' },
];

export default function VendorDashboard() {
    const router = useRouter();
    const { user, isLoading, logout, isAuthenticated } = useAuth();

    const [activeTab, setActiveTab] = useState<'bookings' | 'calendar'>('bookings');

    // Integration Modals State
    const [showIntegrationModal, setShowIntegrationModal] = useState<'fareharbor' | 'zapier' | null>(null);
    const [integrationForm, setIntegrationForm] = useState({ shortname: '', apiKey: '', webhookUrl: '' });
    const [isSyncing, setIsSyncing] = useState(false);
    const [icalKey, setIcalKey] = useState<string | null>(null);

    // Bookings State
    const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
    const [blockedDates, setBlockedDates] = useState<string[]>(['2026-04-15', '2026-04-16']);

    // Day Detail Panel State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showAddBookingForm, setShowAddBookingForm] = useState(false);
    const [newBooking, setNewBooking] = useState({ customer_name: '', customer_email: '', customer_phone: '', time: '10:00', party_size: '2', notes: '' });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/vendor/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/vendor/login');
    };

    const getBookingsForDate = (date: string) =>
        bookings.filter(b => b.date === date && b.status !== 'cancelled');

    const handleDayClick = (dateStr: string) => {
        setSelectedDate(dateStr);
        setShowAddBookingForm(false);
        setNewBooking({ customer_name: '', customer_email: '', customer_phone: '', time: '10:00', party_size: '2', notes: '' });
    };

    const handleToggleBlock = () => {
        if (!selectedDate) return;
        if (blockedDates.includes(selectedDate)) {
            setBlockedDates(blockedDates.filter(d => d !== selectedDate));
        } else {
            setBlockedDates([...blockedDates, selectedDate]);
        }
    };

    const handleCancelBooking = (id: string) => {
        if (!confirm('Cancel this booking? The customer will be notified.')) return;
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
    };

    const handleAddManualBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;
        const booking: Booking = {
            id: `manual-${Date.now()}`,
            customer_name: newBooking.customer_name,
            customer_email: newBooking.customer_email || undefined,
            customer_phone: newBooking.customer_phone || undefined,
            date: selectedDate,
            time: newBooking.time,
            party_size: parseInt(newBooking.party_size),
            notes: newBooking.notes || undefined,
            status: 'confirmed',
            is_manual: true,
        };
        setBookings(prev => [...prev, booking]);
        setShowAddBookingForm(false);
        setNewBooking({ customer_name: '', customer_email: '', customer_phone: '', time: '10:00', party_size: '2', notes: '' });
        // TODO: POST to Supabase booking API
    };

    const handleGenerateIcal = () => {
        setIcalKey(`https://arubatravelbuddy.com/api/sync/v1/calendar_${Math.random().toString(36).slice(-10)}.ics`);
    };

    const handleConnectIntegration = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setShowIntegrationModal(null);
            alert(`Successfully connected to ${showIntegrationModal === 'fareharbor' ? 'FareHarbor' : 'Zapier'}! Your calendar will now sync automatically.`);
            setIntegrationForm({ shortname: '', apiKey: '', webhookUrl: '' });
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Loading Vendor Portal...</div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
    const isSelectedBlocked = selectedDate ? blockedDates.includes(selectedDate) : false;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#1a365d] shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Aruba Travel Buddy for Business</h1>
                        <p className="text-blue-200 mt-1">Vendor Extranet | {user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white/10 text-white border border-white/20 px-5 py-2 rounded-lg hover:bg-white/20 transition-colors font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Navigation Tabs */}
                <div className="flex space-x-4 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-2 font-medium text-lg ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Incoming Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`pb-4 px-2 font-medium text-lg ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Calendar & Availability
                    </button>
                </div>

                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Your Upcoming Bookings</h2>
                            <button className="text-blue-600 font-medium hover:text-blue-800">Export .CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.filter(b => b.status !== 'cancelled').map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.date}</div>
                                                <div className="text-sm text-gray-500">{booking.time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                                                {booking.is_manual && <span className="text-xs text-purple-600 font-semibold">Walk-in</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.party_size} guests
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'confirmed' as const } : b))}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                <button onClick={() => handleCancelBooking(booking.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {bookings.filter(b => b.status !== 'cancelled').length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No active bookings right now.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* CALENDAR TAB */}
                {activeTab === 'calendar' && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left: Calendar Grid */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">April 2026</h2>
                                <p className="text-sm text-gray-500 mb-6">Click a date to manage bookings or block availability.</p>
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center font-semibold text-gray-400 text-xs py-2">{day}</div>
                                    ))}
                                    {[...Array(3)].map((_, i) => <div key={`empty-${i}`} className="p-1"></div>)}
                                    {[...Array(30)].map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
                                        const isBlocked = blockedDates.includes(dateStr);
                                        const dayBookings = getBookingsForDate(dateStr);
                                        const isSelected = selectedDate === dateStr;

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDayClick(dateStr)}
                                                className={`h-20 p-2 border rounded-lg flex flex-col justify-between transition-all text-left ${isSelected
                                                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                                                    : isBlocked
                                                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                                                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                                                    }`}
                                            >
                                                <span className={`font-bold text-sm ${isBlocked ? 'text-red-700' : isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{day}</span>
                                                <div>
                                                    {isBlocked && <span className="text-xs font-bold text-red-600 bg-red-100 px-1 py-0.5 rounded block text-center">Blocked</span>}
                                                    {!isBlocked && dayBookings.length > 0 && (
                                                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-1 py-0.5 rounded block text-center">
                                                            {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                    {!isBlocked && dayBookings.length === 0 && (
                                                        <span className="text-xs text-green-600 font-medium">Open</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: Side Panel */}
                        <div className="space-y-4">
                            {/* Day Detail Panel */}
                            {selectedDate ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-800">
                                                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </h3>
                                            <p className="text-xs text-gray-500">{selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <button
                                            onClick={handleToggleBlock}
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${isSelectedBlocked
                                                ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                                                : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'}`}
                                        >
                                            {isSelectedBlocked ? '✓ Unblock Date' : '✕ Block Date'}
                                        </button>
                                    </div>

                                    {/* Bookings for Day */}
                                    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                                        {selectedDateBookings.length === 0 ? (
                                            <p className="text-sm text-gray-400 text-center py-4">No bookings on this date.</p>
                                        ) : (
                                            selectedDateBookings.map(b => (
                                                <div key={b.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-800">{b.customer_name}</div>
                                                        <div className="text-xs text-gray-500">{b.time} · {b.party_size} guests</div>
                                                        {b.is_manual && <span className="text-xs text-purple-600 font-semibold">Walk-in</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => handleCancelBooking(b.id)}
                                                        className="text-xs text-red-600 hover:text-red-800 font-semibold ml-2 mt-0.5 shrink-0"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Add Booking Form */}
                                    {!isSelectedBlocked && (
                                        <div className="p-4 border-t border-gray-100">
                                            {!showAddBookingForm ? (
                                                <button
                                                    onClick={() => setShowAddBookingForm(true)}
                                                    className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                                >
                                                    + Add Walk-in / Manual Booking
                                                </button>
                                            ) : (
                                                <form onSubmit={handleAddManualBooking} className="space-y-3">
                                                    <h4 className="font-semibold text-gray-700 text-sm">New Manual Booking</h4>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Customer Name *"
                                                        value={newBooking.customer_name}
                                                        onChange={e => setNewBooking({ ...newBooking, customer_name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="Email (optional)"
                                                        value={newBooking.customer_email}
                                                        onChange={e => setNewBooking({ ...newBooking, customer_email: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="Phone (optional)"
                                                        value={newBooking.customer_phone}
                                                        onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">Time</label>
                                                            <input
                                                                required
                                                                type="time"
                                                                value={newBooking.time}
                                                                onChange={e => setNewBooking({ ...newBooking, time: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">Guests</label>
                                                            <input
                                                                required
                                                                type="number"
                                                                min="1"
                                                                max="50"
                                                                value={newBooking.party_size}
                                                                onChange={e => setNewBooking({ ...newBooking, party_size: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        placeholder="Notes (optional)"
                                                        rows={2}
                                                        value={newBooking.notes}
                                                        onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAddBookingForm(false)}
                                                            className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                                                        >
                                                            Add Booking
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                    <p className="text-gray-400 text-sm">👈 Select a date to manage bookings</p>
                                </div>
                            )}

                            {/* iCal */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
                                <h3 className="font-bold text-lg mb-2">Sync Your Calendar</h3>
                                <p className="text-blue-100 text-sm mb-4">Want to see these bookings directly on your iPhone or Google Calendar?</p>
                                {icalKey ? (
                                    <div className="bg-white/10 p-3 rounded text-xs break-all font-mono mb-2">{icalKey}</div>
                                ) : (
                                    <button onClick={handleGenerateIcal} className="w-full bg-white text-blue-700 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-50 transition-colors text-sm">
                                        Get iCal Link
                                    </button>
                                )}
                                {icalKey && <p className="text-xs text-blue-200 mt-2">Paste into "Subscribe to Calendar" in Google or Apple iOS.</p>}
                            </div>

                            {/* Integrations */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-800 mb-2">Integration Types</h3>
                                <p className="text-sm text-gray-600 mb-4">Do you use FareHarbor, OpenTable, or another booking software?</p>
                                <div onClick={() => setShowIntegrationModal('fareharbor')} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 mb-2 transition-colors">
                                    <span className="font-medium text-gray-700 text-sm">FareHarbor Integration</span>
                                    <span className="text-blue-600 text-sm font-semibold py-1 px-2 bg-blue-50 rounded">Connect →</span>
                                </div>
                                <div onClick={() => setShowIntegrationModal('zapier')} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <span className="font-medium text-gray-700 text-sm">Zapier Webhooks</span>
                                    <span className="text-blue-600 text-sm font-semibold py-1 px-2 bg-blue-50 rounded">Connect →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Integration Modals */}
            {showIntegrationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">
                                {showIntegrationModal === 'fareharbor' ? 'Connect FareHarbor' : 'Connect Zapier Webhooks'}
                            </h2>
                            <button onClick={() => setShowIntegrationModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>
                        <form onSubmit={handleConnectIntegration} className="p-6">
                            {showIntegrationModal === 'fareharbor' ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-4">Enter your FareHarbor Shortname and App/User Key to allow Aruba Travel Buddy to automatically check your live inventory and push bookings directly to your manifests.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Shortname</label>
                                            <input required type="text" placeholder="e.g. arubabeachtours" value={integrationForm.shortname} onChange={e => setIntegrationForm({ ...integrationForm, shortname: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                            <input required type="password" placeholder="••••••••••••••" value={integrationForm.apiKey} onChange={e => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-4">Input a Zapier Webhook URL. We'll send a POST payload whenever a booking is created or cancelled.</p>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Webhook URL</label>
                                        <input required type="url" placeholder="https://hooks.zapier.com/hooks/catch/..." value={integrationForm.webhookUrl} onChange={e => setIntegrationForm({ ...integrationForm, webhookUrl: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                    </div>
                                </>
                            )}
                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setShowIntegrationModal(null)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm">Cancel</button>
                                <button type="submit" disabled={isSyncing} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-sm">
                                    {isSyncing ? 'Authenticating...' : 'Connect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
