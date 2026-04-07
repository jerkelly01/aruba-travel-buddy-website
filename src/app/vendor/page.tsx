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

interface ScheduleSettings {
    openTime: string;    // "08:00"
    closeTime: string;   // "22:00"
    intervalMinutes: number; // 15 | 30 | 60 | 90 | 120
    maxGuestsPerSlot: number;
    slotPadding: number; // buffer between bookings in minutes
}

const DEFAULT_SCHEDULE: ScheduleSettings = {
    openTime: '09:00',
    closeTime: '21:00',
    intervalMinutes: 60,
    maxGuestsPerSlot: 20,
    slotPadding: 0,
};

const INTERVAL_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

const VENDOR_SCHEDULE_STORAGE_KEY = 'arubaVendorScheduleSettings';

function normalizeSchedule(raw: Partial<ScheduleSettings> | null | undefined): ScheduleSettings {
    const base = { ...DEFAULT_SCHEDULE, ...raw };
    const interval = INTERVAL_OPTIONS.includes(base.intervalMinutes as (typeof INTERVAL_OPTIONS)[number])
        ? base.intervalMinutes
        : DEFAULT_SCHEDULE.intervalMinutes;
    return { ...base, intervalMinutes: interval };
}

function generateTimeSlots(settings: ScheduleSettings): string[] {
    const slots: string[] = [];
    const [openH, openM] = settings.openTime.split(':').map(Number);
    const [closeH, closeM] = settings.closeTime.split(':').map(Number);
    let current = openH * 60 + openM;
    const end = closeH * 60 + closeM;
    while (current < end) {
        const h = Math.floor(current / 60).toString().padStart(2, '0');
        const m = (current % 60).toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        current += settings.intervalMinutes + settings.slotPadding;
    }
    return slots;
}

function formatSlot(time: string, intervalMinutes: number): string {
    const [h, m] = time.split(':').map(Number);
    const end = h * 60 + m + intervalMinutes;
    const endH = Math.floor(end / 60).toString().padStart(2, '0');
    const endM = (end % 60).toString().padStart(2, '0');
    return `${time} – ${endH}:${endM}`;
}

export default function VendorDashboard() {
    const router = useRouter();
    const { user, isLoading, logout, isAuthenticated } = useAuth();

    const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'settings'>('bookings');
    const [showIntegrationModal, setShowIntegrationModal] = useState<'fareharbor' | 'zapier' | null>(null);
    const [integrationForm, setIntegrationForm] = useState({ shortname: '', apiKey: '', webhookUrl: '' });
    const [isSyncing, setIsSyncing] = useState(false);
    const [icalKey, setIcalKey] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
    const [blockedDates, setBlockedDates] = useState<string[]>(['2026-04-15', '2026-04-16']);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showAddBookingForm, setShowAddBookingForm] = useState(false);
    const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

    // Schedule settings
    const [schedule, setSchedule] = useState<ScheduleSettings>(DEFAULT_SCHEDULE);
    const [draftSchedule, setDraftSchedule] = useState<ScheduleSettings>(DEFAULT_SCHEDULE);
    const [scheduleSaved, setScheduleSaved] = useState(false);

    const timeSlots = generateTimeSlots(schedule);
    const [newBooking, setNewBooking] = useState({ customer_name: '', customer_email: '', customer_phone: '', time: timeSlots[0] || '09:00', party_size: '2', notes: '' });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push('/vendor/login');
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(VENDOR_SCHEDULE_STORAGE_KEY) : null;
            if (raw) {
                const parsed = normalizeSchedule(JSON.parse(raw) as Partial<ScheduleSettings>);
                setSchedule(parsed);
                setDraftSchedule(parsed);
            }
        } catch {
            /* ignore corrupt storage */
        }
    }, []);

    useEffect(() => {
        setNewBooking(prev => {
            if (timeSlots.includes(prev.time)) return prev;
            return { ...prev, time: timeSlots[0] || '09:00' };
        });
    }, [schedule]);

    const handleLogout = () => { logout(); router.push('/vendor/login'); };
    const getBookingsForDate = (date: string) => bookings.filter(b => b.date === date && b.status !== 'cancelled');

    const handleDayClick = (dateStr: string) => {
        setSelectedDate(dateStr);
        setShowAddBookingForm(false);
        setNewBooking({ customer_name: '', customer_email: '', customer_phone: '', time: '10:00', party_size: '2', notes: '' });
    };

    const handleToggleBlock = () => {
        if (!selectedDate) return;
        setBlockedDates(prev => prev.includes(selectedDate) ? prev.filter(d => d !== selectedDate) : [...prev, selectedDate]);
    };

    const handleCancelBooking = (id: string) => {
        if (!confirm('Cancel this booking? The customer will be notified.')) return;
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
    };

    const handleConfirmBooking = (id: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' as const } : b));
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
    };

    const handleGenerateIcal = () => setIcalKey(`https://arubatravelbuddy.com/api/sync/v1/cal_${Math.random().toString(36).slice(-12)}.ics`);

    const handleConnectIntegration = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setShowIntegrationModal(null);
            setIntegrationForm({ shortname: '', apiKey: '', webhookUrl: '' });
        }, 1500);
    };

    const handleSaveScheduleSettings = (e: React.FormEvent) => {
        e.preventDefault();
        const next = normalizeSchedule(draftSchedule);
        setSchedule(next);
        setDraftSchedule(next);
        try {
            localStorage.setItem(VENDOR_SCHEDULE_STORAGE_KEY, JSON.stringify(next));
        } catch {
            /* quota / private mode */
        }
        setScheduleSaved(true);
        window.setTimeout(() => setScheduleSaved(false), 3500);
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="text-gray-500 animate-pulse">Loading...</div></div>;
    if (!isAuthenticated) return null;

    const activeBookings = bookings.filter(b => b.status !== 'cancelled');
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
    const isSelectedBlocked = selectedDate ? blockedDates.includes(selectedDate) : false;

    const filteredBookings = activeBookings.filter(b =>
        bookingFilter === 'all' || b.status === bookingFilter
    );

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f2044] to-[#1a365d] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#1a365d] font-black text-base shadow">A</div>
                            <div>
                                <div className="text-white font-bold leading-tight">Aruba Travel Buddy</div>
                                <div className="text-blue-300 text-xs uppercase tracking-widest font-semibold">Vendor Portal</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                                <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xs">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'V'}
                                </div>
                                <div>
                                    <div className="text-white text-sm font-medium leading-tight">{user?.name}</div>
                                    <div className="text-blue-300 text-xs">{user?.email}</div>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/10 text-white/80 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8 py-3 overflow-x-auto">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <span className="text-yellow-600 text-lg">⏳</span>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{pendingCount}</div>
                                <div className="text-xs text-gray-500 font-medium">Pending</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 shrink-0"></div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <span className="text-green-600 text-lg">✓</span>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{confirmedCount}</div>
                                <div className="text-xs text-gray-500 font-medium">Confirmed</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200 shrink-0"></div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <span className="text-red-600 text-lg">🚫</span>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900">{blockedDates.length}</div>
                                <div className="text-xs text-gray-500 font-medium">Blocked Dates</div>
                            </div>
                        </div>
                        {pendingCount > 0 && (
                            <>
                                <div className="w-px h-8 bg-gray-200 shrink-0"></div>
                                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 shrink-0">
                                    <span className="text-yellow-700 text-sm font-semibold">⚠ {pendingCount} booking{pendingCount > 1 ? 's' : ''} need your confirmation</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit mb-6">
                    {(['bookings', 'calendar', 'settings'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                if (tab === 'settings') setDraftSchedule(schedule);
                                setActiveTab(tab);
                            }}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab
                                ? 'bg-[#1a365d] text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'bookings' ? '📋 Bookings' : tab === 'calendar' ? '📅 Calendar' : '⚙️ Settings'}
                        </button>
                    ))}
                </div>

                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">All Bookings</h2>
                                <p className="text-sm text-gray-500">{activeBookings.length} active booking{activeBookings.length !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="flex gap-2">
                                {(['all', 'pending', 'confirmed'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setBookingFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${bookingFilter === f
                                            ? 'bg-[#1a365d] text-white border-transparent'
                                            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {f} {f === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-gray-500 font-medium">No bookings found</p>
                                <p className="text-sm text-gray-400 mt-1">Switch to the Calendar tab to add one manually</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredBookings.map(booking => (
                                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">{booking.date}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">{booking.time}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">{booking.customer_name}</div>
                                                    {booking.customer_email && <div className="text-xs text-gray-400">{booking.customer_email}</div>}
                                                    {booking.is_manual && <span className="inline-block mt-1 text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">Walk-in</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700 font-medium">{booking.party_size}</span>
                                                    <span className="text-xs text-gray-400 ml-1">guests</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                        {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {booking.status === 'pending' && (
                                                            <button onClick={() => handleConfirmBooking(booking.id)} className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors">
                                                                ✓ Confirm
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleCancelBooking(booking.id)} className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* CALENDAR TAB */}
                {activeTab === 'calendar' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Calendar */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">April 2026</h2>
                                    <p className="text-sm text-gray-400">Click any date to view or add bookings</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block"></span>Selected</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block"></span>Blocked</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>Has bookings</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center text-xs font-semibold text-gray-400 pb-2">{day}</div>
                                ))}
                                {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}
                                {[...Array(30)].map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
                                    const isBlocked = blockedDates.includes(dateStr);
                                    const dayBookings = getBookingsForDate(dateStr);
                                    const isSelected = selectedDate === dateStr;
                                    const hasPending = dayBookings.some(b => b.status === 'pending');

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => handleDayClick(dateStr)}
                                            className={`h-16 p-2 border rounded-xl flex flex-col items-center justify-between transition-all text-center relative ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-sm'
                                                : isBlocked ? 'bg-red-50 border-red-200 hover:bg-red-100'
                                                    : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30'
                                                }`}
                                        >
                                            {hasPending && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>}
                                            <span className={`font-bold text-sm ${isBlocked ? 'text-red-600' : isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{day}</span>
                                            {isBlocked && <span className="text-xs text-red-500 font-medium">Closed</span>}
                                            {!isBlocked && dayBookings.length > 0 && (
                                                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{dayBookings.length}</span>
                                            )}
                                            {!isBlocked && dayBookings.length === 0 && <span className="text-xs text-gray-300">—</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-4">
                            {/* Day Detail Panel */}
                            {selectedDate ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base">
                                                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {selectedDateBookings.length} booking{selectedDateBookings.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleToggleBlock}
                                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors shrink-0 ${isSelectedBlocked
                                                    ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                                                    : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                                                    }`}
                                            >
                                                {isSelectedBlocked ? '✓ Unblock' : '🚫 Block'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2 max-h-56 overflow-y-auto">
                                        {selectedDateBookings.length === 0 ? (
                                            <div className="text-center py-6">
                                                <p className="text-sm text-gray-400">No bookings on this date</p>
                                            </div>
                                        ) : (
                                            selectedDateBookings.map(b => (
                                                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-sm text-gray-800 truncate">{b.customer_name}</div>
                                                        <div className="text-xs text-gray-400">{b.time} · {b.party_size} guests</div>
                                                        {b.is_manual && <span className="text-xs text-purple-600 font-semibold">Walk-in</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => handleCancelBooking(b.id)}
                                                        className="text-xs text-red-600 hover:text-red-800 font-semibold ml-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 px-2 py-1 rounded-lg border border-red-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {!isSelectedBlocked && (
                                        <div className="p-4 border-t border-gray-100">
                                            {!showAddBookingForm ? (
                                                <button
                                                    onClick={() => setShowAddBookingForm(true)}
                                                    className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                >
                                                    + Add Walk-in Booking
                                                </button>
                                            ) : (
                                                <form onSubmit={handleAddManualBooking} className="space-y-3">
                                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">New Manual Booking</p>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Customer Name *"
                                                        value={newBooking.customer_name}
                                                        onChange={e => setNewBooking({ ...newBooking, customer_name: e.target.value })}
                                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="Email (optional)"
                                                        value={newBooking.customer_email}
                                                        onChange={e => setNewBooking({ ...newBooking, customer_email: e.target.value })}
                                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="Phone (optional)"
                                                        value={newBooking.customer_phone}
                                                        onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })}
                                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1 font-medium">Time</label>
                                                            <select
                                                                value={newBooking.time}
                                                                onChange={e => setNewBooking({ ...newBooking, time: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                                            >
                                                                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1 font-medium">Guests</label>
                                                            <input
                                                                required
                                                                type="number"
                                                                min="1"
                                                                max="50"
                                                                value={newBooking.party_size}
                                                                onChange={e => setNewBooking({ ...newBooking, party_size: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                                            />
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        placeholder="Notes (optional)"
                                                        rows={2}
                                                        value={newBooking.notes}
                                                        onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })}
                                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => setShowAddBookingForm(false)} className="flex-1 py-2.5 text-gray-600 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200">Cancel</button>
                                                        <button type="submit" className="flex-1 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4a7f] shadow-sm">Add Booking</button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                                    <div className="text-4xl mb-3">👈</div>
                                    <p className="text-sm font-medium text-gray-500">Select a date to view<br />or manage bookings</p>
                                </div>
                            )}

                            {/* iCal Card */}
                            <div className="bg-gradient-to-br from-[#0f2044] to-[#2a5298] rounded-2xl shadow-md p-5 text-white">
                                <h3 className="font-bold text-base mb-1.5">📲 Sync Your Calendar</h3>
                                <p className="text-blue-200 text-sm mb-4">See bookings in your iPhone or Google Calendar automatically.</p>
                                {icalKey ? (
                                    <>
                                        <div className="bg-white/10 p-3 rounded-xl text-xs break-all font-mono text-blue-100 mb-2">{icalKey}</div>
                                        <p className="text-xs text-blue-300">Paste into "Subscribe to Calendar" in Google or Apple iOS.</p>
                                    </>
                                ) : (
                                    <button onClick={handleGenerateIcal} className="w-full bg-white text-[#1a365d] font-bold py-2.5 px-4 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-sm">
                                        Generate iCal Link
                                    </button>
                                )}
                            </div>

                            {/* Integrations Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h3 className="font-bold text-gray-800 mb-1">🔗 Connect Your System</h3>
                                <p className="text-sm text-gray-500 mb-4">Already using booking software? Connect it here.</p>
                                <div className="space-y-2">
                                    <button onClick={() => setShowIntegrationModal('fareharbor')} className="w-full flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-base">🎡</div>
                                            <span className="font-semibold text-gray-700 text-sm">FareHarbor</span>
                                        </div>
                                        <span className="text-blue-600 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Connect →</span>
                                    </button>
                                    <button onClick={() => setShowIntegrationModal('zapier')} className="w-full flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-base">⚡</div>
                                            <span className="font-semibold text-gray-700 text-sm">Zapier Webhooks</span>
                                        </div>
                                        <span className="text-blue-600 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Connect →</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <form onSubmit={handleSaveScheduleSettings} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Schedule settings</h2>
                                <p className="text-sm text-gray-500 mt-1">Control how time slots appear when you add bookings on the calendar.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label htmlFor="interval" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Booking slot interval
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">Length of each bookable block (for example, 30 minutes for quick turns or 60 minutes for seatings).</p>
                                    <select
                                        id="interval"
                                        value={draftSchedule.intervalMinutes}
                                        onChange={e =>
                                            setDraftSchedule({
                                                ...draftSchedule,
                                                intervalMinutes: Number(e.target.value),
                                            })
                                        }
                                        className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                    >
                                        {INTERVAL_OPTIONS.map(m => (
                                            <option key={m} value={m}>
                                                {m} minutes
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="openTime" className="block text-sm font-semibold text-gray-800 mb-2">Opens</label>
                                        <input
                                            id="openTime"
                                            type="time"
                                            value={draftSchedule.openTime}
                                            onChange={e => setDraftSchedule({ ...draftSchedule, openTime: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="closeTime" className="block text-sm font-semibold text-gray-800 mb-2">Closes</label>
                                        <input
                                            id="closeTime"
                                            type="time"
                                            value={draftSchedule.closeTime}
                                            onChange={e => setDraftSchedule({ ...draftSchedule, closeTime: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">Preview: </span>
                                    {generateTimeSlots(normalizeSchedule(draftSchedule)).slice(0, 6).join(', ')}
                                    {generateTimeSlots(normalizeSchedule(draftSchedule)).length > 6 ? ' …' : ''}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                {scheduleSaved && (
                                    <span className="text-sm font-semibold text-green-700">Settings saved.</span>
                                )}
                                <button
                                    type="submit"
                                    className="sm:ml-auto px-6 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4a7f] shadow-sm transition-colors"
                                >
                                    Save settings
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="pb-8" />
            </div>

            {/* Integration Modals */}
            {showIntegrationModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${showIntegrationModal === 'fareharbor' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                                    {showIntegrationModal === 'fareharbor' ? '🎡' : '⚡'}
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {showIntegrationModal === 'fareharbor' ? 'Connect FareHarbor' : 'Connect Zapier'}
                                </h2>
                            </div>
                            <button onClick={() => setShowIntegrationModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleConnectIntegration} className="p-6">
                            {showIntegrationModal === 'fareharbor' ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-5 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                        Enter your FareHarbor credentials and we'll automatically check your live inventory and push bookings directly to your FareHarbor manifests.
                                    </p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Shortname</label>
                                            <input required type="text" placeholder="e.g. arubabeachtours" value={integrationForm.shortname} onChange={e => setIntegrationForm({ ...integrationForm, shortname: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
                                            <input required type="password" placeholder="Paste your FareHarbor API key" value={integrationForm.apiKey} onChange={e => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-5 bg-yellow-50 border border-yellow-100 p-3 rounded-xl">
                                        We'll send a POST request to your Zapier Webhook URL whenever a booking is created, confirmed, or cancelled.
                                    </p>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Zapier Webhook URL</label>
                                        <input required type="url" placeholder="https://hooks.zapier.com/hooks/catch/..." value={integrationForm.webhookUrl} onChange={e => setIntegrationForm({ ...integrationForm, webhookUrl: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" />
                                    </div>
                                </>
                            )}
                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setShowIntegrationModal(null)} className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold text-sm">Cancel</button>
                                <button type="submit" disabled={isSyncing} className="flex-1 bg-[#1a365d] text-white px-4 py-3 rounded-xl hover:bg-[#2a4a7f] transition-colors disabled:opacity-50 font-semibold text-sm shadow-sm flex items-center justify-center gap-2">
                                    {isSyncing ? (
                                        <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Connecting...</>
                                    ) : 'Connect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
